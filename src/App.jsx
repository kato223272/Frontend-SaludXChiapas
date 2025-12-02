import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import GestionTerminos from './pages/GestionEnfermedades';

function App() {


  return (
   <>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/GestionTerminos" element={<GestionTerminos />} />
        </Routes>
   </>
  );
}

export default App;