import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import { Footer } from '../components/Footer/Footer';
import { LoadingSpinner } from '../components/LoadingSpinner/LoadingSpinner';

export const MainLayout: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show smooth loading spinner on navigation changes
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="d-flex flex-column min-vh-100">
      {loading && <LoadingSpinner fullScreen message="Loading Netaji Iyakkam Platform..." />}
      <Header />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
