import { useEffect, useState } from "react";

// The component now accepts a `count` prop to make it reusable.
// We set a default value of 10 if no count is provided.
export default function Trending({ count = 10 }) {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedTag, setCopiedTag] = useState(null); // State to track copied tag for UI feedback

  // This function handles copying the hashtag to the clipboard.
  const handleCopyToClipboard = (tag) => {
    const hashtagText = `#${tag}`;
    navigator.clipboard.writeText(hashtagText)
      .then(() => {
        setCopiedTag(tag); // Set the copied tag to provide feedback
        // Reset the feedback message after 2 seconds
        setTimeout(() => {
          setCopiedTag(null);
        }, 2000);
      })
      .catch(err => {
        console.error("Failed to copy hashtag:", err);
      });
  };

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      setError("");

      try {
        // The fetch URL is now dynamic based on the `count` prop.
        const res = await fetch(`http://localhost:5000/api/hashtags/trending/top${count}`);

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.statusText}`);
        }
        
        const data = await res.json();
        setTrending(data.hashtags || []);

      } catch (err) {
        console.error("Error fetching trending hashtags:", err);
        setError("Failed to load trending hashtags.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [count]); // The effect will re-run if the `count` prop ever changes.

  if (loading) return <p className="text-center p-6 text-gray-500">Loading trending hashtags...</p>;
  if (error) return <p className="text-center p-6 text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg">
      {/* The title is also dynamic now. */}
      <h2 className="text-2xl font-semibold mb-4 text-center">Top {count} Trending Hashtags</h2>
      <ul className="flex flex-wrap gap-2 justify-center">
        {trending.map((tag) => (
          <li
            key={tag} // Using the tag itself as a key, assuming they are unique.
            onClick={() => handleCopyToClipboard(tag)}
            className={`px-3 py-1 rounded-full text-sm cursor-pointer transition ${
              copiedTag === tag 
                ? 'bg-green-200 text-green-800' // Style for feedback on copy
                : 'bg-blue-100 text-blue-800 hover:bg-blue-200' // Default style
            }`}
          >
            {copiedTag === tag ? 'Copied!' : `#${tag}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

