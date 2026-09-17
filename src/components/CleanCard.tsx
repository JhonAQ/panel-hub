'use client';

import React, { useState } from 'react';
import { HubLink, HubFolder } from '@/types';
import { getCleanIcon } from '@/lib/icons';
import { 
  Copy, 
  Check, 
  Star, 
  Trash2, 
  Edit2, 
  ArrowUpRight
} from 'lucide-react';

interface CleanCardProps {
  link: HubLink;
  folder?: HubFolder;
  isFocused?: boolean;
  onOpen: (link: HubLink) => void;
  onTogglePin: (id: string) => void;
  onEdit: (link: HubLink) => void;
  onDelete: (id: string) => void;
}

export const CleanCard: React.FC<CleanCardProps> = ({
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

  return (
    <div
      id={`link-${link.id}`}
      onClick={() => onOpen(link)}
      className={`bento-card group p-6 sm:p-7 flex flex-col justify-between min-h-[200px] sm:min-h-[220px] cursor-pointer select-none h-full transition-all duration-200 ${
        isFocused ? 'ring-2 ring-indigo-500 ring-offset-4 ring-offset-[#060814] scale-[1.02] bg-[rgba(26,32,60,0.8)] shadow-[0_20px_40px_-10px_rgba(124,58,237,0.25)] border-[#7c3aed]/50' : ''
      }`}
    >
      {/* Background Watermark Icon */}
      <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none scale-[2.5] text-white">
        {getCleanIcon(link.iconType, "w-40 h-40", link.url)}
      </div>

      {/* Top section: Badge & Hover Actions */}
      <div className="relative z-10 flex justify-between items-start">
        {/* Icon Badge */}
        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-sm text-white shadow-lg overflow-hidden p-2.5">
          {getCleanIcon(link.iconType, "w-full h-full", link.url)}
        </div>

        {/* Hover Actions Bar */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:translate-y-0 bg-[#0c0f20]/90 backdrop-blur-md rounded-full border border-white/10 p-1.5 shadow-xl">
          <button
            onClick={handlePin}
            title="Favorito"
            className="p-2 rounded-full text-white/50 hover:bg-white/10 hover:text-amber-400 transition-colors"
          >
            <Star className={`w-3.5 h-3.5 ${link.isPinned ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : ''}`} />
          </button>
          <button
            onClick={handleCopy}
            title="Copiar URL"
            className="p-2 rounded-full text-white/50 hover:bg-white/10 hover:text-emerald-400 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleEdit}
            title="Editar"
            className="p-2 rounded-full text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            title="Eliminar"
            className="p-2 rounded-full text-rose-500/60 hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom section: Label, Title & Arrow */}
      <div className="relative z-10 flex justify-between items-end gap-4 mt-8">
        <div className="min-w-0 flex-1 pr-2">
          {/* Label / Folder */}
          <div className="text-[11px] font-black uppercase tracking-[0.18em] text-[#818cf8] mb-2.5 flex items-center gap-2">
            {link.isPinned && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />}
            <span className="truncate">{folder ? folder.name : 'ENLACE'}</span>
          </div>
          
          {/* Huge Title */}
          <h3 className="text-2xl sm:text-[28px] leading-[1.15] font-bold text-white tracking-tight group-hover:text-indigo-50 transition-colors drop-shadow-sm break-words">
            {link.title}
          </h3>
        </div>

        {/* Top Right Action Button */}
        <div className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center bg-white/5 text-white/50 group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:text-white transition-all shadow-xl shrink-0 group-hover:-translate-y-1 group-hover:translate-x-1 mb-1">
          <ArrowUpRight className="w-5 h-5" />
        </div>
      </div>

      {/* Copied Feedback Toast */}
      {copied && (
        <div className="absolute inset-x-6 top-6 py-2 px-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-sm font-medium text-center backdrop-blur-md animate-in fade-in z-20">
          ✓ Enlace copiado
        </div>
      )}
    </div>
  );
};
