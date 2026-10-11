import React from 'react';
import { ErrorMessage, useFormikContext } from 'formik';
import { RoleOption } from '../../services/masterDataService';
import { useLanguage } from '../../context/LanguageContext';
import { JOIN_ROLE_FALLBACK, mergeJoinRoleOptions } from './joinRoleOptions';
import './JoinRolePicker.css';

type Props = {
  roles: RoleOption[];
  disabled?: boolean;
  invalidClass?: string;
};

export function roleOptionLabel(role: RoleOption, t: (key: string) => string): string {
  const id = Number(role.id);
  if (role.name === 'Volunteer' || id === 2) return t('joinForm.roleVolunteer');
  return t('joinForm.roleMember');
}

export function roleOptionHint(role: RoleOption, t: (key: string) => string): string {
  const id = Number(role.id);
  if (role.name === 'Volunteer' || id === 2) return t('joinForm.roleVolunteerHint');
  return t('joinForm.roleMemberHint');
}

export const JoinRolePicker: React.FC<Props> = ({ roles, disabled, invalidClass = '' }) => {
  const { t } = useLanguage();
  const { values, setFieldValue, setFieldTouched, errors, touched } = useFormikContext<any>();
  const options = mergeJoinRoleOptions(roles.length ? roles : JOIN_ROLE_FALLBACK);
  const selected = String(values.role_id ?? options[0]?.id ?? '');
  const showError = touched.role_id && errors.role_id;

  return (
    <div className={`join-role-picker ${invalidClass}`.trim()}>
      <div className="join-role-options" role="radiogroup" aria-label={t('joinForm.joinAs')}>
        {options.map((role) => {
          const id = String(role.id);
          const checked = selected === id;
          return (
            <label
              key={role.id}
              className={`join-role-option ${checked ? 'is-selected' : ''} ${disabled ? 'is-disabled' : ''}`}
            >
              <input
                type="radio"
                name="role_id"
                value={id}
                checked={checked}
                disabled={disabled}
                onChange={() => {
                  setFieldValue('role_id', role.id);
                  setFieldTouched('role_id', true);
                }}
              />
              <span className="join-role-option-body">
                <span className="join-role-option-title">{roleOptionLabel(role, t)}</span>
                <span className="join-role-option-hint">{roleOptionHint(role, t)}</span>
              </span>
              <i
                className={`bi ${Number(role.id) === 2 || role.name === 'Volunteer' ? 'bi-people-fill' : 'bi-person-badge-fill'} join-role-option-icon`}
                aria-hidden="true"
              ></i>
            </label>
          );
        })}
      </div>

      {showError && <div className="invalid-feedback d-block">{String(errors.role_id)}</div>}
      <ErrorMessage name="role_id" component="div" className="invalid-feedback" />
    </div>
  );
};
