import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Loans() {
  const { isbn } = useParams();
  const navigate = useNavigate();
  const [exemplares, setExemplares] = useState([]);
  
  // Controle do Modal de Empréstimo (Para livros DEVOLVIDOS/DISPONÍVEIS)
  const [modalEmprestimoOpen, setModalEmprestimoOpen] = useState(false);
  const [selectedExemplarId, setSelectedExemplarId] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [buscaUsuario, setBuscaUsuario] = useState('');
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
  const carregarUsuarios = async () => {
    try {
      const response = await api.get('/usuarios');
      // Ordena por ordem alfabética do Nome
      const usuariosOrdenados = response.data.sort((a, b) => 
        (a.nome || '').localeCompare(b.nome || '')
      );
      setUsuarios(usuariosOrdenados);
    } catch (error) {
      console.error('Erro ao carregar lista de usuários:', error);
      setErroUsuario(true);
    }
  };

  const abrirModalEmprestimo = (exemplarId) => {
    setSelectedExemplarId(exemplarId);
    setBuscaUsuario('');
    setErroUsuario(false);
    setModalEmprestimoOpen(true);
    carregarUsuarios(); // Busca e ordena os usuários ao abrir o modal
  };

  const realizarEmprestimo = async (usuarioSelecionadoId) => {
    try {
      await api.post('/emprestimos', {
        exemplarId: selectedExemplarId,
        visitanteId: usuarioSelecionadoId
      });
      
      setModalEmprestimoOpen(false);
      carregarExemplares();
    } catch (error) {
      console.error('Erro ao realizar empréstimo:', error);
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

  const fecharModalDevolucao = () => {
    setModalDevolucaoOpen(false);
    setDiasAtraso(null);
    setDevolucaoConcluida(false);
  };

  const realizarDevolucao = async () => {
    try {
      const response = await api.put(`/emprestimos/${selectedExemplarId}/devolucao`);
      setDiasAtraso(response.data);
      setDevolucaoConcluida(true);
      carregarExemplares();
    } catch (error) {
      alert('Erro ao realizar devolução do exemplar no servidor.');
    }
  };

  // Filtra a lista de usuários com base na busca por nome
  const usuariosFiltrados = usuarios.filter((u) =>
    (u.nome || '').toLowerCase().includes(buscaUsuario.toLowerCase())
  );

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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          {/* Modal mais largo (max-w-xl) para comportar a tabela confortavelmente */}
          <div className="rounded-lg bg-white p-6 shadow-lg max-w-xl w-full max-h-[85vh] flex flex-col animate-fadeIn">
            <div className="flex justify-between items-center border-b pb-2">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Realizar Empréstimo</h3>
                <p className="text-xs text-gray-500">Exemplar #{selectedExemplarId}</p>
              </div>
              <button 
                onClick={() => setModalEmprestimoOpen(false)} 
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            {/* Campo de busca */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Buscar usuário por nome..."
                value={buscaUsuario}
                onChange={(e) => { setBuscaUsuario(e.target.value); setErroUsuario(false); }}
                className="w-full rounded border p-2 text-sm focus:outline-none focus:border-blue-500"
              />
              {erroUsuario && (
                <span className="mt-1 block text-xs font-bold text-red-600">
                  * Ocorreu um erro ao carregar ou processar o empréstimo!
                </span>
              )}
            </div>

            {/* Tabela de usuários (com rolagem) */}
            <div className="mt-4 flex-1 overflow-y-auto border rounded max-h-60">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="p-2.5 w-20">ID</th>
                    <th className="p-2.5">Nome</th>
                    <th className="p-2.5 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.length > 0 ? (
                    usuariosFiltrados.map((u) => (
                      <tr key={u.id} className="border-b hover:bg-gray-50">
                        <td className="p-2.5 font-mono text-xs text-gray-500">#{u.id}</td>
                        <td className="p-2.5 font-medium text-gray-800">{u.nome}</td>
                        <td className="p-2.5 text-right">
                          <button
                            onClick={() => realizarEmprestimo(u.id)}
                            className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 whitespace-nowrap transition"
                          >
                            Realizar Empréstimo
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-6 text-center text-gray-500 text-xs">
                        Nenhum usuário encontrado com o nome pesquisado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end pt-2 border-t">
              <button 
                onClick={() => setModalEmprestimoOpen(false)} 
                className="rounded border px-4 py-2 text-sm hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Devolução */}
      {modalDevolucaoOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="rounded-lg bg-white p-6 shadow-lg max-w-sm w-full animate-fadeIn">
            <h3 className="text-lg font-bold text-gray-800">Devolução de Livro</h3>
            <p className="text-xs text-gray-500 mt-1">Exemplar #{selectedExemplarId}</p>

            <div className="mt-6">
              {!devolucaoConcluida ? (
                <p className="text-sm text-gray-600">
                  Confirme a devolução deste exemplar para registrar no sistema.
                </p>
              ) : (
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
                  <button onClick={fecharModalDevolucao} className="rounded border px-4 py-2 text-sm hover:bg-gray-100 transition">
                    Cancelar
                  </button>
                  <button onClick={realizarDevolucao} className="rounded bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition">
                    Devolver Empréstimo
                  </button>
                </>
              ) : (
                <button onClick={fecharModalDevolucao} className="w-full rounded bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 transition">
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