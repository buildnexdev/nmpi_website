import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../services/apiClient';

export const NewsDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<any>(null);

  useEffect(() => {
    if (id) {
      apiClient.get(`/news/${id}`).then(res => setNews(res.data.data)).catch(() => {});
    }
  }, [id]);

  if (!news) return <div className="container py-5 text-center"><div className="spinner-border text-maroon"></div></div>;

  return (
    <div className="container py-5">
      <Link to="/news" className="btn btn-outline-secondary btn-sm mb-4"><i className="bi bi-arrow-left me-1"></i> Back to News</Link>
      
      <div className="card-custom p-4 p-md-5">
        <span className="badge gold-badge mb-2">{news.category_name || 'Announcement'}</span>
        <h1 className="text-maroon fw-bold h2 mb-3">{news.title}</h1>
        
        <div className="text-muted small mb-4 pb-3 border-bottom d-flex gap-3">
          <span><i className="bi bi-calendar3 text-gold me-1"></i> {new Date(news.published_at).toLocaleDateString()}</span>
          <span><i className="bi bi-person text-gold me-1"></i> Author: {news.author_name || 'Admin'}</span>
        </div>

        {news.cover_image && (
          <img src={news.cover_image} alt={news.title} className="img-fluid rounded mb-4 w-100" style={{ maxHeight: 400, objectFit: 'cover' }} />
        )}

        <div className="content-body" dangerouslySetInnerHTML={{ __html: news.content }} />
      </div>
    </div>
  );
};
