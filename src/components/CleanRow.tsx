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
  onOpen: (link: HubLink) => void;
  onTogglePin: (id: string) => void;
  onEdit: (link: HubLink) => void;
  onDelete: (id: string) => void;
}

export const CleanRow: React.FC<CleanRowProps> = ({
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

  return (
    <div
      onClick={() => onOpen(link)}
      className="group flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/[0.05] transition-colors cursor-pointer select-none border-b border-white/[0.02]"
    >
      <div className="flex items-center gap-3 min-w-0 pr-4">
        <div className="text-white/60 group-hover:text-white transition-colors shrink-0">
          {getCleanIcon(link.iconType, "w-4 h-4")}
        </div>

        <span className="text-xs font-medium text-white/90 group-hover:text-white truncate">
          {link.title}
        </span>

        {link.description && (
          <span className="hidden sm:inline text-xs text-white/40 truncate max-w-[240px]">
            — {link.description}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {folder && (
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-white/40 font-mono">
            <Folder className="w-3 h-3" />
            {folder.name}
          </span>
        )}

        <span className="text-[11px] text-white/30 font-mono truncate max-w-[120px]">
          {extractDomain(link.url)}
        </span>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handlePin}
            title={link.isPinned ? "Quitar de favoritos" : "Marcar favorito"}
            className={`p-1 rounded transition-colors ${
              link.isPinned ? 'text-amber-400' : 'text-white/40 hover:text-white'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${link.isPinned ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={handleCopy}
            title="Copiar URL"
            className="p-1 rounded text-white/40 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleEdit}
            title="Editar"
            className="p-1 rounded text-white/40 hover:text-white transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleDelete}
            title="Eliminar"
            className="p-1 rounded text-white/40 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
