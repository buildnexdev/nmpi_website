import React, { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { logout } from '../store/authSlice';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { lang, t } = useLanguage();
  const mainRef = useRef<HTMLElement>(null);

  useScrollReveal(mainRef, location.pathname);

  useEffect(() => {
    if (location.hash) return;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onExpired = () => dispatch(logout());
    window.addEventListener('nmpi:session-expired', onExpired);
    return () => window.removeEventListener('nmpi:session-expired', onExpired);
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <a href="#main" className="skip-link">{t('layout.skipToContent')}</a>
      <Header />
      <main id="main" ref={mainRef} className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
