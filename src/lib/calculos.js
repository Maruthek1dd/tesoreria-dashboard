export function getColorForSaldo(saldo) {
  return saldo >= 0 ? 'green' : 'red';
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

export function obtenerUltimoSaldo(movimientos) {
  if (movimientos.length === 0) return 0;
  const sorted = [...movimientos].sort((a, b) => new Date(b.fecha_generacion) - new Date(a.fecha_generacion));
  return sorted[0].saldo_cuenta;
}

export function contarChequesNoCobrados(movimientos) {
  return movimientos.filter(m => m.fecha_cobro === null).length;
}

export function totalChequesNoCobrados(movimientos) {
  return movimientos
    .filter(m => m.fecha_cobro === null)
    .reduce((total, m) => total + m.monto, 0);
}

function getDaysDiff(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = d2 - d1;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function calcularSerieTemporal(movimientos) {
  const sorted = [...movimientos].sort((a, b) => new Date(a.fecha_generacion) - new Date(b.fecha_generacion));
  
  const serie = [];
  let saldoAcumulado = 0;
  
  sorted.forEach(m => {
    const fecha = new Date(m.fecha_generacion).toISOString().split('T')[0];
    const monto = m.monto;
    
    saldoAcumulado += monto;
    
    serie.push({
      fecha,
      ingreso: monto,
      egreso: 0,
      saldoAcumulado
    });
  });
  
  return serie;
}

export function calcularVelocidadCobroPorRazonSocial(movimientos) {
  const movimientosCobrados = movimientos.filter(m => m.fecha_cobro !== null);
  
  const grouped = {};
  movimientosCobrados.forEach(m => {
    if (!grouped[m.razon_social]) {
      grouped[m.razon_social] = [];
    }
    const dias = getDaysDiff(m.fecha_generacion, m.fecha_cobro);
    grouped[m.razon_social].push(dias);
  });
  
  const result = Object.entries(grouped).map(([razonSocial, diasArray]) => {
    const totalMonto = movimientosCobrados
      .filter(m => m.razon_social === razonSocial)
      .reduce((sum, m) => sum + m.monto, 0);
    
    const cantidad = diasArray.length;
    const promedioDias = Math.round(diasArray.reduce((a, b) => a + b, 0) / cantidad);
    
    let perfil;
    if (promedioDias <= 7) {
      perfil = 'Agresivo';
    } else if (promedioDias <= 21) {
      perfil = 'Moderado';
    } else {
      perfil = 'Conservador';
    }
    
    return {
      razonSocial,
      totalMonto,
      cantidad,
      promedioDias,
      perfil
    };
  });
  
  return result.sort((a, b) => b.totalMonto - a.totalMonto);
}

export function getPerfilColor(perfil) {
  switch (perfil) {
    case 'Agresivo':
      return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' };
    case 'Moderado':
      return { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' };
    case 'Conservador':
      return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' };
  }
}

export function obtenerChequesNoCobrados(movimientos) {
  const hoy = new Date();
  const chequesNoCobrados = movimientos.filter(m => m.fecha_cobro === null);
  
  const grouped = {};
  chequesNoCobrados.forEach(m => {
    if (!grouped[m.razon_social]) {
      grouped[m.razon_social] = [];
    }
    
    const fechaGeneracion = new Date(m.fecha_generacion);
    const fechaVencimiento = new Date(fechaGeneracion);
    fechaVencimiento.setDate(fechaVencimiento.getDate() + 30);
    
    const diasRestantes = Math.ceil((fechaVencimiento - hoy) / (1000 * 60 * 60 * 24));
    
    grouped[m.razon_social].push({
      id: m.id,
      monto: m.monto,
      diasRestantes
    });
  });
  
  const result = Object.entries(grouped).map(([razonSocial, cheques]) => {
    const sortedCheques = [...cheques].sort((a, b) => a.diasRestantes - b.diasRestantes);
    const total = sortedCheques.reduce((sum, c) => sum + c.monto, 0);
    const menorDiasRestantes = sortedCheques[0].diasRestantes;
    
    return {
      razonSocial,
      cheques: sortedCheques,
      total,
      menorDiasRestantes
    };
  });
  
  return result.sort((a, b) => a.menorDiasRestantes - b.menorDiasRestantes);
}