import React, { useState } from "react";
import { addCandidate } from "../utils/api";
import "./AddCandidate.css";

const SAMPLE_SKILLS = ["React", "Node.js", "MongoDB", "Python", "Java", "AWS", "Docker", "TypeScript", "Vue", "PostgreSQL", "Redis", "GraphQL"];

export default function AddCandidate({ onAdded }) {
  const [form, setForm] = useState({ name: "", email: "", skills: [], experience: "", bio: "" });
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSkill = (skill) => {
    const s = skill.trim();
    if (s && !form.skills.includes(s)) {
      setForm({ ...form, skills: [...form.skills, s] });
    }
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
  };

  const handleSkillKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.email || form.skills.length === 0 || !form.experience) {
      return setError("Please fill in all required fields and add at least one skill.");
    }

    setLoading(true);
    try {
      await addCandidate({ ...form, experience: Number(form.experience) });
      setSuccess(`✅ ${form.name} added successfully!`);
      setForm({ name: "", email: "", skills: [], experience: "", bio: "" });
      if (onAdded) onAdded();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add candidate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-candidate fade-up">
      <div className="page-header">
        <h1 className="page-title">Add Candidate</h1>
        <p className="page-subtitle">Register a new candidate profile for shortlisting</p>
      </div>

      <div className="add-form-wrapper card">
        <form onSubmit={handleSubmit} className="add-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name <span className="required">*</span></label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Rahul Sharma" />
            </div>
            <div className="form-group">
              <label>Email <span className="required">*</span></label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="rahul@gmail.com" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Experience (years) <span className="required">*</span></label>
              <input name="experience" type="number" min="0" max="50" value={form.experience} onChange={handleChange} placeholder="e.g. 2" />
            </div>
            <div className="form-group">
              <label>Bio / Projects</label>
              <input name="bio" value={form.bio} onChange={handleChange} placeholder="Brief description (optional)" />
            </div>
          </div>

          <div className="form-group">
            <label>Skills <span className="required">*</span></label>
            <div className="skill-input-row">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKey}
                placeholder="Type a skill and press Enter"
              />
              <button type="button" className="btn-secondary" onClick={() => addSkill(skillInput)}>
                Add
              </button>
            </div>
            <div className="skill-suggestions">
              {SAMPLE_SKILLS.filter(s => !form.skills.includes(s)).map(s => (
                <button key={s} type="button" className="suggestion-chip" onClick={() => addSkill(s)}>
                  + {s}
                </button>
              ))}
            </div>
            {form.skills.length > 0 && (
              <div className="skills-list">
                {form.skills.map((skill) => (
                  <span key={skill} className="skill-chip">
                    {skill}
                    <button type="button" className="chip-remove" onClick={() => removeSkill(skill)}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}

          <button type="submit" className="btn-primary submit-btn" disabled={loading}>
            {loading ? <><span className="spinner" style={{width:16,height:16}} /> Adding...</> : "Add Candidate →"}
          </button>
        </form>
      </div>
    </div>
  );
}
