'use client';

import React, { useState } from 'react';
import { HubLink, HubFolder } from '@/types';
import { getCleanIcon, extractDomain } from '@/lib/icons';
import { 
  ExternalLink, 
  Copy, 
  Check, 
  Star, 
  Trash2, 
  Edit2, 
  Folder
} from 'lucide-react';

interface CleanRowProps {
  link: HubLink;
  folder?: HubFolder;
  isFocused?: boolean;
  onOpen: (link: HubLink) => void;
  onTogglePin: (id: string) => void;
  onEdit: (link: HubLink) => void;
  onDelete: (id: string) => void;
}

export const CleanRow: React.FC<CleanRowProps> = ({
  link,
  folder,
  isFocused = false,
  onOpen,
  onTogglePin,
  onEdit,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
    if (confirm(`¿Eliminar "${link.title}"?`)) {
      onDelete(link.id);
    }
  };

  const glowClass = link.isPinned 
    ? 'hover:shadow-[0_10px_30px_-10px_rgba(99,102,241,0.2)] border-amber-400/30 bg-[#141624]' 
    : 'hover:shadow-[0_10px_30px_-10px_rgba(99,102,241,0.15)] hover:border-indigo-500/30 bg-[#11121f]';

  const focusedClass = isFocused ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#060814] scale-[1.01] bg-[#1a203c] border-indigo-500/50' : '';

  return (
    <div
      id={`link-${link.id}`}
      onClick={() => onOpen(link)}
      className={`group flex items-center justify-between px-6 py-4 mb-2 rounded-2xl border border-white/5 transition-all duration-200 cursor-pointer select-none ${glowClass} ${focusedClass}`}
    >
      <div className="flex items-center gap-4 min-w-0 pr-4">
        <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/60 group-hover:text-white group-hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-all shrink-0">
          {getCleanIcon(link.iconType, "w-4 h-4")}
        </div>

        <span className="text-base font-bold text-white/80 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-all break-words">
          {link.title}
        </span>

        {link.description && (
          <span className="hidden sm:inline text-sm text-white/40 truncate max-w-[240px] font-light">
            — {link.description}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {folder && (
          <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-1 bg-white/[0.02] rounded-md text-xs text-white/50 font-medium border border-white/[0.02]">
            <Folder className="w-3.5 h-3.5" />
            {folder.name}
          </span>
        )}

        <span className="text-xs text-white/40 font-medium truncate max-w-[120px] group-hover:text-white/60 transition-colors">
          {extractDomain(link.url)}
        </span>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 px-1 py-0.5 rounded-lg border border-white/5">
          <button
            onClick={handlePin}
            title={link.isPinned ? "Quitar de favoritos" : "Marcar favorito"}
            className={`p-1.5 rounded-md transition-colors ${
              link.isPinned ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]' : 'text-white/40 hover:text-white hover:bg-white/10'
            }`}
          >
            <Star className={`w-4 h-4 ${link.isPinned ? 'fill-amber-400/30' : ''}`} />
          </button>

          <button
            onClick={handleCopy}
            title="Copiar URL"
            className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleEdit}
            title="Editar"
            className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleDelete}
            title="Eliminar"
            className="p-1.5 rounded-md text-white/40 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
