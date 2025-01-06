import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion

export default function Shows() {
  const [shows, setShows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [seriesPerPage] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/shows.json")
      .then((response) => response.json())
      .then((data) => setShows(data))
      .catch((error) => console.error("Error fetching shows:", error));
  }, []);

  useEffect(() => {
    if (shows.length > 0 && !selectedSeries) {
      const defaultSeries = shows[0];
      setSelectedSeries(defaultSeries);
      setSelectedSeason(defaultSeries.seasons[0]);
    }
  }, [shows, selectedSeries]);

  useEffect(() => {
    if (
      selectedSeries &&
      selectedSeries.seasons.length > 0 &&
      !selectedSeason
    ) {
      setSelectedSeason(selectedSeries.seasons[0]);
    }
  }, [selectedSeries, selectedSeason]);

  const filteredShows = shows.filter(
    (show) =>
      show.seriesName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      show.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      show.seasons.some((season) =>
        season.episodes.some(
          (episode) =>
            episode.episode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            episode.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
  );

  // Get current series
  const indexOfLastSeries = currentPage * seriesPerPage;
  const indexOfFirstSeries = indexOfLastSeries - seriesPerPage;
  const currentSeries = filteredShows.slice(
    indexOfFirstSeries,
    indexOfLastSeries
  );

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredShows.length / seriesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-gray-100 text-gray-900 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto relative">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-800">
          📺 Show Library
        </h1>

        <div className="relative mb-6 sm:mb-10">
          <input
            type="text"
            placeholder="Search shows..."
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

        <div className="">
          {/* Series Row */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Series</h2>
            <motion.div className="w-full flex flex-wrap gap-6">
              {currentSeries.map((show, index) => (
                <motion.div
                  key={show.seriesName}
                  className={`flex-grow basis-1/2 sm:basis-1/3 lg:basis-1/4 bg-white p-6 rounded-lg border-0 shadow-lg ${
                    selectedSeries === show
                      ? "border-red-500 shadow-xl ring-2 ring-red-400"
                      : "hover:shadow-xl hover:border-red-300"
                  } cursor-pointer`}
                  onClick={() => {
                    setSelectedSeries(show);
                    setSelectedSeason(null);
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <h3 className="text-base sm:text-lg font-medium text-gray-800 hover:text-red-400">
                    {indexOfFirstSeries + index + 1}. {show.seriesName}
                  </h3>
                  <p className="text-gray-600 text-xs italic mt-2">
                    #{show.tag}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            <div className="mt-6 flex justify-center items-center space-x-4">
              <button
                className={`bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded ${
                  currentPage === 1 ? "cursor-not-allowed" : ""
                }`}
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                {currentPage - 1}
              </button>
              <span className="text-gray-600">|</span>
              <button
                className={`bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded ${
                  currentPage * seriesPerPage >= filteredShows.length
                    ? "cursor-not-allowed"
                    : ""
                }`}
                onClick={handleNextPage}
                disabled={currentPage * seriesPerPage >= filteredShows.length}
              >
                {currentPage + 1}
              </button>
            </div>
          </div>

          {/* Seasons Row */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">
              {selectedSeries ? `${selectedSeries.seriesName}` : "Seasons"}
            </h2>
            {selectedSeries && (
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {selectedSeries.seasons.map((season, index) => (
                  <motion.div
                    key={index}
                    className={`p-6 bg-white rounded-lg border-0 shadow-lg ${
                      selectedSeason === season
                        ? "border-red-500 shadow-xl ring-2 ring-red-400"
                        : "hover:shadow-xl hover:border-red-300"
                    } cursor-pointer`}
                    onClick={() => setSelectedSeason(season)}
                    whileHover={{ scale: 1.05 }}
                  >
                    <h3 className="text-base sm:text-lg font-medium text-gray-800 hover:text-red-400">
                      Season {season.seasonNumber}
                    </h3>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Episodes Row */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 mt-6">
              Season {selectedSeason?.seasonNumber}
            </h2>
            {selectedSeason && (
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {selectedSeason.episodes.map((episode) => (
                  <motion.div
                    key={episode.id}
                    className={`p-6 bg-white rounded-lg border-0 shadow-lg hover:shadow-xl hover:border-red-300`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <a
                      href={episode.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-base sm:text-lg font-medium text-gray-800 hover:text-red-400"
                    >
                      <span className="text-gray-600 text-xs">
                        #{episode.episode}
                      </span>
                      <br />
                      <span className="font-medium text-gray-800">
                        {episode.title}
                      </span>
                    </a>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {filteredShows.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No shows found. Try searching something else!
          </p>
        )}
      </div>
    </div>
  );
}
