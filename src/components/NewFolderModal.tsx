'use client';

import React, { useState, useEffect } from 'react';
import { HubFolder } from '@/types';
import { Folder, X } from 'lucide-react';

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (folderData: Partial<HubFolder>) => void;
  folderToEdit?: HubFolder | null;
}

export const NewFolderModal: React.FC<NewFolderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  folderToEdit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (folderToEdit) {
      setName(folderToEdit.name);
      setDescription(folderToEdit.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [folderToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: folderToEdit?.id,
      name: name.trim(),
      description: description.trim(),
      color: 'slate',
      iconName: 'folder',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-sm bg-[#16161a] rounded-2xl p-6 border border-white/10 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-white">
              {folderToEdit ? 'Editar carpeta' : 'Nueva carpeta'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-medium text-white/50 mb-1">
              Nombre de la carpeta *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="Ej: Proyectos 2026, Trabajo, Personal..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-white/30 text-xs transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-white/50 mb-1">
              Descripción corta (opcional)
            </label>
            <input
              type="text"
              placeholder="Detalle de los enlaces que contendrá..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white placeholder-white/25 focus:outline-none focus:border-white/30 text-xs transition-colors"
            />
          </div>

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
              {folderToEdit ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
