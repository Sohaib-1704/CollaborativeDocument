import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";  
import DocumentPage from "./pages/DocumentPage";  
import { joinDocumentRoom, disconnectSocket } from "./services/socket";  

function App() {
  const [token, setToken] = useState(null);  
  const [docId, setDocId] = useState(null);  

  useEffect(() => {
    if (docId) {
      joinDocumentRoom(docId);
    }

    return () => {
      if (docId) {
        disconnectSocket();
      }
    };
  }, [docId]);

  const handleLogin = (accessToken, documentId) => {
    setToken(accessToken);  
    setDocId(documentId);  
  };
  const handleSignUp = (accessToken, documentId) => {
    setToken(accessToken);  
    setDocId(documentId);  
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<LoginPage onSignUp={handleSignUp} />} />
          <Route
            path="/document/:id"
            element={token ? <DocumentPage docId={docId} token={token} /> : <Navigate to="/login" />}
          />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
