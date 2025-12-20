
export type File = {
  name: string;
  language: string;
  content: string;
};

export interface FileSystemState {
  files: Record<string, File>;
  folders: string[];
}

export const INITIAL_FS_STATE: FileSystemState = {
  files: {
    '/index.html': {
        name: 'index.html',
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Future OS</title>
    <style>
        body { margin: 0; background: #000; color: #fff; font-family: monospace; }
        .center { display: flex; height: 100vh; justify-content: center; align-items: center; }
        h1 { font-size: 3rem; background: linear-gradient(to right, #ac1ed6, #c26e73); -webkit-background-clip: text; color: transparent; }
    </style>
</head>
<body>
    <div class="center">
        <h1>Welcome to Future OS</h1>
    </div>
</body>
</html>`
    },
    '/style.css': {
        name: 'style.css',
        language: 'css',
        content: `body { background: #111; }`
    },
    '/script.js': {
        name: 'script.js',
        language: 'javascript',
        content: `console.log("System initialized...");`
    }
  },
  folders: ['/src', '/assets']
};

export const normalizePath = (path: string): string => {
    // Remove trailing slash unless it's root
    if (path.length > 1 && path.endsWith('/')) {
        return path.slice(0, -1);
    }
    if (!path.startsWith('/')) {
        return '/' + path;
    }
    return path;
};

export const resolvePath = (currentDir: string, targetPath: string): string => {
    if (!targetPath) return currentDir;

    if (targetPath === '.') return currentDir;
    if (targetPath === '..') {
        const parts = currentDir.split('/').filter(Boolean);
        parts.pop();
        return normalizePath('/' + parts.join('/'));
    }
    if (targetPath === '~') return '/'; // Home is root for now

    if (targetPath.startsWith('/')) {
        return normalizePath(targetPath);
    }

    // Relative path
    const parts = currentDir === '/' ? [] : currentDir.split('/').filter(Boolean);
    const targetParts = targetPath.split('/').filter(Boolean);

    for (const part of targetParts) {
        if (part === '.') continue;
        if (part === '..') {
            parts.pop();
        } else {
            parts.push(part);
        }
    }

    return normalizePath('/' + parts.join('/'));
};

export const getParentPath = (path: string): string => {
    return resolvePath(path, '..');
};

export const isValidFileName = (name: string): boolean => {
    return /^[a-zA-Z0-9_.-]+$/.test(name);
};

export const getDirectoryContents = (fs: FileSystemState, dirPath: string) => {
    const normalizedDir = normalizePath(dirPath);
    
    // Direct children folders
    const childFolders = fs.folders.filter(f => {
        const parent = getParentPath(f);
        return parent === normalizedDir && f !== normalizedDir;
    });

    // Direct children files
    const childFiles = Object.keys(fs.files).filter(f => {
        const parent = getParentPath(f);
        return parent === normalizedDir;
    });

    return { folders: childFolders, files: childFiles };
};
