// src/components/SideNav.jsx
import React from "react";

export default function SideNav({ active, setActive }) {
  const menu = [
    { name: "Generate", key: "generate" },
    { name: "Trending", key: "trending" },
    { name: "Analytics", key: "analytics" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-6">
      <h1 className="text-2xl font-bold mb-8">Hashtag Dashboard</h1>
      {menu.map((item) => (
        <button
          key={item.key}
          onClick={() => setActive(item.key)}
          className={`text-left p-3 mb-2 rounded-lg hover:bg-gray-700 transition ${
            active === item.key ? "bg-gray-700" : ""
          }`}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}
