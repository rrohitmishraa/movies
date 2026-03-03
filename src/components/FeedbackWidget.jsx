import { motion } from "framer-motion";

export default function FeedbackWidget({
  showForm,
  setShowForm,
  feedback,
  setFeedback,
  onSubmit,
  loading,
}) {
  return (
    <motion.div
      className="fixed bottom-4 right-4"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {!showForm && (
        <button
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all"
          onClick={() => setShowForm(true)}
        >
          Feedback
        </button>
      )}

      {showForm && (
        <motion.div
          className="bg-white p-4 rounded-lg shadow-lg w-80"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Feedback Form
          </h3>

          <textarea
            className="w-full p-2 border rounded-md mb-2"
            placeholder="Enter your suggestions"
            value={feedback.suggestions}
            onChange={(e) =>
              setFeedback({ ...feedback, suggestions: e.target.value })
            }
          />

          <input
            type="text"
            className="w-full p-2 border rounded-md mb-4"
            placeholder="Your Name"
            value={feedback.name}
            onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
          />

          <div className="flex justify-between">
            <button
              className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

            <button
              className={`bg-green-500 text-white px-4 py-2 rounded-md ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
              }`}
              onClick={onSubmit}
              disabled={loading}
            >
              {loading ? "Sending..." : "Submit"}
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
