import React from "react";

function ViewEntry() {
  return (
    <main>
      <div class="view-entryPage">
        {entryToView && (
          <Entry
            entryDetails={entryToView}
            // Conditionals:
            showLineBreak={false}
            showDatePublished={true}
            showPreview={false}
            showButtons={true}
            showForm={false}
            showEditForm={false}
            showPostForm={false}
          />
        )}
      </div>
    </main>
  );
}

export default ViewEntry;
