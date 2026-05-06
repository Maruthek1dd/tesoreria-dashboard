import { formatearARS } from '../data/mockData';
import { getPerfilColor } from '../lib/calculos';
import { cn } from '../lib/utils';

export default function ListaClientes({ clientes }) {
  const maxTotal = Math.max(...clientes.map(c => c.totalRetirado));
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Clientes</h2>
      <div className="space-y-4">
        {clientes.map((cliente) => {
          const perfilColors = getPerfilColor(cliente.perfil);
          const progressPercent = (cliente.totalRetirado / maxTotal) * 100;
          
          return (
            <div key={cliente.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">{cliente.nombre}</p>
                  <p className="text-xs text-gray-500">
                    {cliente.frecuenciaRetiro} • promedio {formatearARS(cliente.montoPromedio)}
                  </p>
                </div>
                <span className={cn("px-2 py-1 rounded-full text-xs font-medium", perfilColors.bg, perfilColors.text)}>
                  <span className={cn("inline-block w-2 h-2 rounded-full mr-1", perfilColors.dot)}></span>
                  {cliente.perfil}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex-1 mr-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={cn("h-2 rounded-full", perfilColors.dot.replace('bg-', 'bg-opacity-80 bg-'))} 
                      style={{ width: `${progressPercent}%`, backgroundColor: perfilColors.dot === 'bg-red-500' ? '#ef4444' : perfilColors.dot === 'bg-yellow-500' ? '#eab308' : '#22c55e' }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {formatearARS(cliente.totalRetirado)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}