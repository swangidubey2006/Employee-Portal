import React, { useEffect, useState } from 'react';
import { Megaphone, Clock3 } from 'lucide-react';
import { announcementApi } from '../../services/api.js';

const relativeTime = (date) => {
  const diff = Math.max(0, Date.now() - new Date(date).getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

const AnnouncementsCard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    announcementApi.getAnnouncements()
      .then((res) => mounted && setAnnouncements(Array.isArray(res?.data) ? res.data : []))
      .catch((error) => console.error('Announcements load failed:', error))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <div className="announcements-card">
      <div className="card-header-row">
        <h3 className="card-section-title">Announcements</h3>
        <Megaphone size={18} className="announcement-header-icon" />
      </div>
      <div className="announcements-list">
        {loading ? (
          <div className="announcement-empty-state">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="announcement-empty-state">No announcements yet.</div>
        ) : announcements.slice(0, 5).map((item) => (
          <div key={item._id} className="announcement-item">
            <div className="announcement-top-row">
              <div className="tag-group">
                <span className="tag-dot dot-green" />
                <span className="announcement-tag">{item.tag || 'GENERAL'}</span>
              </div>
              <span className="announcement-time"><Clock3 size={12} /> {relativeTime(item.createdAt)}</span>
            </div>
            <h4 className="announcement-title">{item.title}</h4>
            <p className="announcement-desc">{item.message}</p>
            {item.publishedByName && <span className="announcement-author">By {item.publishedByName}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsCard;
