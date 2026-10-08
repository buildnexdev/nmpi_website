import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Field, ErrorMessage, useFormikContext } from 'formik';
import {
  masterDataService,
  ParliamentOption,
  AssemblyOption,
  DistrictOption,
  BlockOption,
  VillageOption,
  RoleOption,
} from '../../services/masterDataService';
import { errorMessage } from '../../services/apiClient';
import { DuplicateChecker } from './duplicateCheck';
import { useLanguage } from '../../context/LanguageContext';

interface IdentityLocationFormProps {
  duplicates: DuplicateChecker;
  isSubmitting: boolean;
}

const optionLabel = (o: { name_en: string; name_ta?: string | null }, ta: boolean) => (ta && o.name_ta ? `${o.name_ta} (${o.name_en})` : o.name_en);

export const IdentityLocationForm: React.FC<IdentityLocationFormProps> = ({ duplicates, isSubmitting }) => {
  const { lang, t } = useLanguage();
  const tamilNames = lang === 'ta';
  const { values, setFieldValue, setFieldTouched, errors, touched } = useFormikContext<any>();
  const [parliaments, setParliaments] = useState<ParliamentOption[]>([]);
  const [assemblies, setAssemblies] = useState<AssemblyOption[]>([]);
  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [blocks, setBlocks] = useState<BlockOption[]>([]);
  const [villages, setVillages] = useState<VillageOption[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);
  const [loadingMaster, setLoadingMaster] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const roleLabel = (role: RoleOption) => {
    const key = role.name === 'Volunteer' ? 'joinForm.roleVolunteer' : 'joinForm.roleMember';
    return t(key);
  };

  const invalid = (name: string) => (touched[name] && errors[name]) || (duplicates.errors as any)[name] ? 'is-invalid' : '';
  const dupFeedback = (name: 'aadhaar_number' | 'voter_id') =>
    duplicates.errors[name] && !(touched[name] && errors[name]) ? <div className="invalid-feedback d-block">{duplicates.errors[name]}</div> : null;
  const checkingIcon = (name: 'aadhaar_number' | 'voter_id') =>
    duplicates.checking[name] ? <span className="spinner-border spinner-border-sm text-maroon ms-2 align-middle" aria-hidden="true"></span> : null;

  // Aadhaar: keep digits only (spaces / dashes are not counted). Max 12 digits.
  const onAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 12);
    setFieldValue('aadhaar_number', digits);
    duplicates.clear('aadhaar_number');
  };
  const onAadhaarBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 12);
    setFieldValue('aadhaar_number', digits, true);
    setFieldTouched('aadhaar_number', true);
    duplicates.check('aadhaar_number', { ...values, aadhaar_number: digits });
  };

  const onVoterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 16);
    setFieldValue('voter_id', cleaned);
    duplicates.clear('voter_id');
  };
  const onVoterBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 16);
    setFieldValue('voter_id', cleaned, true);
    setFieldTouched('voter_id', true);
    duplicates.check('voter_id', { ...values, voter_id: cleaned });
  };

  const loadMasterLists = React.useCallback(async () => {
    setLoadingMaster(true);
    setLoadError(null);
    try {
      const [states, districts, roleList] = await Promise.all([
        masterDataService.getStates(),
        masterDataService.getDistricts(),
        masterDataService.getRoles(),
      ]);
      setDistricts(districts);
      const rolesToUse = roleList.length ? roleList : [{ id: 1, name: 'Member', description: '' }];
      setRoles(rolesToUse);
      if (!values.role_id && rolesToUse.length) {
        setFieldValue('role_id', rolesToUse[0].id);
      }

      const preferredState =
        states.find((s) => s.code === 'TN')?.id ||
        states.find((s) => /tamil/i.test(s.name_en))?.id ||
        states[0]?.id ||
        1;
      setFieldValue('state_id', preferredState);

      let parl = await masterDataService.getParliaments(preferredState);
      if (!parl.length) parl = await masterDataService.getParliaments();
      setParliaments(parl);

      if (!districts.length || !parl.length) {
        setLoadError(t('joinForm.loadErrorPartial'));
      }
    } catch (err) {
      setLoadError(errorMessage(err, t('joinForm.loadError')));
    } finally {
      setLoadingMaster(false);
    }
  }, [setFieldValue, t]);

  useEffect(() => {
    loadMasterLists();
  }, [loadMasterLists]);

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
        <div className="alert alert-warning small d-flex flex-wrap align-items-center gap-2">
          <span>{loadError}</span>
          <button type="button" className="btn btn-sm btn-outline-dark" onClick={loadMasterLists} disabled={loadingMaster}>
            {loadingMaster ? t('joinForm.reloadingLists') : t('joinForm.retryLoad')}
          </button>
        </div>
      )}
      {loadingMaster && !parliaments.length && (
        <div className="small text-muted mb-3"><span className="spinner-border spinner-border-sm me-2 text-maroon"></span>{t('joinForm.loadingLists')}</div>
      )}

      <h3 className="h6 text-uppercase text-muted fw-bold mb-3" style={{ letterSpacing: '.08em' }}>{t('joinForm.identity')}</h3>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="aadhaar_number" className="form-label small fw-semibold">{t('joinForm.aadhaarNumber')} *{checkingIcon('aadhaar_number')}</label>
          <input
            id="aadhaar_number"
            name="aadhaar_number"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={12}
            placeholder="123412341234"
            value={values.aadhaar_number}
            onChange={onAadhaarChange}
            onBlur={onAadhaarBlur}
            className={`form-control ${invalid('aadhaar_number')}`}
          />
          <ErrorMessage name="aadhaar_number" component="div" className="invalid-feedback" />
          {dupFeedback('aadhaar_number')}
        </div>
        <div className="col-md-6">
          <label htmlFor="voter_id" className="form-label small fw-semibold">{t('joinForm.voterId')} *{checkingIcon('voter_id')}</label>
          <input
            id="voter_id"
            name="voter_id"
            type="text"
            autoComplete="off"
            maxLength={16}
            placeholder="ABC1234567"
            value={values.voter_id}
            onChange={onVoterChange}
            onBlur={onVoterBlur}
            className={`form-control text-uppercase ${invalid('voter_id')}`}
          />
          <ErrorMessage name="voter_id" component="div" className="invalid-feedback" />
          {dupFeedback('voter_id')}
        </div>
        <div className="col-12">
          <div className="small text-muted"><i className="bi bi-lock-fill me-1 text-success"></i>{t('joinForm.encryptedNote')}</div>
        </div>
      </div>

      <h3 className="h6 text-uppercase text-muted fw-bold mt-4 mb-3" style={{ letterSpacing: '.08em' }}>{t('joinForm.constituencyAddress')}</h3>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="parliament_constituency_id" className="form-label small fw-semibold">{t('joinForm.parliamentConstituency')} *</label>
          <select id="parliament_constituency_id" className={`form-select ${invalid('parliament_constituency_id')}`} value={values.parliament_constituency_id || ''} onChange={onParliament} disabled={loadingMaster && !parliaments.length}>
            <option value="">{t('joinForm.selectPlaceholder')}</option>
            {parliaments.map((p) => <option key={p.id} value={p.id}>{optionLabel(p, tamilNames)}</option>)}
          </select>
          <ErrorMessage name="parliament_constituency_id" component="div" className="invalid-feedback" />
        </div>
        <div className="col-md-6">
          <label htmlFor="assembly_constituency_id" className="form-label small fw-semibold">{t('joinForm.assemblyConstituency')}</label>
          <Field as="select" id="assembly_constituency_id" name="assembly_constituency_id" className="form-select" disabled={!values.parliament_constituency_id}>
            <option value="">{t('joinForm.selectPlaceholder')}</option>
            {assemblies.map((a) => <option key={a.id} value={a.id}>{optionLabel(a, tamilNames)}</option>)}
          </Field>
        </div>
        <div className="col-md-6">
          <label htmlFor="district_id" className="form-label small fw-semibold">{t('joinForm.district')} *</label>
          <select id="district_id" className={`form-select ${invalid('district_id')}`} value={values.district_id || ''} onChange={onDistrict} disabled={loadingMaster && !districts.length}>
            <option value="">{t('joinForm.selectPlaceholder')}</option>
            {districts.map((d) => <option key={d.id} value={d.id}>{optionLabel(d, tamilNames)}</option>)}
          </select>
          <ErrorMessage name="district_id" component="div" className="invalid-feedback" />
        </div>
        <div className="col-md-6">
          <label htmlFor="block_id" className="form-label small fw-semibold">
            {t('joinForm.talukBlock')} *
            {loadingBlocks && <span className="spinner-border spinner-border-sm ms-2 text-maroon"></span>}
          </label>
          <select id="block_id" className={`form-select ${invalid('block_id')}`} value={values.block_id || ''} onChange={onBlock} disabled={!values.district_id || loadingBlocks}>
            <option value="">{t('joinForm.selectPlaceholder')}</option>
            {blocks.map((b) => <option key={b.id} value={b.id}>{optionLabel(b, tamilNames)}</option>)}
          </select>
          <ErrorMessage name="block_id" component="div" className="invalid-feedback" />
        </div>
        <div className="col-md-6">
          <label htmlFor="village_id" className="form-label small fw-semibold">
            {t('joinForm.village')}
            {loadingVillages && <span className="spinner-border spinner-border-sm ms-2 text-maroon"></span>}
          </label>
          {values.block_id && !loadingVillages && villages.length === 0 ? (
            <Field id="village_id" name="village_custom" className="form-control" placeholder={t('joinForm.villagePlaceholder')} />
          ) : (
            <Field as="select" id="village_id" name="village_id" className="form-select" disabled={!values.block_id || loadingVillages}>
              <option value="">{t('joinForm.selectPlaceholder')}</option>
              {villages.map((v) => <option key={v.id} value={v.id}>{v.name_en}</option>)}
            </Field>
          )}
        </div>
        <div className="col-md-6">
          <label htmlFor="role_id" className="form-label small fw-semibold">{t('joinForm.joinAs')} *</label>
          <Field as="select" id="role_id" name="role_id" className={`form-select ${invalid('role_id')}`} disabled={loadingMaster && !roles.length}>
            <option value="">{t('joinForm.selectPlaceholder')}</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {roleLabel(role)}
              </option>
            ))}
          </Field>
          <ErrorMessage name="role_id" component="div" className="invalid-feedback" />
        </div>
        <div className="col-12">
          <label htmlFor="address_line1" className="form-label small fw-semibold">{t('joinForm.address')}</label>
          <Field id="address_line1" name="address_line1" autoComplete="street-address" className="form-control" />
        </div>

        <div className="col-12 mt-4">
          <div className="p-3 rounded-3 border" style={{ background: 'var(--maroon-50)' }}>
            <div className="form-check">
              <Field type="checkbox" name="consent_terms" id="consent_terms" className={`form-check-input ${invalid('consent_terms')}`} />
              <label htmlFor="consent_terms" className="form-check-label small">
                {t('joinForm.consentPrefix')}
                <Link to="/privacy-policy" target="_blank">{t('joinForm.consentPrivacy')}</Link>
                {t('joinForm.consentAnd')}
                <Link to="/terms" target="_blank">{t('joinForm.consentTerms')}</Link>
                {t('joinForm.consentSuffix')}
              </label>
              <ErrorMessage name="consent_terms" component="div" className="invalid-feedback" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-top d-flex flex-wrap gap-2 justify-content-end">
        <button type="submit" className="btn btn-maroon px-5" disabled={isSubmitting}>
          {isSubmitting ? (
            <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>{t('joinForm.registering')}</>
          ) : (
            <>{t('joinForm.submitRegistration')} <i className="bi bi-check-circle ms-1"></i></>
          )}
        </button>
      </div>
    </div>
  );
};
