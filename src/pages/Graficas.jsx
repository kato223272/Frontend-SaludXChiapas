import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line 
} from 'recharts';

import { obtenerCoords } from '../data/chiapasCoordinates'; 
import '../styles/Grafica.css'; 
const CHIAPAS_CENTER = [16.75, -92.60];
const CHIAPAS_ZOOM = 7;
const CHIAPAS_BOUNDS = [[14.5321, -94.1386], [17.9887, -90.3667]];

const COLORS_PIE = ['#0f766e', '#0d9488', '#14b8a6', '#94a3b8']; 

// --- LÓGICA SEMÁFORO (Colores HEX directos para el Mapa) ---
const getSemaforoColor = (total) => {
    // ALTO RIESGO (Rojo sobrio)
    if (total >= 20) return { color: '#991b1b', fill: '#ef4444', nivel: 'ALTO' }; 
    // RIESGO MEDIO (Naranja quemado)
    if (total > 5) return { color: '#9a3412', fill: '#f97316', nivel: 'MEDIO' };   
    // RIESGO BAJO (Ocre/Amarillo)
    return { color: '#854d0e', fill: '#eab308', nivel: 'BAJO' };                    
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #e2e8f0',
        padding: '12px',
        borderRadius: '6px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        fontSize: '0.8rem',
        minWidth: '150px'
      }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: '700', color: '#334155', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
          {label}
        </p>
        {payload.map((entry, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ color: '#64748b' }}>{entry.name}:</span>
            <span style={{ fontWeight: '600', color: entry.color }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const Grafica = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/'); 
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_MINERIA = import.meta.env.VITE_API_URL;
        const resMineria = await fetch(`${API_MINERIA}/api/v1/analytics/dashboard`);
        
        if(resMineria.ok) {
            const jsonMineria = await resMineria.json();
            setData(jsonMineria);
        }
      } catch (error) {
        console.error("Error system:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

// ... dentro de Grafica.js ...

  if (loading) return (
    <div className="loading-container">
        {/* Animación de Radar */}
        <div className="surveillance-loader">
            <div className="radar-ring"></div>
            <div className="radar-ring"></div>
            <div className="radar-ring"></div>
        </div>
        
        {/* Texto Profesional */}
        <div className="loading-text">Inicializando Sistema</div>
        <div className="loading-subtext">Escaneando datos epidemiológicos...</div>
    </div>
  );

// ... resto del return ...

  return (
    <div className="grafica-page">
      <header className="grafica-header">
        <div className="header-title">
           <h2>SaludXChiapas</h2>
           <p>Sistema de Vigilancia Epidemiológica de Chiapas</p>
        </div>
        
        <div className="header-controls">
            <div className="kpi-card">
                 <span className="kpi-number">{data?.total_reportes || 0}</span>
                 <span className="kpi-label">Casos Activos</span>
            </div>
            
            <button onClick={handleLogout} className="btn-logout">
                Salir
            </button>
        </div>
      </header>

      <div className="container-fluid px-4">
        <div className="row g-4">
            
            {/* MAPA DE RIESGO */}
            <div className="col-12 col-lg-8">
                <div className="chart-card">
                    <div className="card-title">
                        <span className="card-icon">🗺️</span> Distribución Geográfica de Riesgo
                    </div>
                    <div className="map-wrapper">
                        <MapContainer 
                            center={CHIAPAS_CENTER} 
                            zoom={CHIAPAS_ZOOM} 
                            minZoom={7} 
                            maxBounds={CHIAPAS_BOUNDS} 
                            maxBoundsViscosity={1.0} 
                            style={{ height: '100%', width: '100%' }}
                        >
                            {/* Mapa base limpio (CartoDB Light) para aspecto profesional */}
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                                attribution='&copy; CARTO'
                            />
                            
                            {data?.mapa_municipios?.map((muni, idx) => {
                                const coords = obtenerCoords(muni.municipio);
                                const semaforo = getSemaforoColor(muni.total);
                                
                                // Radio discreto pero informativo
                                let radioBase = 10;
                                if (semaforo.nivel === 'MEDIO') radioBase = 14;
                                if (semaforo.nivel === 'ALTO') radioBase = 18;
                                const radio = radioBase + (muni.total * 1.2); 
                                
                                return (
                                    <CircleMarker 
                                        key={`brote-${idx}`} 
                                        center={coords} 
                                        radius={radio}
                                        pathOptions={{ 
                                            color: semaforo.color, 
                                            fillColor: semaforo.fill, 
                                            fillOpacity: 0.6, 
                                            weight: 1.5 
                                        }}
                                    >
                                        <Popup>
                                            <div style={{textAlign:'left', minWidth:'140px'}}>
                                                <strong style={{
                                                    color: '#1e293b', 
                                                    textTransform:'uppercase', 
                                                    fontSize:'0.85rem',
                                                    display:'block',
                                                    borderBottom:'1px solid #e2e8f0',
                                                    paddingBottom:'6px',
                                                    marginBottom:'8px'
                                                }}>
                                                    {muni.municipio}
                                                </strong>
                                                <div style={{fontSize:'0.8rem', color:'#64748b', marginBottom:'4px'}}>
                                                    Dx Principal: <b style={{color:'#334155'}}>{muni.predominante}</b>
                                                </div>
                                                <div style={{
                                                    marginTop:'10px', 
                                                    display:'flex', 
                                                    justifyContent:'space-between', 
                                                    alignItems:'center'
                                                }}>
                                                    <span style={{
                                                        fontSize:'0.7rem', 
                                                        background: semaforo.fill, 
                                                        color:'white', 
                                                        padding:'3px 8px', 
                                                        borderRadius:'4px',
                                                        fontWeight: '600'
                                                    }}>
                                                        RIESGO {semaforo.nivel}
                                                    </span>
                                                    <b style={{fontSize:'1.1rem', color: semaforo.color}}>
                                                        {muni.total}
                                                    </b>
                                                </div>
                                            </div>
                                        </Popup>
                                    </CircleMarker>
                                )
                            })}
                        </MapContainer>
                    </div>
                </div>
            </div>

            {/* PANEL LATERAL */}
            <div className="col-12 col-lg-4 d-flex flex-column gap-4">
                
                {/* Panel de Acción */}
                <div className="action-card">
                    <h5>Base de Conocimiento</h5>
                    <p>Administración del catálogo de vectores y sintomatología clínica.</p>
                    <button onClick={() => navigate('/GestionTerminos')} className="btn-gestion">
                        Administrar Catálogo
                    </button>
                </div>
                
                {/* Gráfica Circular (Pie) */}
                <div className="chart-card flex-grow-1">
                    <div className="card-title">
                    Demografía por Sexo
                    </div>
                    <div className="chart-container-small">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data?.genero_stats}
                                    cx="50%" cy="50%"
                                    innerRadius={70} outerRadius={90}
                                    paddingAngle={2} dataKey="value"
                                >
                                    {data?.genero_stats?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} stroke="none"/>
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* GRÁFICAS INFERIORES */}
            <div className="col-md-6">
                <div className="chart-card">
                    <div className="card-title">
                         Análisis Clínico (Edad/Peso)
                    </div>
                    <div className="chart-container">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.edad_peso_stats} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis 
                                    dataKey="enfermedad" 
                                    tick={{fontSize: 11, fill: '#64748b'}} 
                                    axisLine={false} 
                                    tickLine={false}
                                />
                                <YAxis 
                                    tick={{fontSize: 11, fill: '#64748b'}} 
                                    axisLine={false} 
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} /> 
                                <Legend iconType="square"/>
                                <Bar dataKey="edad_promedio" name="Edad Prom." fill="#0f766e" radius={[4, 4, 0, 0]} maxBarSize={50} />
                                <Bar dataKey="peso_promedio" name="Peso (kg)" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <div className="chart-card">
                    <div className="card-title">
                        Curva Epidemiológica
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data?.tendencia_diaria}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0"/>
                                <XAxis 
                                    dataKey="fecha" 
                                    tick={{fontSize: 11, fill: '#64748b'}} 
                                    axisLine={false} 
                                    tickLine={false}
                                />
                                <YAxis 
                                    allowDecimals={false} 
                                    tick={{fontSize: 11, fill: '#64748b'}} 
                                    axisLine={false} 
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} /> 
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="casos" 
                                    name="Reportes"
                                    stroke="#ea580c" 
                                    strokeWidth={3} 
                                    dot={{r: 4, strokeWidth: 0, fill: '#ea580c'}}
                                    activeDot={{r: 6}}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default Grafica;