import { useState, useEffect, useCallback } from 'react';

// ── Ícones SVG ───────────────────────────────────────────────────────────────
const Icons = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  userPlus: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <line x1="19" y1="8" x2="19" y2="14"/>
      <line x1="16" y1="11" x2="22" y2="11"/>
    </svg>
  ),
  users: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  nfc: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2z"/>
      <path d="M9 12h.01M12 12h.01M15 12h.01"/>
    </svg>
  ),
  monitor: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8M12 17v4"/>
    </svg>
  ),
  stock: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  close: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  trash: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14H6L5 6"/>
      <path d="M10 11v6M14 11v6"/>
      <path d="M9 6V4h6v2"/>
    </svg>
  ),
  card: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <line x1="2" y1="10" x2="22" y2="10"/>
    </svg>
  ),
  check: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  totalUsers: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  totalCards: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <line x1="2" y1="10" x2="22" y2="10"/>
    </svg>
  ),
  totalAtivos: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  totalEstoque: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
};

const TSEA = {
  vermelho:     '#E30613',
  preto:        '#1A1A1A',
  cinzaEscuro:  '#4A4A4A',
  cinzaMedio:   '#CCCCCC',
  cinzaClaro:   '#F5F5F5',
  cinzaBorda:   '#999999',
  branco:       '#FFFFFF'
};

const SETORES = ['SOLDA', 'CORTE_LASER', 'MONTAGEM', 'PINTURA', 'EL_TRICA', 'ALMOXARIFADO', 'ADMINISTRACAO'];
const ROLES   = ['OPERADOR', 'ALMOXARIFE', 'ADMIN'];

const roleBadge = (role) => {
  const map = {
    ADMIN:      { bg: '#fce4ec', color: '#c62828', label: 'Admin' },
    ALMOXARIFE: { bg: '#e3f2fd', color: '#1565c0', label: 'Almoxarife' },
    OPERADOR:   { bg: '#e8f5e9', color: '#2e7d32', label: 'Operador' },
  };
  const s = map[role] ?? { bg: '#f5f5f5', color: '#555', label: role };
  return (
    <span style={{
      padding: '3px 8px', borderRadius: '4px', fontSize: '11px',
      fontWeight: 'bold', background: s.bg, color: s.color
    }}>{s.label}</span>
  );
};

// ── Componente de card de métrica ────────────────────────────────────────────
function MetricCard({ icon, label, value, color, bg }) {
  return (
    <div style={{
      background: TSEA.branco, borderRadius: '8px', padding: '20px 24px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)', borderLeft: `4px solid ${color}`,
      display: 'flex', alignItems: 'center', gap: '18px', flex: '1 1 180px'
    }}>
      <div style={{
        width: '52px', height: '52px', borderRadius: '10px', background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, flexShrink: 0
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '28px', fontWeight: '800', color: TSEA.preto, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '12px', color: TSEA.cinzaBorda, marginTop: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      </div>
    </div>
  );
}

// ── Componente de mensagem inline ────────────────────────────────────────────
function Msg({ msg, onClose }) {
  if (!msg) return null;
  const cores = {
    sucesso: { bg: '#e8f5e9', color: '#2e7d32' },
    erro:    { bg: '#ffebee', color: '#c62828' },
    aviso:   { bg: '#fff3e0', color: '#e65100' },
  };
  const { bg, color } = cores[msg.tipo] ?? { bg: '#e3f2fd', color: '#1565c0' };
  return (
    <div style={{
      padding: '12px 16px', borderRadius: '6px', marginBottom: '16px',
      background: bg, color, fontWeight: 'bold',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <span>{msg.texto}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color, display: 'flex', alignItems: 'center' }}>
        {Icons.close}
      </button>
    </div>
  );
}

// ── Input estilizado ─────────────────────────────────────────────────────────
function Field({ label, as, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
      {label && <label style={{ fontSize: '12px', fontWeight: '600', color: TSEA.cinzaEscuro, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>}
      {as === 'select' ? (
        <select {...props} style={{ padding: '10px 12px', borderRadius: '6px', border: `1px solid ${TSEA.cinzaMedio}`, fontSize: '14px', background: TSEA.branco, ...props.style }}>
          {props.children}
        </select>
      ) : (
        <input {...props} style={{ padding: '10px 12px', borderRadius: '6px', border: `1px solid ${TSEA.cinzaMedio}`, fontSize: '14px', ...props.style }} />
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// PAINEL MASTER
// ════════════════════════════════════════════════════════════════════════════
export default function PainelMaster({
  abaAtivaSuper, setAbaAtivaSuper,
  ativosEmCustodiaTSEA, catalogoFerramentas,
  logout,
  getToken,
}) {
  const API = import.meta.env.VITE_API_URL;

  const [msg, setMsg] = useState(null);
  const [setorSelecionado, setSetorSelecionado] = useState(null);

  // Dados mockados para o Dashboard
  const dashboardData = {
    Soldagem: [
      { nome: "Marcos Oliveira", ferramentas: ["Tocha TIG", "Máscara Eletrônica"] },
      { nome: "Roberto Silva", ferramentas: ["Alicate de Pressão", "Esmerilhadeira"] }
    ],
    Produção: [
      { nome: "Ana Costa", ferramentas: ["Parafusadeira Bosch", "Chave Fixa 13mm"] },
      { nome: "Juliana Lima", ferramentas: ["Torquímetro Digital", "Multímetro Fluke"] },
      { nome: "Pedro Rocha", ferramentas: ["Martelo de Borracha"] }
    ],
    Manutenção: [
      { nome: "Sérgio Almoxarife", ferramentas: ["Scanner Industrial"] },
      { nome: "Cláudio Souza", ferramentas: ["Jogo de Chaves Allen", "Óleo Protetivo"] }
    ],
    Engenharia: [
      { nome: "Carlos Eduardo", ferramentas: ["Trena Laser", "Nível Digital"] }
    ]
  };

  // ── Estado: listar usuários ──────────────────────────────────────────────
  const [usuarios, setUsuarios]           = useState([]);
  const [loadUsuarios, setLoadUsuarios]   = useState(false);

  // ── Estado: criar usuário ────────────────────────────────────────────────
  const [form, setForm] = useState({ cpf: '', nome: '', senha: '', tipo: 'OPERADOR', setor: 'MONTAGEM' });
  const [salvando, setSalvando] = useState(false);

  // ── Estado: cartões NFC ──────────────────────────────────────────────────
  const [cartoes, setCartoes]           = useState([]);
  const [loadCartoes, setLoadCartoes]   = useState(false);
  const [formNFC, setFormNFC]           = useState({ user_cpf: '', codigo_uid: '' });
  const [salvandoNFC, setSalvandoNFC]   = useState(false);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const headers = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` });

  const showMsg = (tipo, texto) => setMsg({ tipo, texto });

  // ── Buscar usuários ──────────────────────────────────────────────────────
  const buscarUsuarios = useCallback(async () => {
    setLoadUsuarios(true);
    try {
      const res  = await fetch(`${API}/listar/Usuarios`, { headers: headers() });
      const data = await res.json();
      if (res.ok) setUsuarios(data);
      else showMsg('erro', data.message ?? 'Erro ao carregar usuários.');
    } catch { showMsg('erro', 'Falha de conexão.'); }
    finally  { setLoadUsuarios(false); }
  }, []);

  // ── Buscar cartões ───────────────────────────────────────────────────────
  const buscarCartoes = useCallback(async () => {
    setLoadCartoes(true);
    try {
      const res  = await fetch(`${API}/listar/CartoesNFC`, { headers: headers() });
      const data = await res.json();
      if (res.ok) setCartoes(data);
      else showMsg('erro', data.message ?? 'Erro ao carregar cartões.');
    } catch { showMsg('erro', 'Falha de conexão.'); }
    finally  { setLoadCartoes(false); }
  }, []);

  useEffect(() => {
    if (abaAtivaSuper === 'gerenciar_usuarios') buscarUsuarios();
    if (abaAtivaSuper === 'cartoes_nfc')        { buscarCartoes(); buscarUsuarios(); }
  }, [abaAtivaSuper]);

  const criarUsuario = async () => {
    if (!form.cpf || !form.nome || !form.senha) {
      showMsg('aviso', 'Preencha CPF, nome e senha.'); return;
    }
    setSalvando(true);
    try {
      const res  = await fetch(`${API}/cadastrar/Usuario`, {
        method: 'POST', headers: headers(),
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        showMsg('sucesso', 'Usuário cadastrado com sucesso!');
        setForm({ cpf: '', nome: '', senha: '', tipo: 'OPERADOR', setor: 'MONTAGEM' });
      } else {
        showMsg('erro', data.message ?? 'Erro ao cadastrar usuário.');
      }
    } catch { showMsg('erro', 'Falha de conexão.'); }
    finally  { setSalvando(false); }
  };

  const vincularCartao = async () => {
    if (!formNFC.user_cpf || !formNFC.codigo_uid) {
      showMsg('aviso', 'Informe o CPF do usuário e o UID do cartão.'); return;
    }
    setSalvandoNFC(true);
    try {
      const res  = await fetch(`${API}/cadastrar/CartaoNFC`, {
        method: 'POST', headers: headers(),
        body: JSON.stringify({ user_cpf: formNFC.user_cpf, codigo_uid: formNFC.codigo_uid })
      });
      const data = await res.json();
      if (res.ok) {
        showMsg('sucesso', 'Cartão vinculado com sucesso!');
        setFormNFC({ user_cpf: '', codigo_uid: '' });
        buscarCartoes();
      } else {
        showMsg('erro', data.message ?? 'Erro ao vincular cartão.');
      }
    } catch { showMsg('erro', 'Falha de conexão.'); }
    finally  { setSalvandoNFC(false); }
  };

  const removerCartao = async (user_cpf) => {
    if (!confirm('Remover o cartão NFC deste usuário?')) return;
    try {
      const res  = await fetch(`${API}/remover/CartaoNFC/${user_cpf}`, {
        method: 'DELETE', headers: headers()
      });
      const data = await res.json();
      if (res.ok) {
        showMsg('sucesso', 'Cartão removido.');
        buscarCartoes();
      } else {
        showMsg('erro', data.message ?? 'Erro ao remover cartão.');
      }
    } catch { showMsg('erro', 'Falha de conexão.'); }
  };

  // ── Métricas ─────────────────────────────────────────────────────────────
  const totalUsers   = usuarios.length;
  const totalCards   = cartoes.length;
  const totalAtivos  = ativosEmCustodiaTSEA.filter(a => a.status !== 'DEVOLVIDO').length;
  const totalEstoque = catalogoFerramentas.reduce((s, f) => s + f.total, 0);

  // ── Sidebar nav ──────────────────────────────────────────────────────────
  const navItems = [
    { key: 'dashboard',          label: 'Dashboard',         icon: Icons.dashboard },
    { key: 'criar_usuario',      label: 'Criar Usuário',      icon: Icons.userPlus },
    { key: 'gerenciar_usuarios', label: 'Gerenciar Usuários', icon: Icons.users    },
    { key: 'cartoes_nfc',        label: 'Cartões NFC',        icon: Icons.nfc      },
    { key: 'm_ativas',           label: 'Monitor de Ativas',  icon: Icons.monitor  },
    { key: 'm_estoque',          label: 'Monitor de Estoque', icon: Icons.stock    },
  ];

  const card = {
    backgroundColor: TSEA.branco, padding: '25px',
    borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
  };

  const btnPrimary = (loading) => ({
    padding: '11px 24px', background: loading ? '#999' : TSEA.vermelho,
    color: 'white', border: 'none', borderRadius: '6px',
    fontWeight: 'bold', fontSize: '14px',
    cursor: loading ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center', gap: '8px'
  });

  const thStyle = { padding: '12px 14px', textAlign: 'left', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: TSEA.cinzaBorda };
  const tdStyle = { padding: '13px 14px', fontSize: '14px', borderBottom: `1px solid ${TSEA.cinzaClaro}` };

  return (
    <div className="layout-container" style={{ filter: setorSelecionado ? 'blur(4px)' : 'none', transition: 'filter 0.3s' }}>

      {/* ── SIDEBAR ── */}
      <aside className="sidebar no-print">
        <div style={{ textAlign: 'center', borderBottom: `3px solid ${TSEA.vermelho}`, paddingBottom: '15px', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '20px' }}>TSEA <span style={{ color: TSEA.vermelho }}>MASTER</span></h3>
          <small style={{ color: TSEA.cinzaBorda, fontSize: '10px' }}>GERAL / RH / TI</small>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {navItems.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setAbaAtivaSuper(key)}
              className="btn-sidebar"
              style={{
                backgroundColor: abaAtivaSuper === key ? TSEA.vermelho : 'transparent',
                display: 'flex', alignItems: 'center', gap: '10px'
              }}
            >
              <span style={{ opacity: 0.85 }}>{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <button
          onClick={logout}
          style={{
            width: '100%', padding: '12px', background: TSEA.vermelho,
            color: 'white', border: 'none', borderRadius: '4px',
            fontWeight: 'bold', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}
        >
          {Icons.logout} Sair
        </button>
      </aside>

      {/* ── CONTEÚDO ── */}
      <main className="content-main" style={{ position: 'relative' }}>

        {/* Cards de métricas */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
          <MetricCard icon={Icons.totalUsers}   label="Usuários cadastrados" value={totalUsers}  color={TSEA.vermelho} bg="#fff0f0" />
          <MetricCard icon={Icons.totalCards}   label="Cartões NFC ativos"   value={totalCards}  color="#1565c0"       bg="#e3f2fd" />
          <MetricCard icon={Icons.totalAtivos}  label="Ferramentas em uso"   value={totalAtivos} color="#e65100"       bg="#fff3e0" />
          <MetricCard icon={Icons.totalEstoque} label="Total em estoque"      value={totalEstoque}color="#2e7d32"       bg="#e8f5e9" />
        </div>

        <Msg msg={msg} onClose={() => setMsg(null)} />

        {/* ══════════════════════════════════════
            ABA: DASHBOARD (NOVA)
        ══════════════════════════════════════ */}
        {abaAtivaSuper === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            {/* Grid de Setores */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              {Object.keys(dashboardData).map(setor => (
                <div 
                  key={setor} 
                  onClick={() => setSetorSelecionado(setor)}
                  style={{ 
                    ...card, 
                    cursor: 'pointer', 
                    textAlign: 'center', 
                    borderBottom: `4px solid ${TSEA.vermelho}`,
                    transition: 'transform 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <h4 style={{ color: TSEA.cinzaEscuro, marginBottom: '10px' }}>{setor}</h4>
                  <div style={{ fontSize: '32px', fontWeight: '800', color: TSEA.preto }}>
                    {dashboardData[setor].length}
                  </div>
                  <small style={{ color: TSEA.cinzaBorda }}>Ferramentas Ativas</small>
                </div>
              ))}
            </div>

            {/* Retângulo com a Bola de Cores */}
            <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '40px', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ marginBottom: '15px' }}>Status Geral do Inventário</h4>
                <div style={{ 
                  width: '180px', 
                  height: '180px', 
                  borderRadius: '50%', 
                  background: 'conic-gradient(#CCCCCC 0% 15%, #2e7d32 15% 65%, #E30613 65% 100%)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  margin: '0 auto'
                }}></div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '15px', height: '15px', background: '#CCCCCC', borderRadius: '3px' }}></div>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>Em Manutenção (15%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '15px', height: '15px', background: '#2e7d32', borderRadius: '3px' }}></div>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>Em Uso (50%)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '15px', height: '15px', background: '#E30613', borderRadius: '3px' }}></div>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>No Almoxarifado (35%)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Detalhes do Setor (Fora do Main para o blur funcionar corretamente) */}
        {setorSelecionado && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)'
          }}>
            <div style={{
              ...card, width: '700px', maxHeight: '80vh', overflowY: 'auto',
              position: 'relative', borderTop: `6px solid ${TSEA.vermelho}`
            }}>
              <button 
                onClick={() => setSetorSelecionado(null)}
                style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {Icons.close}
              </button>

              <h2 style={{ marginBottom: '20px', color: TSEA.preto }}>Colaboradores: {setorSelecionado}</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {dashboardData[setorSelecionado].map((func, idx) => (
                  <div key={idx} style={{ padding: '15px', background: TSEA.cinzaClaro, borderRadius: '6px' }}>
                    <div style={{ fontWeight: '800', fontSize: '16px', color: TSEA.vermelho, marginBottom: '8px' }}>
                      {func.nome}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {func.ferramentas.map((f, i) => (
                        <span key={i} style={{ 
                          padding: '4px 10px', background: TSEA.branco, border: '1px solid #ddd', 
                          borderRadius: '4px', fontSize: '13px', fontWeight: '500' 
                        }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ... Restante das abas (Criar Usuário, Gerenciar, etc) mantém-se igual ... */}
        {abaAtivaSuper === 'criar_usuario' && (
          <div style={card}>
            <h3 style={{ margin: '0 0 20px 0', paddingBottom: '10px', borderBottom: `2px solid ${TSEA.cinzaClaro}` }}>
              Cadastrar Novo Usuário
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', maxWidth: '700px' }}>
              <Field
                label="CPF (somente números)"
                type="text"
                maxLength={11}
                placeholder="00000000000"
                value={form.cpf}
                onChange={e => setForm(p => ({ ...p, cpf: e.target.value.replace(/\D/g, '') }))}
              />
              <Field
                label="Nome completo"
                type="text"
                placeholder="Nome do colaborador"
                value={form.nome}
                onChange={e => setForm(p => ({ ...p, nome: e.target.value }))}
              />
              <Field
                label="Senha"
                type="password"
                placeholder="Senha de acesso"
                value={form.senha}
                onChange={e => setForm(p => ({ ...p, senha: e.target.value }))}
              />
              <Field label="Perfil" as="select" value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </Field>
              <Field label="Setor" as="select" value={form.setor} onChange={e => setForm(p => ({ ...p, setor: e.target.value }))}>
                {SETORES.map(s => <option key={s} value={s}>{s}</option>)}
              </Field>
            </div>

            <button
              onClick={criarUsuario}
              disabled={salvando}
              style={{ ...btnPrimary(salvando), marginTop: '24px' }}
            >
              {Icons.check}
              {salvando ? 'Salvando...' : 'Cadastrar Usuário'}
            </button>
          </div>
        )}

        {/* ... (O restante do código das outras abas segue aqui igual ao original) ... */}
        {abaAtivaSuper === 'gerenciar_usuarios' && (
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '10px', borderBottom: `2px solid ${TSEA.cinzaClaro}` }}>
              <h3 style={{ margin: 0 }}>Usuários Cadastrados</h3>
              <button
                onClick={buscarUsuarios}
                style={{ padding: '8px 16px', background: TSEA.cinzaClaro, border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
              >
                Atualizar
              </button>
            </div>

            {loadUsuarios ? (
              <p style={{ color: '#888', fontStyle: 'italic' }}>Carregando...</p>
            ) : usuarios.length === 0 ? (
              <p style={{ color: '#888', fontStyle: 'italic' }}>Nenhum usuário encontrado.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: TSEA.cinzaClaro }}>
                      <th style={thStyle}>Nome</th>
                      <th style={thStyle}>CPF</th>
                      <th style={thStyle}>Setor</th>
                      <th style={thStyle}>Perfil</th>
                      <th style={thStyle}>Cartão NFC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? TSEA.branco : '#fafafa' }}>
                        <td style={tdStyle}><strong>{u.nome}</strong></td>
                        <td style={{ ...tdStyle, fontFamily: 'monospace', color: TSEA.cinzaEscuro }}>{u.cpf}</td>
                        <td style={tdStyle}>{u.setor ?? '—'}</td>
                        <td style={tdStyle}>{roleBadge(u.tipo)}</td>
                        <td style={tdStyle}>
                          {u.cartao_operador ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2e7d32', fontWeight: 'bold', fontSize: '13px' }}>
                              {Icons.check} Vinculado
                            </span>
                          ) : (
                            <span style={{ color: TSEA.cinzaBorda, fontSize: '13px' }}>Sem cartão</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {abaAtivaSuper === 'cartoes_nfc' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={card}>
              <h3 style={{ margin: '0 0 20px 0', paddingBottom: '10px', borderBottom: `2px solid ${TSEA.cinzaClaro}` }}>
                Vincular Cartão NFC a Usuário
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', maxWidth: '600px' }}>
                <Field
                  label="CPF do usuário"
                  as="select"
                  value={formNFC.user_cpf}
                  onChange={e => setFormNFC(p => ({ ...p, user_cpf: e.target.value }))}
                >
                  <option value="">Selecione um usuário...</option>
                  {usuarios.map(u => (
                    <option key={u.cpf} value={u.cpf}>{u.nome} ({u.cpf})</option>
                  ))}
                </Field>
                <Field
                  label="UID do Cartão NFC"
                  type="text"
                  placeholder="Ex: A3F2B8C1"
                  value={formNFC.codigo_uid}
                  onChange={e => setFormNFC(p => ({ ...p, codigo_uid: e.target.value }))}
                />
              </div>
              <button onClick={vincularCartao} disabled={salvandoNFC} style={{ ...btnPrimary(salvandoNFC), marginTop: '20px' }}>
                {Icons.card} {salvandoNFC ? 'Vinculando...' : 'Vincular Cartão'}
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}