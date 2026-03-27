import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Movies() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const moviesPerPage = 20;

  // Fetch movies from YOUR API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(
          `https://myjson.unlinkly.com/api/sheet/1ejPpiDw_eEWovr05C-G0NTwe3ll8996gzfCWm0nzbjg/Movies?t=${Date.now()}`,
          { cache: "no-store" },
        );

        const text = await res.text();

        let json;
        try {
          json = JSON.parse(text);
        } catch (e) {
          console.error("Invalid JSON response:", text);
          return;
        }

        const data = Array.isArray(json) ? json : json?.data || [];

        const cleanData = data
          .map((m, index) => ({
            ...m,
            name: m.name || "",
            url: m.url || m["url_"] || m["url "] || "",
            tags: m.tags || "",
          }))
          .filter((m) => m.name && m.name.trim() !== "")
          .reverse();

        setMovies(cleanData);
      } catch (err) {
        console.error("Error loading movies:", err);
      }
    };

    fetchMovies();
  }, []);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter movies
  const filteredMovies = movies.filter((movie) => {
    const term = searchTerm.toLowerCase();

    return (
      String(movie.name || "")
        .toLowerCase()
        .includes(term) ||
      String(movie.tags || "")
        .toLowerCase()
        .includes(term)
    );
  });

  // Pagination
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;

  const currentMovies = filteredMovies.slice(
    indexOfFirstMovie,
    indexOfLastMovie,
  );

  const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCardClick = (url) => {
    const cleanUrl = String(url || "").trim();

    if (!cleanUrl || !cleanUrl.startsWith("http")) return;

    window.open(cleanUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-16 flex flex-col lg:flex-row justify-between items-start gap-10">
          <div>
            <h1 className="text-6xl sm:text-7xl font-light tracking-tight">
              JUST <span className="font-black">MOVIES</span>
            </h1>

            <p className="mt-6 text-gray-500 max-w-xl leading-relaxed">
              A curated archive of cinematic entries. Every title indexed, every
              frame accounted for.
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs tracking-widest text-gray-400">
              TOTAL MOVIES
            </div>
            <div className="text-4xl font-semibold mt-2">
              {movies.length.toLocaleString()}
            </div>
            <div className="mt-6">
              <button
                onClick={() => navigate("/shows")}
                className="text-xs tracking-widest border border-gray-300 px-4 py-2 text-gray-600 hover:border-red-500 hover:text-red-500 transition"
              >
                VIEW SHOWS →
              </button>
            </div>
          </div>
        </div>

        <div className="mb-10 border-t border-gray-200 pt-6 text-xs text-gray-500 flex flex-wrap gap-4">
          <span className="text-red-500">PAGES:</span>
          {totalPages > 1 &&
            (() => {
              const visibleCount = 3; // fixed number of middle pages
              const start = Math.max(2, currentPage - 1);
              const end = Math.min(totalPages - 1, start + visibleCount - 1);

              return (
                <>
                  {/* First page */}
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

                  {/* Left dots */}
                  {start > 2 && <span className="text-gray-400">...</span>}

                  {/* Middle pages (fixed count) */}
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

                  {/* Right dots */}
                  {end < totalPages - 1 && (
                    <span className="text-gray-400">...</span>
                  )}

                  {/* Last page */}
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
              placeholder="Search movies or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-24 pr-24 py-4 border border-gray-200 text-lg focus:outline-none focus:border-black transition"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {currentMovies.map((movie) => {
              const originalIndex =
                movies.findIndex((m) => String(m.id) === String(movie.id)) + 1;
              return (
                <div
                  key={movie.id}
                  className="bg-gray-50 p-8 transition border border-gray-200 hover:border-red-500 hover:-translate-y-1 flex flex-col min-h-[260px]"
                >
                  {/* Top meta row */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[11px] tracking-widest text-gray-400">
                      MVI #{originalIndex}
                    </span>

                    {movie.tags && (
                      <span className="text-[10px] px-2 py-1 bg-gray-200 text-gray-600 tracking-wide">
                        {movie.tags.split(",")[0].trim().toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl font-semibold tracking-tight leading-tight mb-10">
                    {movie.name}
                  </h2>

                  {/* Spacer to push button down */}
                  <div className="flex-grow" />

                  {/* Watch button */}
                  <button
                    className="w-full border border-red-300 py-4 text-sm tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(movie.url);
                    }}
                  >
                    WATCH NOW ▶
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">No movies found.</p>
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
