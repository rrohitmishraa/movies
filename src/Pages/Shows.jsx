import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Shows() {
  const [shows, setShows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/shows.json")
      .then((response) => response.json())
      .then((data) => setShows(data))
      .catch((error) => console.error("Error fetching shows:", error));
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          📺 Show Library
        </h1>

        {/* Search Bar */}
        <div className="relative mb-10">
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

        {/* Series List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShows.map((show) => (
            <div
              key={show.seriesName}
              className={`${
                selectedSeries === show
                  ? "bg-blue-100 border-2 border-blue-500"
                  : "bg-white"
              } rounded-lg shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition duration-200`}
            >
              <a
                href="#"
                onClick={() => {
                  setSelectedSeries(show);
                  setSelectedSeason(null);
                }}
                className="block p-4 cursor-pointer"
              >
                <h2 className="text-xl font-medium text-gray-800 hover:text-red-400">
                  {show.seriesName}
                </h2>
                <p className="text-gray-600 text-sm italic mt-2">#{show.tag}</p>
              </a>
            </div>
          ))}
        </div>

        {/* Selected Series & Seasons */}
        {selectedSeries && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">
              {selectedSeries.seriesName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedSeries.seasons.map((season, index) => (
                <div
                  key={index}
                  className={`${
                    selectedSeason === season
                      ? "bg-blue-100 border-2 border-blue-500"
                      : "bg-white"
                  } rounded-lg shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition duration-200`}
                >
                  <a
                    href="#"
                    onClick={() => setSelectedSeason(season)}
                    className="block p-4 cursor-pointer"
                  >
                    <h3 className="text-xl font-medium text-gray-800 hover:text-red-400">
                      Season {season.seasonNumber}
                    </h3>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Season & Episodes */}
        {selectedSeason && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">
              Season {selectedSeason.seasonNumber} - {selectedSeries.seriesName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {selectedSeason.episodes.map((episode) => (
                <div
                  key={episode.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition duration-200"
                >
                  <a
                    href={episode.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-4"
                  >
                    <h3 className="text-xl font-medium text-gray-800 hover:text-red-400">
                      {episode.episode}
                    </h3>
                    <p className="mt-2 text-gray-600 text-sm">
                      {episode.title}
                    </p>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results Found */}
        {filteredShows.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No shows found. Try searching something else!
          </p>
        )}
      </div>
    </div>
  );
}
