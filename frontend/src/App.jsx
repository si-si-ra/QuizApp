import { useState, useEffect } from "react";
import Quiz from "./components/Quiz";
import Leaderboard from "./components/Leaderboard";
import Login from "./components/Login";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState("quiz"); // "quiz" | "leaderboard"
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("access_token");
    const savedUsername = localStorage.getItem("username");
    if (token) {
      setIsLoggedIn(true);
      setUsername(savedUsername || "User");
    }

    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setUsername(localStorage.getItem("username") || "User");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
    setPage("quiz");
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

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
          <span className="username-display">👤 {username}</span>
          <button
            className="logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            🚪 Logout
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
