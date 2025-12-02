import React, { useState } from 'react';
import '../styles/ModalSinonimos.css'; 
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlus } from 'react-icons/fa';

const ModalSinonimos = ({ sintoma, onClose, onAgregar, onEditar, onEliminar }) => {
  const [nuevoSinonimo, setNuevoSinonimo] = useState('');
  const [editando, setEditando] = useState(null);

  if (!sintoma) return null;

  const handleAgregarClick = () => {
    if (nuevoSinonimo.trim()) {
      onAgregar(sintoma.nombre, nuevoSinonimo.trim());
      setNuevoSinonimo(''); 
    }
  };

  const handleIniciarEdicion = (sin) => {
    setEditando({ original: sin, texto: sin });
  };

  const handleCancelarEdicion = () => {
    setEditando(null);
  };

  const handleGuardarEdicion = () => {
    if (editando && editando.texto.trim() && editando.texto.trim() !== editando.original) {
      onEditar(sintoma.nombre, editando.original, editando.texto.trim());
    }
    setEditando(null); 
  };

  const handleEliminarClick = (sin) => {
    if (window.confirm(`¿Estás seguro de eliminar el sinónimo "${sin}"?`)) {
      onEliminar(sintoma.nombre, sin);
    }
  };

  const handleKeyDown = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
            <h2>{sintoma.nombre}</h2>
            <button className="btn-close-x" onClick={onClose}><FaTimes /></button>
        </div>
        
        <p className="sinonimos-title">Administrar Sinónimos</p>

        <div className="sinonimos-list">
          {sintoma.sinonimos && sintoma.sinonimos.length > 0 ? (
            sintoma.sinonimos.map((sin, index) => (
              <div key={index} className="sinonimo-item">
                {editando && editando.original === sin ? (
                  <div className="sinonimo-edit-mode">
                    <input
                      type="text"
                      className="sinonimo-input-edit" 
                      value={editando.texto}
                      onChange={(e) => setEditando({ ...editando, texto: e.target.value })}
                      autoFocus
                      onKeyDown={(e) => handleKeyDown(e, handleGuardarEdicion)}
                    />
                    <div className="edit-actions">
                        <button onClick={handleGuardarEdicion} className="btn-icon btn-save" title="Guardar"><FaSave /></button>
                        <button onClick={handleCancelarEdicion} className="btn-icon btn-cancel" title="Cancelar"><FaTimes /></button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="sinonimo-text">{sin}</span>
                    <div className="sinonimo-actions">
                      <button onClick={() => handleIniciarEdicion(sin)} className="btn-icon btn-edit" title="Editar"><FaEdit /></button>
                      <button onClick={() => handleEliminarClick(sin)} className="btn-icon btn-delete" title="Eliminar"><FaTrash /></button>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="empty-state">
                <p>No hay sinónimos registrados.</p>
            </div>
          )}
        </div>

        <div className="agregar-sinonimo-wrapper">
            <div className="agregar-sinonimo-form">
            <input
                type="text"
                value={nuevoSinonimo}
                onChange={(e) => setNuevoSinonimo(e.target.value)}
                placeholder="Escribir nuevo sinónimo..."
                className="input-nuevo-sinonimo" 
                onKeyDown={(e) => handleKeyDown(e, handleAgregarClick)}
            />
            <button onClick={handleAgregarClick} className="btn-agregar-icon" title="Agregar">
                <FaPlus />
            </button>
            </div>
        </div>
        
        <div className="modal-footer">
            <button onClick={onClose} className="modal-btn btn-cerrar">
            Cerrar
            </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSinonimos;