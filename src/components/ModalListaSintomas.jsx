import React, { useState } from 'react';
import { FaTrash, FaList, FaPlus, FaTimes } from 'react-icons/fa';
import '../styles/ModalSinonimos.css'; 

const ModalListaSintomas = ({ enfermedad, onClose, onVerSinonimos, onEliminarSintoma, onAgregarSintoma }) => {
  const [nuevoSintoma, setNuevoSintoma] = useState('');

  const handleAgregar = () => {
    if (nuevoSintoma.trim()) {
      onAgregarSintoma(enfermedad.nombre, nuevoSintoma.trim());
      setNuevoSintoma('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAgregar();
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-content-custom" onClick={e => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ margin: 0 }}>Síntomas: {enfermedad.nombre}</h2>
            <button className="btn-icon" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="sinonimos-list">
          {enfermedad.sintomatologia && enfermedad.sintomatologia.length > 0 ? (
            enfermedad.sintomatologia.map((sintoma, idx) => (
              <div key={idx} className="sinonimo-item">
                <span style={{ fontWeight: 'bold' }}>{sintoma.nombre}</span>
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>

                  <button 
                    className="btn-icon" 
                    onClick={() => onVerSinonimos(sintoma)}
                    title="Ver Sinónimos"
                    style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px', color: '#0d6efd' }}
                  >
                    <FaList /> <small>({sintoma.otros_nombres?.length || 0})</small>
                  </button>

                  <button 
                    className="btn-icon btn-delete" 
                    onClick={() => {
                        if(window.confirm(`¿Eliminar síntoma "${sintoma.nombre}"?`)) 
                            onEliminarSintoma(enfermedad.nombre, sintoma.nombre)
                    }}
                    title="Eliminar Síntoma"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-sinonimos">No hay síntomas registrados.</p>
          )}
        </div>

        <div className="agregar-sinonimo-form">
            <input 
                type="text" 
                className="input-nuevo-sinonimo" 
                placeholder="Nombre del nuevo síntoma..." 
                value={nuevoSintoma}
                onChange={(e) => setNuevoSintoma(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button className="modal-btn btn-agregar" onClick={handleAgregar}>
                <FaPlus /> 
            </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="modal-btn btn-cerrar" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalListaSintomas;
