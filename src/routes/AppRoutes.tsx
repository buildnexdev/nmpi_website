import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { HomePage } from '../pages/HomePage';
import { AboutPage } from '../pages/AboutPage';
import { HistoryPage } from '../pages/HistoryPage';
import { StructurePage } from '../pages/StructurePage';
import { LeadershipPage } from '../pages/LeadershipPage';
import { NewsPage } from '../pages/NewsPage';
import { NewsDetailsPage } from '../pages/NewsDetailsPage';
import { EventsPage } from '../pages/EventsPage';
import { EventDetailsPage } from '../pages/EventDetailsPage';
import { GalleryPage } from '../pages/GalleryPage';
import { MembershipPage } from '../pages/MembershipPage';
import { JoinPage } from '../pages/JoinPage';
import { LoginPage } from '../pages/LoginPage';
import { VerifyPage } from '../pages/VerifyPage';
import { ContactPage } from '../pages/ContactPage';
import { FaqPage } from '../pages/FaqPage';
import { PrivacyPage } from '../pages/PrivacyPage';
import { TermsPage } from '../pages/TermsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { AchievementsPage } from '../pages/AchievementsPage';
import { IdeologyPage } from '../pages/IdeologyPage';
import { ActionsPage } from '../pages/ActionsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="ideology" element={<IdeologyPage />} />
        <Route path="actions" element={<ActionsPage />} />
        <Route path="achievements" element={<AchievementsPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="structure" element={<StructurePage />} />
        <Route path="leadership" element={<LeadershipPage />} />
        <Route path="news" element={<NewsPage />} />
        <Route path="news/:id" element={<NewsDetailsPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventDetailsPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="membership" element={<MembershipPage />} />
        <Route path="join" element={<JoinPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="verify/:token" element={<VerifyPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="privacy-policy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
};
