import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { apiClient, errorMessage, pick } from '../services/apiClient';
import { EmptyState, ErrorBox, LeaderPhoto, Loader, PageHero } from '../components/ui';

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
  phone: string | null;
  email: string | null;
  bio: string | null;
}

export const LeadershipPage: React.FC = () => {
  const { lang } = useLanguage();
  const ta = lang === 'ta';
  const [items, setItems] = useState<Executive[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('');

  const load = useCallback(() => {
    setError(null);
    apiClient.get('/leadership').then((r) => setItems(r.data.data)).catch((err) => setError(errorMessage(err)));
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
        eyebrow={ta ? 'தலைமை' : 'Leadership'}
        title={ta ? 'மாவட்ட நிர்வாகிகள்' : 'District Executives'}
        subtitle={ta ? 'தமிழகம் முழுவதும் இயக்கத்தை வழிநடத்தும் மாவட்டச் செயலாளர்கள் மற்றும் பொறுப்பாளர்கள்.' : 'The district secretaries and office-bearers leading the movement across Tamil Nadu.'}
      />
      <section className="page-body">
        <div className="container">
          <div className="card-custom p-3 mb-4 d-flex flex-wrap gap-2 align-items-center">
            <div className="input-group flex-grow-1" style={{ maxWidth: 420 }}>
              <span className="input-group-text"><i className="bi bi-search"></i></span>
              <input className="form-control" placeholder={ta ? 'பெயர் அல்லது மாவட்டம் மூலம் தேடுங்கள்' : 'Search by name or district'} value={search} onChange={(e) => setSearch(e.target.value)} aria-label={ta ? 'தேடல்' : 'Search'} />
            </div>
            {districts.length > 1 && (
              <select className="form-select" style={{ maxWidth: 260 }} value={district} onChange={(e) => setDistrict(e.target.value)} aria-label={ta ? 'மாவட்டம்' : 'District'}>
                <option value="">{ta ? 'அனைத்து மாவட்டங்களும்' : 'All districts'}</option>
                {districts.map((d) => (
                  <option key={d.district!} value={d.district!}>{pick(d, 'district', lang)}</option>
                ))}
              </select>
            )}
            {items && <span className="ms-auto small text-muted">{visible.length} {ta ? 'நிர்வாகிகள்' : 'executives'}</span>}
          </div>

          {error ? (
            <ErrorBox message={error} onRetry={load} />
          ) : !items ? (
            <Loader />
          ) : visible.length === 0 ? (
            <EmptyState icon="bi-people" title={ta ? 'பொருந்தும் நிர்வாகிகள் இல்லை' : 'No executives match your search'} />
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
                    {(l.phone || l.email) && (
                      <div className="d-flex justify-content-center gap-2 mt-auto pt-3">
                        {l.phone && (
                          <a href={`tel:${l.phone.replace(/\s+/g, '')}`} className="btn btn-sm btn-outline-maroon" aria-label={`${ta ? 'அழைக்க' : 'Call'} ${l.name}`}>
                            <i className="bi bi-telephone"></i>
                          </a>
                        )}
                        {l.email && (
                          <a href={`mailto:${l.email}`} className="btn btn-sm btn-outline-maroon" aria-label={`Email ${l.name}`}>
                            <i className="bi bi-envelope"></i>
                          </a>
                        )}
                      </div>
                    )}
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
