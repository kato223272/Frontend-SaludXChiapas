const API_URL = import.meta.env.VITE_API_URL;

//  ENFERMEDADES (Nivel 1)

export const getEnfermedades = async () => {
  const res = await fetch(`${API_URL}/api/v1/admin/catalogo-sintomas`);
  if (!res.ok) throw new Error("Error obteniendo enfermedades");
  return await res.json();
};

export const crearEnfermedad = async (data) => {
  const res = await fetch(`${API_URL}/api/v1/admin/enfermedad`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error creando enfermedad");
  return await res.json();
};

export const editarEnfermedad = async (data) => {
  // data: { nombre_actual, nuevo_nombre, nueva_urgencia, nueva_recomendacion }
  const res = await fetch(`${API_URL}/api/v1/admin/enfermedad`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error editando enfermedad");
  return await res.json();
};

export const eliminarEnfermedad = async (nombre) => {
  const res = await fetch(`${API_URL}/api/v1/admin/enfermedad?nombre=${nombre}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error("Error eliminando enfermedad");
  return await res.json();
};

//  SÍNTOMAS (Nivel 2)

export const agregarSintoma = async (enfermedadNombre, sintomaObj) => {
  const res = await fetch(`${API_URL}/api/v1/admin/sintoma`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      enfermedad_nombre: enfermedadNombre,
      nuevo_sintoma: sintomaObj
    }),
  });
  if (!res.ok) throw new Error("Error agregando síntoma");
  return await res.json();
};

export const eliminarSintoma = async (enfermedadNombre, sintomaNombre) => {
  const res = await fetch(`${API_URL}/api/v1/admin/sintoma?enfermedad=${enfermedadNombre}&sintoma=${sintomaNombre}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error("Error eliminando síntoma");
  return await res.json();
};

//  SINÓNIMOS (Nivel 3 - Editar Síntoma)

export const editarSintoma = async (enfermedadNombre, sintomaActual, nuevoNombre, nuevosSinonimos) => {
  const res = await fetch(`${API_URL}/api/v1/admin/sintoma`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      enfermedad_nombre: enfermedadNombre,
      sintoma_actual: sintomaActual,
      nuevo_nombre: nuevoNombre, 
      nuevos_sinonimos: nuevosSinonimos
    }),
  });
  if (!res.ok) throw new Error("Error editando sinónimos");
  return await res.json();
};