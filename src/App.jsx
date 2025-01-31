import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Movies from "./Pages/Movies";
import TwentySix from "./Pages/TwentySix";
import Shows from "./Pages/Shows";

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
      .then((data) => setPredefinedCodes(data.movieCodes))
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
        {predefinedCodes.map((code) => (
          <Route
            key={code}
            path={`/${code}`}
            element={<Navigate to="/movies" />}
          />
        ))}

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
