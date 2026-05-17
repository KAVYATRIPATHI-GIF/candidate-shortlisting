const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const fetch = require("node-fetch");

// POST /api/ai/shortlist - AI-based candidate shortlisting
router.post("/shortlist", async (req, res) => {
  try {
    const { requiredSkills, minExperience, preferredSkills = [], jobTitle = "the role" } = req.body;

    if (!requiredSkills || requiredSkills.length === 0) {
      return res.status(400).json({ error: "requiredSkills is required." });
    }

    const candidates = await Candidate.find();

    if (candidates.length === 0) {
      return res.status(400).json({ error: "No candidates in database." });
    }

    const candidateList = candidates
      .map(
        (c, i) =>
          `${i + 1}. ${c.name} - Skills: ${c.skills.join(", ")} - Experience: ${c.experience} years${c.bio ? ` - Bio: ${c.bio}` : ""}`
      )
      .join("\n");

    const prompt = `You are an expert technical recruiter. Analyze and rank the following candidates for a job.

Job Requirements:
- Job Title: ${jobTitle}
- Required Skills: ${requiredSkills.join(", ")}
- Minimum Experience: ${minExperience || 0} years
- Preferred Skills: ${preferredSkills.length > 0 ? preferredSkills.join(", ") : "None"}

Candidates:
${candidateList}

Please provide:
1. A ranked list of candidates from best fit to least fit
2. A match score (0-100) for each candidate
3. A brief explanation (2-3 sentences) for each candidate explaining why they are or aren't suitable
4. Interview questions for the top 2 candidates

Respond in this exact JSON format:
{
  "rankedCandidates": [
    {
      "name": "candidate name",
      "rank": 1,
      "aiScore": 85,
      "explanation": "reason for ranking",
      "interviewQuestions": ["question1", "question2", "question3"]
    }
  ],
  "summary": "overall summary of the candidate pool"
}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Candidate Shortlisting System",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      return res.status(500).json({ error: "OpenRouter API error", details: errData });
    }

    const data = await response.json();
    const aiResponse = JSON.parse(data.choices[0].message.content);

    // Merge AI results with candidate DB data
    const enriched = aiResponse.rankedCandidates.map((aiC) => {
      const dbCandidate = candidates.find(
        (c) => c.name.toLowerCase() === aiC.name.toLowerCase()
      );
      return {
        ...aiC,
        ...(dbCandidate ? {
          _id: dbCandidate._id,
          email: dbCandidate.email,
          skills: dbCandidate.skills,
          experience: dbCandidate.experience,
          bio: dbCandidate.bio,
        } : {}),
      };
    });

    res.json({
      rankedCandidates: enriched,
      summary: aiResponse.summary,
      model: data.model,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ai/interview-questions - Generate interview questions for a candidate
router.post("/interview-questions", async (req, res) => {
  try {
    const { candidateId, jobTitle, requiredSkills } = req.body;
    const candidate = await Candidate.findById(candidateId);

    if (!candidate) return res.status(404).json({ error: "Candidate not found." });

    const prompt = `Generate 5 technical interview questions for ${candidate.name} who has skills in ${candidate.skills.join(", ")} with ${candidate.experience} years of experience, applying for ${jobTitle || "a tech role"} requiring ${requiredSkills?.join(", ") || "various skills"}.

Return JSON: { "questions": ["q1", "q2", "q3", "q4", "q5"] }`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
