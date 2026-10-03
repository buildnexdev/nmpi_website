import React from 'react';

interface RegistrationProgressProps {
  currentTab: number;
  lang?: string;
}

const STEPS = [
  { ta: 'தனிப்பட்ட விவரங்கள்', en: 'Personal details' },
  { ta: 'அடையாளம் & முகவரி', en: 'Identity & location' },
  { ta: 'அடையாள அட்டை', en: 'Digital ID card' },
];

export const RegistrationProgress: React.FC<RegistrationProgressProps> = ({ currentTab, lang = 'ta' }) => (
  <ol className="wizard-steps list-unstyled" aria-label={lang === 'ta' ? 'பதிவு படிகள்' : 'Registration steps'}>
    {STEPS.map((s, i) => {
      const step = i + 1;
      const state = step < currentTab ? 'done' : step === currentTab ? 'active' : '';
      return (
        <li key={s.en} className={`wizard-step ${state}`} aria-current={state === 'active' ? 'step' : undefined}>
          <span className="num">{state === 'done' ? <i className="bi bi-check-lg"></i> : step}</span>
          <span className="label">{lang === 'ta' ? s.ta : s.en}</span>
        </li>
      );
    })}
  </ol>
);
