import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getDocument } from "../services/api";  
import DocumentEditor from "../components/DocumentEditor"; 
import UserList from "../components/UserList"; 
import VersionHistory from "../components/VersionHistory"; 

const DocumentPage = ({ token }) => {
  const { id } = useParams();  
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await getDocument(id, token);  
        setDoc(response.data);
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchDocument();
  }, [id, token]);  

  return (
    <div>
      <h2>Document: {doc ? doc.title : "Loading..."}</h2>
      {doc && (
        <div>
          <DocumentEditor docId={id} content={doc.content} />
          <UserList docId={id} />
          <VersionHistory docId={id} token={token} />
        </div>
      )}
    </div>
  );
};

export default DocumentPage;
