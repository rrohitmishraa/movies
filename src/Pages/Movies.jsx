import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(
    window.innerWidth <= 768 ? 10 : 20
  );
  const navigate = useNavigate();

  // Fetch movies from JSON
  useEffect(() => {
    fetch("/movies.json")
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  // Filter movies based on the search term
  const filteredMovies = movies.filter(
    (movie) =>
      movie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.tags.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = filteredMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie
  );
  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle window resize for responsive moviesPerPage
  useEffect(() => {
    const handleResize = () => {
      setMoviesPerPage(window.innerWidth <= 768 ? 10 : 20);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset to first page on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleCardClick = (url) => {
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const renderPageNumbers = () => {
    const visiblePageNumbers = 5;
    const pages = [];
    const startPage = Math.max(
      Math.min(
        currentPage - Math.floor(visiblePageNumbers / 2),
        totalPages - visiblePageNumbers + 1
      ),
      1
    );
    const endPage = Math.min(startPage + visiblePageNumbers - 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`px-3 py-2 rounded-md ${
            currentPage === i
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-red-400"
          }`}
          onClick={() => handlePagination(i)}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.h1
          className="text-4xl font-bold text-center mb-8 text-gray-800"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          🎥 Movie Library
        </motion.h1>

        {/* Search Bar */}
        <motion.div
          className="flex items-center justify-center mb-10 relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <button
            onClick={() => navigate("/")}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 16l-4-4m0 0l4-4m-4 4h16"
              />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-96 px-5 py-3 pl-12 rounded-full shadow-md bg-white text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
          />
        </motion.div>

        {/* Movie Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
            staggerChildren: 0.2,
          }}
        >
          {currentMovies.length > 0 ? (
            currentMovies.map((movie, index) => (
              <motion.div
                key={`${movie.id}-${index}`} // Unique key
                className="block h-[220px] p-4 bg-white rounded-lg border-4 border-white shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-200 cursor-pointer hover:border-red-300 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                onClick={() => handleCardClick(movie.url)}
              >
                <span className="absolute top-2 left-3 text-xs font-semibold text-gray-500 bg-gray-200 rounded-[6px] h-[25px] px-2 flex justify-center items-center">
                  {indexOfFirstMovie + index + 1}
                </span>
                <h2 className="text-xl font-medium text-gray-800 hover:text-red-400 mt-6 mb-2 border-b border-gray-300 pb-2">
                  {movie.name}
                </h2>
                <p className="mt-2 text-gray-600">
                  {movie.tags.split(",").map((tag, idx) => (
                    <span key={idx} className="inline-block mr-2">
                      #{tag.trim()}
                    </span>
                  ))}
                </p>
                {!movie.url && (
                  <span
                    className="material-icons-outlined text-gray-500 absolute bottom-4 right-4"
                    title="No link available"
                  >
                    link_off
                  </span>
                )}
              </motion.div>
            ))
          ) : (
            <motion.p
              className="text-center text-gray-500 mt-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              No movies found. Try searching something else!
            </motion.p>
          )}
        </motion.div>

        {/* Pagination */}
        <motion.div
          className="mt-8 flex flex-wrap justify-center items-center space-x-2 max-w-[800px] mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <button
            onClick={() => handlePagination(1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            First
          </button>
          <button
            className={`px-3 py-2 rounded ${
              currentPage === 1
                ? "bg-gray-300"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => handlePagination(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {renderPageNumbers()}
          <button
            className={`px-3 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-300"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() =>
              handlePagination(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button
            className={`px-3 py-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-300"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => handlePagination(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </motion.div>
      </div>
    </div>
  );
}
