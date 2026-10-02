import React from 'react';

export const FaqPage: React.FC = () => {
  return (
    <div className="container py-5">
      <h1 className="text-maroon fw-bold mb-4">Frequently Asked Questions</h1>
      <div className="accordion card-custom" id="faqAccordion">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button text-maroon font-bold" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
              How do I receive my verified QR Member ID?
            </button>
          </h2>
          <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
            <div className="accordion-body text-muted small">
              Once your membership application is submitted and approved by your regional unit administrator, your unique Member ID and QR digital card are generated automatically in your profile dashboard.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed text-maroon font-bold" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
              Is my address or personal mobile number exposed in the QR code?
            </button>
          </h2>
          <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
            <div className="accordion-body text-muted small">
              No. Our security design encodes only a secure verification token inside the QR code. When scanned, it displays safe public information (Name, Member ID, Unit, District, and Status) while protecting your private contact data.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
