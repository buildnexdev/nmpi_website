import React from 'react';

export const HistoryPage: React.FC = () => {
  return (
    <div className="container py-5">
      <div className="card-custom p-4 p-md-5">
        <h1 className="text-maroon fw-bold mb-4">Organization Milestone History</h1>
        <div className="border-start border-3 border-gold ps-4 my-4">
          <div className="mb-4">
            <span className="badge gold-badge mb-1">2020</span>
            <h4 className="h5 text-maroon font-bold">Grassroots Foundation</h4>
            <p className="small text-muted">Established to unify regional civic units under a single transparent administrative framework.</p>
          </div>
          <div className="mb-4">
            <span className="badge gold-badge mb-1">2023</span>
            <h4 className="h5 text-maroon font-bold">District Expansion</h4>
            <p className="small text-muted">Extended local unit chapters across 3 major regional districts.</p>
          </div>
          <div>
            <span className="badge gold-badge mb-1">2026</span>
            <h4 className="h5 text-maroon font-bold">QR Digital Identity Launch</h4>
            <p className="small text-muted">Rolled out modern QR-based digital identity verification system for all active members.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
