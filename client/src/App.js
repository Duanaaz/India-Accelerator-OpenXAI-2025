import { useState } from "react";

function App() {
  const [keyword, setKeyword] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateHashtags = async () => {
    if (!keyword) return;
    setLoading(true);
    setError("");
    setHashtags([]);

    try {
      const res = await fetch("http://localhost:5000/api/hashtags/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });

      const data = await res.json();

      if (data.hashtags) {
        setHashtags(data.hashtags);
      } else {
        setError("No hashtags found.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate hashtags.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Hashtag Generator
        </h1>

        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter a keyword..."
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
        />

        <button
          onClick={generateHashtags}
          className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Hashtags"}
        </button>

        {error && (
          <p className="text-red-500 mt-4 text-center">{error}</p>
        )}

        {hashtags.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2 text-gray-700">
              Generated Hashtags:
            </h2>
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
