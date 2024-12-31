import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./Pages/Home";
import Movies from "./Pages/Movies";
import TwentySix from "./Pages/TwentySix";
import Shows from "./Pages/Shows";

export default function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  const authorizeNavigation = () => {
    setIsAuthorized(true);
  };

  return (
    <Router>
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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
