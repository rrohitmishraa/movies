import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TwentySix() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const moviesPerPage = 20;
  const visiblePageCount = 5;

  // Fetch movies and store original index
  useEffect(() => {
    fetch(
      `https://myjson.unlinkly.com/api/sheet/1ejPpiDw_eEWovr05C-G0NTwe3ll8996gzfCWm0nzbjg/TwentySix?t=${Date.now()}`,
    )
      .then((res) => res.json())
      .then((json) => {
        const data = Array.isArray(json) ? json : json?.data || [];

        const cleanData = data
          .filter((m) => m.name && String(m.name).trim() !== "")
          .map((movie, index) => ({
            ...movie,
            originalIndex: index + 1,
          }));

        setMovies(cleanData);
      })
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter logic (same as Movies)
  const filteredMovies = movies.filter((movie) => {
    const term = searchTerm.toLowerCase();

    return (
      String(movie.name).toLowerCase().includes(term) ||
      String(movie.tags || "")
        .toLowerCase()
        .includes(term)
    );
  });

  // Pagination logic
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;

  const currentMovies = filteredMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie,
  );

  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  // Page number window
  const startPage = Math.max(1, currentPage - Math.floor(visiblePageCount / 2));

  const endPage = Math.min(totalPages, startPage + visiblePageCount - 1);

  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index,
  );

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-brand-soft px-6 py-14">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-extrabold">
            TwentySix Library
          </h1>
        </div>

        {/* SEARCH */}
        <div className="flex justify-center mb-14">
          <div className="relative w-full max-w-2xl">
            <button
              onClick={() => navigate("/")}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-medium text-brand-blue"
            >
              ← Back
            </button>

            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-24 pr-24 py-5 rounded-full border border-gray-200 shadow-md text-lg focus:outline-none focus:ring-4 focus:ring-brand-softBlue focus:border-brand-blue transition"
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500"
              >
                Clear ✕
              </button>
            )}
          </div>
        </div>

        {/* GRID */}
        {currentMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentMovies.map((movie) => (
              <div
                key={movie.id}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition border border-gray-100"
              >
                <a
                  href={movie.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="text-xs text-gray-400 mb-3">
                    #{movie.originalIndex}
                  </div>

                  <h2 className="text-xl font-bold mb-4">{movie.name}</h2>

                  <p className="text-xs text-gray-500">#{movie.tags}</p>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No movies found.</p>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => handlePagination(1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
            >
              First
            </button>

            <button
              onClick={() => handlePagination(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
            >
              Previous
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => handlePagination(page)}
                className={`px-4 py-2 rounded ${
                  currentPage === page
                    ? "bg-brand-blue text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePagination(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
            >
              Next
            </button>

            <button
              onClick={() => handlePagination(totalPages)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
            >
              Last
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
