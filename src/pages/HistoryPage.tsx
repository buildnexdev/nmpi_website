import React from 'react';
import { CmsPage } from '../components/CmsPage';
import { mediaUrl } from '../services/apiClient';

export const HistoryPage: React.FC = () => (
  <CmsPage
    pageKey="history"
    eyebrow={{ ta: 'எங்கள் பயணம்', en: 'Our journey' }}
    fallbackTitle={{ ta: 'இயக்க வரலாறு', en: 'History of the Movement' }}
    image={mediaUrl('/uploads/IMG-20260925-WA0000.jpg')}
  />
);
