import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Shows() {
  const navigate = useNavigate();

  const [shows, setShows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const seriesPerPage = 6;

  // Fetch shows and store original index
  useEffect(() => {
    fetch("/shows.json")
      .then((res) => res.json())
      .then((data) => {
        const cleanData = data
          .filter((s) => s.seriesName && s.seriesName.trim() !== "")
          .map((show, index) => ({
            ...show,
            originalIndex: index + 1,
          }));

        setShows(cleanData);
      })
      .catch((err) => console.error("Error fetching shows:", err));
  }, []);

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter logic (same structure as Movies)
  const filteredShows = shows.filter((show) => {
    const term = searchTerm.toLowerCase();

    return (
      show.seriesName.toLowerCase().includes(term) ||
      show.tag?.toLowerCase().includes(term) ||
      show.seasons?.some((season) =>
        season.episodes?.some(
          (episode) =>
            episode.episode?.toLowerCase().includes(term) ||
            episode.title?.toLowerCase().includes(term),
        ),
      )
    );
  });

  // Pagination
  const indexOfLastSeries = currentPage * seriesPerPage;
  const indexOfFirstSeries = indexOfLastSeries - seriesPerPage;

  const currentSeries = filteredShows.slice(
    indexOfFirstSeries,
    indexOfLastSeries,
  );

  const totalPages = Math.ceil(filteredShows.length / seriesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-brand-soft px-6 py-14">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-extrabold">Show Library</h1>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => navigate("/movies")}
              className="bg-brand-gradient text-white px-6 py-3 rounded-full shadow-md hover:scale-105 transition"
            >
              Movies
            </button>
          </div>
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
              placeholder="Search shows, tags, or episodes..."
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

        {/* SERIES GRID */}
        {currentSeries.length > 0 ? (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {currentSeries.map((show) => (
              <motion.div
                key={show.seriesName}
                className={`bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition cursor-pointer border border-gray-100 ${
                  selectedSeries === show ? "ring-2 ring-brand-blue" : ""
                }`}
                onClick={() => {
                  setSelectedSeries(show);
                  setSelectedSeason(null);
                }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="text-xs text-gray-400 mb-3">
                  #{show.originalIndex}
                </div>

                <h2 className="text-xl font-bold mb-4">{show.seriesName}</h2>

                <p className="text-xs text-gray-500">#{show.tag}</p>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-gray-500">No shows found.</p>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-16 flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
            >
              First
            </button>

            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
            >
              Previous
            </button>

            <span className="px-4 py-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
            >
              Next
            </button>

            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
            >
              Last
            </button>
          </div>
        )}

        {/* SEASONS */}
        {selectedSeries && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6">
              {selectedSeries.seriesName}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {selectedSeries.seasons.map((season, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition cursor-pointer border ${
                    selectedSeason === season
                      ? "ring-2 ring-brand-blue"
                      : "border-gray-100"
                  }`}
                  onClick={() => setSelectedSeason(season)}
                >
                  <h3 className="font-semibold text-lg">
                    Season {season.seasonNumber}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EPISODES */}
        {selectedSeason && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6">
              Season {selectedSeason.seasonNumber}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {selectedSeason.episodes.map((episode) => (
                <div
                  key={episode.id}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition border border-gray-100"
                >
                  <a
                    href={episode.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <span className="text-xs text-gray-400">
                      #{episode.episode}
                    </span>

                    <div className="font-semibold mt-2">{episode.title}</div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
