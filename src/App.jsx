import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Movies from "./Pages/Movies";
import TwentySix from "./Pages/TwentySix";
import Shows from "./Pages/Shows";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/26" element={<TwentySix />} />
        <Route path="/shows" element={<Shows />} />
      </Routes>
    </Router>
  );
}
