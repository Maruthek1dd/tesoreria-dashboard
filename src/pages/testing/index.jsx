import { useState, useEffect } from 'react';
import * as api from '../../services/api';

const tabs = [
  { id: 'resumen', label: 'Resumen', fetchFn: api.getResumen, endpoint: '/api/cheques/resumen' },
  { id: 'cobrados', label: 'Cobrados', fetchFn: api.getCobrados, endpoint: '/api/cheques/cobrados' },
  { id: 'sin-cobrar', label: 'Sin Cobrar', fetchFn: api.getSinCobrar, endpoint: '/api/cheques/sin-cobrar' },
  { id: 'proveedores', label: 'Proveedores', fetchFn: api.getProveedores, endpoint: '/api/cheques/proveedores' },
  { id: 'refresh', label: 'Refresh', fetchFn: api.getRefresh, endpoint: '/api/cheques/refresh' },
];

function EndpointTester({ tab }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await tab.fetchFn();
      console.log(`[${tab.label}] Datos recibidos:`, result);
      setData(result);
    } catch (err) {
      console.error(`[${tab.label}] Error:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tab.id]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{tab.label}</h3>
          <code className="text-sm text-gray-500">{tab.endpoint}</code>
        </div>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Recargar
        </button>
      </div>

      {loading && <div className="text-gray-500">Cargando...</div>}

      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {data !== null && !loading && (
        <pre className="p-4 bg-gray-900 text-green-400 rounded overflow-auto text-xs max-h-96">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default function TestingPage() {
  const [activeTab, setActiveTab] = useState('resumen');

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Panel de Testing API</h1>
            <p className="text-gray-500 text-sm">
              Backend: <code>{api.API_URL}</code>
            </p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2 border-b border-gray-200 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          {tabs.map((tab) => (
            <div key={tab.id} className={activeTab === tab.id ? 'block' : 'hidden'}>
              <EndpointTester tab={tab} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}