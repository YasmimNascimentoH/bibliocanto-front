import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function BookDetail() {
  const { isbn } = useParams();
  const navigate = useNavigate();
  const [livro, setLivro] = useState(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    api.get(`/livros/${isbn}`)
      .then((res) => setLivro(res.data))
      .catch((err) => {
        console.error('Erro ao carregar detalhes do livro:', err);
        setErro(true);
      });
  }, [isbn]);

  if (erro) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <p className="text-red-600 font-semibold mb-4">Erro ao carregar as informações do livro.</p>
        <button onClick={() => navigate('/visualizar-livros')} className="rounded bg-blue-600 px-4 py-2 text-white text-sm">
          Voltar para a lista
        </button>
      </div>
    );
  }

  if (!livro) {
    return <div className="min-h-screen bg-gray-50 p-8 text-center text-gray-500">Carregando informações...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow">
        <div className="mb-6 flex items-center justify-between border-b pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">{livro.assunto}</span>
            <h1 className="text-2xl font-bold text-gray-800 mt-1">{livro.titulo}</h1>
          </div>
          <button
            onClick={() => navigate('/visualizar-livros')}
            className="rounded border px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition"
          >
            Voltar
          </button>
        </div>

        {/* Grade de Atributos */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 bg-gray-50 p-6 rounded-lg border mb-6 text-sm">
          <div>
            <p className="text-xs font-medium text-gray-500">Autor</p>
            <p className="font-semibold text-gray-800 text-base">{livro.autor}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Editora</p>
            <p className="font-semibold text-gray-800 text-base">{livro.editora}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Ano de Publicação</p>
            <p className="text-gray-800">{livro.anoPublicacao}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">ISBN</p>
            <p className="text-gray-800">{livro.isbn}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Número de Páginas</p>
            <p className="text-gray-800">{livro.numeroPaginas} páginas</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500">Exemplares</p>
            <p className="font-semibold text-green-700">{livro.quantidadeExemplares} unidades</p>
          </div>
        </div>

        {/* Sinopse / Descrição */}
        <div>
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Sinopse do Livro</h3>
          <p className="text-gray-600 leading-relaxed text-sm bg-white p-4 rounded border">
            {livro.sinopse || 'Nenhuma sinopse cadastrada para este livro.'}
          </p>
        </div>
      </div>
    </div>
  );
}