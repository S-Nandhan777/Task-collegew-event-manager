import { useEffect, useState } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import { Photo } from '../types';
import styles from '../styles/PhotoGallery.module.css';

export default function PhotoGallery({ eventId }: { eventId: number }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, [eventId]);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const response = await api.get<Photo[]>(`/photos/${eventId}`);
      setPhotos(response.data);
    } catch (error: any) {
      toast.error('Failed to load photos');
      console.error('Fetch photos error:', error.response?.status, error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.photoGallery}>
      {loading ? (
        <div className={styles.loading}>Loading photos...</div>
      ) : photos.length ? (
        photos.map(photo => (
          <img key={photo.photo_id} src={photo.photo_url} alt="Event" className={styles.photo} />
        ))
      ) : (
        <div className={styles.noPhotos}>No photos available</div>
      )}
    </div>
  );
}