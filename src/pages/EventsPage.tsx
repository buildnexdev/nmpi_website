import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../services/apiClient';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('/events').then(res => setEvents(res.data.data)).catch(() => {});
  }, []);

  return (
    <div className="container py-5">
      <div className="mb-4">
        <span className="text-gold fw-bold text-uppercase small">Civic Activities</span>
        <h1 className="text-maroon fw-bold h2">Organization Events Calendar</h1>
      </div>

      <div className="row g-4">
        {events.map(evt => (
          <div className="col-lg-6" key={evt.id}>
            <div className="card-custom p-4 h-100 d-flex flex-column">
              <span className="badge gold-badge align-self-start mb-2"><i className="bi bi-calendar-check me-1"></i>{evt.event_date}</span>
              <h3 className="h5 text-maroon fw-bold mb-2">{evt.title}</h3>
              <p className="small text-muted mb-3 flex-grow-1">{evt.description}</p>
              <div className="small text-dark fw-semibold mb-3">
                <i className="bi bi-geo-alt text-gold me-1"></i> {evt.location} ({evt.venue_address})
              </div>
              <Link to={`/events/${evt.id}`} className="btn btn-maroon btn-sm mt-auto">View Event Agenda & RSVP</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
