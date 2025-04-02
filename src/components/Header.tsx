
import React from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
      <div className="w-full max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell size={20} />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        <button className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
            <img 
              src="/lovable-uploads/212c0f09-21eb-4cc6-8a63-6c399100f4f5.png" 
              alt="Profile" 
              className="h-full w-full object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.src = "https://via.placeholder.com/32";
              }}
            />
          </div>
          <ChevronDown size={16} />
        </button>
      </div>
    </header>
  );
};

export default Header;
