import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Flame, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import "./LoginPage.css";

/**
 * Registration screen for NutriTrack. Shares LoginPage's visual style
 * (same CSS classes) so both screens feel like one consistent flow.
 */
export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password, passwordConfirmation);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-brand-icon">
            <Flame size={20} />
          </span>
          <span className="login-brand-name">NutriTrack</span>
        </div>

        <h1 className="login-title">Create your account</h1>
        <p className="login-subtitle">
          Start tracking your meals and reaching your goals.
        </p>

        {error && <div className="login-alert login-alert-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="name">Name</label>
            <div className="login-input-wrapper">
              <User size={17} className="login-input-icon" />
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="email">Email</label>
            <div className="login-input-wrapper">
              <Mail size={17} className="login-input-icon" />
              <input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <div className="login-input-wrapper">
              <Lock size={17} className="login-input-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <button
                type="button"
                className="login-toggle-password"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="password_confirmation">Confirm password</label>
            <div className="login-input-wrapper">
              <Lock size={17} className="login-input-icon" />
              <input
                id="password_confirmation"
                type={showPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="login-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
