import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill"; 
import "react-quill/dist/quill.snow.css"; 
import { sendDocumentEdit } from "../services/socket"; 

const DocumentEditor = ({ docId, content, onContentChange }) => {
  const [editorContent, setEditorContent] = useState(content);

  useEffect(() => {
    setEditorContent(content);
  }, [content]);

  const handleEditorChange = (value) => {
    setEditorContent(value);
    onContentChange(value);
    sendDocumentEdit(docId, value); 
  };

  return (
    <div>
      <ReactQuill
        value={editorContent}
        onChange={handleEditorChange}
        theme="snow"
        modules={{
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline"],
            [{ align: [] }],
            ["link"],
            ["image"],
          ],
        }}
      />
    </div>
  );
};

export default DocumentEditor;
