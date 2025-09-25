import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Entry from "../components/Entry";

function ViewEntry() {
  const { postId } = useParams();

  const [data, setData] = useState({
    entryToView: null,
    // year: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/view/${postId}`);
        setData(response.data); // NOTE: Axios parses JSON automatically
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [postId]);

  const { entryToView } = data;

  return (
    <main>
      <div className="view-entryPage">
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
