import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// components
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Grid from "../components/Grid";
import { Loader2 } from "lucide-react";

export default function Shows() {
  const navigate = useNavigate();

  const [shows, setShows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingSeries, setLoadingSeries] = useState(false);
  const [loadingSeasons, setLoadingSeasons] = useState(false);

  const seriesPerPage = 6;

  // 🔥 FETCH MAIN SHOW LIST
  useEffect(() => {
    const fetchShows = async () => {
      setLoadingSeries(true);

      try {
        const res = await fetch(
          `https://myjson.unlinkly.com/api/sheet/1ujvwtpUe7vdHmbd57bSE_ZeN03YqPWJ44YLuqcB4F7Y/Sheet1?t=${Date.now()}`,
          { cache: "no-store" },
        );

        const text = await res.text();

        let json;
        try {
          json = JSON.parse(text);
        } catch {
          console.error("Invalid JSON:", text);
          return;
        }

        const data = Array.isArray(json) ? json : json?.data || [];

        const cleanData = data
          .map((s, index) => {
            const url = String(s.url || "").trim();
            const isBroken = !url || !url.startsWith("http");

            return {
              seriesName: s.name || "",
              tag: s.tags || "",
              sheetLink: url,
              seasonsCount: parseInt(s.seasons) || 0,
              hasBroken: isBroken, // 🔥 directly from main sheet
              originalIndex: index + 1,
            };
          })
          .filter((s) => s.seriesName.trim() !== "");

        setShows(cleanData);

        /*
        🔥 Background prefetch broken status (improved)
        */
        Promise.all(
          cleanData.map(async (show) => {
            if (!show.sheetLink || !show.seasonsCount) return;

            const maxCheck = Math.min(show.seasonsCount, 2); // check first 2 seasons

            let hasBroken = false;

            for (let i = 1; i <= maxCheck; i++) {
              const url = `${show.sheetLink}/Season%20${i}?t=${Date.now()}`;

              try {
                const res = await fetch(url);
                if (!res.ok) {
                  hasBroken = true;
                  break;
                }

                const json = await res.json();
                const rows = json?.data || [];

                if (rows.some((ep) => !ep.url || !ep.url.startsWith("http"))) {
                  hasBroken = true;
                  break;
                }
              } catch {
                hasBroken = true;
                break;
              }
            }

            if (hasBroken) {
              setShows((prev) =>
                prev.map((s) =>
                  s.originalIndex === show.originalIndex
                    ? { ...s, hasBroken: true }
                    : s,
                ),
              );
            }
          }),
        );
      } catch (err) {
        console.error("Error fetching shows:", err);
      } finally {
        setLoadingSeries(false);
      }
    };

    fetchShows();
  }, []);

  // 🔁 RESET PAGE ON SEARCH
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // 🧠 PREPARE SEASONS (NO EPISODES YET)
  const fetchSeasons = async (sheetUrl, seasonsCount) => {
    if (!sheetUrl) return [];

    const maxSeasons = seasonsCount > 0 ? seasonsCount : 10;

    const seasons = Array.from({ length: maxSeasons }, (_, i) => ({
      seasonNumber: i + 1,
      episodes: null,
      loaded: false,
      hasBroken: false,
    }));

    return seasons;
  };

  // 📦 FETCH SINGLE SEASON EPISODES
  const fetchSeasonEpisodes = async (sheetUrl, seasonNumber) => {
    const encodedTab = encodeURIComponent(`Season ${seasonNumber}`);
    const apiUrl = `${sheetUrl}/${encodedTab}?t=${Date.now()}`;

    try {
      const res = await fetch(apiUrl);
      if (!res.ok) return [];

      const json = await res.json();
      const rows = json?.data || [];

      const episodes = rows.map((ep) => {
        const isValid = ep.url && ep.url.startsWith("http");
        return {
          episode: ep.id || "",
          title: ep.name || "",
          link: ep.url || "",
          isBroken: !isValid,
        };
      });

      return episodes;
    } catch {
      return [];
    }
  };

  // 🎯 HANDLE SHOW CLICK
  const handleShowClick = async (show) => {
    // 🔥 ALWAYS CLEAR OLD DATA FIRST
    setSelectedSeries(null);
    setSelectedSeason(null);

    if (!show.sheetLink || show.hasBroken) {
      setSelectedSeries({
        seriesName: show.seriesName,
        seasons: [],
        error: true,
      });
      return;
    }

    setSelectedSeries({ ...show, seasons: [], loading: true });

    const seasons = await fetchSeasons(show.sheetLink, show.seasonsCount);

    const fullShow = {
      ...show,
      seasons,
    };

    // 🔥 Update shows list so card reflects broken status
    setShows((prev) =>
      prev.map((s) =>
        s.originalIndex === show.originalIndex
          ? { ...s, hasBroken: show.hasBroken }
          : s,
      ),
    );

    setSelectedSeries({ ...fullShow, loading: false });

    // 🔥 PRELOAD SEASON 1
    if (seasons[0]) {
      setLoadingSeasons(true);
      const eps = await fetchSeasonEpisodes(show.sheetLink, 1);
      seasons[0].episodes = eps;
      seasons[0].loaded = true;
      setSelectedSeason({ ...seasons[0] });
      setLoadingSeasons(false);
    }
  };

  // 🔍 FILTER
  const filteredShows = shows.filter((show) => {
    const term = searchTerm.toLowerCase();

    return (
      show.seriesName.toLowerCase().includes(term) ||
      show.tag?.toLowerCase().includes(term)
    );
  });

  // 📄 PAGINATION
  const indexOfLast = currentPage * seriesPerPage;
  const indexOfFirst = indexOfLast - seriesPerPage;

  const currentSeries = filteredShows.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredShows.length / seriesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-16">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-12 flex flex-col lg:flex-row justify-between gap-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-light">
              JUST <span className="font-black">SHOWS</span>
            </h1>
            <p className="mt-4 text-gray-500 max-w-xl">
              Browse series, seasons, and episodes.
            </p>
          </div>

          <div>
            <div className="text-xs text-gray-400">TOTAL SHOWS</div>
            <div className="text-4xl font-semibold">
              {shows.length.toLocaleString()}
            </div>

            <button
              onClick={() => navigate("/movies")}
              className="mt-6 border px-4 py-2 text-xs hover:text-red-500 hover:border-red-500"
            >
              VIEW MOVIES →
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-10">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search show or tag..."
            showButton={false}
            showBack={true}
          />
        </div>

        {/* GRID */}
        <Grid
          items={currentSeries.map((show) => ({
            title: show.seriesName,
            index: show.originalIndex,
            tag: show.tag,
            isBroken: show.hasBroken,
            meta: show.hasBroken ? "Broken Links" : "",
            onClick: () => {
              handleShowClick(show);
            },
            actionLabel: "SELECT",
            onTagClick: (tag) => {
              setSearchTerm(tag.replace("#", "").toLowerCase());
            },
          }))}
          emptyMessage={loadingSeries ? "Loading..." : "No Shows Found"}
        />

        {/* PAGINATION */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {loadingSeasons && (
          <div className="mt-10 flex items-center gap-2 text-gray-500">
            <Loader2 className="animate-spin" size={18} />
            Loading seasons...
          </div>
        )}

        {/* SEASONS */}
        {selectedSeries && (
          <div className="mt-16">
            {selectedSeries.error && (
              <div className="text-red-500 text-sm mb-4">
                Show not found, please contact admin.
              </div>
            )}
            <h2 className="text-3xl font-bold mb-6">
              {selectedSeries.seriesName}
            </h2>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {selectedSeries.seasons.map((season, i) => (
                <button
                  key={i}
                  onClick={async () => {
                    if (season.loaded) {
                      setSelectedSeason(season);
                      return;
                    }

                    setLoadingSeasons(true);
                    const eps = await fetchSeasonEpisodes(
                      selectedSeries.sheetLink,
                      season.seasonNumber,
                    );
                    season.episodes = eps;
                    season.loaded = true;
                    setSelectedSeason({ ...season });
                    setLoadingSeasons(false);
                  }}
                  className={`px-4 py-2 text-xs border ${
                    selectedSeason === season
                      ? "bg-red-500 text-white border-red-500"
                      : "border-gray-300 hover:text-red-500 hover:border-red-500"
                  }`}
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
              items={(selectedSeason.episodes || []).map((ep) => ({
                title: ep.title,
                index: ep.episode,
                isBroken: ep.isBroken,
                onClick: () => {
                  if (!ep.isBroken && ep.link?.startsWith("http")) {
                    window.open(ep.link, "_blank");
                  }
                },
                actionLabel: ep.isBroken ? "BROKEN" : "WATCH",
              }))}
            />
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}
