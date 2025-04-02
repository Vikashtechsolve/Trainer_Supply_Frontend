
import React from 'react';
import { Plus, Calendar, FileText, BarChart2 } from 'lucide-react';
import StatCard from '../components/StatCard';
import LineChart from '../components/LineChart';
import BarChart from '../components/BarChart';
import SessionsTable from '../components/SessionsTable';
import ActionCard from '../components/ActionCard';

const Dashboard: React.FC = () => {
  // Mock data for the charts
  const bookingsData = [
    { name: 'Jan', value: 65 },
    { name: 'Feb', value: 59 },
    { name: 'Mar', value: 80 },
    { name: 'Apr', value: 81 },
    { name: 'May', value: 56 },
    { name: 'Jun', value: 55 },
  ];

  const revenueData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2800 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
  ];

  // Mock data for the sessions table
  const sessions = [
    {
      id: '1',
      trainer: 'John Smith',
      client: 'Tech Corp',
      sessionType: 'DevOps Training',
      dateTime: '2024-02-20 10:00 AM',
      status: 'In Progress' as const,
    },
    {
      id: '2',
      trainer: 'Sarah Johnson',
      client: 'Data Systems Inc',
      sessionType: 'Data Science',
      dateTime: '2024-02-20 02:00 PM',
      status: 'Scheduled' as const,
    },
    {
      id: '3',
      trainer: 'Mike Wilson',
      client: 'Cloud Solutions',
      sessionType: 'AWS Training',
      dateTime: '2024-02-21 09:00 AM',
      status: 'Confirmed' as const,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Trainers" 
          value="24" 
          change="+12%" 
          changeType="positive" 
        />
        <StatCard 
          title="Upcoming Sessions" 
          value="156" 
          change="+8%" 
          changeType="positive" 
        />
        <StatCard 
          title="Monthly Revenue" 
          value="$45,678" 
          change="+23%" 
          changeType="positive" 
        />
        <StatCard 
          title="Pending Requests" 
          value="13" 
          change="-2%" 
          changeType="negative" 
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart 
          data={bookingsData} 
          title="Trainer Bookings" 
          timeRange="Last 6 months" 
        />
        <BarChart 
          data={revenueData} 
          title="Revenue Overview" 
          timeRange="Last 6 months" 
        />
      </div>

      {/* Sessions table */}
      <SessionsTable 
        sessions={sessions} 
        title="Active Sessions" 
      />

      {/* Action cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ActionCard 
          icon={<Plus size={24} />} 
          title="Add New Trainer" 
          description="Create trainer profile" 
        />
        <ActionCard 
          icon={<Calendar size={24} />}
          title="Schedule Session" 
          description="Book new training" 
        />
        <ActionCard 
          icon={<FileText size={24} />}
          title="Generate Invoice" 
          description="Create new invoice" 
        />
        <ActionCard 
          icon={<BarChart2 size={24} />}
          title="View Reports" 
          description="Analytics dashboard" 
        />
      </div>
    </div>
  );
};

export default Dashboard;
