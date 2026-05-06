const hoy = new Date();

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export const movimientos = [
  { id: 'mov-001', fecha: addDays(hoy, -20), tipo: 'Ingreso', cliente: 'Agro Pampa SRL', monto: 2500000, estado: 'Pagado', categoria: 'deposito' },
  { id: 'mov-002', fecha: addDays(hoy, -18), tipo: 'Egreso', cliente: 'Constructora Ríos SA', monto: 500000, estado: 'Pagado', categoria: 'cheque' },
  { id: 'mov-003', fecha: addDays(hoy, -15), tipo: 'Ingreso', cliente: 'Tech Solutions Inc', monto: 1800000, estado: 'Pagado', categoria: 'transferencia' },
  { id: 'mov-004', fecha: addDays(hoy, -12), tipo: 'Egreso', cliente: 'Pago proveedores', monto: 350000, estado: 'Pagado', categoria: 'retiro' },
  { id: 'mov-005', fecha: addDays(hoy, -10), tipo: 'Ingreso', cliente: 'Distribuidora Norte', monto: 900000, estado: 'Pagado', categoria: 'deposito' },
  { id: 'mov-006', fecha: addDays(hoy, -8), tipo: 'Egreso', cliente: 'Servicios Médicos ABC', monto: 420000, estado: 'Pagado', categoria: 'cheque' },
  { id: 'mov-007', fecha: addDays(hoy, -5), tipo: 'Ingreso', cliente: 'CobroFactura #445', monto: 1500000, estado: 'Pagado', categoria: 'transferencia' },
  { id: 'mov-008', fecha: addDays(hoy, -3), tipo: 'Egreso', cliente: 'Alquiler oficina', monto: 280000, estado: 'Pagado', categoria: 'retiro' },
  { id: 'mov-009', fecha: addDays(hoy, -2), tipo: 'Ingreso', cliente: 'Cliente nuevo XMZ', monto: 750000, estado: 'Pagado', categoria: 'deposito' },
  { id: 'mov-010', fecha: addDays(hoy, -1), tipo: 'Egreso', cliente: 'Sueldos empleados', monto: 1800000, estado: 'Pagado', categoria: 'transferencia' },
  { id: 'mov-011', fecha: addDays(hoy, 1), tipo: 'Egreso', cliente: 'Cheque Constructora Ríos', monto: 500000, estado: 'Pendiente', categoria: 'cheque' },
  { id: 'mov-012', fecha: addDays(hoy, 3), tipo: 'Ingreso', cliente: 'Pago cliente MegaCorp', monto: 2200000, estado: 'Pendiente', categoria: 'transferencia' },
  { id: 'mov-013', fecha: addDays(hoy, 5), tipo: 'Egreso', cliente: 'Proveedor nacional', monto: 650000, estado: 'Pendiente', categoria: 'cheque' },
  { id: 'mov-014', fecha: addDays(hoy, 7), tipo: 'Egreso', cliente: 'Cheques varios vencimiento', monto: 1200000, estado: 'Pendiente', categoria: 'cheque' },
  { id: 'mov-015', fecha: addDays(hoy, 10), tipo: 'Ingreso', cliente: 'Cobro Agro Pampa SRL', monto: 800000, estado: 'Pendiente', categoria: 'deposito' },
  { id: 'mov-016', fecha: addDays(hoy, 15), tipo: 'Egreso', cliente: 'Retiro estimado clientes', monto: 950000, estado: 'Pendiente', categoria: 'retiro' },
  { id: 'mov-017', fecha: addDays(hoy, 20), tipo: 'Ingreso', cliente: 'Facturación mensual', monto: 3000000, estado: 'Pendiente', categoria: 'transferencia' },
  { id: 'mov-018', fecha: addDays(hoy, 25), tipo: 'Egreso', cliente: 'Impuestos', monto: 1100000, estado: 'Pendiente', categoria: 'transferencia' },
  { id: 'mov-019', fecha: addDays(hoy, 30), tipo: 'Egreso', cliente: 'Cheques cierre de mes', monto: 2000000, estado: 'Pendiente', categoria: 'cheque' },
];

export const clientes = [
  { id: 'cl-001', nombre: 'Constructora Ríos SA', totalRetirado: 5200000, frecuenciaRetiro: 'Semanal', montoPromedio: 870000, perfil: 'Agresivo' },
  { id: 'cl-002', nombre: 'Servicios Médicos ABC', totalRetirado: 2100000, frecuenciaRetiro: 'Quincenal', montoPromedio: 420000, perfil: 'Moderado' },
  { id: 'cl-003', nombre: 'Distribuidora Norte', totalRetirado: 800000, frecuenciaRetiro: 'Esporádico', montoPromedio: 400000, perfil: 'Conservador' },
  { id: 'cl-004', nombre: 'Tech Solutions Inc', totalRetirado: 3800000, frecuenciaRetiro: 'Semanal', montoPromedio: 630000, perfil: 'Agresivo' },
  { id: 'cl-005', nombre: 'Agro Pampa SRL', totalRetirado: 1500000, frecuenciaRetiro: 'Mensual', montoPromedio: 1500000, perfil: 'Moderado' },
  { id: 'cl-006', nombre: 'Cliente XMZ', totalRetirado: 450000, frecuenciaRetiro: 'Esporádico', montoPromedio: 225000, perfil: 'Conservador' },
];

export const eventosProyeccion = [
  { dia: 0, tipo: 'egreso', descripcion: 'Cheque Constructora Ríos', monto: 500000 },
  { dia: 7, tipo: 'egreso', descripcion: 'Cheques varios vencimiento', monto: 1200000 },
  { dia: 15, tipo: 'ingreso', descripcion: 'Cobro Agro Pampa SRL', monto: 800000 },
  { dia: 22, tipo: 'egreso', descripcion: 'Retiro estimado clientes', monto: 950000 },
  { dia: 30, tipo: 'egreso', descripcion: 'Cheques cierre de mes', monto: 2000000 },
];

export function formatearARS(monto) {
  return '$ ' + monto.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}