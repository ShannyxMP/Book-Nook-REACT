import React from "react";

function EditEntry() {
  return (
    // <!-- <main> --> <!-- NOTE: avoided applying styles of main for this page -->
    <div class="addEdit-entryPage">
      {entryToEdit && (
        <Entry
          entryDetails={entryToEdit}
          // Conditionals:
          showLineBreak={false}
          showDatePublished={true}
          showPreview={false}
          showButtons={false}
          showForm={true}
          showEditForm={true}
          showPostForm={false}
        />
      )}
    </div>
    // <!-- </main> -->
  );
}

export default EditEntry;
