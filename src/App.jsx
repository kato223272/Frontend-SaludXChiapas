import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';

function App() {
  return (
    <div>
      <div className="">
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
