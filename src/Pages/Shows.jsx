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
    <div className="min-h-screen bg-white px-6 py-16">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-16 flex flex-col lg:flex-row justify-between items-start gap-10">
          <div>
            <h1 className="text-6xl sm:text-7xl font-light tracking-tight">
              JUST <span className="font-black">SHOWS</span>
            </h1>
            <p className="mt-6 text-gray-500 max-w-xl leading-relaxed">
              A structured archive of series. Navigate seasons, explore
              episodes.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs tracking-widest text-gray-400">
              TOTAL SHOWS
            </div>
            <div className="text-4xl font-semibold mt-2">
              {shows.length.toLocaleString()}
            </div>
            <div className="mt-6">
              <button
                onClick={() => navigate("/movies")}
                className="text-xs tracking-widest border border-gray-300 px-4 py-2 text-gray-600 hover:border-red-500 hover:text-red-500 transition"
              >
                VIEW MOVIES →
              </button>
            </div>
          </div>
        </div>

        {/* PAGES INDEX */}
        <div className="mb-10 border-t border-gray-200 pt-6 text-xs text-gray-500 flex flex-wrap gap-4">
          <span className="text-red-500">PAGES:</span>
          {totalPages > 1 &&
            (() => {
              const visibleCount = 3;
              const start = Math.max(2, currentPage - 1);
              const end = Math.min(totalPages - 1, start + visibleCount - 1);
              return (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className={
                      currentPage === 1
                        ? "text-red-500 font-semibold"
                        : "text-gray-500 hover:text-red-500"
                    }
                  >
                    1
                  </button>
                  {start > 2 && <span className="text-gray-400">...</span>}
                  {Array.from(
                    { length: end - start + 1 },
                    (_, i) => start + i,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={
                        currentPage === page
                          ? "text-red-500 font-semibold"
                          : "text-gray-500 hover:text-red-500"
                      }
                    >
                      {page}
                    </button>
                  ))}
                  {end < totalPages - 1 && (
                    <span className="text-gray-400">...</span>
                  )}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={
                      currentPage === totalPages
                        ? "text-red-500 font-semibold"
                        : "text-gray-500 hover:text-red-500"
                    }
                  >
                    {totalPages}
                  </button>
                </>
              );
            })()}
        </div>

        {/* SEARCH */}
        <div className="flex justify-center mb-14">
          <div className="relative w-full">
            <button
              onClick={() => navigate("/")}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-medium text-red-500"
            >
              ← Back
            </button>
            <input
              type="text"
              placeholder="Search shows, tags, or episodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-24 pr-24 py-4 border border-gray-200 text-lg focus:outline-none focus:border-red-500 transition"
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
                className={`bg-gray-50 p-8 transition border border-gray-200 hover:border-red-500 hover:-translate-y-1 cursor-pointer flex flex-col min-h-[220px] ${
                  selectedSeries === show ? "ring-2 ring-red-500" : ""
                }`}
                onClick={() => {
                  setSelectedSeries(show);
                  setSelectedSeason(null);
                }}
                whileHover={{ scale: 1.03 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[11px] tracking-widest text-gray-400">
                    SHW. #{show.originalIndex}
                  </span>
                  {show.tag && (
                    <span className="text-[10px] px-2 py-1 bg-gray-200 text-gray-600 tracking-wide">
                      {show.tag.toUpperCase()}
                    </span>
                  )}
                </div>
                <h2 className="text-3xl font-semibold tracking-tight leading-tight">
                  {show.seriesName}
                </h2>
                <div className="mt-auto text-xs text-gray-400 tracking-widest">
                  SELECT →
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center text-gray-500">No shows found.</p>
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
                  className={`bg-gray-50 p-6 transition border border-gray-200 hover:border-red-500 hover:-translate-y-1 cursor-pointer flex flex-col min-h-[140px] ${
                    selectedSeason === season ? "ring-2 ring-red-500" : ""
                  }`}
                  onClick={() => setSelectedSeason(season)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] tracking-widest text-gray-400">
                      SEASON
                    </span>
                  </div>

                  <h3 className="text-2xl font-semibold tracking-tight">
                    {season.seasonNumber}
                  </h3>

                  <div className="mt-auto text-xs text-gray-400 tracking-widest">
                    SELECT →
                  </div>
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
                  className="bg-gray-50 p-6 transition border border-gray-200 hover:border-red-500 hover:-translate-y-1 flex flex-col min-h-[160px]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] tracking-widest text-gray-400">
                      #{episode.episode}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold leading-snug">
                    {episode.title}
                  </h3>

                  <div className="mt-auto">
                    <a
                      href={episode.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-red-500 tracking-widest"
                    >
                      WATCH →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
    </div>
  );
}
