import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';

export const GalleryPage: React.FC = () => {
  const [albums, setAlbums] = useState<any[]>([]);

  useEffect(() => {
    apiClient.get('/gallery/albums').then(res => setAlbums(res.data.data)).catch(() => {});
  }, []);

  return (
    <div className="container py-5">
      <h1 className="text-maroon fw-bold mb-4">Media & Event Photo Gallery</h1>
      <div className="row g-4">
        {albums.map(album => (
          <div className="col-md-6" key={album.id}>
            <div className="card-custom overflow-hidden">
              <img src={album.cover_image} alt={album.title} style={{ width: '100%', height: 240, objectFit: 'cover' }} />
              <div className="p-3">
                <h5 className="text-maroon fw-bold">{album.title}</h5>
                <p className="small text-muted">{album.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
