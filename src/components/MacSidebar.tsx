import React, { useState, useRef, useEffect } from 'react';
import { HubFolder } from '@/types';
import { 
  Folder, 
  Plus, 
  Star, 
  Layers, 
  Search, 
  Trash2,
  Edit2,
  Flame,
  LayoutGrid
} from 'lucide-react';

interface MacSidebarProps {
  folders: HubFolder[];
  selectedFolderId: string | null;
  selectedView: 'all' | 'favorites' | 'folder' | 'frequent';
  onSelectView: (view: 'all' | 'favorites' | 'folder' | 'frequent', folderId?: string | null) => void;
  onOpenNewLink: () => void;
  onCreateFolder: (name: string) => void;
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
  onCreateFolder,
  onEditFolder,
  onDeleteFolder,
  onOpenBackup,
  totalLinksCount,
  favoritesCount,
  getFolderCount,
  searchQuery,
  onSearchChange,
}) => {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('Nueva Carpeta');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCreatingFolder || editingFolderId) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isCreatingFolder, editingFolderId]);

  const handleCreateSubmit = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
    }
    setIsCreatingFolder(false);
    setNewFolderName('Nueva Carpeta');
  };

  const handleCreateKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreateSubmit();
    if (e.key === 'Escape') setIsCreatingFolder(false);
  };

  const handleEditSubmit = (folder: HubFolder) => {
    if (editingFolderName.trim() && editingFolderName.trim() !== folder.name) {
      onEditFolder({ ...folder, name: editingFolderName.trim() });
    }
    setEditingFolderId(null);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, folder: HubFolder) => {
    if (e.key === 'Enter') handleEditSubmit(folder);
    if (e.key === 'Escape') setEditingFolderId(null);
  };

  return (
    <aside className="w-72 h-full flex flex-col app-sidebar select-none shrink-0 border-r border-white/5 relative z-20">
      {/* Brand & Add Action */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            <LayoutGrid className="w-4 h-4 text-black" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white/90">Hub</span>
        </div>

        <button
          onClick={onOpenNewLink}
          className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] text-white/80 transition-all cursor-pointer"
          title="Nuevo Link (⌘N)"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Global Search */}
      <div className="px-5 pb-4">
        <div className="relative flex items-center group">
          <Search className="w-4 h-4 text-white/30 absolute left-3 pointer-events-none group-focus-within:text-white/70 transition-colors" />
          <input
            type="text"
            placeholder="Buscar enlaces..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] focus:bg-white/[0.08] text-sm text-white placeholder-white/30 border border-white/5 focus:border-white/20 focus:outline-none transition-all focus:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 text-white/40 hover:text-white text-sm"
            >
              ×
            </button>
          ) : (
            <kbd className="absolute right-3 text-[10px] text-white/20 font-mono tracking-widest border border-white/10 px-1.5 py-0.5 rounded">⌘K</kbd>
          )}
        </div>
      </div>

      {/* Navigation Tree */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-6">
        {/* Core Views */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-widest text-white/30">
            Navegación
          </div>
          <div className="space-y-1">
            <button
              onClick={() => onSelectView('all')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                selectedView === 'all' && !selectedFolderId
                  ? 'bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                  : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4" />
                <span>Todos los recursos</span>
              </div>
              <span className="text-xs text-white/30 font-mono bg-black/30 px-2 py-0.5 rounded-md">{totalLinksCount}</span>
            </button>

            <button
              onClick={() => onSelectView('favorites')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                selectedView === 'favorites'
                  ? 'bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                  : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Star className={`w-4 h-4 ${selectedView === 'favorites' ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] fill-amber-400/20' : ''}`} />
                <span>Favoritos</span>
              </div>
              <span className="text-xs text-white/30 font-mono bg-black/30 px-2 py-0.5 rounded-md">{favoritesCount}</span>
            </button>

            <button
              onClick={() => onSelectView('frequent')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                selectedView === 'frequent'
                  ? 'bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                  : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Flame className={`w-4 h-4 ${selectedView === 'frequent' ? 'text-orange-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]' : ''}`} />
                <span>Más utilizados</span>
              </div>
            </button>
          </div>
        </div>

        {/* Folders & Spaces */}
        <div>
          <div className="flex items-center justify-between px-3 pb-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-white/30">
              Carpetas
            </span>
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="Nueva carpeta"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            {folders.map((folder) => {
              const isSelected = selectedView === 'folder' && selectedFolderId === folder.id;
              const count = getFolderCount(folder.id);
              const isEditing = editingFolderId === folder.id;

              return (
                <div
                  key={folder.id}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                      : 'text-white/60 hover:bg-white/[0.04] hover:text-white'
                  }`}
                  onClick={() => !isEditing && onSelectView('folder', folder.id)}
                >
                  <div className="flex items-center gap-3 truncate flex-1">
                    <Folder className={`w-4 h-4 shrink-0 ${isSelected ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]' : 'text-white/40'}`} />
                    {isEditing ? (
                      <input
                        ref={inputRef}
                        type="text"
                        value={editingFolderName}
                        onChange={(e) => setEditingFolderName(e.target.value)}
                        onBlur={() => handleEditSubmit(folder)}
                        onKeyDown={(e) => handleEditKeyDown(e, folder)}
                        className="w-full bg-transparent border-none outline-none text-white font-medium p-0"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="truncate">{folder.name}</span>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex items-center justify-end w-16 h-6 relative shrink-0">
                      <span className="text-xs text-white/30 font-mono bg-black/30 px-2 py-0.5 rounded-md transition-opacity group-hover:opacity-0 absolute right-0">
                        {count}
                      </span>

                      {/* Quick folder action buttons */}
                      <div className="flex items-center gap-1 bg-black/40 rounded-lg p-0.5 border border-white/5 opacity-0 group-hover:opacity-100 transition-opacity absolute right-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingFolderName(folder.name);
                            setEditingFolderId(folder.id);
                          }}
                          className="p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                          title="Renombrar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`¿Eliminar la carpeta "${folder.name}"?`)) {
                              onDeleteFolder(folder.id);
                            }
                          }}
                          className="p-1.5 rounded-md text-white/50 hover:text-rose-400 hover:bg-rose-400/10 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {isCreatingFolder && (
              <div className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                <Folder className="w-4 h-4 shrink-0 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)] mr-3" />
                <input
                  ref={inputRef}
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onBlur={handleCreateSubmit}
                  onKeyDown={handleCreateKeyDown}
                  className="w-full bg-transparent border-none outline-none text-white font-medium p-0"
                />
              </div>
            )}

            {!isCreatingFolder && folders.length === 0 && (
              <div className="px-4 py-3 text-sm text-white/30 italic text-center border border-white/5 border-dashed rounded-xl m-2">
                Sin carpetas aún
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Settings/Sync */}
      <div className="p-4 mt-auto">
        <button
          onClick={onOpenBackup}
          className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-2 h-2">
              <span className="absolute w-full h-full rounded-full bg-emerald-400 opacity-20 animate-ping"></span>
              <span className="relative w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
            </div>
            <span>Sincronizado</span>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-white/30 font-bold bg-white/5 px-2 py-1 rounded">Backup</span>
        </button>
      </div>
    </aside>
  );
};
