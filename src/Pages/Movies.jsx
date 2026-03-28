import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// components
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import Grid from "../components/Grid";

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCardClick = (url) => {
    const cleanUrl = String(url || "").trim();

    if (!cleanUrl || !cleanUrl.startsWith("http")) return;

    window.open(cleanUrl, "_blank", "noopener,noreferrer");
  };

  const gridItems = currentMovies.map((movie) => {
    const originalIndex =
      movies.findIndex((m) => String(m.id) === String(movie.id)) + 1;

    return {
      title: movie.name,
      index: originalIndex,
      tag: movie.tags?.split(",")[0],
      onClick: () => handleCardClick(movie.url),
      actionLabel: "WATCH",
      onTagClick: (tag) => {
        const clean = tag.replace("#", "").toLowerCase();
        setSearchTerm(clean);
      },
    };
  });

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-16">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-10 sm:mb-14 md:mb-16 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-8 md:gap-10">
          <div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight leading-tight">
              JUST <span className="font-black">MOVIES</span>
            </h1>

            <p className="mt-3 sm:mt-4 md:mt-6 text-sm sm:text-base text-gray-500 max-w-xl leading-relaxed">
              A curated archive of cinematic entries. Every title indexed, every
              frame accounted for.
            </p>
          </div>

          <div className="w-full lg:w-auto flex justify-between items-center lg:flex lg:flex-col lg:items-end">
            <div>
              <div className="text-xs tracking-widest text-gray-400">
                TOTAL MOVIES
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-semibold mt-2">
                {movies.length.toLocaleString()}
              </div>
            </div>

            <button
              onClick={() => navigate("/shows")}
              className="text-[10px] sm:text-xs tracking-widest border border-gray-300 px-3 sm:px-4 py-1.5 sm:py-2 text-gray-600 hover:border-red-500 hover:text-red-500 transition lg:mt-6"
            >
              VIEW SHOWS →
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search movie or tag..."
            showButton={false}
            showBack={true}
          />
        </div>

        {/* GRID */}
        <Grid items={gridItems} emptyMessage={"No Movies Found"} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        <Footer />
      </div>
    </div>
  );
}
