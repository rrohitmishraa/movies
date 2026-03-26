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

  // Fetch movie codes from the remote sheet
  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const res = await fetch(
          `https://myjson.unlinkly.com/api/sheet/1ejPpiDw_eEWovr05C-G0NTwe3ll8996gzfCWm0nzbjg/Codes?t=${Date.now()}`,
          { cache: "no-store" },
        );

        const text = await res.text();

        let json;
        try {
          json = JSON.parse(text);
        } catch (e) {
          console.error("Invalid JSON response:", text);
          return;
        }

        const data = Array.isArray(json) ? json : json?.data || [];

        const cleanCodes = data
          .map((c) => ({
            code: String(c.code || "").trim(),
            expiryDate: c.expirydate || c.expiryDate || "",
            status: c.status || "",
          }))
          .filter((c) => c.code && c.expiryDate);

        setPredefinedCodes(cleanCodes);
      } catch (error) {
        console.error("Error loading movie codes:", error);
      }
    };

    fetchCodes();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              authorizeNavigation={authorizeNavigation}
              predefinedCodes={predefinedCodes}
            />
          }
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
