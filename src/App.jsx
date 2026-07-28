import { BrowserRouter } from 'react-router-dom';
import { AppDataProvider } from './contexts/AppDataContext';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { GOF_PROJECT } from './utils/theme';

function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <style>{`
          * { box-sizing: border-box; }
          html, body, #root { min-width: 100%; min-height: 100%; margin: 0; }
          body { background-color: #F1F7FD; overflow-x: hidden; }
          button, input, select { font: inherit; }
          .layout-container { display: flex; width: 100%; min-height: 100vh; font-family: sans-serif; background-color: #F1F7FD; }
          .sidebar { width: 260px; min-height: 100vh; background-color: ${GOF_PROJECT.azulEscuro}; color: white; padding: 25px 15px; display: flex; flex-direction: column; justify-content: space-between; flex: 0 0 260px; }
          .content-main { flex: 1 1 auto; min-width: 0; width: 100%; padding: 30px; background-color: #F1F7FD; overflow-x: hidden; }
          .btn-sidebar { cursor: pointer; display: flex; align-items: center; margin-bottom: 5px; background: transparent; color: white; border: none; padding: 12px; text-align: left; width: 100%; font-weight: bold; border-radius: 4px; }
          .btn-sidebar:hover { background-color: rgba(255,255,255,0.1); }
          .grid-catalogo { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; margin-top: 10px; }
          .card-ferramenta { background: white; border: 1px solid ${GOF_PROJECT.azulClaro}; border-radius: 6px; padding: 12px; display: flex; flex-direction: column; justify-content: space-between; }
          .badge-categoria { font-size: 9px; text-transform: uppercase; background: ${GOF_PROJECT.azulMuitoClaro}; padding: 2px 5px; border-radius: 4px; font-weight: bold; width: max-content; }
          .ficha-dados { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
          .ficha-item strong { display: block; font-size: 12px; color: #666; }
          .ficha-item span { font-size: 14px; font-weight: bold; }
          table { min-width: 720px; }
          @media (max-width: 900px) {
            .layout-container { flex-direction: column; }
            .sidebar { width: 100%; min-height: auto; flex: 0 0 auto; }
            .content-main { padding: 18px; }
            .btn-sidebar { justify-content: flex-start; }
          }
          @media (max-width: 560px) {
            .content-main { padding: 12px; }
            .grid-catalogo { grid-template-columns: 1fr; }
          }
        `}</style>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppDataProvider>
    </AuthProvider>
  );
}

export default App;
