'use client';

import React, { useState, useEffect } from 'react';
import { HubLink, HubFolder, IconType } from '@/types';
import { detectIconFromUrl, getCleanIcon } from '@/lib/icons';
import { X, Check, Globe, Star } from 'lucide-react';

interface NewLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (linkData: Partial<HubLink>) => void;
  folders: HubFolder[];
  defaultFolderId?: string;
  linkToEdit?: HubLink | null;
}

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
  const [isPinned, setIsPinned] = useState(false);

  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (linkToEdit) {
      setTitle(linkToEdit.title);
      setUrl(linkToEdit.url);
      setDescription(linkToEdit.description || '');
      setFolderId(linkToEdit.folderId);
      setIconType(linkToEdit.iconType);
      setIsPinned(!!linkToEdit.isPinned);
    } else {
      setTitle('');
      setUrl('');
      setDescription('');
      setFolderId(defaultFolderId || (folders[0]?.id ?? ''));
      setIconType('generic');
      setIsPinned(false);
    }
  }, [linkToEdit, isOpen, defaultFolderId, folders]);

  const fetchMetadata = async (targetUrl: string) => {
    if (!targetUrl.startsWith('http')) return;
    setIsFetching(true);
    try {
      const res = await fetch(`/api/metadata?url=${encodeURIComponent(targetUrl)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.title && !title) setTitle(data.title);
        if (data.description && !description) setDescription(data.description);
      }
    } catch (e) {
      console.error('Failed to fetch metadata:', e);
    } finally {
      setIsFetching(false);
    }
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);

    if (newUrl.trim().length > 3) {
      setIconType(detectIconFromUrl(newUrl));
    }
  };

  const handleUrlBlur = () => {
    if (!linkToEdit && url && !title) {
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }
      fetchMetadata(formattedUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !title.trim()) return;

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    onSave({
      id: linkToEdit?.id,
      title: title.trim(),
      url: formattedUrl,
      description: description.trim(),
      folderId: folderId || folders[0]?.id || 'general',
      iconType,
      colorTheme: 'cyan',
      tags: [],
      isPinned,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-[#111322] rounded-2xl p-6 border border-white/10 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/5 p-1.5 shrink-0 overflow-hidden">
              {getCleanIcon(iconType, "w-full h-full text-white/80", url)}
            </div>
            <h2 className="text-sm font-semibold text-white">
              {linkToEdit ? 'Editar recurso' : 'Nuevo recurso'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex justify-between items-end mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-300/80">
                URL del enlace *
              </label>
              {!linkToEdit && url && (
                <button 
                  type="button" 
                  onClick={() => handleUrlBlur()} 
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium bg-indigo-500/10 px-2 py-0.5 rounded flex items-center gap-1"
                >
                  {isFetching ? 'Buscando...' : '✨ Auto-completar'}
                </button>
              )}
            </div>
            <input
              type="text"
              required
              autoFocus
              placeholder="Ej: https://github.com/..."
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              onBlur={handleUrlBlur}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] text-sm font-mono transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-300/80 mb-1.5">
              Nombre o Título *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Repositorio Principal..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-300/80 mb-1.5">
              Carpeta
            </label>
            <select
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-indigo-500/50 text-sm transition-all appearance-none"
            >
              {folders.map((f) => (
                <option key={f.id} value={f.id} className="bg-[#111322] text-white">
                  📁 {f.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-indigo-300/80 mb-1.5">
              Descripción (opcional)
            </label>
            <textarea
              placeholder="Detalle breve..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:shadow-[0_0_15px_rgba(99,102,241,0.2)] text-sm transition-all resize-none"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer select-none group w-max">
              <div className="relative flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="w-5 h-5 rounded bg-black/50 border border-white/10 peer-checked:bg-amber-400 peer-checked:border-amber-400 transition-all flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 text-[#111322] opacity-0 peer-checked:opacity-100 fill-current" />
                </div>
              </div>
              <span className="group-hover:text-white transition-colors">Fijar en Favoritos</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all cursor-pointer"
            >
              {linkToEdit ? 'Guardar Cambios' : 'Agregar Recurso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
