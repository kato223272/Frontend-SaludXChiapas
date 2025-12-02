import React from 'react';
import { FaSearch } from 'react-icons/fa'; 
import '../styles/BarraBusqueda.css';

const BarraBusqueda = ({ placeholder, value, onChange }) => {
  return (
    <div className="search-bar-container">
      <FaSearch className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default BarraBusqueda;