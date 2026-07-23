import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function BooksView() {
  const [livros, setLivros] = useState([]);
  const [busca, setBusca] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    carregarLivros();
  }, []);

  const carregarLivros = async () => {
    try {
      const response = await api.get('/livros');
      const livrosOrdenados = response.data.sort((a, b) => 
        a.titulo.localeCompare(b.titulo)
      );
      setLivros(livrosOrdenados);
    } catch (error) {
      console.error('Erro ao buscar livros para visualização:', error);
    }
  };

  const livrosFiltrados = livros.filter((livro) =>
    livro.titulo.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl rounded-lg bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Acervo da Biblioteca</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded border px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition"
          >
            Voltar ao Dashboard
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por título do livro..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full rounded border p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 w-1/4">Título</th>
                <th className="p-3 w-1/3">Descrição</th>
                <th className="p-3">Assunto</th>
                <th className="p-3">Autor</th>
                <th className="p-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {livrosFiltrados.length > 0 ? (
                livrosFiltrados.map((livro) => (
                  <tr key={livro.isbn} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-semibold text-gray-800">{livro.titulo}</td>
                    <td className="p-3 text-gray-600 text-xs">
                      {livro.sinopse ? (livro.sinopse.length > 80 ? livro.sinopse.substring(0, 80) + '...' : livro.sinopse) : 'Sem descrição disponível.'}
                    </td>
                    <td className="p-3 text-gray-600">
                      <span className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                        {livro.assunto}
                      </span>
                    </td>
                    <td className="p-3 text-gray-600">{livro.autor}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => navigate(`/visualizar-livros/${livro.isbn}`)}
                        className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition whitespace-nowrap"
                      >
                        Saiba mais
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    Nenhum livro encontrado no acervo.
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