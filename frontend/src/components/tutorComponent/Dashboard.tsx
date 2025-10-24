// src/components/Dashboard.tsx

import React from 'react';
import {
  Users,
  BookOpen,
  Wallet,
  ChevronDown,
  Dot,
} from 'lucide-react';
import {
  ResponsiveContainer,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ComposedChart,
} from 'recharts';

// --- Type Definitions ---

// 1. For the StatCard props
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  bgColor: string;
}

// 2. For the chart data
interface ChartData {
  month: string;
  Sales: number;
  Visits: number;
}

// 3. For the custom tooltip props
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[]; // Recharts payload can be complex
  label?: string;
}

// --- Mock Data ---

const chartData: ChartData[] = [
  { month: 'Jan', Sales: 4000, Visits: 2400 },
  { month: 'Feb', Sales: 3000, Visits: 1398 },
  { month: 'Mar', Sales: 5000, Visits: 9800 },
  { month: 'Apr', Sales: 2780, Visits: 3908 },
  { month: 'May', Sales: 1890, Visits: 4800 },
  { month: 'Jun', Sales: 2390, Visits: 3800 },
  { month: 'Jul', Sales: 3490, Visits: 4300 },
  { month: 'Aug', Sales: 4200, Visits: 5100 },
  { month: 'Sep', Sales: 3100, Visits: 4000 },
  { month: 'Oct', Sales: 2500, Visits: 3500 },
  { month: 'Nov', Sales: 3800, Visits: 4100 },
];

// --- Components ---

// Reusable Stat Card component
// FIX 1: Added StatCardProps type to props
function StatCard({ icon, title, value, bgColor }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
      <div className={`p-3 rounded-full ${bgColor}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

// Custom Tooltip for the chart
// FIX 2: Added CustomTooltipProps type to props
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white p-3 rounded-md shadow-lg">
        {/* Accessing payload data safely */}
        <p className="text-sm font-bold">{`${payload[1]?.value || 0} Course Visit`}</p>
        <p className="text-sm font-bold">{`${payload[0]?.value || 0} Course Sale`}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  return (
    <main className="flex-1 p-8 bg-green-50/50 overflow-y-auto">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <StatCard
          title="Students"
          value="1,674,767"
          icon={<Users className="h-6 w-6 text-blue-600" />}
          bgColor="bg-blue-100"
        />
        <StatCard
          title="Total Courses"
          value="957"
          icon={<BookOpen className="h-6 w-6 text-green-600" />}
          bgColor="bg-green-100"
        />
        <StatCard
          title="Total Revenue"
          value="$7,461,767"
          icon={<Wallet className="h-6 w-6 text-yellow-600" />}
          bgColor="bg-yellow-100"
        />
      </div>

      {/* Course Overview Chart */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
        {/* Chart Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Course Overview</h2>
          <div className="flex items-center space-x-6">
            <div className="flex items-center text-sm text-gray-600">
              <Dot className="text-cyan-400" size={32} />
              Course Visit
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Dot className="text-indigo-900" size={32} />
              Course Sale
            </div>
            <button className="flex items-center text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-md hover:bg-gray-200">
              Last 12 Month
              <ChevronDown className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Chart */}
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <ComposedChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Sales" fill="#283593" barSize={20} radius={[10, 10, 0, 0]} />
              <Line
                type="monotone"
                dataKey="Visits"
                stroke="#22d3ee"
                strokeWidth={3}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
}