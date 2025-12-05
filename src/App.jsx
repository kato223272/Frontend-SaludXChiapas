import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import GestionTerminos from './pages/GestionEnfermedades';
import PrivateRoute from './components/PrivateRoute';
import Grafica from './pages/Graficas';

function App() {
  return (
   <>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/graficas"
            element={
              // <PrivateRoute>
                <Grafica />
              // </PrivateRoute>
            } 
          />
          <Route 
            path="/GestionTerminos" 
            element={
              // <PrivateRoute>
                <GestionTerminos />
              // </PrivateRoute>
            } 
          />
        </Routes>
   </>
  );
}

export default App;