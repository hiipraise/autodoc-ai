import type { TreeNode } from './scanner';

interface TreeOptions {
  maxDepth?: number;
  showIcons?: boolean;
  colorize?: boolean;
}

const FILE_ICONS: Record<string, string> = {
  '.ts': '📘', '.tsx': '⚛️ ', '.js': '📜', '.jsx': '⚛️ ',
  '.py': '🐍', '.go': '🐹', '.rs': '🦀', '.java': '☕',
  '.json': '📋', '.yaml': '⚙️ ', '.yml': '⚙️ ', '.md': '📝',
  '.env': '🔐', '.sh': '⚡', '.css': '🎨', '.html': '🌐',
  '.png': '🖼️ ', '.jpg': '🖼️ ', '.svg': '🎭',
  'default': '📄',
};

const DIR_ICONS: Record<string, string> = {
  'src': '📁', 'components': '🧩', 'pages': '📄', 'hooks': '🪝',
  'utils': '🔧', 'lib': '📚', 'styles': '🎨', 'tests': '🧪',
  'docs': '📖', 'scripts': '⚡', 'public': '🌐', 'assets': '🖼️ ',
  'default': '📂',
};

export function generateAsciiTree(
  node: TreeNode,
  options: TreeOptions = {},
  prefix = '',
  isLast = true,
  depth = 0
): string {
  const { maxDepth = 6, showIcons = true } = options;
  if (depth > maxDepth) return '';

  const lines: string[] = [];
  const connector = isLast ? '└── ' : '├── ';
  const extension = isLast ? '    ' : '│   ';

  if (depth === 0) {
    // Root node
    const icon = showIcons ? '🌳 ' : '';
    lines.push(`${icon}${node.name}/`);
  } else {
    const ext = node.name.includes('.') ? `.${node.name.split('.').pop()}` : '';
    let icon = '';
    if (showIcons) {
      if (node.type === 'directory') {
        icon = (DIR_ICONS[node.name] || DIR_ICONS['default']) + ' ';
      } else {
        icon = (FILE_ICONS[`.${ext.replace('.', '')}`] || FILE_ICONS['default']) + ' ';
      }
    }
    const suffix = node.type === 'directory' ? '/' : '';
    lines.push(`${prefix}${connector}${icon}${node.name}${suffix}`);
  }

  if (node.children && depth < maxDepth) {
    const sorted = [...node.children].sort((a, b) => {
      // Directories first, then files
      if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    sorted.forEach((child, index) => {
      const childIsLast = index === sorted.length - 1;
      const childPrefix = depth === 0 ? '' : prefix + extension;
      lines.push(generateAsciiTree(child, options, childPrefix, childIsLast, depth + 1));
    });
  }

  return lines.filter(Boolean).join('\n');
}