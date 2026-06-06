import { useEffect, useState } from "react";
import axios from "axios";
import "./Leaderboard.css";

const API = "http://127.0.0.1:8000/api";

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/leaderboard/`)
      .then((res) => setEntries(res.data))
      .finally(() => setLoading(false));
  }, []);

  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  const getPct = (score, total) =>
    total > 0 ? Math.round((score / total) * 100) : 0;

  if (loading) {
    return (
      <div className="lb-card">
        <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
          Loading leaderboard...
        </p>
      </div>
    );
  }

  return (
    <div className="lb-card">
      <h2 className="lb-title">🏆 Leaderboard</h2>
      <p className="lb-sub">Top 10 scores</p>

      {entries.length === 0 ? (
        <p className="lb-empty">
          No entries yet. Be the first to submit your score!
        </p>
      ) : (
        <table className="lb-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player</th>
              <th>Score</th>
              <th>%</th>
              <th>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => (
              <tr key={entry.id} className={idx < 3 ? "top-row" : ""}>
                <td className="medal">{getMedal(idx)}</td>
                <td className="player-name">{entry.name}</td>
                <td>
                  <span className="score-pill">
                    {entry.score}/{entry.total}
                  </span>
                </td>
                <td>
                  <div className="pct-bar-wrap">
                    <div
                      className="pct-bar"
                      style={{ width: `${getPct(entry.score, entry.total)}%` }}
                    />
                    <span>{getPct(entry.score, entry.total)}%</span>
                  </div>
                </td>
                <td>
                  {entry.difficulty ? (
                    <span className={`diff-badge diff-${entry.difficulty}`}>
                      {entry.difficulty}
                    </span>
                  ) : (
                    <span className="diff-badge diff-all">all</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaderboard;
