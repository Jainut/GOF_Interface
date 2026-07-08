import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../hooks/useAppData';
import { useAuth } from '../hooks/useAuth';
import { TSEA } from '../utils/theme';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginOperador, loginAlmoxarife, loginSuperAdmin, perfilLogado } = useAuth();
  const [mostrarSenhaAlmoxarife, setMostrarSenhaAlmoxarife] = useState(false);
  const [mostrarSenhaMaster, setMostrarSenhaMaster] = useState(false);
  const {
    perfil,
    setPerfil,
    statusBiometria,
    setStatusBiometria,
    videoRef,
    progressoEscaneamento,
    setProgressoEscaneamento,
    idAlmoxarife,
    setIdAlmoxarife,
    senhaLoginAlmoxarife,
    setSenhaLoginAlmoxarife,
    cpfSuperAdmin,
    setCpfSuperAdmin,
    senhaSuperAdmin,
    setSenhaSuperAdmin,
    mensagemSistema,
    setMensagemSistema,
    carregarDadosProtegidos,
    limparSessaoVisual
  } = useAppData();

  useEffect(() => {
    if (!perfilLogado) limparSessaoVisual();
  }, [limparSessaoVisual, perfilLogado]);

  useEffect(() => {
    if (perfilLogado === 'func') navigate('/operador', { replace: true });
    if (perfilLogado === 'adm') navigate('/almoxarife', { replace: true });
    if (perfilLogado === 'superadmin') navigate('/master', { replace: true });
  }, [navigate, perfilLogado]);

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
  }, [setProgressoEscaneamento, setStatusBiometria, statusBiometria]);

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

  const voltarParaSelecao = () => {
    desligarWebcamReal();
    limparSessaoVisual();
  };

  const entrarNoPainelManualmente = () => {
    loginOperador();
    navigate('/operador', { replace: true });
  };

  const entrarComoAlmoxarife = async () => {
    try {
      await loginAlmoxarife({ cpf: idAlmoxarife, senha: senhaLoginAlmoxarife });
      carregarDadosProtegidos();
      navigate('/almoxarife', { replace: true });
    } catch (e) {
      setMensagemSistema({ tipo: 'erro', texto: e.message || 'Erro de conexão com o servidor.' });
    }
  };

  const entrarComoSuperAdmin = async () => {
    try {
      await loginSuperAdmin({ cpf: cpfSuperAdmin, senha: senhaSuperAdmin });
      carregarDadosProtegidos();
      navigate('/master', { replace: true });
    } catch (e) {
      setMensagemSistema({ tipo: 'erro', texto: e.message || 'Erro de conexão com o servidor.' });
    }
  };

  const BotaoVisualizarSenha = ({ ativo, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      title={ativo ? 'Ocultar senha' : 'Mostrar senha'}
      aria-label={ativo ? 'Ocultar senha' : 'Mostrar senha'}
      style={{
        position: 'absolute',
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '34px',
        height: '34px',
        border: 'none',
        background: 'transparent',
        color: TSEA.cinzaEscuro,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0
      }}
    >
      {ativo ? (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.89 1 12a18.45 18.45 0 0 1 5.06-6.06" />
          <path d="M9.9 4.24A10.78 10.78 0 0 1 12 4c5 0 9.27 3.11 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
      ) : (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );

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
          {mensagemSistema && (
            <div style={{
              padding: '10px 14px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px', fontWeight: 'bold',
              backgroundColor: mensagemSistema.tipo === 'erro' ? '#ffebee' : mensagemSistema.tipo === 'sucesso' ? '#e8f5e9' : '#fff8e1',
              color: mensagemSistema.tipo === 'erro' ? TSEA.vermelho : mensagemSistema.tipo === 'sucesso' ? '#2e7d32' : '#f57f17',
              border: `1px solid ${mensagemSistema.tipo === 'erro' ? '#ffcdd2' : mensagemSistema.tipo === 'sucesso' ? '#c8e6c9' : '#ffecb3'}`,
              cursor: 'pointer'
            }} onClick={() => setMensagemSistema(null)}>
              {mensagemSistema.texto} ×
            </div>
          )}

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
                onClick={voltarParaSelecao}
                style={{ marginTop: '15px', background: 'none', border: 'none', color: TSEA.vermelho, fontWeight: 'bold', cursor: 'pointer' }}
              >
                Cancelar e Voltar
              </button>
            </div>
          )}

          {perfil === 'adm' && (
            <div>
              <h5 style={{ margin: '0 0 15px 0' }}>Autenticação - Almoxarifado</h5>
              <input
                type="text"
                placeholder="CPF do Almoxarife"
                autoComplete="off"
                name="almoxarife-cpf"
                value={idAlmoxarife}
                onChange={(e) => setIdAlmoxarife(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: `1px solid ${TSEA.cinzaMedio}`, textAlign: 'center', marginBottom: '10px', boxSizing: 'border-box' }}
              />
              <div style={{ position: 'relative', marginBottom: '15px' }}>
                <input
                  type={mostrarSenhaAlmoxarife ? 'text' : 'password'}
                  placeholder="Senha"
                  autoComplete="new-password"
                  name="almoxarife-password"
                  value={senhaLoginAlmoxarife}
                  onChange={(e) => setSenhaLoginAlmoxarife(e.target.value)}
                  style={{ width: '100%', padding: '12px 44px 12px 12px', borderRadius: '6px', border: `1px solid ${TSEA.cinzaMedio}`, textAlign: 'center', boxSizing: 'border-box' }}
                />
                <BotaoVisualizarSenha
                  ativo={mostrarSenhaAlmoxarife}
                  onClick={() => setMostrarSenhaAlmoxarife(prev => !prev)}
                />
              </div>
              <button onClick={entrarComoAlmoxarife} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Acessar Painel</button>
              <button onClick={voltarParaSelecao} style={{ marginTop: '15px', background: 'none', border: 'none', color: TSEA.vermelho, fontWeight: 'bold', cursor: 'pointer' }}>Voltar</button>
            </div>
          )}

          {perfil === 'superadmin' && (
            <div>
              <h5 style={{ margin: '0 0 15px 0' }}>Acesso Master Corporativo</h5>
              <input
                type="text"
                placeholder="CPF do Administrador"
                autoComplete="off"
                name="master-cpf"
                value={cpfSuperAdmin}
                onChange={(e) => setCpfSuperAdmin(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: `1px solid ${TSEA.cinzaMedio}`, textAlign: 'center', marginBottom: '10px', boxSizing: 'border-box' }}
              />
              <div style={{ position: 'relative', marginBottom: '15px' }}>
                <input
                  type={mostrarSenhaMaster ? 'text' : 'password'}
                  placeholder="Senha Master"
                  autoComplete="new-password"
                  name="master-password"
                  value={senhaSuperAdmin}
                  onChange={(e) => setSenhaSuperAdmin(e.target.value)}
                  style={{ width: '100%', padding: '12px 44px 12px 12px', borderRadius: '6px', border: `1px solid ${TSEA.cinzaMedio}`, textAlign: 'center', boxSizing: 'border-box' }}
                />
                <BotaoVisualizarSenha
                  ativo={mostrarSenhaMaster}
                  onClick={() => setMostrarSenhaMaster(prev => !prev)}
                />
              </div>
              <button onClick={entrarComoSuperAdmin} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Entrar como Admin</button>
              <button onClick={voltarParaSelecao} style={{ marginTop: '15px', background: 'none', border: 'none', color: TSEA.vermelho, fontWeight: 'bold', cursor: 'pointer' }}>Voltar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
