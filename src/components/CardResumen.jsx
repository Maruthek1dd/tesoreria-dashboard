import { formatearARS } from '../data/mockData';
import { getColorClass } from '../lib/calculos';
import { cn } from '../lib/utils';

export default function CardResumen({ label, valor, sub, color }) {
  const colorClass = color ? getColorClass(color) : 'text-gray-900';
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={cn("text-2xl font-semibold", colorClass)}>
        {formatearARS(valor)}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}