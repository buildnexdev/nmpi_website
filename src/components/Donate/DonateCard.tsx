import React, { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { useLanguage } from '../../context/LanguageContext';
import { DONATION_UPI_ID, DONATION_PAYEE_NAME, DONATION_OFFICIAL_EMAIL, CONTACT_PHONE } from '../../constants/contact';

const PRESET_AMOUNTS = [100, 250, 500, 1000, 2000];

interface DonateCardProps {
  compact?: boolean;
}

export const DonateCard: React.FC<DonateCardProps> = ({ compact = false }) => {
  const { t } = useLanguage();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [qrLoading, setQrLoading] = useState(true);

  const activeAmount = useMemo(() => {
    if (isCustom) {
      const parsed = parseFloat(customAmount);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    }
    return selectedAmount;
  }, [isCustom, customAmount, selectedAmount]);

  const upiUri = useMemo(() => {
    const encodedName = encodeURIComponent(DONATION_PAYEE_NAME);
    let uri = `upi://pay?pa=${DONATION_UPI_ID}&pn=${encodedName}&cu=INR`;
    if (activeAmount && activeAmount > 0) {
      uri += `&am=${activeAmount.toFixed(2)}`;
    }
    return uri;
  }, [activeAmount]);

  useEffect(() => {
    let active = true;
    setQrLoading(true);
    QRCode.toDataURL(upiUri, {
      width: compact ? 220 : 260,
      margin: 1,
      color: {
        dark: '#7A0C16', // NMPI Maroon
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (active) {
          setQrCodeUrl(url);
          setQrLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate donation QR code:', err);
        if (active) setQrLoading(false);
      });

    return () => {
      active = false;
    };
  }, [upiUri, compact]);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(DONATION_UPI_ID);
      } else {
        const input = document.createElement('input');
        input.value = DONATION_UPI_ID;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Clipboard copy failed:', e);
    }
  };

  const handlePresetClick = (amount: number) => {
    setIsCustom(false);
    setSelectedAmount(amount);
  };

  const handleCustomFocus = () => {
    setIsCustom(true);
    setSelectedAmount(null);
  };

  return (
    <div className={`card-custom ${compact ? 'p-3 p-md-4' : 'p-4 p-lg-5'} bg-white shadow-sm border rounded-4`}>
      <div className="text-center mb-4">
        <span className="badge rounded-pill px-3 py-2 text-uppercase fw-semibold" style={{ background: 'rgba(212, 175, 55, 0.15)', color: '#8A6D1A', border: '1px solid rgba(212, 175, 55, 0.4)' }}>
          <i className="bi bi-shield-check me-1"></i> {t('donatePage.upiCardTitle')}
        </span>
        <h3 className="h4 fw-bold mt-2 mb-1" style={{ color: 'var(--primary-maroon)' }}>
          {t('donatePage.title')}
        </h3>
        <p className="text-muted small mb-0">
          {t('donatePage.scanQr')}
        </p>
      </div>

      {/* Preset Amount Pills */}
      <div className="mb-4">
        <label className="form-label small fw-semibold text-secondary d-flex justify-content-between">
          <span>{t('donatePage.selectAmount')}</span>
          {activeAmount && (
            <span className="fw-bold text-dark">
              ₹{activeAmount.toLocaleString('en-IN')}
            </span>
          )}
        </label>
        <div className="d-flex flex-wrap gap-2 mb-2">
          {PRESET_AMOUNTS.map((amt) => {
            const active = !isCustom && selectedAmount === amt;
            return (
              <button
                key={amt}
                type="button"
                className={`btn btn-sm px-3 py-2 fw-semibold rounded-pill transition-all ${
                  active
                    ? 'btn-maroon text-white shadow-sm'
                    : 'btn-outline-secondary text-dark bg-light border-0'
                }`}
                onClick={() => handlePresetClick(amt)}
              >
                ₹{amt}
              </button>
            );
          })}
          <button
            type="button"
            className={`btn btn-sm px-3 py-2 fw-semibold rounded-pill ${
              isCustom
                ? 'btn-maroon text-white shadow-sm'
                : 'btn-outline-secondary text-dark bg-light border-0'
            }`}
            onClick={handleCustomFocus}
          >
            {t('donatePage.customAmount')}
          </button>
        </div>

        {isCustom && (
          <div className="input-group input-group-sm mt-2 animate-fadeIn" style={{ maxWidth: 280 }}>
            <span className="input-group-text bg-light border-end-0 fw-bold">₹</span>
            <input
              type="number"
              min="1"
              step="10"
              placeholder="Enter amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="form-control border-start-0"
              autoFocus
            />
          </div>
        )}
      </div>

      <div className="row g-4 align-items-center">
        {/* QR Code Container */}
        <div className="col-12 col-md-5 d-flex flex-column align-items-center">
          <div
            className="p-3 bg-white rounded-4 shadow-sm border position-relative text-center"
            style={{
              borderColor: 'rgba(212, 175, 55, 0.4)',
              background: 'linear-gradient(180deg, #fff 0%, #fffdf8 100%)',
            }}
          >
            {qrLoading ? (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ width: compact ? 220 : 260, height: compact ? 220 : 260 }}
              >
                <div className="spinner-border text-maroon" role="status">
                  <span className="visually-hidden">Generating QR...</span>
                </div>
              </div>
            ) : (
              <img
                src={qrCodeUrl}
                alt="NMPI Donation UPI QR Code"
                className="img-fluid rounded-3"
                style={{ width: compact ? 220 : 260, height: compact ? 220 : 260 }}
              />
            )}
            <div className="mt-2 text-center small text-muted d-flex align-items-center justify-content-center gap-2">
              <span className="badge bg-light text-dark border">
                <i className="bi bi-qr-code-scan me-1 text-primary"></i> Scan to Pay
              </span>
              {activeAmount && (
                <span className="badge bg-warning-subtle text-dark border border-warning-subtle fw-bold">
                  ₹{activeAmount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* UPI Details & Actions */}
        <div className="col-12 col-md-7">
          {/* UPI ID Field with 1-click Copy */}
          <div className="p-3 rounded-3 bg-light border mb-3">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="small text-muted fw-semibold">{t('donatePage.upiIdLabel')}</span>
              <span className="badge bg-success-subtle text-success border border-success-subtle small">
                <i className="bi bi-check-circle-fill me-1"></i> Verified
              </span>
            </div>
            <div className="d-flex align-items-center justify-content-between gap-2 mt-1">
              <span className="font-monospace fw-bold fs-6 text-dark text-break">
                {DONATION_UPI_ID}
              </span>
              <button
                type="button"
                className={`btn btn-sm ${copied ? 'btn-success' : 'btn-outline-maroon'} px-3 d-inline-flex align-items-center gap-1 shadow-none`}
                onClick={handleCopy}
                title={t('donatePage.copyUpi')}
              >
                <i className={`bi ${copied ? 'bi-check2' : 'bi-clipboard'}`}></i>
                <span>{copied ? t('donatePage.copied') : t('donatePage.copyUpi')}</span>
              </button>
            </div>
          </div>

          {/* Payee Name Field */}
          <div className="px-3 py-2 rounded-3 bg-light border mb-3">
            <div className="small text-muted">{t('donatePage.payeeNameLabel')}</div>
            <div className="fw-semibold text-dark small">{DONATION_PAYEE_NAME}</div>
          </div>

          {/* Direct Pay via UPI App (GPay / PhonePe / Paytm) */}
          <a
            href={upiUri}
            className="btn btn-gold btn-lg w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2 shadow-sm mb-3"
          >
            <i className="bi bi-phone-vibrate-fill"></i>
            <span>{t('donatePage.payViaApp')}</span>
          </a>

          {/* Supported Apps Logos/Text */}
          <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 pt-1 text-muted small">
            <span className="badge bg-light text-secondary border px-2 py-1">Google Pay</span>
            <span className="badge bg-light text-secondary border px-2 py-1">PhonePe</span>
            <span className="badge bg-light text-secondary border px-2 py-1">Paytm</span>
            <span className="badge bg-light text-secondary border px-2 py-1">BHIM UPI</span>
            <span className="badge bg-light text-secondary border px-2 py-1">Any Banking App</span>
          </div>
        </div>
      </div>

      {/* Trust & Transparency Footnote */}
      <div className="mt-4 pt-3 border-top">
        <div className="row g-2 text-muted small">
          <div className="col-12 col-md-4 d-flex align-items-center gap-2">
            <i className="bi bi-shield-fill-check text-success fs-5"></i>
            <span>{t('donatePage.trust1')}</span>
          </div>
          <div className="col-12 col-md-4 d-flex align-items-center gap-2">
            <i className="bi bi-mortarboard-fill text-primary fs-5"></i>
            <span>{t('donatePage.trust2')}</span>
          </div>
          <div className="col-12 col-md-4 d-flex align-items-center gap-2">
            <i className="bi bi-file-earmark-text-fill text-warning fs-5"></i>
            <span>{t('donatePage.trust3')}</span>
          </div>
        </div>

        <div className="alert alert-light border small mt-3 mb-0 text-muted d-flex align-items-start gap-2">
          <i className="bi bi-info-circle-fill text-secondary mt-1"></i>
          <div>
            {t('donatePage.note')}
            <div className="mt-1">
              <strong>Email:</strong> {DONATION_OFFICIAL_EMAIL} • <strong>Phone:</strong> +91 {CONTACT_PHONE}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
