export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 mt-16 sm:mt-20 px-4 sm:px-6 py-6 sm:py-8 text-xs text-gray-400">
      <div className="max-w-7xl mx-auto flex flex-row justify-between items-center gap-2 sm:gap-4">
        <div className="flex flex-col">
          <span className="text-red-500 font-semibold tracking-widest text-[10px] sm:text-xs">
            BY UNLINKLY
          </span>
          <span className="mt-1 sm:mt-2 opacity-70 text-[10px] sm:text-xs">
            © 2026 UNLINKLY.COM
          </span>
        </div>

        <div className="flex gap-4 sm:gap-8 tracking-wide text-[10px] sm:text-xs">
          <span>MADE FOR ME</span>
        </div>
      </div>
    </footer>
  );
}
