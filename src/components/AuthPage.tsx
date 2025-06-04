import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    }
  };

  return (
    <div style={{ maxWidth: 320, margin: "2rem auto", padding: 24, background: "#23232b", borderRadius: 12 }}>
      <h2 style={{ color: "#fff" }}>{isSignUp ? "Sign Up" : "Sign In"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 12, padding: 8 }}
        />
        <button type="submit" style={{ width: "100%", padding: 10 }}>
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>
      <button
        onClick={() => setIsSignUp(s => !s)}
        style={{ marginTop: 12, background: "none", color: "#38bdf8", border: "none", cursor: "pointer" }}
      >
        {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
      </button>
      {error && <div style={{ color: "salmon", marginTop: 8 }}>{error}</div>}
    </div>
  );
}