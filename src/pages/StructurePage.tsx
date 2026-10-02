import React from 'react';

export const StructurePage: React.FC = () => {
  return (
    <div className="container py-5">
      <div className="card-custom p-4 p-md-5">
        <h1 className="text-maroon fw-bold mb-4">Organizational Structure & Hierarchy</h1>
        <div className="row g-4 text-center">
          <div className="col-md-3">
            <div className="p-3 bg-maroon text-white rounded">
              <h5 className="h6 text-gold m-0">1. Executive Council</h5>
              <small>Central Administration</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-3 bg-light border border-gold rounded">
              <h5 className="h6 text-maroon m-0">2. District Committees</h5>
              <small>Regional Oversight</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-3 bg-light border border-gold rounded">
              <h5 className="h6 text-maroon m-0">3. Taluk Divisions</h5>
              <small>Sub-Regional Coordination</small>
            </div>
          </div>
          <div className="col-md-3">
            <div className="p-3 bg-light border border-gold rounded">
              <h5 className="h6 text-maroon m-0">4. Local Units</h5>
              <small>Grassroots Representatives</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
