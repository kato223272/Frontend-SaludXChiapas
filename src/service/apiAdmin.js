const API_URL = import.meta.env.VITE_API_URL;
import { authFetch } from './apiClient';
//  ENFERMEDADES (Nivel 1)

export const getEnfermedades = async () => {
  const res = await authFetch(`/admin/catalogo-sintomas`);
  if (!res.ok) throw new Error("Error obteniendo enfermedades");
  return await res.json();
};

export const crearEnfermedad = async (data) => {
  const res = await authFetch(`/admin/enfermedad`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error creando enfermedad");
  return await res.json();
};

export const editarEnfermedad = async (data) => {
  const res = await authFetch(`/admin/enfermedad`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error editando enfermedad");
  return await res.json();
};

export const eliminarEnfermedad = async (nombre) => {
  const res = await authFetch(`/admin/enfermedad?nombre=${nombre}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error("Error eliminando enfermedad");
  return await res.json();
};

//  SÍNTOMAS (Nivel 2)

export const agregarSintoma = async (enfermedadNombre, sintomaObj) => {
  const res = await authFetch(`/admin/sintoma`, {
    method: 'POST',
    body: JSON.stringify({
      enfermedad_nombre: enfermedadNombre,
      nuevo_sintoma: sintomaObj
    }),
  });
  if (!res.ok) throw new Error("Error agregando síntoma");
  return await res.json();
};

export const eliminarSintoma = async (enfermedadNombre, sintomaNombre) => {
  const res = await authFetch(`/admin/sintoma?enfermedad=${enfermedadNombre}&sintoma=${sintomaNombre}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error("Error eliminando síntoma");
  return await res.json();
};

//  SINÓNIMOS (Nivel 3 - Editar Síntoma)

export const editarSintoma = async (enfermedadNombre, sintomaActual, nuevoNombre, nuevosSinonimos) => {
  const res = await authFetch(`/admin/sintoma`, {
    method: 'PUT',
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