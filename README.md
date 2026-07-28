# GOF Project

Frontend web para controle de empréstimo, devolução e acompanhamento de ferramentas. A aplicação oferece interfaces separadas para operador, almoxarife e administrador geral, com integração à API e eventos NFC em tempo real.

## Tecnologias

- React 18 e Vite
- React Router
- Socket.IO Client
- ESLint

## Perfis de acesso

| Perfil | Rota | Responsabilidade |
| --- | --- | --- |
| Operador | `/operador` | Consulta itens sob custódia e confirma ações pelo totem. |
| Almoxarife | `/almoxarife` | Registra empréstimos e devoluções após identificação NFC. |
| Administrador geral | `/master` | Acompanha dados, usuários, cartões NFC e estoque. |

## Pré-requisitos

- Node.js 18 ou superior
- npm 9 ou superior
- API GOF Project disponível

## Instalação

```bash
git clone <url-do-repositorio>
cd GOF_Interface
npm ci
```

## Configuração

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=https://sua-api.exemplo.com
```

`VITE_API_URL` define a URL-base das requisições HTTP e da conexão Socket.IO. Quando omitida, as requisições são feitas para a mesma origem da aplicação.

## Executando localmente

```bash
npm run dev
```

O Vite exibirá no terminal o endereço local da aplicação, normalmente `http://localhost:5173`.

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Gera o build de produção em `dist/`. |
| `npm run preview` | Serve localmente o build de produção. |
| `npm run lint` | Executa a validação de código com ESLint. |

## Estrutura do projeto

```text
src/
├── components/   # Painéis e componentes visuais por perfil
├── contexts/     # Estado de autenticação e dados da aplicação
├── hooks/        # Hooks para consumo dos contexts
├── layouts/      # Layouts compartilhados
├── pages/        # Páginas associadas às rotas
├── routes/       # Rotas e proteção por perfil
├── services/     # Cliente HTTP e conexão Socket.IO
└── utils/        # Tema e utilitários visuais
```

## Integrações

O frontend consome a API para autenticação, catálogo de ferramentas, empréstimos, devoluções, ativos, usuários e cartões NFC. O Socket.IO é utilizado para receber a identificação NFC do operador em tempo real.

O token de autenticação é enviado como `Bearer token` nas requisições protegidas. Ao alterar a URL da API, confirme que CORS e credenciais estejam liberados pelo backend.

## Design

A identidade visual utiliza a paleta GOF Project:

- Azul: ações principais e navegação
- Amarelo: destaques da marca
- Branco e tons claros de azul: superfícies e fundos

As cores estão centralizadas em `src/utils/theme.js`.

## Deploy

O projeto inclui `vercel.json` com fallback para `index.html`, necessário para que as rotas do React Router funcionem em produção. Antes de publicar, configure `VITE_API_URL` nas variáveis de ambiente do provedor de hospedagem.
