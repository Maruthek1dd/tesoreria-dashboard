import { formatearARS, getCategoriaColor } from '../lib/datos';
import { cn } from '../lib/utils';

export default function ListaRazonesSociales({ razones }) {
  if (!razones || razones.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Razones Sociales</h2>
        <p className="text-gray-500">No hay datos disponibles</p>
      </div>
    );
  }

  const maxTotal = Math.max(...razones.map(r => r.totalMonto));

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Proveedores</h2>
      <div className="space-y-3">
        {razones.map((rs, idx) => {
          const perfilColors = getCategoriaColor(rs.perfil);
          const progressPercent = (rs.totalMonto / maxTotal) * 100;
          const dotColor = perfilColors.dot === 'bg-red-500' ? '#ef4444' : 
                          perfilColors.dot === 'bg-yellow-500' ? '#eab308' : 
                          perfilColors.dot === 'bg-blue-500' ? '#3b82f6' : '#22c55e';

          return (
            <div key={idx} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900 truncate" title={rs.razonSocial}>
                    {rs.razonSocial}
                  </p>
                  <p className="text-xs text-gray-500">
                    {rs.cantidad} cheques • promedio {rs.promedioDias} días
                  </p>
                </div>
                <span className={cn("px-2 py-1 rounded-full text-xs font-medium", perfilColors.bg, perfilColors.text)}>
                  <span className={cn("inline-block w-2 h-2 rounded-full mr-1", perfilColors.dot)}></span>
                  {rs.perfil}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex-1 mr-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full"
                      style={{ 
                        width: `${progressPercent}%`, 
                        backgroundColor: dotColor
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {formatearARS(rs.totalMonto)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}