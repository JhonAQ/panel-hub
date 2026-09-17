import React from 'react';
import { 
  Folder, 
  FileText, 
  Terminal, 
  Database, 
  Globe, 
  LayoutGrid,
  Link2,
  Server,
  Cloud,
  Layers,
  Code
} from 'lucide-react';
import { IconType } from '@/types';

export const GithubSvg = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const DriveSvg = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.71 3.5L1.15 15l3.43 6 6.55-11.5L7.71 3.5zm3.43 6l3.43 6h7.71l-3.43-6h-7.71zm5.14-6L12.85 9h7.72l3.43-5.5H16.28z" />
  </svg>
);

export const FigmaSvg = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 2h8a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v0a4 4 0 0 1 4-4zm0 8h4a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v0a4 4 0 0 1 4-4zm0 8a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4 4 4 0 0 1-4-4v0a4 4 0 0 1 4-4z" />
  </svg>
);

export const NotionSvg = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l11.416-.84c1.12-.093 1.213-.466 1.026-1.12l-.84-1.307c-.187-.28-.56-.467-.934-.467H4.46c-.654 0-1.027.374-.84.934l.84 2.334zm-1.027 3.36l.094 13.535c.093 1.306.746 1.866 2.146 1.772l12.72-.746c1.4-.093 1.867-.84 1.867-2.146V6.728c0-1.12-.467-1.587-1.587-1.493l-13.746.84c-1.027.094-1.494.654-1.494 1.493zm12.32 1.307c.094.466 0 .933-.466 1.026l-1.027.187v8.495c-.56.373-1.214.56-1.774.56-.84 0-1.213-.28-1.866-1.12l-4.2-6.534v6.534l1.4.28c.467.094.56.467.56.934 0 .373-.28.56-.746.56l-3.36.187c-.467 0-.654-.374-.654-.84 0-.467.187-.84.654-.934l1.12-.187V9.714l-1.4-.093c-.467-.094-.56-.467-.56-.934 0-.373.28-.56.746-.56l3.547-.28c.933 0 1.587.373 2.147 1.213l4.013 6.347V9.434l-1.12-.187c-.467-.093-.56-.466-.56-.933 0-.373.28-.56.747-.56l3.173-.187c.467 0 .653.374.653.84v.507z" />
  </svg>
);

export const VercelSvg = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L24 22H0L12 1Z" />
  </svg>
);

export const YoutubeSvg = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export function getCleanIcon(iconType: IconType, className = "w-5 h-5", url?: string) {
  switch (iconType) {
    case 'github':
      return <GithubSvg className={className} />;
    case 'drive':
      return <DriveSvg className={className} />;
    case 'figma':
      return <FigmaSvg className={className} />;
    case 'notion':
      return <NotionSvg className={className} />;
    case 'vercel':
      return <VercelSvg className={className} />;
    case 'youtube':
      return <YoutubeSvg className={className} />;
    case 'docs':
      return <FileText className={className} />;
    case 'database':
      return <Database className={className} />;
    case 'terminal':
      return <Terminal className={className} />;
    case 'server':
      return <Server className={className} />;
    case 'cloud':
      return <Cloud className={className} />;
    case 'code':
      return <Code className={className} />;
    default:
      if (url) {
        const domain = extractDomain(url);
        if (domain && domain !== url) {
          return (
            <img 
              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`} 
              alt="Favicon" 
              className={`${className} object-contain rounded-sm`} 
              onError={(e) => {
                // Fallback to Globe if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          );
        }
      }
      return <Globe className={className} />;
  }
}

export function detectIconFromUrl(url: string): IconType {
  const lower = url.toLowerCase();
  if (lower.includes('github.com')) return 'github';
  if (lower.includes('drive.google.com') || lower.includes('docs.google.com') || lower.includes('sheets.google.com')) return 'drive';
  if (lower.includes('figma.com')) return 'figma';
  if (lower.includes('notion.so') || lower.includes('notion.site')) return 'notion';
  if (lower.includes('vercel.com') || lower.includes('vercel.app')) return 'vercel';
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
  if (lower.includes('supabase.com') || lower.includes('database') || lower.includes('sql') || lower.includes('postgres')) return 'database';
  if (lower.includes('aws') || lower.includes('cloud') || lower.includes('azure')) return 'cloud';
  if (lower.includes('terminal') || lower.includes('localhost') || lower.includes('127.0.0.1')) return 'terminal';
  return 'generic';
}

export function extractDomain(url: string): string {
  try {
    const host = new URL(url).hostname;
    return host.replace(/^www\./, '');
  } catch {
    return url;
  }
}
