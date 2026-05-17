const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");

// POST /api/match - Basic skill matching
router.post("/", async (req, res) => {
  try {
    const { requiredSkills, minExperience, preferredSkills = [] } = req.body;

    if (!requiredSkills || requiredSkills.length === 0) {
      return res.status(400).json({ error: "requiredSkills is required." });
    }

    const candidates = await Candidate.find();

    const results = candidates
      .map((candidate) => {
        const reqMatched = candidate.skills.filter((s) =>
          requiredSkills.map((r) => r.toLowerCase()).includes(s.toLowerCase())
        );
        const prefMatched = candidate.skills.filter((s) =>
          preferredSkills.map((p) => p.toLowerCase()).includes(s.toLowerCase())
        );

        const requiredScore = reqMatched.length / requiredSkills.length;
        const preferredScore =
          preferredSkills.length > 0 ? prefMatched.length / preferredSkills.length : 0;

        const totalScore = preferredSkills.length > 0
          ? requiredScore * 0.7 + preferredScore * 0.3
          : requiredScore;

        const meetsExperience = candidate.experience >= (minExperience || 0);

        let matchLevel = "Low";
        if (totalScore >= 0.8 && meetsExperience) matchLevel = "High";
        else if (totalScore >= 0.5) matchLevel = "Medium";

        return {
          _id: candidate._id,
          name: candidate.name,
          email: candidate.email,
          skills: candidate.skills,
          experience: candidate.experience,
          bio: candidate.bio,
          matchedSkills: reqMatched,
          preferredMatchedSkills: prefMatched,
          matchScore: Math.round(totalScore * 100),
          meetsExperience,
          matchLevel,
        };
      })
      .filter((c) => c.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json({ results, total: results.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
