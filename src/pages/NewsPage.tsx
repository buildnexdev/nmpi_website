import React, { useEffect, useState } from 'react';
import { NewsCard } from '../components/NewsCard/NewsCard';
import { apiClient } from '../services/apiClient';

export const NewsPage: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('/news?status=PUBLISHED').then(res => setNews(res.data.data)).catch(() => {});
  }, []);

  return (
    <div className="container py-5">
      <div className="mb-4">
        <span className="text-gold fw-bold text-uppercase small">Public Information</span>
        <h1 className="text-maroon fw-bold h2">Organization Bulletins & News</h1>
      </div>

      <div className="row g-4">
        {news.map(item => (
          <div className="col-lg-4 col-md-6" key={item.id}>
            <NewsCard
              id={item.id}
              title={item.title}
              summary={item.summary}
              category={item.category_name || 'Announcement'}
              publishedAt={item.published_at}
              coverImage={item.cover_image}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
