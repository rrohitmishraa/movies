export default function SearchBar({ value, onChange, onSearch, onKeyPress }) {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full relative">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          placeholder="Search a word..."
          className="
            w-full
            text-lg sm:text-xl
            px-6 py-4
            rounded-full
            border-2 border-gray-200
            focus:border-pink-400
            focus:ring-4 focus:ring-pink-100
            outline-none
            transition-all
            shadow-sm
          "
        />
      </div>

      <button
        onClick={onSearch}
        className="
          mt-6
          px-10 py-3
          text-lg font-semibold
          rounded-full
          bg-gradient-to-r from-pink-500 to-blue-500
          text-white
          hover:scale-105
          active:scale-95
          transition-transform
          shadow-md
        "
      >
        Search
      </button>
    </div>
  );
}
