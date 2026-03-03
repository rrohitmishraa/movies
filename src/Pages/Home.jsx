import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PopupModal from "../components/PopupModal";
import SearchBar from "../components/SearchBar";
import FeedbackWidget from "../components/FeedbackWidget";

export default function Home({ authorizeNavigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [popupContent, setPopupContent] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [submitPopupContent] = useState("");
  const [showSubmitPopup, setShowSubmitPopup] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedback, setFeedback] = useState({
    suggestions: "",
    name: "",
  });

  const navigate = useNavigate();

  const handleSearch = async () => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (!trimmedQuery) return;

    try {
      const res = await fetch("/movieCodes.json");
      const data = await res.json();

      const matchedCode = data.movieCodes.find(
        (code) => code.code.toLowerCase() === trimmedQuery,
      );

      if (matchedCode) {
        authorizeNavigation();
        navigate(`/${matchedCode.code}`);
      } else {
        const dictRes = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${trimmedQuery}`,
        );
        const dictData = await dictRes.json();

        if (dictData.title) {
          setPopupContent("Word not found!");
        } else {
          setPopupContent(dictData[0].meanings[0].definitions[0].definition);
        }

        setShowPopup(true);
      }
    } catch (err) {
      setPopupContent("Something went wrong.");
      setShowPopup(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-white to-blue-50 text-gray-900">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Big Playful Heading */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight"
        >
          Type it.
          <br />
          <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
            Find it.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-lg sm:text-xl text-gray-600 max-w-xl"
        >
          Search any word — instantly unlock results.
        </motion.p>

        {/* Dominant Search Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 w-full max-w-2xl"
        >
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={handleSearch}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </motion.div>
      </main>

      {showPopup && (
        <PopupModal
          title="Result"
          content={popupContent}
          onClose={() => setShowPopup(false)}
        />
      )}

      {showSubmitPopup && (
        <PopupModal
          title="Thanks"
          content={submitPopupContent}
          onClose={() => setShowSubmitPopup(false)}
        />
      )}

      <FeedbackWidget
        showForm={showFeedbackForm}
        setShowForm={setShowFeedbackForm}
        feedback={feedback}
        setFeedback={setFeedback}
        onSubmit={() => {}}
      />

      <Footer />
    </div>
  );
}
