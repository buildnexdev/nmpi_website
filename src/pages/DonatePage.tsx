import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PageHero } from '../components/ui';
import { DonateCard } from '../components/Donate/DonateCard';
import { CONTACT_PHONE, CONTACT_PHONE_TEL, CONTACT_PHONE_WHATSAPP } from '../constants/contact';

export const DonatePage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <>
      <PageHero
        eyebrow={t('donatePage.eyebrow')}
        title={t('donatePage.title')}
        subtitle={t('donatePage.subtitle')}
      />
      <section className="page-body py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-9">
              <DonateCard compact={false} />

              {/* Mission & Purpose Information Card */}
              <div className="card-custom p-4 p-md-5 mt-4 bg-white border rounded-4 shadow-sm">
                <div className="row g-4">
                  <div className="col-md-6">
                    <h4 className="fw-bold text-dark d-flex align-items-center gap-2 mb-3">
                      <i className="bi bi-bullseye text-danger"></i>
                      {t('donatePage.trustTitle')}
                    </h4>
                    <p className="text-muted small leading-relaxed">
                      நேதாஜி மக்கள் பாதுகாப்பு இயக்கம் (NMPI) தமிழ்நாட்டில் எளிய மக்களின் உரிமைகளைப் பாதுகாக்கவும், இளைஞர்களுக்கு நல்வழிகாட்டவும், கல்வி மற்றும் மருத்துவ உதவிகள் வழங்கிடவும் அர்ப்பணிப்புடன் செயல்பட்டு வருகிறது.
                    </p>
                    <ul className="list-unstyled d-flex flex-column gap-2 text-secondary small">
                      <li className="d-flex align-items-start gap-2">
                        <i className="bi bi-check-circle-fill text-success mt-1"></i>
                        <span>மாணவர்களுக்கான கல்வி உதவித்தொகை மற்றும் வழிகாட்டுதல் திட்டங்கள்</span>
                      </li>
                      <li className="d-flex align-items-start gap-2">
                        <i className="bi bi-check-circle-fill text-success mt-1"></i>
                        <span>கிராமப்புற மற்றும் ஏழை மக்களுக்கான நலத்திட்ட உதவிகள்</span>
                      </li>
                      <li className="d-flex align-items-start gap-2">
                        <i className="bi bi-check-circle-fill text-success mt-1"></i>
                        <span>சமூக நீதி, சமத்துவம் மற்றும் மக்கள் உரிமைகள் விழிப்புணர்வு கூட்டங்கள்</span>
                      </li>
                    </ul>
                  </div>

                  <div className="col-md-6">
                    <div className="p-4 rounded-4 h-100" style={{ background: 'linear-gradient(135deg, rgba(122, 12, 22, 0.05) 0%, rgba(212, 175, 55, 0.08) 100%)', border: '1px solid rgba(212, 175, 55, 0.25)' }}>
                      <h5 className="fw-bold mb-3" style={{ color: 'var(--primary-maroon)' }}>
                        <i className="bi bi-headset me-2"></i> உதவி மற்றும் தொடர்புக்கு
                      </h5>
                      <p className="small text-muted mb-3">
                        நன்கொடை செலுத்துவதில் ஏதேனும் சந்தேகம் இருந்தால் அல்லது வங்கி கணக்கு விவரங்கள் தேவைப்பட்டால் இயக்க அலுவலகத்தைத் தொடர்பு கொள்ளவும்.
                      </p>
                      <div className="d-flex flex-column gap-2">
                        <a href={CONTACT_PHONE_TEL} className="btn btn-sm btn-outline-maroon d-flex align-items-center gap-2">
                          <i className="bi bi-telephone-fill"></i>
                          <span>+91 {CONTACT_PHONE}</span>
                        </a>
                        <a href={CONTACT_PHONE_WHATSAPP} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-success d-flex align-items-center gap-2">
                          <i className="bi bi-whatsapp"></i>
                          <span>WhatsApp மூலம் பேச</span>
                        </a>
                        <a href="mailto:nmpiofficial2026@gmail.com" className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2">
                          <i className="bi bi-envelope-fill"></i>
                          <span>nmpiofficial2026@gmail.com</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
