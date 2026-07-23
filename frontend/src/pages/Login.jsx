import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Login() {
  const [email, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const response = await api.post('/auth/login', { email, senha });

      if (response.data && response.data.id) {
        loginUser(response.data);
        navigate('/dashboard');
      } else {
        setErro('Usuário não encontrado ou credenciais inválidas.');
      }
    } catch (error) {
      setErro('Erro ao autenticar: Usuário inexistente ou erro no servidor.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Acesso - Bibliotecário</h1>
        
        {erro && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{erro}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Login</label>
            <input
              type="text"
              required
              className="mt-1 w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              required
              className="mt-1 w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          
          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 transition"
          >
            Entrar
          </button>

          {/* Botão de Cadastro de Visitante adicionado abaixo do botão Entrar */}
          <button
            type="button"
            onClick={() => navigate('/cadastro-visitante')}
            className="w-full rounded border border-blue-600 py-2 font-semibold text-blue-600 hover:bg-blue-50 transition"
          >
            Cadastro de Visitante
          </button>
        </form>
      </div>
    </div>
  );
}