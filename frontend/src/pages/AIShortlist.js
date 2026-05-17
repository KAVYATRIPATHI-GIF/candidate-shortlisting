import React, { useState } from "react";
import { aiShortlist } from "../utils/api";
import "./AIShortlist.css";

export default function AIShortlist() {
  const [jobTitle, setJobTitle] = useState("");
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [preferredSkills, setPreferredSkills] = useState([]);
  const [minExperience, setMinExperience] = useState("");
  const [reqInput, setReqInput] = useState("");
  const [prefInput, setPrefInput] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const addSkill = (list, setList, input, setInput) => {
    const s = input.trim();
    if (s && !list.includes(s)) setList([...list, s]);
    setInput("");
  };

  const removeSkill = (list, setList, item) => setList(list.filter((s) => s !== item));

  const handleAIShortlist = async () => {
    if (requiredSkills.length === 0) return setError("Add at least one required skill.");
    setError("");
    setLoading(true);
    setResults(null);
    try {
      const res = await aiShortlist({ jobTitle, requiredSkills, preferredSkills, minExperience: Number(minExperience) || 0 });
      setResults(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "AI shortlisting failed. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "var(--high)";
    if (score >= 55) return "var(--medium)";
    return "var(--low)";
  };

  return (
    <div className="ai-shortlist fade-up">
      <div className="page-header">
        <div>
          <div className="ai-badge">🤖 Powered by OpenRouter AI</div>
          <h1 className="page-title">AI Candidate Shortlisting</h1>
          <p className="page-subtitle">Let AI analyze profiles, rank candidates, and generate interview questions</p>
        </div>
      </div>

      <div className="ai-layout">
        {/* Input */}
        <div className="ai-input card">
          <h2 className="section-title">Job Details</h2>

          <div className="form-group">
            <label>Job Title</label>
            <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Senior React Developer" />
          </div>

          <div className="form-group">
            <label>Required Skills <span className="required">*</span></label>
            <div className="skill-input-row">
              <input value={reqInput} onChange={(e) => setReqInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(requiredSkills, setRequiredSkills, reqInput, setReqInput); } }}
                placeholder="Press Enter to add" />
              <button className="btn-secondary" onClick={() => addSkill(requiredSkills, setRequiredSkills, reqInput, setReqInput)}>Add</button>
            </div>
            <div className="skills-list">{requiredSkills.map(s => (
              <span key={s} className="skill-chip skill-chip-required">
                {s}<button className="chip-remove" onClick={() => removeSkill(requiredSkills, setRequiredSkills, s)}>×</button>
              </span>
            ))}</div>
          </div>

          <div className="form-group">
            <label>Preferred Skills</label>
            <div className="skill-input-row">
              <input value={prefInput} onChange={(e) => setPrefInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(preferredSkills, setPreferredSkills, prefInput, setPrefInput); } }}
                placeholder="Press Enter to add" />
              <button className="btn-secondary" onClick={() => addSkill(preferredSkills, setPreferredSkills, prefInput, setPrefInput)}>Add</button>
            </div>
            <div className="skills-list">{preferredSkills.map(s => (
              <span key={s} className="skill-chip skill-chip-preferred">
                {s}<button className="chip-remove" onClick={() => removeSkill(preferredSkills, setPreferredSkills, s)}>×</button>
              </span>
            ))}</div>
          </div>

          <div className="form-group">
            <label>Min Experience (years)</label>
            <input type="number" min="0" value={minExperience} onChange={(e) => setMinExperience(e.target.value)} placeholder="e.g. 2" />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button className="btn-primary ai-btn" onClick={handleAIShortlist} disabled={loading}>
            {loading
              ? <><span className="spinner" style={{ width: 16, height: 16 }} /> AI is analyzing...</>
              : <><span>🤖</span> Run AI Shortlisting</>}
          </button>

          {loading && (
            <div className="ai-loading-msg">
              <div className="loading-dot-row">
                <span className="ldot" /><span className="ldot" /><span className="ldot" />
              </div>
              <p>Analyzing all candidate profiles with AI...</p>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="ai-results">
          {!results ? (
            <div className="results-placeholder">
              <div className="placeholder-glow">🤖</div>
              <h3>AI Analysis Ready</h3>
              <p>Configure job requirements and run AI shortlisting to get intelligent candidate rankings with explanations</p>
            </div>
          ) : (
            <>
              {results.summary && (
                <div className="ai-summary card">
                  <div className="summary-label">📊 AI Summary</div>
                  <p className="summary-text">{results.summary}</p>
                  {results.model && <span className="model-badge">Model: {results.model}</span>}
                </div>
              )}

              <div className="ai-results-list">
                {results.rankedCandidates.map((c, i) => (
                  <div key={i} className={`ai-result-card card ${i === 0 ? "top-result" : ""}`}>
                    <div className="ai-result-header" onClick={() => setExpandedId(expandedId === i ? null : i)}>
                      <div className="rank-badge">{getRankBadge(c.rank)}</div>
                      <div className="result-avatar-ai">{c.name?.[0] || "?"}</div>
                      <div className="result-info">
                        <div className="result-name">{c.name}</div>
                        {c.email && <div className="result-email">{c.email}</div>}
                      </div>
                      <div className="ai-score-section">
                        <div className="ai-score" style={{ color: getScoreColor(c.aiScore) }}>
                          {c.aiScore}
                        </div>
                        <div className="ai-score-label">AI Score</div>
                      </div>
                      <button className="expand-btn">{expandedId === i ? "▲" : "▼"}</button>
                    </div>

                    {c.skills && (
                      <div className="result-skills">
                        {c.skills.map(s => <span key={s} className="badge badge-skill">{s}</span>)}
                        {c.experience !== undefined && (
                          <span className="tag">⏱ {c.experience} yrs</span>
                        )}
                      </div>
                    )}

                    <div className="ai-explanation">
                      <span className="expl-icon">💡</span>
                      <p>{c.explanation}</p>
                    </div>

                    {expandedId === i && c.interviewQuestions && c.interviewQuestions.length > 0 && (
                      <div className="interview-questions">
                        <h4 className="iq-title">🎤 Interview Questions</h4>
                        <ol className="iq-list">
                          {c.interviewQuestions.map((q, qi) => (
                            <li key={qi} className="iq-item">{q}</li>
                          ))}
                        </ol>
                      </div>
                    )}
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
