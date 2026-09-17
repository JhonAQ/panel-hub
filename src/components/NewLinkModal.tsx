'use client';

import React, { useState, useEffect } from 'react';
import { HubLink, HubFolder, IconType, AccentColor } from '@/types';
import { detectIconAndThemeFromUrl, getLinkIcon } from '@/lib/icons';
import { X, Sparkles, Plus, Check } from 'lucide-react';

interface NewLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (linkData: Partial<HubLink>) => void;
  folders: HubFolder[];
  defaultFolderId?: string;
  linkToEdit?: HubLink | null;
}

const AVAILABLE_ICONS: { type: IconType; label: string }[] = [
  { type: 'github', label: 'GitHub' },
  { type: 'drive', label: 'Drive' },
  { type: 'docs', label: 'Documentos' },
  { type: 'vercel', label: 'Vercel / Cloud' },
  { type: 'database', label: 'Database / SQL' },
  { type: 'figma', label: 'Figma' },
  { type: 'notion', label: 'Notion' },
  { type: 'youtube', label: 'YouTube' },
  { type: 'server', label: 'Servidor' },
  { type: 'terminal', label: 'Terminal / Dev' },
  { type: 'chat', label: 'Chat / Red' },
  { type: 'generic', label: 'Web Genérica' },
];

const AVAILABLE_COLORS: { color: AccentColor; label: string; bg: string }[] = [
  { color: 'cyan', label: 'Cian Neón', bg: 'bg-cyan-500' },
  { color: 'emerald', label: 'Esmeralda', bg: 'bg-emerald-500' },
  { color: 'amber', label: 'Ámbar', bg: 'bg-amber-500' },
  { color: 'violet', label: 'Violeta', bg: 'bg-violet-500' },
  { color: 'rose', label: 'Rosa Neón', bg: 'bg-rose-500' },
  { color: 'slate', label: 'Grafito', bg: 'bg-slate-500' },
];

export const NewLinkModal: React.FC<NewLinkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  folders,
  defaultFolderId,
  linkToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [folderId, setFolderId] = useState(defaultFolderId || (folders[0]?.id ?? ''));
  const [iconType, setIconType] = useState<IconType>('generic');
  const [colorTheme, setColorTheme] = useState<AccentColor>('cyan');
  const [tagsInput, setTagsInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [autoDetected, setAutoDetected] = useState(false);

  useEffect(() => {
    if (linkToEdit) {
      setTitle(linkToEdit.title);
      setUrl(linkToEdit.url);
      setDescription(linkToEdit.description || '');
      setFolderId(linkToEdit.folderId);
      setIconType(linkToEdit.iconType);
      setColorTheme(linkToEdit.colorTheme);
      setTagsInput(linkToEdit.tags?.join(', ') || '');
      setIsPinned(!!linkToEdit.isPinned);
    } else {
      setTitle('');
      setUrl('');
      setDescription('');
      setFolderId(defaultFolderId || (folders[0]?.id ?? ''));
      setIconType('generic');
      setColorTheme('cyan');
      setTagsInput('');
      setIsPinned(false);
      setAutoDetected(false);
    }
  }, [linkToEdit, isOpen, defaultFolderId, folders]);

  if (!isOpen) return null;

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);

    if (!linkToEdit && newUrl.trim().length > 3) {
      const { icon, theme } = detectIconAndThemeFromUrl(newUrl);
      setIconType(icon);
      setColorTheme(theme);
      setAutoDetected(true);

      // Suggest title if empty
      if (!title) {
        try {
          if (newUrl.includes('github.com/')) {
            const parts = newUrl.split('github.com/')[1].split('/');
            if (parts[0]) {
              setTitle(parts[1] ? `${parts[0]}/${parts[1]}` : parts[0]);
            }
          }
        } catch {
          // ignore
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !title.trim()) return;

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSave({
      id: linkToEdit?.id,
      title: title.trim(),
      url: formattedUrl,
      description: description.trim(),
      folderId: folderId || folders[0]?.id || 'general',
      iconType,
      colorTheme,
      tags,
      isPinned,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              {getLinkIcon(iconType, 'w-5 h-5')}
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                {linkToEdit ? 'Editar Recurso' : 'Nuevo Enlace o Recurso'}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Agrega accesos directos visibles en todos tus dispositivos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL Input with smart detector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-300">
                Dirección URL o Link *
              </label>
              {autoDetected && (
                <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 animate-pulse">
                  <Sparkles className="w-3 h-3" /> Tipo e ícono auto-detectados
                </span>
              )}
            </div>
            <input
              type="text"
              required
              placeholder="https://github.com/usuario/proyecto o https://drive.google.com/..."
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono text-sm transition-all"
            />
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Título del Botón *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Repositorio Principal, Drive de Contabilidad, Figma UI Kit..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Descripción Corta (Opcional)
            </label>
            <input
              type="text"
              placeholder="Breve nota sobre qué contiene o para qué sirve este acceso..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm transition-all"
            />
          </div>

          {/* Folder / Category Selection */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Carpeta o Grupo *
            </label>
            <select
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white focus:outline-none focus:border-cyan-400 text-sm"
            >
              {folders.map((f) => (
                <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                  📁 {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
              Ícono del Botón
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {AVAILABLE_ICONS.map((item) => (
                <button
                  type="button"
                  key={item.type}
                  onClick={() => setIconType(item.type)}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                    iconType === item.type
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'bg-black/30 border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {getLinkIcon(item.type, 'w-5 h-5')}
                  <span className="text-[10px] font-mono truncate max-w-full">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color theme selector */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
              Acento de Color Brutalista
            </label>
            <div className="flex flex-wrap gap-2.5">
              {AVAILABLE_COLORS.map((c) => (
                <button
                  type="button"
                  key={c.color}
                  onClick={() => setColorTheme(c.color)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                    colorTheme === c.color
                      ? 'border-white text-white shadow-md bg-white/10'
                      : 'border-white/10 text-slate-400 hover:text-white bg-black/40'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${c.bg}`} />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags & Pin Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
                Etiquetas / Tags (Separadas por comas)
              </label>
              <input
                type="text"
                placeholder="github, frontend, prod, docs"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono text-xs"
              />
            </div>

            <div className="flex items-center gap-3 self-end pb-2">
              <label className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 rounded bg-black/40 border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <span>⭐ Fijar en Favoritos</span>
              </label>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{linkToEdit ? 'Guardar Cambios' : 'Publicar Enlace'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
