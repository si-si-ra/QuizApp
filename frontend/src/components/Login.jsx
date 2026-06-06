import { useState } from "react";
import axios from "axios";
import "./Login.css";

const API = "http://127.0.0.1:8000/api";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${API}/login/`, {
        username,
        password,
      });

      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("username", username);

      onLoginSuccess();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Login failed. Check credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API}/register/`, {
        username,
        email,
        password,
        password_confirm: passwordConfirm,
      });

      setError("");
      alert("Registration successful! Please login.");
      setIsRegister(false);
      setUsername("");
      setPassword("");
      setEmail("");
      setPasswordConfirm("");
    } catch (err) {
      setError(
        err.response?.data?.username?.[0] ||
          err.response?.data?.password?.[0] ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      if (!username || !email || !password || !passwordConfirm) {
        setError("All fields are required");
        return;
      }
      handleRegister();
    } else {
      if (!username || !password) {
        setError("Username and password are required");
        return;
      }
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">⚡ QuizMaster</h1>
        <h2 className="login-subtitle">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label htmlFor="passwordConfirm">Confirm Password</label>
              <input
                id="passwordConfirm"
                type="password"
                placeholder="Confirm password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary btn-large"
            disabled={loading}
          >
            {loading ? "Loading..." : isRegister ? "Register" : "Login"}
          </button>
        </form>

        <p className="toggle-auth">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            className="toggle-btn"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            disabled={loading}
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
