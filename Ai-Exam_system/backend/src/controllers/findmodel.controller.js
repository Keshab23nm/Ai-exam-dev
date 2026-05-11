export const listModels = async (req, res) => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
    );

    const data = await response.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};