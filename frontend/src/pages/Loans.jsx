import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Loans() {
  const { isbn } = useParams();
  const navigate = useNavigate();
  const [exemplares, setExemplares] = useState([]);
  
  // Controle do Modal de Empréstimo (Para livros DEVOLVIDOS)
  const [modalEmprestimoOpen, setModalEmprestimoOpen] = useState(false);
  const [selectedExemplarId, setSelectedExemplarId] = useState(null);
  const [usuarioId, setUsuarioId] = useState('');
  const [erroUsuario, setErroUsuario] = useState(false);

  // Controle do Modal de Devolução (Para livros EMPRESTADOS)
  const [modalDevolucaoOpen, setModalDevolucaoOpen] = useState(false);
  const [diasAtraso, setDiasAtraso] = useState(null);
  const [devolucaoConcluida, setDevolucaoConcluida] = useState(false);

  useEffect(() => {
    carregarExemplares();
  }, [isbn]);

  const carregarExemplares = async () => {
    try {
      const response = await api.get(`/livros/${isbn}/exemplares`);
      setExemplares(response.data);
    } catch (error) {
      console.error('Erro ao buscar exemplares:', error);
    }
  };

  // --- Ações de Empréstimo ---
  const abrirModalEmprestimo = (exemplarId) => {
    setSelectedExemplarId(exemplarId);
    setUsuarioId('');
    setErroUsuario(false);
    setModalEmprestimoOpen(true);
  };

  const realizarEmprestimo = async () => {
    if (!usuarioId.trim()) {
      setErroUsuario(true);
      return;
    }

    try {
      await api.post('/emprestimos', {
        exemplarId: selectedExemplarId,
        visitanteId: usuarioId
      });
      
      setModalEmprestimoOpen(false);
      carregarExemplares();
    } catch (error) {
      setErroUsuario(true);
    }
  };

  // --- Ações de Devolução ---
  const abrirModalDevolucao = (exemplarId) => {
    setSelectedExemplarId(exemplarId);
    setDiasAtraso(null);
    setDevolucaoConcluida(false);
    setModalDevolucaoOpen(true);
  };

  const realizarDevolucao = async () => {
    try {
      // Faz a chamada PUT passando o id do exemplar no path
      const response = await api.put(`/emprestimos/${selectedExemplarId}/devolucao`);
      
      // O backend retorna um inteiro (ex: response.data pode ser 0, 2, 5...)
      setDiasAtraso(response.data);
      setDevolucaoConcluida(true);
      
      // Recarrega a tabela no fundo para atualizar o status para DEVOLVIDO
      carregarExemplares();
    } catch (error) {
      alert('Erro ao realizar devolução do exemplar no servidor.');
    }
  };

  const fecharModalDevolucao = () => {
    setModalDevolucaoOpen(false);
    setDiasAtraso(null);
    setDevolucaoConcluida(false);
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
                    ex.situacao === 'DISPONIVEL' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {ex.situacao}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {ex.situacao === 'DISPONIVEL' && (
                    <button
                      onClick={() => abrirModalEmprestimo(ex.id)}
                      className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 font-medium transition"
                    >
                      Emprestar
                    </button>
                  )}

                  {ex.situacao === 'EMPRESTADO' && (
                    <button
                      onClick={() => abrirModalDevolucao(ex.id)}
                      className="rounded bg-orange-500 px-3 py-1 text-xs text-white hover:bg-orange-600 font-medium transition"
                    >
                      Devolver
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: Empréstimo */}
      {modalEmprestimoOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="rounded-lg bg-white p-6 shadow-lg max-w-sm w-full animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-800">Realizar Empréstimo</h3>
            <p className="text-xs text-gray-500 mt-1">Exemplar #{selectedExemplarId}</p>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">ID de Usuário</label>
              <input
                type="string"
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
              <button onClick={() => setModalEmprestimoOpen(false)} className="rounded border px-4 py-2 text-sm hover:bg-gray-100">
                Cancelar
              </button>
              <button onClick={realizarEmprestimo} className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                Realizar Empréstimo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Devolução */}
      {modalDevolucaoOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="rounded-lg bg-white p-6 shadow-lg max-w-sm w-full animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-800">Devolução de Livro</h3>
            <p className="text-xs text-gray-500 mt-1">Exemplar #{selectedExemplarId}</p>

            <div className="mt-6">
              {!devolucaoConcluida ? (
                <p className="text-sm text-gray-600">
                  Confirme a devolução deste exemplar para registrar no sistema.
                </p>
              ) : (
                // Exibe os Dias em Atraso depois que o backend processa o PUT
                <div className="rounded-md bg-gray-50 p-4 border text-center">
                  <p className="text-sm text-gray-500">Dias em Atraso:</p>
                  <p className={`text-2xl font-bold mt-1 ${diasAtraso > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {diasAtraso} {diasAtraso === 1 ? 'dia' : 'dias'}
                  </p>
                  {diasAtraso > 0 && (
                    <span className="block text-xs text-red-500 mt-1 font-semibold">
                      * Empréstimo devolvido com atraso!
                    </span>
                  )}
                  {diasAtraso === 0 && (
                    <span className="block text-xs text-green-600 mt-1 font-semibold">
                      * Empréstimo devolvido no prazo!
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              {!devolucaoConcluida ? (
                <>
                  <button onClick={fecharModalDevolucao} className="rounded border px-4 py-2 text-sm hover:bg-gray-100">
                    Cancelar
                  </button>
                  <button onClick={realizarDevolucao} className="rounded bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
                    Devolver Empréstimo
                  </button>
                </>
              ) : (
                <button onClick={fecharModalDevolucao} className="w-full rounded bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900">
                  Fechar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}