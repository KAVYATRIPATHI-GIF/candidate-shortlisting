import React, { useState } from "react";
import Navbar from "./components/Navbar";
import CandidateList from "./pages/CandidateList";
import AddCandidate from "./pages/AddCandidate";
import JobMatch from "./pages/JobMatch";
import AIShortlist from "./pages/AIShortlist";
import "./App.css";

export default function App() {
  const [activePage, setActivePage] = useState("candidates");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCandidateAdded = () => {
    setRefreshKey((k) => k + 1);
    setTimeout(() => setActivePage("candidates"), 500);
  };

  return (
    <div className="app">
      <Navbar active={activePage} setActive={setActivePage} />
      <main className="main-content">
        {activePage === "candidates" && <CandidateList key={refreshKey} />}
        {activePage === "add" && <AddCandidate onAdded={handleCandidateAdded} />}
        {activePage === "match" && <JobMatch />}
        {activePage === "ai" && <AIShortlist />}
      </main>
    </div>
  );
}
