import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PopupModal from "../components/PopupModal";
import React from "react";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";

export default function Home({ authorizeNavigation, predefinedCodes }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [popupContent, setPopupContent] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  const inputRef = React.useRef(null);

  useEffect(() => {
    const handler = (e) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      if (
        (isMac && e.metaKey && e.key.toLowerCase() === "k") ||
        (!isMac && e.ctrlKey && e.key.toLowerCase() === "k")
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSearch = async () => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (!trimmedQuery) return;

    try {
      if (!predefinedCodes || predefinedCodes.length === 0) {
        setPopupContent("Loading codes, try again...");
        setShowPopup(true);
        return;
      }

      const matchedCode = predefinedCodes.find(
        (code) => String(code.code).toLowerCase() === trimmedQuery,
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
    <div className="min-h-screen flex flex-col bg-[#f7f7f7] text-gray-900">
      <main className="flex-1 flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 text-center pt-16 sm:pt-20">
        {/* Top small label */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[10px] sm:text-xs tracking-[0.25em] text-red-500 mb-4 sm:mb-6"
        >
          VERSION 2.0
        </motion.p>

        {/* Big heading */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-[90px] font-light tracking-tight leading-tight"
        >
          TYPE IT.
          <span className="font-extrabold italic ml-2 sm:ml-3">FIND IT.</span>
        </motion.h1>

        {/* Search box */}
        <SearchBar
          inputRef={inputRef}
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          placeholder="Enter code or word..."
          showButton={true}
          showBack={false}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-5xl mt-16 sm:mt-24 text-left"
        >
          <div className="border-t border-gray-200 pt-10 sm:pt-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold">
                DISCOVER
              </h2>
              <span className="text-xs text-gray-400 tracking-widest">
                /ACTION • INPUT
              </span>
            </div>

            <p className="mt-4 sm:mt-6 text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed">
              Type a hidden key to unlock curated collections, or wander through
              titles and tags to uncover stories waiting to be watched.
            </p>

            <div className="mt-4 sm:mt-6 flex items-center gap-4 sm:gap-6 text-xs">
              <button className="text-red-500 font-semibold tracking-wide">
                FIND IT
              </button>
              <span className="text-gray-400 tracking-wide">HIDE IT</span>
            </div>
          </div>
        </motion.div>
      </main>

      {showPopup && (
        <PopupModal
          title="Result"
          content={popupContent}
          onClose={() => setShowPopup(false)}
        />
      )}

      <Footer />
    </div>
  );
}
