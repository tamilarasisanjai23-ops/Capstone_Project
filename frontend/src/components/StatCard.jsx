import React from 'react';

export const StatCard = ({ icon: Icon, value, label, subtext, color = 'indigo' }) => {
  return (
    <div className="glass-card stat-card">
      {Icon && (
        <div className={`stat-icon-wrapper stat-icon-${color}`}>
          <Icon size={24} />
        </div>
      )}
      <div className="stat-content">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
        {subtext && <span className="stat-sub">{subtext}</span>}
      </div>
    </div>
  );
};

export default StatCard;
