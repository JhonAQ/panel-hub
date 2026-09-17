export type IconType = 
  | 'github'
  | 'drive'
  | 'figma'
  | 'notion'
  | 'youtube'
  | 'vercel'
  | 'docs'
  | 'cloud'
  | 'terminal'
  | 'database'
  | 'code'
  | 'chat'
  | 'email'
  | 'server'
  | 'generic';

export type AccentColor = 
  | 'cyan' 
  | 'emerald' 
  | 'amber' 
  | 'violet' 
  | 'rose' 
  | 'slate';

export interface HubLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  folderId: string;
  iconType: IconType;
  customIconUrl?: string;
  colorTheme: AccentColor;
  isPinned?: boolean;
  clickCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface HubFolder {
  id: string;
  name: string;
  description?: string;
  iconName: string;
  color: AccentColor;
  parentId?: string | null;
  order: number;
}

export interface HubData {
  folders: HubFolder[];
  links: HubLink[];
  version: number;
  lastUpdated: string;
}
