'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { HubData, HubLink, HubFolder } from '@/types';
import { INITIAL_HUB_DATA } from '@/data/defaultData';
import { MacSidebar } from '@/components/MacSidebar';
import { CleanCard } from '@/components/CleanCard';
import { CleanRow } from '@/components/CleanRow';
import { NewLinkModal } from '@/components/NewLinkModal';
import { NewFolderModal } from '@/components/NewFolderModal';
import { DataBackupModal } from '@/components/DataBackupModal';
import { ShortcutsModal } from '@/components/ShortcutsModal';
import { CommandPalette } from '@/components/CommandPalette';
import { 
  Folder, 
  Plus, 
  LayoutGrid, 
  List, 
  Star, 
  Flame, 
  Layers,
  ChevronRight,
  ExternalLink,
  SearchX,
  Menu
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'panelhub_data_cache';

export default function HomePage() {
  const [hubData, setHubData] = useState<HubData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) return JSON.parse(cached);
      } catch (e) {
        console.error('Error parsing cached data', e);
      }
    }
    return INITIAL_HUB_DATA;
  });
  const [loading, setLoading] = useState(false); // No loading state needed for instant render
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'error'>('synced');
  
  // Navigation & View state
  const [selectedView, setSelectedView] = useState<'all' | 'favorites' | 'folder' | 'frequent'>('all');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(true);
  const [editingLink, setEditingLink] = useState<HubLink | null>(null);
  const [editingFolder, setEditingFolder] = useState<HubFolder | null>(null);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          try {
            setHubData(JSON.parse(cached));
          } catch (e) {
            console.error('Error parsing cached data', e);
          }
        }

        const res = await fetch('/api/hub');
        if (res.ok) {
          const serverData: HubData = await res.json();
          if (serverData && Array.isArray(serverData.links)) {
            setHubData(serverData);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serverData));
          }
        }
      } catch (err) {
        console.warn('Using local cache:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Global Keyboard Shortcuts (Cmd+N, Cmd+Shift+N, Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key.toLowerCase() === 'k') {
          e.preventDefault();
          setIsCommandPaletteOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  // Persist helper
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

  // Folders map
  const folderMap = useMemo(() => {
    const map = new Map<string, HubFolder>();
    hubData.folders.forEach((f) => map.set(f.id, f));
    return map;
  }, [hubData.folders]);

  const favoritesCount = useMemo(() => {
    return hubData.links.filter((l) => l.isPinned).length;
  }, [hubData.links]);

  const getFolderCount = (folderId: string) => {
    return hubData.links.filter((l) => l.folderId === folderId).length;
  };

  // Displayed links
  const displayedLinks = useMemo(() => {
    let result = hubData.links;

    // View filter
    if (selectedView === 'favorites') {
      result = result.filter((l) => l.isPinned);
    } else if (selectedView === 'folder' && selectedFolderId) {
      result = result.filter((l) => l.folderId === selectedFolderId);
    } else if (selectedView === 'frequent') {
      result = [...result].sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0));
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((l) => {
        const titleMatch = l.title.toLowerCase().includes(q);
        const urlMatch = l.url.toLowerCase().includes(q);
        const descMatch = l.description?.toLowerCase().includes(q);
        const folderName = folderMap.get(l.folderId)?.name.toLowerCase() || '';
        return titleMatch || urlMatch || descMatch || folderName.includes(q);
      });
    }

    return result;
  }, [hubData.links, selectedView, selectedFolderId, searchQuery, folderMap]);

  // Reset selection when displayed links change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [displayedLinks]);

  // Keyboard Navigation (Vim-style)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not hijack system combos like Ctrl+L or Cmd+R
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      const activeEl = document.activeElement;
      const isInputFocused = activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA' || activeEl?.tagName === 'SELECT';

      if (isInputFocused) {
        if (e.key === 'Escape') {
          (activeEl as HTMLElement).blur();
        }
        return;
      }

      if (isLinkModalOpen || isFolderModalOpen || isBackupModalOpen || isShortcutsModalOpen || isCommandPaletteOpen) {
        if (e.key === 'Escape') {
          setIsLinkModalOpen(false);
          setIsFolderModalOpen(false);
          setIsBackupModalOpen(false);
          setIsShortcutsModalOpen(false);
          setIsCommandPaletteOpen(false);
        }
        return;
      }

      const cols = viewMode === 'list' ? 1 : (window.innerWidth >= 1280 ? 4 : (window.innerWidth >= 1024 ? 3 : (window.innerWidth >= 640 ? 2 : 1)));
      switch (e.key.toLowerCase()) {
        case 'j':
        case 'arrowdown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min((prev < 0 ? 0 : prev) + cols, displayedLinks.length - 1));
          break;
        case 'k':
        case 'arrowup':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max((prev < 0 ? 0 : prev) - cols, 0));
          break;
        case 'l':
        case 'arrowright':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, displayedLinks.length - 1));
          break;
        case 'h':
        case 'arrowleft':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'c':
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('open-new-folder'));
          break;
        case 'enter':
        case 'o':
          if (selectedIndex >= 0 && displayedLinks[selectedIndex]) {
            handleOpenLink(displayedLinks[selectedIndex]);
          }
          break;
        case 'f':
          if (selectedIndex >= 0 && displayedLinks[selectedIndex]) {
            handleTogglePin(displayedLinks[selectedIndex].id);
          }
          break;
        case 'e':
          e.preventDefault();
          if (selectedIndex >= 0 && displayedLinks[selectedIndex]) {
            setEditingLink(displayedLinks[selectedIndex]);
            setIsLinkModalOpen(true);
          }
          break;
        case 'backspace':
        case 'delete':
          if (selectedIndex >= 0 && displayedLinks[selectedIndex]) {
            if (confirm(`¿Eliminar "${displayedLinks[selectedIndex].title}"?`)) {
              handleDeleteLink(displayedLinks[selectedIndex].id);
              setSelectedIndex((prev) => Math.max(prev - 1, 0));
            }
          }
          break;
        case 'i':
        case 'a':
          e.preventDefault();
          setEditingLink(null);
          setIsLinkModalOpen(true);
          break;
        case '/':
          e.preventDefault();
          setIsCommandPaletteOpen(true);
          break;
        case '?':
          e.preventDefault();
          setIsShortcutsModalOpen(true);
          break;
        case 'escape':
          setSelectedIndex(-1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayedLinks, selectedIndex, isLinkModalOpen, isFolderModalOpen, isBackupModalOpen, isShortcutsModalOpen]);

  // Scroll active item into view
  useEffect(() => {
    if (selectedIndex >= 0 && displayedLinks[selectedIndex]) {
      const el = document.getElementById(`link-${displayedLinks[selectedIndex].id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedIndex, displayedLinks]);

  // Handlers
  const handleOpenLink = (link: HubLink) => {
    const updatedLinks = hubData.links.map((l) =>
      l.id === link.id ? { ...l, clickCount: (l.clickCount || 0) + 1 } : l
    );
    persistData({ ...hubData, links: updatedLinks });
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
      const updatedLinks = hubData.links.map((l) =>
        l.id === linkData.id ? ({ ...l, ...linkData, updatedAt: new Date().toISOString() } as HubLink) : l
      );
      persistData({ ...hubData, links: updatedLinks });
    } else {
      const newLink: HubLink = {
        id: `link-${Date.now()}`,
        title: linkData.title || 'Nuevo Enlace',
        url: linkData.url || '',
        description: linkData.description,
        folderId: linkData.folderId || selectedFolderId || hubData.folders[0]?.id || 'general',
        iconType: linkData.iconType || 'generic',
        colorTheme: 'cyan',
        isPinned: !!linkData.isPinned,
        clickCount: 0,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      persistData({ ...hubData, links: [newLink, ...hubData.links] });
    }
  };

  const handleSaveFolder = (folderData: Partial<HubFolder>) => {
    if (folderData.id) {
      const updatedFolders = hubData.folders.map((f) =>
        f.id === folderData.id ? ({ ...f, ...folderData } as HubFolder) : f
      );
      persistData({ ...hubData, folders: updatedFolders });
    } else {
      const newFolder: HubFolder = {
        id: `folder-${Date.now()}`,
        name: folderData.name || 'Nueva Carpeta',
        description: folderData.description,
        color: 'slate',
        iconName: 'folder',
        order: hubData.folders.length + 1,
      };
      persistData({ ...hubData, folders: [...hubData.folders, newFolder] });
      setSelectedView('folder');
      setSelectedFolderId(newFolder.id);
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    const updatedFolders = hubData.folders.filter((f) => f.id !== folderId);
    if (selectedFolderId === folderId) {
      setSelectedView('all');
      setSelectedFolderId(null);
    }
    persistData({ ...hubData, folders: updatedFolders });
  };

  const handleSelectView = (view: 'all' | 'favorites' | 'folder' | 'frequent', folderId?: string | null) => {
    setSelectedView(view);
    setSelectedFolderId(folderId || null);
  };

  const activeFolder = selectedFolderId ? folderMap.get(selectedFolderId) : null;

  return (
    <div suppressHydrationWarning className="flex h-screen w-screen overflow-hidden bg-[#060814] text-[#f3f4f6] relative">
      <div className="bg-glow-blobs" />
      
      {/* App Sidebar */}
      {sidebarOpen && (
        <MacSidebar
          folders={hubData.folders}
          selectedFolderId={selectedFolderId}
          selectedView={selectedView}
          onSelectView={handleSelectView}
          onOpenNewLink={() => {
            setEditingLink(null);
            setIsLinkModalOpen(true);
          }}
          onCreateFolder={(name) => handleSaveFolder({ name })}
          onEditFolder={(folder) => handleSaveFolder(folder)}
          onDeleteFolder={handleDeleteFolder}
          onOpenBackup={() => setIsBackupModalOpen(true)}
          totalLinksCount={hubData.links.length}
          favoritesCount={favoritesCount}
          getFolderCount={getFolderCount}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}

      {/* Main Workspace Canvas */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-transparent overflow-hidden">
        {/* Workspace Top Toolbar */}
        <header className="h-20 border-b border-white/[0.04] px-8 flex items-center justify-between shrink-0 select-none bg-transparent z-10">
          {/* Breadcrumb / Title */}
          <div className="flex items-center gap-3 text-sm min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 mr-1 transition-colors"
              title="Alternar barra lateral"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="font-extrabold tracking-tight text-white/90 text-lg">PanelHub</span>
            <span className="text-white/20 font-light text-xl">/</span>
            
            <div className="flex items-center gap-2 font-semibold text-indigo-200 truncate text-base">
              {selectedView === 'favorites' ? (
                <>
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                  <span>Favoritos</span>
                </>
              ) : selectedView === 'frequent' ? (
                <>
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>Más utilizados</span>
                </>
              ) : activeFolder ? (
                <>
                  <Folder className="w-3.5 h-3.5 text-blue-400" />
                  <span className="truncate">{activeFolder.name}</span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5 text-white/60" />
                  <span>Todos los recursos</span>
                </>
              )}
            </div>

            <span className="text-[11px] text-white/30 font-mono ml-1">
              ({displayedLinks.length})
            </span>
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 bg-white/[0.04] border border-white/[0.06] rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
                }`}
                title="Vista de cuadrícula (Tarjetas)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
                }`}
                title="Vista de lista compacta"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Add Link Button */}
            <button
              onClick={() => {
                setEditingLink(null);
                setIsLinkModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#6366f1] hover:bg-[#7c3aed] transition-all cursor-pointer shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] group"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              <span>Agregar</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          {displayedLinks.length === 0 ? (
            /* Clean Empty State */
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <p className="text-xs text-white/40 mb-3">
                {searchQuery ? `No hay resultados para "${searchQuery}"` : 'Esta sección no tiene recursos todavía.'}
              </p>
              <button
                onClick={() => {
                  setEditingLink(null);
                  setIsLinkModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/80 bg-white/10 hover:bg-white/15 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar recurso</span>
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Minimalist Notion / macOS Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {displayedLinks.map((link, index) => (
                <CleanCard
                  key={link.id}
                  link={link}
                  folder={folderMap.get(link.folderId)}
                  isFocused={index === selectedIndex}
                  onOpen={handleOpenLink}
                  onTogglePin={handleTogglePin}
                  onEdit={(l) => {
                    setEditingLink(l);
                    setIsLinkModalOpen(true);
                  }}
                  onDelete={handleDeleteLink}
                />
              ))}
            </div>
          ) : (
            /* Clean Minimalist List View */
            <div className="max-w-4xl space-y-1">
              {displayedLinks.map((link, index) => (
                <CleanRow
                  key={link.id}
                  link={link}
                  folder={folderMap.get(link.folderId)}
                  isFocused={index === selectedIndex}
                  onOpen={handleOpenLink}
                  onTogglePin={handleTogglePin}
                  onEdit={(l) => {
                    setEditingLink(l);
                    setIsLinkModalOpen(true);
                  }}
                  onDelete={handleDeleteLink}
                />
              ))}
            </div>
          )}
        </div>
      </main>

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
        onImportData={persistData}
        onResetData={() => persistData(INITIAL_HUB_DATA)}
        syncStatus={syncStatus}
      />

      <ShortcutsModal 
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        links={hubData.links}
        folders={hubData.folders}
        onOpenLink={handleOpenLink}
        onSelectFolder={(folderId) => handleSelectView('folder', folderId)}
        onSelectView={handleSelectView}
        onOpenNewLink={() => {
          setEditingLink(null);
          setIsLinkModalOpen(true);
        }}
      />
    </div>
  );
}
