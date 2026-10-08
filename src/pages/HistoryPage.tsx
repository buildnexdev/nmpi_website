import React from 'react';
import { CmsPage } from '../components/CmsPage';
import { mediaUrl } from '../services/apiClient';

export const HistoryPage: React.FC = () => (
  <CmsPage
    pageKey="history"
    eyebrowKey="historyPage.eyebrow"
    fallbackTitleKey="historyPage.fallbackTitle"
    image={mediaUrl('/uploads/IMG-20260925-WA0000.jpg')}
  />
);
