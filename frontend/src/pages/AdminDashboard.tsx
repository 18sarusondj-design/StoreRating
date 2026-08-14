import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Eye, EyeOff } from 'lucide-react';
import api from '../api';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'stores'>('stats');
  
  // Filter & Search states
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [storeSearchQuery, setStoreSearchQuery] = useState('');
  
  // Sort states
  const [userSort, setUserSort] = useState<{ field: string; order: 'asc' | 'desc' }>({ field: 'name', order: 'asc' });
  const [storeSort, setStoreSort] = useState<{ field: string; order: 'asc' | 'desc' }>({ field: 'name', order: 'asc' });
  
  // Modal states
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  
  // Form states
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL' });
  const [storeForm, setStoreForm] = useState({ storeName: '', email: '', address: '', ownerName: '', password: '' });
  const [formError, setFormError] = useState('');
  
  // Password visibility states
  const [showUserPassword, setShowUserPassword] = useState(false);
  const [showStorePassword, setShowStorePassword] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchStores();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/users/dashboard-stats');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await api.get('/stores');
      setStores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      await api.post('/users', userForm);
      setUserModalOpen(false);
      setUserForm({ name: '', email: '', password: '', address: '', role: 'NORMAL' });
      fetchUsers();
      fetchStats();
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Failed to create user');
    }
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      await api.post('/stores', storeForm);
      setStoreModalOpen(false);
      setStoreForm({ storeName: '', email: '', address: '', ownerName: '', password: '' });
      fetchStores();
      fetchUsers();
      fetchStats();
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Failed to create store');
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      <h2>System Administrator Dashboard</h2>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className={`btn ${activeTab === 'stats' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('stats')}>Overview</button>
          <button className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('users')}>Manage Users</button>
          <button className={`btn ${activeTab === 'stores' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('stores')}>Manage Stores</button>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary" onClick={() => { setFormError(''); setUserModalOpen(true); }}>+ Add User</button>
          <button className="btn btn-secondary" onClick={() => { setFormError(''); setStoreModalOpen(true); }}>+ Add Store</button>
        </div>
      </div>

      {activeTab === 'stats' && (
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '2rem', flex: 1, textAlign: 'center' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>Total Users</h3>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.totalUsers}</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', flex: 1, textAlign: 'center' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>Total Stores</h3>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--secondary)' }}>{stats.totalStores}</p>
          </div>
          <div className="glass-panel" style={{ padding: '2rem', flex: 1, textAlign: 'center' }}>
            <h3 style={{ color: 'var(--text-muted)' }}>Total Ratings</h3>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: '#F59E0B' }}>{stats.totalRatings}</p>
          </div>
        </div>
      )}

      {activeTab === 'users' && (() => {
        const query = userSearchQuery.toLowerCase().trim();
        const filteredUsers = users
          .filter(u => {
            if (!query) return true;
            return (
              u.name.toLowerCase().includes(query) ||
              u.email.toLowerCase().includes(query) ||
              u.address.toLowerCase().includes(query)
            );
          })
          .sort((a, b) => {
            let valA = a[userSort.field] ?? '';
            let valB = b[userSort.field] ?? '';
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            if (valA < valB) return userSort.order === 'asc' ? -1 : 1;
            if (valA > valB) return userSort.order === 'asc' ? 1 : -1;
            return 0;
          });

        const toggleUserSort = (field: string) => {
          setUserSort(prev => ({
            field,
            order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
          }));
        };

        return (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3>Users List</h3>
            
            {/* Single Search Bar */}
            <div style={{ marginBottom: '1.5rem', maxWidth: '400px' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Search by Name, Email, or Address..." 
                value={userSearchQuery} 
                onChange={e => setUserSearchQuery(e.target.value)} 
              />
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => toggleUserSort('name')}>Name {userSort.field === 'name' ? (userSort.order === 'asc' ? '▲' : '▼') : ''}</th>
                  <th onClick={() => toggleUserSort('email')}>Email {userSort.field === 'email' ? (userSort.order === 'asc' ? '▲' : '▼') : ''}</th>
                  <th onClick={() => toggleUserSort('address')}>Address {userSort.field === 'address' ? (userSort.order === 'asc' ? '▲' : '▼') : ''}</th>
                  <th onClick={() => toggleUserSort('role')}>Role {userSort.field === 'role' ? (userSort.order === 'asc' ? '▲' : '▼') : ''}</th>
                  <th onClick={() => toggleUserSort('rating')}>Rating (if Owner) {userSort.field === 'rating' ? (userSort.order === 'asc' ? '▲' : '▼') : ''}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.address}</td>
                    <td><span className={`badge badge-${u.role.toLowerCase()}`}>{u.role}</span></td>
                    <td>{u.rating !== null && u.rating !== undefined ? Number(u.rating).toFixed(1) : '-'}</td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && <tr><td colSpan={5} className="text-center text-muted">No users found matching filters</td></tr>}
              </tbody>
            </table>
          </div>
        );
      })()}

      {activeTab === 'stores' && (() => {
        const query = storeSearchQuery.toLowerCase().trim();
        const filteredStores = stores
          .filter(s => {
            if (!query) return true;
            return (
              s.name.toLowerCase().includes(query) ||
              s.email.toLowerCase().includes(query) ||
              s.address.toLowerCase().includes(query)
            );
          })
          .sort((a, b) => {
            let valA = a[storeSort.field] ?? '';
            let valB = b[storeSort.field] ?? '';
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            if (valA < valB) return storeSort.order === 'asc' ? -1 : 1;
            if (valA > valB) return storeSort.order === 'asc' ? 1 : -1;
            return 0;
          });

        const toggleStoreSort = (field: string) => {
          setStoreSort(prev => ({
            field,
            order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
          }));
        };

        return (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3>Stores List</h3>

            {/* Single Search Bar */}
            <div style={{ marginBottom: '1.5rem', maxWidth: '400px' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Search by Store Name, Address, or Email..." 
                value={storeSearchQuery} 
                onChange={e => setStoreSearchQuery(e.target.value)} 
              />
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => toggleStoreSort('name')}>Store Name {storeSort.field === 'name' ? (storeSort.order === 'asc' ? '▲' : '▼') : ''}</th>
                  <th onClick={() => toggleStoreSort('email')}>Email {storeSort.field === 'email' ? (storeSort.order === 'asc' ? '▲' : '▼') : ''}</th>
                  <th onClick={() => toggleStoreSort('address')}>Address {storeSort.field === 'address' ? (storeSort.order === 'asc' ? '▲' : '▼') : ''}</th>
                  <th onClick={() => toggleStoreSort('averageRating')}>Avg Rating {storeSort.field === 'averageRating' ? (storeSort.order === 'asc' ? '▲' : '▼') : ''}</th>
                </tr>
              </thead>
              <tbody>
                {filteredStores.map(s => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.address}</td>
                    <td>{Number(s.averageRating).toFixed(1)} ({s.totalRatings} ratings)</td>
                  </tr>
                ))}
                {filteredStores.length === 0 && <tr><td colSpan={4} className="text-center text-muted">No stores found matching filters</td></tr>}
              </tbody>
            </table>
          </div>
        );
      })()}

      {userModalOpen && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 9999, padding: '2rem', overflowY: 'auto' }}>
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '500px', margin: '2rem auto' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Create New User</h3>
            {formError && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{formError}</div>}
            <form onSubmit={handleCreateUser}>
              <div className="input-group">
                <label className="input-label">Name (20-60 chars)</label>
                <input type="text" className="input-field" required minLength={20} maxLength={60} value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Email</label>
                <input type="email" className="input-field" required value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showUserPassword ? 'text' : 'password'} className="input-field" required value={userForm.password} onChange={e => setUserForm({...userForm, password: e.target.value})} style={{ paddingRight: '2.5rem' }} />
                  <button type="button" onClick={() => setShowUserPassword(!showUserPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                    {showUserPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Address</label>
                <input type="text" className="input-field" required value={userForm.address} onChange={e => setUserForm({...userForm, address: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary w-full" onClick={() => setUserModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary w-full">Create User</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {storeModalOpen && createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 9999, padding: '2rem', overflowY: 'auto' }}>
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '500px', margin: '2rem auto' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Create Store & Owner</h3>
            {formError && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{formError}</div>}
            <form onSubmit={handleCreateStore}>
              <div className="input-group">
                <label className="input-label">Store Name</label>
                <input type="text" className="input-field" required value={storeForm.storeName} onChange={e => setStoreForm({...storeForm, storeName: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Store & Owner Email</label>
                <input type="email" className="input-field" required value={storeForm.email} onChange={e => setStoreForm({...storeForm, email: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Store Address</label>
                <input type="text" className="input-field" required value={storeForm.address} onChange={e => setStoreForm({...storeForm, address: e.target.value})} />
              </div>
              <h4 style={{ margin: '1.5rem 0 1rem', color: 'var(--text-muted)' }}>Store Owner Details</h4>
              <div className="input-group">
                <label className="input-label">Owner Name (20-60 chars)</label>
                <input type="text" className="input-field" required minLength={20} maxLength={60} value={storeForm.ownerName} onChange={e => setStoreForm({...storeForm, ownerName: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Owner Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showStorePassword ? 'text' : 'password'} className="input-field" required value={storeForm.password} onChange={e => setStoreForm({...storeForm, password: e.target.value})} style={{ paddingRight: '2.5rem' }} />
                  <button type="button" onClick={() => setShowStorePassword(!showStorePassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
                    {showStorePassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary w-full" onClick={() => setStoreModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary w-full">Create Store</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
