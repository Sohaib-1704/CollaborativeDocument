import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, signUp } from "../services/api";
import "./LoginPage.css"; 

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);  
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const navigate = useNavigate();  

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);  
      if (response.data.success) {
        onLogin(response.data.access_token, response.data.docId); 
        navigate(`/document/${response.data.docId}`); 
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    try {
      const response = await signUp(username, password);  
      if (response.data.success) {
        onLogin(response.data.access_token, response.data.docId); 
        navigate(`/document/${response.data.docId}`); 
      } else {
        setError("Sign-up failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred during sign-up. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>{isSignUp ? "Sign Up" : "Login"}</h1>

        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn">
            {isSignUp ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="toggle">
          {isSignUp ? (
            <p>
              Already have an account?{" "}
              <span onClick={() => setIsSignUp(false)} className="toggle-link">
                Log In
              </span>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <span onClick={() => setIsSignUp(true)} className="toggle-link">
                Sign Up
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
