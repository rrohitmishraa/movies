import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupWord, setPopupWord] = useState("");
  const [meaning, setMeaning] = useState("");
  const [error, setError] = useState("");
  const [showSuggestionPopup, setShowSuggestionPopup] = useState(false); // State for suggestion popup
  const [userName, setUserName] = useState(""); // State for user name
  const [movieSuggestion, setMovieSuggestion] = useState(""); // State for movie suggestion
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (
      searchQuery.trim() === "movies" ||
      searchQuery.trim() === "26" ||
      searchQuery.trim() === "shows"
    ) {
      navigate(`/${searchQuery.trim()}`);
    } else if (searchQuery.trim() === "wallpapers") {
      window.open(`https://photos.app.goo.gl/sxpqFZkwpoJxqMD36`);
    } else {
      setPopupWord(searchQuery.trim());
      try {
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${searchQuery.trim()}`
        );
        const data = await response.json();

        if (data.title) {
          setError("Word not found!");
          setMeaning("");
        } else {
          setMeaning(data[0].meanings[0].definitions[0].definition);
          setError("");
        }
      } catch (error) {
        setError("An error occurred while fetching the meaning.");
        setMeaning("");
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

  const handleSuggestions = async () => {
    const response = await fetch(
      "https://movies-server-azure.vercel.app/suggestions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, movieSuggestion }),
      }
    );

    if (response.ok) {
      const result = await response.json();
      alert(result.message);
      setUserName("");
      setMovieSuggestion("");
      setShowSuggestionPopup(false);
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
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
          {/*<button
            className="px-6 py-2 text-20 text-white bg-blue-400 rounded hover:bg-blue-600"
            onClick={() => setShowSuggestionPopup(true)}
          >
            Feedback
          </button> */}
        </div>
      </div>
      {showSuggestionPopup && (
        <div
          id="popup-container"
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="bg-white p-4 rounded shadow-lg max-w-xs">
            <h3 className="text-center text-xl font-semibold text-gray-800">
              Submit Your Movie Suggestion
            </h3>
            <input
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-2 mt-2 border rounded"
            />
            <input
              type="text"
              placeholder="Movie Suggestion"
              value={movieSuggestion}
              onChange={(e) => setMovieSuggestion(e.target.value)}
              className="w-full p-2 mt-2 border rounded"
            />
            <div className="flex justify-end mt-4 space-x-2">
              <button
                className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-700"
                onClick={() => setShowSuggestionPopup(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700"
                onClick={handleSuggestions}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
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
              <p className="mt-2 text-center text-red-500">{error}</p>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
