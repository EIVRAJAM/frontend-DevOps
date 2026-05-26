import React from 'react';
import { Badge } from './Badge';

export interface DataViewerProps {
  data: Record<string, any>;
  title?: string;
  className?: string;
}

export const DataViewer: React.FC<DataViewerProps> = ({ data, title, className = '' }) => {
  if (!data) return <p className="text-sm text-gray-500">Sin información disponible.</p>;

  const formatValue = (key: string, value: any): React.ReactNode => {
    if (value === null || value === undefined || value === '') return <span className="text-gray-600">—</span>;
    if (typeof value === 'boolean') return <Badge status={value ? 'ACTIVO' : 'INACTIVO'} />;
    if (typeof value === 'object') {
       if (Array.isArray(value)) return <span className="text-gray-300">[{value.length} elementos]</span>;
       // Si es un sub-objeto simple (como un DTO anidado), podrías expandirlo. Pero para mantenerlo limpio:
       return <span className="text-gray-400 font-mono text-xs">{JSON.stringify(value)}</span>;
    }
    
    // Attempt logic for specific keys
    if (key.toLowerCase().includes('estado')) return <Badge status={String(value)} />;
    if (key.toLowerCase().includes('fecha') || key.toLowerCase().includes('creado') || key.toLowerCase().includes('actualizado')) {
      const date = new Date(String(value));
      if (!isNaN(date.getTime())) return date.toLocaleString();
    }
    
    return String(value);
  };

  const humanizeKey = (key: string) => {
    // Convierte camelCase a Title Case separando por mayúsculas
    const spaced = key.replace(/([A-Z])/g, ' $1');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {title && <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">{title}</h3>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="bg-gray-900/40 p-3 rounded-lg border border-white/5">
            <p className="text-xs text-gray-500 mb-1">{humanizeKey(key)}</p>
            <div className="text-sm text-gray-200 break-words">{formatValue(key, value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
