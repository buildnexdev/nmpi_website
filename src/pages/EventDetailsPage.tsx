import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../services/apiClient';

export const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [evt, setEvt] = useState<any>(null);

  useEffect(() => {
    if (id) apiClient.get(`/events/${id}`).then(res => setEvt(res.data.data)).catch(() => {});
  }, [id]);

  if (!evt) return <div className="container py-5 text-center"><div className="spinner-border text-maroon"></div></div>;

  return (
    <div className="container py-5">
      <Link to="/events" className="btn btn-outline-secondary btn-sm mb-4"><i className="bi bi-arrow-left me-1"></i> Back to Events</Link>
      <div className="card-custom p-4 p-md-5">
        <h1 className="text-maroon fw-bold h2 mb-3">{evt.title}</h1>
        <div className="row g-3 mb-4 border-top border-bottom py-3 small text-muted">
          <div className="col-md-4"><i className="bi bi-calendar text-gold me-2"></i>Date: <strong>{evt.event_date}</strong></div>
          <div className="col-md-4"><i className="bi bi-clock text-gold me-2"></i>Time: <strong>{evt.start_time}</strong></div>
          <div className="col-md-4"><i className="bi bi-geo-alt text-gold me-2"></i>Location: <strong>{evt.location}</strong></div>
        </div>
        <p className="lead">{evt.description}</p>
        <div className="mt-4">
          <button className="btn btn-gold btn-lg px-4" onClick={() => alert('Event RSVP recorded!')}>
            <i className="bi bi-check2-square me-2"></i>Register for Event
          </button>
        </div>
      </div>
    </div>
  );
};
