import { formatearARS } from '../data/mockData';
import { cn } from '../lib/utils';

function getDiaLabel(dia) {
  if (dia === 0) return 'Hoy';
  if (dia === 1) return 'Mañana';
  return `+${dia} días`;
}

export default function Proyeccion({ proyeccion, saldoActual, simulacion }) {
  const saldoFinal = proyeccion.length > 0 
    ? proyeccion[proyeccion.length - 1].saldoAcumulado 
    : saldoActual;
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Proyección 30 días</h2>
      </div>
      
      {simulacion && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
          Modo simulación activo — egresos aumentados 80%
        </div>
      )}
      
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-gray-500">Saldo actual</span>
          <span className={cn("font-semibold", saldoActual >= 0 ? "text-green-600" : "text-red-600")}>
            {formatearARS(saldoActual)}
          </span>
        </div>
        
        {proyeccion.map((evento, idx) => (
          <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <span className={cn("w-2 h-2 rounded-full", evento.saldoAcumulado >= 0 ? "bg-green-500" : "bg-red-500")}></span>
              <span className="text-gray-600">{getDiaLabel(evento.dia)}</span>
            </div>
            <div className="flex-1 px-3">
              <span className="text-sm text-gray-700">{evento.descripcion}</span>
            </div>
            <div className="text-right">
              <span className={cn("text-sm font-medium", evento.tipo === 'ingreso' ? "text-green-600" : "text-red-600")}>
                {evento.tipo === 'ingreso' ? '+' : '-'}{formatearARS(evento.monto)}
              </span>
              <span className={cn("block text-xs", evento.saldoAcumulado >= 0 ? "text-gray-500" : "text-red-500")}>
                saldo: {formatearARS(evento.saldoAcumulado)}
              </span>
            </div>
          </div>
        ))}
        
        <div className="flex justify-between items-center py-3 bg-gray-50 rounded-lg mt-4 px-3">
          <span className="font-semibold text-gray-700">Saldo proyectado (30 días)</span>
          <span className={cn("text-xl font-bold", saldoFinal >= 0 ? "text-green-600" : "text-red-600")}>
            {formatearARS(saldoFinal)}
          </span>
        </div>
      </div>
    </div>
  );
}