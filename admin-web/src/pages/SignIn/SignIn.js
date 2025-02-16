import React, { useState } from "react";
import axios from "axios";
import "./SignIn.css";
import { requestPermission } from "../../firebase";

const uri = "https://alert-system-fastapi-8749c7285c49.herokuapp.com";

const SignIn = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted"); // Check if the form is submitted

    try {
      console.log("Sending Sign-In Request...");
      const response = await axios.post(`${uri}/api/signin`, {
        email,
        password,
      });

      console.log("Received Response:", response);
      localStorage.setItem("token", response.data.token);

      console.log("Requesting FCM Permission...");
      const fcmToken = await requestPermission();
      console.log("Get FCM Token...", fcmToken);
      if (fcmToken) {
        console.log("Storing FCM Token:", fcmToken);
        await axios.post(`${uri}/api/store-fcm-token`, {
          email,
          fcmToken,
        });
      }

      console.log("Authentication Successful");
      setIsAuthenticated(true); // Update authentication state
    } catch (err) {
      console.error("Error during Sign-In:", err);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit} className="signin-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign In</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default SignIn;
