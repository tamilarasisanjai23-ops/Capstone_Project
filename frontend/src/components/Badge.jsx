import React from 'react';

export const Badge = ({ children, variant, className = '' }) => {
  const v = (variant || children || '').toString().toLowerCase().replace(/\s+/g, '_');
  return (
    <span className={`badge badge-${v} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
