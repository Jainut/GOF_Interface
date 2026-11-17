import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../hooks/useAppData';
import { useAuth } from '../hooks/useAuth';
import { demoActivity, simulateCard } from './demoApi';

const profiles = [
  { id: 'adm', route: '/almoxarife', label: 'Almoxarife', description: 'Simule a leitura do cartão, escolha uma ferramenta e registre a saída e a devolução.' },
  { id: 'func', route: '/operador', label: 'Operador', description: 'Consulte as ferramentas em sua custódia e confira o que mudou após uma retirada.' },
  { id: 'superadmin', route: '/master', label: 'Administrador', description: 'Acompanhe estoque, empréstimos ativos, usuários e cartões vinculados.' }
];

function useDemoProfiles() {
  const navigate = useNavigate();
  const { perfilLogado, loginOperador, loginAlmoxarife, loginSuperAdmin } = useAuth();
  const { limparSessaoVisual, setAbaAtiva, setAbaAtivaAdm, setAbaAtivaSuper } = useAppData();

  async function enter(profile) {
    if (perfilLogado !== profile.id) {
      limparSessaoVisual();
      setAbaAtiva('custodia');
      setAbaAtivaAdm('dashboard');
      setAbaAtivaSuper('dashboard');
      if (profile.id === 'adm') await loginAlmoxarife({});
      if (profile.id === 'func') loginOperador();
      if (profile.id === 'superadmin') await loginSuperAdmin({});
    }
    navigate(profile.route);
  }

  return { enter, perfilLogado };
}

export function DemoBar() {
  const { enter, perfilLogado } = useDemoProfiles();
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const remember = ({ detail }) => setActivity((previous) => [detail, ...previous].slice(0, 30));
    demoActivity.addEventListener('entry', remember);
    return () => demoActivity.removeEventListener('entry', remember);
  }, []);

  return (
    <aside className="gof-demo" aria-label="Controles da demonstração">
      <style>{styles}</style>
      <div className="gof-demo-toolbar">
        <div><strong>GOF Project</strong><small>DEMO COM DADOS FICTÍCIOS</small></div>
        <div className="gof-demo-actions">
          {perfilLogado && profiles.map((profile) => (
            <button key={profile.id} type="button" aria-pressed={perfilLogado === profile.id} onClick={() => enter(profile)}>
              {profile.label}
            </button>
          ))}
          {perfilLogado === 'adm' && <button className="gof-demo-primary" type="button" onClick={simulateCard}>Simular cartão NFC</button>}
        </div>
        <details className="gof-demo-inspector">
          <summary>Eventos e API simulada</summary>
          <p>Rotas e formatos do GOF_API reproduzidos no navegador. As alterações duram até recarregar a página.</p>
          {activity.length === 0 && <p>Escolha um perfil para ver a atividade aqui.</p>}
          {activity.map((entry, index) => (
            <details key={index}>
              <summary><code>{entry.method} {entry.path} {entry.status ?? ''}</code></summary>
              {entry.input && <><p>Requisição</p><pre>{JSON.stringify(entry.input, null, 2)}</pre></>}
              <p>{entry.status ? 'Resposta de demonstração' : 'Evento simulado'}</p>
              <pre>{JSON.stringify(entry.body, null, 2)}</pre>
            </details>
          ))}
          <p><a href="https://github.com/Jainut/GOF_API">Ver código da API ↗</a></p>
        </details>
      </div>
    </aside>
  );
}

export function DemoHome() {
  const { enter } = useDemoProfiles();
  return (
    <main className="gof-demo-home">
      <header>
        <p className="gof-demo-kicker">TCC · GESTÃO DE FERRAMENTAS</p>
        <h1>Da retirada à devolução.</h1>
        <p>Explore como um almoxarifado industrial identifica operadores por NFC, registra empréstimos e acompanha ferramentas em estoque.</p>
      </header>
      <div className="gof-demo-profiles">
        {profiles.map((profile) => (
          <section key={profile.id}>
            <h2>{profile.label}</h2>
            <p>{profile.description}</p>
            <button type="button" className={profile.id === 'adm' ? 'gof-demo-primary' : ''} onClick={() => enter(profile)}>
              Entrar como {profile.label.toLowerCase()} <span aria-hidden="true">→</span>
            </button>
          </section>
        ))}
      </div>
      <footer>
        <a href="https://github.com/Jainut/GOF_Interface">GOF_Interface · React e Vite ↗</a>
        <a href="https://github.com/Jainut/GOF_API">GOF_API · Express, Prisma e PostgreSQL ↗</a>
      </footer>
    </main>
  );
}

const styles = `
  .gof-demo, .gof-demo-home { font-family: Inter, system-ui, sans-serif; }
  .gof-demo { position: sticky; top: 0; z-index: 10; color: #fff; background: #102841; border-bottom: 1px solid #38516b; }
  .gof-demo-toolbar { display: flex; align-items: center; flex-wrap: wrap; gap: .75rem 1.25rem; padding: .8rem clamp(1rem, 3vw, 2.25rem); }
  .gof-demo-toolbar small { display: block; margin-top: .25rem; color: #bfcee0; font-size: .65rem; letter-spacing: .085em; }
  .gof-demo-actions { flex: 1; display: flex; flex-wrap: wrap; gap: .4rem; }
  .gof-demo button, .gof-demo-home button { border: 1px solid #6285aa; color: inherit; background: transparent; border-radius: .4rem; cursor: pointer; padding: .55rem .8rem; font-size: .85rem; font-weight: 650; }
  .gof-demo button[aria-pressed="true"] { border-color: #a1c9ff; background: #224770; }
  .gof-demo .gof-demo-primary, .gof-demo-home .gof-demo-primary { color: #162338; background: #ffd35e; border-color: #ffd35e; }
  .gof-demo button:hover, .gof-demo-home button:hover { box-shadow: 0 0 0 2px #82b6eb; }
  .gof-demo-inspector { margin-left: auto; font-size: .85rem; }
  .gof-demo-inspector > :not(summary) { margin-left: .3rem; }
  .gof-demo-inspector[open] { width: 100%; max-height: 40vh; overflow: auto; border-top: 1px solid #6285aa; padding: .7rem 0; }
  .gof-demo-inspector details { padding: .35rem 0; }
  .gof-demo-inspector summary { cursor: pointer; }
  .gof-demo-inspector pre { overflow: auto; max-height: 15rem; background: #081d31; border-radius: .4rem; padding: .6rem; }
  .gof-demo-inspector a { color: #cfe6ff; }
  .gof-demo-home { max-width: 78rem; margin: auto; padding: clamp(2.2rem, 7vw, 6.75rem) clamp(1rem, 5vw, 4.5rem); color: #142b43; }
  .gof-demo-home header { max-width: 49rem; }
  .gof-demo-home h1 { font-size: clamp(2.8rem, 7.5vw, 5.25rem); line-height: .99; letter-spacing: -.055em; margin: .6rem 0 1.3rem; }
  .gof-demo-home header p:last-child { max-width: 38rem; font-size: clamp(1rem, 2.3vw, 1.26rem); line-height: 1.55; color: #395774; }
  .gof-demo-kicker { font-weight: 750; color: #21578c; letter-spacing: .11em; font-size: .75rem; }
  .gof-demo-profiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr)); gap: 1rem; margin: 2.1rem 0 1.5rem; }
  .gof-demo-profiles section { display: flex; flex-direction: column; align-items: flex-start; background: #fff; border: 1px solid #c9ddef; border-radius: .65rem; padding: 1.35rem; }
  .gof-demo-profiles h2 { margin: 0; font-size: 1.27rem; }
  .gof-demo-profiles p { flex: 1; color: #395774; line-height: 1.5; margin: .75rem 0 1.15rem; }
  .gof-demo-home footer { display: flex; flex-wrap: wrap; gap: .75rem 1.5rem; font-size: .86rem; }
  .gof-demo-home footer a { color: #164d85; text-underline-offset: .2rem; }
  @media (max-width: 680px) {
    .gof-demo-toolbar { gap: .55rem; }
    .gof-demo-actions { flex-basis: 100%; order: 1; }
    .gof-demo-inspector[open] { order: 2; }
  }
`;
