import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TwentySix() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
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
            className="w-full sm:w-96 px-5 py-3 pl-12 rounded-full shadow-md bg-white text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Movie Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredMovies.map((movie) => (
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
                  <h2 className="text-lg sm:text-xl font-medium text-gray-800 hover:text-red-400">
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
      </div>
    </div>
  );
}
