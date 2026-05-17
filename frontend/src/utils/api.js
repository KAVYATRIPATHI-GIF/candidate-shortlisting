import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Candidates
export const addCandidate = (data) => API.post("/candidates", data);
export const getCandidates = () => API.get("/candidates");
export const deleteCandidate = (id) => API.delete(`/candidates/${id}`);

// Matching
export const matchCandidates = (data) => API.post("/match", data);

// AI
export const aiShortlist = (data) => API.post("/ai/shortlist", data);
export const generateInterviewQuestions = (data) => API.post("/ai/interview-questions", data);

export default API;
