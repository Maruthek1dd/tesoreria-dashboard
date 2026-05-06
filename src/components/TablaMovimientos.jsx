import { useState, useMemo } from 'react';
import { formatearARS } from '../data/mockData';
import { cn } from '../lib/utils';

function formatFecha(date) {
  const d = new Date(date);
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function TablaMovimientos({ movimientos }) {
  const [filtro, setFiltro] = useState('todos');
  
  const movimientosOrdenados = useMemo(() => {
    return [...movimientos].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }, [movimientos]);
  
  const movimientosFiltrados = useMemo(() => {
    if (filtro === 'todos') return movimientosOrdenados;
    return movimientosOrdenados.filter(m => m.tipo.toLowerCase() === filtro);
  }, [movimientosOrdenados, filtro]);
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Movimientos</h2>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="todos">Todos</option>
          <option value="ingreso">Ingresos</option>
          <option value="egreso">Egresos</option>
        </select>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 text-gray-500 font-medium">Fecha</th>
              <th className="text-left py-3 text-gray-500 font-medium">Tipo</th>
              <th className="text-left py-3 text-gray-500 font-medium">Cliente</th>
              <th className="text-right py-3 text-gray-500 font-medium">Monto</th>
              <th className="text-center py-3 text-gray-500 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {movimientosFiltrados.map((mov) => (
              <tr key={mov.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 text-gray-600">{formatFecha(mov.fecha)}</td>
                <td className="py-3">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    mov.tipo === 'Ingreso' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  )}>
                    {mov.tipo}
                  </span>
                </td>
                <td className="py-3 text-gray-700">{mov.cliente}</td>
                <td className={cn("py-3 text-right font-medium", 
                  mov.tipo === 'Ingreso' ? "text-green-600" : "text-red-600")}>
                  {mov.tipo === 'Ingreso' ? '+' : '-'}{formatearARS(mov.monto)}
                </td>
                <td className="py-3 text-center">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    mov.estado === 'Pagado' ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-700"
                  )}>
                    {mov.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}