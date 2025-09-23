import React from "react";

function FormSegment() {
  return (
    <>
      <div className="entry-input-author">
        <h3>Author:</h3>
        <input
          type="text"
          name="author"
          placeholder="Author"
          value="<%= entryDetails.author %>"
          required
        />
      </div>

      <div className="entry-input-rating">
        <h3>Rating:</h3>
        {[...Array(6)].map((_, i) => (
          <React.Fragment key={i}>
            <input
              type="radio"
              id={`rating-${i}`}
              name="rating"
              value={i}
              checked={entryDetails.rating === i}
            />
            {/* NOTE: entryDetails.rating == i ? "checked" : ""  <- So that the user can see which rating was originally selected */}
            <label htmlFor={`rating-${i}`}>{i}</label>
          </React.Fragment>
        ))}
      </div>

      <div className="entry-input-review">
        <h3>Review:</h3>
        <textarea
          name="review"
          placeholder="Write your review here..."
          minLength="300"
          required
          autoFocus
        >
          {entryDetails.review}
        </textarea>
      </div>

      <div className="cancelSubmit-btn">
        {/* Cancelling submission on add-entry page will refresh page, otherwise will take user to homepage */}
        {showPostForm ? (
          <a href="/add-entry">Cancel</a>
        ) : (
          <a href="/">Cancel</a>
        )}
        <input type="submit" value="Submit" />
      </div>
    </>
  );
}

export default FormSegment;
