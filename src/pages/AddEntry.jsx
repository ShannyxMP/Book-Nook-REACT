import React from "react";

function AddEntry() {
  return (
    <>
      <form class="isbn-form" action="/fetch-new-entry" method="POST">
        {/* Fetches data from API based on ISBN provided */}
        <p>
          ISBN 10 / 13 (relevant information will be auto-populated for you):
        </p>

        <input
          type="text"
          name="isbn"
          placeholder="e.g. 978-0-452-29529-2 or 0452295297"
          minlength="10"
          maxlength="17"
          required
          pattern="^(?:[(0-9)][-(0-9)]{9}|\d[-(0-9)]{12}|\d[-(0-9)]{16})$"
        />
        {/* pattern allows ISBN-10, ISBN-13 (with or without dashes) */}

        <div>
          <a href="/">Cancel</a>
          <input type="submit" value="Find book" />
        </div>
      </form>

      <div class="addEdit-entryPage">
        <h2>Preview pane:</h2>
        {/* Show preview if a valid ISBN was entered and API returned data; otherwise, display gif image */}
        {entryToAdd ? (
          <Entry
            entryDetails={entryToAdd}
            // Conditionals:
            showLineBreak={false}
            showDatePublished={true}
            showPreview={false}
            showButtons={false}
            showForm={true}
            showEditForm={false}
            showPostForm={true}
          />
        ) : (
          <div class="empty gif-container">
            <p>nothing here...</p>

            <img src="assets/images/nothing-here.gif" alt="nothing here gif" />
          </div>
        )}
      </div>
    </>
  );
}

export default AddEntry;
