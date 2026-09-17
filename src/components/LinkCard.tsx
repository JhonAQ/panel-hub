'use client';

import React, { useState } from 'react';
import { HubLink, HubFolder } from '@/types';
import { getLinkIcon, ACCENT_STYLES } from '@/lib/icons';
import { 
  ExternalLink, 
  Copy, 
  Check, 
  Pin, 
  Trash2, 
  Edit3, 
  Folder,
  Flame
} from 'lucide-react';

interface LinkCardProps {
  link: HubLink;
  folder?: HubFolder;
  onOpen: (link: HubLink) => void;
  onTogglePin: (id: string) => void;
  onEdit: (link: HubLink) => void;
  onDelete: (id: string) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({
  link,
  folder,
  onOpen,
  onTogglePin,
  onEdit,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);
  const styles = ACCENT_STYLES[link.colorTheme] || ACCENT_STYLES.cyan;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePin(link.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(link);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`¿Estás seguro de eliminar "${link.title}"?`)) {
      onDelete(link.id);
    }
  };

  const cleanDisplayUrl = () => {
    try {
      const parsed = new URL(link.url);
      return parsed.hostname + (parsed.pathname !== '/' ? parsed.pathname.slice(0, 24) + '...' : '');
    } catch {
      return link.url;
    }
  };

  return (
    <div
      onClick={() => onOpen(link)}
      className={`group relative flex flex-col justify-between p-5 rounded-2xl cursor-pointer glass-card ${styles.cardGlow} select-none border-l-4 ${styles.highlightBorder}`}
    >
      {/* Top row: Icon, Category Badge & Action Icons */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {/* Big prominent icon container */}
            <div className={`w-13 h-13 rounded-xl flex items-center justify-center p-3 shadow-inner transition-transform group-hover:scale-110 duration-200 ${styles.iconBg}`}>
              {getLinkIcon(link.iconType, "w-7 h-7")}
            </div>

            {/* Folder / Category Pill */}
            {folder && (
              <div className="flex flex-col">
                <span className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-black/40 px-2.5 py-1 rounded-md border border-white/5 w-fit">
                  <Folder className="w-3 h-3 text-slate-400" />
                  {folder.name}
                </span>
                {link.clickCount > 0 && (
                  <span className="flex items-center gap-1 text-[10px] text-slate-500 font-mono mt-1">
                    <Flame className="w-2.5 h-2.5 text-amber-500" />
                    {link.clickCount} clics
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Quick interactive utility buttons */}
          <div className="flex items-center gap-1 bg-black/30 backdrop-blur-md p-1 rounded-xl border border-white/5 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handlePin}
              title={link.isPinned ? "Desfijar de favoritos" : "Fijar a favoritos"}
              className={`p-1.5 rounded-lg transition-colors ${
                link.isPinned 
                  ? 'text-amber-400 bg-amber-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${link.isPinned ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={handleCopy}
              title="Copiar URL al portapapeles"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={handleEdit}
              title="Editar enlace"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleDelete}
              title="Eliminar enlace"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title and Description */}
        <div className="mt-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors line-clamp-1">
              {link.title}
            </h3>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
          </div>

          {link.description && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {link.description}
            </p>
          )}
        </div>
      </div>

      {/* Bottom row: URL preview & Tags */}
      <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-mono text-slate-500 hover:text-slate-400 truncate max-w-[190px]">
          {cleanDisplayUrl()}
        </span>

        {/* Tags */}
        {link.tags && link.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            {link.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/5"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Copy Toast Feedback */}
      {copied && (
        <div className="absolute inset-x-4 bottom-3 z-20 py-1.5 px-3 bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-mono text-center shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-bottom-2">
          ✓ ¡URL copiada al portapapeles!
        </div>
      )}
    </div>
  );
};
