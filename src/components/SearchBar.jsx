import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function TopSearchBar({
  value,
  searchTerm,
  onChange,
  setSearchTerm, // fallback support
  onSearch,
  placeholder = "Search Word or Code...",
  showBack = false,
  showButton = false,
}) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const currentValue = value ?? searchTerm ?? "";

  const handleChange = (val) => {
    if (onChange) onChange(val);
    else if (setSearchTerm) setSearchTerm(val);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K → focus
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }

      // Cmd/Ctrl + J → back
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        navigate("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mt-10 sm:mt-14 lg:mt-20 w-full max-w-xl sm:max-w-2xl"
    >
      <div
        className={`relative w-full ${
          showBack
            ? "max-w-full sm:max-w-5xl lg:max-w-6xl"
            : "max-w-3xl sm:max-w-4xl lg:max-w-5xl"
        } border border-gray-200 bg-white px-6 sm:px-8 py-6 sm:py-8 rounded-md`}
      >
        {/* BACK */}
        {showBack && (
          <button
            onClick={() => navigate("/")}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 text-xs sm:text-sm md:text-base text-red-500 font-medium z-10"
          >
            ← BACK
          </button>
        )}

        {/* INPUT */}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={currentValue}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch?.()}
          className={`w-full ${
            showBack ? "pl-12 lg:pl-20 md:pl-22" : ""
          } outline-none text-base sm:text-base md:text-lg lg:text-xl placeholder-gray-400 pr-20 sm:pr-32 md:pr-40`}
        />

        {/* RIGHT SIDE */}
        <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-2">
          {/* CLEAR CONTROL */}
          {currentValue && (
            <span
              onClick={() => handleChange("")}
              role="button"
              aria-label="Clear"
              className="text-xs sm:text-sm md:text-base text-gray-500 hover:text-gray-800 cursor-pointer select-none flex items-center gap-1"
            >
              CLEAR ✕
            </span>
          )}

          {/* SEARCH */}
          {showButton && (
            <button
              onClick={onSearch}
              className="text-[10px] sm:text-xs md:text-sm px-2 py-1 border border-gray-300 hover:bg-gray-100 transition"
            >
              SEARCH
            </button>
          )}

          {/* SHORTCUT */}
          {!currentValue && (
            <div className="hidden sm:flex text-[10px] sm:text-xs text-gray-400 gap-1 sm:gap-2">
              <span className="border px-2 py-1">⌘</span>
              <span className="border px-2 py-1">K</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
