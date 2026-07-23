import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import VisitorRegister from './pages/VisitorRegister';
import Dashboard from './pages/Dashboard';
import ProfileEdit from './pages/ProfileEdit';
import BooksList from './pages/BooksList';
import BookCreate from './pages/BookCreate';
import BookEdit from './pages/BookEdit';
import Loans from './pages/Loans';
import BooksView from './pages/BooksView';    
import BookDetail from './pages/BookDetail';   
import MeusEmprestimos from './pages/MeusEmprestimos';

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

          {/* Rotas Protegidas - Gerais */}
          <Route path="/dashboard" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
          <Route path="/perfil" element={<RotaProtegida><ProfileEdit /></RotaProtegida>} />
          <Route path="/meus-emprestimos" element={<MeusEmprestimos />} />

          {/* Rotas Protegidas - Bibliotecário */}
          <Route path="/livros" element={<RotaProtegida><BooksList /></RotaProtegida>} />
          <Route path="/livros/criar" element={<RotaProtegida><BookCreate /></RotaProtegida>} />
          <Route path="/livros/editar/:isbn" element={<RotaProtegida><BookEdit /></RotaProtegida>} />
          <Route path="/livros/:isbn/emprestimos" element={<RotaProtegida><Loans /></RotaProtegida>} />

          {/* Rotas Protegidas - Visitante */}
          <Route path="/visualizar-livros" element={<RotaProtegida><BooksView /></RotaProtegida>} />
          <Route path="/visualizar-livros/:isbn" element={<RotaProtegida><BookDetail /></RotaProtegida>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}