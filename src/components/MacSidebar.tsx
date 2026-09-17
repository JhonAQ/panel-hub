'use client';

import React from 'react';
import { HubFolder } from '@/types';
import { 
  Folder, 
  Plus, 
  Star, 
  Layers, 
  Search, 
  Download, 
  Upload, 
  MoreHorizontal,
  ChevronRight,
  Sparkles,
  Command,
  Trash2,
  Edit2,
  Flame,
  Globe
} from 'lucide-react';

interface MacSidebarProps {
  folders: HubFolder[];
  selectedFolderId: string | null;
  selectedView: 'all' | 'favorites' | 'folder' | 'frequent';
  onSelectView: (view: 'all' | 'favorites' | 'folder' | 'frequent', folderId?: string | null) => void;
  onOpenNewLink: () => void;
  onOpenNewFolder: () => void;
  onEditFolder: (folder: HubFolder) => void;
  onDeleteFolder: (folderId: string) => void;
  onOpenBackup: () => void;
  totalLinksCount: number;
  favoritesCount: number;
  getFolderCount: (id: string) => number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const MacSidebar: React.FC<MacSidebarProps> = ({
  folders,
  selectedFolderId,
  selectedView,
  onSelectView,
  onOpenNewLink,
  onOpenNewFolder,
  onEditFolder,
  onDeleteFolder,
  onOpenBackup,
  totalLinksCount,
  favoritesCount,
  getFolderCount,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <aside className="w-64 h-full flex flex-col macos-sidebar select-none shrink-0 border-r border-white/5">
      {/* macOS Traffic lights & Brand */}
      <div className="p-4 pb-3 flex items-center justify-between border-b border-white/[0.04]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block hover:opacity-80 transition-opacity" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block hover:opacity-80 transition-opacity" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block hover:opacity-80 transition-opacity" />
          </div>
        </div>

        <button
          onClick={onOpenNewLink}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-white/90 bg-white/10 hover:bg-white/15 transition-all cursor-pointer"
          title="Nuevo Link (⌘N)"
        >
          <Plus className="w-3.5 h-3.5 text-white/70" />
          <span>Nuevo</span>
        </button>
      </div>

      {/* Notion-like Search */}
      <div className="px-3 pt-3 pb-2">
        <div className="relative flex items-center">
          <Search className="w-3.5 h-3.5 text-white/40 absolute left-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.09] text-xs text-white placeholder-white/40 border border-transparent focus:border-white/20 focus:outline-none transition-all"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 text-white/40 hover:text-white text-xs"
            >
              ×
            </button>
          ) : (
            <kbd className="absolute right-2 text-[10px] text-white/30 font-mono">⌘K</kbd>
          )}
        </div>
      </div>

      {/* Navigation Tree */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4">
        {/* Core Views */}
        <div>
          <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/35">
            General
          </div>
          <div className="space-y-0.5 mt-0.5">
            <button
              onClick={() => onSelectView('all')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-normal transition-colors cursor-pointer ${
                selectedView === 'all' && !selectedFolderId
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/70 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-white/50" />
                <span>Todos los recursos</span>
              </div>
              <span className="text-[11px] text-white/40 font-mono">{totalLinksCount}</span>
            </button>

            <button
              onClick={() => onSelectView('favorites')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-normal transition-colors cursor-pointer ${
                selectedView === 'favorites'
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/70 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400/30" />
                <span>Favoritos</span>
              </div>
              <span className="text-[11px] text-white/40 font-mono">{favoritesCount}</span>
            </button>

            <button
              onClick={() => onSelectView('frequent')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-normal transition-colors cursor-pointer ${
                selectedView === 'frequent'
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/70 hover:bg-white/[0.05] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Más utilizados</span>
              </div>
            </button>
          </div>
        </div>

        {/* Folders & Spaces */}
        <div>
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/35">
              Carpetas
            </span>
            <button
              onClick={onOpenNewFolder}
              className="p-1 rounded text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Nueva carpeta"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5 mt-0.5">
            {folders.map((folder) => {
              const isSelected = selectedView === 'folder' && selectedFolderId === folder.id;
              const count = getFolderCount(folder.id);

              return (
                <div
                  key={folder.id}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-white/10 text-white font-medium'
                      : 'text-white/70 hover:bg-white/[0.05] hover:text-white'
                  }`}
                  onClick={() => onSelectView('folder', folder.id)}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Folder className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-400' : 'text-white/50'}`} />
                    <span className="truncate">{folder.name}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[11px] text-white/40 font-mono group-hover:hidden">
                      {count}
                    </span>

                    {/* Quick folder action buttons */}
                    <div className="hidden group-hover:flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditFolder(folder);
                        }}
                        className="p-1 rounded text-white/40 hover:text-white transition-colors"
                        title="Renombrar"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`¿Eliminar la carpeta "${folder.name}"?`)) {
                            onDeleteFolder(folder.id);
                          }
                        }}
                        className="p-1 rounded text-white/40 hover:text-rose-400 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {folders.length === 0 && (
              <div className="px-3 py-2 text-xs text-white/30 italic">
                Sin carpetas
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer: Multi-device sync indicator & Backups */}
      <div className="p-3 border-t border-white/[0.04] bg-white/[0.01]">
        <button
          onClick={onOpenBackup}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Multi-dispositivo</span>
          </div>
          <span className="text-[10px] text-white/40">Nube & JSON</span>
        </button>
      </div>
    </aside>
  );
};
