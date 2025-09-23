import React from "react";
import FormSegment from "./FormSegment";

function Entry({
  entryDetails,
  showLineBreak,
  showDatePublished,
  showPreview,
  showButtons,
  showForm,
  showEditForm,
  showPostForm,
}) {
  const formattedDate = new Date(
    entryDetails.date_created
  ).toLocaleDateString();
  const preview = entryDetails.review.substring(0, 300);

  return (
    <div className="entire-entry-container">
      {/* Divider between entries */}
      {showLineBreak && (
        <div className="lineBreak-wrapper">
          <hr />
        </div>
      )}

      {/* Polaroid image showing book details */}
      <div className="polaroid randomRotation">
        <div className="entry-img-wrapper">
          <img
            src={entryDetails.book_cover}
            alt={`book cover for ${entryDetails.title}`}
          />
        </div>

        {showDatePublished && (
          <div className="entry-date">
            <p>
              Date Created:
              {/* If no date fetched from database, fallback to placeholder */}
              {entryDetails.date_created ? (
                <span>{formattedDate}</span>
              ) : (
                <span className="empty">--/--/----</span>
              )}
            </p>
          </div>
        )}

        <div className="entry-titleAuthor">
          <p>
            <span>
              <a
                href={entryDetails.ol_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {entryDetails.title}
              </a>
            </span>
            <br />
            by
            {/* If no author fetched from API, fallback to placeholder */}
            {entryDetails.author ? (
              entryDetails.author
            ) : (
              <span className="empty">
                <em>No Author yet. Please update.</em>
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Section containing rating, review +/- forms and buttons, depending on flags */}
      <div className="entry-content-container">
        <div className="entry-rating">
          <p>
            {/* If no rating fetched from database, fallback to placeholder */}
            {entryDetails.rating ? (
              showPreview ? (
                <>
                  <h2> Rating </h2>
                  <br />
                  <div>
                    {entryDetails.rating}
                    <hr />5
                  </div>
                </>
              ) : (
                <div>{entryDetails.rating} / 5</div>
              )
            ) : (
              <div>
                <span className="empty">No rating yet. Fill form below.</span>
              </div>
            )}
          </p>
        </div>
        <div className="entry-review">
          <p>
            {/* If no review fetched from database, fallback to placeholder */}
            {entryDetails.review ? (
              showPreview ? (
                <>
                  <h2> Review </h2>
                  <br />
                  {preview}...
                  <br />
                  <a
                    href={`/view/${entryDetails.review_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="material-icons-round">read_more</span>
                  </a>
                </>
              ) : (
                entryDetails.review
              )
            ) : (
              <span className="empty">No review yet. Fill form below.</span>
            )}
          </p>
        </div>
        {/* Home, Edit, and Delete button */}
        {showButtons && (
          <div className="entry-buttons">
            {!showPreview && (
              <a href="/">
                <span className="material-icons-round">home</span>
              </a>
            )}
            <a href={`/edit/${entryDetails.review_id}`}>
              <span className="material-icons-round">edit</span>
            </a>
            <form method="POST">
              <a
                href={`/delete/${entryDetails.review_id}`}
                onclick="return confirm('Are you sure you want to delete this entry?')"
              >
                <span className="material-icons-round">delete</span>
              </a>
            </form>
          </div>
        )}
        {/* Show either edit or post form, depending on flags */}
        {showForm && showEditForm && (
          <form action={`/edit-entry/${entryDetails.review_id}`} method="POST">
            <input type="hidden" name="isbn" value={entryDetails.book_isbn} />

            <h2>Update Entry :</h2>
            <FormSegment />
          </form>
        )}
        {/* NOTE: JSON.stringify(book) was not working and resorted to approach below: --> */}
        {showForm && showPostForm && (
          <form action="/post-new-entry" method="POST">
            <input type="hidden" name="bookTitle" value={entryDetails.title} />
            <input
              type="hidden"
              name="bookCover"
              value={entryDetails.book_cover}
            />
            <input type="hidden" name="bookISBN" value={entryDetails.isbn} />
            <input
              type="hidden"
              name="bookOLlink"
              value={entryDetails.ol_link}
            />
            <FormSegment />
          </form>
        )}
      </div>
    </div>
  );
}

export default Entry;
