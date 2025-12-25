
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FileCode, File, Trash2, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSystemState, getDirectoryContents, normalizePath } from '../utils/fileSystem';
import { cn } from '@/lib/utils';

interface FileTreeProps {
  fs: FileSystemState;
  currentPath: string; // Current directory being viewed (not used much recursively but good for context)
  activeFile: string | null;
  onFileSelect: (path: string) => void;
  onDelete: (path: string) => void;
  className?: string;
}

interface FileTreeNodeProps extends FileTreeProps {
  path: string; // Path of this node (folder)
  level: number;
}

const FileTreeNode: React.FC<FileTreeNodeProps> = ({ fs, path, activeFile, onFileSelect, onDelete, level }) => {
  const [isOpen, setIsOpen] = useState(true); // Default open
  const { folders, files } = getDirectoryContents(fs, path);

  // Filter out the current directory itself to avoid infinite recursion if logic is buggy, 
  // though getDirectoryContents mainly handles children.
  
  return (
    <div className="select-none">
      {path !== '/' && (
        <div 
            className={cn(
                "flex items-center gap-1.5 py-1 px-2 hover:bg-white/5 cursor-pointer text-sm transition-colors group",
                level === 0 ? "text-white/80 font-medium" : "text-white/60"
            )}
            style={{ paddingLeft: `${level * 12 + 8}px` }}
            onClick={() => setIsOpen(!isOpen)}
        >
            {isOpen ? <ChevronDown className="w-3 h-3 text-white/40" /> : <ChevronRight className="w-3 h-3 text-white/40" />}
            <Folder className={cn("w-4 h-4", isOpen ? "text-[#ac1ed6]" : "text-[#ac1ed6]/70")} />
            <span className="truncate">{path.split('/').pop()}</span>
        </div>
      )}

      <AnimatePresence>
        {(isOpen || path === '/') && (
          <motion.div
            initial={path === '/' ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
             {/* Render Folders */}
             {folders.map(folderPath => (
                 <FileTreeNode 
                    key={folderPath} 
                    fs={fs} 
                    path={folderPath} 
                    activeFile={activeFile} 
                    onFileSelect={onFileSelect} 
                    onDelete={onDelete}
                    level={path === '/' ? 0 : level + 1}
                    currentPath={path}
                 />
             ))}

             {/* Render Files */}
             {files.map(filePath => {
                 const fileName = filePath.split('/').pop();
                 const isActive = activeFile === filePath;
                 return (
                     <div 
                        key={filePath}
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData('application/file-path', filePath);
                            e.dataTransfer.effectAllowed = 'copy';
                        }}
                        onClick={() => onFileSelect(filePath)}
                        className={cn(
                            "flex items-center gap-2 py-1.5 pr-2 cursor-pointer text-sm transition-colors group relative",
                            isActive ? "bg-[#ac1ed6]/10 text-[#ac1ed6]" : "text-white/60 hover:text-white hover:bg-white/5"
                        )}
                        style={{ paddingLeft: `${(path === '/' ? 0 : level + 1) * 12 + 20}px` }}
                     >
                        <FileCode className={cn("w-3.5 h-3.5", isActive ? "text-[#ac1ed6]" : "text-white/40")} />
                        <span className="truncate flex-1">{fileName}</span>
                        
                        {/* Hover Actions */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(filePath); }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-full transition-opacity text-white/40 hover:text-red-400"
                        >
                            <Trash2 className="w-3 h-3" />
                        </button>
                     </div>
                 );
             })}
             
             {folders.length === 0 && files.length === 0 && (
                 <div style={{ paddingLeft: `${(path === '/' ? 0 : level + 1) * 12 + 20}px` }} className="text-white/20 text-xs py-1 italic">
                     Empty
                 </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FileTree: React.FC<FileTreeProps> = (props) => {
  return (
    <div className={cn("h-full overflow-y-auto py-2", props.className)}>
        <FileTreeNode {...props} path="/" level={0} />
    </div>
  );
};
