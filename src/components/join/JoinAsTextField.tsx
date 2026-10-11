import React from 'react';
import { Field, ErrorMessage } from 'formik';
import { useLanguage } from '../../context/LanguageContext';

type Props = {
  invalidClass?: string;
  id?: string;
};

export const JoinAsTextField: React.FC<Props> = ({ invalidClass = '', id = 'join_as' }) => {
  const { t } = useLanguage();
  return (
    <div className="join-as-text-field">
      <label htmlFor={id} className="visually-hidden">
        {t('joinForm.joinAs')}
      </label>
      <Field
        id={id}
        name="join_as"
        type="text"
        className={`form-control ${invalidClass}`.trim()}
        placeholder={t('joinForm.joinAsPlaceholder')}
        autoComplete="off"
        maxLength={100}
      />
      <p className="small text-muted mt-1 mb-0">{t('joinForm.joinAsHint')}</p>
      <ErrorMessage name="join_as" component="div" className="invalid-feedback" />
    </div>
  );
};
