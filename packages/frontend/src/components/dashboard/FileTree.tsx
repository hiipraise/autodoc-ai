import { useState } from 'react';
import type { TreeNode } from '../../lib/types';
import { cn } from '../../lib/utils';

const FILE_COLORS: Record<string, string> = {
  '.ts':   'text-blue-400',
  '.tsx':  'text-purple-400',
  '.js':   'text-yellow-400',
  '.jsx':  'text-yellow-400',
  '.py':   'text-green-400',
  '.json': 'text-yellow-300',
  '.md':   'text-green-300',
  '.css':  'text-pink-400',
  '.html': 'text-orange-400',
  '.env':  'text-red-400',
};

function TreeItem({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const isDir = node.type === 'directory';
  const ext = node.name.includes('.') ? `.${node.name.split('.').pop()}` : '';
  const colorClass = isDir ? 'text-blue-300' : (FILE_COLORS[ext] ?? 'text-slate-300');

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer hover:bg-[#FE7F2D]/8 text-xs font-mono',
          colorClass
        )}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={() => isDir && setOpen(o => !o)}
      >
        <span className="text-[10px] opacity-60 w-3">
          {isDir ? (open ? '▾' : '▸') : ''}
        </span>
        <span className="opacity-70">{isDir ? (open ? '📂' : '📁') : '📄'}</span>
        <span className={cn('truncate', isDir && 'font-semibold')}>{node.name}</span>
        {isDir && node.children && (
          <span className="ml-auto opacity-40 text-[10px]">{node.children.length}</span>
        )}
      </div>
      {isDir && open && node.children?.map((child, i) => (
        <TreeItem key={i} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export function FileTree({ tree }: { tree: TreeNode | null }) {
  if (!tree) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
        No project scanned yet
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-96 py-2">
      <TreeItem node={tree} depth={0} />
    </div>
  );
}