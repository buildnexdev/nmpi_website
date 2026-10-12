import React, { useEffect } from 'react';
import { DonateCard } from './DonateCard';
import { useLanguage } from '../../context/LanguageContext';

interface DonateModalProps {
  show: boolean;
  onClose: () => void;
}

export const DonateModal: React.FC<DonateModalProps> = ({ show, onClose }) => {
  const { t } = useLanguage();

  useEffect(() => {
    if (!show) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="donate-modal-title"
        style={{ zIndex: 1060 }}
        onClick={onClose}
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          style={{ maxWidth: 760 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content shadow-lg border-0 rounded-4 overflow-hidden">
            <div
              className="modal-header border-bottom py-3 px-4 d-flex align-items-center justify-content-between"
              style={{ background: 'linear-gradient(90deg, #7A0C16 0%, #990000 100%)', color: '#fff' }}
            >
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white"
                  style={{ width: 38, height: 38, background: 'rgba(212, 175, 55, 0.25)', border: '1px solid rgba(212, 175, 55, 0.4)' }}
                >
                  <i className="bi bi-heart-fill text-warning fs-5"></i>
                </div>
                <div>
                  <h5 className="modal-title fw-bold mb-0 text-white" id="donate-modal-title">
                    {t('common.donateNow')}
                  </h5>
                  <div className="small text-white-50">Netaji Makkal Pathukappu Iyakkam</div>
                </div>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white shadow-none"
                onClick={onClose}
                aria-label={t('common.close')}
              ></button>
            </div>

            <div className="modal-body p-3 p-md-4 bg-light">
              <DonateCard compact={true} />
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" style={{ zIndex: 1055 }}></div>
    </>
  );
};
