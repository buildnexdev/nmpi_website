import React from 'react';
import { Link } from 'react-router-dom';
import './NewsCard.css';

interface NewsCardProps {
  id: number | string;
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
  coverImage: string | null;
}

export const NewsCard: React.FC<NewsCardProps> = ({ id, title, summary, category, publishedAt, coverImage }) => {
  return (
    <div className="card-custom news-card">
      <div className="news-card-img-wrapper">
        <img
          src={coverImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800'}
          alt={title}
          className="news-card-img"
        />
        <span className="news-category-badge">{category}</span>
      </div>
      <div className="card-body d-flex flex-column p-3">
        <div className="text-muted small mb-2 d-flex align-items-center gap-1">
          <i className="bi bi-calendar3 text-gold"></i>
          <span>{new Date(publishedAt).toLocaleDateString()}</span>
        </div>
        <h5 className="card-title h6 text-maroon mb-2" style={{ lineHeight: 1.4 }}>
          {title}
        </h5>
        <p className="card-text small text-muted flex-grow-1 mb-3">
          {summary.length > 110 ? `${summary.substring(0, 110)}...` : summary}
        </p>
        <Link to={`/news/${id}`} className="btn btn-outline-danger btn-sm w-100 mt-auto">
          Read Full Announcement <i className="bi bi-arrow-right ms-1"></i>
        </Link>
      </div>
    </div>
  );
};
