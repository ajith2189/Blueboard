import { TrendingUp, DollarSign, Users, GraduationCap, BookOpen } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

const AdminDashboard = () => {
  const data = [
    { month: "Jan", income: 65, profit: 45 },
    { month: "Feb", income: 59, profit: 52 },
    { month: "Mar", income: 80, profit: 48 },
    { month: "Apr", income: 81, profit: 35 },
    { month: "May", income: 95, profit: 65 },
    { month: "Jun", income: 88, profit: 58 },
  ];

  const stats = [
    {
      title: "Total Revenue",
      value: "$24,780",
      change: "+12.5%",
      icon: DollarSign,
      color: "from-emerald-400 to-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      title: "Total Students",
      value: "1,247",
      change: "+8.2%",
      icon: Users,
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Active Tutors",
      value: "856",
      change: "+3.1%",
      icon: GraduationCap,
      color: "from-purple-400 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Live Courses",
      value: "47",
      change: "+15.3%",
      icon: BookOpen,
      color: "from-orange-400 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
        Dashboard Overview
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Welcome back, Edwin! Here's what's happening today.
      </p>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="p-6 rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-emerald-600 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 mr-1" /> {stat.change}
              </p>
              <div className={`mt-2 inline-flex p-2 rounded-xl ${stat.bgColor}`}>
                <Icon className={`w-5 h-5 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="rounded-3xl bg-white/80 dark:bg-gray-800/80 p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="font-bold mb-4">Revenue Analytics</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="income" stroke="#3B82F6" strokeWidth={3} fill="url(#income)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
