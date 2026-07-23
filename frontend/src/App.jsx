import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import VisitorRegister from './pages/VisitorRegister'; // Importação da nova página
import Dashboard from './pages/Dashboard';
import ProfileEdit from './pages/ProfileEdit';
import BooksList from './pages/BooksList';
import BookCreate from './pages/BookCreate';
import BookEdit from './pages/BookEdit';
import Loans from './pages/Loans';

const RotaProtegida = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/cadastro-visitante" element={<VisitorRegister />} />

          {/* Rotas Protegidas */}
          <Route path="/dashboard" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
          <Route path="/perfil" element={<RotaProtegida><ProfileEdit /></RotaProtegida>} />
          <Route path="/livros" element={<RotaProtegida><BooksList /></RotaProtegida>} />
          <Route path="/livros/criar" element={<RotaProtegida><BookCreate /></RotaProtegida>} />
          <Route path="/livros/editar/:isbn" element={<RotaProtegida><BookEdit /></RotaProtegida>} />
          <Route path="/livros/:isbn/emprestimos" element={<RotaProtegida><Loans /></RotaProtegida>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}