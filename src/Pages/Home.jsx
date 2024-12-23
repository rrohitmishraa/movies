import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState(""); // State to store the input value
  const [showPopup, setShowPopup] = useState(false); // State for showing/hiding popup
  const [popupWord, setPopupWord] = useState(""); // State for storing the word to be displayed in the popup
  const [meaning, setMeaning] = useState(""); // State for storing word meaning
  const [error, setError] = useState(""); // State for error handling
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle the search action
  const handleSearch = async () => {
    if (searchQuery.trim() === "movies" || searchQuery.trim() === "26") {
      navigate(`/${searchQuery.trim()}`);
    } else {
      setPopupWord(searchQuery.trim()); // Set the word the user entered in the popup
      try {
        // Fetch the meaning of the word from the API
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${searchQuery.trim()}`
        );
        const data = await response.json();

        if (data.title) {
          // If the word is not found or there's an error, set the error message
          setError("Word not found!");
          setMeaning("");
        } else {
          // Otherwise, display the word meaning
          setMeaning(data[0].meanings[0].definitions[0].definition);
          setError(""); // Clear any previous errors
        }
      } catch (error) {
        setError("An error occurred while fetching the meaning.");
        setMeaning("");
      }
      setShowPopup(true); // Show the popup
    }
  };

  // Function to handle key press
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // Function to close the popup if clicked outside
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
      {/* Header */}
      <Header />

      {/* Logo */}
      <div>
        <img src="logo.png" alt="Logo" className="h-40" />
      </div>

      {/* Search Bar */}
      <div className="w-full max-w-md">
        <div className="flex items-center px-4 py-2 bg-white rounded-full shadow-md">
          <input
            type="text"
            className="flex-grow p-2 text-sm outline-none"
            placeholder="Search anything"
            value={searchQuery} // Bind input value to state
            onChange={(e) => setSearchQuery(e.target.value)} // Update state on input change
            onKeyPress={handleKeyPress} // Handle key press
          />
        </div>
        <div className="flex justify-center mt-4 space-x-4">
          <button
            className="px-6 py-2 text-20 text-white bg-red-400 rounded hover:bg-red-600"
            onClick={handleSearch} // Handle click
          >
            Search
          </button>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div
          id="popup-container"
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="bg-white p-4 rounded shadow-lg max-w-xs">
            <h3 className="text-center text-xl font-semibold text-gray-800">
              {popupWord}
            </h3>
            {meaning ? (
              <p className="mt-2 text-center text-gray-700">{meaning}</p>
            ) : (
              <p className="mt-2 text-center text-red-500">{error}</p> // Show error if no meaning found
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
