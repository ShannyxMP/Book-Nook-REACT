import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 3000;
const baseURL = "https://openlibrary.org/"; // Base URL for Open Library API
const currentYear = new Date().getFullYear(); // For copyright in footer section and stats

env.config(); // Load environment variables

// Configure PostgreSQL client
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

// Middlewares
app.use(express.static("public")); // For static assets (CSS, JS, images)
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded forms

// Sample of book and review objects
let books = [
  {
    id: 1, // SERIAL PRIMARY KEY
    title: "City of thieves", // VARCHAR(100)
    author: "David Benioff", //VARCHAR(100)
    book_cover: "https://covers.openlibrary.org/b/isbn/9780452295292.jpg", // VARCHAR(255)
    isbn: "9780452295292", // VARCHAR(15) UNIQUE NOT NULL, CHECK (char_length(ISBN) = 10 OR char_length(ISBN) = 13)
    ol_link: "https://openlibrary.org/isbn/9780452295292", // VARCHAR(255)
  },
];

let reviews = [
  {
    id: 1, // SERIAL PRIMARY KEY
    rating: 4, // NOT NULL, CHECK (rating >= 0 AND rating <=5)
    review: "Featured in the The Last of Us Part II game. It was interesting.", // TEXT
    book_isbn: "9780452295292", // VARCHAR(13)
    date_created: "2025-06-22", // DATE NOT NULL DEFAULT CURRENT_DATE
  },
];

let entries = []; // Includes book and review data for rendering
let sorting = "reviews.date_created DESC"; // Default sorting for homepage entries

// Fetches all reviews and corresponding book from database
async function obtainBookReviews() {
  try {
    const result = await db.query(
      `SELECT reviews.id AS review_id, books.title, books.author, books.book_cover, books.ol_link, reviews.rating, reviews.review, reviews.book_isbn, reviews.date_created FROM books JOIN reviews ON books.isbn = reviews.book_isbn ORDER BY ${sorting}`
    );

    if (result.rows.length > 0) {
      // console.log("Results: ", result.rows);
      entries = []; // To ensure there are no double-ups
      result.rows.forEach((entry) => {
        entries.push(entry);
      });
    } else {
      console.log("No reviews found.");
    }
  } catch (error) {
    console.error("Error details: ", error.message);
  }
}

// View homepage
app.get("/", async (req, res) => {
  let booksReadTotal;
  let booksReadThisYear;

  // Count books for stats
  try {
    await obtainBookReviews();
    // console.log(entries);

    // Count books reviewed since 01/01 of current year
    const result = await db.query(
      `SELECT * FROM books JOIN reviews ON books.isbn = reviews.book_isbn WHERE date_created >= '${currentYear}-01-01'`
    );
    // console.log("Total Books: ", entries.length);
    // console.log("Books this Year: ", result.rows.length);

    booksReadTotal = entries.length;
    booksReadThisYear = result.rows.length;
  } catch (error) {
    console.error("Error: ", error.message);
  }

  res.render("index.ejs", {
    listOfEntries: entries,
    bookCountTotal: booksReadTotal,
    bookCountYear: booksReadThisYear,
    year: currentYear,
  });
});

// Update sorting preference when user clicks sort button and list
app.post("/sort", (req, res) => {
  // console.log(req.body);
  sorting = req.body.sortBy;
  res.redirect("/");
});

// View add-entry page with ISBN form and empty preview pane
app.get("/add-entry", async (req, res) => {
  res.render("add-entry.ejs", { entryToAdd: null, year: currentYear });
});

// Re-render add-entry page once data fetched from API and show in preview
app.post("/fetch-new-entry", async (req, res) => {
  let isbn = req.body.isbn;

  isbn = isbn.replaceAll("-", ""); // Removes all hyphens
  const isValidISBN = /^[0-9]{10}([0-9]{3})?$/.test(isbn);
  // console.log(`ISBN: ${isbn}, Is it a valid input? ${isValidISBN}`);

  if (isValidISBN) {
    try {
      const result = await axios.get(`${baseURL}/isbn/${isbn}.json`);

      const bookDetails = {
        title: result.data.title,
        author: result.data.by_statement,
        book_cover: `https://covers.openlibrary.org/b/isbn/${result.data.isbn_13}.jpg`,
        isbn: result.data.isbn_13[0],
        ol_link: `https://openlibrary.org/isbn/${result.data.isbn_13}`,
      };
      // console.log(bookDetails);

      res.render("add-entry.ejs", {
        entryToAdd: bookDetails,
        year: currentYear,
      });
    } catch (error) {
      console.error("Error details: ", error.message);
    }
  } else {
    res
      .status(400)
      .send(
        "Invalid ISBN. Must be 10 or 13 digits. Hyphenated format is allowed."
      );
  }
});

// After submitting new entry, redirect to homepage
app.post("/post-new-entry", async (req, res) => {
  const {
    bookTitle: title,
    author,
    bookCover: book_cover,
    bookISBN: isbn,
    bookOLlink: ol_link,
    rating,
    review,
  } = req.body;
  // console.log({ title, author, book_cover, isbn, ol_link, rating, review });

  try {
    const bookResult = await db.query(
      "INSERT INTO books (title, author, book_cover, isbn, ol_link) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (isbn) DO UPDATE SET title = EXCLUDED.title, author = EXCLUDED.author, book_cover = EXCLUDED.book_cover, ol_link = EXCLUDED.ol_link RETURNING *",
      [title, author, book_cover, isbn, ol_link]
    );
    const reviewResult = await db.query(
      "INSERT INTO reviews (rating, review, book_isbn) VALUES ($1, $2, $3) RETURNING *",
      [rating, review, isbn]
    );
    // console.log(bookResult, reviewResult);

    res.redirect("/");
  } catch (error) {
    console.error("Error details: ", error.message);
    res.status(500).send("Failed to add book and review to database.");
  }
});

// View individual book review page
app.get("/view/:postId", async (req, res) => {
  const entryIndex = req.params.postId;

  await obtainBookReviews();

  const fetchEntry = entries.find((entry) => entry.review_id == entryIndex);
  console.log("Fetched entry: ", fetchEntry);

  res.render("view-entry.ejs", { entryToView: fetchEntry, year: currentYear });
});

// View editing page for a specific book review
app.get("/edit/:postId", async (req, res) => {
  const entryIndex = req.params.postId;

  await obtainBookReviews();

  const fetchEntry = entries.find((entry) => entry.review_id == entryIndex);
  // console.log("Fetched entry: ", fetchEntry);

  res.render("edit-entry.ejs", { entryToEdit: fetchEntry, year: currentYear });
});

// After submitting new entry, redirect to homepage
app.post("/edit-entry/:postId", async (req, res) => {
  const entryIndex = req.params.postId;

  const {
    rating: updatedRating,
    review: updateReview,
    author: updateAuthor,
    isbn,
  } = req.body;
  // console.log(updateAuthor, isbn);

  try {
    await db.query(
      "UPDATE reviews SET rating = $1, review = $2 WHERE id = $3",
      [updatedRating, updateReview, entryIndex]
    );

    await db.query("UPDATE books SET author = $1 WHERE isbn = $2", [
      updateAuthor,
      isbn,
    ]);

    res.redirect("/");
  } catch (error) {
    console.error("Error details: ", error.message);
    res.send("Could not update entry.");
  }
});

// After deleting book review, redirect to homepage
app.get("/delete/:postId", async (req, res) => {
  const entryIndex = req.params.postId;
  // console.log(entryIndex);

  try {
    const result = await db.query(
      "DELETE FROM reviews WHERE reviews.id = $1 RETURNING *",
      [entryIndex]
    );

    console.log("Deleted the following entry: ", result);
    res.redirect("/");
  } catch (error) {
    console.error("Error details: ", error.message);
    res.send("Could not delete entry.");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
