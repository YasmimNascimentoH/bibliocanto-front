import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ProfileEdit() {
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [senha, setSenha] = useState('');
  const [msg, setMsg] = useState({ tipo: '', texto: '' });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = { nome, email };
      if (senha) payload.senha = senha;

      const response = await api.put(`/usuarios/${user.id}`, payload);
      loginUser({ ...user, nome, email });
      setMsg({ tipo: 'sucesso', texto: 'Dados atualizados com sucesso!' });
      setSenha('');
    } catch (error) {
      setMsg({ tipo: 'erro', texto: 'Erro ao atualizar os dados pessoais.' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-bold">Edição de Dados Pessoais</h2>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-blue-600 hover:underline">
            Voltar
          </button>
        </div>

        {msg.texto && (
          <div className={`mb-4 p-3 rounded text-sm ${msg.tipo === 'sucesso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {msg.texto}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">ID (Não editável)</label>
            <input type="text" disabled value={user?.id || ''} className="mt-1 w-full rounded bg-gray-100 p-2 text-gray-500 border" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} className="mt-1 w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Login</label>
            <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nova Senha (deixe em branco para manter a atual)</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} className="mt-1 w-full rounded border p-2" />
          </div>
          <button type="submit" className="w-full rounded bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700">
            Salvar Alterações
          </button>
        </form>
      </div>
    </div>
  );
}