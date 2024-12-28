import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/movies.json")
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
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          🎥 Movie Library
        </h1>

        {/* Search Bar */}
        <div className="relative mb-10">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-96 mx-auto block px-5 py-3 rounded-full shadow-md bg-white text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-3 left-3 w-6 h-6 text-gray-400 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            onClick={() => navigate("/")}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 16l-4-4m0 0l4-4m-4 4h16"
            />
          </svg>
        </div>

        {/* Movie Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition duration-200"
            >
              <a
                href={movie.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4"
              >
                <h2 className="text-xl font-medium text-gray-800 hover:text-red-400">
                  {movie.name}
                </h2>
                <p className="mt-2 text-gray-600">{"#" + movie.tags}</p>
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
