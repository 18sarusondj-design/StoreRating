import React, { useState, useEffect } from 'react';
import api from '../api';

export const NormalDashboard: React.FC = () => {
  const [stores, setStores] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingModal, setRatingModal] = useState<{ isOpen: boolean; storeId: string; storeName: string; currentValue: number | null }>({
    isOpen: false, storeId: '', storeName: '', currentValue: null
  });
  const [ratingValue, setRatingValue] = useState<number>(5);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const query = searchQuery.trim() ? `?search=${encodeURIComponent(searchQuery.trim())}` : '';
      const res = await api.get(`/stores${query}`);
      setStores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStores();
  };

  const openRatingModal = (storeId: string, storeName: string, userRating: number | null) => {
    setRatingValue(userRating || 5);
    setRatingModal({ isOpen: true, storeId, storeName, currentValue: userRating });
  };

  const submitRating = async () => {
    try {
      await api.post(`/stores/${ratingModal.storeId}/rating`, { value: ratingValue });
      setRatingModal({ ...ratingModal, isOpen: false });
      fetchStores(); // Refresh to get updated ratings
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem' }}>
      <h2>Store Directory</h2>
      
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="input-group" style={{ marginBottom: 0, flex: 1 }}>
            <input 
              type="text" 
              className="input-field" 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              placeholder="Search stores by Name or Address..." 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>Search</button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {stores.map(store => (
          <div key={store.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>{store.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>{store.address}</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Overall</span>
                <strong>{Number(store.averageRating).toFixed(1)} / 5</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Your Rating</span>
                {store.userRating ? (
                  <strong style={{ color: 'var(--primary)' }}>{store.userRating} / 5</strong>
                ) : (
                  <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Not rated</span>
                )}
              </div>
            </div>
            
            <button 
              className="btn btn-secondary w-full" 
              style={{ marginTop: '1rem' }}
              onClick={() => openRatingModal(store.id, store.name, store.userRating)}
            >
              {store.userRating ? 'Modify Rating' : 'Submit Rating'}
            </button>
          </div>
        ))}
        {stores.length === 0 && <p className="text-muted" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>No stores found matching your criteria.</p>}
      </div>

      {ratingModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel animate-fade-in" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Rate {ratingModal.storeName}</h3>
            <div className="input-group">
              <label className="input-label">Select Rating (1-5)</label>
              <input 
                type="number" 
                min="1" max="5" 
                className="input-field" 
                value={ratingValue}
                onChange={e => setRatingValue(Number(e.target.value))}
                style={{ fontSize: '1.5rem', textAlign: 'center' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn btn-secondary w-full" onClick={() => setRatingModal({ ...ratingModal, isOpen: false })}>Cancel</button>
              <button className="btn btn-primary w-full" onClick={submitRating}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
