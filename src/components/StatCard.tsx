
import React from 'react';

type StatCardProps = {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
};

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change,
  changeType = 'neutral' 
}) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-green-500';
    if (changeType === 'negative') return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-semibold">{value}</p>
        {change && (
          <p className={`text-sm ${getChangeColor()}`}>{change}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
