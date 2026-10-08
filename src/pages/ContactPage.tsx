import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PageHero } from '../components/ui';
import { CONTACT_PHONE, CONTACT_PHONE_TEL, CONTACT_PHONE_WHATSAPP } from '../constants/contact';

const CONTACT_EMAIL = 'nmpiofficial2026@gmail.com';

export const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', phone: '', subject: '', message: '' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `${form.message}\n\n— ${form.name}${form.phone ? ` (${form.phone})` : ''}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(form.subject || t('contactPage.defaultSubject'))}&body=${encodeURIComponent(body)}`;
  };

  const channels = [
    { icon: 'bi-telephone-fill', label: t('contactPage.channelCall'), value: CONTACT_PHONE, href: CONTACT_PHONE_TEL },
    { icon: 'bi-whatsapp', label: t('contactPage.channelWhatsapp'), value: CONTACT_PHONE, href: CONTACT_PHONE_WHATSAPP },
    { icon: 'bi-envelope-fill', label: t('contactPage.channelEmail'), value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
    { icon: 'bi-geo-alt-fill', label: t('contactPage.channelOffice'), value: t('contactInfo.address') },
  ];

  return (
    <>
      <PageHero
        eyebrow={t('contactPage.eyebrow')}
        title={t('contactPage.title')}
        subtitle={t('contactPage.subtitle')}
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
                <h2 className="h4 mb-1">{t('contactPage.formTitle')}</h2>
                <p className="small text-muted mb-4">{t('contactPage.formNote')}</p>
                <form onSubmit={submit} className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="c-name" className="form-label small fw-semibold">{t('contactPage.nameLabel')} *</label>
                    <input id="c-name" className="form-control" value={form.name} onChange={set('name')} required autoComplete="name" />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="c-phone" className="form-label small fw-semibold">{t('contactPage.phoneLabel')}</label>
                    <input id="c-phone" className="form-control" value={form.phone} onChange={set('phone')} inputMode="tel" autoComplete="tel" />
                  </div>
                  <div className="col-12">
                    <label htmlFor="c-subject" className="form-label small fw-semibold">{t('contactPage.subjectLabel')} *</label>
                    <input id="c-subject" className="form-control" value={form.subject} onChange={set('subject')} required />
                  </div>
                  <div className="col-12">
                    <label htmlFor="c-message" className="form-label small fw-semibold">{t('contactPage.messageLabel')} *</label>
                    <textarea id="c-message" className="form-control" rows={5} value={form.message} onChange={set('message')} required></textarea>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-maroon px-4"><i className="bi bi-send me-2"></i>{t('contactPage.send')}</button>
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
