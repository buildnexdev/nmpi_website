import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { apiClient } from '../services/apiClient';
import { PageHero } from '../components/ui';

interface Stats {
  members: number;
  leaders: number;
  districts: number;
  upcoming_events: number;
}

const MILESTONES = [
  { icon: 'bi-shield-check', ta: ['உறுப்பினர் பாதுகாப்பு', 'அனைத்து உறுப்பினர்களுக்கும் QR சரிபார்ப்பு டிஜிட்டல் அடையாள அட்டை.'], en: ['Member safety & rights', 'Every member receives a QR-verified digital identity card.'] },
  { icon: 'bi-tree-fill', ta: ['சுற்றுச்சூழல் & சமூகம்', 'இரத்த தான முகாம்கள், மரக்கன்று நடுதல் மற்றும் விழிப்புணர்வு நிகழ்வுகள்.'], en: ['Eco & community welfare', 'Blood donation drives, tree planting and awareness rallies.'] },
  { icon: 'bi-mortarboard-fill', ta: ['இளைஞர் வழிகாட்டுதல்', 'மாணவர்களுக்குத் தலைமைப்பண்பு மற்றும் வேலைவாய்ப்பு திறன் பயிற்சி.'], en: ['Youth empowerment', 'Leadership training and career guidance for student volunteers.'] },
];

export const AchievementsPage: React.FC = () => {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    apiClient.get('/public-stats').then((r) => setStats(r.data.data)).catch(() => setStats(null));
  }, []);

  const figures = stats
    ? [
        { value: stats.members, label: ta ? 'பதிவு செய்த உறுப்பினர்கள்' : 'Registered members' },
        { value: stats.leaders, label: ta ? 'மாவட்ட நிர்வாகிகள்' : 'District executives' },
        { value: stats.districts, label: ta ? 'மாவட்டங்கள்' : 'Districts covered' },
        { value: stats.upcoming_events, label: ta ? 'வரவிருக்கும் நிகழ்வுகள்' : 'Upcoming events' },
      ]
    : [];

  return (
    <>
      <PageHero
        eyebrow={ta ? 'சாதனைகள்' : 'Achievements'}
        title={ta ? 'இயக்கத்தின் முக்கிய சாதனைகள்' : 'Key Achievements'}
        subtitle={ta ? 'மக்களின் உரிமைகளைப் பாதுகாக்கவும் சமூக வளர்ச்சிக்குமான தொடர் பணிகள்.' : 'Milestones in protecting public rights and fostering community welfare.'}
      />
      <section className="page-body">
        <div className="container">
          {figures.length > 0 && (
            <div className="row g-3 mb-5">
              {figures.map((f) => (
                <div className="col-6 col-lg-3" key={f.label}>
                  <div className="card-custom p-4 text-center h-100">
                    <div className="display-6 fw-bold text-maroon">{f.value.toLocaleString('en-IN')}</div>
                    <div className="small text-muted fw-semibold">{f.label}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="row g-4">
            {MILESTONES.map((m) => (
              <div className="col-md-4" key={m.icon}>
                <div className="card-custom card-hover feature-tile text-center h-100">
                  <div className="feature-icon mx-auto"><i className={`bi ${m.icon}`}></i></div>
                  <h2 className="h5">{ta ? m.ta[0] : m.en[0]}</h2>
                  <p className="mb-0">{ta ? m.ta[1] : m.en[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
