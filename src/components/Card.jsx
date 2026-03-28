import React from "react";

export default function Card({
  title,
  index,
  tag,
  meta,
  onClick,
  onTagClick,
  actionLabel = "VIEW",
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-start justify-between border-b border-gray-200/70 py-4 sm:bg-gray-50 sm:p-5 md:p-8 sm:transition sm:border sm:border-gray-200 sm:hover:border-red-500 sm:hover:-translate-y-1 sm:flex-col sm:items-stretch sm:min-h-[220px] md:min-h-[260px] cursor-pointer"
    >
      {/* LEFT CONTENT */}
      <div className="flex flex-col sm:block flex-1 pr-4 gap-0.5 sm:gap-1">
        {/* Desktop meta */}
        <div className="hidden sm:flex items-center justify-between mb-6">
          {index !== undefined && (
            <span className="text-[11px] tracking-widest text-gray-400">
              #{index}
            </span>
          )}

          {tag && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTagClick && onTagClick(tag);
              }}
              className="text-[10px] px-2 py-1 bg-gray-200 text-gray-600 tracking-wide hover:bg-gray-300 transition"
            >
              {(tag.startsWith("#") ? tag : "# " + tag).toUpperCase()}
            </button>
          )}
        </div>

        {/* Mobile index */}
        {index !== undefined && (
          <span className="sm:hidden text-[10px] tracking-widest text-gray-400 mb-0.5">
            {String(index).padStart(2, "0")}
          </span>
        )}

        {/* Title */}
        <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold tracking-tight leading-tight">
          {title}
        </h2>

        {/* Meta info (like seasons/episodes) */}
        {meta && (
          <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-2 tracking-wide">
            {meta}
          </div>
        )}

        {/* Mobile tag */}
        {tag && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTagClick && onTagClick(tag);
            }}
            className="sm:hidden mt-1 text-[10px] tracking-widest text-red-500/90 hover:underline text-left block"
          >
            {(tag.startsWith("#") ? tag : "# " + tag).toUpperCase()}
          </button>
        )}
      </div>

      {/* ACTION BUTTON (mobile) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick && onClick();
        }}
        className="text-[10px] border border-red-300 px-3 py-1.5 rounded-full text-red-500 sm:hidden"
      >
        {actionLabel}
      </button>

      {/* ACTION BUTTON (desktop) */}
      <div className="hidden sm:block mt-auto pt-6">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick && onClick();
          }}
          className="text-xs tracking-widest border border-gray-300 px-4 py-2 text-gray-600 bg-white hover:bg-red-500 hover:text-white hover:border-red-500 active:scale-95 transition-all duration-200"
        >
          {actionLabel} →
        </button>
      </div>
    </div>
  );
}
