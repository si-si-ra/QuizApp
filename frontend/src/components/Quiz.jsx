import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Quiz.css";

const API = "http://127.0.0.1:8000/api";

const DIFFICULTY_COLORS = {
  easy: "#10b981",
  medium: "#f59e0b",
  hard: "#ef4444",
};

function Quiz({ onFinish }) {
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [started, setStarted] = useState(false);

  // Timer
  const [timeLeft, setTimeLeft] = useState(null);
  const QUESTION_TIME = 20;

  // Leaderboard submission
  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Get auth token
  const getAuthHeader = () => {
    const token = localStorage.getItem("access_token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Fetch categories on mount
  useEffect(() => {
    axios
      .get(`${API}/categories/`, getAuthHeader())
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ shuffle: "true" });
      if (selectedCategory) params.append("category", selectedCategory);
      if (selectedDifficulty) params.append("difficulty", selectedDifficulty);

      const res = await axios.get(
        `${API}/questions/?${params}`,
        getAuthHeader()
      );
      if (res.data.length === 0) {
        setError("No questions found for these filters. Try a different combination.");
        setLoading(false);
        return;
      }
      setQuestions(res.data);
      setCurrentQuestion(0);
      setAnswers({});
      setScore(0);
      setFinished(false);
      setStarted(true);
      setTimeLeft(QUESTION_TIME);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError("Could not reach the server. Make sure Django is running.");
      }
    }
    setLoading(false);
  }, [selectedCategory, selectedDifficulty]);

  // Timer countdown
  useEffect(() => {
    if (!started || finished || timeLeft === null) return;
    if (timeLeft === 0) {
      handleNext();
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, started, finished]);

  const handleOptionSelect = (option) => {
    setAnswers({ ...answers, [currentQuestion]: option });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((c) => c + 1);
      setTimeLeft(QUESTION_TIME);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((c) => c - 1);
      setTimeLeft(QUESTION_TIME);
    }
  };

  const handleSubmit = () => {
    let total = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct_answer) total++;
    });
    setScore(total);
    setFinished(true);
  };

  const handleRestart = () => {
    setStarted(false);
    setFinished(false);
    setSubmitted(false);
    setPlayerName("");
    setAnswers({});
    setCurrentQuestion(0);
    setScore(0);
  };

  const handleLeaderboardSubmit = async () => {
    try {
      // Save score to user's quiz results (requires auth)
      const resultData = {
        score,
        total_questions: questions.length,
      };

      // Only include category if one was selected
      if (selectedCategory) {
        resultData.category = selectedCategory;
      }

      const response = await axios.post(
        `${API}/result/`,
        resultData,
        getAuthHeader()
      );

      console.log("Score saved:", response.data);

      // Also submit to public leaderboard (no auth required)
      if (playerName.trim()) {
        try {
          await axios.post(`${API}/leaderboard/`, {
            name: playerName.trim(),
            score,
            total: questions.length,
            category: selectedCategory || null,
            difficulty: selectedDifficulty,
          });
        } catch (lbErr) {
          console.warn("Leaderboard submission failed (non-critical):", lbErr.message);
          // Non-critical error, continue anyway
        }
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Score submission error:", err.response?.data || err.message);
      alert(
        "Failed to submit score: " +
          (err.response?.data?.score?.[0] ||
            err.response?.data?.total_questions?.[0] ||
            err.response?.data?.detail ||
            "Unknown error")
      );
    }
  };

  const getScoreLabel = () => {
    const pct = (score / questions.length) * 100;
    if (pct === 100) return { emoji: "🏆", label: "Perfect Score!", color: "#10b981" };
    if (pct >= 70) return { emoji: "🎉", label: "Great Job!", color: "#4f46e5" };
    if (pct >= 40) return { emoji: "👍", label: "Good Effort!", color: "#f59e0b" };
    return { emoji: "📚", label: "Keep Practicing!", color: "#ef4444" };
  };

  // ── START SCREEN ──────────────────────────────────────────
  if (!started) {
    return (
      <div className="quiz-card start-screen">
        <div className="start-icon">🧠</div>
        <h2>Ready to Test Your Knowledge?</h2>
        <p className="start-sub">Choose your filters and hit Start!</p>

        {error && <div className="error-msg">{error}</div>}

        <div className="filters">
          <div className="filter-group">
            <label>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <button
          className="btn btn-primary btn-large"
          onClick={fetchQuestions}
          disabled={loading}
        >
          {loading ? "Loading..." : "Start Quiz 🚀"}
        </button>
      </div>
    );
  }

  // ── RESULT SCREEN ─────────────────────────────────────────
  if (finished) {
    const { emoji, label, color } = getScoreLabel();
    return (
      <div className="quiz-card result-screen">
        <div className="result-emoji">{emoji}</div>
        <h2 style={{ color }}>{label}</h2>

        <div className="score-display">
          <span className="score-num">{score}</span>
          <span className="score-sep">/</span>
          <span className="score-total">{questions.length}</span>
        </div>

        <div className="result-breakdown">
          {questions.map((q, i) => {
            const userAns = answers[i];
            const correct = userAns === q.correct_answer;
            return (
              <div key={q.id} className={`breakdown-item ${correct ? "correct" : "wrong"}`}>
                <span className="breakdown-icon">{correct ? "✅" : "❌"}</span>
                <span className="breakdown-q">{q.question}</span>
                {!correct && (
                  <span className="breakdown-ans">
                    Correct: <strong>{q.correct_answer}</strong>
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {!submitted ? (
          <div className="leaderboard-submit">
            <h3>Save Your Score</h3>
            <div className="lb-input-row">
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={50}
              />
              <button
                className="btn btn-primary"
                onClick={handleLeaderboardSubmit}
                disabled={!playerName.trim()}
              >
                Submit
              </button>
            </div>
          </div>
        ) : (
          <p className="submit-success">✅ Score saved to leaderboard!</p>
        )}

        <div className="result-actions">
          <button className="btn btn-primary" onClick={handleRestart}>
            🔄 Play Again
          </button>
          {submitted && (
            <button className="btn btn-secondary" onClick={onFinish}>
              🏆 Leaderboard
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── QUIZ SCREEN ───────────────────────────────────────────
  const q = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLast = currentQuestion === questions.length - 1;
  const timerPct = (timeLeft / QUESTION_TIME) * 100;
  const timerColor = timeLeft > 10 ? "#10b981" : timeLeft > 5 ? "#f59e0b" : "#ef4444";

  return (
    <div className="quiz-card">
      {/* Header row */}
      <div className="quiz-top">
        <span className="q-counter">
          {currentQuestion + 1} / {questions.length}
        </span>
        {q.category_name && (
          <span className="badge badge-category">{q.category_name}</span>
        )}
        <span
          className="badge"
          style={{
            background: DIFFICULTY_COLORS[q.difficulty],
            color: "#fff",
          }}
        >
          {q.difficulty}
        </span>
      </div>

      {/* Progress bar */}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Timer */}
      <div className="timer-row">
        <div className="timer-track">
          <div
            className="timer-fill"
            style={{ width: `${timerPct}%`, background: timerColor }}
          />
        </div>
        <span className="timer-label" style={{ color: timerColor }}>
          {timeLeft}s
        </span>
      </div>

      {/* Question */}
      <h2 className="question-text">{q.question}</h2>

      {/* Options */}
      <div className="options-list">
        {[q.option1, q.option2, q.option3, q.option4].map((option, idx) => (
          <label
            key={idx}
            className={`option-label ${answers[currentQuestion] === option ? "selected" : ""}`}
          >
            <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
            <input
              type="radio"
              name={`q-${currentQuestion}`}
              value={option}
              checked={answers[currentQuestion] === option}
              onChange={() => handleOptionSelect(option)}
            />
            <span className="option-text">{option}</span>
          </label>
        ))}
      </div>

      {/* Navigation */}
      <div className="nav-buttons">
        <button
          className="btn btn-secondary"
          onClick={handlePrev}
          disabled={currentQuestion === 0}
        >
          ← Previous
        </button>

        {!isLast ? (
          <button
            className="btn btn-primary"
            onClick={handleNext}
          >
            Next →
          </button>
        ) : (
          <button
            className="btn btn-success"
            onClick={handleSubmit}
          >
            Submit Quiz ✓
          </button>
        )}
      </div>
    </div>
  );
}

export default Quiz;
