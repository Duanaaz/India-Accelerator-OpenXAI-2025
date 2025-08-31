import React, { useState, useEffect } from 'react';

// --- SVG Icons (as React Components) for a polished look ---
const SparklesIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const FireIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.586 21c-.523-2.312-1.34-4.42-2.542-6.24C6 13.16 5 12.12 5 11c0-2 .5-4 2.5-6C9.5 3 11 4 11 5.5c0 1.5-1 3-1 3s.5-1 2-1c2 0 3 .5 3 2.5s-1 2.5-1 2.5 .5 1.5 1.5 3c1 1.5 1.5 2.5 1.5 3.5 0 1.5-2 3.5-3.5 4.5-1.5 1-2.5 1.5-3.5 1.5-1 0-2.5-.5-3.414-1.414z" />
  </svg>
);

const TagIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-5 5a2 2 0 01-2.828 0l-7-7A2 2 0 013 8V5a2 2 0 012-2zm0 0v.01" />
  </svg>
);

const ChartBarIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const ClipboardIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m-6 4h.01M9 16h.01M11 16h.01" />
  </svg>
);


// --- Component: SideNav ---
function SideNav({ active, setActive }) {
  const navItems = [
    { id: 'generate', name: 'AI Generator', icon: <SparklesIcon /> },
    { id: 'trending', name: 'Trending', icon: <FireIcon /> },
    { id: 'categorized', name: 'Categories', icon: <TagIcon /> },
    { id: 'analyze', name: 'Analytics', icon: <ChartBarIcon /> },
  ];

  return (
    <nav className="w-64 bg-white shadow-lg flex-shrink-0">
      <div className="p-6 text-2xl font-bold text-indigo-600 border-b">
        #Hashtagify
      </div>
      <ul className="py-4">
        {navItems.map(item => (
          <li key={item.id} className="px-4">
            <button
              onClick={() => setActive(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 my-1 rounded-lg text-left transition-all duration-200 ${
                active === item.id 
                ? 'bg-indigo-500 text-white shadow-md' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {React.cloneElement(item.icon, { className: 'w-6 h-6' })}
              <span className="font-medium">{item.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// --- Component: HashtagGenerator ---
function HashtagGenerator() {
  const [keyword, setKeyword] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateHashtags = async (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    setLoading(true);
    setError("");
    setHashtags([]);

    try {
      const res = await fetch("http://localhost:5000/api/hashtags/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      if (!res.ok) throw new Error("Failed to generate hashtags.");
      const data = await res.json();
      setHashtags(data.hashtags || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
  };
  
  const copyAll = () => {
    copyToClipboard(hashtags.join(' '));
  };

  return (
    <div className="w-full max-w-2xl">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">AI Hashtag Generator</h1>
          <p className="text-gray-500 mb-6">Enter a keyword to generate relevant hashtags using AI.</p>
          <form onSubmit={generateHashtags} className="flex gap-4">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g., sustainable fashion"
              className="flex-1 px-4 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </form>
        </div>
        
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        
        {hashtags.length > 0 && (
            <div className="mt-8 bg-white p-8 rounded-2xl shadow-xl">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Generated Hashtags</h2>
                    <button onClick={copyAll} className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Copy All</button>
                </div>
                <div className="flex flex-wrap gap-3">
                    {hashtags.map((tag, idx) => (
                        <button key={idx} onClick={() => copyToClipboard(tag)} className="group flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-indigo-100 hover:text-indigo-800 transition">
                            <span>{tag}</span>
                            <ClipboardIcon className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition" />
                        </button>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
}


// --- Component: Trending ---
function Trending({ count }) {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`http://localhost:5000/api/hashtags/trending/top${count}`);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
        const data = await res.json();
        setTrending(data.hashtags || []);
      } catch (err) {
        setError("Failed to load trending hashtags.");
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, [count]);

  if (loading) return <div className="bg-white p-6 rounded-xl shadow-md w-full"><p className="text-center">Loading...</p></div>;
  if (error) return <div className="bg-white p-6 rounded-xl shadow-md w-full"><p className="text-center text-red-500">{error}</p></div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full">
      <h2 className="text-xl font-semibold mb-4">Top {count} Trending Hashtags</h2>
      <div className="flex flex-wrap gap-2">
        {trending.map((tag, idx) => (
          <div key={idx} className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full">
            #{tag}
          </div>
        ))}
      </div>
    </div>
  );
}


// --- Component: CategorizedTrending ---
function CategorizedTrending() {
    const [categories, setCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  
    useEffect(() => {
      const fetchCategorized = async () => {
        setLoading(true);
        setError("");
        try {
          const res = await fetch("http://localhost:5000/api/hashtags/trending/categorized");
          if (!res.ok) throw new Error("Failed to fetch categorized hashtags.");
          const data = await res.json();
          setCategories(data || {});
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchCategorized();
    }, []);
  
    if (loading) return <div className="bg-white p-6 rounded-xl shadow-md w-full"><p className="text-center">Generating categories with AI...</p></div>;
    if (error) return <div className="bg-white p-6 rounded-xl shadow-md w-full"><p className="text-center text-red-500">{error}</p></div>;
  
    return (
      <div className="w-full space-y-6">
        {Object.entries(categories).map(([category, tags]) => (
          <div key={category} className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold mb-3 capitalize text-indigo-700">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {(tags).map((tag, idx) => (
                <div key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                  #{tag}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
}

// --- Component: AnalyzeHashtag ---
function AnalyzeHashtag() {
    const [hashtag, setHashtag] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
  
    const handleAnalyze = async (e) => {
      e.preventDefault();
      if (!hashtag.trim()) return;
      setLoading(true);
      setError("");
      setAnalysis(null);
  
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
  
      // Mock data for display
      setAnalysis({
        hashtag: hashtag.startsWith('#') ? hashtag : `#${hashtag}`,
        totalPosts: Math.floor(Math.random() * (2000000 - 50000 + 1)) + 50000,
        avgLikes: Math.floor(Math.random() * (5000 - 100 + 1)) + 100,
        engagementRate: (Math.random() * (5 - 1) + 1).toFixed(2),
      });
  
      setLoading(false);
    };
  
    const StatCard = ({ title, value, icon }) => (
      <div className="bg-gray-50 p-6 rounded-lg flex items-center gap-4">
          <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
              {icon}
          </div>
          <div>
              <p className="text-sm text-gray-500 font-medium">{title}</p>
              <p className="text-2xl font-bold text-gray-800">{typeof value === 'number' ? value.toLocaleString() : value}</p>
          </div>
      </div>
    );
  
    return (
      <div className="w-full max-w-2xl">
        <div className="bg-white p-8 rounded-2xl shadow-xl">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Hashtag Analytics</h1>
          <p className="text-gray-500 mb-6">Enter a hashtag to get its performance metrics.</p>
          <form onSubmit={handleAnalyze} className="flex gap-4">
            <input
              type="text"
              value={hashtag}
              onChange={(e) => setHashtag(e.target.value)}
              placeholder="e.g., #digitalmarketing"
              className="flex-1 px-4 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>
        </div>
  
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        
        {analysis && (
          <div className="mt-8 bg-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Analysis for <span className="text-indigo-600">{analysis.hashtag}</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard title="Total Posts" value={analysis.totalPosts} icon={<TagIcon className="w-6 h-6"/>} />
              <StatCard title="Average Likes" value={analysis.avgLikes} icon={<FireIcon className="w-6 h-6"/>} />
              <StatCard title="Engagement Rate" value={`${analysis.engagementRate}%`} icon={<SparklesIcon className="w-6 h-6"/>} />
            </div>
          </div>
        )}
      </div>
    );
}


// --- Main App Component ---
export default function App() {
  const [active, setActive] = useState("generate");

  const getTitle = () => {
    switch(active) {
        case 'generate': return 'AI Hashtag Generator';
        case 'trending': return 'Trending Hashtags';
        case 'categorized': return 'Hashtags by Category';
        case 'analyze': return 'Hashtag Analytics';
        default: return 'Dashboard';
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <SideNav active={active} setActive={setActive} />
      <main className="flex-1 p-10">
        <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-gray-800">{getTitle()}</h1>
        </header>
        <div className="flex flex-col items-center gap-8">
            {active === "generate" && <HashtagGenerator />}
            {active === "trending" && (
                <div className="w-full max-w-4xl space-y-8">
                    <Trending count={10} />
                    <Trending count={50} />
                </div>
            )}
            {active === "categorized" && (
                <div className="w-full max-w-4xl">
                    <CategorizedTrending />
                </div>
            )}
            {active === "analyze" && (
                <div className="w-full max-w-4xl">
                    <AnalyzeHashtag />
                </div>
            )}
        </div>
      </main>
    </div>
  );
}

