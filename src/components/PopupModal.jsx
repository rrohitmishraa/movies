import { motion } from "framer-motion";

export default function PopupModal({ title, content, onClose }) {
  return (
    <motion.div
      id="popup-container"
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      onClick={(e) => {
        if (e.target.id === "popup-container") onClose();
      }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full mx-4">
        <h3 className="text-center text-xl font-semibold text-gray-800">
          {title}
        </h3>
        <p className="mt-2 text-center text-gray-700">{content}</p>
        <button
          className="mt-4 px-4 py-2 w-full bg-red-500 text-white rounded-lg hover:bg-red-700 transition-all"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}
