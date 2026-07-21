import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function BooksList() {
  const [livros, setLivros] = useState([]);
  const [busca, setBusca] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    carregarLivros();
  }, []);

  const carregarLivros = async () => {
    try {
      const response = await api.get('/livros');
      // Ordenação por ordem alfabética do Título
      const livrosOrdenados = response.data.sort((a, b) => 
        a.titulo.localeCompare(b.titulo)
      );
      setLivros(livrosOrdenados);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
    }
  };

  const livrosFiltrados = livros.filter((livro) =>
    livro.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl rounded-lg bg-white p-6 shadow">
        <div className="mb-6 flex flex-col justify-between gap-4 border-b pb-4 md:flex-row md:items-center">
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Livros</h1>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="rounded border px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              Voltar ao Dashboard
            </button>
            <button
              onClick={() => navigate('/livros/criar')}
              className="rounded bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              + Incluir livro
            </button>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por nome do livro..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">Título</th>
                <th className="p-3">Autor</th>
                <th className="p-3">Assunto</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {livrosFiltrados.length > 0 ? (
                livrosFiltrados.map((livro) => (
                  <tr key={livro.isbn} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">{livro.titulo}</td>
                    <td className="p-3 text-gray-600">{livro.autor}</td>
                    <td className="p-3 text-gray-600">{livro.assunto}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => navigate(`/livros/editar/${livro.isbn}`)}
                        className="rounded bg-blue-500 px-3 py-1 text-xs text-white hover:bg-blue-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => navigate(`/livros/${livro.isbn}/emprestimos`)}
                        className="rounded bg-purple-500 px-3 py-1 text-xs text-white hover:bg-purple-600"
                      >
                        Empréstimo
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    Nenhum livro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}