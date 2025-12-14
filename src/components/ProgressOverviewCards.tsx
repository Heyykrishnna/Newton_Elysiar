import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, Award, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProgressOverviewCardsProps {
  totalSolved: number;
  averageScore: number;
  strongestCategory: string;
  weakestCategory: string;
  difficultyBreakdown: {
    difficulty: 'Easy' | 'Medium' | 'Hard';
    count: number;
  }[];
}

export function ProgressOverviewCards({
  totalSolved,
  averageScore,
  strongestCategory,
  weakestCategory,
  difficultyBreakdown,
}: ProgressOverviewCardsProps) {
  const easyCount = difficultyBreakdown.find(d => d.difficulty === 'Easy')?.count || 0;
  const mediumCount = difficultyBreakdown.find(d => d.difficulty === 'Medium')?.count || 0;
  const hardCount = difficultyBreakdown.find(d => d.difficulty === 'Hard')?.count || 0;

  const cards = [
    {
      title: 'Total Solved',
      value: totalSolved,
      icon: CheckCircle2,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-500/10 to-emerald-600/10',
      iconBg: 'bg-green-500',
      delay: 0.1,
    },
    {
      title: 'Average Score',
      value: `${averageScore.toFixed(1)}%`,
      icon: TrendingUp,
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-500/10 to-cyan-600/10',
      iconBg: 'bg-blue-500',
      delay: 0.2,
    },
    {
      title: 'Strongest Area',
      value: strongestCategory || 'N/A',
      icon: Award,
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-500/10 to-pink-600/10',
      iconBg: 'bg-gradient-to-r from-purple-500 to-pink-600',
      delay: 0.3,
    },
    {
      title: 'Focus Area',
      value: weakestCategory || 'N/A',
      icon: Target,
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-500/10 to-red-600/10',
      iconBg: 'bg-orange-500',
      delay: 0.4,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: card.delay }}
          >
            <Card className={`border-2 border-white/10 bg-gradient-to-br ${card.bgGradient} backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 ${card.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                    <card.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-black font-medium mb-1">{card.title}</p>
                    <p className={`text-3xl font-bold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                      {card.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Difficulty Breakdown Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-2 border-white/10 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target className="w-5 h-5 text-purple-600" />
              Difficulty Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl border border-green-500/20">
                <div className="text-3xl font-bold text-green-600">{easyCount}</div>
                <div className="text-sm text-gray-600 mt-1">Easy</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-xl border border-yellow-500/20">
                <div className="text-3xl font-bold text-yellow-600">{mediumCount}</div>
                <div className="text-sm text-gray-600 mt-1">Medium</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl border border-red-500/20">
                <div className="text-3xl font-bold text-red-600">{hardCount}</div>
                <div className="text-sm text-gray-600 mt-1">Hard</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
