import { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, FileSpreadsheet, X } from 'lucide-react';

const ACCEPTED_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv'
];
const ACCEPTED_EXTENSIONS = ['.xlsx', '.xls', '.csv'];

function validarArchivo(file) {
  if (!file) return { valido: false, error: 'No se seleccionó archivo' };
  
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  if (!ACCEPTED_EXTENSIONS.includes(extension)) {
    return { valido: false, error: `Extensión no válida. Use: ${ACCEPTED_EXTENSIONS.join(', ')}` };
  }
  
  return { valido: true, error: null };
}

export default function CargaArchivoBanco({ onUpload }) {
  const [estado, setEstado] = useState('vacio');
  const [archivo, setArchivo] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const reset = () => {
    setArchivo(null);
    setEstado('vacio');
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFile = async (file) => {
    const validacion = validarArchivo(file);
    if (!validacion.valido) {
      setEstado('error');
      setError(validacion.error);
      return;
    }

    setArchivo(file);
    setEstado('cargando');
    setError(null);

    try {
      await onUpload(file);
      setEstado('exito');
    } catch (err) {
      setEstado('error');
      setError(err.message || 'Error al cargar el archivo');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <FileSpreadsheet className="w-5 h-5 text-green-600" />
        <h3 className="font-semibold text-gray-800">Archivo Banco</h3>
      </div>

      {estado === 'vacio' && (
        <label
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            flex flex-col items-center justify-center w-full h-32
            border-2 border-dashed rounded-lg cursor-pointer
            transition-colors
            ${dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'}
          `}
        >
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-500">
            Arrastre un archivo o haga clic para seleccionar
          </span>
          <span className="text-xs text-gray-400 mt-1">
            {ACCEPTED_EXTENSIONS.join(', ')}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS.join(',')}
            onChange={handleChange}
            className="hidden"
          />
        </label>
      )}

      {estado === 'cargando' && (
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="text-sm text-blue-700">Cargando {archivo?.name}...</span>
        </div>
      )}

      {estado === 'exito' && (
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-700">{archivo?.name}</span>
          </div>
          <button
            onClick={reset}
            className="p-1 hover:bg-green-100 rounded"
          >
            <X className="w-4 h-4 text-green-600" />
          </button>
        </div>
      )}

      {estado === 'error' && (
        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
          <button
            onClick={reset}
            className="p-1 hover:bg-red-100 rounded"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}
    </div>
  );
}
