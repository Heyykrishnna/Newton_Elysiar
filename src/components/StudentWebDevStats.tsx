import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Flame, Trophy, Target, TrendingUp, Search, Eye, Calendar, Code2 } from 'lucide-react';
import { useAllStudentsProgress } from '@/hooks/useWebDevProgress';
import { ContributionGraph } from './ContributionGraph';
import { motion } from 'framer-motion';

export function StudentWebDevStats() {
  const { data: studentsData, isLoading } = useAllStudentsProgress();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'streak' | 'total' | 'name'>('total');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  if (isLoading) {
    return (
      <Card className="border-2 border-white/10 bg-[#221f20] rounded-2xl">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#ac1ed6] border-t-transparent rounded-full mx-auto" />
          <p className="text-white/60 mt-4">Loading student progress...</p>
        </CardContent>
      </Card>
    );
  }

  const filteredStudents = (studentsData || [])
    .filter(s => 
      s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'streak': return b.current_streak - a.current_streak;
        case 'total': return b.total_problems_solved - a.total_problems_solved;
        case 'name': return (a.full_name || '').localeCompare(b.full_name || '');
        default: return 0;
      }
    });

  const totalStats = (studentsData || []).reduce((acc, s) => ({
    totalProblems: acc.totalProblems + s.total_problems_solved,
    avgStreak: acc.avgStreak + s.current_streak,
    activeStudents: acc.activeStudents + (s.total_problems_solved > 0 ? 1 : 0),
  }), { totalProblems: 0, avgStreak: 0, activeStudents: 0 });

  const avgStreak = studentsData?.length ? Math.round(totalStats.avgStreak / studentsData.length) : 0;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-2 border-white/10 bg-gradient-to-br from-[#ac1ed6]/10 to-[#221f20] rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ac1ed6]/20 rounded-lg flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-[#ac1ed6]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{totalStats.totalProblems}</p>
                  <p className="text-xs text-white/60">Total Problems Solved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-2 border-white/10 bg-gradient-to-br from-orange-500/10 to-[#221f20] rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{avgStreak}</p>
                  <p className="text-xs text-white/60">Avg. Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-2 border-white/10 bg-gradient-to-br from-green-500/10 to-[#221f20] rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{totalStats.activeStudents}</p>
                  <p className="text-xs text-white/60">Active Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-2 border-white/10 bg-gradient-to-br from-blue-500/10 to-[#221f20] rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{studentsData?.length || 0}</p>
                  <p className="text-xs text-white/60">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Student List */}
      <Card className="border-2 border-white/10 bg-[#221f20] rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#ac1ed6]" />
                Student Progress
              </CardTitle>
              <CardDescription className="text-white/60">
                Track your students' web development practice
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-[200px] bg-[#1a1a1a] border-white/10 text-white"
                />
              </div>
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="w-[150px] bg-[#1a1a1a] border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="total">Problems Solved</SelectItem>
                  <SelectItem value="streak">Current Streak</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
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
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ac1ed6] to-[#c26e73] flex items-center justify-center text-white font-bold text-sm">
                          {(student.full_name || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium">{student.full_name || student.email?.split('@')[0] || 'Student'}</p>
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
                        {student.longest_streak > student.current_streak && (
                          <span className="text-white/40 text-xs">(max: {student.longest_streak})</span>
                        )}
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
                        className="text-white/60 hover:text-white"
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

      {/* Student Detail Modal */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-3xl bg-[#0d0d0d] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ac1ed6] to-[#c26e73] flex items-center justify-center text-white font-bold">
                {(selectedStudent?.full_name || 'U')[0].toUpperCase()}
              </div>
              {selectedStudent?.full_name || selectedStudent?.email?.split('@')[0] || 'Student'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedStudent && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-[#221f20] rounded-xl border border-white/10">
                  <p className="text-2xl font-bold text-white">{selectedStudent.current_streak}</p>
                  <p className="text-xs text-white/60 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-500" /> Current Streak
                  </p>
                </div>
                <div className="p-3 bg-[#221f20] rounded-xl border border-white/10">
                  <p className="text-2xl font-bold text-white">{selectedStudent.longest_streak}</p>
                  <p className="text-xs text-white/60">Longest Streak</p>
                </div>
                <div className="p-3 bg-[#221f20] rounded-xl border border-white/10">
                  <p className="text-2xl font-bold text-white">{selectedStudent.total_problems_solved}</p>
                  <p className="text-xs text-white/60">Total Solved</p>
                </div>
                <div className="p-3 bg-[#221f20] rounded-xl border border-white/10">
                  <p className="text-2xl font-bold text-white">{selectedStudent.last_practice_date || 'N/A'}</p>
                  <p className="text-xs text-white/60">Last Active</p>
                </div>
              </div>

              {/* Difficulty Breakdown */}
              <div className="p-4 bg-[#221f20] rounded-xl border border-white/10">
                <h3 className="text-white font-medium mb-3">Difficulty Breakdown</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-400">{selectedStudent.easy_solved}</p>
                    <p className="text-sm text-white/60">Easy</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-yellow-400">{selectedStudent.medium_solved}</p>
                    <p className="text-sm text-white/60">Medium</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-red-400">{selectedStudent.hard_solved}</p>
                    <p className="text-sm text-white/60">Hard</p>
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
    </div>
  );
}
