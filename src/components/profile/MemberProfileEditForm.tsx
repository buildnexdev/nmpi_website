import React, { useCallback, useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as yup from 'yup';
import { useLanguage } from '../../context/LanguageContext';
import { mediaUrl, errorMessage } from '../../services/apiClient';
import {
  masterDataService,
  ParliamentOption,
  AssemblyOption,
  DistrictOption,
  BlockOption,
  VillageOption,
} from '../../services/masterDataService';
import { memberService, UpdateMemberProfilePayload } from '../../services/memberService';
import { JoinAsTextField } from '../join/JoinAsTextField';
import { roleIdFromJoinAsText } from '../join/joinAsRole';

export type ProfileForEdit = {
  full_name: string;
  father_name: string | null;
  date_of_birth: string | null;
  gender: string | null;
  blood_group: string | null;
  profile_image: string | null;
  state_id?: number;
  parliament_constituency_id?: number;
  assembly_constituency_id?: number | null;
  district_id?: number;
  block_id?: number;
  village_id?: number | null;
  village_custom?: string | null;
  address_line1?: string | null;
  role_id?: number;
  role_name?: string | null;
};

type Props = {
  profile: ProfileForEdit;
  onSaved: (profile: any) => void;
  onCancel: () => void;
};

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown'];

type EditValues = UpdateMemberProfilePayload & { profile_image: File | null; join_as: string };

type BodyProps = {
  profile: ProfileForEdit;
  parliaments: ParliamentOption[];
  districts: DistrictOption[];
  loadingMaster: boolean;
  loadError: string | null;
  onCancel: () => void;
  submitError: string | null;
};

const ProfileEditFormBody: React.FC<BodyProps> = ({
  profile,
  parliaments,
  districts,
  loadingMaster,
  loadError,
  onCancel,
  submitError,
}) => {
  const { lang, t } = useLanguage();
  const tamilNames = lang === 'ta';
  const { values, setFieldValue, isSubmitting, touched, errors } = useFormikContext<EditValues>();
  const [assemblies, setAssemblies] = useState<AssemblyOption[]>([]);
  const [blocks, setBlocks] = useState<BlockOption[]>([]);
  const [villages, setVillages] = useState<VillageOption[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const optionLabel = (o: { name_en: string; name_ta?: string | null }) =>
    tamilNames && o.name_ta ? `${o.name_ta} (${o.name_en})` : o.name_en;

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
    masterDataService.getBlocks(Number(values.district_id)).then(setBlocks).catch(() => setBlocks([]));
  }, [values.district_id]);

  useEffect(() => {
    if (!values.block_id) return setVillages([]);
    masterDataService.getVillages(Number(values.block_id)).then(setVillages).catch(() => setVillages([]));
  }, [values.block_id]);

  useEffect(() => {
    if (!(values.profile_image instanceof File)) {
      setPhotoPreview(null);
      return;
    }
    const url = URL.createObjectURL(values.profile_image);
    setPhotoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [values.profile_image]);

  const invalid = (name: keyof EditValues) => (touched[name] && errors[name] ? 'is-invalid' : '');

  return (
    <Form noValidate className="member-profile-edit">
      {loadError && <div className="alert alert-warning small">{loadError}</div>}
      {submitError && <div className="alert alert-danger small">{submitError}</div>}

      <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
        <img
          src={photoPreview || mediaUrl(profile.profile_image) || '/logo.jpg'}
          alt=""
          className="rounded-circle border"
          width={72}
          height={72}
          style={{ objectFit: 'cover' }}
        />
        <div>
          <label className="btn btn-sm btn-outline-maroon mb-0">
            {t('profilePage.edit.changePhoto')}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = '';
                if (file) setFieldValue('profile_image', file);
              }}
            />
          </label>
          <p className="small text-muted mb-0 mt-1">{t('profilePage.edit.photoOptional')}</p>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label small fw-semibold">{t('joinForm.fullName')} *</label>
          <Field name="full_name" className={`form-control ${invalid('full_name')}`} />
          <ErrorMessage name="full_name" component="div" className="invalid-feedback" />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">{t('joinForm.fatherName')} *</label>
          <Field name="father_name" className={`form-control ${invalid('father_name')}`} />
          <ErrorMessage name="father_name" component="div" className="invalid-feedback" />
        </div>
        <div className="col-md-4">
          <label className="form-label small fw-semibold">{t('joinForm.dateOfBirth')} *</label>
          <Field type="date" name="date_of_birth" className={`form-control ${invalid('date_of_birth')}`} />
          <ErrorMessage name="date_of_birth" component="div" className="invalid-feedback" />
        </div>
        <div className="col-md-4">
          <label className="form-label small fw-semibold">{t('joinForm.gender')} *</label>
          <Field as="select" name="gender" className="form-select">
            <option value="MALE">{t('joinForm.genderMale')}</option>
            <option value="FEMALE">{t('joinForm.genderFemale')}</option>
            <option value="OTHER">{t('joinForm.genderOther')}</option>
          </Field>
        </div>
        <div className="col-md-4">
          <label className="form-label small fw-semibold">{t('joinForm.bloodGroup')}</label>
          <Field as="select" name="blood_group" className="form-select">
            {bloodGroups.map((g) => (
              <option key={g} value={g}>
                {g === 'Unknown' ? t('joinForm.bloodGroupUnknown') : g}
              </option>
            ))}
          </Field>
        </div>
      </div>

      <h3 className="h6 text-uppercase text-muted fw-bold mt-4 mb-2" style={{ letterSpacing: '.08em' }}>
        {t('joinForm.joinAs')} *
      </h3>
      <JoinAsTextField invalidClass={invalid('join_as') || invalid('role_id')} id="profile_join_as" />

      <h3 className="h6 text-uppercase text-muted fw-bold mt-4 mb-3" style={{ letterSpacing: '.08em' }}>
        {t('joinForm.constituencyAddress')}
      </h3>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label small fw-semibold">{t('joinForm.parliamentConstituency')} *</label>
          <select
            className={`form-select ${invalid('parliament_constituency_id')}`}
            value={values.parliament_constituency_id || ''}
            onChange={(e) => {
              setFieldValue('parliament_constituency_id', e.target.value);
              setFieldValue('assembly_constituency_id', '');
            }}
          >
            <option value="">{t('joinForm.selectPlaceholder')}</option>
            {parliaments.map((p) => (
              <option key={p.id} value={p.id}>
                {optionLabel(p)}
              </option>
            ))}
          </select>
          <ErrorMessage name="parliament_constituency_id" component="div" className="invalid-feedback" />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">{t('joinForm.assemblyConstituency')}</label>
          <Field as="select" name="assembly_constituency_id" className="form-select" disabled={!values.parliament_constituency_id}>
            <option value="">{t('joinForm.selectPlaceholder')}</option>
            {assemblies.map((a) => (
              <option key={a.id} value={a.id}>
                {optionLabel(a)}
              </option>
            ))}
          </Field>
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">{t('joinForm.district')} *</label>
          <select
            className={`form-select ${invalid('district_id')}`}
            value={values.district_id || ''}
            onChange={(e) => {
              setFieldValue('district_id', e.target.value);
              setFieldValue('block_id', '');
              setFieldValue('village_id', '');
            }}
          >
            <option value="">{t('joinForm.selectPlaceholder')}</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {optionLabel(d)}
              </option>
            ))}
          </select>
          <ErrorMessage name="district_id" component="div" className="invalid-feedback" />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">{t('joinForm.talukBlock')} *</label>
          <select
            className={`form-select ${invalid('block_id')}`}
            value={values.block_id || ''}
            onChange={(e) => {
              setFieldValue('block_id', e.target.value);
              setFieldValue('village_id', '');
            }}
            disabled={!values.district_id}
          >
            <option value="">{t('joinForm.selectPlaceholder')}</option>
            {blocks.map((b) => (
              <option key={b.id} value={b.id}>
                {optionLabel(b)}
              </option>
            ))}
          </select>
          <ErrorMessage name="block_id" component="div" className="invalid-feedback" />
        </div>
        <div className="col-md-6">
          <label className="form-label small fw-semibold">{t('joinForm.village')}</label>
          {values.block_id && villages.length === 0 ? (
            <Field name="village_custom" className="form-control" placeholder={t('joinForm.villagePlaceholder')} />
          ) : (
            <Field as="select" name="village_id" className="form-select" disabled={!values.block_id}>
              <option value="">{t('joinForm.selectPlaceholder')}</option>
              {villages.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name_en}
                </option>
              ))}
            </Field>
          )}
        </div>
        <div className="col-12">
          <label className="form-label small fw-semibold">{t('joinForm.address')}</label>
          <Field name="address_line1" className="form-control" />
        </div>
      </div>

      <p className="small text-muted mt-3 mb-0">{t('profilePage.edit.lockedFieldsNote')}</p>

      <div className="d-flex flex-wrap gap-2 justify-content-end mt-4 pt-3 border-top">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={isSubmitting}>
          {t('profilePage.edit.cancel')}
        </button>
        <button type="submit" className="btn btn-maroon px-4" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              {t('profilePage.edit.saving')}
            </>
          ) : (
            t('profilePage.edit.save')
          )}
        </button>
      </div>
    </Form>
  );
};

export const MemberProfileEditForm: React.FC<Props> = ({ profile, onSaved, onCancel }) => {
  const { t } = useLanguage();
  const [parliaments, setParliaments] = useState<ParliamentOption[]>([]);
  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [loadingMaster, setLoadingMaster] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const initialValues: EditValues = {
    full_name: profile.full_name || '',
    father_name: profile.father_name || '',
    date_of_birth: profile.date_of_birth?.slice(0, 10) || '',
    gender: profile.gender || 'MALE',
    blood_group: profile.blood_group || 'Unknown',
    state_id: profile.state_id || 1,
    parliament_constituency_id: profile.parliament_constituency_id || ('' as unknown as number),
    assembly_constituency_id: profile.assembly_constituency_id || undefined,
    district_id: profile.district_id || ('' as unknown as number),
    block_id: profile.block_id || ('' as unknown as number),
    village_id: profile.village_id || '',
    village_custom: profile.village_custom || '',
    address_line1: profile.address_line1 || '',
    role_id: profile.role_id || 1,
    join_as: profile.role_name?.trim() || (profile.role_id === 2 ? 'Volunteer' : 'Member'),
    profile_image: null,
  };

  const schema = yup.object({
    full_name: yup.string().trim().min(2).required(),
    father_name: yup.string().trim().required(),
    date_of_birth: yup.string().required(),
    gender: yup.string().oneOf(['MALE', 'FEMALE', 'OTHER']).required(),
    parliament_constituency_id: yup.number().transform((v, o) => (o === '' ? undefined : v)).positive().required(),
    district_id: yup.number().transform((v, o) => (o === '' ? undefined : v)).positive().required(),
    block_id: yup.number().transform((v, o) => (o === '' ? undefined : v)).positive().required(),
    join_as: yup.string().trim().min(2).max(100).required(),
  });

  const loadMasterLists = useCallback(async () => {
    setLoadingMaster(true);
    setLoadError(null);
    try {
      const [states, districtList] = await Promise.all([
        masterDataService.getStates(),
        masterDataService.getDistricts(),
      ]);
      setDistricts(districtList);
      const preferredState =
        profile.state_id ||
        states.find((s) => s.code === 'TN')?.id ||
        states.find((s) => /tamil/i.test(s.name_en))?.id ||
        1;
      let parl = await masterDataService.getParliaments(preferredState);
      if (!parl.length) parl = await masterDataService.getParliaments();
      setParliaments(parl);
    } catch (err) {
      setLoadError(errorMessage(err, t('joinForm.loadError')));
    } finally {
      setLoadingMaster(false);
    }
  }, [profile.state_id, t]);

  useEffect(() => {
    loadMasterLists();
  }, [loadMasterLists]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitError(null);
        try {
          const { join_as, ...rest } = values;
          const updated = await memberService.updateMyProfile({
            ...rest,
            role_id: roleIdFromJoinAsText(join_as),
          });
          onSaved(updated);
        } catch (err) {
          setSubmitError(errorMessage(err, t('profilePage.edit.saveFailed')));
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <ProfileEditFormBody
        profile={profile}
        parliaments={parliaments}
        districts={districts}
        loadingMaster={loadingMaster}
        loadError={loadError}
        onCancel={onCancel}
        submitError={submitError}
      />
    </Formik>
  );
};
