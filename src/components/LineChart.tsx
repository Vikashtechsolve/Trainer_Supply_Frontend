
import React from 'react';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

type DataPoint = {
  name: string;
  value: number;
};

type LineChartProps = {
  data: DataPoint[];
  title: string;
  timeRange: string;
};

const LineChart: React.FC<LineChartProps> = ({ data, title, timeRange }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <div className="relative">
          <select 
            className="appearance-none bg-gray-100 border border-gray-200 rounded-md px-3 py-1.5 pr-8 text-sm focus:outline-none"
            defaultValue={timeRange}
          >
            <option value="Last 6 months">Last 6 months</option>
            <option value="Last 12 months">Last 12 months</option>
            <option value="Last 30 days">Last 30 days</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#1a56db" 
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChart;
