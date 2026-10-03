import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PageHero } from '../components/ui';

const CONTACT_EMAIL = 'contact@netajimppi.org';
const CONTACT_PHONE = '+91 97908 75933';

export const ContactPage: React.FC = () => {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const [form, setForm] = useState({ name: '', phone: '', subject: '', message: '' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `${form.message}\n\n— ${form.name}${form.phone ? ` (${form.phone})` : ''}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(form.subject || 'Website enquiry')}&body=${encodeURIComponent(body)}`;
  };

  const channels = [
    { icon: 'bi-telephone-fill', label: ta ? 'அழைக்கவும்' : 'Call us', value: CONTACT_PHONE, href: `tel:${CONTACT_PHONE.replace(/\s+/g, '')}` },
    { icon: 'bi-whatsapp', label: 'WhatsApp', value: CONTACT_PHONE, href: `https://wa.me/${CONTACT_PHONE.replace(/\D/g, '')}` },
    { icon: 'bi-envelope-fill', label: ta ? 'மின்னஞ்சல்' : 'Email', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
    { icon: 'bi-geo-alt-fill', label: ta ? 'தலைமை அலுவலகம்' : 'Head office', value: ta ? 'அண்ணா சாலை, சென்னை, தமிழ்நாடு' : 'Anna Salai, Chennai, Tamil Nadu' },
  ];

  return (
    <>
      <PageHero
        eyebrow={ta ? 'தொடர்பு' : 'Contact'}
        title={ta ? 'எங்களைத் தொடர்பு கொள்ளுங்கள்' : 'Get in touch'}
        subtitle={ta ? 'கேள்விகள், புகார்கள் அல்லது உதவி தேவைகளுக்கு எங்கள் குழுவை அணுகுங்கள்.' : 'Reach our team for questions, grievances or help on the ground.'}
      />
      <section className="page-body">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="d-flex flex-column gap-3">
                {channels.map((c) => {
                  const inner = (
                    <>
                      <div className="feature-icon mb-0 flex-shrink-0"><i className={`bi ${c.icon}`}></i></div>
                      <div className="min-w-0">
                        <div className="small text-muted fw-semibold">{c.label}</div>
                        <div className="fw-bold text-ink text-break">{c.value}</div>
                      </div>
                    </>
                  );
                  return c.href ? (
                    <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="card-custom card-hover p-3 d-flex align-items-center gap-3 text-decoration-none">
                      {inner}
                    </a>
                  ) : (
                    <div key={c.label} className="card-custom p-3 d-flex align-items-center gap-3">{inner}</div>
                  );
                })}
              </div>
            </div>
            <div className="col-lg-7">
              <div className="card-custom p-4 p-md-5">
                <h2 className="h4 mb-1">{ta ? 'செய்தி அனுப்புங்கள்' : 'Send us a message'}</h2>
                <p className="small text-muted mb-4">{ta ? 'இது உங்கள் மின்னஞ்சல் பயன்பாட்டில் செய்தியைத் திறக்கும்.' : 'This opens the message in your email app, addressed to our office.'}</p>
                <form onSubmit={submit} className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="c-name" className="form-label small fw-semibold">{ta ? 'உங்கள் பெயர்' : 'Your name'} *</label>
                    <input id="c-name" className="form-control" value={form.name} onChange={set('name')} required autoComplete="name" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="c-phone" className="form-label small fw-semibold">{ta ? 'கைபேசி எண்' : 'Mobile number'}</label>
                    <input id="c-phone" className="form-control" value={form.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" />
                  </div>
                  <div className="col-12">
                    <label htmlFor="c-subject" className="form-label small fw-semibold">{ta ? 'பொருள்' : 'Subject'} *</label>
                    <input id="c-subject" className="form-control" value={form.subject} onChange={set('subject')} required />
                  </div>
                  <div className="col-12">
                    <label htmlFor="c-message" className="form-label small fw-semibold">{ta ? 'செய்தி' : 'Message'} *</label>
                    <textarea id="c-message" className="form-control" rows={5} value={form.message} onChange={set('message')} required></textarea>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-maroon px-4"><i className="bi bi-send me-2"></i>{ta ? 'அனுப்பு' : 'Send message'}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
