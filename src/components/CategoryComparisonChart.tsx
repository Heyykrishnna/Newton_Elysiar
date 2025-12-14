import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

interface CategoryComparisonChartProps {
  data: {
    category: string;
    count: number;
    avgScore: number;
    color: string;
  }[];
}

export function CategoryComparisonChart({ data }: CategoryComparisonChartProps) {
  if (data.length === 0) {
    return (
      <Card className="border-2 border-white/10 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Category Performance
          </CardTitle>
          <CardDescription>No data available yet</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-gray-500">Start solving questions to see category comparison</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map(item => ({
    category: item.category,
    score: item.avgScore,
    questions: item.count,
    fill: item.color,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{payload[0].payload.category}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              Average Score: <span className="font-bold text-purple-600">{payload[0].value.toFixed(1)}%</span>
            </p>
            <p className="text-sm text-gray-600">
              Questions Solved: <span className="font-bold">{payload[0].payload.questions}</span>
            </p>
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
      transition={{ delay: 0.8 }}
    >
      <Card className="border-2 border-white/10 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Category Performance Comparison
          </CardTitle>
          <CardDescription>
            Average scores across different categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="category" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
                label={{ value: 'Average Score (%)', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#6b7280' } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="score" 
                radius={[8, 8, 0, 0]}
                maxBarSize={80}
              />
            </BarChart>
          </ResponsiveContainer>

          {/* Performance insights */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map((item, index) => {
              const performance = item.avgScore >= 80 ? 'excellent' : item.avgScore >= 60 ? 'good' : 'needs-improvement';
              const performanceColor = performance === 'excellent' ? 'text-green-600' : performance === 'good' ? 'text-yellow-600' : 'text-orange-600';
              const performanceLabel = performance === 'excellent' ? '🌟 Excellent' : performance === 'good' ? '👍 Good' : '📈 Keep Practicing';
              
              return (
                <div key={index} className="p-4 rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-semibold text-gray-900">{item.category}</span>
                    </div>
                    <span className={`text-sm font-medium ${performanceColor}`}>
                      {performanceLabel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{item.count} questions</span>
                    <span className="font-bold text-purple-600">{item.avgScore.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
