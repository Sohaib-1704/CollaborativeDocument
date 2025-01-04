import React, { useState, useEffect } from "react";
import { getDocument } from "../services/api"; 

const VersionHistory = ({ docId, token }) => {
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    const fetchVersions = async () => {
      const res = await getDocument(docId, token);
      setVersions(res.data.versions);
    };

    fetchVersions();
  }, [docId, token]);

  const handleRevert = (versionId) => {
    console.log(`Reverting to version: ${versionId}`);
  };

  return (
    <div>
      <h4>Version History</h4>
      <ul>
        {versions.map((version) => (
          <li key={version.id}>
            <button onClick={() => handleRevert(version.id)}>
              Revert to Version {version.id}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VersionHistory;
