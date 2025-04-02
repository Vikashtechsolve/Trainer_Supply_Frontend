
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-md bg-primary text-white flex items-center justify-center font-bold text-sm">
        TH
      </div>
      <span className="font-bold text-xl">TrainerHub</span>
    </div>
  );
};

export default Logo;
