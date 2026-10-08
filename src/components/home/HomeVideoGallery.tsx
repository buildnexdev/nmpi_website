import React, { useEffect, useState } from 'react';
import { apiClient, asArray, mediaUrl } from '../../services/apiClient';
import { useLanguage } from '../../context/LanguageContext';

type VideoItem = { path: string; filename: string; kind?: string };

type Props = {
  variant?: 'inline' | 'band';
};

export const HomeVideoGallery: React.FC<Props> = ({ variant = 'inline' }) => {
  const { t } = useLanguage();
  const [videos, setVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    apiClient
      .get('/uploads/list', { params: { folder: 'Videos' } })
      .then((res) => setVideos(asArray(res.data.data).slice(0, 3)))
      .catch(() => setVideos([]));
  }, []);

  if (videos.length === 0) return null;

  const rootClass = variant === 'band' ? 'home-about-videos-band' : 'home-about-videos';

  return (
    <div className={rootClass}>
      <div className={variant === 'band' ? 'home-about-videos-band-inner' : undefined}>
        <h3 className="home-about-videos-title">
          <i className="bi bi-play-circle me-2" aria-hidden="true"></i>
          {t('homePage.videosTitle')}
        </h3>
        <div className="home-about-videos-grid">
          {videos.map((v) => (
            <div key={v.path} className="home-about-video-card">
              <video controls playsInline preload="metadata" src={mediaUrl(v.path)} title={v.filename} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
