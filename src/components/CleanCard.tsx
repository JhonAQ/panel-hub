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
  Folder,
  Flame
} from 'lucide-react';

interface CleanCardProps {
  link: HubLink;
  folder?: HubFolder;
  onOpen: (link: HubLink) => void;
  onTogglePin: (id: string) => void;
  onEdit: (link: HubLink) => void;
  onDelete: (id: string) => void;
}

export const CleanCard: React.FC<CleanCardProps> = ({
  link,
  folder,
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

  const domain = extractDomain(link.url);

  return (
    <div
      onClick={() => onOpen(link)}
      className="group relative flex flex-col justify-between p-4 rounded-xl notion-card cursor-pointer select-none"
    >
      <div>
        {/* Top: Icon & Actions */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="w-10 h-10 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-white/90 group-hover:text-white group-hover:bg-white/[0.08] transition-colors shrink-0">
            {getCleanIcon(link.iconType, "w-5 h-5")}
          </div>

          {/* Hover Action Menu */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-[#141418] border border-white/10 rounded-lg p-0.5 shadow-md">
            <button
              onClick={handlePin}
              title={link.isPinned ? "Quitar de favoritos" : "Marcar favorito"}
              className={`p-1.5 rounded-md transition-colors ${
                link.isPinned 
                  ? 'text-amber-400 bg-amber-400/10' 
                  : 'text-white/40 hover:text-white hover:bg-white/10'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${link.isPinned ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={handleCopy}
              title="Copiar link"
              className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
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
              className="p-1.5 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleDelete}
              title="Eliminar"
              className="p-1.5 rounded-md text-white/40 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title & Domain */}
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-medium text-white/90 group-hover:text-white transition-colors truncate">
              {link.title}
            </h3>
            <ExternalLink className="w-3 h-3 text-white/30 group-hover:text-white/70 transition-colors shrink-0 opacity-0 group-hover:opacity-100" />
          </div>

          {link.description && (
            <p className="text-xs text-white/45 mt-1 line-clamp-2 leading-relaxed">
              {link.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer Info: Domain & Folder */}
      <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-white/40">
        <span className="font-mono truncate max-w-[150px]">
          {domain}
        </span>

        <div className="flex items-center gap-2 shrink-0">
          {folder && (
            <span className="flex items-center gap-1 text-white/40">
              <Folder className="w-3 h-3" />
              <span className="truncate max-w-[90px]">{folder.name}</span>
            </span>
          )}

          {link.clickCount > 0 && (
            <span className="flex items-center gap-0.5 text-white/30 font-mono text-[10px]">
              <Flame className="w-2.5 h-2.5 text-orange-400/80" />
              {link.clickCount}
            </span>
          )}
        </div>
      </div>

      {/* Copied Feedback Toast */}
      {copied && (
        <div className="absolute inset-x-3 bottom-2 py-1 px-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-mono text-center backdrop-blur-md animate-in fade-in">
          ✓ Copiado
        </div>
      )}
    </div>
  );
};
