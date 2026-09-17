'use client';

import React, { useState, useEffect } from 'react';
import { HubLink, HubFolder, IconType } from '@/types';
import { detectIconFromUrl, getCleanIcon } from '@/lib/icons';
import { X, Check, Globe } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);

    if (!linkToEdit && newUrl.trim().length > 3) {
      const detected = detectIconFromUrl(newUrl);
      setIconType(detected);

      // Auto suggest title if empty
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-[#16161a] rounded-2xl p-6 border border-white/10 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="text-white/80">
              {getCleanIcon(iconType, "w-5 h-5")}
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
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-medium text-white/50 mb-1">
              URL del enlace *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="https://github.com/... o https://drive.google.com/..."
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-white/30 text-xs font-mono transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-white/50 mb-1">
              Nombre o Título *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Repositorio Principal, Drive Contabilidad..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-white/30 text-xs transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-white/50 mb-1">
              Carpeta
            </label>
            <select
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#111114] border border-white/10 text-white focus:outline-none focus:border-white/30 text-xs"
            >
              {folders.map((f) => (
                <option key={f.id} value={f.id} className="bg-[#111114] text-white">
                  📁 {f.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-white/50 mb-1">
              Nota o descripción (opcional)
            </label>
            <input
              type="text"
              placeholder="Detalle breve..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-white/30 text-xs transition-colors"
            />
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-black/40 border-white/20 text-blue-500 focus:ring-0"
              />
              <span>Fijar en Favoritos</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-medium text-black bg-white hover:bg-white/90 transition-colors cursor-pointer"
            >
              {linkToEdit ? 'Guardar' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
