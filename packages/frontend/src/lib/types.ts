export interface TreeNode {
  name: string;
  type: 'file' | 'directory';
  children?: TreeNode[];
  path?: string;
}

export interface ScanResult {
  files: ScannedFileSummary[];
  tree: TreeNode;
  features: string[];
  fileCount: number;
  scannedAt: string;
}

export interface ScannedFileSummary {
  relativePath: string;
  ext: string;
  size: number;
}

export interface ProjectProfile {
  projectName: string | null;
  projectVersion: string | null;
  description: string | null;
  languages: string[];
  frameworks: string[];
  packageManagers: string[];
  testFrameworks: string[];
  buildTools: string[];
  hasDockerfile: boolean;
  license: string | null;
}

export interface ReadmeState {
  content: string | null;
  generatedAt: string | null;
  isStale: boolean;
}

export type WatchEventType = 'readme-updated' | 'file-changed' | 'scan-started' | 'error';

export interface WatchEvent {
  type: WatchEventType;
  timestamp: string;
  file?: string;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type ScanStatus = 'idle' | 'scanning' | 'analyzing' | 'building' | 'done' | 'error';

export interface ScanProgressEvent {
  status: ScanStatus;
  fileCount?: number;
  currentFile?: string;
  error?: string;
}

export interface AutoDocConfig {
  output: string;
  ai: { provider: string; model: string };
  scan: { maxDepth: number; maxFileSizeKB: number };
  watch: { debounceMs: number };
}