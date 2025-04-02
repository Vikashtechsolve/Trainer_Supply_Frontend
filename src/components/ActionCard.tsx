
import React from 'react';

type ActionCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const ActionCard: React.FC<ActionCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center h-full cursor-pointer">
      <div className="mb-4 text-primary flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
        {icon}
      </div>
      <h3 className="font-medium text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default ActionCard;
