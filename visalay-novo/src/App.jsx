import { BrowserRouter } from 'react-router-dom';
import { AppDataProvider } from './contexts/AppDataContext';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { TSEA } from './utils/theme';

function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <style>{`
          .layout-container { display: flex; min-height: 100vh; font-family: sans-serif; }
          .sidebar { width: 260px; background-color: ${TSEA.preto}; color: white; padding: 25px 15px; display: flex; flex-direction: column; justify-content: space-between; }
          .content-main { flex: 1; padding: 30px; background-color: #f4f6f9; }
          .btn-sidebar { cursor: pointer; display: flex; align-items: center; margin-bottom: 5px; background: transparent; color: white; border: none; padding: 12px; text-align: left; width: 100%; font-weight: bold; border-radius: 4px; }
          .btn-sidebar:hover { background-color: rgba(255,255,255,0.1); }
          .grid-catalogo { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; margin-top: 10px; }
          .card-ferramenta { background: white; border: 1px solid ${TSEA.cinzaMedio}; border-radius: 6px; padding: 12px; display: flex; flex-direction: column; justify-content: space-between; }
          .badge-categoria { font-size: 9px; text-transform: uppercase; background: ${TSEA.cinzaClaro}; padding: 2px 5px; border-radius: 4px; font-weight: bold; width: max-content; }
          .ficha-dados { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
          .ficha-item strong { display: block; font-size: 12px; color: #666; }
          .ficha-item span { font-size: 14px; font-weight: bold; }
        `}</style>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppDataProvider>
    </AuthProvider>
  );
}

export default App;
