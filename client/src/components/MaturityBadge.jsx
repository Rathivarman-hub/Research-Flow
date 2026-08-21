import React from 'react';
import { Award, Compass, Star, Trophy } from 'lucide-react';

export default function MaturityBadge({ score }) {
  const getBadgeDetails = (score) => {
    if (score <= 40) {
      return {
        level: 'Bronze',
        className: 'badge-bronze',
        icon: <Compass size={16} />,
        description: 'Maturity Level: Bronze. Foundations established. Focus on basic README documentation.',
      };
    }
    if (score <= 70) {
      return {
        level: 'Silver',
        className: 'badge-silver',
        icon: <Award size={16} />,
        description: 'Maturity Level: Silver. Good standards. Unit tests and basic git usage configured.',
      };
    }
    if (score <= 90) {
      return {
        level: 'Gold',
        className: 'badge-gold',
        icon: <Star size={16} />,
        description: 'Maturity Level: Gold. High standard! Reproducibility Docker assets and branch practices verified.',
      };
    }
    return {
      level: 'Platinum',
      className: 'badge-platinum',
      icon: <Trophy size={16} />,
      description: 'Maturity Level: Platinum. RSE Excellence! Complete documentation, CI testing, and fully pinned dependencies.',
    };
  };

  const { level, className, icon, description } = getBadgeDetails(score || 0);

  return (
    <div className="d-flex align-items-center gap-2" title={description}>
      <span className={`badge ${className} d-inline-flex align-items-center gap-1.5 px-2.5 py-1.5 rounded-pill font-display fw-bold`} style={{ letterSpacing: '0.5px' }}>
        {icon}
        <span>{level} ({score || 0})</span>
      </span>
    </div>
  );
}
