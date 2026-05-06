import { cn } from '../lib/utils';

export default function Alertas({ alertas }) {
  if (alertas.length === 0) return null;
  
  return (
    <div className="space-y-2">
      {alertas.map((alerta, idx) => (
        <div 
          key={idx}
          className={cn(
            "p-4 rounded-lg text-sm font-medium",
            alerta.tipo === 'danger' ? "bg-red-50 text-red-700 border border-red-200" : "bg-amber-50 text-amber-700 border border-amber-200"
          )}
        >
          {alerta.mensaje}
        </div>
      ))}
    </div>
  );
}