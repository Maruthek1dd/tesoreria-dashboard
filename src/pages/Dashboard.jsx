import CardResumen from '../components/CardResumen';
import SerieTemporal from '../components/SerieTemporal';
import ListaRazonesSociales from '../components/ListaRazonesSociales';
import ChequesNoCobrados from '../components/ChequesNoCobrados';
import { useResumen, useSinCobrar, useProveedores, useChequesCobrados } from '../hooks/useDashboardData';
import { 
  formatearARS, 
  calcularSerieTemporalDesdeCobrados, 
  getColorForSaldo,
  getChequesQueVencenManana,
  getChequesQueVencenEstaSemana
} from '../lib/datos';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

function ErrorDisplay({ error, onRetry }) {
  return (
    <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
      <p><strong>Error:</strong> {error}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
        >
          Reintentar
        </button>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { data: resumenData, loading: resumenLoading, error: resumenError, refetch: refetchResumen } = useResumen();
  const { data: sinCobrarData, loading: sinCobrarLoading, error: sinCobrarError, refetch: refetchSinCobrar } = useSinCobrar();
  const { data: proveedoresData, loading: proveedoresLoading, error: proveedoresError, refetch: refetchProveedores } = useProveedores();
  const { data: chequesCobradosData, loading: cobradosLoading, error: cobradosError, refetch: refetchCobrados } = useChequesCobrados();

  const loading = resumenLoading || sinCobrarLoading || proveedoresLoading || cobradosLoading;
  const error = resumenError || sinCobrarError || proveedoresError || cobradosError;

  if (loading && !resumenData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Tesorería Dashboard</h1>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error && !resumenData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Tesorería Dashboard</h1>
          <ErrorDisplay 
            error={error} 
            onRetry={() => {
              refetchResumen();
              refetchSinCobrar();
              refetchProveedores();
              refetchCobrados();
            }} 
          />
        </div>
      </div>
    );
  }

  const ultimoSaldo = resumenData?.ultimo_saldo || 0;
  const totalSinCobrar = resumenData?.total_sin_cobrar_monto || 0;
  const cantidadSinCobrar = resumenData?.total_sin_cobrar_count || 0;
  const saldoProyectado = ultimoSaldo - totalSinCobrar;
  const diasPromedio = resumenData?.dias_promedio?.toFixed(1) || 0;

  const todosChequesSinCobrar = sinCobrarData?.cheques || [];
  const cantidadVencenManana = getChequesQueVencenManana(todosChequesSinCobrar).length;
  const cantidadVencenSemana = getChequesQueVencenEstaSemana(todosChequesSinCobrar).length;

  const serieTemporal = calcularSerieTemporalDesdeCobrados(chequesCobradosData || []);


  // ver que onda esto porque solo devuelve 10
  const razonesSociales = (proveedoresData || []).slice(0, 10).map(p => ({
      razonSocial: p.RAZON_SOCIAL,
      totalMonto: p.importe_total,
      cantidad: p.cantidad_cheques,
      promedioDias: Math.round(p.dias_promedio),
      perfil: p.categoria
    }));

  const chequesNoCobradosData = todosChequesSinCobrar.length > 0
    ? procesarChequesNoCobrados(todosChequesSinCobrar)
    : [];

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
            valor={totalSinCobrar} 
            sub={`${cantidadSinCobrar} cheques pendientes`}
            color="neutral"
          />
          <CardResumen 
            label="Saldo proyectado" 
            valor={saldoProyectado} 
            sub="Si todos cobran su cheque"
            color={getColorForSaldo(saldoProyectado)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <CardResumen 
            label="Días promedio cobro" 
            valor={diasPromedio} 
            sub="Tiempo promedio de cobro"
            color="neutral"
          />
          <CardResumen 
            label="Vencen mañana" 
            valor={cantidadVencenManana} 
            sub="cheques"
            color={cantidadVencenManana > 0 ? 'red' : 'neutral'}
          />
          <CardResumen 
            label="Vencen esta semana" 
            valor={cantidadVencenSemana} 
            sub="próximos 7 días"
            color={cantidadVencenSemana > 0 ? 'red' : 'neutral'}
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

function procesarChequesNoCobrados(cheques) {
  const grouped = {};
  
  cheques.forEach(cheque => {
    const razonSocial = cheque.RAZON_SOCIAL || 'Sin especificar';
    
    if (!grouped[razonSocial]) {
      grouped[razonSocial] = [];
    }
    
    grouped[razonSocial].push({
      id: cheque.NUMERO,
      monto: cheque.IMPORTE,
      fechaAcreditacion: cheque.FECHA_ACREDITACION
    });
  });

  return Object.entries(grouped)
    .map(([razonSocial, chequesArray]) => {
      const sortedCheques = [...chequesArray].sort((a, b) => {
        const diasA = getDiasRestantesDate(a.fechaAcreditacion);
        const diasB = getDiasRestantesDate(b.fechaAcreditacion);
        if (diasA === null) return 1;
        if (diasB === null) return -1;
        return diasA - diasB;
      });
      
      const total = sortedCheques.reduce((sum, c) => sum + c.monto, 0);
      const menorDias = sortedCheques.find(c => getDiasRestantesDate(c.fechaAcreditacion) !== null)?.diasRestantes ?? 999;
      
      return {
        razonSocial,
        cheques: sortedCheques.map(c => ({
          ...c,
          diasRestantes: getDiasRestantesDate(c.fechaAcreditacion)
        })),
        total,
        menorDiasRestantes: menorDias
      };
    })
    .sort((a, b) => {
      if (a.menorDiasRestantes === 999) return 1;
      if (b.menorDiasRestantes === 999) return -1;
      return a.menorDiasRestantes - b.menorDiasRestantes;
    });
}

function getDiasRestantesDate(fechaAcreditacion) {
  if (!fechaAcreditacion) return null;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fecha = parsearFechaLocal(fechaAcreditacion);
  if (!fecha) return null;
  const diffTime = fecha - hoy;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function parsearFechaLocal(fecha) {
  if (!fecha) return null;
  if (typeof fecha === 'object' && fecha instanceof Date) return fecha;
  
  if (typeof fecha === 'string' && fecha.includes('/')) {
    const parts = fecha.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
  }
  return null;
}