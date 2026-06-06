import { useState, useEffect } from "react";
import Quiz from "./components/Quiz";
import Leaderboard from "./components/Leaderboard";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState("quiz"); // "quiz" | "leaderboard"

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1 className="app-title">⚡ QuizMaster</h1>
        <div className="header-right">
          <button
            className={`nav-btn ${page === "quiz" ? "active" : ""}`}
            onClick={() => setPage("quiz")}
          >
            Quiz
          </button>
          <button
            className={`nav-btn ${page === "leaderboard" ? "active" : ""}`}
            onClick={() => setPage("leaderboard")}
          >
            🏆 Leaderboard
          </button>
          <button
            className="dark-toggle"
            onClick={() => setDarkMode(!darkMode)}
            title="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <main className="app-main">
        {page === "quiz" ? (
          <Quiz onFinish={() => setPage("leaderboard")} />
        ) : (
          <Leaderboard />
        )}
      </main>
    </div>
  );
}

export default App;
