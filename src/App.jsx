import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import GestionTerminos from './pages/GestionEnfermedades';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
   <>
        <Routes>
          <Route path="/" element={<Login />} />
          
          {/* CAMBIO AQUÍ: De "/GestionTerminos" a "/gestion-enfermedades" */}
          <Route 
            path="/gestion-enfermedades" 
            element={
              <PrivateRoute>
                <GestionTerminos />
              </PrivateRoute>
            } 
          />
        </Routes>
   </>
  );
}

export default App;