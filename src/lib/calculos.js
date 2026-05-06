const hoy = new Date();
hoy.setHours(0, 0, 0, 0);

function isSameDay(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return d1.getTime() === d2.getTime();
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function isYesterday(date) {
  const yesterday = addDays(hoy, -1);
  return isSameDay(date, yesterday);
}

export function calcularSaldoActual(movimientos) {
  const fechaActual = new Date(hoy);
  
  return movimientos
    .filter(m => new Date(m.fecha) <= fechaActual)
    .reduce((total, m) => {
      return m.tipo === 'Ingreso' ? total + m.monto : total - m.monto;
    }, 0);
}

export function calcularIngresoAyer(movimientos) {
  return movimientos
    .filter(m => isYesterday(m.fecha) && m.tipo === 'Ingreso')
    .reduce((total, m) => total + m.monto, 0);
}

export function calcularEgresoAyer(movimientos) {
  return movimientos
    .filter(m => isYesterday(m.fecha) && m.tipo === 'Egreso')
    .reduce((total, m) => total + m.monto, 0);
}

export function calcularSaldoProyectado(saldoActual, eventosProyeccion, simulacion = false) {
  let saldo = saldoActual;
  
  eventosProyeccion.forEach(evento => {
    const monto = simulacion && evento.tipo === 'egreso' 
      ? evento.monto * 1.8 
      : evento.monto;
    
    if (evento.tipo === 'ingreso') {
      saldo += monto;
    } else {
      saldo -= monto;
    }
  });
  
  return saldo;
}

export function calcularProyeccionDetallada(saldoActual, eventosProyeccion, simulacion = false) {
  const proyeccion = [];
  let saldoAcumulado = saldoActual;
  
  eventosProyeccion.forEach(evento => {
    const monto = simulacion && evento.tipo === 'egreso' 
      ? evento.monto * 1.8 
      : evento.monto;
    
    if (evento.tipo === 'ingreso') {
      saldoAcumulado += monto;
    } else {
      saldoAcumulado -= monto;
    }
    
    proyeccion.push({
      ...evento,
      monto: monto,
      saldoAcumulado: saldoAcumulado
    });
  });
  
  return proyeccion;
}

export function hayRiesgoLiquidez(proyeccionDetallada) {
  return proyeccionDetallada.some(evento => evento.saldoAcumulado < 0);
}

export function obtenerDiaNegativo(proyeccionDetallada) {
  const negativo = proyeccionDetallada.find(evento => evento.saldoAcumulado < 0);
  return negativo ? negativo.dia : null;
}

export function getColorForSaldo(saldo) {
  if (saldo > 2000000) return 'green';
  if (saldo >= 500000) return 'yellow';
  return 'red';
}

export function getColorClass(color) {
  switch (color) {
    case 'green':
      return 'text-green-600';
    case 'yellow':
      return 'text-amber-500';
    case 'red':
      return 'text-red-600';
    default:
      return 'text-gray-900';
  }
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