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

  useEffect(() => {
    if (shows.length > 0 && !selectedSeries) {
      const defaultSeries = shows[0]; // Set the first series as default
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

  return (
    <div className="bg-gray-100 text-gray-900 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto relative">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-800">
          📺 Show Library
        </h1>

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

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search shows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-96 px-5 py-3 pl-12 rounded-full shadow-md bg-white text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 h-full">
          {/* Series Column */}
          <div className="flex-none w-full sm:w-1/4 h-full overflow-auto px-4 pb-6 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Series</h2>
            <div className="space-y-4">
              {filteredShows.map((show) => (
                <div
                  key={show.seriesName}
                  className={`p-4 bg-white rounded-lg border-0 shadow-lg ${
                    selectedSeries === show
                      ? "border-red-500 shadow-xl ring-2 ring-red-400"
                      : "hover:shadow-xl hover:border-red-300"
                  } cursor-pointer`}
                  onClick={() => {
                    setSelectedSeries(show);
                    setSelectedSeason(null);
                  }}
                >
                  <h3 className="text-lg sm:text-xl font-medium text-gray-800 hover:text-red-400">
                    {show.seriesName}
                  </h3>
                  <p className="text-gray-600 text-sm italic mt-2">
                    #{show.tag}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Seasons Column */}
          <div className="flex-none w-full sm:w-1/4 h-full overflow-auto px-4 pb-6 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">
              {selectedSeries ? `${selectedSeries.seriesName}` : "Seasons"}
            </h2>
            {selectedSeries && (
              <div className="space-y-4">
                {selectedSeries.seasons.map((season, index) => (
                  <div
                    key={index}
                    className={`p-4 bg-white rounded-lg border-0 shadow-lg ${
                      selectedSeason === season
                        ? "border-red-500 shadow-xl ring-2 ring-red-400"
                        : "hover:shadow-xl hover:border-red-300"
                    } cursor-pointer`}
                    onClick={() => setSelectedSeason(season)}
                  >
                    <h3 className="text-lg sm:text-xl font-medium text-gray-800 hover:text-red-400">
                      Season {season.seasonNumber}
                    </h3>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Episodes Column */}
          <div className="flex-auto w-full sm:w-1/2 h-full overflow-y-scroll px-4 pb-6 bg-gray-50 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">
              {selectedSeason
                ? `Season ${selectedSeason.seasonNumber}`
                : "Episodes"}
            </h2>
            {selectedSeason && (
              <div className="space-y-4">
                {selectedSeason.episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className={`p-4 bg-white rounded-lg border-0 shadow-lg hover:shadow-xl hover:border-red-300`}
                  >
                    <a
                      href={episode.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-lg sm:text-xl font-medium text-gray-800 hover:text-red-400"
                    >
                      <span className="text-gray-600 text-sm">
                        #{episode.episode}
                      </span>
                      <br />
                      <span className="font-medium text-gray-800">
                        {episode.title}
                      </span>
                    </a>
                  </div>
                ))}
              </div>
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
