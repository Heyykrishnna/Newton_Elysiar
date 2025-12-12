import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { BackToDashboard } from '@/components/BackToDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, Search, Download, TrendingUp, Target, Flame, Trophy, 
  Calendar, Filter, BarChart3, PieChart, Eye, FileText, Mail 
} from 'lucide-react';
import { useAllStudentsProgress } from '@/hooks/useWebDevProgress';
import { useAllAttendance } from '@/hooks/useAttendance';
import { ContributionGraph } from '@/components/ContributionGraph';
import { ContestLeaderboard } from '@/components/ContestLeaderboard';
import { useCodingContests } from '@/hooks/useCodingContests';
import { motion } from 'framer-motion';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart as RePieChart, Pie
} from 'recharts';

interface StudentData {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  current_streak: number;
  longest_streak: number;
  total_problems_solved: number;
  easy_solved: number;
  medium_solved: number;
  hard_solved: number;
  last_practice_date: string | null;
  activities: any[];
}

export default function EducatorDashboard() {
  const { data: studentsData, isLoading: isLoadingProgress } = useAllStudentsProgress();
  const { allAttendanceRecords, isLoading: isLoadingAttendance } = useAllAttendance();
  const { data: contests } = useCodingContests();
  const isLoading = isLoadingProgress || isLoadingAttendance;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'streak' | 'total' | 'lastActive'>('total');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [filterActivity, setFilterActivity] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [leaderboardContestId, setLeaderboardContestId] = useState<string>('all');

  // Filter and sort students
  const filteredStudents = (studentsData || [])
    .filter(s => {
      const matchesSearch = 
        s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesActivity = 
        filterActivity === 'all' ? true :
        filterActivity === 'active' ? s.total_problems_solved > 0 :
        s.total_problems_solved === 0;

      return matchesSearch && matchesActivity;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return (a.full_name || '').localeCompare(b.full_name || '');
        case 'streak': return b.current_streak - a.current_streak;
        case 'total': return b.total_problems_solved - a.total_problems_solved;
        case 'lastActive': {
          const dateA = a.last_practice_date ? new Date(a.last_practice_date).getTime() : 0;
          const dateB = b.last_practice_date ? new Date(b.last_practice_date).getTime() : 0;
          return dateB - dateA;
        }
        default: return 0;
      }
    });

  // Calculate aggregate statistics
  const stats = {
    totalStudents: studentsData?.length || 0,
    activeStudents: studentsData?.filter(s => s.total_problems_solved > 0).length || 0,
    totalProblems: studentsData?.reduce((sum, s) => sum + s.total_problems_solved, 0) || 0,
    avgStreak: studentsData?.length ? 
      Math.round(studentsData.reduce((sum, s) => sum + s.current_streak, 0) / studentsData.length) : 0,
    totalEasy: studentsData?.reduce((sum, s) => sum + s.easy_solved, 0) || 0,
    totalMedium: studentsData?.reduce((sum, s) => sum + s.medium_solved, 0) || 0,
    totalHard: studentsData?.reduce((sum, s) => sum + s.hard_solved, 0) || 0,
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Current Streak', 'Longest Streak', 'Total Solved', 'Easy', 'Medium', 'Hard', 'Last Active'];
    const rows = filteredStudents.map(s => [
      s.full_name || 'Unknown',
      s.email || '',
      s.current_streak,
      s.longest_streak,
      s.total_problems_solved,
      s.easy_solved,
      s.medium_solved,
      s.hard_solved,
      s.last_practice_date || 'Never'
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student-progress-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#090607] flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#ac1ed6] border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#090607]">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="mb-4">
            <BackToDashboard />
          </div>

          {/* Header */}
          <div className="text-center space-y-2 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#ac1ed6]/10 via-[#c26e73]/10 to-[#ac1ed6]/10 rounded-3xl blur-3xl -z-10" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#ac1ed6] via-[#c26e73] to-[#ac1ed6] bg-clip-text text-transparent pb-2">
              Educator Dashboard
            </h1>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              Comprehensive tracking and analytics for all student activities
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 h-14 p-1 bg-[#221f20] border border-white/10 rounded-xl">
              <TabsTrigger value="overview" className="text-white/60 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ac1ed6] data-[state=active]:to-[#c26e73] data-[state=active]:text-white rounded-lg">
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="students" className="text-white/60 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ac1ed6] data-[state=active]:to-[#c26e73] data-[state=active]:text-white rounded-lg">
                <Users className="w-4 h-4 mr-2" />
                Students
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-white/60 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ac1ed6] data-[state=active]:to-[#c26e73] data-[state=active]:text-white rounded-lg">
                <PieChart className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="text-white/60 font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ac1ed6] data-[state=active]:to-[#c26e73] data-[state=active]:text-white rounded-lg">
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <Card className="border-2 border-white/10 bg-gradient-to-br from-purple-700 to-purple-400 rounded-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-purple-900" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-white">{stats.totalStudents}</p>
                          <p className="text-sm text-white/60">Total Students</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Card className="border-2 border-white/10 bg-gradient-to-br from-green-700 to-green-400 rounded-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                          <Target className="w-6 h-6 text-green-900" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-white">{stats.activeStudents}</p>
                          <p className="text-sm text-white/60">Active Students</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Card className="border-2 border-white/10 bg-gradient-to-br from-blue-700 to-blue-400 rounded-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-blue-900" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-white">{stats.totalProblems}</p>
                          <p className="text-sm text-white/60">Total Problems</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <Card className="border-2 border-white/10 bg-gradient-to-br from-orange-700 to-orange-400 rounded-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                          <Flame className="w-6 h-6 text-orange-900" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-white">{stats.avgStreak}</p>
                          <p className="text-sm text-white/60">Avg. Streak</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Difficulty Distribution */}
              <Card className="border-2 border-white/10 bg-[#221f20] rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-[#ac1ed6]" />
                    Difficulty Distribution
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Problems solved by difficulty level
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl border border-green-500/20">
                      <p className="text-5xl font-bold text-green-500">{stats.totalEasy}</p>
                      <p className="text-sm text-white/60 mt-2">Easy</p>
                      <p className="text-xs text-white/40 mt-1">
                        {stats.totalProblems > 0 ? Math.round((stats.totalEasy / stats.totalProblems) * 100) : 0}%
                      </p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 rounded-xl border border-yellow-500/20">
                      <p className="text-5xl font-bold text-yellow-500">{stats.totalMedium}</p>
                      <p className="text-sm text-white/60 mt-2">Medium</p>
                      <p className="text-xs text-white/40 mt-1">
                        {stats.totalProblems > 0 ? Math.round((stats.totalMedium / stats.totalProblems) * 100) : 0}%
                      </p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl border border-red-500/20">
                      <p className="text-5xl font-bold text-red-500">{stats.totalHard}</p>
                      <p className="text-sm text-white/60 mt-2">Hard</p>
                      <p className="text-xs text-white/40 mt-1">
                        {stats.totalProblems > 0 ? Math.round((stats.totalHard / stats.totalProblems) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Students Tab */}
            <TabsContent value="students" className="space-y-6">
              <Card className="border-2 border-white/10 bg-[#221f20] rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-white text-xl flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#ac1ed6]" />
                        Student Progress Tracking
                      </CardTitle>
                      <CardDescription className="text-white/60">
                        Monitor and analyze individual student performance
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={exportToCSV}
                        variant="outline"
                        className="border-white/20 hover:text-white text-black hover:bg-white/10"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Filters */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                      <Input
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-[#1a1a1a] border-white/10 text-white"
                      />
                    </div>
                    <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                      <SelectTrigger className="w-[180px] bg-[#1a1a1a] border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="total">Problems Solved</SelectItem>
                        <SelectItem value="streak">Current Streak</SelectItem>
                        <SelectItem value="lastActive">Last Active</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterActivity} onValueChange={(v: any) => setFilterActivity(v)}>
                      <SelectTrigger className="w-[150px] bg-[#1a1a1a] border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Students</SelectItem>
                        <SelectItem value="active">Active Only</SelectItem>
                        <SelectItem value="inactive">Inactive Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Student Table */}
                  <ScrollArea className="h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10">
                          <TableHead className="text-white/60">Student</TableHead>
                          <TableHead className="text-white/60">Streak</TableHead>
                          <TableHead className="text-white/60">Total</TableHead>
                          <TableHead className="text-white/60">Easy</TableHead>
                          <TableHead className="text-white/60">Medium</TableHead>
                          <TableHead className="text-white/60">Hard</TableHead>
                          <TableHead className="text-white/60">Last Active</TableHead>
                          <TableHead className="text-white/60 text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.map((student, index) => (
                          <TableRow key={student.id} className="border-white/10 hover:bg-white/5">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ac1ed6] to-[#c26e73] flex items-center justify-center text-white font-bold">
                                  {(student.full_name || 'U')[0].toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-white font-medium">{student.full_name || 'Unknown'}</p>
                                  <p className="text-white/40 text-xs">{student.email}</p>
                                </div>
                                {index < 3 && student.total_problems_solved > 0 && (
                                  <Badge className={
                                    index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                    index === 1 ? 'bg-gray-400/20 text-gray-300' :
                                    'bg-orange-600/20 text-orange-400'
                                  }>
                                    #{index + 1}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Flame className={`w-4 h-4 ${student.current_streak > 0 ? 'text-orange-500' : 'text-white/20'}`} />
                                <span className="text-white font-medium">{student.current_streak}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-white font-bold">{student.total_problems_solved}</TableCell>
                            <TableCell>
                              <Badge className="bg-green-500/20 text-green-400">{student.easy_solved}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-yellow-500/20 text-yellow-400">{student.medium_solved}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-red-500/20 text-red-400">{student.hard_solved}</Badge>
                            </TableCell>
                            <TableCell className="text-white/60">
                              {student.last_practice_date || 'Never'}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedStudent(student)}
                                className="text-white/60 hover:text-black"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {filteredStudents.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center text-white/40 py-8">
                              No students found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activity Trends Chart */}
                <Card className="border-2 border-white/10 bg-[#221f20] rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#ac1ed6]" />
                      Activity Trends (Last 7 Days)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={Array.from({ length: 7 }).map((_, i) => {
                          const date = subDays(new Date(), 6 - i);
                          const dateStr = format(date, 'yyyy-MM-dd');
                          const count = studentsData?.reduce((acc, student) => {
                            const studentActivity = student.activities?.find((a: any) => 
                              isSameDay(new Date(a.activity_date), date)
                            );
                            return acc + (studentActivity?.problems_solved || 0);
                          }, 0) || 0;
                          return { date: format(date, 'MMM dd'), count };
                        })}
                      >
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ac1ed6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#ac1ed6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis dataKey="date" stroke="#ffffffff" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#ffffffff" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="count" stroke="#ac1ed6" fillOpacity={1} fill="url(#colorCount)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Streak Distribution Chart */}
                <Card className="border-2 border-white/10 bg-[#221f20] rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-500" />
                      Streak Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: '0 days', count: studentsData?.filter(s => s.current_streak === 0).length || 0 },
                          { name: '1-3 days', count: studentsData?.filter(s => s.current_streak >= 1 && s.current_streak <= 3).length || 0 },
                          { name: '4-7 days', count: studentsData?.filter(s => s.current_streak >= 4 && s.current_streak <= 7).length || 0 },
                          { name: '7+ days', count: studentsData?.filter(s => s.current_streak > 7).length || 0 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff' }}
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Difficulty Distribution Chart */}
                 <Card className="border-2 border-white/10 bg-[#221f20] rounded-2xl lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-green-500" />
                      Problem Difficulty
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={[
                            { name: 'Easy', value: stats.totalEasy, color: '#22c55e' },
                            { name: 'Medium', value: stats.totalMedium, color: '#eab308' },
                            { name: 'Hard', value: stats.totalHard, color: '#ef4444' },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {[
                            { name: 'Easy', value: stats.totalEasy, color: '#22c55e' },
                            { name: 'Medium', value: stats.totalMedium, color: '#eab308' },
                            { name: 'Hard', value: stats.totalHard, color: '#ef4444' },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                          itemStyle={{ color: '#fff' }}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-xs text-white/60">Easy</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span className="text-xs text-white/60">Medium</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-xs text-white/60">Hard</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-white/10 bg-[#221f20] rounded-2xl lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#ac1ed6]" />
                      Class Performance Analytics
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      Aggregated activity and performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                  <div className="space-y-6">
                    {/* Top Performers */}
                    <div>
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        Top 5 Performers
                      </h3>
                      <div className="space-y-2">
                        {filteredStudents.slice(0, 5).map((student, index) => (
                          <div key={student.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                index === 0 ? 'bg-yellow-500 text-black' :
                                index === 1 ? 'bg-gray-400 text-black' :
                                index === 2 ? 'bg-orange-600 text-white' :
                                'bg-white/10 text-white'
                              }`}>
                                {index + 1}
                              </div>
                              <span className="text-white font-medium">{student.full_name || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge className="bg-[#ac1ed6]/20 text-[#ac1ed6]">
                                {student.total_problems_solved} problems
                              </Badge>
                              <div className="flex items-center gap-1 text-orange-500">
                                <Flame className="w-4 h-4" />
                                <span className="font-medium">{student.current_streak}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Activity Insights */}
                    <div>
                      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        Activity Insights
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-white/5 rounded-lg">
                          <p className="text-white/60 text-sm">Students with Active Streaks</p>
                          <p className="text-3xl font-bold text-white mt-2">
                            {studentsData?.filter(s => s.current_streak > 0).length || 0}
                          </p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                          <p className="text-white/60 text-sm">Longest Current Streak</p>
                          <p className="text-3xl font-bold text-orange-500 mt-2">
                            {Math.max(...(studentsData?.map(s => s.current_streak) || [0]))}
                          </p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                          <p className="text-white/60 text-sm">Avg. Problems per Student</p>
                          <p className="text-3xl font-bold text-green-500 mt-2">
                            {stats.totalStudents > 0 ? Math.round(stats.totalProblems / stats.totalStudents) : 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Leaderboard Tab */}
            <TabsContent value="leaderboard" className="space-y-6">
              <Card className="border-2 border-white/10 bg-[#221f20] rounded-2xl">
                <CardHeader>
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-white text-xl flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        Global Leaderboard
                      </CardTitle>
                      <CardDescription className="text-white/60">
                        View student rankings across all contests or filter by specific events
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <Select 
                        value={leaderboardContestId} 
                        onValueChange={setLeaderboardContestId}
                      >
                        <SelectTrigger className="w-[200px] bg-[#1a1a1a] border-white/10 text-white">
                          <SelectValue placeholder="Select Contest" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                          <SelectItem value="all">All Contests</SelectItem>
                          {contests?.map(contest => (
                            <SelectItem key={contest.id} value={contest.id}>
                              {contest.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ContestLeaderboard 
                     contestId={leaderboardContestId === 'all' ? undefined : leaderboardContestId}
                     contestTitle={leaderboardContestId === 'all' ? 'All Contests' : contests?.find(c => c.id === leaderboardContestId)?.title}
                     onUserClick={(userId) => {
                       const student = studentsData?.find(s => s.user_id === userId || s.id === userId);
                       if (student) {
                         setSelectedStudent((student as unknown) as StudentData);
                       }
                     }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Student Detail Modal */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-4xl bg-[#0d0d0d] border-white/10 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ac1ed6] to-[#c26e73] flex items-center justify-center text-white font-bold text-xl">
                {(selectedStudent?.full_name || 'U')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-xl">{selectedStudent?.full_name || 'Unknown Student'}</p>
                <p className="text-sm text-white/60 font-normal">{selectedStudent?.email}</p>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-6 mt-4">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 bg-[#221f20] rounded-xl border border-white/10">
                  <p className="text-3xl font-bold text-white">{selectedStudent.current_streak}</p>
                  <p className="text-xs text-white/60 flex items-center gap-1 mt-1">
                    <Flame className="w-3 h-3 text-orange-500" /> Current Streak
                  </p>
                </div>
                <div className="p-4 bg-[#221f20] rounded-xl border border-white/10">
                  <p className="text-3xl font-bold text-white">{selectedStudent.longest_streak}</p>
                  <p className="text-xs text-white/60 mt-1">Longest Streak</p>
                </div>
                <div className="p-4 bg-[#221f20] rounded-xl border border-white/10">
                  <p className="text-3xl font-bold text-white">{selectedStudent.total_problems_solved}</p>
                  <p className="text-xs text-white/60 mt-1">Total Solved</p>
                </div>
                <div className="p-4 bg-[#221f20] rounded-xl border border-white/10">
                  <p className="text-xl font-bold text-white">{selectedStudent.last_practice_date || 'N/A'}</p>
                  <p className="text-xs text-white/60 mt-1">Last Active</p>
                </div>
              </div>

              {/* Difficulty Breakdown */}
              <div className="p-4 bg-[#221f20] rounded-xl border border-white/10">
                <h3 className="text-white font-medium mb-3">Difficulty Breakdown</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-green-400">{selectedStudent.easy_solved}</p>
                    <p className="text-sm text-white/60 mt-1">Easy</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-yellow-400">{selectedStudent.medium_solved}</p>
                    <p className="text-sm text-white/60 mt-1">Medium</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-red-400">{selectedStudent.hard_solved}</p>
                    <p className="text-sm text-white/60 mt-1">Hard</p>
                  </div>
                </div>
              </div>

              {/* Contribution Graph */}
              {selectedStudent.activities && selectedStudent.activities.length > 0 && (
                <ContributionGraph 
                  activities={selectedStudent.activities} 
                  title={`${selectedStudent.full_name}'s Activity`}
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
