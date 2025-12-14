import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface ProgressTimelineProps {
  data: {
    date: string;
    count: number;
    cumulative: number;
    easy: number;
    medium: number;
    hard: number;
  }[];
}

export function ProgressTimeline({ data }: ProgressTimelineProps) {
  if (data.length === 0) {
    return (
      <Card className="border-2 border-white/10 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Progress Over Time
          </CardTitle>
          <CardDescription>No data available yet</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-gray-500">Start solving questions to see your progress timeline</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    cumulative: item.cumulative,
    easy: item.easy,
    medium: item.medium,
    hard: item.hard,
    total: item.count,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-purple-600">
              Total Solved: <span className="font-bold">{payload[0].value}</span>
            </p>
            {payload[1] && (
              <>
                <p className="text-sm text-green-600">
                  Easy: <span className="font-bold">{payload[1].payload.easy}</span>
                </p>
                <p className="text-sm text-yellow-600">
                  Medium: <span className="font-bold">{payload[1].payload.medium}</span>
                </p>
                <p className="text-sm text-red-600">
                  Hard: <span className="font-bold">{payload[1].payload.hard}</span>
                </p>
              </>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <Card className="border-2 border-white/10 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Progress Over Time
          </CardTitle>
          <CardDescription>
            Your cumulative progress week by week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '14px' }}
                formatter={(value) => <span className="font-medium">{value}</span>}
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="#a855f7"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCumulative)"
                name="Total Solved"
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Weekly breakdown chart */}
          <div className="mt-8">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">Weekly Activity Breakdown</h4>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '14px' }}
                  formatter={(value) => <span className="font-medium">{value}</span>}
                />
                <Area
                  type="monotone"
                  dataKey="easy"
                  stackId="1"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.6}
                  name="Easy"
                />
                <Area
                  type="monotone"
                  dataKey="medium"
                  stackId="1"
                  stroke="#eab308"
                  fill="#eab308"
                  fillOpacity={0.6}
                  name="Medium"
                />
                <Area
                  type="monotone"
                  dataKey="hard"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                  name="Hard"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
