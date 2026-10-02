import React from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

interface HeroSectionProps {
  stats?: {
    totalMembers: number;
    unitsCount: number;
    districtsCount: number;
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({ stats }) => {
  return (
    <section className="hero-section">
      <div className="container position-relative z-1">
        <div className="row align-items-center g-5">
          <div className="col-lg-7">
            <div className="hero-badge">
              <i className="bi bi-shield-lock-fill"></i> VERIFIED DIGITAL COMMUNITY PLATFORM
            </div>
            <h1 className="hero-title mb-3">
              Empowering Community Voice with <span className="text-gold">Transparent Governance</span>
            </h1>
            <p className="hero-subtitle mb-4">
              A unified digital organization network facilitating member registration, secure QR identity verification, regional activity reporting, and transparent civic administration.
            </p>

            <div className="d-flex flex-wrap gap-3">
              <Link to="/join" className="btn btn-gold btn-lg px-4 py-3">
                <i className="bi bi-person-plus-fill me-2"></i>Apply for Membership
              </Link>
              <Link to="/verify/demo" className="btn btn-outline-light btn-lg px-4 py-3">
                <i className="bi bi-qr-code-scan me-2"></i>Scan Member QR
              </Link>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="hero-stats-card">
              <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-secondary">
                <div className="bg-gold p-3 rounded-circle text-maroon fs-3">
                  <i className="bi bi-people-fill"></i>
                </div>
                <div>
                  <h3 className="h2 text-gold m-0 fw-bold">{stats?.totalMembers || '1,250+'}</h3>
                  <span className="small text-light">Verified Active Members</span>
                </div>
              </div>

              <div className="row text-center g-3">
                <div className="col-6">
                  <div className="p-3 rounded bg-black bg-opacity-25 border border-gold">
                    <div className="h4 text-gold mb-1 fw-bold">{stats?.districtsCount || '3'}</div>
                    <div className="small text-light">Regional Districts</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded bg-black bg-opacity-25 border border-gold">
                    <div className="h4 text-gold mb-1 fw-bold">{stats?.unitsCount || '12'}</div>
                    <div className="small text-light">Local Units</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white bg-opacity-10 rounded text-center small text-light">
                <i className="bi bi-info-circle text-gold me-1"></i> Live data synchronized from central registry
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
