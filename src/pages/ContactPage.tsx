import React from 'react';

export const ContactPage: React.FC = () => {
  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card-custom p-4 p-md-5">
            <h1 className="text-maroon fw-bold h3 mb-4">Contact Headquarters</h1>
            <form onSubmit={e => { e.preventDefault(); alert('Message sent!'); }}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Your Full Name</label>
                <input type="text" className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <input type="email" className="form-control" required />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Message Subject</label>
                <input type="text" className="form-control" required />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-semibold">Message</label>
                <textarea className="form-control" rows={4} required></textarea>
              </div>
              <button type="submit" className="btn btn-maroon w-100">Send Inquiry</button>
            </form>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card-custom p-4 p-md-5 bg-maroon text-white h-100">
            <h2 className="text-gold fw-bold h4 mb-4">Headquarters Details</h2>
            <p><i className="bi bi-geo-alt text-gold me-2"></i> Suite 400, Civic Center Executive Building, Central Capital</p>
            <p><i className="bi bi-telephone text-gold me-2"></i> Helpline: +1 (800) 555-0199</p>
            <p><i className="bi bi-envelope text-gold me-2"></i> Email: contact@orgplatform.org</p>
          </div>
        </div>
      </div>
    </div>
  );
};
