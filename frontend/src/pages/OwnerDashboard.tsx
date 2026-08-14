import React, { useState, useEffect } from 'react';
import api from '../api';

export const OwnerDashboard: React.FC = () => {
  const [storeData, setStoreData] = useState<any>(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/stores/owner-dashboard');
      setStoreData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!storeData) return <div className="animate-fade-in text-center mt-4">Loading your dashboard...</div>;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      <h2>Store Owner Dashboard</h2>
      
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{storeData.store.name}</h3>
          <p style={{ color: 'var(--text-muted)' }}>Overview of your store's performance</p>
        </div>
        <div style={{ textAlign: 'center', padding: '0 2rem', borderLeft: '1px solid var(--border)' }}>
          <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Average Rating</span>
          <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>{Number(storeData.store.averageRating).toFixed(1)}</span>
        </div>
        <div style={{ textAlign: 'center', padding: '0 2rem', borderLeft: '1px solid var(--border)' }}>
          <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Ratings</span>
          <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{storeData.store.totalRatings}</span>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Users who rated your store</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>User Email</th>
              <th>Rating Value</th>
            </tr>
          </thead>
          <tbody>
            {storeData.ratings.map((rating: any) => (
              <tr key={rating.id}>
                <td>{rating.user.name}</td>
                <td>{rating.user.email}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ 
                      display: 'inline-block',
                      width: '12px', height: '12px',
                      borderRadius: '50%',
                      background: rating.value >= 4 ? 'var(--secondary)' : rating.value >= 3 ? '#F59E0B' : 'var(--danger)'
                    }}></span>
                    {rating.value} / 5
                  </div>
                </td>
              </tr>
            ))}
            {storeData.ratings.length === 0 && (
              <tr><td colSpan={3} className="text-center text-muted">No ratings received yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
