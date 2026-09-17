import React from 'react';
import { X, Keyboard } from 'lucide-react';

export const ShortcutsModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'j', desc: 'Siguiente enlace' },
    { key: 'k', desc: 'Enlace anterior' },
    { key: 'Enter / o', desc: 'Abrir enlace seleccionado' },
    { key: 'f', desc: 'Marcar / Desmarcar favorito' },
    { key: 'e', desc: 'Editar enlace seleccionado' },
    { key: 'Backspace', desc: 'Eliminar enlace seleccionado' },
    { key: 'i / a', desc: 'Añadir nuevo enlace' },
    { key: '/', desc: 'Buscar enlaces' },
    { key: 'Esc', desc: 'Limpiar selección / Cerrar modales' },
    { key: '?', desc: 'Mostrar atajos de teclado' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-sm bg-[#111322] rounded-2xl p-6 border border-white/10 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/5 shrink-0">
              <Keyboard className="w-4 h-4 text-white/80" />
            </div>
            <h2 className="text-sm font-bold text-white">
              Atajos de Teclado (Vim)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/[0.02] last:border-0">
              <span className="text-sm text-white/60">{s.desc}</span>
              <kbd className="text-[11px] font-mono font-bold bg-white/10 text-white/90 px-2 py-1 rounded-md border border-white/10">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
