import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Entry from "../components/Entry";

function EditEntry() {
  const { postId } = useParams();

  const [data, setData] = useState({
    entryToEdit: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/edit/${postId}`);
        setData(response.data); // NOTE: Axios parses JSON automatically
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [postId]);

  const { entryToEdit } = data;

  return (
    // {/* <main>  <!--NOTE: avoided applying styles of main for this page --> */} 
    <div className="addEdit-entryPage">
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
    // {/* </main> */}
  );
}

export default EditEntry;
