'use client';

import React, { useRef, useState } from 'react';
import { HubData } from '@/types';
import { Download, Upload, RefreshCw, X, ShieldCheck, Database } from 'lucide-react';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  hubData: HubData;
  onImportData: (newData: HubData) => void;
  onResetData: () => void;
  syncStatus: 'synced' | 'saving' | 'error';
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({
  isOpen,
  onClose,
  hubData,
  onImportData,
  onResetData,
  syncStatus,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(hubData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute(
      'download',
      `panelhub-backup-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setSuccessMsg('Respaldo JSON descargado');
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content) as HubData;
        if (Array.isArray(parsed.folders) && Array.isArray(parsed.links)) {
          onImportData(parsed);
          setSuccessMsg('Datos importados correctamente');
          setTimeout(() => setSuccessMsg(null), 2500);
        } else {
          alert('El archivo no tiene el formato válido de PanelHub.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-sm bg-[#16161a] rounded-2xl p-6 border border-white/10 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-white/70" />
            <h2 className="text-sm font-semibold text-white">
              Sincronización y Respaldo
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sync Status Banner */}
        <div className="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full shrink-0 ${syncStatus === 'synced' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          <div className="text-xs text-white/70">
            {syncStatus === 'synced' ? 'Sincronizado con el servidor' : 'Guardando cambios...'}
          </div>
        </div>

        {/* Action list */}
        <div className="space-y-2">
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Download className="w-4 h-4 text-white/60" />
              <span className="text-xs text-white/90">Descargar copia de seguridad (.json)</span>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Upload className="w-4 h-4 text-white/60" />
              <span className="text-xs text-white/90">Restaurar desde archivo JSON</span>
            </div>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => {
              if (confirm('¿Restablecer los datos demo iniciales?')) {
                onResetData();
                setSuccessMsg('Datos restablecidos');
                setTimeout(() => setSuccessMsg(null), 2500);
              }
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-rose-500/10 text-white/40 hover:text-rose-300 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4" />
              <span className="text-xs">Restablecer ejemplos</span>
            </div>
          </button>
        </div>

        {successMsg && (
          <div className="mt-3 p-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs text-center">
            {successMsg}
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
