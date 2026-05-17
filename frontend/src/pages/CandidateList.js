import React, { useEffect, useState } from "react";
import { getCandidates, deleteCandidate } from "../utils/api";
import "./CandidateList.css";

export default function CandidateList() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await getCandidates();
      setCandidates(res.data);
    } catch {
      setError("Failed to load candidates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCandidates(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    try {
      await deleteCandidate(id);
      setCandidates((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert("Failed to delete candidate.");
    }
  };

  const filtered = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="candidate-list fade-up">
      <div className="page-header">
        <div>
          <h1 className="page-title">All Candidates</h1>
          <p className="page-subtitle">{candidates.length} registered candidates</p>
        </div>
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or skill..."
            className="search-input"
          />
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <span className="spinner" style={{ width: 32, height: 32 }} />
          <p>Loading candidates...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🧑‍💼</div>
          <p>{search ? "No candidates match your search." : "No candidates yet. Add some!"}</p>
        </div>
      ) : (
        <div className="candidates-grid">
          {filtered.map((c, i) => (
            <div key={c._id} className="candidate-card card" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="candidate-header">
                <div className="candidate-avatar">{c.name[0].toUpperCase()}</div>
                <div className="candidate-info">
                  <h3 className="candidate-name">{c.name}</h3>
                  <p className="candidate-email">{c.email}</p>
                </div>
                <button className="btn-danger" onClick={() => handleDelete(c._id, c.name)}>
                  Delete
                </button>
              </div>

              <div className="candidate-meta">
                <span className="meta-item">
                  <span className="meta-icon">⏱</span>
                  {c.experience} yr{c.experience !== 1 ? "s" : ""} exp
                </span>
                {c.bio && (
                  <span className="meta-item bio-item">
                    <span className="meta-icon">📝</span>
                    {c.bio}
                  </span>
                )}
              </div>

              <div className="skills-row">
                {c.skills.map((skill) => (
                  <span key={skill} className="badge badge-skill">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
