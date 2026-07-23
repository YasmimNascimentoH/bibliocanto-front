import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  // Verifica de forma segura se o usuário logado é um visitante
  const isVisitante = user?.tipo?.toLowerCase() === 'visitante' || user?.role?.toLowerCase() === 'visitante';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow">
        <div className="flex items-center justify-between border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Bem-vindo(a), <span className="text-blue-600">{user?.nome || 'Usuário'}</span>
          </h1>
          <button
            onClick={() => { logoutUser(); navigate('/'); }}
            className="text-sm text-red-500 hover:underline font-semibold"
          >
            Sair
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Opção disponível para AMBOS os tipos de usuário */}
          <button
            onClick={() => navigate('/perfil')}
            className="flex flex-col items-center justify-center rounded-lg border-2 border-blue-500 p-6 transition hover:bg-blue-50 text-center"
          >
            <span className="text-lg font-semibold text-blue-700">Edição de dados pessoais</span>
            <span className="mt-1 text-xs text-gray-500">Alterar nome, login ou senha</span>
          </button>

          {/* Botão para visualizar os empréstimos */}
          <button
          onClick={() => navigate('/meus-emprestimos')}
          className="flex flex-col items-center justify-center rounded-lg border-2 border-blue-500 p-6 transition hover:bg-blue-50 text-center"
        >
          <span className="text-lg font-semibold text-blue-700">Visualizar empréstimos</span>
          <span className="mt-1 text-xs text-gray-500">Historico dos meus empréstimos</span>
        </button>

          {/* Exibição condicional baseada no tipo de usuário */}
          {isVisitante ? (
            <button
              onClick={() => navigate('/visualizar-livros')}
              className="flex flex-col items-center justify-center rounded-lg border-2 border-green-500 p-6 transition hover:bg-green-50 text-center"
            >
              <span className="text-lg font-semibold text-green-700">Visualizar Livros</span>
              <span className="mt-1 text-xs text-gray-500">Consultar o acervo e detalhes dos livros</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/livros')}
              className="flex flex-col items-center justify-center rounded-lg border-2 border-green-500 p-6 transition hover:bg-green-50 text-center"
            >
              <span className="text-lg font-semibold text-green-700">Gerenciar livros</span>
              <span className="mt-1 text-xs text-gray-500">Listar, cadastrar, editar e emprestar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}