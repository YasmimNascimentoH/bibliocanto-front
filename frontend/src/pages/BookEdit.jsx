import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function BookEdit() {
  const { isbn } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [showModalExclusao, setShowModalExclusao] = useState(false);

  useEffect(() => {
    api.get(`/livros/${isbn}`).then((res) => setForm(res.data));
  }, [isbn]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    await api.put(`/livros/${isbn}`, form);
    navigate('/livros');
  };

  const handleExcluir = async () => {
    try {
      await api.delete(`/livros/${isbn}`);
      navigate('/livros');
    } catch (error) {
      alert('Erro ao excluir livro!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
        <h1 className="mb-6 border-b pb-3 text-xl font-bold">Editar Livro</h1>

        <form onSubmit={handleSalvar} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500">ISBN (Não editável)</label>
            <input type="text" disabled value={form.isbn || ''} className="w-full rounded border bg-gray-100 p-2 text-gray-500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium">Título</label>
            <input required name="titulo" value={form.titulo || ''} onChange={handleChange} className="w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-xs font-medium">Autor</label>
            <input required name="autor" value={form.autor || ''} onChange={handleChange} className="w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-xs font-medium">Editora</label>
            <input required name="editora" value={form.editora || ''} onChange={handleChange} className="w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-xs font-medium">Ano de Publicação</label>
            <input required type="date" name="anoPublicacao" value={form.anoPublicacao || ''} onChange={handleChange} className="w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-xs font-medium">Número de Páginas</label>
            <input required type="number" name="numeroPaginas" value={form.numeroPaginas || ''} onChange={handleChange} className="w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-xs font-medium">Assunto</label>
            <input required name="assunto" value={form.assunto || ''} onChange={handleChange} className="w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-xs font-medium">Quantidade de Exemplares</label>
            <input required type="number" name="quantidadeExemplares" value={form.quantidadeExemplares || ''} onChange={handleChange} className="w-full rounded border p-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium">Sinopse</label>
            <textarea required rows="3" name="sinopse" value={form.sinopse || ''} onChange={handleChange} className="w-full rounded border p-2"></textarea>
          </div>

          <div className="mt-4 flex justify-between md:col-span-2">
            <button type="button" onClick={() => setShowModalExclusao(true)} className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">
              Excluir Livro
            </button>
            <div className="flex gap-3">
              <button type="button" onClick={() => navigate('/livros')} className="rounded border px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
                Cancelar
              </button>
              <button type="submit" className="rounded bg-blue-600 px-6 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                Salvar Alterações
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Pop-up de Exclusão */}
      {showModalExclusao && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800">Confirmar Exclusão</h3>
            <p className="mt-2 text-sm text-gray-600">Tem certeza que deseja excluir permanentemente este livro?</p>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowModalExclusao(false)} className="rounded border px-4 py-2 text-sm hover:bg-gray-100">
                Não
              </button>
              <button onClick={handleExcluir} className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">
                Sim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}