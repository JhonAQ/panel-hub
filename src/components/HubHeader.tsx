'use client';

import React, { useRef, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Database, 
  LayoutGrid, 
  List, 
  Sparkles,
  Command,
  Laptop
} from 'lucide-react';

interface HubHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNewLinkModal: () => void;
  onOpenBackupModal: () => void;
  viewMode: 'grid' | 'list';
  onToggleViewMode: (mode: 'grid' | 'list') => void;
  totalLinks: number;
}

export const HubHeader: React.FC<HubHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenNewLinkModal,
  onOpenBackupModal,
  viewMode,
  onToggleViewMode,
  totalLinks,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K or / to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement !== searchInputRef.current && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 shadow-2xl backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand Logo & Cloud Status */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-mono font-black text-black text-lg shadow-[0_0_20px_rgba(6,182,212,0.5)] border border-white/20">
                P/H
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black tracking-tight text-white uppercase font-mono">
                    PANEL<span className="text-cyan-400">HUB</span>
                  </h1>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    v1.0
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Sincronizado Multi-dispositivo</span>
                </div>
              </div>
            </div>

            {/* Mobile Actions Quick Trigger */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={onOpenNewLinkModal}
                className="p-2.5 rounded-xl bg-cyan-400 text-black font-bold"
                title="Nuevo Enlace"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Buscar por nombre, carpeta, url o #tag..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 rounded-2xl bg-black/50 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-all shadow-inner"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 rounded-md">
                <Command className="w-3 h-3" /> K
              </kbd>
            </div>
          </div>

          {/* Action buttons & View toggles */}
          <div className="hidden md:flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-black/40 border border-white/10 rounded-xl">
              <button
                onClick={() => onToggleViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Vista de Botones Grandes (Launchpad)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onToggleViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Vista de Lista Compacta"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Backup / Cloud sync */}
            <button
              onClick={onOpenBackupModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
              title="Respaldo y Estado de Sincronización"
            >
              <Database className="w-4 h-4 text-violet-400" />
              <span>Nube & Respaldo</span>
            </button>

            {/* New Link Button */}
            <button
              onClick={onOpenNewLinkModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold font-mono text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.35)] transition-all transform hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Nuevo Enlace</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
