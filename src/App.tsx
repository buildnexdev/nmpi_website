import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { LanguageProvider } from './context/LanguageContext';
import { AppRoutes } from './routes/AppRoutes';
import './styles/variables.css';
import './styles/layout.css';
import './styles/responsive.css';

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </LanguageProvider>
    </Provider>
  );
};
