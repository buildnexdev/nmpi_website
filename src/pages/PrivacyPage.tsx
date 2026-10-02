import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="container py-5">
      <div className="card-custom p-4 p-md-5">
        <h1 className="text-maroon fw-bold mb-4">Privacy Policy & PII Protection</h1>
        <p>This platform enforces strict privacy measures to safeguard member Personally Identifiable Information (PII).</p>
        <h4>1. Information Collection</h4>
        <p>We collect basic identity and regional jurisdiction details for verified member registration only.</p>
        <h4>2. QR Code Security</h4>
        <p>Public QR verification codes do NOT encode full addresses, phone numbers, or private credentials.</p>
      </div>
    </div>
  );
};
