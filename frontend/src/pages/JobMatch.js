import React, { useState } from "react";
import { matchCandidates } from "../utils/api";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";
import "./JobMatch.css";

export default function JobMatch() {
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [preferredSkills, setPreferredSkills] = useState([]);
  const [minExperience, setMinExperience] = useState("");
  const [reqInput, setReqInput] = useState("");
  const [prefInput, setPrefInput] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addToList = (list, setList, input, setInput) => {
    const s = input.trim();
    if (s && !list.includes(s)) setList([...list, s]);
    setInput("");
  };

  const removeFromList = (list, setList, item) => setList(list.filter((s) => s !== item));

  const handleMatch = async () => {
    if (requiredSkills.length === 0) return setError("Add at least one required skill.");
    setError("");
    setLoading(true);
    try {
      const res = await matchCandidates({ requiredSkills, preferredSkills, minExperience: Number(minExperience) || 0 });
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Matching failed.");
    } finally {
      setLoading(false);
    }
  };

  const chartData = results?.results?.slice(0, 8).map((c) => ({
    name: c.name.split(" ")[0],
    score: c.matchScore,
  }));

  const getColor = (level) => ({ High: "#43e97b", Medium: "#f9ca24", Low: "#ff6b6b" }[level] || "#6c63ff");

  return (
    <div className="job-match fade-up">
      <div className="page-header">
        <h1 className="page-title">Job Matching</h1>
        <p className="page-subtitle">Define job requirements and find matching candidates</p>
      </div>

      <div className="match-layout">
        {/* Input Panel */}
        <div className="match-input card">
          <h2 className="section-title">Job Requirements</h2>

          <div className="form-group">
            <label>Required Skills <span className="required">*</span></label>
            <div className="skill-input-row">
              <input value={reqInput} onChange={(e) => setReqInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addToList(requiredSkills, setRequiredSkills, reqInput, setReqInput); } }}
                placeholder="Press Enter to add" />
              <button className="btn-secondary" onClick={() => addToList(requiredSkills, setRequiredSkills, reqInput, setReqInput)}>Add</button>
            </div>
            <div className="skills-list">{requiredSkills.map(s => (
              <span key={s} className="skill-chip skill-chip-required">
                {s}<button className="chip-remove" onClick={() => removeFromList(requiredSkills, setRequiredSkills, s)}>×</button>
              </span>
            ))}</div>
          </div>

          <div className="form-group">
            <label>Preferred Skills</label>
            <div className="skill-input-row">
              <input value={prefInput} onChange={(e) => setPrefInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addToList(preferredSkills, setPreferredSkills, prefInput, setPrefInput); } }}
                placeholder="Press Enter to add" />
              <button className="btn-secondary" onClick={() => addToList(preferredSkills, setPreferredSkills, prefInput, setPrefInput)}>Add</button>
            </div>
            <div className="skills-list">{preferredSkills.map(s => (
              <span key={s} className="skill-chip skill-chip-preferred">
                {s}<button className="chip-remove" onClick={() => removeFromList(preferredSkills, setPreferredSkills, s)}>×</button>
              </span>
            ))}</div>
          </div>

          <div className="form-group">
            <label>Minimum Experience (years)</label>
            <input type="number" min="0" value={minExperience} onChange={(e) => setMinExperience(e.target.value)} placeholder="e.g. 2" />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button className="btn-primary match-btn" onClick={handleMatch} disabled={loading}>
            {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Matching...</> : "Find Matches →"}
          </button>
        </div>

        {/* Results Panel */}
        <div className="match-results">
          {!results ? (
            <div className="results-placeholder">
              <div className="placeholder-icon">🎯</div>
              <p>Set requirements and click "Find Matches" to see ranked candidates</p>
            </div>
          ) : (
            <>
              <div className="results-summary">
                <div className="summary-stat">
                  <span className="stat-num">{results.total}</span>
                  <span className="stat-label">Matches Found</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-num">{results.results.filter(c => c.matchLevel === "High").length}</span>
                  <span className="stat-label">High Match</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-num">{results.results.filter(c => c.matchLevel === "Medium").length}</span>
                  <span className="stat-label">Medium Match</span>
                </div>
              </div>

              {chartData && chartData.length > 0 && (
                <div className="chart-section card">
                  <h3 className="chart-title">Match Score Overview</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                      <YAxis domain={[0, 100]} tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                      <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                      <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, i) => <Cell key={i} fill={entry.score >= 80 ? "#43e97b" : entry.score >= 50 ? "#f9ca24" : "#ff6b6b"} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              <div className="results-list">
                {results.results.map((c, i) => (
                  <div key={c._id} className="result-card card">
                    <div className="result-header">
                      <div className="result-rank">#{i + 1}</div>
                      <div className="result-avatar">{c.name[0]}</div>
                      <div className="result-info">
                        <div className="result-name">{c.name}</div>
                        <div className="result-email">{c.email}</div>
                      </div>
                      <div className="result-right">
                        <div className="score-circle" style={{ "--score-color": getColor(c.matchLevel) }}>
                          {c.matchScore}%
                        </div>
                        <span className={`badge badge-${c.matchLevel.toLowerCase()}`}>{c.matchLevel}</span>
                      </div>
                    </div>
                    <div className="result-details">
                      <div className="result-detail">
                        <span className="detail-label">⏱ Experience</span>
                        <span className={c.meetsExperience ? "exp-ok" : "exp-fail"}>
                          {c.experience} yrs {c.meetsExperience ? "✓" : "✗"}
                        </span>
                      </div>
                      <div className="result-detail">
                        <span className="detail-label">✅ Matched</span>
                        <div className="match-skills">
                          {c.matchedSkills.map(s => <span key={s} className="badge badge-skill">{s}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
