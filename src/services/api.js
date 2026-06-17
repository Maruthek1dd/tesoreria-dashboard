const API_URL = "http://127.0.0.1:8000";

async function fetchAPI(endpoint) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const json = await response.json();
    return json.success ? json.data : json;
  } catch (error) {
    throw error;
  }
}

export async function getResumen() {
  return fetchAPI('/api/cheques/resumen');
}

export async function getCobrados() {
  return fetchAPI('/api/cheques/cobrados');
}

export async function getSinCobrar() {
  return fetchAPI('/api/cheques/sin-cobrar');
}

export async function getProveedores() {
  return fetchAPI('/api/cheques/proveedores');
}

export async function getRefresh() {
  return fetchAPI('/api/cheques/refresh');
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/api/cheques/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const json = await response.json();
  return json.success ? json.data : json;
}

export { API_URL };