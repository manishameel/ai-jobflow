import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Mail, Lock, User } from 'lucide-react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/signup', { name, email, password });
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 relative overflow-hidden">

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-bg font-bold text-sm font-display">J</span>
            </div>
            <span className="font-display font-semibold text-lg tracking-tight">AI JobFlow</span>
          </div>
          <h1 className="font-display text-2xl font-medium text-text-primary">Create your account</h1>
          <p className="text-text-muted text-sm mt-1">Start tracking applications with AI</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-2xl p-8 space-y-5">

          {error && (
            <div className="bg-status-rejected/10 border border-status-rejected/30 text-status-rejected text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Full name</label>
            <div className="relative mt-2">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your Name"
                className="w-full bg-bg border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/60 outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Email</label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-bg border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/60 outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Password</label>
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="At least 6 characters"
                className="w-full bg-bg border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/60 outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-bg font-medium text-sm rounded-lg py-2.5 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>

          <p className="text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:underline">Sign in</Link>
          </p>

        </form>
      </div>
    </div>
  );
}