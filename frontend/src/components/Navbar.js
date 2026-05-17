import React from "react";
import "./Navbar.css";

const NAV_ITEMS = [
  { id: "candidates", label: "Candidates", icon: "👥" },
  { id: "add", label: "Add Candidate", icon: "➕" },
  { id: "match", label: "Match Jobs", icon: "🎯" },
  { id: "ai", label: "AI Shortlist", icon: "🤖" },
];

export default function Navbar({ active, setActive }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">⚡</span>
        <span className="brand-text">TalentAI</span>
      </div>
      <div className="navbar-links">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-link ${active === item.id ? "active" : ""}`}
            onClick={() => setActive(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
