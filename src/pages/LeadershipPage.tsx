import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';

export const LeadershipPage: React.FC = () => {
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('/leadership').then(res => setLeaders(res.data.data)).catch(() => {});
  }, []);

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <span className="text-gold fw-bold text-uppercase small">Central Council</span>
        <h1 className="text-maroon fw-bold h2">Organization Leadership</h1>
      </div>
      <div className="row g-4 justify-content-center">
        {leaders.map(l => (
          <div className="col-lg-4 col-md-6" key={l.id}>
            <div className="card-custom text-center p-4">
              <img src={l.photo_url} alt={l.name} className="rounded-circle mb-3 border border-gold" style={{ width: 120, height: 120, objectFit: 'cover' }} />
              <h3 className="h5 text-maroon fw-bold m-0">{l.name}</h3>
              <div className="text-gold fw-semibold small mb-2">{l.designation}</div>
              <p className="small text-muted">{l.biography}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
