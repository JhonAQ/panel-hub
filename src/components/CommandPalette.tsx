import React, { useState, useEffect, useRef, useMemo } from 'react';
import { HubLink, HubFolder } from '@/types';
import { Search, ExternalLink, Folder, Plus, Star, Link as LinkIcon, Command } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  links: HubLink[];
  folders: HubFolder[];
  onOpenLink: (link: HubLink) => void;
  onSelectFolder: (folderId: string) => void;
  onSelectView: (view: 'all' | 'favorites' | 'frequent') => void;
  onOpenNewLink: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  links,
  folders,
  onOpenLink,
  onSelectFolder,
  onSelectView,
  onOpenNewLink,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const items = useMemo(() => {
    const q = query.toLowerCase().trim();
    const result = [];

    // 1. Actions
    const actions = [
      { type: 'action', title: 'Nuevo recurso...', icon: <Plus className="w-4 h-4 text-emerald-400" />, action: onOpenNewLink },
      { type: 'action', title: 'Ir a Favoritos', icon: <Star className="w-4 h-4 text-amber-400" />, action: () => onSelectView('favorites') },
      { type: 'action', title: 'Todos los recursos', icon: <Command className="w-4 h-4 text-blue-400" />, action: () => onSelectView('all') },
    ];
    result.push(...actions.filter(a => a.title.toLowerCase().includes(q)));

    // 2. Folders
    const matchedFolders = folders.filter(f => f.name.toLowerCase().includes(q));
    result.push(...matchedFolders.map(f => ({
      type: 'folder',
      title: `Carpeta: ${f.name}`,
      icon: <Folder className="w-4 h-4 text-indigo-400" />,
      action: () => onSelectFolder(f.id)
    })));

    // 3. Links
    const matchedLinks = links.filter(l => 
      l.title.toLowerCase().includes(q) || 
      l.url.toLowerCase().includes(q) || 
      (l.description && l.description.toLowerCase().includes(q))
    );
    result.push(...matchedLinks.map(l => ({
      type: 'link',
      title: l.title,
      subtitle: l.url,
      icon: <LinkIcon className="w-4 h-4 text-white/50" />,
      action: () => onOpenLink(l)
    })));

    return result.slice(0, 20); // Limit to 20 results for performance
  }, [query, links, folders, onOpenNewLink, onSelectView, onSelectFolder]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        e.preventDefault();
      } else if (e.key === 'ArrowDown' || (e.ctrlKey && e.key === 'j')) {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
      } else if (e.key === 'ArrowUp' || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (items[selectedIndex]) {
          items[selectedIndex].action();
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, items, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#0d0f1c]/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden flex flex-col max-h-[70vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-white/5">
          <Search className="w-5 h-5 text-indigo-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar enlaces, comandos, carpetas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 text-lg font-light"
          />
          <kbd className="hidden sm:inline-block px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-white/30 ml-2">ESC</kbd>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center text-white/40 text-sm">
            No se encontraron resultados
          </div>
        ) : (
          <div ref={listRef} className="overflow-y-auto py-2">
            {items.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  item.action();
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer select-none border-l-2 ${
                  index === selectedIndex
                    ? 'bg-indigo-600/10 border-indigo-500'
                    : 'border-transparent hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-1.5 rounded-lg ${index === selectedIndex ? 'bg-indigo-500/20' : 'bg-white/5'}`}>
                    {item.icon}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className={`text-sm font-medium truncate ${index === selectedIndex ? 'text-indigo-100' : 'text-white/80'}`}>
                      {item.title}
                    </span>
                    {(item as any).subtitle && (
                      <span className="text-xs text-white/30 truncate mt-0.5">
                        {(item as any).subtitle}
                      </span>
                    )}
                  </div>
                </div>
                {index === selectedIndex && (
                  <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 ml-4 shrink-0">
                    EJECUTAR
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
