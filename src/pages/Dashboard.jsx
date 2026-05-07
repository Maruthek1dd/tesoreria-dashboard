import CardResumen from '../components/CardResumen';
import SerieTemporal from '../components/SerieTemporal';
import ListaRazonesSociales from '../components/ListaRazonesSociales';
import ChequesNoCobrados from '../components/ChequesNoCobrados';
import { movimientos } from '../data/mockData';
import {
  obtenerUltimoSaldo,
  contarChequesNoCobrados,
  totalChequesNoCobrados,
  getColorForSaldo,
  calcularSerieTemporal,
  calcularVelocidadCobroPorRazonSocial,
  obtenerChequesNoCobrados
} from '../lib/calculos';

export default function Dashboard() {
  const ultimoSaldo = obtenerUltimoSaldo(movimientos);
  const chequesNoCobradosCount = contarChequesNoCobrados(movimientos);
  const chequesNoCobradosTotal = totalChequesNoCobrados(movimientos);
  const saldoProyectado = ultimoSaldo - chequesNoCobradosTotal;
  
  const serieTemporal = calcularSerieTemporal(movimientos);
  const razonesSociales = calcularVelocidadCobroPorRazonSocial(movimientos);
  const chequesNoCobradosData = obtenerChequesNoCobrados(movimientos);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tesorería Dashboard</h1>
          <p className="text-gray-500 text-sm">Gestión de liquidez empresarial</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <CardResumen 
            label="Último saldo" 
            valor={ultimoSaldo} 
            sub="Balance actual de cuenta"
            color={getColorForSaldo(ultimoSaldo)}
          />
          <CardResumen 
            label="Cheques no cobrados" 
            valor={chequesNoCobradosTotal} 
            sub={`${chequesNoCobradosCount} chequeras pendientes`}
            color="neutral"
          />
          <CardResumen 
            label="Saldo proyectado" 
            valor={saldoProyectado} 
            sub="Si todos cobran su cheque"
            color={getColorForSaldo(saldoProyectado)}
          />
        </div>
        
        <div className="mb-4">
          <SerieTemporal data={serieTemporal} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ListaRazonesSociales razones={razonesSociales} />
          <ChequesNoCobrados data={chequesNoCobradosData} />
        </div>
      </div>
    </div>
  );
}