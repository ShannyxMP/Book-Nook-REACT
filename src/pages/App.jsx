import { useEffect, useState } from "react";
import axios from "axios";
import Entry from "../components/Entry";

function App() {
  const [data, setData] = useState({
    listOfEntries: [],
    bookCountTotal: 0,
    bookCountYear: 0,
    // year: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/");
        setData(response.data); // NOTE: Axios parses JSON automatically
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const { listOfEntries, bookCountTotal, bookCountYear } = data;

  return (
    <>
      <div className="stats">
        {/* Display book counts */}
        <p>Books reviewed:</p>
        <div className="postIt-notes">
          <div className="randomRotation">
            <span>{bookCountYear}</span>
            <p>THIS YEAR</p>
          </div>

          <div className="randomRotation">
            <span>{bookCountTotal}</span>
            <p>TOTAL</p>
          </div>
        </div>
      </div>

      <main>
        <div className="postIt-tabs">
          {/* Add entry and Sort entries buttons */}
          <div className="randomRotation">
            <a href="/add-entry">
              New Entry <span className="material-icons-round">add</span>
            </a>
          </div>

          <div className="randomRotation">
            <button id="sortToggle">
              <span className="material-icons-round">sort</span> Sort By
            </button>

            <form action="/sort" method="POST" id="sortForm">
              <input type="hidden" name="sortBy" id="sortInput" />
            </form>
          </div>

          <div className="sortOptions randomRotation">
            <ul>
              <li data-value="reviews.date_created DESC">Newest</li>
              <li data-value="reviews.date_created ASC">Oldest</li>
              <li data-value="books.title ASC">Title (A-Z)</li>
              <li data-value="books.title DESC">Title (Z-A)</li>
            </ul>
          </div>
        </div>

        <div className="homepage-entry-grid">
          {/* Render each entry in the homepage grid  */}
          {listOfEntries.map((entry) => (
            <Entry
              key={entry.review_id}
              entryDetails={entry}
              // Conditionals:
              showLineBreak={true}
              showDatePublished={true}
              showPreview={true}
              showButtons={true}
              showForm={false}
              showEditForm={false}
              showPostForm={false}
            />
          ))}
        </div>
      </main>
    </>
  );
}

export default App;
