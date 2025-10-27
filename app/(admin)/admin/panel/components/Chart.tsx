'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock data for charts
const revenueData = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Feb', revenue: 15000 },
  { month: 'Mar', revenue: 18000 },
  { month: 'Apr', revenue: 22000 },
  { month: 'May', revenue: 25000 },
  { month: 'Jun', revenue: 28000 },
];

const signupData = [
  { month: 'Jan', customers: 45, vendors: 8 },
  { month: 'Feb', customers: 52, vendors: 12 },
  { month: 'Mar', customers: 48, vendors: 15 },
  { month: 'Apr', customers: 65, vendors: 18 },
  { month: 'May', customers: 72, vendors: 22 },
  { month: 'Jun', customers: 68, vendors: 25 },
];

interface ChartProps {
  title: string;
  type: 'line' | 'bar';
  data: any[];
  dataKey: string;
  color?: string;
}

export function Chart({ title, type, data, dataKey, color = '#3B82F6' }: ChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={color} 
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }} 
              />
              <Bar dataKey="customers" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="vendors" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Pre-configured chart components
export function RevenueChart() {
  return (
    <Chart
      title="Revenue Trend"
      type="line"
      data={revenueData}
      dataKey="revenue"
      color="#8B5CF6"
    />
  );
}

export function SignupChart() {
  return (
    <Chart
      title="New Signups"
      type="bar"
      data={signupData}
      dataKey="signups"
    />
  );
}
