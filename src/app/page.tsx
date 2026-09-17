'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { HubData, HubLink, HubFolder } from '@/types';
import { INITIAL_HUB_DATA } from '@/data/defaultData';
import { HubHeader } from '@/components/HubHeader';
import { FolderNav } from '@/components/FolderNav';
import { LinkCard } from '@/components/LinkCard';
import { LinkListItem } from '@/components/LinkListItem';
import { NewLinkModal } from '@/components/NewLinkModal';
import { NewFolderModal } from '@/components/NewFolderModal';
import { DataBackupModal } from '@/components/DataBackupModal';
import { 
  Sparkles, 
  Pin, 
  Plus, 
  FolderPlus, 
  SearchX, 
  ExternalLink,
  Laptop,
  CheckCircle2,
  Share2,
  FolderOpen
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'panelhub_data_cache';

export default function HomePage() {
  const [hubData, setHubData] = useState<HubData>(INITIAL_HUB_DATA);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error'>('synced');
  
  // Filtering & View state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [showOnlyPinned, setShowOnlyPinned] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals state
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<HubLink | null>(null);
  const [editingFolder, setEditingFolder] = useState<HubFolder | null>(null);

  // Load initial data from Server API + fallback to LocalStorage
  useEffect(() => {
    async function loadData() {
      try {
        // Try local storage cache first for instant render
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          try {
            setHubData(JSON.parse(cached));
          } catch (e) {
            console.error('Error parsing cached data', e);
          }
        }

        // Fetch authoritative server data
        const res = await fetch('/api/hub');
        if (res.ok) {
          const serverData: HubData = await res.json();
          if (serverData && Array.isArray(serverData.links)) {
            setHubData(serverData);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serverData));
          }
        }
      } catch (err) {
        console.warn('Using local cache / initial data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Save to server API & localStorage helper
  const persistData = async (newData: HubData) => {
    setHubData(newData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
    setSyncStatus('saving');

    try {
      const res = await fetch('/api/hub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });

      if (res.ok) {
        setSyncStatus('synced');
      } else {
        setSyncStatus('error');
      }
    } catch (err) {
      console.error('Failed to sync to server:', err);
      setSyncStatus('error');
    }
  };

  // Folders map for fast lookup
  const folderMap = useMemo(() => {
    const map = new Map<string, HubFolder>();
    hubData.folders.forEach((f) => map.set(f.id, f));
    return map;
  }, [hubData.folders]);

  // Counts
  const pinnedCount = useMemo(() => {
    return hubData.links.filter((l) => l.isPinned).length;
  }, [hubData.links]);

  const getFolderLinkCount = (folderId: string) => {
    return hubData.links.filter((l) => l.folderId === folderId).length;
  };

  // Filtered links
  const filteredLinks = useMemo(() => {
    let result = hubData.links;

    // Filter by Folder
    if (selectedFolderId) {
      result = result.filter((l) => l.folderId === selectedFolderId);
    }

    // Filter by Pinned
    if (showOnlyPinned) {
      result = result.filter((l) => l.isPinned);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((l) => {
        const titleMatch = l.title.toLowerCase().includes(q);
        const urlMatch = l.url.toLowerCase().includes(q);
        const descMatch = l.description?.toLowerCase().includes(q);
        const tagMatch = l.tags?.some((t) => t.toLowerCase().includes(q));
        const folderName = folderMap.get(l.folderId)?.name.toLowerCase() || '';
        const folderMatch = folderName.includes(q);
        return titleMatch || urlMatch || descMatch || tagMatch || folderMatch;
      });
    }

    return result;
  }, [hubData.links, selectedFolderId, showOnlyPinned, searchQuery, folderMap]);

  // Handlers
  const handleOpenLink = (link: HubLink) => {
    // Increment click count
    const updatedLinks = hubData.links.map((l) =>
      l.id === link.id ? { ...l, clickCount: (l.clickCount || 0) + 1 } : l
    );
    persistData({ ...hubData, links: updatedLinks });

    // Open link in new tab
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const handleTogglePin = (id: string) => {
    const updatedLinks = hubData.links.map((l) =>
      l.id === id ? { ...l, isPinned: !l.isPinned } : l
    );
    persistData({ ...hubData, links: updatedLinks });
  };

  const handleDeleteLink = (id: string) => {
    const updatedLinks = hubData.links.filter((l) => l.id !== id);
    persistData({ ...hubData, links: updatedLinks });
  };

  const handleSaveLink = (linkData: Partial<HubLink>) => {
    if (linkData.id) {
      // Edit
      const updatedLinks = hubData.links.map((l) =>
        l.id === linkData.id ? ({ ...l, ...linkData, updatedAt: new Date().toISOString() } as HubLink) : l
      );
      persistData({ ...hubData, links: updatedLinks });
    } else {
      // Create new
      const newLink: HubLink = {
        id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        title: linkData.title || 'Nuevo Enlace',
        url: linkData.url || '',
        description: linkData.description,
        folderId: linkData.folderId || hubData.folders[0]?.id || 'general',
        iconType: linkData.iconType || 'generic',
        colorTheme: linkData.colorTheme || 'cyan',
        isPinned: !!linkData.isPinned,
        clickCount: 0,
        tags: linkData.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      persistData({ ...hubData, links: [newLink, ...hubData.links] });
    }
  };

  const handleSaveFolder = (folderData: Partial<HubFolder>) => {
    if (folderData.id) {
      // Edit
      const updatedFolders = hubData.folders.map((f) =>
        f.id === folderData.id ? ({ ...f, ...folderData } as HubFolder) : f
      );
      persistData({ ...hubData, folders: updatedFolders });
    } else {
      // Create new
      const newFolder: HubFolder = {
        id: `folder-${Date.now()}`,
        name: folderData.name || 'Nueva Carpeta',
        description: folderData.description,
        color: folderData.color || 'cyan',
        iconName: 'folder',
        order: hubData.folders.length + 1,
      };
      persistData({ ...hubData, folders: [...hubData.folders, newFolder] });
      setSelectedFolderId(newFolder.id);
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    const updatedFolders = hubData.folders.filter((f) => f.id !== folderId);
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
    }
    persistData({ ...hubData, folders: updatedFolders });
  };

  const handleImportData = (newData: HubData) => {
    persistData(newData);
  };

  const handleResetData = () => {
    persistData(INITIAL_HUB_DATA);
  };

  // Group links for display when browsing "Todos" without active search
  const pinnedLinks = useMemo(() => {
    return hubData.links.filter((l) => l.isPinned);
  }, [hubData.links]);

  const activeFolder = selectedFolderId ? folderMap.get(selectedFolderId) : null;

  return (
    <div className="min-h-screen flex flex-col selection:bg-cyan-400 selection:text-black">
      {/* Header */}
      <HubHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenNewLinkModal={() => {
          setEditingLink(null);
          setIsLinkModalOpen(true);
        }}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        totalLinks={hubData.links.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome / Device Sync Callout */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl glass-panel border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide flex items-center gap-2">
                Panel Central Multi-Dispositivo
                <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                  Activo
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Cualquier link o carpeta que agregues aquí estará disponible mañana cuando abras esta URL desde tu otra PC, laptop o móvil.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => {
                setEditingLink(null);
                setIsLinkModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-400/15 hover:bg-cyan-400/25 text-cyan-300 border border-cyan-400/30 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Link</span>
            </button>
          </div>
        </div>

        {/* Folder Navigation Bar */}
        <FolderNav
          folders={hubData.folders}
          selectedFolderId={selectedFolderId}
          showOnlyPinned={showOnlyPinned}
          totalLinksCount={hubData.links.length}
          pinnedLinksCount={pinnedCount}
          getFolderLinkCount={getFolderLinkCount}
          onSelectFolder={setSelectedFolderId}
          onTogglePinnedFilter={() => {
            setShowOnlyPinned(!showOnlyPinned);
            setSelectedFolderId(null);
          }}
          onOpenNewFolderModal={() => {
            setEditingFolder(null);
            setIsFolderModalOpen(true);
          }}
          onEditFolder={(folder) => {
            setEditingFolder(folder);
            setIsFolderModalOpen(true);
          }}
          onDeleteFolder={handleDeleteFolder}
        />

        {/* Section Heading / Active Context */}
        <div className="flex items-center justify-between mt-6 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              {showOnlyPinned ? (
                <>
                  <Pin className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Accesos Fijados y Favoritos</span>
                </>
              ) : activeFolder ? (
                <>
                  <FolderOpen className="w-4 h-4 text-cyan-400" />
                  <span>{activeFolder.name}</span>
                </>
              ) : searchQuery ? (
                <span>Resultados para "{searchQuery}"</span>
              ) : (
                <span>Todos los Recursos ({filteredLinks.length})</span>
              )}
            </h2>

            {activeFolder?.description && (
              <span className="hidden md:inline text-xs text-slate-500 font-mono">
                — {activeFolder.description}
              </span>
            )}
          </div>

          <span className="text-xs font-mono text-slate-500">
            {filteredLinks.length} {filteredLinks.length === 1 ? 'enlace' : 'enlaces'}
          </span>
        </div>

        {/* Content Area: Grid or List */}
        {filteredLinks.length === 0 ? (
          /* Empty state */
          <div className="glass-panel rounded-3xl p-12 text-center my-8 border border-white/10 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 mb-4">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              No se encontraron recursos
            </h3>
            <p className="text-xs text-slate-400 font-mono max-w-sm mb-6">
              {searchQuery
                ? `No hay enlaces que coincidan con la búsqueda "${searchQuery}". Intenta con otro término o limpia el buscador.`
                : 'Esta carpeta aún no tiene ningún enlace registrado.'}
            </p>
            <div className="flex items-center gap-3">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl bg-white/10 text-xs font-mono uppercase text-white hover:bg-white/20 transition-all cursor-pointer"
                >
                  Limpiar Búsqueda
                </button>
              )}
              <button
                onClick={() => {
                  setEditingLink(null);
                  setIsLinkModalOpen(true);
                }}
                className="px-5 py-2 rounded-xl bg-cyan-400 text-black text-xs font-mono uppercase font-bold hover:bg-cyan-300 transition-all cursor-pointer shadow-lg"
              >
                + Crear Primer Enlace
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          /* Large Launchpad Buttons Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5">
            {filteredLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                folder={folderMap.get(link.folderId)}
                onOpen={handleOpenLink}
                onTogglePin={handleTogglePin}
                onEdit={(link) => {
                  setEditingLink(link);
                  setIsLinkModalOpen(true);
                }}
                onDelete={handleDeleteLink}
              />
            ))}
          </div>
        ) : (
          /* Compact List View */
          <div className="space-y-2">
            {filteredLinks.map((link) => (
              <LinkListItem
                key={link.id}
                link={link}
                folder={folderMap.get(link.folderId)}
                onOpen={handleOpenLink}
                onTogglePin={handleTogglePin}
                onEdit={(link) => {
                  setEditingLink(link);
                  setIsLinkModalOpen(true);
                }}
                onDelete={handleDeleteLink}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden z-30">
        <button
          onClick={() => {
            setEditingLink(null);
            setIsLinkModalOpen(true);
          }}
          className="w-14 h-14 rounded-full bg-cyan-400 text-black font-black flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.6)] border-2 border-white/40 cursor-pointer active:scale-95 transition-transform"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-white/5 text-center font-mono text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold">PANELHUB</span>
            <span>//</span>
            <span>Estación Central de Accesos</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Sincronización Local + Servidor</span>
            <span>•</span>
            <button 
              onClick={() => setIsBackupModalOpen(true)}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Exportar / Importar
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <NewLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => {
          setIsLinkModalOpen(false);
          setEditingLink(null);
        }}
        onSave={handleSaveLink}
        folders={hubData.folders}
        defaultFolderId={selectedFolderId || undefined}
        linkToEdit={editingLink}
      />

      <NewFolderModal
        isOpen={isFolderModalOpen}
        onClose={() => {
          setIsFolderModalOpen(false);
          setEditingFolder(null);
        }}
        onSave={handleSaveFolder}
        folderToEdit={editingFolder}
      />

      <DataBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        hubData={hubData}
        onImportData={handleImportData}
        onResetData={handleResetData}
        syncStatus={syncStatus}
      />
    </div>
  );
}
