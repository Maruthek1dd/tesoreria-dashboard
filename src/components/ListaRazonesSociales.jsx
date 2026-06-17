import { useState } from 'react';
import { Search } from 'lucide-react';
import { formatearARS, getCategoriaColor, filtrarPorRazonSocial } from '../lib/datos';
import { cn } from '../lib/utils';

export default function ListaRazonesSociales({ razones }) {
  const [busqueda, setBusqueda] = useState('');

  if (!razones || razones.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h2 className="text-base font-semibold text-gray-900 mb-2">Razones Sociales</h2>
        <p className="text-gray-500 text-xs">No hay datos disponibles</p>
      </div>
    );
  }

  const filtrados = filtrarPorRazonSocial(razones, busqueda);
  const maxTotal = Math.max(...razones.map(r => r.totalMonto));

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold text-gray-900">Top Proveedores</h2>
        <span className="text-[10px] text-gray-400">{filtrados.length}/{razones.length}</span>
      </div>

      <div className="relative mb-2">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          type="text"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar por razón social..."
          className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
        {filtrados.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">No se encontraron coincidencias</p>
        ) : (
          filtrados.map((rs, idx) => {
            const perfilColors = getCategoriaColor(rs.perfil);
            const progressPercent = (rs.totalMonto / maxTotal) * 100;
            const dotColor = perfilColors.dot === 'bg-red-500' ? '#ef4444' :
                            perfilColors.dot === 'bg-yellow-500' ? '#eab308' :
                            perfilColors.dot === 'bg-blue-500' ? '#3b82f6' : '#22c55e';

            return (
              <div key={idx} className="p-2 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-xs truncate" title={rs.razonSocial}>
                      {rs.razonSocial}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {rs.cantidad} cheques • {rs.promedioDias}d
                    </p>
                  </div>
                  <span className={cn("ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap", perfilColors.bg, perfilColors.text)}>
                    {rs.perfil}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex-1 mr-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${progressPercent}%`,
                          backgroundColor: dotColor
                        }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                    {formatearARS(rs.totalMonto)}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
