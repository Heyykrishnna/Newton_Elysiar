import { useState, useRef } from 'react';
import { Layout } from '@/components/Layout';
import { BackToDashboard } from '@/components/BackToDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCodingContests, useCreateContest } from '@/hooks/useCodingContests';
import { ContestLeaderboard } from '@/components/ContestLeaderboard';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Trophy, Users, Clock, Trash2, Eye, Edit, Calendar, Target, Medal, CheckCircle, Bold, Italic, List, ListOrdered } from 'lucide-react';
import { format, isPast, isFuture } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface TestCase {
  input?: string;
  expectedOutput?: string;
  // Web Dev fields
  id?: string;
  name?: string;
  description?: string;
  type?: 'dom' | 'style' | 'function' | 'output';
  selector?: string;
  property?: string;
  expectedValue?: any;
  testFunction?: string;
}

interface Problem {
  title: string;
  description: string;
  example: string;
  constraints: string;
  difficulty: string;
  starterCode: string;
  testInput: string;
  testCases: TestCase[];
  answer: string;
  points: number;
  // Web Dev specific fields
  type?: 'coding' | 'web-dev';
  starterHtml?: string;
  starterCss?: string;
  starterJs?: string;
  media?: { type: 'image' | 'video'; url: string; caption?: string }[];
  webDevTestCases?: {
    type: 'dom' | 'style' | 'function' | 'output';
    description: string;
    selector?: string; // For DOM/Style
    property?: string; // For Style
    expectedValue?: string; // For DOM/Style
    codeToInclude?: string; // For inclusion checks
  }[];
}

const RichTextarea = ({ value, onChange, placeholder, rows = 4 }: { value: string; onChange: (val: string) => void; placeholder?: string; rows?: number }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormat = (start: string, end: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const scrollTop = textarea.scrollTop;
    const text = textarea.value;
    const selectedText = text.substring(startPos, endPos);

    const newText = text.substring(0, startPos) + start + selectedText + end + text.substring(endPos);
    
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(startPos + start.length, endPos + start.length);
      textarea.scrollTop = scrollTop;
    }, 0);
  };

  return (
    <div className="space-y-0">
      <div className="flex items-center gap-1 p-1 border border-b-0 rounded-t-md bg-muted/50">
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-background" onClick={() => insertFormat('**', '**')} title="Bold">
          <Bold className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-background" onClick={() => insertFormat('*', '*')} title="Italic">
          <Italic className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-background" onClick={() => insertFormat('- ')} title="Bullet List">
          <List className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-background" onClick={() => insertFormat('1. ')} title="Numbered List">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-background" onClick={() => insertFormat('<sup>', '</sup>')} title="Superscript (e.g., 10^6)">
          <span className="text-xs font-bold">x<sup>n</sup></span>
        </Button>
        <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-background" onClick={() => insertFormat('<sub>', '</sub>')} title="Subscript">
          <span className="text-xs font-bold">x<sub>n</sub></span>
        </Button>
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="rounded-t-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};

export default function ContestManagement() {
  const { profile } = useAuth();
  const { data: contests, isLoading } = useCodingContests();
  const createContest = useCreateContest();
  const queryClient = useQueryClient();

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedContest, setSelectedContest] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    difficulty: 'medium',
    type: 'coding' as 'coding' | 'web-dev',
  });
  const defaultStarterCode = `# Write your Python solution here
def solution(input_data):
    # Parse input
    # Your code here
    return result

# Read input and call solution
if __name__ == "__main__":
    import sys
    input_data = sys.stdin.read().strip()
    result = solution(input_data)
    print(result)
`;

  const [problems, setProblems] = useState<Problem[]>([
    { 
      title: '', 
      description: '', 
      example: '', 
      constraints: '',
      difficulty: 'medium',
      starterCode: defaultStarterCode,
      testInput: '',
      testCases: [{ input: '', expectedOutput: '' }],
      answer: '', 
      points: 100 
    }
  ]);

  if (profile?.role !== 'owner') {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card>
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>Only educators can access this page</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    );
  }

  const handleCreateContest = async () => {
    if (!formData.title || !formData.start_time || !formData.end_time) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (problems.some(p => !p.title || !p.description || !p.answer)) {
      toast.error('Please complete all problem fields');
      return;
    }

    try {
      await createContest.mutateAsync({
        title: formData.title,
        description: formData.description,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
        difficulty: formData.difficulty,
        type: formData.type,
        problems: problems.map(p => {
          if (formData.type === 'web-dev') {
            return {
              ...p,
              testCases: p.webDevTestCases?.map((tc, i) => ({
                id: `test-${i}`,
                name: tc.description,
                description: tc.description,
                type: tc.type,
                testFunction: tc.codeToInclude 
                  ? `(function() { 
                      const html = window.__USER_CODE__?.html || '';
                      const css = window.__USER_CODE__?.css || '';
                      const js = window.__USER_CODE__?.js || '';
                      const allCode = html + css + js;
                      return allCode.includes('${tc.codeToInclude}');
                    })()` 
                  : undefined
              })) || []
            };
          }
          return { ...p, type: formData.type };
        }),
        is_active: true,
      });
      setShowCreateDialog(false);
      setFormData({ title: '', description: '', start_time: '', end_time: '', difficulty: 'medium', type: 'coding' });
      setProblems([{ 
        title: '', 
        description: '', 
        example: '', 
        constraints: '',
        difficulty: 'medium',
        starterCode: defaultStarterCode,
        testInput: '',
        testCases: [{ input: '', expectedOutput: '' }],
        answer: '', 
        points: 100 
      }]);
    } catch (error) {
      console.error('Error creating contest:', error);
    }
  };

  const handleDeleteContest = async (contestId: string) => {
    if (!confirm('Are you sure you want to delete this contest?')) return;

    const { error } = await supabase
      .from('coding_contests')
      .delete()
      .eq('id', contestId);

    if (error) {
      toast.error('Failed to delete contest');
    } else {
      toast.success('Contest deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['coding-contests'] });
    }
  };

  const handleToggleActive = async (contestId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('coding_contests')
      .update({ is_active: !currentStatus })
      .eq('id', contestId);

    if (error) {
      toast.error('Failed to update contest status');
    } else {
      toast.success(`Contest ${!currentStatus ? 'activated' : 'deactivated'}`);
      queryClient.invalidateQueries({ queryKey: ['coding-contests'] });
    }
  };

  const addProblem = () => {
    setProblems([...problems, { 
      title: '', 
      description: '', 
      example: '', 
      constraints: '',
      difficulty: 'medium',
      starterCode: defaultStarterCode,
      testInput: '',
      testCases: [{ input: '', expectedOutput: '' }],
      answer: '', 
      points: 100 
    }]);
  };

  const addTestCase = (problemIndex: number) => {
    const updated = [...problems];
    updated[problemIndex].testCases.push({ input: '', expectedOutput: '' });
    setProblems(updated);
  };

  const removeTestCase = (problemIndex: number, testCaseIndex: number) => {
    const updated = [...problems];
    if (updated[problemIndex].testCases.length > 1) {
      updated[problemIndex].testCases.splice(testCaseIndex, 1);
      setProblems(updated);
    }
  };

  const updateTestCase = (problemIndex: number, testCaseIndex: number, field: keyof TestCase, value: string) => {
    const updated = [...problems];
    updated[problemIndex].testCases[testCaseIndex][field] = value;
    setProblems(updated);
  };

  const removeProblem = (index: number) => {
    if (problems.length > 1) {
      setProblems(problems.filter((_, i) => i !== index));
    }
  };

  const updateProblem = (index: number, field: keyof Problem, value: string | number) => {
    const updated = [...problems];
    updated[index] = { ...updated[index], [field]: value };
    setProblems(updated);
  };

  const getContestStatus = (contest: any) => {
    const now = new Date();
    const start = new Date(contest.start_time);
    const end = new Date(contest.end_time);
    if (isFuture(start)) return 'upcoming';
    if (isPast(end)) return 'ended';
    return 'live';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Contest Management
              </h1>
              <p className="text-muted-foreground mt-2">Create and manage coding contests for your students</p>
            </div>
            <div className="flex items-center gap-4">
              <BackToDashboard />
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-purple-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Contest
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Contest</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Contest Title *</Label>
                        <Input
                          placeholder="e.g., Weekly Coding Challenge"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Difficulty</Label>
                        <Select value={formData.difficulty} onValueChange={(v) => setFormData({ ...formData, difficulty: v })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Contest Type</Label>
                      <Select 
                        value={formData.type} 
                        onValueChange={(v: 'coding' | 'web-dev') => {
                          setFormData({ ...formData, type: v });
                          // Reset problems with appropriate starter code
                          setProblems([{ 
                            title: '', 
                            description: '', 
                            example: '', 
                            constraints: '',
                            difficulty: 'medium',
                            starterCode: v === 'coding' ? defaultStarterCode : '',
                            starterHtml: v === 'web-dev' ? '<div id="app">\n  <!-- Your HTML here -->\n</div>' : '',
                            starterCss: v === 'web-dev' ? '/* Your CSS here */\nbody {\n  font-family: sans-serif;\n}' : '',
                            starterJs: v === 'web-dev' ? '// Your JavaScript here' : '',
                            testInput: '',
                            testCases: [{ input: '', expectedOutput: '' }],
                            webDevTestCases: [],
                            media: [],
                            answer: '', 
                            points: 100,
                            type: v
                          }]);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="coding">Standard Coding</SelectItem>
                          <SelectItem value="web-dev">Web Development</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        placeholder="Describe the contest..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Time *</Label>
                        <Input
                          type="datetime-local"
                          value={formData.start_time}
                          onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Time *</Label>
                        <Input
                          type="datetime-local"
                          value={formData.end_time}
                          onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg font-semibold">Problems</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addProblem}>
                          <Plus className="w-4 h-4 mr-1" />
                          Add Problem
                        </Button>
                      </div>

                        {problems.map((problem, index) => (
                        <Card key={index} className="border border-border">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">Problem {index + 1}</CardTitle>
                              {problems.length > 1 && (
                                <Button variant="ghost" size="sm" onClick={() => removeProblem(index)}>
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label>Title *</Label>
                                <Input
                                  placeholder="Problem title"
                                  value={problem.title}
                                  onChange={(e) => updateProblem(index, 'title', e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Points</Label>
                                <Input
                                  type="number"
                                  value={problem.points}
                                  onChange={(e) => updateProblem(index, 'points', parseInt(e.target.value) || 100)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Difficulty</Label>
                                <Select 
                                  value={problem.difficulty} 
                                  onValueChange={(v) => updateProblem(index, 'difficulty', v)}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="easy">Easy</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="hard">Hard</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Description *</Label>
                              <RichTextarea
                                placeholder="Describe the problem in detail... (Supports Markdown)"
                                rows={4}
                                value={problem.description}
                                onChange={(val) => updateProblem(index, 'description', val)}
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Example</Label>
                                <Textarea
                                  placeholder="Input: [1,2,3]&#10;Output: 6"
                                  rows={3}
                                  value={problem.example}
                                  onChange={(e) => updateProblem(index, 'example', e.target.value)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Constraints</Label>
                                <RichTextarea
                                  placeholder="1 <= n <= 10^5&#10;Time limit: 1 second"
                                  rows={3}
                                  value={problem.constraints}
                                  onChange={(val) => updateProblem(index, 'constraints', val)}
                                />
                              </div>
                            </div>
                            {formData.type === 'coding' && (
                              <>
                                <div className="space-y-2">
                                  <Label>Starter Code (Python)</Label>
                                  <Textarea
                                    placeholder="Python starter code..."
                                    rows={6}
                                    className="font-mono text-sm"
                                    value={problem.starterCode}
                                    onChange={(e) => updateProblem(index, 'starterCode', e.target.value)}
                                  />
                                </div>
                                
                                {/* Test Cases */}
                                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <Label className="font-semibold">Test Cases</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={() => addTestCase(index)}>
                                      <Plus className="w-3 h-3 mr-1" />
                                      Add Test Case
                                    </Button>
                                  </div>
                                  {problem.testCases.map((testCase, tcIndex) => (
                                    <div key={tcIndex} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-background rounded border">
                                      <div className="space-y-1">
                                        <Label className="text-xs">Input (stdin)</Label>
                                        <Textarea
                                          placeholder="1 2 3"
                                          rows={2}
                                          className="font-mono text-sm"
                                          value={testCase.input}
                                          onChange={(e) => updateTestCase(index, tcIndex, 'input', e.target.value)}
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                          <Label className="text-xs">Expected Output</Label>
                                          {problem.testCases.length > 1 && (
                                            <Button variant="ghost" size="sm" onClick={() => removeTestCase(index, tcIndex)} className="h-6 w-6 p-0">
                                              <Trash2 className="w-3 h-3 text-destructive" />
                                            </Button>
                                          )}
                                        </div>
                                        <Textarea
                                          placeholder="6"
                                          rows={2}
                                          className="font-mono text-sm"
                                          value={testCase.expectedOutput}
                                          onChange={(e) => updateTestCase(index, tcIndex, 'expectedOutput', e.target.value)}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </>
                            )}
                            
                            {/* Web Dev Specific Fields */}
                            {formData.type === 'web-dev' && (
                              <div className="space-y-4 border-t pt-4 mt-4">
                                <Label className="text-lg font-semibold">Web Dev Configuration</Label>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                    <Label>Starter HTML</Label>
                                    <Textarea
                                      placeholder="<div>...</div>"
                                      rows={4}
                                      className="font-mono text-sm"
                                      value={problem.starterHtml}
                                      onChange={(e) => updateProblem(index, 'starterHtml', e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Starter CSS</Label>
                                    <Textarea
                                      placeholder=".class { ... }"
                                      rows={4}
                                      className="font-mono text-sm"
                                      value={problem.starterCss}
                                      onChange={(e) => updateProblem(index, 'starterCss', e.target.value)}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Starter JS</Label>
                                    <Textarea
                                      placeholder="console.log('...')"
                                      rows={4}
                                      className="font-mono text-sm"
                                      value={problem.starterJs}
                                      onChange={(e) => updateProblem(index, 'starterJs', e.target.value)}
                                    />
                                  </div>
                                </div>

                                {/* Media Support */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <Label>Media (Images/Videos)</Label>
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => {
                                        const updated = [...problems];
                                        updated[index].media = [...(updated[index].media || []), { type: 'image', url: '' }];
                                        setProblems(updated);
                                      }}
                                    >
                                      <Plus className="w-3 h-3 mr-1" /> Add Media
                                    </Button>
                                  </div>
                                  {problem.media?.map((media, mIndex) => (
                                    <div key={mIndex} className="flex gap-2 items-start">
                                      <Select 
                                        value={media.type} 
                                        onValueChange={(v: 'image' | 'video') => {
                                          const updated = [...problems];
                                          updated[index].media![mIndex].type = v;
                                          setProblems(updated);
                                        }}
                                      >
                                        <SelectTrigger className="w-[100px]">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="image">Image</SelectItem>
                                          <SelectItem value="video">Video</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Input 
                                        placeholder="Media URL" 
                                        value={media.url}
                                        onChange={(e) => {
                                          const updated = [...problems];
                                          updated[index].media![mIndex].url = e.target.value;
                                          setProblems(updated);
                                        }}
                                      />
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => {
                                          const updated = [...problems];
                                          updated[index].media = updated[index].media?.filter((_, i) => i !== mIndex);
                                          setProblems(updated);
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>

                                {/* Web Dev Test Cases (Inclusion Checks) */}
                                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                                  <div className="flex items-center justify-between">
                                    <Label className="font-semibold">Validation Checks</Label>
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={() => {
                                        const updated = [...problems];
                                        updated[index].webDevTestCases = [
                                          ...(updated[index].webDevTestCases || []), 
                                          { type: 'function', description: 'Check if code includes...', codeToInclude: '' }
                                        ];
                                        setProblems(updated);
                                      }}
                                    >
                                      <Plus className="w-3 h-3 mr-1" />
                                      Add Check
                                    </Button>
                                  </div>
                                  {problem.webDevTestCases?.map((test, tIndex) => (
                                    <div key={tIndex} className="grid grid-cols-1 gap-3 p-3 bg-background rounded border">
                                      <div className="flex justify-between">
                                        <Label className="text-xs">Check Type: Inclusion</Label>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          onClick={() => {
                                            const updated = [...problems];
                                            updated[index].webDevTestCases = updated[index].webDevTestCases?.filter((_, i) => i !== tIndex);
                                            setProblems(updated);
                                          }} 
                                          className="h-6 w-6 p-0"
                                        >
                                          <Trash2 className="w-3 h-3 text-destructive" />
                                        </Button>
                                      </div>
                                      <Input
                                        placeholder="Description (e.g., Should include a button)"
                                        value={test.description}
                                        onChange={(e) => {
                                          const updated = [...problems];
                                          updated[index].webDevTestCases![tIndex].description = e.target.value;
                                          setProblems(updated);
                                        }}
                                      />
                                      <Input
                                        placeholder="Code/Tag to include (e.g., <button>, .class, functionName)"
                                        value={test.codeToInclude}
                                        onChange={(e) => {
                                          const updated = [...problems];
                                          updated[index].webDevTestCases![tIndex].codeToInclude = e.target.value;
                                          setProblems(updated);
                                        }}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            <div className="space-y-2">
                              <Label>Quick Answer (for simple validation)</Label>
                              <Input
                                placeholder="Optional: simple expected answer"
                                value={problem.answer}
                                onChange={(e) => updateProblem(index, 'answer', e.target.value)}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Button
                      onClick={handleCreateContest}
                      disabled={createContest.isPending}
                      className="w-full bg-gradient-to-r from-primary to-purple-600 text-white"
                    >
                      {createContest.isPending ? 'Creating...' : 'Create Contest'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">All Contests</TabsTrigger>
              <TabsTrigger value="live">Live</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="ended">Ended</TabsTrigger>
            </TabsList>

            {['all', 'live', 'upcoming', 'ended'].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardHeader>
                          <div className="h-6 bg-muted rounded w-3/4" />
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contests
                      ?.filter((c) => tab === 'all' || getContestStatus(c) === tab)
                      .map((contest) => {
                        const status = getContestStatus(contest);
                        return (
                          <Card key={contest.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg">{contest.title}</CardTitle>
                                  <CardDescription>{contest.description}</CardDescription>
                                </div>
                                <Badge
                                  className={
                                    status === 'live'
                                      ? 'bg-red-500 text-white animate-pulse'
                                      : status === 'upcoming'
                                      ? 'bg-blue-500 text-white'
                                      : 'bg-gray-500 text-white'
                                  }
                                >
                                  {status.toUpperCase()}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {format(new Date(contest.start_time), 'MMM dd, HH:mm')}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Target className="w-4 h-4" />
                                  {(contest.problems as any[])?.length || 0} problems
                                </div>
                              </div>

                              <Badge
                                variant="outline"
                                className={
                                  contest.difficulty === 'easy'
                                    ? 'text-green-500 border-green-500'
                                    : contest.difficulty === 'medium'
                                    ? 'text-yellow-500 border-yellow-500'
                                    : 'text-red-500 border-red-500'
                                }
                              >
                                {contest.difficulty}
                              </Badge>

                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => setSelectedContest(contest.id)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleActive(contest.id, contest.is_active)}
                                >
                                  {contest.is_active ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteContest(contest.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    {(!contests || contests.filter((c) => tab === 'all' || getContestStatus(c) === tab).length === 0) && (
                      <Card className="col-span-full">
                        <CardHeader className="text-center py-12">
                          <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <CardTitle>No Contests</CardTitle>
                          <CardDescription>
                            {tab === 'all' ? 'Create your first contest to get started' : `No ${tab} contests`}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    )}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          {/* Contest Details Dialog */}
          {selectedContest && (
            <ContestDetailsDialog contestId={selectedContest} onClose={() => setSelectedContest(null)} />
          )}
        </div>
      </div>
    </Layout>
  );
}

function ContestDetailsDialog({ contestId, onClose }: { contestId: string; onClose: () => void }) {
  const { data: contests } = useCodingContests();


  const contest = contests?.find((c) => c.id === contestId);
  if (!contest) return null;

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            {contest.title}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="problems">Problems ({(contest.problems as any[])?.length || 0})</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Start Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">{format(new Date(contest.start_time), 'PPpp')}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">End Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">{format(new Date(contest.end_time), 'PPpp')}</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{contest.description || 'No description provided'}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="problems" className="space-y-4">
            {(contest.problems as any[])?.map((problem: any, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base">
                    Problem {index + 1}: {problem.title}
                  </CardTitle>
                  <CardDescription>{problem.points} points</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">{problem.description}</p>
                  {problem.example && (
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Example:</p>
                      <pre className="text-sm whitespace-pre-wrap">{problem.example}</pre>
                    </div>
                  )}
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Answer:</p>
                    <code className="text-sm font-mono">{problem.answer}</code>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <ContestLeaderboard contestId={contestId} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
