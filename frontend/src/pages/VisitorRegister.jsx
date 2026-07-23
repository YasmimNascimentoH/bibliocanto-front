import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function VisitorRegister() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });

  const handleSalvar = async (e) => {
    e.preventDefault();
    setMensagem({ tipo: '', texto: '' });

    try {
      // Dispara a requisição POST /api/usuarios/visitante
      await api.post('/usuarios/visitante', {
        nome,
        email,
        senha
      });

      setMensagem({ tipo: 'sucesso', texto: 'Visitante cadastrado com sucesso! Redirecionando para o login...' });
      
      // Aguarda 1.5 segundos e redireciona para a tela de Login
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: 'Erro ao cadastrar visitante. Verifique os dados fornecidos.' });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">Cadastro de Visitante</h1>

        {mensagem.texto && (
          <div className={`mb-4 rounded p-3 text-sm ${mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSalvar} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              required
              className="mt-1 w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-1/2 rounded border py-2 font-semibold text-gray-600 hover:bg-gray-100 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-1/2 rounded bg-green-600 py-2 font-semibold text-white hover:bg-green-700 transition"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}