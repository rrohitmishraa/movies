import React from "react";

export default function Card({ data }) {
  return (
    <div
      className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition duration-200 flex flex-col items-center justify-between group cursor-pointer"
      style={{
        height: "200px",
        width: "220px",
        padding: "10px",
      }}
    >
      {/* Title */}
      <div className="flex items-center justify-center h-40 bg-gray-100 w-full">
        <h2 className="text-xl font-bold text-center text-gray-800 uppercase transition-transform duration-200 group-hover:scale-110 group-hover:text-blue-600">
          {data.name || data.seriesName}{" "}
          {/* Fallback to seriesName if name is not available */}
        </h2>
      </div>

      {/* Tags */}
      <div className="bg-gray-200 w-full py-2 px-4 text-center">
        <span className="text-sm text-gray-600 font-medium transition-transform duration-200 group-hover:scale-110 group-hover:text-green-600">
          {data.tag ? `#${data.tag.trim()}` : "No tags available"}
        </span>
      </div>
    </div>
  );
}
