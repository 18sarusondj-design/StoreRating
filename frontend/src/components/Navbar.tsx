import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Star, User as UserIcon, X, KeyRound, Eye, EyeOff, ShieldCheck, MapPin, Mail } from 'lucide-react';
import api from '../api';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Password update form state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordErr, setPasswordErr] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleLogout = () => {
    setDrawerOpen(false);
    logout();
    navigate('/login');
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordErr('');
    setPasswordLoading(true);

    try {
      await api.post('/users/update-password', { oldPassword, newPassword });
      setPasswordMsg('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setShowPasswordForm(false);
    } catch (err: any) {
      setPasswordErr(err.response?.data?.error || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <>
      <nav style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--glass-border)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: 'bold' }}>
          <Star color="var(--primary)" fill="var(--primary)" />
          <span>StoreRating</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated && user ? (
            <>
              <span style={{ color: 'var(--text-muted)' }}>
                Welcome, <strong style={{ color: 'var(--text-main)' }}>{user.name}</strong>
                <span className={`badge badge-${user.role.toLowerCase()}`} style={{ marginLeft: '0.5rem' }}>
                  {user.role}
                </span>
              </span>

              {/* Profile Drawer Button */}
              <button 
                className="btn btn-secondary" 
                onClick={() => setDrawerOpen(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4.5rem 0.9rem' }}
              >
                <UserIcon size={18} /> Profile
              </button>

              <button className="btn btn-secondary" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem' }}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </nav>

      {/* Slide-out Sidebar Drawer */}
      {drawerOpen && user && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', zIndex: 10000, display: 'flex', justifyContent: 'flex-end' }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '420px',
            height: '100%',
            borderRadius: 0,
            borderLeft: '1px solid var(--border)',
            padding: '2rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideInRight 0.3s ease forwards'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5 0%, #10B981 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 'bold' }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem' }}>{user.name}</h3>
                  <span className={`badge badge-${user.role.toLowerCase()}`}>{user.role}</span>
                </div>
              </div>
              <button 
                onClick={() => setDrawerOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Profile Details */}
            <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h4 style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Details</h4>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={18} color="var(--primary)" />
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Address</span>
                  <strong style={{ fontSize: '0.95rem' }}>{user.email}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MapPin size={18} color="var(--primary)" />
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Address</span>
                  <strong style={{ fontSize: '0.95rem' }}>{user.address || 'Headquarters'}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={18} color="var(--secondary)" />
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Role Permission</span>
                  <strong style={{ fontSize: '0.95rem' }}>{user.role} Access</strong>
                </div>
              </div>
            </div>

            {/* Notifications / Messages */}
            {passwordMsg && <div style={{ background: '#D1FAE5', color: '#059669', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>{passwordMsg}</div>}
            {passwordErr && <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>{passwordErr}</div>}

            {/* Actions */}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              {!showPasswordForm ? (
                <button 
                  className="btn btn-secondary w-full" 
                  onClick={() => { setPasswordErr(''); setPasswordMsg(''); setShowPasswordForm(true); }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <KeyRound size={18} /> Update Password
                </button>
              ) : (
                <form onSubmit={handlePasswordUpdate} style={{ background: 'var(--surface-hover)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Change Password</h4>
                  
                  <div className="input-group">
                    <label className="input-label">Current Password</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type={showOldPass ? 'text' : 'password'}
                        className="input-field" 
                        required 
                        value={oldPassword} 
                        onChange={e => setOldPassword(e.target.value)} 
                        style={{ paddingRight: '2.5rem' }}
                      />
                      <button type="button" onClick={() => setShowOldPass(!showOldPass)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                        {showOldPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="input-group">
                    <label className="input-label">New Password</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type={showNewPass ? 'text' : 'password'}
                        className="input-field" 
                        required 
                        minLength={8}
                        maxLength={16}
                        value={newPassword} 
                        onChange={e => setNewPassword(e.target.value)} 
                        style={{ paddingRight: '2.5rem' }}
                        placeholder="8-16 chars, 1 upper, 1 special"
                      />
                      <button type="button" onClick={() => setShowNewPass(!showNewPass)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                        {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button type="button" className="btn btn-secondary w-full" onClick={() => setShowPasswordForm(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary w-full" disabled={passwordLoading}>
                      {passwordLoading ? 'Updating...' : 'Save Password'}
                    </button>
                  </div>
                </form>
              )}

              <button 
                className="btn btn-primary w-full" 
                onClick={handleLogout}
                style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
