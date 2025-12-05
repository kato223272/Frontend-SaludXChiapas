import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import '../styles/ModalSinonimos.css'; // Reutilizamos CSS

const ModalEnfermedad = ({ enfermedad, onClose, onGuardar }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    nivel_urgencia: 'Bajo',
    recomendacion_publica: '',
    sintomas_clave: [] // ¡Aquí guardamos la lista!
  });

  const [inputClave, setInputClave] = useState(''); // Estado temporal para el input

  // Cargar datos si estamos editando
  useEffect(() => {
    if (enfermedad) {
      setFormData({
        nombre: enfermedad.nombre,
        nivel_urgencia: enfermedad.nivel_urgencia,
        recomendacion_publica: enfermedad.recomendacion_publica,
        sintomas_clave: enfermedad.sintomas_clave || [] 
      });
    }
  }, [enfermedad]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- LÓGICA PARA SÍNTOMAS CLAVE ---
  const handleAddClave = () => {
    if (inputClave.trim()) {
      // Evitar duplicados
      if (!formData.sintomas_clave.includes(inputClave.trim())) {
        setFormData({
            ...formData,
            sintomas_clave: [...formData.sintomas_clave, inputClave.trim()]
        });
      }
      setInputClave('');
    }
  };

  const handleRemoveClave = (sintomaToRemove) => {
    setFormData({
        ...formData,
        sintomas_clave: formData.sintomas_clave.filter(s => s !== sintomaToRemove)
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Evitar que se envíe el formulario
        handleAddClave();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(formData);
  };

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-content-custom" onClick={e => e.stopPropagation()}>
        <h2>{enfermedad ? 'Editar Enfermedad' : 'Nueva Enfermedad'}</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          {/* Nombre */}
          <div>
            <label style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>Nombre:</label>
            <input 
              type="text" 
              name="nombre" 
              className="input-nuevo-sinonimo" 
              style={{ width: '100%' }}
              value={formData.nombre} 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* Urgencia */}
          <div>
            <label style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>Nivel de Urgencia:</label>
            <select 
              name="nivel_urgencia" 
              className="input-nuevo-sinonimo" 
              style={{ width: '100%', backgroundColor: 'white' }}
              value={formData.nivel_urgencia} 
              onChange={handleChange}
            >
              <option value="Bajo">Bajo</option>
              <option value="Medio">Medio</option>
              <option value="Medio-Alto">Medio-Alto</option>
              <option value="Alto">Alto</option>
            </select>
          </div>

          {/* SÍNTOMAS CLAVE (Nuevo Bloque) */}
          <div>
            <label style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>
                Síntomas Clave (Mayor peso en diagnóstico):
            </label>
            
            {/* Input + Botón Agregar */}
            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                <input 
                    type="text"
                    className="input-nuevo-sinonimo"
                    placeholder="Ej. fiebre alta"
                    value={inputClave}
                    onChange={(e) => setInputClave(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button type="button" className="modal-btn btn-agregar" onClick={handleAddClave}>
                    <FaPlus />
                </button>
            </div>

            {/* Lista de Etiquetas (Chips) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', minHeight: '30px' }}>
                {formData.sintomas_clave.length > 0 ? (
                    formData.sintomas_clave.map((tag, idx) => (
                        <div key={idx} style={{ 
                            background: '#e0f2f1', 
                            color: '#00695c', 
                            padding: '4px 10px', 
                            borderRadius: '15px',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                        }}>
                            {tag}
                            <FaTimes 
                                style={{ cursor: 'pointer' }} 
                                onClick={() => handleRemoveClave(tag)}
                            />
                        </div>
                    ))
                ) : (
                    <span style={{ color: '#aaa', fontStyle: 'italic', fontSize: '0.9rem' }}>
                        Sin síntomas clave agregados.
                    </span>
                )}
            </div>
          </div>

          {/* Recomendación */}
          <div>
            <label style={{ fontWeight: '600', marginBottom: '5px', display: 'block' }}>Recomendación Pública:</label>
            <textarea 
              name="recomendacion_publica" 
              className="input-nuevo-sinonimo" 
              style={{ width: '100%', minHeight: '100px', resize: 'vertical' }}
              value={formData.recomendacion_publica} 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="modal-btn btn-cerrar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="modal-btn btn-agregar">
              Guardar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ModalEnfermedad;