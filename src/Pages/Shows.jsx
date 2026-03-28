import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// components
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Grid from "../components/Grid";

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

  useEffect(() => {
    if (selectedSeries && selectedSeries.seasons?.length > 0) {
      setSelectedSeason(selectedSeries.seasons[0]);
    }
  }, [selectedSeries]);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-16">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10 sm:mb-14 md:mb-16 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8 md:gap-10">
          <div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-tight">
              JUST <span className="font-black">SHOWS</span>
            </h1>
            <p className="mt-3 sm:mt-4 md:mt-6 text-sm sm:text-base text-gray-500 max-w-xl leading-relaxed">
              A structured archive of series. Navigate seasons, explore
              episodes.
            </p>
          </div>
          <div className="w-full lg:w-auto flex justify-between items-center lg:flex-col lg:items-end">
            <div>
              <div className="text-xs tracking-widest text-gray-400">
                TOTAL SHOWS
              </div>
              <div className="text-4xl font-semibold mt-1 lg:mt-2">
                {shows.length.toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => navigate("/movies")}
              className="text-xs tracking-widest border border-gray-300 px-4 py-2 text-gray-600 hover:border-red-500 hover:text-red-500 transition lg:mt-6"
            >
              VIEW MOVIES →
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search show or tag..."
            showButton={false}
            showBack={true}
          />
        </div>

        {/* SERIES GRID */}
        <Grid
          items={currentSeries.map((show) => ({
            title: show.seriesName,
            index: show.originalIndex,
            tag: show.tag,
            meta: `${show.seasons?.length || 0} SEASONS • ${
              show.seasons?.reduce(
                (acc, s) => acc + (s.episodes?.length || 0),
                0,
              ) || 0
            } EPISODES`,
            onClick: () => {
              setSelectedSeries(show);
              setSelectedSeason(null);
            },
            onTagClick: (tag) => {
              const clean = tag.replace("#", "").toLowerCase();
              setSearchTerm(clean);
            },
            actionLabel: "SELECT",
          }))}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* SEASONS */}
        {selectedSeries && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-6">
              {selectedSeries.seriesName}
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {selectedSeries.seasons.map((season, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSeason(season)}
                  className={`
                    px-4 py-2 text-xs tracking-widest border whitespace-nowrap transition
                    ${
                      selectedSeason === season
                        ? "bg-red-500 text-white border-red-500"
                        : "border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500"
                    }
                  `}
                >
                  S{season.seasonNumber}
                </button>
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
            <Grid
              items={selectedSeason.episodes.map((episode) => ({
                title: episode.title,
                index: episode.episode,
                onClick: () => window.open(episode.link, "_blank"),
                actionLabel: "WATCH",
              }))}
            />
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}
