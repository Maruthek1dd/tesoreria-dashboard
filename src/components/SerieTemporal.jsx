import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatearARS, formatearFechaCorta } from '../lib/datos';

export default function SerieTemporal({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Evolución de movimientos</h2>
        <p className="text-gray-500">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Evolución de movimientos</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="fecha" 
            tickFormatter={formatearFechaCorta}
            stroke="#9ca3af"
            fontSize={12}
          />
          <YAxis 
            tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            stroke="#9ca3af"
            fontSize={12}
          />
          <Tooltip 
            formatter={(value, name) => [
              formatearARS(value), 
              name === 'ingreso' ? 'Ingresos' : name === 'egreso' ? 'Egresos' : name
            ]}
            labelFormatter={formatearFechaCorta}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="ingreso" 
            name="Movimientos"
            stroke="#22c55e" 
            strokeWidth={2}
            dot={{ fill: '#22c55e', r: 4 }}
            activeDot={{ r: 6 }}
          />
       
          )
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}