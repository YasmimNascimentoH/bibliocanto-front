# 📚 Sistema de Gestão de Biblioteca (Empréstimos e Devoluções)

Um sistema web responsivo desenvolvido para facilitar a administração de acervos de livros, controle de exemplares, gestão de usuários e fluxo de empréstimos e devoluções.

O sistema possui foco em usabilidade, permitindo buscas dinâmicas em tempo real, validações de regras de negócio (como controle de dias em atraso) e interfaces dedicadas para o administrador da biblioteca e para os leitores.

----------------------------------------------------------------------

## 🚀 Funcionalidades Principais

- **Gestão de Livros e Exemplares:** Visualização de acervo e controle individual de exemplares.
- **Controle de Situação:** Monitoramento em tempo real de exemplares (`DISPONÍVEL`, `EMPRESTADO`).
- **Controle de Empréstimo:**
  - Busca interativa de usuários por nome em ordem alfabética.
  - Registro simplificado vinculando o exemplar ao usuário.
- **Fluxo de Devolução:**
  - Cálculo e registro de **Dias em Atraso**.
  - Atualização automática de status de pendências com alertas visuais (No Prazo vs. Atrasado).
- **Portal do Usuário (Leitor):**
  - Dashboard interativo para todos os perfis de usuário.
  - Página dedicada **"Meus Empréstimos"**, contendo histórico completo com datas de retirada, devolução.
  - Vizualização de Livros e Exemplares Disponiveis no Acervo.

------------------------------------------------------------------------------------

## 🛠️ Tecnologias, Frameworks e Bibliotecas

| Tecnologia / Biblioteca | Categoria | Para que é utilizada no projeto |
| :--- | :--- | :--- |
| **[React](https://react.dev/)** | Framework / Biblioteca Principal | A base de toda a interface. Permite a criação de componentes (modais, tabelas, dashboards) e o gerenciamento de estados dinâmicos (livros, empréstimos, buscas). |
| **[Vite](https://vitejs.dev/)** *(ou Create React App)* | Build Tool / Bundler | Ferramenta moderna e rápida utilizada para compilar o código React, gerenciar o servidor de desenvolvimento local e otimizar o projeto para produção. |
| **[React Router Dom](https://reactrouter.com/)** | Roteamento / Navegação | Responsável pela navegação entre as páginas (ex: Dashboard $\rightarrow$ Empréstimos $\rightarrow$ Meus Empréstimos) e pela captura de parâmetros na URL (como o `isbn` através do `useParams`). |
| **[Tailwind CSS](https://tailwindcss.com/)** | Estilização (CSS) | Framework de CSS utilitário que permite criar toda a interface moderna, responsiva, modais estruturados e *badges* de status coloridas (verde, amarelo, azul, vermelho) diretamente no JSX. |
| **[Axios](https://axios-http.com/)** | Cliente HTTP | Biblioteca utilizada para fazer a comunicação assíncrona (requisições `GET`, `POST`, `PUT`) entre a interface e o backend (API RESTful), como buscar exemplares ou registrar devoluções. |
| **[JavaScript (ES6+)](https://developer.mozilla.org/)** | Linguagem Base | Linguagem utilizada para implementar a lógica de ordenação alfabética (`localeCompare`), busca em tempo real (`filter` + `includes`), e formatação de datas (`toLocaleDateString`). |

------------------------------------------------------------------------------------

## 📂 Estrutura Padrão de Endpoints da API (Backend)

O frontend consome uma API RESTful estruturada com os seguintes endpoints principais:

* `GET /api/livros/{isbn}/exemplares` - Lista todos os exemplares de um livro específico.
* `GET /api/usuarios` - Retorna a lista de usuários para o modal de empréstimos.
* `POST /api/emprestimos` - Cria um novo vínculo de empréstimo (recebe `exemplarId` e `visitanteId`).
* `PUT /api/emprestimos/{idExemplar}/devolucao` - Efetua a devolução de um exemplar (recebe/calcula dias de atraso).
* `GET /api/emprestimos/{idUsuario}/usuario` - Lista o histórico completo de empréstimos do leitor logado.

---

## 💻 Como Rodar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) instalado (versão 16 ou superior recomendada).
- Um gerenciador de pacotes como `npm` ou `yarn`.

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
   cd seu-repositorio
