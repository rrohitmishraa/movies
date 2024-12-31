import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Home({ authorizeNavigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const navigate = useNavigate();

  const predefinedRoutes = ["movies", "26", "shows"];

  const handleSearch = async () => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    if (predefinedRoutes.includes(trimmedQuery)) {
      // Navigate to valid route
      authorizeNavigation(); // Authorize navigation
      navigate(`/${trimmedQuery}`);
    } else {
      // Query the dictionary API for other inputs
      try {
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${trimmedQuery}`
        );
        const data = await response.json();

        if (data.title) {
          // Word not found
          setPopupContent("Word not found!");
        } else {
          // Show definition
          setPopupContent(data[0].meanings[0].definitions[0].definition);
        }
      } catch (error) {
        setPopupContent("An error occurred while fetching the meaning.");
      }

      setShowPopup(true); // Show popup with result
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "popup-container") {
      setShowPopup(false);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-gray-100"
      onClick={handleOutsideClick}
    >
      <Header />
      <div>
        <img src="logo.png" alt="Logo" className="h-40" />
      </div>
      <div className="w-full max-w-md">
        <div className="flex items-center px-4 py-2 bg-white rounded-full shadow-md">
          <input
            type="text"
            className="flex-grow p-2 text-sm outline-none"
            placeholder="Search anything"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="flex justify-center mt-4 space-x-4">
          <button
            className="px-6 py-2 text-20 text-white bg-red-400 rounded hover:bg-red-600"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
      {showPopup && (
        <div
          id="popup-container"
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="bg-white p-4 rounded shadow-lg max-w-xs">
            <h3 className="text-center text-xl font-semibold text-gray-800">
              Search Result
            </h3>
            <p className="mt-2 text-center text-gray-700">{popupContent}</p>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
