import { generateAsciiTree } from '../../core/tree';
import type { TreeNode } from '../../core/scanner';

export function generateFileTreeSection(tree: TreeNode, maxDepth = 4): string {
  const ascii = generateAsciiTree(tree, { maxDepth, showIcons: false });
  return ['## Project Structure', '', '```', ascii, '```'].join('\n');
}