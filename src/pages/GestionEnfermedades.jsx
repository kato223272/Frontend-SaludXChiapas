import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaStethoscope, FaPlus, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa';
import * as api from '../service/apiAdmin';

import ModalEnfermedad from '../components/ModalEnfermedad';
import ModalListaSintomas from '../components/ModalListaSintomas';
import ModalSinonimos from '../components/ModalSinonimos';

import '../styles/GestionTerminos.css'; 

const GestionEnfermedades = () => {
  const navigate = useNavigate();
  const [enfermedades, setEnfermedades] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [modalEnfermedadOpen, setModalEnfermedadOpen] = useState(false);
  const [modalSintomasOpen, setModalSintomasOpen] = useState(false);
  const [modalSinonimosOpen, setModalSinonimosOpen] = useState(false);
  
  const [enfermedadSeleccionada, setEnfermedadSeleccionada] = useState(null);
  const [sintomaSeleccionado, setSintomaSeleccionado] = useState(null);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await api.getEnfermedades();
      setEnfermedades(data);
    } catch (error) {
      console.error("Error al cargar datos:", error); // Usamos la variable error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

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
        console.error("Error al crear:", e); // CORREGIDO: Se usa 'e'
        alert("Error al crear el registro."); 
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
        console.error("Error al editar:", e); // CORREGIDO: Se usa 'e'
        alert("Error al actualizar el registro."); 
    }
  };

  const handleEliminarEnfermedad = async (nombre) => {
    if(window.confirm(`¿Confirmar eliminación del protocolo para "${nombre}"?`)) {
        try {
            await api.eliminarEnfermedad(nombre);
            cargarDatos(); 
        } catch (e) { 
            console.error("Error al eliminar:", e); // CORREGIDO: Se usa 'e'
            alert("Error al eliminar."); 
        }
    }
  };

  const handleAgregarSintoma = async (nombreEnf, nombreSintoma) => {
    try {
        await api.agregarSintoma(nombreEnf, { nombre: nombreSintoma, otros_nombres: [] });
        const data = await api.getEnfermedades();
        setEnfermedades(data);
        setEnfermedadSeleccionada(data.find(e => e.nombre === nombreEnf));
    } catch (e) { 
        console.error(e); // CORREGIDO: Se usa 'e'
        alert("Error de operación"); 
    }
  };

  const handleEliminarSintoma = async (nombreEnf, nombreSintoma) => {
    try {
        await api.eliminarSintoma(nombreEnf, nombreSintoma);
        const data = await api.getEnfermedades();
        setEnfermedades(data);
        setEnfermedadSeleccionada(data.find(e => e.nombre === nombreEnf));
    } catch (e) { 
        console.error(e); // CORREGIDO: Se usa 'e'
        alert("Error de operación"); 
    }
  };
  
  const handleCRUD_Sinonimo = async (accion, ...args) => {
    let nuevosSinonimos = [...sintomaSeleccionado.otros_nombres];
    const sintomaNombre = sintomaSeleccionado.nombre;
    const enfermedadNombre = enfermedadSeleccionada.nombre;

    if (accion === 'agregar') nuevosSinonimos.push(args[1]);
    if (accion === 'eliminar') nuevosSinonimos = nuevosSinonimos.filter(s => s !== args[1]);
    if (accion === 'editar') nuevosSinonimos = nuevosSinonimos.map(s => s === args[1] ? args[2] : s);

    try {
        await api.editarSintoma(enfermedadNombre, sintomaNombre, null, nuevosSinonimos);
        const data = await api.getEnfermedades();
        setEnfermedades(data);
        
        const enfActualizada = data.find(e => e.nombre === enfermedadNombre);
        setEnfermedadSeleccionada(enfActualizada);
        setSintomaSeleccionado(enfActualizada.sintomatologia.find(s => s.nombre === sintomaNombre));
    } catch (e) { 
        console.error(e); // CORREGIDO: Se usa 'e'
        alert("Error actualizando base de conocimientos"); 
    }
  };

  const getUrgencyClass = (nivel) => {
      if (nivel === 'Alto' || nivel === 'Medio-Alto') return 'urgency-high';
      if (nivel === 'Medio') return 'urgency-medium';
      return 'urgency-low';
  };

if (loading) return (
    <div className="loading-wrapper">
        <div className="scanner-container">
            <div className="scanner-ring"></div>
            <div className="scanner-core"></div>
        </div>
        <div className="loading-text">Accediendo a Protocolos</div>
        <div className="loading-subtext">Verificando base de datos médica...</div>
    </div>
  );

  return (
    <div className="gestion-page">
      <header className="gestion-header">
        <div className="header-left">
            <button onClick={() => navigate('/graficas')} className="btn-back">
                <FaArrowLeft /> Regresar
            </button>
            <div className="header-titles">
                <h1>Base de Conocimientos Médicos</h1>
                <p>Administración de patologías y sintomatología</p>
            </div>
        </div>
        <button className="btn-create" onClick={() => { setEnfermedadSeleccionada(null); setModalEnfermedadOpen(true); }}>
            <FaPlus /> Nueva enfermedad
        </button>
      </header>

      <div className="gestion-content">
        <div className="cards-grid">
          {enfermedades.map((enf) => (
            <div key={enf._id || enf.nombre} className={`medical-card ${getUrgencyClass(enf.nivel_urgencia)}`}>
              <div className="card-top">
                <div className="card-titles">
                    <h3>{enf.nombre}</h3>
                    <span className="urgency-badge">
                        {enf.nivel_urgencia === 'Alto' && <FaExclamationTriangle />} 
                        {enf.nivel_urgencia}
                    </span>
                </div>
              </div>
              
              <div className="card-body-text">
                <p>{enf.recomendacion_publica}</p>
              </div>

              <div className="card-actions">
                <button 
                    className="btn-symptoms" 
                    onClick={() => { setEnfermedadSeleccionada(enf); setModalSintomasOpen(true); }}
                >
                    <FaStethoscope /> {enf.sintomatologia?.length || 0} Síntomas Registrados
                </button>
                
                <div className="action-row">
                    <button className="btn-icon-edit" onClick={() => { setEnfermedadSeleccionada(enf); setModalEnfermedadOpen(true); }}>
                        <FaEdit /> Editar
                    </button>
                    <button className="btn-icon-delete" onClick={() => handleEliminarEnfermedad(enf.nombre)}>
                        <FaTrash />
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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