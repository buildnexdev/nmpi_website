import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer pt-5">
      <div className="container pb-4">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi bi-shield-check text-gold fs-2"></i>
              <span className="h4 text-white m-0">CIVIC & COMMUNITY PLATFORM</span>
            </div>
            <p className="small mb-3">
              Dedicated to non-partisan community empowerment, transparent identity verification, regional development initiatives, and structured civic representation.
            </p>
            <div className="d-flex gap-2">
              <a href="#facebook" className="btn btn-sm btn-outline-light rounded-circle"><i className="bi bi-facebook"></i></a>
              <a href="#twitter" className="btn btn-sm btn-outline-light rounded-circle"><i className="bi bi-twitter-x"></i></a>
              <a href="#youtube" className="btn btn-sm btn-outline-light rounded-circle"><i className="bi bi-youtube"></i></a>
              <a href="#linkedin" className="btn btn-sm btn-outline-light rounded-circle"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="footer-links small">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/history">Organization History</Link></li>
              <li><Link to="/leadership">Leadership Team</Link></li>
              <li><Link to="/news">Announcements & News</Link></li>
              <li><Link to="/events">Community Events</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="footer-heading">Membership & Verification</h5>
            <ul className="footer-links small">
              <li><Link to="/membership">Membership Tiers</Link></li>
              <li><Link to="/join">Apply for Membership</Link></li>
              <li><Link to="/login">Member Portal Login</Link></li>
              <li><Link to="/faq">Frequently Asked Questions</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h5 className="footer-heading">Headquarters Contact</h5>
            <ul className="list-unstyled small">
              <li className="d-flex gap-2 mb-2">
                <i className="bi bi-geo-alt text-gold"></i>
                <span>Civic Center Executive Building, Suite 400, Central Capital</span>
              </li>
              <li className="d-flex gap-2 mb-2">
                <i className="bi bi-telephone text-gold"></i>
                <span>+1 (800) 555-0199</span>
              </li>
              <li className="d-flex gap-2 mb-2">
                <i className="bi bi-envelope text-gold"></i>
                <span>contact@orgplatform.org</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom py-3">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center small text-muted">
          <div>© {new Date().getFullYear()} Community & Political Organization Digital Platform. All rights reserved.</div>
          <div className="d-flex gap-3">
            <Link to="/privacy-policy" className="text-muted text-decoration-none">Privacy</Link>
            <Link to="/terms" className="text-muted text-decoration-none">Terms</Link>
            <Link to="/contact" className="text-muted text-decoration-none">Helpline</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
