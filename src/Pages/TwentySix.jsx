import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TwentySix() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(20); // 20 movies per page
  const [visiblePageCount] = useState(5); // Show 5 pages at a time
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/twentysix.json")
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error("Error fetching movies:", error));
  }, []);

  // Filter movies based on both name and description
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

  // Determine visible page numbers
  const startPage = Math.max(1, currentPage - Math.floor(visiblePageCount / 2));
  const endPage = Math.min(totalPages, startPage + visiblePageCount - 1);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );

  // Pagination controls
  const handlePagination = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
          🎥 TwentySix Library
        </h1>

        {/* Search Bar */}
        <div className="flex items-center justify-center mb-10 relative">
          {/* Back Button */}
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

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-96 px-5 py-3 pl-12 rounded-full shadow-md bg-white text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
          />
        </div>

        {/* Movie Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {currentMovies.map((movie, index) => (
            <div
              key={movie.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transform hover:-translate-y-1 transition duration-200"
            >
              <a
                href={movie.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {/* Movie Info */}
                <div className="p-4">
                  {/* Serial Number and Movie Name */}
                  <span className="absolute top-2 left-3 text-xs font-semibold text-gray-500 bg-gray-200 rounded-[6px] h-[25px] px-2 flex justify-center items-center">
                    {indexOfFirstMovie + index + 1}
                  </span>
                  <h2 className="text-xl font-medium text-gray-800 hover:text-red-400 mt-6 mb-2 border-b border-gray-300 pb-2">
                    {movie.name}
                  </h2>
                  <p className="mt-1 text-gray-600 text-sm sm:text-[12px]">
                    {"#" + movie.tags}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>

        {/* No Results Found */}
        {filteredMovies.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No movies found. Try searching something else!
          </p>
        )}

        {/* Pagination Controls */}
        <div className="mt-8 flex justify-center items-center space-x-2">
          {/* Navigation Buttons */}
          <button
            onClick={() => handlePagination(1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-red-400 disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={() => handlePagination(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-red-400 disabled:opacity-50"
          >
            Previous
          </button>

          {/* Page Numbers */}
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePagination(page)}
              className={`px-3 py-2 rounded-lg ${
                currentPage === page
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-red-400"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePagination(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-red-400 disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() => handlePagination(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-red-400 disabled:opacity-50"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
