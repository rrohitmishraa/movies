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
            originalIndex: index + 1,
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
    <div className="min-h-screen bg-brand-soft px-6 py-14">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-extrabold">Movie Library</h1>

          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => navigate("/shows")}
              className="bg-brand-gradient text-white px-6 py-3 rounded-full shadow-md hover:scale-105 transition"
            >
              Shows
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
              placeholder="Search movies or tags..."
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {currentMovies.map((movie) => {
              return (
                <div
                  key={movie.id}
                  onClick={() => handleCardClick(movie.url)}
                  className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition cursor-pointer border border-gray-100"
                >
                  <div className="text-xs text-gray-400 mb-3">
                    #{movie.originalIndex}
                  </div>

                  <h2 className="text-xl font-bold mb-4">{movie.name}</h2>

                  <div className="flex flex-wrap gap-2">
                    {movie.tags &&
                      movie.tags.split(",").map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-500"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">No movies found.</p>
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
      </div>
    </div>
  );
}
