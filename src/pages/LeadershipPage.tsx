import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { apiClient, asArray, errorMessage, pick } from '../services/apiClient';
import { EmptyState, ErrorBox, LeaderPhoto, Loader, PageHero } from '../components/ui';
import { CONTACT_PHONE, CONTACT_PHONE_TEL } from '../constants/contact';

interface Executive {
  id: number;
  name: string;
  name_ta: string | null;
  designation: string;
  designation_ta: string | null;
  district: string | null;
  district_ta: string | null;
  qualification: string | null;
  photo_url: string | null;
  email: string | null;
  bio: string | null;
}

export const LeadershipPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [items, setItems] = useState<Executive[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('');

  const load = useCallback(() => {
    setError(null);
    apiClient.get('/leadership').then((r) => setItems(asArray(r.data.data))).catch((err) => setError(errorMessage(err)));
  }, []);
  useEffect(load, [load]);

  const districts = useMemo(() => {
    const map = new Map<string, Executive>();
    (items || []).forEach((l) => l.district && !map.has(l.district) && map.set(l.district, l));
    return Array.from(map.values()).sort((a, b) => (a.district || '').localeCompare(b.district || ''));
  }, [items]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (items || []).filter(
      (l) =>
        (!district || l.district === district) &&
        (!q || [l.name, l.name_ta, l.district, l.district_ta, l.designation, l.designation_ta].some((v) => v?.toLowerCase().includes(q)))
    );
  }, [items, search, district]);

  return (
    <>
      <PageHero
        eyebrow={t('leadershipPage.eyebrow')}
        title={t('leadershipPage.title')}
        subtitle={t('leadershipPage.subtitle')}
      />
      <section className="page-body">
        <div className="container">
          <div className="card-custom p-3 mb-4 d-flex flex-wrap gap-2 align-items-center">
            <div className="input-group flex-grow-1" style={{ maxWidth: 420 }}>
              <span className="input-group-text"><i className="bi bi-search"></i></span>
              <input className="form-control" placeholder={t('leadershipPage.searchPlaceholder')} value={search} onChange={(e) => setSearch(e.target.value)} aria-label={t('leadershipPage.searchAria')} />
            </div>
            {districts.length > 1 && (
              <select className="form-select" style={{ maxWidth: 260 }} value={district} onChange={(e) => setDistrict(e.target.value)} aria-label={t('leadershipPage.districtAria')}>
                <option value="">{t('leadershipPage.allDistricts')}</option>
                {districts.map((d) => (
                  <option key={d.district!} value={d.district!}>{pick(d, 'district', lang)}</option>
                ))}
              </select>
            )}
            {items && <span className="ms-auto small text-muted">{t('leadershipPage.count', { count: visible.length })}</span>}
          </div>

          {error ? (
            <ErrorBox message={error} onRetry={load} />
          ) : !items ? (
            <Loader />
          ) : visible.length === 0 ? (
            <EmptyState icon="bi-people" title={t('leadershipPage.emptyTitle')} />
          ) : (
            <div className="row g-4">
              {visible.map((l) => (
                <div className="col-sm-6 col-lg-4 col-xl-3" key={l.id}>
                  <div className="card-custom card-hover leader-card d-flex flex-column">
                    <div><LeaderPhoto src={l.photo_url} name={l.name} /></div>
                    <h3 className="leader-name">{pick(l, 'name', lang)}</h3>
                    {l.qualification && <div className="small text-muted">{l.qualification}</div>}
                    <div className="leader-role mt-1">{pick(l, 'designation', lang)}</div>
                    {l.district && (
                      <div className="mt-2"><span className="gold-badge"><i className="bi bi-geo-alt-fill"></i>{pick(l, 'district', lang)}</span></div>
                    )}
                    {l.bio && <p className="small text-muted mt-3 mb-0">{l.bio}</p>}
                    <div className="d-flex justify-content-center gap-2 mt-auto pt-3">
                      <a href={CONTACT_PHONE_TEL} className="btn btn-sm btn-outline-maroon" aria-label={t('leadershipPage.callAria', { phone: CONTACT_PHONE })}>
                        <i className="bi bi-telephone"></i>
                        <span className="ms-1">{CONTACT_PHONE}</span>
                      </a>
                      {l.email && (
                        <a href={`mailto:${l.email}`} className="btn btn-sm btn-outline-maroon" aria-label={t('leadershipPage.emailAria', { name: pick(l, 'name', lang) })}>
                          <i className="bi bi-envelope"></i>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
