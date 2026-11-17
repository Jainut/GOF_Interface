import { useEffect, useLayoutEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppData } from '../hooks/useAppData';
import { useAuth } from '../hooks/useAuth';
import { demoActivity, simulateCard } from './demoApi';
import homeStyles from './demoHome.css?raw';

const profiles = [
  { id: 'adm', route: '/almoxarife', label: 'Almoxarife' },
  { id: 'func', route: '/operador', label: 'Operador', description: 'Veja as ferramentas que estão sob sua responsabilidade.' },
  { id: 'superadmin', route: '/master', label: 'Administrador', description: 'Consulte o estoque, os empréstimos ativos e os cartões vinculados.' }
];

const workflow = [
  { title: 'Identificar o operador', description: 'O operador aproxima o cartão NFC do leitor. O nome dele aparece no painel do almoxarife.' },
  { title: 'Registrar a retirada', description: 'O almoxarife seleciona a ferramenta e a quantidade. A retirada entra no histórico e reduz o saldo disponível.' },
  { title: 'Registrar a devolução', description: 'Quando a ferramenta volta, o almoxarife encerra o empréstimo e a unidade retorna ao estoque.' }
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
  const { pathname } = useLocation();
  const [activity, setActivity] = useState([]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
  const [almoxarife, ...otherProfiles] = profiles;

  return (
    <main className="gof-demo-home">
      <style>{homeStyles}</style>
      <div className="gof-home-sheet">
        <header className="gof-home-intro">
          <div className="gof-home-overview">
            <p className="gof-home-label">Projeto de conclusão de curso</p>
            <h1>Controle de ferramentas no almoxarifado</h1>
            <p className="gof-home-lead">Quando as retiradas são anotadas no papel, descobrir com quem está uma ferramenta ou quantas ainda estão disponíveis exige conferir os registros à mão.</p>
            <p className="gof-home-lead">O GOF reúne empréstimos, devoluções e estoque em um só sistema. Cada retirada fica vinculada ao operador que levou a ferramenta.</p>
            <button className="gof-home-enter" type="button" onClick={() => enter(almoxarife)}>
              Entrar como almoxarife <span aria-hidden="true">→</span>
            </button>
            <p className="gof-home-hint">Na demo, use o botão <strong>Simular cartão NFC</strong> para iniciar uma retirada.</p>
          </div>
          <figure className="gof-home-record">
            <figcaption>Exemplo de empréstimo</figcaption>
            <div className="gof-home-tool">
              <img src={`${import.meta.env.BASE_URL}imagens/torquimetro.png`} width="193" height="198" alt="" />
            </div>
            <dl>
              <div><dt>Ferramenta</dt><dd>Torquímetro</dd></div>
              <div><dt>Operadora</dt><dd>Marina Costa</dd></div>
              <div><dt>Quantidade</dt><dd>1 unidade</dd></div>
              <div><dt>Situação</dt><dd className="gof-home-status">Em custódia</dd></div>
            </dl>
          </figure>
        </header>

        <section className="gof-home-flow" aria-labelledby="gof-home-flow-title">
          <h2 id="gof-home-flow-title">Como funciona</h2>
          <ol>
            {workflow.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="gof-home-details">
          <section className="gof-home-profiles" aria-labelledby="gof-home-profiles-title">
            <h2 id="gof-home-profiles-title">Outros perfis na demo</h2>
            {otherProfiles.map((profile) => (
              <button key={profile.id} type="button" onClick={() => enter(profile)} aria-label={`Entrar como ${profile.label.toLowerCase()}`}>
                <span><strong>{profile.label}</strong><small>{profile.description}</small></span>
                <span aria-hidden="true">→</span>
              </button>
            ))}
          </section>
          <section className="gof-home-code" aria-labelledby="gof-home-code-title">
            <h2 id="gof-home-code-title">Por trás da tela</h2>
            <p>No projeto, a API Express registra as movimentações no PostgreSQL e envia a identificação do cartão à interface React em tempo real. Na demo, o painel <strong>Eventos e API simulada</strong> mostra essas interações com dados fictícios.</p>
            <div className="gof-home-links">
              <a href="https://github.com/Jainut/GOF_Interface">GOF_Interface <span aria-hidden="true">↗</span></a>
              <a href="https://github.com/Jainut/GOF_API">GOF_API <span aria-hidden="true">↗</span></a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

const styles = `
  .gof-demo { font-family: Inter, system-ui, sans-serif; }
  .gof-demo { position: sticky; top: 0; z-index: 10; color: #fff; background: #102841; border-bottom: 1px solid #38516b; }
  .gof-demo-toolbar { display: flex; align-items: center; flex-wrap: wrap; gap: .75rem 1.25rem; padding: .8rem clamp(1rem, 3vw, 2.25rem); }
  .gof-demo-toolbar small { display: block; margin-top: .25rem; color: #bfcee0; font-size: .65rem; letter-spacing: .085em; }
  .gof-demo-actions { flex: 1; display: flex; flex-wrap: wrap; gap: .4rem; }
  .gof-demo button { border: 1px solid #6285aa; color: inherit; background: transparent; border-radius: .4rem; cursor: pointer; padding: .55rem .8rem; font-size: .85rem; font-weight: 650; }
  .gof-demo button[aria-pressed="true"] { border-color: #a1c9ff; background: #224770; }
  .gof-demo .gof-demo-primary { color: #162338; background: #ffd35e; border-color: #ffd35e; }
  .gof-demo button:hover { box-shadow: 0 0 0 2px #82b6eb; }
  .gof-demo-inspector { margin-left: auto; font-size: .85rem; }
  .gof-demo-inspector > :not(summary) { margin-left: .3rem; }
  .gof-demo-inspector[open] { width: 100%; max-height: 40vh; overflow: auto; border-top: 1px solid #6285aa; padding: .7rem 0; }
  .gof-demo-inspector details { padding: .35rem 0; }
  .gof-demo-inspector summary { cursor: pointer; }
  .gof-demo-inspector pre { overflow: auto; max-height: 15rem; background: #081d31; border-radius: .4rem; padding: .6rem; }
  .gof-demo-inspector a { color: #cfe6ff; }
  @media (max-width: 680px) {
    .gof-demo-toolbar { gap: .55rem; }
    .gof-demo-actions { flex-basis: 100%; order: 1; }
    .gof-demo-inspector[open] { order: 2; }
  }
`;
