import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';

export const AboutPage: React.FC = () => {
  const [aboutData, setAboutData] = useState<any>(null);

  useEffect(() => {
    apiClient.get('/pages/about').then(res => setAboutData(res.data.data)).catch(() => {});
  }, []);

  return (
    <div className="container py-5">
      <div className="card-custom p-4 p-md-5">
        <h1 className="text-maroon fw-bold mb-4">{aboutData?.title || 'About Our Organization'}</h1>
        {aboutData?.content ? (
          <div dangerouslySetInnerHTML={{ __html: aboutData.content }} />
        ) : (
          <div>
            <h2>Empowering Communities Through Transparent Governance</h2>
            <p className="lead">
              Our organization stands as a unified platform dedicated to fostering community development, social equity, civic engagement, and ethical leadership. Built upon principles of transparency, inclusivity, and service, we work across regional units to represent civic voices and build sustainable community infrastructure.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
