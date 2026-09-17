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
  Folder
} from 'lucide-react';

interface LinkListItemProps {
  link: HubLink;
  folder?: HubFolder;
  onOpen: (link: HubLink) => void;
  onTogglePin: (id: string) => void;
  onEdit: (link: HubLink) => void;
  onDelete: (id: string) => void;
}

export const LinkListItem: React.FC<LinkListItemProps> = ({
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

  return (
    <div
      onClick={() => onOpen(link)}
      className="group relative flex items-center justify-between p-3.5 rounded-xl glass-card hover:bg-white/[0.06] border border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer select-none"
    >
      {/* Left: Icon & Info */}
      <div className="flex items-center gap-3.5 min-w-0 pr-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center p-2 shrink-0 ${styles.iconBg}`}>
          {getLinkIcon(link.iconType, 'w-5 h-5')}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
              {link.title}
            </h4>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            {folder && (
              <span className="text-[10px] font-mono text-slate-400 bg-black/40 px-2 py-0.5 rounded border border-white/5 flex items-center gap-1 shrink-0">
                <Folder className="w-2.5 h-2.5" />
                {folder.name}
              </span>
            )}
            <span className="text-[11px] font-mono text-slate-500 truncate max-w-[280px]">
              {link.url}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={handlePin}
          title={link.isPinned ? "Desfijar de favoritos" : "Fijar a favoritos"}
          className={`p-1.5 rounded-lg transition-colors ${
            link.isPinned 
              ? 'text-amber-400 bg-amber-500/20' 
              : 'text-slate-500 hover:text-white hover:bg-white/10'
          }`}
        >
          <Pin className={`w-3.5 h-3.5 ${link.isPinned ? 'fill-amber-400' : ''}`} />
        </button>

        <button
          onClick={handleCopy}
          title="Copiar URL"
          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>

        <button
          onClick={handleEdit}
          title="Editar"
          className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleDelete}
          title="Eliminar"
          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
