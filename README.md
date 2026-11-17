# GOF Interface

React frontend for tracking tool checkouts, returns, and inventory in industrial storerooms. It provides separate views for operators, storeroom attendants, and administrators, and receives NFC card events in real time from the [GOF API](https://github.com/Jainut/GOF_API).

## Demo

**[Try the interactive demo (in Portuguese)](https://jainut.github.io/GOF_Interface/)**

Choose **Almoxarife** (storeroom attendant), click **Simular cartão NFC** (simulate NFC card), and check out or return a tool. Switch to **Operador** (operator) to see checked-out tools or **Administrador** (administrator) to check inventory. The demo simulates the GOF API in the browser using fictional data.

## Tech stack

- React 18 and Vite
- React Router
- Socket.IO Client
- ESLint

## User roles

| Role | Route | Responsibilities |
| --- | --- | --- |
| Operator | `/operador` | Views tools checked out to them and confirms actions at the kiosk. |
| Storeroom attendant | `/almoxarife` | Records checkouts and returns after identifying the operator by NFC. |
| Administrator | `/master` | Monitors activity, users, NFC cards, and inventory. |

## Prerequisites

- Node.js 18 or later
- npm 9 or later
- A running instance of the [GOF API](https://github.com/Jainut/GOF_API)

## Installation

```bash
git clone https://github.com/Jainut/GOF_Interface.git
cd GOF_Interface
npm ci
```

## Configuration

Create a `.env` file in the project root.

```env
VITE_API_URL=https://your-api.example.com
```

`VITE_API_URL` sets the base URL for HTTP requests and the Socket.IO connection. If it is omitted, the frontend connects to its own origin.

## Run locally

```bash
npm run dev
```

Vite prints the local URL in the terminal, typically `http://localhost:5173`.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the development server. |
| `npm run build` | Builds the production app into `dist/`. |
| `npm run preview` | Serves the production build locally. |
| `npm run lint` | Checks the source code with ESLint. |

## Project structure

```text
src/
├── components/   # Dashboards and UI components for each role
├── contexts/     # Authentication and application state
├── hooks/        # Hooks for consuming React contexts
├── layouts/      # Shared layouts
├── pages/        # Page components
├── routes/       # Routing and role-based access
├── services/     # HTTP client and Socket.IO connection
└── utils/        # Theme and UI utilities
```

## Integrations

The frontend calls the API for authentication, the tool catalog, checkouts, returns, open checkouts, users, and NFC cards. It uses Socket.IO to receive operator identification events in real time.

The frontend includes credentials on HTTP requests and sends an `Authorization: Bearer <token>` header when a token is available. When the API runs on a different origin, configure the backend to allow the frontend origin and credentialed requests.

## Design

The GOF Project palette uses blue for navigation and primary actions, yellow for brand accents, and white and light blue for surfaces and backgrounds. The colors are defined in `src/utils/theme.js`.

## Deployment

The repository includes a `vercel.json` file that rewrites routes to `index.html` so React Router can handle direct visits to frontend routes. Set `VITE_API_URL` in the hosting provider’s environment before building the app.
