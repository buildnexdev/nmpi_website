import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface RegistrationProgressProps {
  currentTab: number;
}

const STEPS = ['personal', 'identity', 'idCard'];

export const RegistrationProgress: React.FC<RegistrationProgressProps> = ({ currentTab }) => {
  const { t } = useLanguage();
  return (
    <ol className="wizard-steps list-unstyled" aria-label={t('registrationProgress.ariaLabel')}>
      {STEPS.map((s, i) => {
        const step = i + 1;
        const state = step < currentTab ? 'done' : step === currentTab ? 'active' : '';
        return (
          <li key={s} className={`wizard-step ${state}`} aria-current={state === 'active' ? 'step' : undefined}>
            <span className="num">{state === 'done' ? <i className="bi bi-check-lg"></i> : step}</span>
            <span className="label">{t(`registrationProgress.steps.${s}`)}</span>
          </li>
        );
      })}
    </ol>
  );
};
