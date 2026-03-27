import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import PopupModal from "../components/PopupModal";
import React from "react";

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
      <Header />

      <main className="flex-1 flex flex-col items-center justify-start px-6 text-center pt-20">
        {/* Top small label */}
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-[0.3em] text-red-500 mb-6"
        >
          VERSION 2.0
        </motion.p>

        {/* Big heading */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-5xl sm:text-7xl lg:text-[90px] font-light tracking-tight"
        >
          TYPE IT.
          <span className="font-extrabold italic ml-3">FIND IT.</span>
        </motion.h1>

        {/* Search box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 lg:mt-20 w-full max-w-2xl"
        >
          <div className="relative border border-gray-200 bg-white px-6 py-6 rounded-sm cursor-text">
            <input
              ref={inputRef}
              id="search"
              name="search"
              type="text"
              placeholder="SEARCH A WORD OR THE CODE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full outline-none text-lg placeholder-gray-400 focus:outline-none transition"
            />

            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
              <button
                onClick={handleSearch}
                className="text-sm px-3 py-1 border border-gray-300 hover:bg-gray-100 transition"
              >
                Search
              </button>

              <div className="text-xs text-gray-400 flex gap-2">
                <span className="border px-2 py-1">CMD</span>
                <span className="border px-2 py-1">K</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-5xl mt-24 text-left"
        >
          <div className="border-t border-gray-200 pt-16">
            <div className="flex items-start justify-between">
              <h2 className="text-4xl sm:text-5xl font-bold">DISCOVER</h2>
              <span className="text-xs text-gray-400 tracking-widest">
                /ACTION • INPUT
              </span>
            </div>

            <p className="mt-6 text-gray-600 max-w-2xl leading-relaxed">
              Type a hidden key to unlock curated collections, or wander through
              titles and tags to uncover stories waiting to be watched.
            </p>

            <div className="mt-6 flex items-center gap-6 text-xs">
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

      <footer className="w-full border-t border-gray-200 mt-20 px-6 py-8 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-red-500 font-semibold tracking-widest">
              BY UNLINKLY
            </span>
            <span className="mt-2 opacity-70">© 2026 UNLINKLY.COM</span>
          </div>

          <div className="flex gap-8 tracking-wide">
            <span>MADE FOR ME</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
