import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Movies from "./Pages/Movies";
import TwentySix from "./Pages/TwentySix";
import Shows from "./Pages/Shows";

// Utility function to check expiry date
const isCodeExpired = (expiryDate) => {
  const currentDate = new Date();
  const expiry = new Date(expiryDate);
  return currentDate > expiry;
};

export default function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [predefinedCodes, setPredefinedCodes] = useState([]);

  // To authorize navigation
  const authorizeNavigation = () => {
    setIsAuthorized(true);
  };

  // Fetch movie codes from the JSON file
  useEffect(() => {
    fetch("/movieCodes.json")
      .then((response) => response.json())
      .then((data) => setPredefinedCodes(data.movieCodes)) // Set predefined codes with expiryDate
      .catch((error) => console.error("Error loading movie codes:", error));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home authorizeNavigation={authorizeNavigation} />}
        />
        <Route
          path="/movies"
          element={isAuthorized ? <Movies /> : <Navigate to="/" />}
        />
        <Route
          path="/26"
          element={isAuthorized ? <TwentySix /> : <Navigate to="/" />}
        />
        <Route
          path="/shows"
          element={isAuthorized ? <Shows /> : <Navigate to="/" />}
        />

        {/* Dynamically add routes for movie codes */}
        {predefinedCodes.map(({ code, expiryDate }) => {
          // Check if the code is expired
          const expired = isCodeExpired(expiryDate);

          // If expired, redirect to the /movies page
          return (
            <Route
              key={code}
              path={`/${code}`}
              element={
                expired ? (
                  <Navigate to={`/${code}`} />
                ) : (
                  <Navigate to="/movies" />
                )
              }
            />
          );
        })}

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
