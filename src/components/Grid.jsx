import Card from "./Card";

export default function Grid({
  items,
  renderItem,
  children,
  cols = 3,
  gap = "gap-5 sm:gap-6 md:gap-8",
  emptyMessage = "No items found.",
  renderEmpty,
  loading = false,
  error = null,
  className = "",
}) {
  let colClass = "md:grid-cols-3";

  if (cols === 1) colClass = "md:grid-cols-1";
  else if (cols === 2) colClass = "md:grid-cols-2";
  else if (cols === 4) colClass = "md:grid-cols-4";

  const isEmpty = Array.isArray(items) && items.length === 0;

  if (loading) {
    return (
      <div className="w-full py-16 flex items-center justify-center text-gray-400 text-sm sm:text-base animate-pulse">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-16 flex items-center justify-center text-red-500 text-sm sm:text-base">
        Something went wrong.
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="w-full py-20 flex flex-col items-center justify-center text-gray-400 text-sm sm:text-base gap-2">
        {renderEmpty ? renderEmpty() : emptyMessage}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 ${colClass} ${gap} ${className}`}
    >
      {items
        ? items.map((item, index) =>
            renderItem ? (
              renderItem(item, index)
            ) : (
              <div className="transition-all duration-200 hover:scale-[1.02]">
                <Card key={index} {...item} />
              </div>
            ),
          )
        : children}
    </div>
  );
}
