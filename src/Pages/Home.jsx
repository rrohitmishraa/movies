import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function Home({ authorizeNavigation }) {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [submitPopupContent, setSubmitPopupContent] = useState("");
  const [showSubmitPopup, setShowSubmitPopup] = useState(false);
  const [feedback, setFeedback] = useState({
    suggestions: "",
    name: "",
    ip: "",
  });
  const navigate = useNavigate();

  const predefinedRoutes = ["movies", "26", "shows"];

  const handleSearch = async () => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (predefinedRoutes.includes(trimmedQuery)) {
      authorizeNavigation();
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

  const handleFeedbackSubmit = async () => {
    try {
      setLoading(true); // Set loading to true
      const ipResponse = await fetch("https://api.ipify.org/?format=json");
      const ipData = await ipResponse.json();

      const IP = ipData.ip;

      // Add the IP address to the feedback object
      const feedbackWithIp = {
        ...feedback,
        ipAddress: IP,
      };

      await fetch(`https://movies-server-xfjy.onrender.com/feedback`, {
        // await fetch(`http://localhost:5001/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackWithIp),
      });

      setSubmitPopupContent("Feedback submitted successfully!");
      setShowSubmitPopup(true);
      setFeedback({ suggestions: "", name: "", ip: "" });
      setShowFeedbackForm(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSubmitPopupContent(
        "Failed to submit feedback. Please try again later."
      );
      setShowSubmitPopup(true);
    } finally {
      setLoading(false); // Reset loading state
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

      {/* Submit Popup */}
      {showSubmitPopup && (
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
              THANKS
            </h3>
            <p className="mt-2 text-center text-gray-700">
              {submitPopupContent}
            </p>
            <button
              className="mt-4 px-4 py-2 w-full bg-red-500 text-white rounded-lg hover:bg-red-700 transition-all"
              onClick={() => setShowSubmitPopup(false)}
            >
              Close
            </button>
          </div>
        </motion.div>
      )}

      {/* Feedback Button and Form */}
      <motion.div
        className="fixed bottom-4 right-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        onClick={(e) => e.stopPropagation()} // Prevent triggering outside click handler
      >
        {!showFeedbackForm && (
          <button
            className="absolute bg-blue-500 bottom-0 right-0 cursor-pointer text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              setShowFeedbackForm(true);
            }}
          >
            Feedback
          </button>
        )}

        {showFeedbackForm && (
          <motion.div
            className="bg-white p-4 rounded-lg shadow-lg w-80"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Feedback Form
            </h3>
            <textarea
              className="w-full p-2 border rounded-md mb-2"
              placeholder="Enter your suggestions"
              value={feedback.suggestions}
              onChange={(e) =>
                setFeedback({ ...feedback, suggestions: e.target.value })
              }
            />
            <input
              type="text"
              className="w-full p-2 border rounded-md mb-4"
              placeholder="Your Name"
              value={feedback.name}
              onChange={(e) =>
                setFeedback({ ...feedback, name: e.target.value })
              }
            />
            <div className="flex justify-between">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition-all"
                onClick={() => setShowFeedbackForm(false)}
              >
                Cancel
              </button>
              <button
                className={`bg-green-500 text-white px-4 py-2 rounded-md transition-all ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-green-700"
                }`}
                onClick={handleFeedbackSubmit}
                disabled={loading} // Disable button when loading
              >
                {loading ? "Sending..." : "Submit"}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
