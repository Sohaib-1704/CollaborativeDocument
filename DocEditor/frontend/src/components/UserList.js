import React, { useEffect, useState } from "react";
import { listenForDocumentUpdates } from "../services/socket";

const UserList = ({ docId }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    listenForDocumentUpdates((data) => {
      if (data.document_id === docId) {
        setUsers(data.users);  
      }
    });
  }, [docId]);

  return (
    <div>
      <h4>Users Editing:</h4>
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
