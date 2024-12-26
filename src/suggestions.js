export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userName, movieSuggestion } = req.body;

    if (!userName || !movieSuggestion) {
      return res.status(400).json({ error: "Both fields are required!" });
    }

    // Save suggestions locally
    const suggestion = {
      userName,
      movieSuggestion,
      date: new Date().toISOString(),
    };

    const filePath = "suggestions.json";

    try {
      const existingData = localStorage.getItem(filePath)
        ? JSON.parse(localStorage.getItem(filePath))
        : [];

      // Add new suggestion
      existingData.push(suggestion);

      // Save updated data to localStorage
      localStorage.setItem(filePath, JSON.stringify(existingData));

      res.json({ message: "Suggestion saved successfully!" });
    } catch (error) {
      res.status(500).json({ error: "Failed to save the suggestion." });
    }
  } else {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
