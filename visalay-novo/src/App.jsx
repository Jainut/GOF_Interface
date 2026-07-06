import { BrowserRouter } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AppDataProvider } from './contexts/AppDataContext';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { TSEA } from './utils/theme';

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('tsea_theme') === 'dark');

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('tsea_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <AuthProvider>
      <AppDataProvider>
        <style>{`
          * { box-sizing: border-box; }
          body { margin: 0; }
          .layout-container { display: flex; height: 100vh; min-height: 100vh; overflow: hidden; font-family: sans-serif; }
          .sidebar { width: 260px; min-width: 260px; height: 100vh; position: sticky; top: 0; background-color: ${TSEA.preto}; color: white; padding: 25px 15px; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }
          .content-main { flex: 1; min-width: 0; height: 100vh; overflow-y: auto; padding: 30px; background-color: #f4f6f9; }
          .btn-sidebar { cursor: pointer; display: flex; align-items: center; margin-bottom: 5px; background: transparent; color: white; border: none; padding: 12px; text-align: left; width: 100%; font-weight: bold; border-radius: 4px; }
          .btn-sidebar:hover { background-color: rgba(255,255,255,0.1); }
          .grid-catalogo { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; margin-top: 10px; }
          .card-ferramenta { background: white; border: 1px solid ${TSEA.cinzaMedio}; border-radius: 6px; padding: 12px; display: flex; flex-direction: column; justify-content: space-between; }
          .badge-categoria { font-size: 9px; text-transform: uppercase; background: ${TSEA.cinzaClaro}; padding: 2px 5px; border-radius: 4px; font-weight: bold; width: max-content; }
          .ficha-dados { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
          .ficha-item strong { display: block; font-size: 12px; color: #666; }
          .ficha-item span { font-size: 14px; font-weight: bold; }
          .theme-toggle { position: fixed; right: 18px; bottom: 18px; z-index: 1200; width: 44px; height: 44px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.12); background: #fff; color: ${TSEA.preto}; box-shadow: 0 6px 18px rgba(0,0,0,0.16); cursor: pointer; font-weight: 800; }
          .theme-toggle:hover { transform: translateY(-1px); }
          body.dark-mode { background: #101214; color: #f4f6f8; color-scheme: dark; }
          body.dark-mode .content-main { background-color: #101214 !important; }
          body.dark-mode .sidebar { background-color: #050607 !important; border-right: 1px solid #2a2f36; }
          body.dark-mode .card-ferramenta,
          body.dark-mode main > div,
          body.dark-mode main section { color: #f4f6f8; }
          body.dark-mode input,
          body.dark-mode select,
          body.dark-mode textarea { background: #15191f !important; color: #f4f6f8 !important; border-color: #3b424c !important; }
          body.dark-mode table,
          body.dark-mode th,
          body.dark-mode td { color: #f4f6f8; border-color: #343a42 !important; }
          body.dark-mode .theme-toggle { background: #1f242b; color: #f4f6f8; border-color: #3b424c; }
          body.dark-mode [style*="background: white"],
          body.dark-mode [style*="background: TSEA"],
          body.dark-mode [style*="background-color: rgb(255, 255, 255)"],
          body.dark-mode [style*="backgroundColor: TSEA"] { background: #181d23 !important; color: #f4f6f8 !important; }
          body.dark-mode [style*="background-color: rgb(244, 246, 249)"],
          body.dark-mode [style*="backgroundColor: #f4f6f9"] { background-color: #101214 !important; }
          body.dark-mode .content-main h1,
          body.dark-mode .content-main h2,
          body.dark-mode .content-main h3,
          body.dark-mode .content-main h4,
          body.dark-mode .content-main h5,
          body.dark-mode .content-main p,
          body.dark-mode .content-main small,
          body.dark-mode .content-main label { color: #f4f6f8 !important; }
          body.dark-mode .content-main div[style*="color: rgb(26, 26, 26)"],
          body.dark-mode .content-main div[style*="color: rgb(74, 74, 74)"] { color: #f4f6f8 !important; }
          @media (max-width: 760px) {
            .layout-container { flex-direction: column; overflow: auto; }
            .sidebar { width: 100%; min-width: 0; height: auto; position: relative; }
            .content-main { height: auto; overflow: visible; padding: 18px; }
          }
        `}</style>
        <button
          className="theme-toggle no-print"
          onClick={() => setDarkMode(prev => !prev)}
          title={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
          aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
        >
          {darkMode ? '☀' : '☾'}
        </button>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppDataProvider>
    </AuthProvider>
  );
}

export default App;
