import React from 'react';
import { Link } from 'react-router-dom';

export const MembershipPage: React.FC = () => {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="text-maroon fw-bold h2">Membership Tiers & Benefits</h1>
        <p className="text-muted">Choose your participation tier and register with your local unit</p>
      </div>

      <div className="row g-4 justify-content-center">
        <div className="col-md-4">
          <div className="card-custom text-center p-4 h-100">
            <h3 className="h5 text-maroon font-bold">Regular Member</h3>
            <div className="display-6 text-gold font-bold my-3">$10<small className="fs-6 text-muted">/year</small></div>
            <ul className="list-unstyled small text-muted text-start mb-4">
              <li><i className="bi bi-check2 text-success me-2"></i>Verified Member ID & QR Card</li>
              <li><i className="bi bi-check2 text-success me-2"></i>General Assembly Attendance</li>
              <li><i className="bi bi-check2 text-success me-2"></i>Access to Announcements</li>
            </ul>
            <Link to="/join" className="btn btn-outline-danger w-100">Apply Regular</Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card-custom text-center p-4 h-100 border-gold shadow-gold">
            <span className="badge bg-gold text-maroon mb-2">RECOMMENDED</span>
            <h3 className="h5 text-maroon font-bold">Life Member</h3>
            <div className="display-6 text-gold font-bold my-3">$100<small className="fs-6 text-muted">/lifetime</small></div>
            <ul className="list-unstyled small text-muted text-start mb-4">
              <li><i className="bi bi-check2 text-success me-2"></i>Lifetime Patron Member Status</li>
              <li><i className="bi bi-check2 text-success me-2"></i>Assembly Voting Rights</li>
              <li><i className="bi bi-check2 text-success me-2"></i>Priority Event Reservations</li>
            </ul>
            <Link to="/join" className="btn btn-maroon w-100">Apply Life Member</Link>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card-custom text-center p-4 h-100">
            <h3 className="h5 text-maroon font-bold">Youth Volunteer</h3>
            <div className="display-6 text-gold font-bold my-3">Free</div>
            <ul className="list-unstyled small text-muted text-start mb-4">
              <li><i className="bi bi-check2 text-success me-2"></i>Volunteer Certificate & Badge</li>
              <li><i className="bi bi-check2 text-success me-2"></i>Field Activity Participation</li>
            </ul>
            <Link to="/join" className="btn btn-outline-danger w-100">Apply Volunteer</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
