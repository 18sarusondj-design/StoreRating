import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
            <Star size={32} color="#F59E0B" fill="#F59E0B" />
            <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>{Number(storeData.store.averageRating).toFixed(1)}</span>
          </div>
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
                    <Star size={18} color="#F59E0B" fill="#F59E0B" />
                    <strong>{rating.value} / 5</strong>
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
