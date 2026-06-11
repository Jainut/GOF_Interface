import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import PainelAlmoxarife from './Componentes/PainelAlmoxarife';
import PainelMaster from './Componentes/PainelMaster';

// ==========================================
// TEMA DE CORES TSEA
// ==========================================
const TSEA = {
  vermelho:    '#E30613',
  preto:       '#1A1A1A',
  cinzaEscuro: '#4A4A4A',
  cinzaMedio:  '#CCCCCC',
  cinzaClaro:  '#F5F5F5',
  cinzaBorda:  '#999999',
  branco:      '#FFFFFF'
};

const socket = io(import.meta.env.VITE_API_URL, { withCredentials: true });

// ==========================================
// COMPONENTE 1: LOGIN
// ==========================================
function Login({
  perfil, setPerfil,
  statusBiometria, setStatusBiometria,
  videoRef, progressoEscaneamento, setProgressoEscaneamento,
  entrarNoPainelManualmente,
  idAlmoxarife, setIdAlmoxarife,
  senhaLoginAlmoxarife, setSenhaLoginAlmoxarife,
  entrarComoAlmoxarife,
  cpfSuperAdmin, setCpfSuperAdmin,
  senhaSuperAdmin, setSenhaSuperAdmin,
  entrarComoSuperAdmin,
  mensagemSistema, setMensagemSistema
}) {
  const ligarWebcamReal = async () => {
    try {
      setStatusBiometria('carregando_camera');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStatusBiometria('camera_ativa');
      }
    } catch (err) {
      console.error('Erro ao acessar a câmera:', err);
      setStatusBiometria('desligado');
    }
  };

  const desligarWebcamReal = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setStatusBiometria('desligado');
  };

  useEffect(() => {
    let intervalo;
    if (statusBiometria === 'escanear') {
      intervalo = setInterval(() => {
        setProgressoEscaneamento(prev => {
          if (prev >= 100) {
            clearInterval(intervalo);
            setStatusBiometria('sucesso');
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    }
    return () => clearInterval(intervalo);
  }, [statusBiometria]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      <header style={{ backgroundColor: TSEA.vermelho, padding: '20px', textAlign: 'center', color: 'white' }}>
        <h2 style={{ margin: 0, letterSpacing: '1px' }}>TSEA ENERGIA</h2>
      </header>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px', backgroundColor: '#f0f2f5' }}>
        <div style={{
          backgroundColor: '#fff', padding: '30px', borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '380px',
          borderTop: `5px solid ${TSEA.vermelho}`, textAlign: 'center'
        }}>

          {/* Mensagem de erro/sucesso */}
          {mensagemSistema && (
            <div style={{
              padding: '10px 14px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px', fontWeight: 'bold',
              backgroundColor: mensagemSistema.tipo === 'erro' ? '#ffebee' : mensagemSistema.tipo === 'sucesso' ? '#e8f5e9' : '#fff8e1',
              color: mensagemSistema.tipo === 'erro' ? TSEA.vermelho : mensagemSistema.tipo === 'sucesso' ? '#2e7d32' : '#f57f17',
              border: `1px solid ${mensagemSistema.tipo === 'erro' ? '#ffcdd2' : mensagemSistema.tipo === 'sucesso' ? '#c8e6c9' : '#ffecb3'}`,
              cursor: 'pointer'
            }} onClick={() => setMensagemSistema(null)}>
              {mensagemSistema.texto} ✕
            </div>
          )}

          {/* Seleção de perfil */}
          {!perfil && (
            <>
              <h4 style={{ margin: '0 0 20px 0', color: TSEA.preto }}>CONTROLE DE ACESSO MÓVEL</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => setPerfil('func')} style={{ padding: '15px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Acessar Totem Operacional
                </button>
                <button onClick={() => setPerfil('adm')} style={{ padding: '15px', background: TSEA.cinzaEscuro, color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Área do Almoxarife (ADM)
                </button>
                <button onClick={() => setPerfil('superadmin')} style={{ padding: '15px', background: TSEA.preto, color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Administrador Geral (MASTER)
                </button>
              </div>
            </>
          )}

          {/* Login biométrico - Funcionário */}
          {perfil === 'func' && (
            <div>
              <h5 style={{ margin: '0 0 15px 0' }}>Validação Biométrica Requerida</h5>
              <div style={{
                width: '200px', height: '200px', backgroundColor: '#111', borderRadius: '50%',
                margin: '0 auto 20px auto', position: 'relative', overflow: 'hidden',
                border: `4px solid ${statusBiometria === 'sucesso' ? '#2e7d32' : TSEA.vermelho}`,
                display: 'flex', justifyContent: 'center', alignItems: 'center'
              }}>
                {statusBiometria === 'desligado' && <div style={{ color: '#666', fontSize: '14px' }}>Câmera Inativa</div>}
                {statusBiometria === 'carregando_camera' && <div style={{ color: '#fff', fontSize: '12px' }}>Iniciando lente...</div>}
                <video
                  ref={videoRef} autoPlay playsInline muted
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover', position: 'absolute',
                    transform: 'scaleX(-1)',
                    display: ['camera_ativa', 'escanear', 'sucesso'].includes(statusBiometria) ? 'block' : 'none'
                  }}
                />
                {statusBiometria === 'escanear' && (
                  <>
                    <div style={{ position: 'absolute', width: '100%', height: '4px', backgroundColor: TSEA.vermelho, top: `${progressoEscaneamento}%`, left: 0, boxShadow: '0 0 8px red' }} />
                    <div style={{ position: 'absolute', bottom: '5px', color: '#fff', fontSize: '11px', background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px' }}>
                      Análise: {progressoEscaneamento}%
                    </div>
                  </>
                )}
                {statusBiometria === 'sucesso' && (
                  <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(46,125,50,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px' }}>
                    Reconhecido
                  </div>
                )}
              </div>
              {statusBiometria === 'desligado' && (
                <button onClick={ligarWebcamReal} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Habilitar Câmera</button>
              )}
              {statusBiometria === 'camera_ativa' && (
                <button onClick={() => setStatusBiometria('escanear')} style={{ width: '100%', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Escanear Face</button>
              )}
              {statusBiometria === 'sucesso' && (
                <button onClick={entrarNoPainelManualmente} style={{ width: '100%', padding: '14px', background: 'green', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Entrar no Totem</button>
              )}
              <button
                onClick={() => { desligarWebcamReal(); setPerfil(null); setProgressoEscaneamento(0); }}
                style={{ marginTop: '15px', background: 'none', border: 'none', color: TSEA.vermelho, fontWeight: 'bold', cursor: 'pointer' }}
              >
                Cancelar e Voltar
              </button>
            </div>
          )}

          {/* Login - Almoxarife */}
          {perfil === 'adm' && (
            <div>
              <h5 style={{ margin: '0 0 15px 0' }}>Autenticação - Almoxarifado</h5>
              <input
                type="text"
                placeholder="CPF do Almoxarife"
                value={idAlmoxarife}
                onChange={(e) => setIdAlmoxarife(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: `1px solid ${TSEA.cinzaMedio}`, textAlign: 'center', marginBottom: '10px', boxSizing: 'border-box' }}
              />
              <input
                type="password"
                placeholder="Senha"
                value={senhaLoginAlmoxarife}
                onChange={(e) => setSenhaLoginAlmoxarife(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: `1px solid ${TSEA.cinzaMedio}`, textAlign: 'center', marginBottom: '15px', boxSizing: 'border-box' }}
              />
              <button onClick={entrarComoAlmoxarife} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Acessar Painel</button>
              <button onClick={() => setPerfil(null)} style={{ marginTop: '15px', background: 'none', border: 'none', color: TSEA.vermelho, fontWeight: 'bold', cursor: 'pointer' }}>Voltar</button>
            </div>
          )}

          {/* Login - SuperAdmin */}
          {perfil === 'superadmin' && (
            <div>
              <h5 style={{ margin: '0 0 15px 0' }}>Acesso Master Corporativo</h5>
              <input
                type="text"
                placeholder="CPF do Administrador"
                value={cpfSuperAdmin}
                onChange={(e) => setCpfSuperAdmin(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: `1px solid ${TSEA.cinzaMedio}`, textAlign: 'center', marginBottom: '10px', boxSizing: 'border-box' }}
              />
              <input
                type="password"
                placeholder="Senha Master"
                value={senhaSuperAdmin}
                onChange={(e) => setSenhaSuperAdmin(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: `1px solid ${TSEA.cinzaMedio}`, textAlign: 'center', marginBottom: '15px', boxSizing: 'border-box' }}
              />
              <button onClick={entrarComoSuperAdmin} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Entrar como Admin</button>
              <button onClick={() => setPerfil(null)} style={{ marginTop: '15px', background: 'none', border: 'none', color: TSEA.vermelho, fontWeight: 'bold', cursor: 'pointer' }}>Voltar</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENTE 2: PAINEL DO FUNCIONÁRIO (Totem)
// ==========================================
function PainelOperador({ abaAtiva, setAbaAtiva, operador, ativosEmCustodiaTSEA, logout }) {
  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div style={{ textAlign: 'center', borderBottom: `3px solid ${TSEA.vermelho}`, paddingBottom: '15px', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '22px' }}>TSEA <span style={{ color: TSEA.vermelho }}>MOBILE</span></h3>
          <small style={{ color: TSEA.cinzaMedio, fontSize: '11px' }}>TOTEM OPERACIONAL</small>
        </div>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => setAbaAtiva('custodia')} className="btn-sidebar" style={{ backgroundColor: abaAtiva === 'custodia' ? TSEA.vermelho : 'transparent' }}>
            Minha Custódia ({ativosEmCustodiaTSEA.filter(a => a.matricula === operador.matricula && a.status === 'EM CUSTÓDIA').length})
          </button>
          <button onClick={() => setAbaAtiva('info')} className="btn-sidebar" style={{ backgroundColor: abaAtiva === 'info' ? TSEA.vermelho : 'transparent' }}>
            Minhas Infos
          </button>
        </nav>
        <button onClick={logout} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Sair do Totem</button>
      </aside>

      <main className="content-main">
        <header style={{ backgroundColor: TSEA.branco, padding: '15px 20px', borderRadius: '6px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '18px' }}>{operador.nome}</h4>
            <small style={{ color: '#555' }}>{operador.cargo} | <strong>{operador.matricula}</strong></small>
          </div>
          <span style={{ padding: '5px 10px', background: '#e8f5e9', color: 'green', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{operador.status}</span>
        </header>

        {abaAtiva === 'custodia' && (
          <div style={{ backgroundColor: TSEA.branco, padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>Seus Ativos em Custódia Operacional</h3>
            {ativosEmCustodiaTSEA.filter(a => a.matricula === operador.matricula).length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>Nenhuma ferramenta vinculada à sua RE no momento.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {ativosEmCustodiaTSEA.filter(a => a.matricula === operador.matricula).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', border: `1px solid ${TSEA.cinzaMedio}`, borderRadius: '6px', background: '#fff' }}>
                    <div>
                      <h5 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{item.ferramenta}</h5>
                      <small style={{ color: '#666' }}>Retirada: {item.data} | Qtd: <strong>{item.qtd}x</strong></small>
                      <div style={{ marginTop: '5px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', background: item.status === 'DEVOLVIDO' ? '#e8f5e9' : '#ffebee', color: item.status === 'DEVOLVIDO' ? 'green' : TSEA.vermelho }}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {abaAtiva === 'info' && (
          <div style={{ backgroundColor: TSEA.branco, padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 15px 0', color: TSEA.vermelho }}>Ficha Cadastral do Colaborador</h3>
            <div className="ficha-dados" style={{ background: TSEA.cinzaClaro, padding: '20px', borderRadius: '6px' }}>
              <div className="ficha-item"><strong>Colaborador:</strong> <span>{operador.nome}</span></div>
              <div className="ficha-item"><strong>Inscrição RE:</strong> <span>{operador.matricula}</span></div>
              <div className="ficha-item"><strong>Lotação:</strong> <span>{operador.setor}</span></div>
              <div className="ficha-item"><strong>Função Atendida:</strong> <span>{operador.cargo}</span></div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ==========================================
// APP PRINCIPAL
// ==========================================
function App() {
  const [logado, setLogado]           = useState(false);
  const [perfilLogado, setPerfilLogado] = useState(null);
  const [perfil, setPerfil]           = useState(null);

  const [operador] = useState({
    nome:      'Carlos Eduardo Santos',
    matricula: 'RE-40922',
    setor:     'Bobinagem de Transformadores',
    cargo:     'Técnico de Isolamento Especializado',
    empresa:   'TSEA Energia S.A.',
    status:    'Ativo Operacional'
  });

  const [abaAtiva,      setAbaAtiva]      = useState('custodia');
  const [abaAtivaAdm,   setAbaAtivaAdm]   = useState('solicitar_emprestimo');
  const [abaAtivaSuper, setAbaAtivaSuper] = useState('criar_usuario');

  const [statusBiometria,      setStatusBiometria]      = useState('desligado');
  const [progressoEscaneamento, setProgressoEscaneamento] = useState(0);
  const videoRef = useRef(null);

  // Login almoxarife
  const [idAlmoxarife,         setIdAlmoxarife]         = useState('');
  const [senhaLoginAlmoxarife, setSenhaLoginAlmoxarife] = useState('');
  const [cpfSuperAdmin,        setCpfSuperAdmin]        = useState('');
  const [senhaSuperAdmin,      setSenhaSuperAdmin]      = useState('');

  // Estado NFC / sessão do operador identificado
  const [nfcLiberado,    setNfcLiberado]    = useState(false);
  const [tempoRestante,  setTempoRestante]  = useState(0);
  const [operadorNFC,    setOperadorNFC]    = useState(null);

  // Mensagem inline (substituindo alert/modal)
  const [mensagemSistema, setMensagemSistema] = useState(null);

  // Catálogo de ferramentas e dados de custódia
  const [catalogoFerramentas, setCatalogoFerramentas] = useState([]);
  const [ativosEmCustodiaTSEA, setAtivosEmCustodiaTSEA] = useState([]);
  const [ultimasRetiradas,  setUltimasRetiradas]  = useState([]);
  const [ultimasDevolucoes, setUltimasDevolucoes] = useState([]);

  // Lista de empréstimos ativos do operador NFC identificado (usado na aba Devolução)
  const [emprestimosOperador, setEmprestimosOperador] = useState([]);

  // ------------------------------------------
  // Listener NFC via Socket.IO
  // ------------------------------------------
  useEffect(() => {
    socket.on('nfcAuth', (payload) => {
      if (!payload?.operador) {
        setMensagemSistema({ tipo: 'erro', texto: 'Cartão NFC não reconhecido no sistema.' });
        return;
      }
      const op = {
        nome:  payload.operador.nome,
        cpf:   payload.operador.cpf,
        setor: payload.operador.setor
      };
      setOperadorNFC(op);
      setNfcLiberado(true);
      setTempoRestante(10 * 60);
      setAbaAtivaAdm('solicitar_emprestimo');
      // Carregar automaticamente os empréstimos do operador identificado
      carregarEmprestimosDoOperador(op.cpf);
    });
    return () => socket.off('nfcAuth');
  }, []);

  // ------------------------------------------
  // Countdown da sessão NFC
  // ------------------------------------------
  useEffect(() => {
    if (!nfcLiberado) return;
    const intervalo = setInterval(() => {
      setTempoRestante(prev => {
        if (prev <= 1) {
          clearInterval(intervalo);
          setNfcLiberado(false);
          setOperadorNFC(null);
          setEmprestimosOperador([]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalo);
  }, [nfcLiberado]);

  // ------------------------------------------
  // Funções de carregamento via API
  // ------------------------------------------

  const carregarFerramentas = async () => {
    try {
      const res  = await fetch(import.meta.env.VITE_API_URL + '/listar/Ferramentas', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setCatalogoFerramentas(data.map(f => ({
          id:        f.id,
          nome:      f.tipo,
          categoria: f.categoria ?? 'Geral',
          total:     f.ferramenta_estoque?.[0]?.quantidade ?? 0,
          disponivel: f.ferramenta_estoque?.[0]?.quantidade ?? 0
        })));
      }
    } catch (e) { console.error('Erro ao carregar ferramentas:', e); }
  };

  const carregarAtivos = async () => {
    try {
      const res  = await fetch(import.meta.env.VITE_API_URL + '/listar/Ativos', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setAtivosEmCustodiaTSEA(data.flatMap(emp =>
          emp.item_emprestimo.map(item => ({
            emprestimo_id: emp.id,
            funcionario:   emp.usuario.nome,
            matricula:     emp.usuario.cpf,
            ferramenta:    item.ferramenta.tipo,
            ferramenta_id: item.ferramenta_id,
            qtd:           item.quantidade,
            data:          new Date(emp.data_retirada).toLocaleString('pt-BR'),
            status:        'EM CUSTÓDIA'
          }))
        ));
      }
    } catch (e) { console.error('Erro ao carregar ativos:', e); }
  };

  const carregarEmprestimos = async () => {
    try {
      const res  = await fetch(import.meta.env.VITE_API_URL + '/listar/Emprestimos', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        setUltimasRetiradas(data.flatMap(emp =>
          emp.ferramentas.map(f => ({
            emprestimo_id: emp.emprestimo_id,
            funcionario:   emp.usuario.nome_usuario,
            matricula:     emp.usuario.setor_usuario,
            ferramenta:    f.tipo_ferramenta,
            ferramenta_id: f.ferramenta_id,
            qtd:           f.quantidade,
            data:          new Date(emp.data_retirada).toLocaleString('pt-BR'),
            status:        emp.ferramenta_status === 'Emprestado' ? 'EM CUSTÓDIA' : 'DEVOLVIDO'
          }))
        ));
      }
    } catch (e) { console.error('Erro ao carregar empréstimos:', e); }
  };

  const carregarDevolucoes = async () => {
    try {
      const res  = await fetch(import.meta.env.VITE_API_URL + '/listar/Devolucoes', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();

      // ==========================================
      // PRINTS PARA DEBUG DE DEVOLUÇÕES
      // ==========================================
      console.log("🔄 Status da resposta (/listar/Devolucoes):", res.status);
      console.log("📦 Dados BRUTOS retornados pela API:", data);

      if (res.ok) {
        const devolucoesMapeadas = data.map(d => ({
          id:            d.devolucao_id,
          funcionario:   d.nome_usuario,
          matricula:     d.setor_usuario,
          ferramenta:    d.tipo_ferramenta,
          qtd:           1,
          dataDevolucao: new Date(d.data_devolucao).toLocaleString('pt-BR'),
          status:        d.status
        }));

        console.log("✅ Dados MAPEADOS (o que vai para a tela):", devolucoesMapeadas);
        // ==========================================

        setUltimasDevolucoes(devolucoesMapeadas);
      } else {
        console.error("❌ A API retornou um erro estrutural:", data);
      }
    } catch (e) { 
      console.error('❌ Erro no catch ao carregar devoluções:', e); 
    }
  };

  /**
   * Carrega os empréstimos ativos de um operador específico,
   * identificado automaticamente pelo NFC (CPF).
   * Filtra a partir dos ativos já carregados pelo almoxarife,
   * ou faz fetch pontual se necessário.
   */
  const carregarEmprestimosDoOperador = (cpf) => {
    fetch(import.meta.env.VITE_API_URL + '/listar/Ativos', {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(r => r.json())
      .then(data => {
        const doOperador = data
          .filter(emp => emp.usuario?.cpf === cpf)
          .flatMap(emp =>
            emp.item_emprestimo.map(item => ({
              emprestimo_id: emp.id,
              ferramenta:    item.ferramenta.tipo,
              ferramenta_id: item.ferramenta_id,
              qtd:           item.quantidade,
              data:          new Date(emp.data_retirada).toLocaleString('pt-BR')
            }))
          );
        setEmprestimosOperador(doOperador);
      })
      .catch(e => console.error('Erro ao carregar empréstimos do operador:', e));
  };

  // ------------------------------------------
  // Login do almoxarife
  // ------------------------------------------
  const entrarComoAlmoxarife = async () => {
    try {
      const res  = await fetch(import.meta.env.VITE_API_URL + '/login/almoxarife', {
        method:  'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ cpf: idAlmoxarife, senha: senhaLoginAlmoxarife })
      });
      const data = await res.json();
      if (res.ok) {
        carregarFerramentas();
        carregarAtivos();
        carregarEmprestimos();
        carregarDevolucoes();
        setPerfilLogado('adm');
        setLogado(true);
      } else {
        setMensagemSistema({ tipo: 'erro', texto: data.message ?? 'Credenciais inválidas.' });
      }
    } catch (e) {
      console.error('Erro ao conectar:', e);
      setMensagemSistema({ tipo: 'erro', texto: 'Erro de conexão com o servidor.' });
    }
  };

  const entrarComoSuperAdmin = async () => {
    try {
      const res  = await fetch(import.meta.env.VITE_API_URL + '/login/admin', {
        method:  'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ cpf: cpfSuperAdmin, senha: senhaSuperAdmin })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('tsea_token', data.token);
        setPerfilLogado('superadmin');
        setLogado(true);
      } else {
        setMensagemSistema({ tipo: 'erro', texto: data.message ?? 'Credenciais inválidas.' });
      }
    } catch (e) {
      console.error('Erro ao conectar:', e);
      setMensagemSistema({ tipo: 'erro', texto: 'Erro de conexão com o servidor.' });
    }
  };

 // ------------------------------------------
  // Registrar empréstimo (NFC já identificou o operador)
  // ------------------------------------------
  const registrarEmprestimoNFC = async (itensCarrinho) => {
    if (!operadorNFC) {
      setMensagemSistema({ tipo: 'erro', texto: 'Nenhum operador identificado pelo NFC.' });
      return;
    }
    if (!itensCarrinho?.length) {
      setMensagemSistema({ tipo: 'aviso', texto: 'Nenhuma ferramenta selecionada.' });
      return;
    }
    
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/registrar/Emprestimo', {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_cpf: operadorNFC.cpf,
          ferramentas: itensCarrinho.map(i => ({ 
            ferramenta_id: i.id, 
            quantidade: i.quantidade || 1 
          }))
        })
      });

      if (res.ok) {
        setMensagemSistema({ tipo: 'sucesso', texto: 'Empréstimo registrado com sucesso!' });
        
        // Atualiza as listas do painel do almoxarife em segundo plano
        carregarAtivos();
        carregarEmprestimos();

        // ==========================================
        // LÓGICA DE BLOQUEIO: Volta a pedir o NFC
        // ==========================================
        setNfcLiberado(false);
        setOperadorNFC(null);
        setTempoRestante(0);
        setEmprestimosOperador([]);
        // ==========================================

      } else {
        const erroData = await res.json();
        setMensagemSistema({ tipo: 'erro', texto: erroData.message || 'Erro ao registrar empréstimo no servidor.' });
      }

    } catch (erro) {
      console.error('Erro ao realizar empréstimo:', erro);
      setMensagemSistema({ tipo: 'erro', texto: 'Falha de comunicação com o servidor.' });
    }
  };

  // ------------------------------------------
  // Devolver ferramenta (remove da lista imediatamente ao ter sucesso)
  // ------------------------------------------
const devolverFerramenta = async (emprestimoId) => {
  try {
    const res = await fetch(import.meta.env.VITE_API_URL + '/registrar/Devolucao', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emprestimo_id: emprestimoId,
        user_cpf: operadorNFC.cpf
      })
    });
    const data = await res.json();
    if (res.ok) {
      setEmprestimosOperador(prev => prev.filter(e => e.emprestimo_id !== emprestimoId));
      setMensagemSistema({ tipo: 'sucesso', texto: 'Devolução registrada com sucesso.' });
      carregarAtivos();
      carregarDevolucoes();
      carregarFerramentas();
    } else {
      setMensagemSistema({ tipo: 'erro', texto: data.message ?? 'Erro ao registrar devolução.' });
    }
  } catch (e) {
    console.error('Erro ao devolver ferramenta:', e);
    setMensagemSistema({ tipo: 'erro', texto: 'Erro de conexão ao registrar devolução.' });
  }
};

const cancelarAcessoNFC = () => {
  setNfcLiberado(false);
  setOperadorNFC(null);
  setEmprestimosOperador([]);
  setMensagemSistema({ tipo: 'aviso', texto: 'Acesso do operador encerrado.' });
};

  // ------------------------------------------
  // RENDER
  // ------------------------------------------
  return (
    <div>
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

      {!logado ? (
        <Login
          perfil={perfil} setPerfil={setPerfil}
          statusBiometria={statusBiometria} setStatusBiometria={setStatusBiometria}
          videoRef={videoRef}
          progressoEscaneamento={progressoEscaneamento} setProgressoEscaneamento={setProgressoEscaneamento}
          entrarNoPainelManualmente={() => { setPerfilLogado('func'); setLogado(true); }}
          idAlmoxarife={idAlmoxarife}         setIdAlmoxarife={setIdAlmoxarife}
          senhaLoginAlmoxarife={senhaLoginAlmoxarife} setSenhaLoginAlmoxarife={setSenhaLoginAlmoxarife}
          entrarComoAlmoxarife={entrarComoAlmoxarife}
          senhaSuperAdmin={senhaSuperAdmin}   setSenhaSuperAdmin={setSenhaSuperAdmin}
          cpfSuperAdmin={cpfSuperAdmin}       setCpfSuperAdmin={setCpfSuperAdmin}
          entrarComoSuperAdmin={entrarComoSuperAdmin}
          mensagemSistema={mensagemSistema}   setMensagemSistema={setMensagemSistema}
        />

      ) : perfilLogado === 'func' ? (
        <PainelOperador
          abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva}
          operador={operador}
          ativosEmCustodiaTSEA={ativosEmCustodiaTSEA}
          logout={() => { setLogado(false); setPerfil(null); setStatusBiometria('desligado'); setProgressoEscaneamento(0); }}
        />

      ) : perfilLogado === 'adm' ? (
        <PainelAlmoxarife
          TSEA={TSEA}
          nfcLiberado={nfcLiberado}
          tempoRestante={tempoRestante}
          operadorNFC={operadorNFC}
          registrarEmprestimoNFC={registrarEmprestimoNFC}
          devolverFerramenta={devolverFerramenta}
          cancelarAcessoNFC={cancelarAcessoNFC}
          emprestimosOperador={emprestimosOperador}
          mensagemSistema={mensagemSistema}
          setMensagemSistema={setMensagemSistema}
          abaAtivaAdm={abaAtivaAdm}
          setAbaAtivaAdm={setAbaAtivaAdm}
          ativosEmCustodiaTSEA={ativosEmCustodiaTSEA}
          catalogoFerramentas={catalogoFerramentas}
          ultimasRetiradas={ultimasRetiradas}
          ultimasDevolucoes={ultimasDevolucoes}
          logout={() => { setLogado(false); setPerfil(null); setNfcLiberado(false); setOperadorNFC(null); setEmprestimosOperador([]); }}
        />

      ) : perfilLogado === 'superadmin' ? (
<PainelMaster
  abaAtivaSuper={abaAtivaSuper}
  setAbaAtivaSuper={setAbaAtivaSuper}
  ativosEmCustodiaTSEA={ativosEmCustodiaTSEA}
  catalogoFerramentas={catalogoFerramentas}
  logout={() => { setLogado(false); setPerfil(null); }}
/>
      ) : null}
    </div>
  );
}

export default App;