import { useState } from 'react';
import { Search } from 'lucide-react';
import { formatearARS, formatearFecha, filtrarPorRazonSocial } from '../lib/datos';

export default function ChequesNoCobrados({ data }) {
  const [busqueda, setBusqueda] = useState('');

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h2 className="text-base font-semibold text-gray-900 mb-2">Cheques No Cobrados</h2>
        <p className="text-gray-500 text-xs">No hay cheques pendientes</p>
      </div>
    );
  }

  const filtrados = filtrarPorRazonSocial(data, busqueda);

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold text-gray-900">Cheques No Cobrados</h2>
        <span className="text-[10px] text-gray-400">{filtrados.length}/{data.length}</span>
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

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filtrados.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-4">No se encontraron coincidencias</p>
        ) : (
          filtrados.map((grupo, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-2">
              <h3 className="font-semibold text-gray-900 text-xs mb-1 truncate" title={grupo.razonSocial}>
                {grupo.razonSocial}
              </h3>
              <div className="space-y-0.5">
                {grupo.cheques.map((cheque, cIdx) => (
                  <div
                    key={cIdx}
                    className="flex justify-between items-center text-xs px-1.5 py-0.5"
                  >
                    <span className="text-gray-700">{formatearARS(cheque.monto)}</span>
                    <span className="text-[10px] text-gray-400">{formatearFecha(cheque.fechaAcreditacion)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-1 pt-1 border-t border-gray-100 flex justify-between font-medium text-xs">
                <span className="text-gray-600">Total:</span>
                <span className="text-gray-900">{formatearARS(grupo.total)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
