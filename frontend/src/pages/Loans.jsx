import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Loans() {
  const { isbn } = useParams();
  const navigate = useNavigate();
  const [exemplares, setExemplares] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExemplarId, setSelectedExemplarId] = useState(null);
  
  // Controle do Modal
  const [usuarioId, setUsuarioId] = useState('');
  const [erroUsuario, setErroUsuario] = useState(false);

  useEffect(() => {
    carregarExemplares();
  }, [isbn]);

  const carregarExemplares = async () => {
    try {
      // Endpoint que retorna lista de exemplares de um livro
      const response = await api.get(`/livros/${isbn}/exemplares`);
      setExemplares(response.data);
    } catch (error) {
      console.error('Erro ao buscar exemplares');
    }
  };

  const abrirModalEmprestimo = (exemplarId) => {
    setSelectedExemplarId(exemplarId);
    setUsuarioId('');
    setErroUsuario(false);
    setModalOpen(true);
  };

  const realizarEmprestimo = async () => {
    if (!usuarioId.trim()) {
      setErroUsuario(true);
      return;
    }

    try {
      // Validação/Realização do Empréstimo no Backend
      await api.post('/emprestimos', {
        exemplarId: selectedExemplarId,
        usuarioId: Number(usuarioId)
      });
      
      setModalOpen(false);
      carregarExemplares(); // Recarrega a lista para atualizar o status
    } catch (error) {
      // Se o usuário não existir no backend, exibe a mensagem vermelha
      setErroUsuario(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between border-b pb-3">
          <h1 className="text-xl font-bold">Empréstimos - Exemplares (ISBN: {isbn})</h1>
          <button onClick={() => navigate('/livros')} className="text-sm text-blue-600 hover:underline">
            Voltar aos Livros
          </button>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID do Exemplar</th>
              <th className="p-3">Situação</th>
              <th className="p-3 text-right">Ação</th>
            </tr>
          </thead>
          <tbody>
            {exemplares.map((ex) => (
              <tr key={ex.id} className="border-b">
                <td className="p-3 font-semibold">#{ex.id}</td>
                <td className="p-3">
                  <span className={`rounded px-2 py-1 text-xs font-semibold ${
                    ex.situacao === 'DEVOLVIDO' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {ex.situacao}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {ex.situacao === 'DEVOLVIDO' && (
                    <button
                      onClick={() => abrirModalEmprestimo(ex.id)}
                      className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                    >
                      Emprestar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Empréstimo */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800">Realizar Empréstimo</h3>
            <p className="text-xs text-gray-500 mt-1">Exemplar #{selectedExemplarId}</p>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">ID de Usuário</label>
              <input
                type="number"
                placeholder="Digite o ID do usuário"
                value={usuarioId}
                onChange={(e) => { setUsuarioId(e.target.value); setErroUsuario(false); }}
                className="mt-1 w-full rounded border p-2 focus:outline-none focus:border-blue-500"
              />
              {erroUsuario && (
                <span className="mt-1 block text-xs font-bold text-red-600">
                  * Usuário inválido ou inexistente!
                </span>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="rounded border px-4 py-2 text-sm hover:bg-gray-100">
                Cancelar
              </button>
              <button onClick={realizarEmprestimo} className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                Realizar Empréstimo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}