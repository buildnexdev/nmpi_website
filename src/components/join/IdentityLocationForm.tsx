import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Field, ErrorMessage, useFormikContext } from 'formik';
import { masterDataService, ParliamentOption, AssemblyOption, DistrictOption, BlockOption, VillageOption } from '../../services/masterDataService';

interface IdentityLocationFormProps {
  lang?: string;
  onBack: () => void;
  isSubmitting: boolean;
}

const optionLabel = (o: { name_en: string; name_ta?: string | null }, ta: boolean) => (ta && o.name_ta ? `${o.name_ta} (${o.name_en})` : o.name_en);

export const IdentityLocationForm: React.FC<IdentityLocationFormProps> = ({ lang = 'en', onBack, isSubmitting }) => {
  const ta = lang === 'ta';
  const { values, setFieldValue, errors, touched } = useFormikContext<any>();
  const [parliaments, setParliaments] = useState<ParliamentOption[]>([]);
  const [assemblies, setAssemblies] = useState<AssemblyOption[]>([]);
  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [blocks, setBlocks] = useState<BlockOption[]>([]);
  const [villages, setVillages] = useState<VillageOption[]>([]);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const invalid = (name: string) => (touched[name] && errors[name] ? 'is-invalid' : '');

  useEffect(() => {
    Promise.all([masterDataService.getParliaments(1), masterDataService.getDistricts()])
      .then(([p, d]) => {
        setParliaments(p);
        setDistricts(d);
      })
      .catch(() => setLoadError(true));
  }, []);

  useEffect(() => {
    if (!values.parliament_constituency_id) return setAssemblies([]);
    masterDataService
      .getAssemblies(Number(values.parliament_constituency_id))
      .then((list) => (list.length ? list : masterDataService.getAssemblies()))
      .then(setAssemblies)
      .catch(() => setAssemblies([]));
  }, [values.parliament_constituency_id]);

  useEffect(() => {
    if (!values.district_id) return setBlocks([]);
    setLoadingBlocks(true);
    masterDataService.getBlocks(Number(values.district_id)).then(setBlocks).catch(() => setBlocks([])).finally(() => setLoadingBlocks(false));
  }, [values.district_id]);

  useEffect(() => {
    if (!values.block_id) return setVillages([]);
    setLoadingVillages(true);
    masterDataService.getVillages(Number(values.block_id)).then(setVillages).catch(() => setVillages([])).finally(() => setLoadingVillages(false));
  }, [values.block_id]);

  const onParliament = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFieldValue('parliament_constituency_id', e.target.value);
    setFieldValue('assembly_constituency_id', '');
  };
  const onDistrict = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFieldValue('district_id', e.target.value);
    setFieldValue('block_id', '');
    setFieldValue('village_id', '');
  };
  const onBlock = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFieldValue('block_id', e.target.value);
    setFieldValue('village_id', '');
  };

  return (
    <div>
      {loadError && (
        <div className="alert alert-warning small">{ta ? 'தொகுதி / மாவட்ட பட்டியலை ஏற்ற முடியவில்லை. பக்கத்தைப் புதுப்பிக்கவும்.' : 'Could not load constituency and district lists. Please refresh the page.'}</div>
      )}

      <h3 className="h6 text-uppercase text-muted fw-bold mb-3" style={{ letterSpacing: '.08em' }}>{ta ? 'அடையாளம்' : 'Identity'}</h3>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="aadhaar_number" className="form-label small fw-semibold">{ta ? 'ஆதார் எண்' : 'Aadhaar number'} *</label>
          <Field id="aadhaar_number" name="aadhaar_number" inputMode="numeric" maxLength={14} className={`form-control ${invalid('aadhaar_number')}`} placeholder="XXXX XXXX XXXX" />
          <ErrorMessage name="aadhaar_number" component="div" className="invalid-feedback" />
        </div>
        <div className="col-md-6">
          <label htmlFor="voter_id" className="form-label small fw-semibold">{ta ? 'வாக்காளர் அடையாள எண்' : 'Voter ID (EPIC) number'} *</label>
          <Field id="voter_id" name="voter_id" className={`form-control text-uppercase ${invalid('voter_id')}`} placeholder="ABC1234567" />
          <ErrorMessage name="voter_id" component="div" className="invalid-feedback" />
        </div>
        <div className="col-12">
          <div className="small text-muted"><i className="bi bi-lock-fill me-1 text-success"></i>{ta ? 'ஆதார் மற்றும் வாக்காளர் எண்கள் குறியாக்கம் செய்து சேமிக்கப்படும்; பொதுவில் காட்டப்படாது.' : 'Aadhaar and Voter ID are stored encrypted and are never shown publicly.'}</div>
        </div>
      </div>

      <h3 className="h6 text-uppercase text-muted fw-bold mt-4 mb-3" style={{ letterSpacing: '.08em' }}>{ta ? 'தொகுதி & முகவரி' : 'Constituency & address'}</h3>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="parliament_constituency_id" className="form-label small fw-semibold">{ta ? 'நாடாளுமன்றத் தொகுதி' : 'Parliament constituency'} *</label>
          <select id="parliament_constituency_id" className={`form-select ${invalid('parliament_constituency_id')}`} value={values.parliament_constituency_id || ''} onChange={onParliament}>
            <option value="">{ta ? '-- தேர்ந்தெடுக்கவும் --' : '-- Select --'}</option>
            {parliaments.map((p) => <option key={p.id} value={p.id}>{optionLabel(p, ta)}</option>)}
          </select>
          <ErrorMessage name="parliament_constituency_id" component="div" className="invalid-feedback" />
        </div>
        <div className="col-md-6">
          <label htmlFor="assembly_constituency_id" className="form-label small fw-semibold">{ta ? 'சட்டமன்றத் தொகுதி' : 'Assembly constituency'}</label>
          <Field as="select" id="assembly_constituency_id" name="assembly_constituency_id" className="form-select" disabled={!values.parliament_constituency_id}>
            <option value="">{ta ? '-- தேர்ந்தெடுக்கவும் --' : '-- Select --'}</option>
            {assemblies.map((a) => <option key={a.id} value={a.id}>{optionLabel(a, ta)}</option>)}
          </Field>
        </div>
        <div className="col-md-6">
          <label htmlFor="district_id" className="form-label small fw-semibold">{ta ? 'மாவட்டம்' : 'District'} *</label>
          <select id="district_id" className={`form-select ${invalid('district_id')}`} value={values.district_id || ''} onChange={onDistrict}>
            <option value="">{ta ? '-- தேர்ந்தெடுக்கவும் --' : '-- Select --'}</option>
            {districts.map((d) => <option key={d.id} value={d.id}>{optionLabel(d, ta)}</option>)}
          </select>
          <ErrorMessage name="district_id" component="div" className="invalid-feedback" />
        </div>
        <div className="col-md-6">
          <label htmlFor="block_id" className="form-label small fw-semibold">
            {ta ? 'தாலுகா / ஒன்றியம்' : 'Taluk / block'} *
            {loadingBlocks && <span className="spinner-border spinner-border-sm ms-2 text-maroon"></span>}
          </label>
          <select id="block_id" className={`form-select ${invalid('block_id')}`} value={values.block_id || ''} onChange={onBlock} disabled={!values.district_id || loadingBlocks}>
            <option value="">{ta ? '-- தேர்ந்தெடுக்கவும் --' : '-- Select --'}</option>
            {blocks.map((b) => <option key={b.id} value={b.id}>{optionLabel(b, ta)}</option>)}
          </select>
          <ErrorMessage name="block_id" component="div" className="invalid-feedback" />
        </div>
        <div className="col-md-6">
          <label htmlFor="village_id" className="form-label small fw-semibold">
            {ta ? 'கிராமம் / ஊராட்சி' : 'Village / panchayat'}
            {loadingVillages && <span className="spinner-border spinner-border-sm ms-2 text-maroon"></span>}
          </label>
          {values.block_id && !loadingVillages && villages.length === 0 ? (
            <Field id="village_id" name="village_custom" className="form-control" placeholder={ta ? 'கிராமத்தின் பெயரை உள்ளிடவும்' : 'Type your village name'} />
          ) : (
            <Field as="select" id="village_id" name="village_id" className="form-select" disabled={!values.block_id || loadingVillages}>
              <option value="">{ta ? '-- தேர்ந்தெடுக்கவும் --' : '-- Select --'}</option>
              {villages.map((v) => <option key={v.id} value={v.id}>{v.name_en}</option>)}
            </Field>
          )}
        </div>
        <div className="col-md-6">
          <span className="form-label small fw-semibold d-block">{ta ? 'நான் இணைய விரும்புவது' : 'I want to join as'}</span>
          <div className="btn-group w-100" role="radiogroup">
            {[
              ['1', ta ? 'உறுப்பினர்' : 'Member'],
              ['2', ta ? 'தன்னார்வலர்' : 'Volunteer'],
            ].map(([value, label]) => (
              <React.Fragment key={value}>
                <Field type="radio" className="btn-check" name="role_id" id={`role-${value}`} value={value} />
                <label className="btn btn-outline-maroon" htmlFor={`role-${value}`}>{label}</label>
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="col-12">
          <label htmlFor="address_line1" className="form-label small fw-semibold">{ta ? 'கதவு எண் & தெரு முகவரி' : 'Door no. & street address'}</label>
          <Field id="address_line1" name="address_line1" autoComplete="street-address" className="form-control" />
        </div>

        <div className="col-12 mt-4">
          <div className="p-3 rounded-3 border" style={{ background: 'var(--maroon-50)' }}>
            <div className="form-check">
              <Field type="checkbox" name="consent_terms" id="consent_terms" className={`form-check-input ${invalid('consent_terms')}`} />
              <label htmlFor="consent_terms" className="form-check-label small">
                {ta ? (
                  <>வழங்கிய தகவல்கள் உண்மையானவை என உறுதியளிக்கிறேன், மேலும் <Link to="/privacy-policy" target="_blank">தனியுரிமைக் கொள்கை</Link> மற்றும் <Link to="/terms" target="_blank">விதிமுறைகளை</Link> ஏற்கிறேன். *</>
                ) : (
                  <>I confirm the information above is accurate and I agree to the <Link to="/privacy-policy" target="_blank">Privacy Policy</Link> and <Link to="/terms" target="_blank">Terms &amp; Conditions</Link>. *</>
                )}
              </label>
              <ErrorMessage name="consent_terms" component="div" className="invalid-feedback" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-top d-flex flex-wrap gap-2 justify-content-between">
        <button type="button" className="btn btn-outline-secondary px-4" onClick={onBack} disabled={isSubmitting}>
          <i className="bi bi-arrow-left me-1"></i> {ta ? 'பின்செல்' : 'Back'}
        </button>
        <button type="submit" className="btn btn-maroon px-5" disabled={isSubmitting}>
          {isSubmitting ? (
            <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>{ta ? 'பதிவு செய்கிறது...' : 'Registering...'}</>
          ) : (
            <>{ta ? 'பதிவைச் சமர்ப்பி' : 'Submit registration'} <i className="bi bi-check-circle ms-1"></i></>
          )}
        </button>
      </div>
    </div>
  );
};
