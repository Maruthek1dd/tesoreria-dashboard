import { formatearARS, formatearFecha } from '../lib/datos';

function getDiasRestantesClass(dias) {
  if (dias === null || dias === undefined) return 'normal';
  if (dias < 0) return 'vencido';
  if (dias <= 3) return 'urgente';
  if (dias <= 7) return 'alerta';
  return 'normal';
}

export default function ChequesNoCobrados({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Cheques No Cobrados</h2>
        <p className="text-gray-500">No hay cheques pendientes</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Cheques No Cobrados</h2>
      <div className="space-y-4 max-h-[500px] overflow-y-auto">
        {data.map((grupo, idx) => (
          <div key={idx} className="border border-gray-200 rounded-lg p-3">
            <h3 className="font-semibold text-gray-900 mb-2 truncate" title={grupo.razonSocial}>
              {grupo.razonSocial}
            </h3>
            <div className="space-y-1">
              {grupo.cheques.map((cheque, cIdx) => {
                const diasClass = getDiasRestantesClass(cheque.diasRestantes);
                const diasText = cheque.diasRestantes === null 
                  ? formatearFecha(cheque.fechaAcreditacion)
                  : diasClass === 'vencido'
                    ? 'Vencido'
                    : diasClass === 'urgente'
                      ? `${cheque.diasRestantes}d (urgente)`
                      : `${cheque.diasRestantes} días`;
                
                return (
                  <div 
                    key={cIdx}
                    className={`flex justify-between items-center text-sm px-2 py-1 rounded ${
                      diasClass === 'urgente' ? 'bg-orange-50' :
                      diasClass === 'alerta' ? 'bg-yellow-50' :
                      diasClass === 'vencido' ? 'bg-red-50' :
                      ''
                    }`}
                  >
                    <span className="text-gray-700">
                      {formatearARS(cheque.monto)}
                    </span>
                    <span className={`text-xs ml-2 ${
                      diasClass === 'vencido' ? 'text-red-600 font-medium' :
                      diasClass === 'urgente' ? 'text-orange-600 font-medium' :
                      diasClass === 'alerta' ? 'text-yellow-600' :
                      'text-gray-400'
                    }`}>
                      {diasText}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between font-medium">
              <span className="text-gray-600">Total:</span>
              <span className="text-gray-900">{formatearARS(grupo.total)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}