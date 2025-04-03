import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Calendar,
  CreditCard,
  BarChart2,
  Settings,
} from "lucide-react";

type NavItemProps = {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
};

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  label,
  href,
  active,
}) => {
  return (
    <Link
      to={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
        active ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  // For demo purposes, assuming we're on the dashboard page
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="w-60 border-r border-gray-200 h-screen py-4 px-2 flex flex-col">
      <div className="space-y-2 flex-1">
        <NavItem
          icon={LayoutDashboard}
          label="Dashboard"
          href="/"
          active={currentPath === "/"}
        />
        <NavItem
          icon={UserCircle}
          label="Trainers"
          href="/trainers"
          active={currentPath === "/trainers"}
        />
        <NavItem
          icon={Users}
          label="Clients"
          href="/clients"
          active={currentPath === "/clients"}
        />
        <NavItem
          icon={Calendar}
          label="Schedule"
          href="/schedule"
          active={currentPath === "/schedule"}
        />
        <NavItem
          icon={CreditCard}
          label="Payments"
          href="/payments"
          active={currentPath === "/payments"}
        />
        <NavItem
          icon={BarChart2}
          label="Reports"
          href="/reports"
          active={currentPath === "/reports"}
        />
        <NavItem
          icon={Settings}
          label="Settings"
          href="/settings"
          active={currentPath === "/settings"}
        />
      </div>
    </div>
  );
};

export default Sidebar;
