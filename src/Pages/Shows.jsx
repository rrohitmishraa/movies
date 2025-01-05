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
      setSelectedSeries(defaultSeries); // Set the first series as selected
      setSelectedSeason(defaultSeries.seasons[0]); // Set the first season of the selected series
    }
  }, [shows, selectedSeries]);

  useEffect(() => {
    if (
      selectedSeries &&
      selectedSeries.seasons.length > 0 &&
      !selectedSeason
    ) {
      setSelectedSeason(selectedSeries.seasons[0]); // Set the first season of the selected series
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
    <div className="bg-gray-100 text-gray-900 p-6">
      <div className="max-w-5xl mx-auto relative">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          📺 Show Library
        </h1>

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

        <div className="flex gap-4 h-full">
          {/* Series Column */}
          <div className="flex-none w-1/4 h-full overflow-auto px-4 pb-6">
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
                    setSelectedSeason(null); // Reset selected season when series is changed
                  }}
                >
                  <h3 className="text-xl font-medium text-gray-800 hover:text-red-400">
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
          <div className="flex-none w-1/4 h-full overflow-auto px-4 pb-6">
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
                    <h3 className="text-xl font-medium text-gray-800 hover:text-red-400">
                      Season {season.seasonNumber}
                    </h3>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Episodes Column */}
          <div className="flex-auto w-1/2 h-full overflow-y-scroll px-4 pb-6">
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
                      className="block text-xl font-medium text-gray-800 hover:text-red-400"
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
