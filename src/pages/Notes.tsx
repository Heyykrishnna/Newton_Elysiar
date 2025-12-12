import { useState, useEffect, useCallback, useRef } from 'react';
import { Layout } from '@/components/Layout';
import { BackToDashboard } from '@/components/BackToDashboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Plus, Search, Trash2, Star, StarOff, FolderOpen, Tag, 
  Clock, FileText, Bold, Italic, Underline, List, ListOrdered,
  Heading1, Heading2, Quote, Code, Link, Image, CheckSquare,
  MoreVertical, Copy, Download, Palette, Archive, Pin, PinOff,
  Upload, Share2, Users, Globe, Lock, Keyboard
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSharedNotes, useCreateSharedNote, useUpdateSharedNote, useDeleteSharedNote, useShareNote, SharedNote } from '@/hooks/useSharedNotes';
import { supabase } from '@/integrations/supabase/client';
import katex from 'katex';
import 'katex/dist/katex.min.css';


interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  color: string;
  isPinned: boolean;
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

const COLORS = [
  { name: 'Default', value: 'bg-[#221f20]' },
  { name: 'Red', value: 'bg-red-900/30' },
  { name: 'Orange', value: 'bg-orange-900/30' },
  { name: 'Yellow', value: 'bg-yellow-900/30' },
  { name: 'Green', value: 'bg-green-900/30' },
  { name: 'Blue', value: 'bg-blue-900/30' },
  { name: 'Purple', value: 'bg-purple-900/30' },
  { name: 'Pink', value: 'bg-pink-900/30' },
];

const STORAGE_KEY = 'elysiar_notes';

const KEYBOARD_SHORTCUTS = [
  { key: 'Ctrl+B', action: 'Bold' },
  { key: 'Ctrl+I', action: 'Italic' },
  { key: 'Ctrl+U', action: 'Underline' },
  { key: 'Ctrl+Shift+1', action: 'Heading 1' },
  { key: 'Ctrl+Shift+2', action: 'Heading 2' },
  { key: 'Ctrl+Shift+L', action: 'Bullet List' },
  { key: 'Ctrl+Shift+O', action: 'Numbered List' },
  { key: 'Ctrl+Shift+Q', action: 'Quote' },
  { key: 'Ctrl+S', action: 'Save (auto-saved)' },
];

// Convert HTML to Markdown
const htmlToMarkdown = (html: string): string => {
  let md = html;
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n');
  md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
  md = md.replace(/<u[^>]*>(.*?)<\/u>/gi, '__$1__');
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n\n');
  md = md.replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```\n\n');
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`');
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
  md = md.replace(/<ul[^>]*>|<\/ul>/gi, '\n');
  md = md.replace(/<ol[^>]*>|<\/ol>/gi, '\n');
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n');
  md = md.replace(/<br\s*\/?>/gi, '\n');
  md = md.replace(/<[^>]*>/g, '');
  md = md.replace(/&nbsp;/g, ' ');
  md = md.replace(/&amp;/g, '&');
  md = md.replace(/&lt;/g, '<');
  md = md.replace(/&gt;/g, '>');
  return md.trim();
};

// Convert Markdown to HTML
const markdownToHtml = (md: string): string => {
  let html = md;
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<u>$1</u>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/```([\s\S]*?)```/g, '<pre>$1</pre>');
  html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');
  html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/\n/g, '<br>');
  return html;
};

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedSharedNote, setSelectedSharedNote] = useState<SharedNote | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('local');
  const [shareEmail, setShareEmail] = useState('');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastNoteIdRef = useRef<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('preview');

  // Shared notes hooks
  const { data: sharedNotes = [], isLoading: sharedLoading } = useSharedNotes();
  const createSharedNote = useCreateSharedNote();
  const updateSharedNote = useUpdateSharedNote();
  const deleteSharedNote = useDeleteSharedNote();
  const shareNote = useShareNote();

  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Load notes from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setNotes(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse notes:', e);
        }
      }
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    }
  }, [notes, isLoading]);

  // Sync editor content when note selection changes
  useEffect(() => {
    const currentNoteId = selectedNote?.id || selectedSharedNote?.id || null;
    if (currentNoteId !== lastNoteIdRef.current) {
      lastNoteIdRef.current = currentNoteId;
      if (editorRef.current) {
        const content = selectedNote?.content || selectedSharedNote?.content || '';
        editorRef.current.innerHTML = content;
      }
    }
  }, [selectedNote?.id, selectedSharedNote?.id, selectedNote?.content, selectedSharedNote?.content]);

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!editorRef.current || document.activeElement !== editorRef.current) return;

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            formatText('bold');
            break;
          case 'i':
            e.preventDefault();
            formatText('italic');
            break;
          case 'u':
            e.preventDefault();
            formatText('underline');
            break;
          case 's':
            e.preventDefault();
            toast.success('Note auto-saved');
            break;
        }

        if (e.shiftKey) {
          switch (e.key) {
            case '!':
            case '1':
              e.preventDefault();
              formatText('formatBlock', '<h1>');
              break;
            case '@':
            case '2':
              e.preventDefault();
              formatText('formatBlock', '<h2>');
              break;
            case 'L':
            case 'l':
              e.preventDefault();
              formatText('insertUnorderedList');
              break;
            case 'O':
            case 'o':
              e.preventDefault();
              formatText('insertOrderedList');
              break;
            case 'Q':
            case 'q':
              e.preventDefault();
              formatText('formatBlock', '<blockquote>');
              break;
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderMathContent = (content: string) => {
    // Basic math rendering replacement
    const formatted = content.replace(/(\$\$[^$]+\$\$|\$[^$]+\$)/g, (match) => {
      try {
        const isBlock = match.startsWith('$$');
        const math = isBlock ? match.slice(2, -2) : match.slice(1, -1);
        return katex.renderToString(math, {
          displayMode: isBlock,
          throwOnError: false,
          output: 'html'
        });
      } catch (e) {
        return match;
      }
    });
    return formatted;
  };

  const createNote = () => {
    const newNote: Note = {
      id: `note_${Date.now()}`,
      title: 'Untitled',
      content: '',
      tags: [],
      color: 'bg-[#221f20]',
      isPinned: false,
      isFavorite: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setSelectedSharedNote(null);
    toast.success('New note created');
  };

  const createCloudNote = () => {
    if (!currentUser) {
      toast.error('Please sign in to create cloud notes');
      return;
    }
    createSharedNote.mutate({
      title: 'Untitled',
      content: '',
      tags: [],
      color: 'bg-[#221f20]',
      is_pinned: false,
      is_archived: false,
      is_public: false,
      shared_with: [],
    });
  };

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, ...updates, updatedAt: new Date().toISOString() }
        : note
    ));
    if (selectedNote?.id === id) {
      setSelectedNote(prev => prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null);
    }
  }, [selectedNote]);

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
    toast.success('Note deleted');
  };

  const duplicateNote = (note: Note) => {
    const duplicated: Note = {
      ...note,
      id: `note_${Date.now()}`,
      title: `${note.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([duplicated, ...notes]);
    toast.success('Note duplicated');
  };

  const exportNoteMarkdown = (note: Note | SharedNote) => {
    const title = note.title;
    const content = note.content;
    const tags = note.tags || [];
    const createdAt = 'createdAt' in note ? note.createdAt : note.created_at;
    
    const mdContent = htmlToMarkdown(content);
    const fullContent = `# ${title}\n\n${mdContent}\n\n---\nTags: ${tags.join(', ')}\nCreated: ${format(new Date(createdAt), 'PPpp')}`;
    const blob = new Blob([fullContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Note exported as Markdown');
  };

  const importMarkdown = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.split('\n');
      let title = 'Imported Note';
      let bodyStart = 0;

      // Extract title from first heading
      if (lines[0]?.startsWith('# ')) {
        title = lines[0].slice(2).trim();
        bodyStart = 1;
      }

      const body = lines.slice(bodyStart).join('\n');
      const htmlContent = markdownToHtml(body);

      if (activeTab === 'local') {
        const newNote: Note = {
          id: `note_${Date.now()}`,
          title,
          content: htmlContent,
          tags: [],
          color: 'bg-[#221f20]',
          isPinned: false,
          isFavorite: false,
          isArchived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setNotes([newNote, ...notes]);
        setSelectedNote(newNote);
      } else if (currentUser) {
        createSharedNote.mutate({
          title,
          content: htmlContent,
          tags: [],
          color: 'bg-[#221f20]',
        });
      }

      toast.success('Markdown imported successfully');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const addTag = (noteId: string, tag: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note && !note.tags.includes(tag)) {
      updateNote(noteId, { tags: [...note.tags, tag] });
    }
  };

  const removeTag = (noteId: string, tag: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      updateNote(noteId, { tags: note.tags.filter(t => t !== tag) });
    }
  };

  // Get all unique tags
  const allTags = [...new Set(notes.flatMap(n => n.tags))];

  // Filter notes
  const filteredNotes = notes.filter(note => {
    if (showArchived !== note.isArchived) return false;
    if (selectedTag && !note.tags.includes(selectedTag)) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return note.title.toLowerCase().includes(query) || 
             note.content.toLowerCase().includes(query) ||
             note.tags.some(t => t.toLowerCase().includes(query));
    }
    return true;
  });

  // Sort: pinned first, then by updated date
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  // Filter shared notes
  const filteredSharedNotes = sharedNotes.filter(note => {
    if (showArchived !== note.is_archived) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return note.title.toLowerCase().includes(query) || 
             note.content.toLowerCase().includes(query);
    }
    return true;
  });

  const sortedSharedNotes = [...filteredSharedNotes].sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });

  // Format toolbar
  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleShareNote = () => {
    if (!selectedSharedNote || !shareEmail) return;
    shareNote.mutate({ noteId: selectedSharedNote.id, userEmail: shareEmail });
    setShareEmail('');
  };

  const togglePublic = () => {
    if (!selectedSharedNote) return;
    shareNote.mutate({ noteId: selectedSharedNote.id, isPublic: !selectedSharedNote.is_public });
  };

  const renderNotesList = (notesList: Note[], isShared: boolean = false) => (
    <div className="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto pr-2">
      <AnimatePresence>
        {notesList.map(note => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <Card
              className={`${note.color} border-2 ${selectedNote?.id === note.id ? 'border-[#ac1ed6]' : 'border-white/10'} cursor-pointer hover:border-white/30 transition-all`}
              onClick={() => {
                setSelectedNote(note);
                setSelectedSharedNote(null);
              }}
            >
              <CardHeader className="py-3 px-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {note.isPinned && <Pin className="w-3 h-3 text-[#ac1ed6]" />}
                      {note.isFavorite && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                      <CardTitle className="text-white text-sm truncate">{note.title}</CardTitle>
                    </div>
                    <CardDescription className="text-white/40 text-xs mt-1 line-clamp-2">
                      {note.content.replace(/<[^>]*>/g, '').substring(0, 100) || 'No content'}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white/40 hover:text-black">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#221f20] border-white/10 text-white">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateNote(note.id, { isPinned: !note.isPinned }); }}>
                        {note.isPinned ? <PinOff className="w-4 h-4 mr-2" /> : <Pin className="w-4 h-4 mr-2" />}
                        {note.isPinned ? 'Unpin' : 'Pin'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateNote(note.id, { isFavorite: !note.isFavorite }); }}>
                        {note.isFavorite ? <StarOff className="w-4 h-4 mr-2" /> : <Star className="w-4 h-4 mr-2" />}
                        {note.isFavorite ? 'Unfavorite' : 'Favorite'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); duplicateNote(note); }}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); exportNoteMarkdown(note); }}>
                        <Download className="w-4 h-4 mr-2" />
                        Export MD
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); updateNote(note.id, { isArchived: !note.isArchived }); }}>
                        <Archive className="w-4 h-4 mr-2" />
                        {note.isArchived ? 'Unarchive' : 'Archive'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                        className="text-red-400"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {note.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="outline" className="text-[10px] py-0 border-white/20 text-white/60">
                      {tag}
                    </Badge>
                  ))}
                  {note.tags.length > 2 && (
                    <span className="text-[10px] text-white/40">+{note.tags.length - 2}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-2 text-[10px] text-white/40">
                  <Clock className="w-3 h-3" />
                  {format(new Date(note.updatedAt), 'MMM dd, HH:mm')}
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  const renderSharedNotesList = () => (
    <div className="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto pr-2">
      <AnimatePresence>
        {sortedSharedNotes.map(note => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
          >
            <Card
              className={`${note.color} border-2 ${selectedSharedNote?.id === note.id ? 'border-[#ac1ed6]' : 'border-white/10'} cursor-pointer hover:border-white/30 transition-all`}
              onClick={() => {
                setSelectedSharedNote(note);
                setSelectedNote(null);
              }}
            >
              <CardHeader className="py-3 px-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {note.is_pinned && <Pin className="w-3 h-3 text-[#ac1ed6]" />}
                      {note.is_public && <Globe className="w-3 h-3 text-green-500" />}
                      {note.shared_with.length > 0 && <Users className="w-3 h-3 text-blue-500" />}
                      <CardTitle className="text-white text-sm truncate">{note.title}</CardTitle>
                    </div>
                    <CardDescription className="text-white/40 text-xs mt-1 line-clamp-2">
                      {note.content.replace(/<[^>]*>/g, '').substring(0, 100) || 'No content'}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white/40 hover:text-black">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#221f20] border-white/10 text-white">
                      <DropdownMenuItem onClick={(e) => { 
                        e.stopPropagation(); 
                        updateSharedNote.mutate({ id: note.id, is_pinned: !note.is_pinned }); 
                      }}>
                        {note.is_pinned ? <PinOff className="w-4 h-4 mr-2" /> : <Pin className="w-4 h-4 mr-2" />}
                        {note.is_pinned ? 'Unpin' : 'Pin'}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); exportNoteMarkdown(note); }}>
                        <Download className="w-4 h-4 mr-2" />
                        Export MD
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { 
                        e.stopPropagation(); 
                        updateSharedNote.mutate({ id: note.id, is_archived: !note.is_archived }); 
                      }}>
                        <Archive className="w-4 h-4 mr-2" />
                        {note.is_archived ? 'Unarchive' : 'Archive'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => { e.stopPropagation(); deleteSharedNote.mutate(note.id); }}
                        className="text-red-400"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-1 mt-2 text-[10px] text-white/40">
                  <Clock className="w-3 h-3" />
                  {format(new Date(note.updated_at), 'MMM dd, HH:mm')}
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-[#090607]">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-4">
            <BackToDashboard />
          </div>

          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl pb-2 md:text-5xl font-bold bg-gradient-to-r from-[#ac1ed6] via-[#c26e73] to-[#ac1ed6] bg-clip-text text-transparent">
                My Notes
              </h1>
              <p className="text-white/60 mt-2">Your personal knowledge base • Local & Cloud sync</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".md,.markdown,.txt"
                onChange={importMarkdown}
                className="hidden"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowShortcuts(true)}
                      className="border-white/20 text-black hover:text-white hover:bg-white/10"
                    >
                      <Keyboard className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Keyboard shortcuts</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-white/20 text-black hover:text-white hover:bg-white/10"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import MD
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowArchived(!showArchived)}
                className={`border-white/20 text-black hover:text-white hover:bg-white/10 ${showArchived ? 'bg-white/10' : ''}`}
              >
                <Archive className="w-4 h-4 mr-2" />
                {showArchived ? 'Show Active' : 'Archived'}
              </Button>
              <Button
                onClick={activeTab === 'local' ? createNote : createCloudNote}
                className="bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="bg-[#221f20] border border-white/10">
              <TabsTrigger value="local" className="data-[state=active]:bg-[#ac1ed6]">
                <FolderOpen className="w-4 h-4 mr-2" />
                Local Notes
              </TabsTrigger>
              <TabsTrigger value="cloud" className="data-[state=active]:bg-[#ac1ed6]">
                <Users className="w-4 h-4 mr-2" />
                Cloud Notes
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search and Tags */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#221f20] border-white/10 text-white"
              />
            </div>
            {activeTab === 'local' && allTags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={`cursor-pointer ${!selectedTag ? 'bg-[#ac1ed6]/20 border-[#ac1ed6]' : 'border-white/20'} text-white`}
                  onClick={() => setSelectedTag(null)}
                >
                  All
                </Badge>
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className={`cursor-pointer ${selectedTag === tag ? 'bg-[#ac1ed6]/20 border-[#ac1ed6]' : 'border-white/20'} text-white`}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Notes List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center justify-between text-white/60 text-sm">
                <span>{activeTab === 'local' ? sortedNotes.length : sortedSharedNotes.length} notes</span>
              </div>
              
              {activeTab === 'local' ? (
                sortedNotes.length > 0 ? renderNotesList(sortedNotes) : (
                  <Card className="border-2 border-white/10 bg-[#221f20]">
                    <CardHeader className="text-center py-12">
                      <FileText className="w-12 h-12 mx-auto text-white/40 mb-4" />
                      <CardTitle className="text-white">No Notes</CardTitle>
                      <CardDescription className="text-white/60">
                        {searchQuery || selectedTag ? 'No notes match your search' : 'Create your first note'}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )
              ) : (
                sortedSharedNotes.length > 0 ? renderSharedNotesList() : (
                  <Card className="border-2 border-white/10 bg-[#221f20]">
                    <CardHeader className="text-center py-12">
                      <Users className="w-12 h-12 mx-auto text-white/40 mb-4" />
                      <CardTitle className="text-white">No Cloud Notes</CardTitle>
                      <CardDescription className="text-white/60">
                        {!currentUser ? 'Sign in to use cloud notes' : 'Create a cloud note to share'}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )
              )}
            </div>

            {/* Note Editor */}
            <div className="lg:col-span-2">
              {(selectedNote || selectedSharedNote) ? (
                <Card className={`${selectedNote?.color || selectedSharedNote?.color} border-2 border-white/10 min-h-[calc(100vh-300px)]`}>
                  <CardHeader className="border-b border-white/10 pb-4">
                    <div className="flex items-center justify-between mb-4">
                      {/* Title */}
                      <Input
                        value={selectedNote?.title || selectedSharedNote?.title || ''}
                        onChange={(e) => {
                          if (selectedNote) {
                            updateNote(selectedNote.id, { title: e.target.value });
                          } else if (selectedSharedNote) {
                            updateSharedNote.mutate({ id: selectedSharedNote.id, title: e.target.value });
                          }
                        }}
                        className="text-2xl font-bold bg-transparent border-none text-white focus-visible:ring-0 px-0 flex-1 mr-4"
                        placeholder="Untitled"
                      />
                      
                      {/* Math View Toggle */}
                      <div className="flex bg-[#221f20] rounded-lg p-1 border border-white/10">
                        <button
                          onClick={() => setViewMode('edit')}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                            viewMode === 'edit'
                              ? 'bg-white/10 text-white'
                              : 'text-white/60 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          Code View
                        </button>
                        <button
                          onClick={() => setViewMode('preview')}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                            viewMode === 'preview'
                              ? 'bg-[#ac1ed6]/20 text-[#ac1ed6]'
                              : 'text-white/60 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          Math View
                        </button>
                      </div>
                    </div>
                    
                    {/* Tags for local notes */}
                    {selectedNote && (
                      <div className="flex items-center gap-2 flex-wrap mt-2">
                        {selectedNote.tags.map(tag => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="border-white/20 text-white/80 cursor-pointer hover:bg-white/10"
                            onClick={() => removeTag(selectedNote.id, tag)}
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                            <span className="ml-1 text-white/40">×</span>
                          </Badge>
                        ))}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 text-white/40 hover:text-black">
                              <Plus className="w-3 h-3 mr-1" />
                              Add tag
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-[#221f20] border-white/10">
                            <DialogHeader>
                              <DialogTitle className="text-white">Add Tag</DialogTitle>
                            </DialogHeader>
                            <Input
                              placeholder="Enter tag name..."
                              className="bg-[#090607] border-white/10 text-white"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.currentTarget.value) {
                                  addTag(selectedNote.id, e.currentTarget.value);
                                  e.currentTarget.value = '';
                                }
                              }}
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                              {allTags.filter(t => !selectedNote.tags.includes(t)).map(tag => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="cursor-pointer border-white/20 text-white/60 hover:bg-white/10"
                                  onClick={() => addTag(selectedNote.id, tag)}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}

                    {/* Sharing options for cloud notes */}
                    {selectedSharedNote && selectedSharedNote.owner_id === currentUser?.id && (
                      <div className="flex items-center gap-4 mt-3 p-3 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Switch
                            id="public"
                            checked={selectedSharedNote.is_public}
                            onCheckedChange={togglePublic}
                          />
                          <Label htmlFor="public" className="text-white/60 text-sm">
                            {selectedSharedNote.is_public ? <Globe className="w-4 h-4 inline mr-1" /> : <Lock className="w-4 h-4 inline mr-1" />}
                            {selectedSharedNote.is_public ? 'Public' : 'Private'}
                          </Label>
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                          <Input
                            placeholder="Share with email..."
                            value={shareEmail}
                            onChange={(e) => setShareEmail(e.target.value)}
                            className="bg-[#090607] border-white/10 text-white text-sm h-8"
                          />
                          <Button size="sm" onClick={handleShareNote} className="h-8 bg-[#ac1ed6]">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Color picker */}
                    <div className="flex items-center gap-2 mt-3">
                      <Palette className="w-4 h-4 text-white/40" />
                      {COLORS.map(color => (
                        <button
                          key={color.value}
                          className={`w-5 h-5 rounded-full ${color.value} border-2 ${(selectedNote?.color || selectedSharedNote?.color) === color.value ? 'border-white' : 'border-white/20'}`}
                          onClick={() => {
                            if (selectedNote) {
                              updateNote(selectedNote.id, { color: color.value });
                            } else if (selectedSharedNote) {
                              updateSharedNote.mutate({ id: selectedSharedNote.id, color: color.value });
                            }
                          }}
                          title={color.name}
                        />
                      ))}
                    </div>

                    {/* Formatting Toolbar */}
                    {viewMode === 'edit' && (
                      <div className="flex items-center gap-1 mt-4 flex-wrap">
                        <TooltipProvider>
                          <Tooltip><TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => formatText('bold')} className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10">
                              <Bold className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger><TooltipContent>Bold (Ctrl+B)</TooltipContent></Tooltip>
                          <Tooltip><TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => formatText('italic')} className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10">
                              <Italic className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger><TooltipContent>Italic (Ctrl+I)</TooltipContent></Tooltip>
                          <Tooltip><TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => formatText('underline')} className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10">
                              <Underline className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger><TooltipContent>Underline (Ctrl+U)</TooltipContent></Tooltip>
                        </TooltipProvider>
                        <div className="w-px h-6 bg-white/10 mx-1" />
                        <Button variant="ghost" size="sm" onClick={() => formatText('formatBlock', '<h1>')} className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10">
                          <Heading1 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => formatText('formatBlock', '<h2>')} className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10">
                          <Heading2 className="w-4 h-4" />
                        </Button>
                        <div className="w-px h-6 bg-white/10 mx-1" />
                        <Button variant="ghost" size="sm" onClick={() => formatText('insertUnorderedList')} className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10">
                          <List className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => formatText('insertOrderedList')} className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10">
                          <ListOrdered className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => formatText('formatBlock', '<blockquote>')} className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10">
                          <Quote className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => formatText('formatBlock', '<pre>')} className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10">
                          <Code className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="p-4">
                    {viewMode === 'edit' ? (
                      <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        dir="ltr"
                        className="min-h-[400px] text-white/90 focus:outline-none prose prose-invert max-w-none
                          [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4
                          [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mb-3
                          [&>p]:mb-2 [&>p]:leading-relaxed
                          [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-2
                          [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-2
                          [&>blockquote]:border-l-4 [&>blockquote]:border-[#ac1ed6] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-white/70
                          [&>pre]:bg-black/50 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:font-mono [&>pre]:text-sm"
                        onInput={(e) => {
                          const content = e.currentTarget.innerHTML;
                          // Debounce save to prevent cursor issues
                          if (saveTimeoutRef.current) {
                            clearTimeout(saveTimeoutRef.current);
                          }
                          saveTimeoutRef.current = setTimeout(() => {
                            if (selectedNote) {
                              updateNote(selectedNote.id, { content });
                            } else if (selectedSharedNote) {
                              updateSharedNote.mutate({ id: selectedSharedNote.id, content });
                            }
                          }, 1000);
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const text = e.clipboardData.getData('text/plain');
                          document.execCommand('insertText', false, text);
                        }}
                      />
                    ) : (
                      <div
                        className="min-h-[400px] text-white/90 prose prose-invert max-w-none
                          [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mb-4
                          [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mb-3
                          [&>p]:mb-2 [&>p]:leading-relaxed
                          [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-2
                          [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-2
                          [&>blockquote]:border-l-4 [&>blockquote]:border-[#ac1ed6] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-white/70
                          [&>pre]:bg-black/50 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:font-mono [&>pre]:text-sm"
                        dangerouslySetInnerHTML={{ 
                          __html: renderMathContent(selectedNote?.content || selectedSharedNote?.content || '') 
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2 border-white/10 bg-[#221f20] min-h-[calc(100vh-300px)] flex items-center justify-center">
                  <CardHeader className="text-center">
                    <FileText className="w-16 h-16 mx-auto text-white/20 mb-4" />
                    <CardTitle className="text-white/60">Select a note</CardTitle>
                    <CardDescription className="text-white/40">
                      Choose a note from the sidebar or create a new one
                    </CardDescription>
                    <Button
                      onClick={activeTab === 'local' ? createNote : createCloudNote}
                      className="mt-4 bg-gradient-to-r from-[#ac1ed6] to-[#c26e73] text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Note
                    </Button>
                  </CardHeader>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Dialog */}
      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent className="bg-[#221f20] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Keyboard className="w-5 h-5" />
              Keyboard Shortcuts
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {KEYBOARD_SHORTCUTS.map(shortcut => (
              <div key={shortcut.key} className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/60">{shortcut.action}</span>
                <kbd className="px-2 py-1 bg-white/10 rounded text-white text-sm font-mono">{shortcut.key}</kbd>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
