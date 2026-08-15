import React from 'react';
import { Megaphone } from 'lucide-react';

const AnnouncementsCard = () => {
  const announcements = [
    {
      id: 1,
      tag: 'NEW POLICY',
      time: '2 hours ago',
      title: 'Update on remote work flexibility',
      desc: 'Effective from June 1st, all employees are eligible for 3 days remote work.',
      isNew: true,
    },
    {
      id: 2,
      tag: 'COMPANY EVENT',
      time: 'Yesterday',
      title: 'Annual Summer Retreat: Location Reveal',
      desc: 'Head to the mountains this year for a 3-day wellness and team...',
      isNew: false,
    },
  ];

  return (
    <div className="announcements-card">
      <div className="card-header-row">
        <h3 className="card-section-title">Announcements</h3>
        <Megaphone size={18} className="announcement-header-icon" />
      </div>

      <div className="announcements-list">
        {announcements.map((item) => (
          <div key={item.id} className="announcement-item">
            <div className="announcement-top-row">
              <div className="tag-group">
                <span className={`tag-dot ${item.isNew ? 'dot-green' : 'dot-slate'}`} />
                <span className="announcement-tag">{item.tag}</span>
              </div>
              <span className="announcement-time">{item.time}</span>
            </div>

            <h4 className="announcement-title">{item.title}</h4>
            <p className="announcement-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsCard;
