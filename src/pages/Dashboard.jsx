import { useState, useMemo } from 'react';
import CardResumen from '../components/CardResumen';
import TablaMovimientos from '../components/TablaMovimientos';
import ListaClientes from '../components/ListaClientes';
import Proyeccion from '../components/Proyeccion';
import Alertas from '../components/Alertas';
import { 
  movimientos, 
  clientes, 
  eventosProyeccion
} from '../data/mockData';
import {
  calcularSaldoActual,
  calcularIngresoAyer,
  calcularEgresoAyer,
  calcularSaldoProyectado,
  calcularProyeccionDetallada,
  obtenerDiaNegativo,
  getColorForSaldo
} from '../lib/calculos';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const [simulacionActiva, setSimulacionActiva] = useState(false);
  
  const saldoActual = useMemo(() => calcularSaldoActual(movimientos), []);
  const ingresoAyer = useMemo(() => calcularIngresoAyer(movimientos), []);
  const egresoAyer = useMemo(() => calcularEgresoAyer(movimientos), []);
  
  const saldoProyectado = useMemo(() => 
    calcularSaldoProyectado(saldoActual, eventosProyeccion, simulacionActiva),
    [saldoActual, simulacionActiva]
  );
  
  const proyeccionDetallada = useMemo(() => 
    calcularProyeccionDetallada(saldoActual, eventosProyeccion, simulacionActiva),
    [saldoActual, simulacionActiva]
  );
  
  const alertas = useMemo(() => {
    const nuevasAlertas = [];
    
    if (saldoProyectado < 0) {
      nuevasAlertas.push({
        tipo: 'danger',
        mensaje: 'Riesgo de iliquidez: el saldo proyectado a 30 días es negativo'
      });
    }
    
    if (egresoAyer > ingresoAyer) {
      nuevasAlertas.push({
        tipo: 'warning',
        mensaje: 'Atención: los egresos de ayer superaron los ingresos'
      });
    }
    
    const clientesAgresivos = clientes.filter(c => c.perfil === 'Agresivo');
    if (clientesAgresivos.length > 0) {
      nuevasAlertas.push({
        tipo: 'warning',
        mensaje: `Clientes con comportamiento agresivo detectados: ${clientesAgresivos.map(c => c.nombre).join(', ')}`
      });
    }
    
    const diaNegativo = obtenerDiaNegativo(proyeccionDetallada);
    if (diaNegativo !== null) {
      nuevasAlertas.push({
        tipo: 'warning',
        mensaje: `Alerta: el saldo entra en zona negativa el día ${diaNegativo}`
      });
    }
    
    return nuevasAlertas;
  }, [saldoProyectado, egresoAyer, ingresoAyer, proyeccionDetallada]);
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tesorería Dashboard</h1>
            <p className="text-gray-500 text-sm">Gestión de liquidez empresarial</p>
          </div>
          <button
            onClick={() => setSimulacionActiva(!simulacionActiva)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium text-sm transition-colors",
              simulacionActiva 
                ? "bg-red-100 text-red-700 hover:bg-red-200" 
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {simulacionActiva ? 'Desactivar simulación' : 'Simular retiros altos'}
          </button>
        </div>
        
        <Alertas alertas={alertas} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <CardResumen 
            label="Saldo actual" 
            valor={saldoActual} 
            sub="Al día de hoy"
            color={getColorForSaldo(saldoActual)}
          />
          <CardResumen 
            label="Egresos ayer" 
            valor={egresoAyer} 
            sub="Último día registrado"
            color="red"
          />
          <CardResumen 
            label="Ingresos ayer" 
            valor={ingresoAyer} 
            sub="Último día registrado"
            color="green"
          />
          <CardResumen 
            label="Saldo proyectado (30 días)" 
            valor={saldoProyectado} 
            sub={simulacionActiva ? 'Con simulación activa' : 'Sin simulación'}
            color={getColorForSaldo(saldoProyectado)}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <Proyeccion 
            proyeccion={proyeccionDetallada}
            saldoActual={saldoActual}
            simulacion={simulacionActiva}
          />
          <ListaClientes clientes={clientes} />
        </div>
        
        <div className="mt-4">
          <TablaMovimientos movimientos={movimientos} />
        </div>
      </div>
    </div>
  );
}