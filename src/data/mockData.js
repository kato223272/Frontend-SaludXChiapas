const API_URL = import.meta.env.VITE_API_URL;
const processSintomas = (dataSources) => {
  const sintomasMap = new Map();
  let uniqueId = 1;

  dataSources.forEach((disease) => {
    // Verificamos que traiga sintomatología (para evitar errores con enfermedades vacías)
    if (disease.sintomatologia) {
      disease.sintomatologia.forEach((sintoma) => {
        const nombreSintoma = sintoma.nombre.trim();
        const otrosNombres = sintoma.otros_nombres || [];

        if (!sintomasMap.has(nombreSintoma)) {
          sintomasMap.set(nombreSintoma, {
            id: uniqueId++,
            nombre: nombreSintoma,
            sinonimos: new Set(otrosNombres),
          });
        } else {
          const existing = sintomasMap.get(nombreSintoma);
          otrosNombres.forEach((sin) => existing.sinonimos.add(sin));
        }
      });
    }
  });
  const sintomasList = Array.from(sintomasMap.values()).map((s) => ({
    ...s,
    sinonimos: Array.from(s.sinonimos),
  }));

  return sintomasList;
};

export const obtenerSintomas = async () => {
  try {
    // Peticion al endpoint 
    const response = await fetch(`${API_URL}/api/v1/admin/catalogo-sintomas`);

    if (!response.ok) {
      throw new Error(`Error en la API: ${response.statusText}`);
    }
    const allDiseaseData = await response.json();
    return processSintomas(allDiseaseData);

  } catch (error) {
    console.error("Error obteniendo los síntomas:", error);
    return [];
  }
};