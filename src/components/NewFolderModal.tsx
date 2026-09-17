'use client';

import React, { useState, useEffect } from 'react';
import { HubFolder, AccentColor } from '@/types';
import { Folder, X, Check } from 'lucide-react';

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (folderData: Partial<HubFolder>) => void;
  folderToEdit?: HubFolder | null;
}

const AVAILABLE_COLORS: { color: AccentColor; label: string; bg: string }[] = [
  { color: 'cyan', label: 'Cian', bg: 'bg-cyan-500' },
  { color: 'emerald', label: 'Esmeralda', bg: 'bg-emerald-500' },
  { color: 'amber', label: 'Ámbar', bg: 'bg-amber-500' },
  { color: 'violet', label: 'Violeta', bg: 'bg-violet-500' },
  { color: 'rose', label: 'Rosa', bg: 'bg-rose-500' },
  { color: 'slate', label: 'Grafito', bg: 'bg-slate-500' },
];

export const NewFolderModal: React.FC<NewFolderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  folderToEdit,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<AccentColor>('cyan');

  useEffect(() => {
    if (folderToEdit) {
      setName(folderToEdit.name);
      setDescription(folderToEdit.description || '');
      setColor(folderToEdit.color);
    } else {
      setName('');
      setDescription('');
      setColor('cyan');
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
      color,
      iconName: 'folder',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                {folderToEdit ? 'Editar Carpeta' : 'Nueva Carpeta / Categoría'}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Agrupa tus recursos por área de trabajo
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Nombre de la Carpeta *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Repositorios Cliente X, Documentos Legales, DevOps..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5">
              Descripción Corta (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ej: Enlaces de uso frecuente para el proyecto tal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
              Color de Identificación
            </label>
            <div className="flex flex-wrap gap-2.5">
              {AVAILABLE_COLORS.map((c) => (
                <button
                  type="button"
                  key={c.color}
                  onClick={() => setColor(c.color)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all cursor-pointer ${
                    color === c.color
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
              <span>{folderToEdit ? 'Actualizar' : 'Crear Carpeta'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
