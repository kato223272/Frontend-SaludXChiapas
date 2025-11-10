// src/App.jsx
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import PanelAdministrativo from './pages/panelAdministrativo';

import Navbar from './components/Navbar'; 

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const routeTitles = {
    '/': 'Bienvenido',
    '/administrativo': 'Panel Administrativo'
  };

  const currentTitle = routeTitles[location.pathname] || 'Página';
  const handleBack = () => navigate(-1); 

  const showNavbar = location.pathname !== '/';

  return (
    <div>
      {showNavbar && <Navbar title={currentTitle} onBack={handleBack} />}

      <main>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route path="/administrativo" element={<PanelAdministrativo />} />
        
        </Routes>
      </main>
    </div>
  );
}

export default App;