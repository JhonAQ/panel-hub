'use client';

import React from 'react';
import { HubFolder } from '@/types';
import { 
  Folder, 
  FolderPlus, 
  Layers, 
  Pin, 
  MoreVertical,
  Trash2,
  Edit2
} from 'lucide-react';
import { ACCENT_STYLES } from '@/lib/icons';

interface FolderNavProps {
  folders: HubFolder[];
  selectedFolderId: string | null; // null means 'all'
  showOnlyPinned: boolean;
  totalLinksCount: number;
  pinnedLinksCount: number;
  getFolderLinkCount: (folderId: string) => number;
  onSelectFolder: (folderId: string | null) => void;
  onTogglePinnedFilter: () => void;
  onOpenNewFolderModal: () => void;
  onEditFolder: (folder: HubFolder) => void;
  onDeleteFolder: (folderId: string) => void;
}

export const FolderNav: React.FC<FolderNavProps> = ({
  folders,
  selectedFolderId,
  showOnlyPinned,
  totalLinksCount,
  pinnedLinksCount,
  getFolderLinkCount,
  onSelectFolder,
  onTogglePinnedFilter,
  onOpenNewFolderModal,
  onEditFolder,
  onDeleteFolder
}) => {
  return (
    <div className="w-full flex items-center justify-between gap-3 overflow-x-auto pb-2 pt-1 border-b border-white/5 scrollbar-thin">
      <div className="flex items-center gap-2">
        {/* All Links Tab */}
        <button
          onClick={() => {
            if (showOnlyPinned) onTogglePinnedFilter();
            onSelectFolder(null);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-all cursor-pointer select-none whitespace-nowrap border ${
            selectedFolderId === null && !showOnlyPinned
              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
              : 'bg-white/[0.03] text-slate-400 border-white/5 hover:text-white hover:bg-white/[0.07]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Todos</span>
          <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-black/40 text-slate-300 border border-white/5">
            {totalLinksCount}
          </span>
        </button>

        {/* Pinned Tab */}
        <button
          onClick={onTogglePinnedFilter}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-all cursor-pointer select-none whitespace-nowrap border ${
            showOnlyPinned
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'bg-white/[0.03] text-slate-400 border-white/5 hover:text-white hover:bg-white/[0.07]'
          }`}
        >
          <Pin className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>Fijados</span>
          <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-black/40 text-slate-300 border border-white/5">
            {pinnedLinksCount}
          </span>
        </button>

        <div className="h-5 w-[1px] bg-white/10 mx-1 shrink-0" />

        {/* Folder items */}
        {folders.map((folder) => {
          const count = getFolderLinkCount(folder.id);
          const isSelected = selectedFolderId === folder.id && !showOnlyPinned;
          const styles = ACCENT_STYLES[folder.color] || ACCENT_STYLES.cyan;

          return (
            <div
              key={folder.id}
              className="relative group/folder flex items-center shrink-0"
            >
              <button
                onClick={() => {
                  if (showOnlyPinned) onTogglePinnedFilter();
                  onSelectFolder(folder.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-all cursor-pointer select-none whitespace-nowrap border ${
                  isSelected
                    ? `${styles.badgeBg} ${styles.badgeText} ${styles.badgeBorder} shadow-lg`
                    : 'bg-white/[0.03] text-slate-400 border-white/5 hover:text-white hover:bg-white/[0.07]'
                }`}
              >
                <Folder className="w-4 h-4" />
                <span>{folder.name}</span>
                <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] bg-black/40 text-slate-300 border border-white/5">
                  {count}
                </span>
              </button>

              {/* Quick actions for folder (edit / delete) on hover */}
              <div className="hidden group-hover/folder:flex items-center gap-1 ml-1 bg-black/80 backdrop-blur-md px-1 py-0.5 rounded-lg border border-white/10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditFolder(folder);
                  }}
                  title="Editar carpeta"
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`¿Eliminar la carpeta "${folder.name}"? Los enlaces asociados quedarán sin carpeta.`)) {
                      onDeleteFolder(folder.id);
                    }
                  }}
                  title="Eliminar carpeta"
                  className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Folder Button */}
      <button
        onClick={onOpenNewFolderModal}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-xs uppercase tracking-wider text-slate-400 hover:text-cyan-300 bg-white/[0.02] hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 transition-all shrink-0 cursor-pointer"
        title="Crear nueva carpeta o categoría"
      >
        <FolderPlus className="w-4 h-4" />
        <span className="hidden sm:inline">Nueva Carpeta</span>
      </button>
    </div>
  );
};
