import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN' || user.role === 'ROLE_SUPERADMIN') navigate('/admin', { replace: true });
      else if (user.role === 'STORE_OWNER') navigate('/owner', { replace: true });
      else navigate('/stores', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/signup', formData);
      login(response.data.user, response.data.token);
      navigate('/stores');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ maxWidth: '500px', margin: '3rem auto', padding: '2.5rem' }}>
      <h2 className="text-center">Create an Account</h2>
      <p className="text-center" style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Join StoreRating to review your favorite stores</p>
      
      {error && <div style={{ background: 'var(--danger)', color: 'white', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label">Full Name</label>
          <input 
            type="text" 
            name="name"
            className="input-field" 
            value={formData.name}
            onChange={handleChange}
            required
            minLength={20}
            maxLength={60}
            placeholder="Min 20 characters, Max 60 characters"
          />
        </div>

        <div className="input-group">
          <label className="input-label">Email Address</label>
          <input 
            type="email" 
            name="email"
            className="input-field" 
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
          />
        </div>

        <div className="input-group">
          <label className="input-label">Address</label>
          <input 
            type="text" 
            name="address"
            className="input-field" 
            value={formData.address}
            onChange={handleChange}
            required
            maxLength={400}
            placeholder="Your full address (Max 400 chars)"
          />
        </div>
        
        <div className="input-group">
          <label className="input-label">Password</label>
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? 'text' : 'password'} 
              name="password"
              className="input-field" 
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              maxLength={16}
              placeholder="8-16 chars, 1 uppercase, 1 special char"
              style={{ paddingRight: '2.5rem' }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        
        <button type="submit" className="btn btn-primary w-full" disabled={loading} style={{ marginTop: '1rem' }}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      
      <p className="text-center mt-4" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
};
