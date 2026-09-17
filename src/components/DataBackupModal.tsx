'use client';

import React, { useRef, useState } from 'react';
import { HubData } from '@/types';
import { Download, Upload, RefreshCw, X, ShieldCheck, Database, Check } from 'lucide-react';

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

    setSuccessMsg('✓ Copia de seguridad exportada correctamente');
    setTimeout(() => setSuccessMsg(null), 3000);
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
          setSuccessMsg('✓ Datos importados exitosamente');
          setTimeout(() => setSuccessMsg(null), 3000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">
                Sincronización y Respaldo
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Portabilidad entre dispositivos y copias
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

        {/* Sync Status Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3">
          <ShieldCheck className={`w-6 h-6 ${syncStatus === 'synced' ? 'text-emerald-400' : 'text-amber-400'}`} />
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-white">
              {syncStatus === 'synced' ? 'Servidor Conectado y Sincronizado' : 'Guardando cambios...'}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              Tus enlaces quedan guardados en el servidor para abrirlos desde cualquier PC o móvil.
            </div>
          </div>
        </div>

        {/* Action cards */}
        <div className="space-y-3">
          {/* Export button */}
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-400/50 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 group-hover:scale-105 transition-transform">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">Descargar Respaldo JSON</span>
                <span className="text-xs text-slate-400 font-mono">Guarda tus links en un archivo local</span>
              </div>
            </div>
          </button>

          {/* Import button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-400/50 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 group-hover:scale-105 transition-transform">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">Importar desde Archivo JSON</span>
                <span className="text-xs text-slate-400 font-mono">Restaura enlaces de otra máquina</span>
              </div>
            </div>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          {/* Reset button */}
          <button
            onClick={() => {
              if (confirm('¿Restablecer PanelHub con los accesos y categorías iniciales?')) {
                onResetData();
                setSuccessMsg('✓ Se restableció la configuración base');
                setTimeout(() => setSuccessMsg(null), 3000);
              }
            }}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] hover:bg-rose-500/10 border border-white/5 hover:border-rose-500/30 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-300 group-hover:text-rose-300 block">Restablecer Ejemplos Demo</span>
                <span className="text-xs text-slate-500 font-mono">Vuelve a la colección por defecto</span>
              </div>
            </div>
          </button>
        </div>

        {/* Feedback message */}
        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono text-center animate-in fade-in">
            {successMsg}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
