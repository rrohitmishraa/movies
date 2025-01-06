import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
      authorizeNavigation(); // Authorize navigation
      navigate(`/${trimmedQuery}`);
    } else if (trimmedQuery === "wallpapers") {
      window.open("https://photos.app.goo.gl/sxpqFZkwpoJxqMD36");
    } else {
      try {
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${trimmedQuery}`
        );
        const data = await response.json();

        if (data.title) {
          setPopupContent("Word not found!");
        } else {
          setPopupContent(data[0].meanings[0].definitions[0].definition);
        }
      } catch (error) {
        setPopupContent("An error occurred while fetching the meaning.");
      }

      setShowPopup(true);
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
      className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4"
      onClick={handleOutsideClick}
    >
      {/* Header */}
      <Header />

      {/* Logo */}
      <div>
        <img
          src="logo.png"
          alt="Logo"
          className="h-32 sm:h-40 object-contain"
        />
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-md">
        <div className="flex items-center px-4 py-2 bg-white rounded-full shadow-md">
          <input
            type="text"
            className="flex-grow p-2 text-sm outline-none text-gray-700 placeholder-gray-500"
            placeholder="Search anything"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        {/* Search Button */}
        <div className="flex justify-center mt-4">
          <button
            className="px-6 py-2 text-base text-white bg-red-400 rounded-lg hover:bg-red-600 transition-all"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <motion.div
          id="popup-container"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
            duration: 0.5,
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full mx-4">
            <h3 className="text-center text-xl font-semibold text-gray-800">
              Search Result
            </h3>
            <p className="mt-2 text-center text-gray-700">{popupContent}</p>
            <button
              className="mt-4 px-4 py-2 w-full bg-red-500 text-white rounded-lg hover:bg-red-700 transition-all"
              onClick={() => setShowPopup(false)}
            >
              Close
            </button>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
