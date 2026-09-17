import React from 'react';
import { 
  HardDrive, 
  FileText, 
  Cloud, 
  Terminal, 
  Database, 
  Code2, 
  MessageSquare, 
  Mail, 
  Server, 
  Globe, 
  Folder,
  Layers,
  Sparkles,
  Bookmark,
  Share2
} from 'lucide-react';
import { IconType, AccentColor } from '@/types';

// Authentic Brand SVGs
export const GithubIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const DriveIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.71 3.5L1.15 15l3.43 6 6.55-11.5L7.71 3.5zm3.43 6l3.43 6h7.71l-3.43-6h-7.71zm5.14-6L12.85 9h7.72l3.43-5.5H16.28z" />
  </svg>
);

export const FigmaIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 2h8a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v0a4 4 0 0 1 4-4zm0 8h4a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v0a4 4 0 0 1 4-4zm0 8a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4 4 4 0 0 1-4-4v0a4 4 0 0 1 4-4z" />
  </svg>
);

export const NotionIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l11.416-.84c1.12-.093 1.213-.466 1.026-1.12l-.84-1.307c-.187-.28-.56-.467-.934-.467H4.46c-.654 0-1.027.374-.84.934l.84 2.334zm-1.027 3.36l.094 13.535c.093 1.306.746 1.866 2.146 1.772l12.72-.746c1.4-.093 1.867-.84 1.867-2.146V6.728c0-1.12-.467-1.587-1.587-1.493l-13.746.84c-1.027.094-1.494.654-1.494 1.493zm12.32 1.307c.094.466 0 .933-.466 1.026l-1.027.187v8.495c-.56.373-1.214.56-1.774.56-.84 0-1.213-.28-1.866-1.12l-4.2-6.534v6.534l1.4.28c.467.094.56.467.56.934 0 .373-.28.56-.746.56l-3.36.187c-.467 0-.654-.374-.654-.84 0-.467.187-.84.654-.934l1.12-.187V9.714l-1.4-.093c-.467-.094-.56-.467-.56-.934 0-.373.28-.56.746-.56l3.547-.28c.933 0 1.587.373 2.147 1.213l4.013 6.347V9.434l-1.12-.187c-.467-.093-.56-.466-.56-.933 0-.373.28-.56.747-.56l3.173-.187c.467 0 .653.374.653.84v.507z" />
  </svg>
);

export const YoutubeIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const VercelIcon = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L24 22H0L12 1Z" />
  </svg>
);

export function getLinkIcon(iconType: IconType, className = 'w-6 h-6') {
  switch (iconType) {
    case 'github':
      return <GithubIcon className={className} />;
    case 'drive':
      return <DriveIcon className={className} />;
    case 'figma':
      return <FigmaIcon className={className} />;
    case 'notion':
      return <NotionIcon className={className} />;
    case 'youtube':
      return <YoutubeIcon className={className} />;
    case 'vercel':
      return <VercelIcon className={className} />;
    case 'docs':
      return <FileText className={className} />;
    case 'cloud':
      return <Cloud className={className} />;
    case 'terminal':
      return <Terminal className={className} />;
    case 'database':
      return <Database className={className} />;
    case 'code':
      return <Code2 className={className} />;
    case 'chat':
      return <MessageSquare className={className} />;
    case 'email':
      return <Mail className={className} />;
    case 'server':
      return <Server className={className} />;
    case 'generic':
    default:
      return <Globe className={className} />;
  }
}

export function detectIconAndThemeFromUrl(url: string): { icon: IconType; theme: AccentColor } {
  const lower = url.toLowerCase();
  
  if (lower.includes('github.com')) {
    return { icon: 'github', theme: 'cyan' };
  }
  if (lower.includes('drive.google.com') || lower.includes('docs.google.com') || lower.includes('sheets.google.com')) {
    return { icon: 'drive', theme: 'emerald' };
  }
  if (lower.includes('figma.com')) {
    return { icon: 'figma', theme: 'rose' };
  }
  if (lower.includes('notion.so') || lower.includes('notion.site')) {
    return { icon: 'notion', theme: 'amber' };
  }
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
    return { icon: 'youtube', theme: 'rose' };
  }
  if (lower.includes('vercel.com') || lower.includes('vercel.app')) {
    return { icon: 'vercel', theme: 'cyan' };
  }
  if (lower.includes('supabase.com') || lower.includes('postgres') || lower.includes('mongo') || lower.includes('database')) {
    return { icon: 'database', theme: 'emerald' };
  }
  if (lower.includes('aws.amazon.com') || lower.includes('cloud') || lower.includes('azure') || lower.includes('digitalocean')) {
    return { icon: 'cloud', theme: 'violet' };
  }
  if (lower.includes('trello.com') || lower.includes('jira') || lower.includes('linear.app')) {
    return { icon: 'docs', theme: 'amber' };
  }
  if (lower.includes('slack.com') || lower.includes('discord.com') || lower.includes('whatsapp.com')) {
    return { icon: 'chat', theme: 'violet' };
  }
  if (lower.includes('localhost') || lower.includes('127.0.0.1')) {
    return { icon: 'terminal', theme: 'emerald' };
  }

  return { icon: 'generic', theme: 'cyan' };
}

export const ACCENT_STYLES: Record<AccentColor, {
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  iconBg: string;
  iconText: string;
  cardGlow: string;
  highlightBorder: string;
  neonText: string;
}> = {
  cyan: {
    badgeBg: 'bg-cyan-950/60',
    badgeText: 'text-cyan-400',
    badgeBorder: 'border-cyan-500/30',
    iconBg: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/60',
    iconText: 'text-cyan-400',
    cardGlow: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.18)] hover:border-cyan-500/50',
    highlightBorder: 'border-cyan-500/40',
    neonText: 'text-cyan-400'
  },
  emerald: {
    badgeBg: 'bg-emerald-950/60',
    badgeText: 'text-emerald-400',
    badgeBorder: 'border-emerald-500/30',
    iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 group-hover:bg-emerald-500/20 group-hover:border-emerald-400/60',
    iconText: 'text-emerald-400',
    cardGlow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.18)] hover:border-emerald-500/50',
    highlightBorder: 'border-emerald-500/40',
    neonText: 'text-emerald-400'
  },
  amber: {
    badgeBg: 'bg-amber-950/60',
    badgeText: 'text-amber-400',
    badgeBorder: 'border-amber-500/30',
    iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/30 group-hover:bg-amber-500/20 group-hover:border-amber-400/60',
    iconText: 'text-amber-400',
    cardGlow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.18)] hover:border-amber-500/50',
    highlightBorder: 'border-amber-500/40',
    neonText: 'text-amber-400'
  },
  violet: {
    badgeBg: 'bg-violet-950/60',
    badgeText: 'text-violet-400',
    badgeBorder: 'border-violet-500/30',
    iconBg: 'bg-violet-500/10 text-violet-400 border border-violet-500/30 group-hover:bg-violet-500/20 group-hover:border-violet-400/60',
    iconText: 'text-violet-400',
    cardGlow: 'hover:shadow-[0_0_30px_rgba(168,85,247,0.18)] hover:border-violet-500/50',
    highlightBorder: 'border-violet-500/40',
    neonText: 'text-violet-400'
  },
  rose: {
    badgeBg: 'bg-rose-950/60',
    badgeText: 'text-rose-400',
    badgeBorder: 'border-rose-500/30',
    iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/30 group-hover:bg-rose-500/20 group-hover:border-rose-400/60',
    iconText: 'text-rose-400',
    cardGlow: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.18)] hover:border-rose-500/50',
    highlightBorder: 'border-rose-500/40',
    neonText: 'text-rose-400'
  },
  slate: {
    badgeBg: 'bg-slate-900/80',
    badgeText: 'text-slate-300',
    badgeBorder: 'border-slate-700/50',
    iconBg: 'bg-slate-800/50 text-slate-300 border border-slate-700/60 group-hover:bg-slate-700/60 group-hover:border-slate-500',
    iconText: 'text-slate-300',
    cardGlow: 'hover:shadow-[0_0_30px_rgba(148,163,184,0.12)] hover:border-slate-500/50',
    highlightBorder: 'border-slate-600/40',
    neonText: 'text-slate-300'
  }
};
