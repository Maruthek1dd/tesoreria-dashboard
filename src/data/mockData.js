const hoy = new Date();

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export const movimientos = [
  { id: 'ch-001', fecha_generacion: addDays(hoy, -30), fecha_cobro: addDays(hoy, -23), concepto: 'Pago factura #1024', monto: 450000, razon_social: 'Constructora Ríos SA', saldo_cuenta: 4500000 },
  { id: 'ch-002', fecha_generacion: addDays(hoy, -28), fecha_cobro: addDays(hoy, -21), concepto: 'Honorarios servicios', monto: 280000, razon_social: 'Estudio Jurídico López', saldo_cuenta: 4220000 },
  { id: 'ch-003', fecha_generacion: addDays(hoy, -25), fecha_cobro: addDays(hoy, -18), concepto: 'Pago materiales', monto: 620000, razon_social: 'Constructora Ríos SA', saldo_cuenta: 3600000 },
  { id: 'ch-004', fecha_generacion: addDays(hoy, -22), fecha_cobro: addDays(hoy, -15), concepto: 'Alquiler oficina', monto: 350000, razon_social: 'Inmobiliaria Centro', saldo_cuenta: 3250000 },
  { id: 'ch-005', fecha_generacion: addDays(hoy, -20), fecha_cobro: addDays(hoy, -6), concepto: 'Pago proveedor insumos', monto: 180000, razon_social: 'Tech Solutions Inc', saldo_cuenta: 3070000 },
  { id: 'ch-006', fecha_generacion: addDays(hoy, -18), fecha_cobro: addDays(hoy, -11), concepto: 'Cobro cliente', monto: 1500000, razon_social: 'Agro Pampa SRL', saldo_cuenta: 4570000 },
  { id: 'ch-007', fecha_generacion: addDays(hoy, -15), fecha_cobro: addDays(hoy, -8), concepto: 'Servicios profesionales', monto: 420000, razon_social: 'Consultora Delta', saldo_cuenta: 4150000 },
  { id: 'ch-008', fecha_generacion: addDays(hoy, -12), fecha_cobro: addDays(hoy, -2), concepto: 'Pago mercadería', monto: 890000, razon_social: 'Mayorista Central', saldo_cuenta: 3260000 },
  { id: 'ch-009', fecha_generacion: addDays(hoy, -10), fecha_cobro: addDays(hoy, -3), concepto: 'Cobro factura #445', monto: 750000, razon_social: 'Cliente XMZ', saldo_cuenta: 4010000 },
  { id: 'ch-010', fecha_generacion: addDays(hoy, -8), fecha_cobro: addDays(hoy, -1), concepto: 'Cheque regalo proveedores', monto: 560000, razon_social: 'Servicios Médicos ABC', saldo_cuenta: 3450000 },
  { id: 'ch-011', fecha_generacion: addDays(hoy, -5), fecha_cobro: addDays(hoy, 2), concepto: 'Depósito cliente nuevo', monto: 2200000, razon_social: 'MegaCorp SA', saldo_cuenta: 5650000 },
  { id: 'ch-012', fecha_generacion: addDays(hoy, -3), fecha_cobro: addDays(hoy, 10), concepto: 'Pago servicios terceros', monto: 380000, razon_social: 'Gestoría Perez', saldo_cuenta: 5270000 },
  { id: 'ch-013', fecha_generacion: addDays(hoy, -1), fecha_cobro: null, concepto: 'Facturación mensual', monto: 1200000, razon_social: 'Facturación varios', saldo_cuenta: 4070000 },
  { id: 'ch-014', fecha_generacion: addDays(hoy, 2), fecha_cobro: null, concepto: 'Cheque futuro proveedores', monto: 950000, razon_social: 'Proveedor Nacional SA', saldo_cuenta: 4070000 },
  { id: 'ch-015', fecha_generacion: addDays(hoy, 5), fecha_cobro: null, concepto: 'Pago cierre mes', monto: 2000000, razon_social: 'Cheques cierre', saldo_cuenta: 4070000 },
  { id: 'ch-016', fecha_generacion: addDays(hoy, -25), fecha_cobro: addDays(hoy, -24), concepto: 'Pago urgente', monto: 300000, razon_social: 'Tech Solutions Inc', saldo_cuenta: 3900000 },
  { id: 'ch-017', fecha_generacion: addDays(hoy, -20), fecha_cobro: addDays(hoy, -19), concepto: 'Servicio express', monto: 150000, razon_social: 'Tech Solutions Inc', saldo_cuenta: 3750000 },
];

export function formatearARS(monto) {
  return '$ ' + monto.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}