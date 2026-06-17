export function formatearARS(monto) {
  if (monto === null || monto === undefined) return '$ 0';
  return '$ ' + Number(monto).toLocaleString('es-AR', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  });
}

export function formatearFecha(fecha) {
  if (!fecha) return '';
  const date = parsearFecha(fecha);
  if (!date) return '';
  return date.toLocaleDateString('es-AR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
}

export function formatearFechaCorta(fecha) {
  if (!fecha) return '';
  const date = parsearFecha(fecha);
  if (!date) return '';
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
}

export function parsearFecha(fecha) {
  if (!fecha) return null;
  if (typeof fecha === 'object' && fecha instanceof Date) return fecha;
  
  let date;
  if (typeof fecha === 'string' && fecha.includes('/')) {
    const parts = fecha.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      date = new Date(year, month, day);
    } else {
      date = new Date(fecha);
    }
  } else {
    date = new Date(fecha);
  }
  return isNaN(date.getTime()) ? null : date;
}

export function getDiasRestantes(fechaAcreditacion) {
  if (!fechaAcreditacion) return null;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const fecha = parsearFecha(fechaAcreditacion);
  if (!fecha) return null;
  const diffTime = fecha - hoy;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getChequesQueVencenManana(cheques) {
  if (!cheques || !Array.isArray(cheques)) return [];
  return cheques.filter(cheque => {
    const dias = getDiasRestantes(cheque.FECHA_ACREDITACION);
    return dias === 1;
  });
}

export function getChequesQueVencenEstaSemana(cheques) {
  if (!cheques || !Array.isArray(cheques)) return [];
  return cheques.filter(cheque => {
    const dias = getDiasRestantes(cheque.FECHA_ACREDITACION);
    return dias !== null && dias >= 0 && dias <= 7;
  });
}

export function getDiasEntre(start, end) {
  if (!start || !end) return 0;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = endDate - startDate;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function agruparPorPeriodo(datos, campoFecha, periodo = 'dia') {
  const grupos = {};
  
  datos.forEach(item => {
    const fecha = new Date(item[campoFecha]);
    if (isNaN(fecha.getTime())) return;
    
    let key;
    if (periodo === 'dia') {
      key = fecha.toISOString().split('T')[0];
    } else if (periodo === 'mes') {
      key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    }
    
    if (!grupos[key]) {
      grupos[key] = { fecha: key, ingreso: 0, egreso: 0, cantidad: 0 };
    }
    grupos[key].cantidad += 1;
  });
  
  return Object.values(grupos).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
}

export function calcularSerieTemporalDesdeCobrados(cobrados) {
  if (!cobrados || !Array.isArray(cobrados) || cobrados.length === 0) return [];
  
  const ordenados = [...cobrados].sort((a, b) => {
    const fechaA = parsearFecha(a.fecha_cobro);
    const fechaB = parsearFecha(b.fecha_cobro);
    if (!fechaA) return 1;
    if (!fechaB) return -1;
    return fechaA - fechaB;
  });
  
  const grupos = {};
  ordenados.forEach(cheque => {
    const fecha = parsearFecha(cheque.fecha_cobro);
    if (!fecha) return;
    
    const key = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
    if (!grupos[key]) {
      grupos[key] = { fecha: key, ingreso: 0, egreso: 0, saldoAcumulado: 0 };
    }
    grupos[key].ingreso += Math.abs(Number(cheque.Importe)) || 0;
  });
  
  let saldoAcumulado = 0;
  const resultado = Object.values(grupos).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  
  resultado.forEach(grupo => {
    saldoAcumulado += grupo.ingreso;
    grupo.saldoAcumulado = saldoAcumulado;
  });
  
  return resultado;
}

export function ordenarPorFecha(items, campoFecha, ascending = true) {
  return [...items].sort((a, b) => {
    const fechaA = new Date(a[campoFecha]);
    const fechaB = new Date(b[campoFecha]);
    if (isNaN(fechaA.getTime())) return 1;
    if (isNaN(fechaB.getTime())) return -1;
    return ascending ? fechaA - fechaB : fechaB - fechaA;
  });
}

export function getCategoriaColor(categoria) {
  switch (categoria) {
    case 'Rápidos':
      return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' };
    case 'Tardíos':
      return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' };
    case 'Variables':
      return { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' };
    case 'Normales':
      return { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' };
  }
}

export function getColorClass(color) {
  switch (color) {
    case 'green':
      return 'text-green-600';
    case 'red':
      return 'text-red-600';
    case 'neutral':
      return 'text-gray-600';
    default:
      return 'text-gray-900';
  }
}

export function getColorForSaldo(saldo) {
  return saldo >= 0 ? 'green' : 'red';
}

export function procesarChequesNoCobrados(cheques) {
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
        const fechaA = parsearFecha(a.fechaAcreditacion);
        const fechaB = parsearFecha(b.fechaAcreditacion);
        if (!fechaA) return 1;
        if (!fechaB) return -1;
        return fechaB - fechaA;
      });

      const total = sortedCheques.reduce((sum, c) => sum + c.monto, 0);

      return {
        razonSocial,
        cheques: sortedCheques,
        total
      };
    })
    .sort((a, b) => a.razonSocial.localeCompare(b.razonSocial));
}