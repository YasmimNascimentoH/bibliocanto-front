import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function BookCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    titulo: '', autor: '', editora: '', anoPublicacao: '',
    isbn: '', numeroPaginas: '', assunto: '', sinopse: '', quantidadeExemplares: ''
  });
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        isbn: Number(form.isbn),
        numeroPaginas: Number(form.numeroPaginas),
        quantidadeExemplares: Number(form.quantidadeExemplares)
      };
      await api.post('/livros', payload);
      navigate('/livros');
    } catch (error) {
      setErro('Erro ao salvar o livro. Verifique os dados fornecidos.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow">
        <h1 className="mb-6 border-b pb-3 text-xl font-bold">Criar Novo Livro</h1>
        
        {erro && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">{erro}</div>}

        <form onSubmit={handleSalvar} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-xs font-medium">Título</label>
            <input required name="titulo" onChange={handleChange} className="w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-xs font-medium">Autor</label>
            <input required name="autor" onChange={handleChange} className="w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-xs font-medium">Editora</label>
            <input required name="editora" onChange={handleChange} className="w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-xs font-medium">Ano de Publicação</label>
            <input required type="date" name="anoPublicacao" onChange={handleChange} className="w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-xs font-medium">ISBN</label>
            <input required type="number" name="isbn" onChange={handleChange} className="w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-xs font-medium">Número de Páginas</label>
            <input required type="number" name="numeroPaginas" onChange={handleChange} className="w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-xs font-medium">Assunto</label>
            <input required name="assunto" onChange={handleChange} className="w-full rounded border p-2" />
          </div>
          <div>
            <label className="block text-xs font-medium">Quantidade de Exemplares</label>
            <input required type="number" name="quantidadeExemplares" onChange={handleChange} className="w-full rounded border p-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium">Sinopse</label>
            <textarea required rows="3" name="sinopse" onChange={handleChange} className="w-full rounded border p-2"></textarea>
          </div>

          <div className="mt-4 flex justify-end gap-3 md:col-span-2">
            <button type="button" onClick={() => navigate('/livros')} className="rounded border px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
              Cancelar
            </button>
            <button type="submit" className="rounded bg-green-600 px-6 py-2 text-sm font-semibold text-white hover:bg-green-700">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}