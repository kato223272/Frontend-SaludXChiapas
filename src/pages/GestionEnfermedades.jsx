import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaStethoscope, FaPlus, FaArrowLeft } from 'react-icons/fa';
import * as api from '../service/apiAdmin';

import ModalEnfermedad from '../components/ModalEnfermedad';
import ModalListaSintomas from '../components/ModalListaSintomas';
import ModalSinonimos from '../components/ModalSinonimos';

import '../styles/GestionTerminos.css'; 

const GestionEnfermedades = () => {
  const navigate = useNavigate();
  const [enfermedades, setEnfermedades] = useState([]);
  const [loading, setLoading] = useState(true);

  // Control de Modales
  const [modalEnfermedadOpen, setModalEnfermedadOpen] = useState(false);
  const [modalSintomasOpen, setModalSintomasOpen] = useState(false);
  const [modalSinonimosOpen, setModalSinonimosOpen] = useState(false);

  // Datos seleccionados
  const [enfermedadSeleccionada, setEnfermedadSeleccionada] = useState(null);
  const [sintomaSeleccionado, setSintomaSeleccionado] = useState(null);

  // 1. CARGA INICIAL (GET desde Render)
  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await api.getEnfermedades();
      setEnfermedades(data);
    } catch (error) {
      console.error(error);
      alert("No se pudo conectar con el servidor en Render.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // --- HANDLERS NIVEL 1: ENFERMEDAD ---

const handleCrearEnfermedad = async (formData) => {
    try {
        const nuevaEnf = {
            nombre: formData.nombre,
            nivel_urgencia: formData.nivel_urgencia,
            recomendacion_publica: formData.recomendacion_publica,
            sintomas_clave: formData.sintomas_clave, 
            
            sintomatologia: []
        };
        
        await api.crearEnfermedad(nuevaEnf);
        setModalEnfermedadOpen(false);
        cargarDatos(); 
    } catch (e) { 
        console.error(e);
        alert("Error al crear la enfermedad. Revisa que no exista ya ese nombre."); 
    }
  };

 const handleEditarEnfermedad = async (formData) => {
    try {
        await api.editarEnfermedad({
            nombre_actual: enfermedadSeleccionada.nombre,

            nuevo_nombre: formData.nombre,
            nueva_urgencia: formData.nivel_urgencia,
            nueva_recomendacion: formData.recomendacion_publica,
            
            nuevos_sintomas_clave: formData.sintomas_clave 
        });
        
        setModalEnfermedadOpen(false);
        cargarDatos();
    } catch (e) { 
        console.error(e);
        alert("Error al editar la información."); 
    }
  };

const handleEliminarEnfermedad = async (nombre) => {
    if(window.confirm(`¿Estás seguro de eliminar "${nombre}"?\n\nSe perderán todos sus síntomas y sinónimos para siempre.`)) {
        try {
            await api.eliminarEnfermedad(nombre);
            cargarDatos(); 
        } catch (e) { 
            console.error(e);
            alert("Error al eliminar la enfermedad."); 
        }
    }
  };

  // --- HANDLERS NIVEL 2: SÍNTOMAS ---

  const handleAgregarSintoma = async (nombreEnf, nombreSintoma) => {
    try {
        await api.agregarSintoma(nombreEnf, { nombre: nombreSintoma, otros_nombres: [] });
        // Recargamos datos globales y actualizamos la selección local
        const data = await api.getEnfermedades();
        setEnfermedades(data);
        setEnfermedadSeleccionada(data.find(e => e.nombre === nombreEnf));
    } catch (e) { alert("Error al agregar síntoma"); }
  };

  const handleEliminarSintoma = async (nombreEnf, nombreSintoma) => {
    try {
        await api.eliminarSintoma(nombreEnf, nombreSintoma);
        const data = await api.getEnfermedades();
        setEnfermedades(data);
        setEnfermedadSeleccionada(data.find(e => e.nombre === nombreEnf));
    } catch (e) { alert("Error al eliminar síntoma"); }
  };

  // --- HANDLERS NIVEL 3: SINÓNIMOS ---
  
  const handleCRUD_Sinonimo = async (accion, ...args) => {
    // Lógica para preparar los datos antes de enviar a la API
    let nuevosSinonimos = [...sintomaSeleccionado.otros_nombres];
    const sintomaNombre = sintomaSeleccionado.nombre;
    const enfermedadNombre = enfermedadSeleccionada.nombre;

    // Modificamos el array localmente primero
    if (accion === 'agregar') nuevosSinonimos.push(args[1]);
    if (accion === 'eliminar') nuevosSinonimos = nuevosSinonimos.filter(s => s !== args[1]);
    if (accion === 'editar') nuevosSinonimos = nuevosSinonimos.map(s => s === args[1] ? args[2] : s);

    try {
        // Enviamos el array completo actualizado a Render
        await api.editarSintoma(enfermedadNombre, sintomaNombre, null, nuevosSinonimos);
        
        // Refrescamos la UI
        const data = await api.getEnfermedades();
        setEnfermedades(data);
        
        // Mantenemos los modales abiertos con datos frescos
        const enfActualizada = data.find(e => e.nombre === enfermedadNombre);
        setEnfermedadSeleccionada(enfActualizada);
        setSintomaSeleccionado(enfActualizada.sintomatologia.find(s => s.nombre === sintomaNombre));
    } catch (e) { alert("Error actualizando sinónimos"); }
  };

  if (loading) return <div className="text-center mt-5"><h3>Cargando Panel de Administración...</h3></div>;

  return (
    <div className="container-fluid p-4">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <div>
            <button onClick={() => navigate('/')} className="btn btn-outline-secondary me-3"><FaArrowLeft /> Volver</button>
            <h2 className="d-inline">Gestión de Enfermedades</h2>
        </div>
        <button className="btn btn-primary" onClick={() => { setEnfermedadSeleccionada(null); setModalEnfermedadOpen(true); }}>
            <FaPlus /> Nueva Enfermedad
        </button>
      </header>

      {/* GRID DE TARJETAS */}
      <div className="row">
        {enfermedades.map((enf) => (
          <div key={enf._id || enf.nombre} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className={`card-header text-white d-flex justify-content-between align-items-center ${
                  enf.nivel_urgencia === 'Alto' ? 'bg-danger' : 
                  enf.nivel_urgencia === 'Medio' ? 'bg-warning text-dark' : 'bg-success'
              }`}>
                <h5 className="m-0 fw-bold">{enf.nombre}</h5>
                <small>{enf.nivel_urgencia}</small>
              </div>
              
              <div className="card-body">
                <p className="small text-muted">{enf.recomendacion_publica.substring(0, 120)}...</p>
                <button 
                    className="btn btn-outline-primary w-100" 
                    onClick={() => { setEnfermedadSeleccionada(enf); setModalSintomasOpen(true); }}
                >
                    <FaStethoscope /> Gestionar Síntomas ({enf.sintomatologia?.length || 0})
                </button>
              </div>

              <div className="card-footer bg-white d-flex justify-content-end gap-2">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => { setEnfermedadSeleccionada(enf); setModalEnfermedadOpen(true); }}>
                    <FaEdit /> Editar Info
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminarEnfermedad(enf.nombre)}>
                    <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODALES --- */}
      {modalEnfermedadOpen && (
        <ModalEnfermedad 
            enfermedad={enfermedadSeleccionada}
            onClose={() => setModalEnfermedadOpen(false)}
            onGuardar={enfermedadSeleccionada ? handleEditarEnfermedad : handleCrearEnfermedad}
        />
      )}

      {modalSintomasOpen && enfermedadSeleccionada && (
        <ModalListaSintomas
            enfermedad={enfermedadSeleccionada}
            onClose={() => setModalSintomasOpen(false)}
            onVerSinonimos={(sint) => { setSintomaSeleccionado(sint); setModalSinonimosOpen(true); }}
            onAgregarSintoma={handleAgregarSintoma}
            onEliminarSintoma={handleEliminarSintoma}
        />
      )}

      {modalSinonimosOpen && sintomaSeleccionado && (
        <ModalSinonimos
            sintoma={{
                nombre: sintomaSeleccionado.nombre,
                sinonimos: sintomaSeleccionado.otros_nombres || []
            }}
            onClose={() => setModalSinonimosOpen(false)}
            onAgregar={(nombre, nuevo) => handleCRUD_Sinonimo('agregar', nombre, nuevo)}
            onEditar={(nombre, orig, nuevo) => handleCRUD_Sinonimo('editar', nombre, orig, nuevo)}
            onEliminar={(nombre, sin) => handleCRUD_Sinonimo('eliminar', nombre, sin)}
        />
      )}
    </div>
  );
};

export default GestionEnfermedades;