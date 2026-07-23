import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Sua instância do axios (já apontando para /api)

export default function MeusEmprestimos() {
  const navigate = useNavigate();
  const [emprestimos, setEmprestimos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // Exemplo de resgate do ID do usuário logado (Ajuste para o seu Contexto/Auth/LocalStorage)
  const usuarioId = localStorage.getItem('id') || JSON.parse(localStorage.getItem('bibliotecario_user'))?.id;

  useEffect(() => {
    if (usuarioId) {
      carregarEmprestimos();
    } else {
      setErro("Usuário não identificado. Por favor, faça login novamente.");
      setLoading(false);
    }
  }, [usuarioId]);

  const carregarEmprestimos = async () => {
    try {
      setLoading(true);
      setErro(null);
      // Chamada ao endpoint GET /api/emprestimos/{idUsuario}/usuario
      const response = await api.get(`/emprestimos/${usuarioId}/usuario`);
      setExemplaresOuEmprestimos(response.data);
    } catch (error) {
      console.error("Erro ao buscar empréstimos do usuário:", error);
      setErro("Não foi possível carregar seus empréstimos no momento.");
    } finally {
      setLoading(false);
    }
  };

  const setExemplaresOuEmprestimos = (dados) => {
    // Garante que é um array para evitar erros no .map()
    setEmprestimos(Array.isArray(dados) ? dados : []);
  };

  // Função auxiliar para formatar as datas para o padrão brasileiro (DD/MM/AAAA)
  const formatarData = (dataString) => {
    if (!dataString) return '-';
    // Lida com datas no formato ISO ou Carimbo de Data/Hora
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      timeZone: 'UTC' // Opcional: ajuste dependendo de como o backend envia a data
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl rounded-lg bg-white p-6 shadow animate-fadeIn">
        
        {/* Cabeçalho */}
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Meus Empréstimos</h1>
            <p className="text-sm text-gray-500 mt-1">
              Acompanhe o histórico e status de todos os seus livros retirados.
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')} // ou navigate(-1) para voltar
            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Voltar ao Dashboard
          </button>
        </div>

        {/* Mensagens de Erro ou Carregamento */}
        {loading && (
          <div className="py-12 text-center text-gray-500 text-sm">
            Carregando seus empréstimos...
          </div>
        )}

        {erro && (
          <div className="rounded-md bg-red-50 p-4 text-center text-sm font-semibold text-red-600 mb-4">
            {erro}
          </div>
        )}

        {/* Tabela de Empréstimos */}
        {!loading && !erro && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="p-3.5">ID do Exemplar</th>
                  <th className="p-3.5">Data de Retirada</th>
                  <th className="p-3.5">Data de Devolução</th>
                  <th className="p-3.5 text-right">Situação</th>
                </tr>
              </thead>
              <tbody>
                {emprestimos.length > 0 ? (
                  emprestimos.map((emp) => (
                    <tr key={emp.id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-3.5 font-mono font-semibold text-gray-700">
                        #{emp.exemplarId || emp.exemplar?.id || '-'}
                      </td>
                      <td className="p-3.5 text-gray-600">
                        {formatarData(emp.dataRetirada || emp.dataEmprestimo)}
                      </td>
                      <td className="p-3.5 text-gray-600">
                        {formatarData(emp.dataDevolucaoReal || emp.dataPrevistaDevolucao)}
                      </td>
                      <td className="p-3.5 text-right">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                            emp.situacao === 'DEVOLVIDO'
                              ? 'bg-green-100 text-green-800'
                              : emp.situacao === 'EMPRESTADO' || emp.situacao === 'ATIVO'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800' // Para atrasados ou outros status
                          }`}
                        >
                          {emp.situacao || 'EMPRESTADO'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500">
                      Você ainda não realizou nenhum empréstimo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}