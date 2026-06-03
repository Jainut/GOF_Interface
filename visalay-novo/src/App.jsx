import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

const TSEA = {
  vermelho: '#E30613',
  preto: '#1A1A1A',
  cinzaEscuro: '#4A4A4A',
  cinzaMedio: '#CCCCCC',
  cinzaClaro: '#F5F5F5',
  cinzaBorda: '#999999',
  branco: '#FFFFFF'
};

const socket = io(import.meta.env.VITE_API_URL, { withCredentials: true });

// ==========================================
// COMPONENTE 1: LOGIN
// ==========================================
function Login({
  perfil, setPerfil, statusBiometria, setStatusBiometria, videoRef, progressoEscaneamento, setProgressoEscaneamento,
  entrarNoPainelManualmente, idAlmoxarife, setIdAlmoxarife, senhaLoginAlmoxarife, setSenhaLoginAlmoxarife, entrarComoAlmoxarife,
  senhaSuperAdmin, setSenhaSuperAdmin, entrarComoSuperAdmin
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
      console.error("Erro ao acessar a câmera: ", err);
      alert("Não foi possível acessar a câmera. Verifique as permissões do seu navegador.");
      setStatusBiometria('desligado');
    }
  };

  const desligarWebcamReal = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
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
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '380px', borderTop: `5px solid ${TSEA.vermelho}`, textAlign: 'center' }}>

          {!perfil && (
            <>
              <h4 style={{ margin: '0 0 20px 0', color: TSEA.preto }}>CONTROLE DE ACESSO MÓVEL</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => setPerfil('func')} style={{ padding: '15px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Acessar Totem Operacional</button>
                <button onClick={() => setPerfil('adm')} style={{ padding: '15px', background: TSEA.cinzaEscuro, color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Área do Almoxarife (ADM)</button>
                <button onClick={() => setPerfil('superadmin')} style={{ padding: '15px', background: TSEA.preto, color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Administrador Geral (MASTER)</button>
              </div>
            </>
          )}

          {perfil === 'func' && (
            <div>
              <h5 style={{ margin: '0 0 15px 0' }}>Validação Biométrica Requerida</h5>
              <div style={{ width: '200px', height: '200px', backgroundColor: '#111', borderRadius: '50%', margin: '0 auto 20px auto', position: 'relative', overflow: 'hidden', border: `4px solid ${statusBiometria === 'sucesso' ? '#2e7d32' : TSEA.vermelho}`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {statusBiometria === 'desligado' && <div style={{ color: '#666', fontSize: '14px' }}>Câmera Inativa</div>}
                {statusBiometria === 'carregando_camera' && <div style={{ color: '#fff', fontSize: '12px' }}>Iniciando lente...</div>}
                <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', transform: 'scaleX(-1)', display: (statusBiometria === 'camera_ativa' || statusBiometria === 'escanear' || statusBiometria === 'sucesso') ? 'block' : 'none' }} />
                {statusBiometria === 'escanear' && (
                  <>
                    <div style={{ position: 'absolute', width: '100%', height: '4px', backgroundColor: TSEA.vermelho, top: `${progressoEscaneamento}%`, left: 0, boxShadow: '0 0 8px red' }} />
                    <div style={{ position: 'absolute', bottom: '5px', color: '#fff', fontSize: '11px', background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px' }}>Análise: {progressoEscaneamento}%</div>
                  </>
                )}
                {statusBiometria === 'sucesso' && <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(46,125,50,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px' }}>Reconhecido</div>}
              </div>
              {statusBiometria === 'desligado' && <button onClick={ligarWebcamReal} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Habilitar Câmera</button>}
              {statusBiometria === 'camera_ativa' && <button onClick={() => setStatusBiometria('escanear')} style={{ width: '100%', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Escanear Face</button>}
              {statusBiometria === 'sucesso' && <button onClick={entrarNoPainelManualmente} style={{ width: '100%', padding: '14px', background: 'green', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Entrar no Totem</button>}
              <button onClick={() => { desligarWebcamReal(); setPerfil(null); setProgressoEscaneamento(0); }} style={{ marginTop: '15px', background: 'none', border: 'none', color: TSEA.vermelho, fontWeight: 'bold', cursor: 'pointer' }}>Cancelar e Voltar</button>
            </div>
          )}

          {perfil === 'adm' && (
            <div>
              <h5 style={{ margin: '0 0 15px 0' }}>Autenticação - Almoxarifado</h5>
              <input type="text" placeholder="ID do Almoxarife (admin)" value={idAlmoxarife} onChange={(e) => setIdAlmoxarife(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: `1px solid ${TSEA.cinzaMedio}`, textAlign: 'center', marginBottom: '10px', boxSizing: 'border-box' }} />
              <input type="password" placeholder="Senha ADM (1234)" value={senhaLoginAlmoxarife} onChange={(e) => setSenhaLoginAlmoxarife(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: `1px solid ${TSEA.cinzaMedio}`, textAlign: 'center', marginBottom: '15px', boxSizing: 'border-box' }} />
              <button onClick={entrarComoAlmoxarife} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Acessar Painel</button>
              <button onClick={() => setPerfil(null)} style={{ marginTop: '15px', background: 'none', border: 'none', color: TSEA.vermelho, fontWeight: 'bold', cursor: 'pointer' }}>Voltar</button>
            </div>
          )}

          {perfil === 'superadmin' && (
            <div>
              <h5 style={{ margin: '0 0 15px 0' }}>Acesso Master Corporativo</h5>
              <input type="password" placeholder="Senha Master (adminadmin)" value={senhaSuperAdmin} onChange={(e) => setSenhaSuperAdmin(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: `1px solid ${TSEA.cinzaMedio}`, textAlign: 'center', marginBottom: '15px', boxSizing: 'border-box' }} />
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
// COMPONENTE 2: PAINEL DO FUNCIONÁRIO
// ==========================================
function PainelOperador({
  abaAtiva, setAbaAtiva, operador, ativosEmCustodiaTSEA, solicitarDevolucaoImediata,
  pedidoAtivo, confirmarRetiradaComCartao, logout
}) {
  const [rfidInput, setRfidInput] = useState('');

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div style={{ textAlign: 'center', borderBottom: `3px solid ${TSEA.vermelho}`, paddingBottom: '15px', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '22px' }}>TSEA <span style={{ color: TSEA.vermelho }}>MOBILE</span></h3>
          <small style={{ color: TSEA.cinzaMedio, fontSize: '11px' }}>TOTEM OPERACIONAL</small>
        </div>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => setAbaAtiva('confirme_cartao')} className="btn-sidebar" style={{ backgroundColor: abaAtiva === 'confirme_cartao' ? TSEA.vermelho : 'transparent' }}>Confirme seu Cartão</button>
          <button onClick={() => setAbaAtiva('custodia')} className="btn-sidebar" style={{ backgroundColor: abaAtiva === 'custodia' ? TSEA.vermelho : 'transparent' }}>Minha Custódia ({ativosEmCustodiaTSEA.filter(a => a.matricula === operador.matricula && a.status === "EM CUSTÓDIA").length})</button>
          <button onClick={() => setAbaAtiva('info')} className="btn-sidebar" style={{ backgroundColor: abaAtiva === 'info' ? TSEA.vermelho : 'transparent' }}>Minhas Infos</button>
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

        {abaAtiva === 'confirme_cartao' && (
          <div style={{ backgroundColor: TSEA.branco, padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 10px 0', color: TSEA.vermelho }}>Aproximação de Crachá RFID</h3>
            <p style={{ color: '#555', fontSize: '15px', marginBottom: '25px' }}>Valide a retirada física das ferramentas preparadas pelo almoxarife.</p>
            {!pedidoAtivo ? (
              <div style={{ padding: '30px', border: '2px dashed #ccc', borderRadius: '8px', backgroundColor: '#fafafa', color: '#777' }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>Nenhum lote aguardando liberação no sensor para você.</p>
                <small>Solicite ao conferente do almoxarifado para registrar suas ferramentas.</small>
              </div>
            ) : pedidoAtivo.status === "Aguardando RFID" ? (
              <div style={{ maxWidth: '450px', margin: '0 auto', padding: '25px', border: `2px solid ${TSEA.vermelho}`, borderRadius: '8px', backgroundColor: '#fff9f9' }}>
                <h4 style={{ color: TSEA.vermelho, margin: '0 0 10px 0', animation: 'blink 1.5s infinite' }}>PASSE SEU CARTÃO NO TOTEM</h4>
                <p style={{ fontSize: '13px', color: '#444' }}>Lote pronto: <strong>#{pedidoAtivo.idPedido}</strong></p>
                <ul style={{ textAlign: 'left', display: 'inline-block', margin: '15px 0', paddingLeft: '20px', fontSize: '13px' }}>
                  {pedidoAtivo.itens.map((it, i) => <li key={i}><strong>{it}</strong></li>)}
                </ul>
                <div style={{ marginTop: '15px' }}>
                  <input
                    type="text"
                    placeholder="Aproxime o Cartão (RE-40922)"
                    value={rfidInput}
                    onChange={(e) => setRfidInput(e.target.value)}
                    style={{ padding: '12px', borderRadius: '4px', border: '1px solid #ccc', width: '220px', textAlign: 'center', fontWeight: 'bold' }}
                  />
                  <button onClick={() => {
                    if (rfidInput === operador.matricula) {
                      confirmarRetiradaComCartao();
                      setRfidInput('');
                      setAbaAtiva('custodia');
                    } else {
                      alert("Cartão não corresponde ao titular do pedido lançado!");
                    }
                  }} style={{ padding: '12px 20px', background: 'green', color: 'white', border: 'none', borderRadius: '4px', marginLeft: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Simular Bip</button>
                </div>
              </div>
            ) : (
              <p>Status do lote: {pedidoAtivo.status}</p>
            )}
          </div>
        )}

        {abaAtiva === 'custodia' && (
          <div style={{ backgroundColor: TSEA.branco, padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>Seus Ativos em Custódia Operacional</h3>
            {ativosEmCustodiaTSEA.filter(a => a.matricula === operador.matricula).length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>Nenhuma ferramenta vinculada à sua RE no momento.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {ativosEmCustodiaTSEA.filter(a => a.matricula === operador.matricula).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', border: `1px solid ${TSEA.cinzaMedio}`, borderRadius: '6px', background: item.status === "AGUARDANDO BAIXA" ? '#fffdf7' : '#fff' }}>
                    <div>
                      <h5 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{item.ferramenta}</h5>
                      <small style={{ color: '#666' }}>Retirada: {item.data} | Qtd: <strong>{item.qtd}x</strong></small>
                      <div style={{ marginTop: '5px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', background: item.status === "DEVOLVIDO" ? '#e8f5e9' : item.status === "AGUARDANDO BAIXA" ? '#fff3e0' : '#ffebee', color: item.status === "DEVOLVIDO" ? 'green' : item.status === "AGUARDANDO BAIXA" ? '#ef6c00' : TSEA.vermelho }}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    {item.status === "EM CUSTÓDIA" && (
                      <button onClick={() => solicitarDevolucaoImediata(item)} style={{ padding: '8px 12px', background: TSEA.cinzaEscuro, color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Solicitar Devolução</button>
                    )}
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
// COMPONENTE 3: PAINEL DO ALMOXARIFE
// ==========================================
function PainelAlmoxarife({
  nfcLiberado, tempoRestante,
  abaAtivaAdm, setAbaAtivaAdm, pedidoAtivo, senhaAlmoxarife, setSenhaAlmoxarife,
  devolucoesPendentes, senhaAlmoxarifeDevolucao, setSenhaAlmoxarifeDevolucao,
  aprovarBaixaDevolucao, ativosEmCustodiaTSEA, catalogoFerramentas, listaFuncionariosTSEA,
  carrinho, alterarQuantidadeCarrinho, emitirLotePeloAlmoxarife, ultimasRetiradas, ultimasDevolucoes, logout
}) {
  const [funcSelecionado, setFuncSelecionado] = useState('');

  return (
    <div className="layout-container">
      <aside className="sidebar no-print">
        <div style={{ textAlign: 'center', borderBottom: `3px solid ${TSEA.vermelho}`, paddingBottom: '15px', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '20px' }}>TSEA <span style={{ color: TSEA.vermelho }}>ADM</span></h3>
          <small style={{ color: TSEA.cinzaBorda, fontSize: '10px' }}>ALMOXARIFADO GESTÃO</small>
        </div>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <button onClick={() => setAbaAtivaAdm('solicitar_emprestimo')} className="btn-sidebar" style={{ backgroundColor: abaAtivaAdm === 'solicitar_emprestimo' ? TSEA.vermelho : 'transparent' }}>Solicitar Empréstimo</button>
          <button onClick={() => setAbaAtivaAdm('retornos')} className="btn-sidebar" style={{ backgroundColor: abaAtivaAdm === 'retornos' ? TSEA.vermelho : 'transparent' }}>Retornos / Baixas ({devolucoesPendentes.length})</button>
          <button onClick={() => setAbaAtivaAdm('monitor_ativas')} className="btn-sidebar" style={{ backgroundColor: abaAtivaAdm === 'monitor_ativas' ? TSEA.vermelho : 'transparent' }}>Monitor de Ativas</button>
          <button onClick={() => setAbaAtivaAdm('monitor_estoque')} className="btn-sidebar" style={{ backgroundColor: abaAtivaAdm === 'monitor_estoque' ? TSEA.vermelho : 'transparent' }}>Monitor de Estoque</button>
          <button onClick={() => setAbaAtivaAdm('historico_retiradas')} className="btn-sidebar" style={{ backgroundColor: abaAtivaAdm === 'historico_retiradas' ? TSEA.vermelho : 'transparent' }}>Últimas Retiradas</button>
          <button onClick={() => setAbaAtivaAdm('historico_devolucoes')} className="btn-sidebar" style={{ backgroundColor: abaAtivaAdm === 'historico_devolucoes' ? TSEA.vermelho : 'transparent' }}>Últimas Devoluções</button>
        </nav>
        <button onClick={logout} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Sair</button>
      </aside>

      <main className="content-main">

        {abaAtivaAdm === 'solicitar_emprestimo' && (
          !nfcLiberado ? (
            <div style={{ backgroundColor: TSEA.branco, padding: '30px', borderRadius: '8px', textAlign: 'center' }}>
              <h2>Acesso bloqueado</h2>
              <p>Passe o cartão NFC no totem para liberar</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              <div style={{ padding: '12px', background: '#e8f5e9', borderRadius: '6px' }}>
                Sessao: <strong>
                  {Math.floor(tempoRestante / 60)}:{(tempoRestante % 60).toString().padStart(2, '0')}
                </strong>
              </div>

              <div style={{ backgroundColor: TSEA.branco, padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                <h3 style={{ margin: '0 0 15px 0', borderBottom: `2px solid ${TSEA.cinzaClaro}`, paddingBottom: '8px' }}>Painel de Despacho de Ativos</h3>

                <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
                  <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}>1. Escolha o Funcionário Destinatário:</label>
                  <select value={funcSelecionado} onChange={(e) => setFuncSelecionado(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
                    <option value="">-- Selecione o Colaborador --</option>
                    {listaFuncionariosTSEA.filter(f => f.perfil === "Funcionário").map(f => (
                      <option key={f.matricula} value={f.matricula}>{f.nome} ({f.matricula})</option>
                    ))}
                  </select>
                </div>

                <h4 style={{ margin: '20px 0 10px 0' }}>2. Selecione as Ferramentas:</h4>
                <div className="grid-catalogo">
                  {catalogoFerramentas.map(item => {
                    const noCarrinho = carrinho.find(c => c.nome === item.nome)?.qtd || 0;
                    return (
                      <div key={item.id} className="card-ferramenta">
                        <div>
                          <span className="badge-categoria">{item.categoria}</span>
                          <h4 style={{ margin: '10px 0 5px 0', fontSize: '14px' }}>{item.nome}</h4>
                          <p style={{ margin: '0 0 15px 0', fontSize: '11px', color: '#666' }}>
                            Disponível: <strong style={{ color: item.disponivel === 0 ? 'red' : 'green' }}>{item.disponivel}</strong> / {item.total}
                          </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: TSEA.cinzaClaro, padding: '5px', borderRadius: '4px' }}>
                          <button onClick={() => alterarQuantidadeCarrinho(item.nome, 'subtrair')} style={{ width: '28px', height: '28px', background: TSEA.cinzaEscuro, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>-</button>
                          <span style={{ fontWeight: 'bold' }}>{noCarrinho}</span>
                          <button onClick={() => alterarQuantidadeCarrinho(item.nome, 'somar')} style={{ width: '28px', height: '28px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {carrinho.length > 0 && (
                <div style={{ backgroundColor: TSEA.branco, padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', borderTop: `4px solid ${TSEA.vermelho}` }}>
                  <h3 style={{ margin: '0 0 15px 0', color: TSEA.vermelho }}>Fechamento do Lote de Carga</h3>
                  <ul style={{ marginBottom: '20px' }}>
                    {carrinho.map((c, i) => <li key={i} style={{ fontSize: '14px' }}><strong>{c.qtd}x</strong> - {c.nome}</li>)}
                  </ul>
                  <div style={{ padding: '15px', background: TSEA.cinzaClaro, borderRadius: '6px', marginBottom: '15px', maxWidth: '400px' }}>
                    <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Código do Almoxarife para Assinatura (9999):</label>
                    <input type="password" value={senhaAlmoxarife} onChange={(e) => setSenhaAlmoxarife(e.target.value)} placeholder="Digite o código" style={{ padding: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                  </div>
                  <button onClick={() => {
                    if (!funcSelecionado) return alert("Selecione um funcionário antes de lançar!");
                    emitirLotePeloAlmoxarife(funcSelecionado);
                  }} style={{ padding: '14px 25px', background: 'green', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}>
                    ENVIAR PARA VALIDAÇÃO RFID NO TOTEM
                  </button>
                </div>
              )}

              {pedidoAtivo && pedidoAtivo.status === "Aguardando RFID" && (
                <div style={{ backgroundColor: '#fff8e1', padding: '15px', borderRadius: '6px', borderLeft: '5px solid #ffb300' }}>
                  <p style={{ margin: 0, color: '#b78103', fontWeight: 'bold' }}>Lote #{pedidoAtivo.idPedido} enviado! Aguardando o funcionário passar o cartão no totem secundário.</p>
                </div>
              )}

            </div>
          )
        )}

        {abaAtivaAdm === 'retornos' && (
          <div style={{ backgroundColor: TSEA.branco, padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h4>Baixas de Devolução Pendentes (Conferência de Balcão)</h4>
            {devolucoesPendentes.length === 0 ? (
              <p style={{ color: '#888' }}>Nenhuma ferramenta na esteira de devolução.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {devolucoesPendentes.map((dev) => (
                  <div key={dev.id} style={{ padding: '15px', border: `1px solid ${TSEA.cinzaMedio}`, borderRadius: '6px', backgroundColor: '#fafafa' }}>
                    <h5>{dev.ferramenta} ({dev.qtd}x)</h5>
                    <p style={{ margin: '5px 0', fontSize: '13px' }}>Colaborador: {dev.funcionario} | RE: {dev.matricula}</p>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <input type="password" placeholder="Código (9999)" value={senhaAlmoxarifeDevolucao} onChange={(e) => setSenhaAlmoxarifeDevolucao(e.target.value)} style={{ padding: '8px', width: '130px', borderRadius: '4px', border: '1px solid #ccc' }} />
                      <button onClick={() => aprovarBaixaDevolucao(dev.id, dev.funcionario, dev.ferramenta)} style={{ padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>CONFIRMAR DEVOLUÇÃO</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {abaAtivaAdm === 'monitor_ativas' && (
          <div style={{ backgroundColor: TSEA.branco, padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h4>Monitor Geral de Ferramentas Ativas</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: TSEA.cinzaClaro }}>
                  <th style={{ padding: '12px' }}>Funcionário</th>
                  <th style={{ padding: '12px' }}>Ferramenta</th>
                  <th style={{ padding: '12px' }}>Qtd</th>
                  <th style={{ padding: '12px' }}>Data Retirada</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {ativosEmCustodiaTSEA.filter(a => a.status !== "DEVOLVIDO").map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}>{item.funcionario} ({item.matricula})</td>
                    <td style={{ padding: '12px' }}>{item.ferramenta}</td>
                    <td style={{ padding: '12px' }}>{item.qtd}x</td>
                    <td style={{ padding: '12px' }}>{item.data}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', background: item.status === 'EM CUSTÓDIA' ? '#ffebee' : '#fff3e0', color: item.status === 'EM CUSTÓDIA' ? TSEA.vermelho : '#ef6c00', fontWeight: 'bold', fontSize: '11px' }}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {abaAtivaAdm === 'monitor_estoque' && (
          <div style={{ backgroundColor: TSEA.branco, padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h4>Inventário Físico do Almoxarifado</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: TSEA.cinzaClaro }}>
                  <th style={{ padding: '12px' }}>Ferramenta</th>
                  <th style={{ padding: '12px' }}>Categoria</th>
                  <th style={{ padding: '12px' }}>Qtd Disponível</th>
                  <th style={{ padding: '12px' }}>Qtd Total</th>
                </tr>
              </thead>
              <tbody>
                {catalogoFerramentas.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}><strong>{item.nome}</strong></td>
                    <td style={{ padding: '12px' }}>{item.categoria}</td>
                    <td style={{ padding: '12px', color: item.disponivel === 0 ? 'red' : 'green', fontWeight: 'bold' }}>{item.disponivel}</td>
                    <td style={{ padding: '12px' }}>{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {abaAtivaAdm === 'historico_retiradas' && (
          <div style={{ backgroundColor: TSEA.branco, padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h4>Histórico de Últimas Retiradas</h4>
            {ultimasRetiradas.map((r, i) => (
              <div key={i} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                {r.data} - <strong>{r.funcionario}</strong> retirou {r.qtd}x {r.ferramenta}
              </div>
            ))}
          </div>
        )}

        {abaAtivaAdm === 'historico_devolucoes' && (
          <div style={{ backgroundColor: TSEA.branco, padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h4>Histórico de Últimas Devoluções</h4>
            {ultimasDevolucoes.map((d, i) => (
              <div key={i} style={{ padding: '10px', borderBottom: '1px solid #eee', color: 'green' }}>
                {d.dataDevolucao} - <strong>{d.funcionario}</strong> devolveu {d.qtd}x {d.ferramenta}
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}

// ==========================================
// COMPONENTE 4: PAINEL MASTER
// ==========================================
function PainelMaster({
  abaAtivaSuper, setAbaAtivaSuper, ativosEmCustodiaTSEA, catalogoFerramentas,
  listaFuncionariosTSEA, cadastrarNovoUsuario, logout
}) {
  const [novoNome, setNovoNome] = useState('');
  const [novaMatricula, setNovaMatricula] = useState('');
  const [novoPerfil, setNovoPerfil] = useState('Funcionário');

  const handleCadastrar = (e) => {
    e.preventDefault();
    if (!novoNome || !novaMatricula) return alert("Preencha todos os campos!");
    cadastrarNovoUsuario({ nome: novoNome, matricula: novaMatricula, perfil: novoPerfil, setor: "Manufatura TSEA", cargo: "Operador", status: "Ativo" });
    setNovoNome(''); setNovaMatricula('');
    alert("Usuário registrado corporativamente!");
  };

  return (
    <div className="layout-container">
      <aside className="sidebar no-print">
        <div style={{ textAlign: 'center', borderBottom: `3px solid ${TSEA.vermelho}`, paddingBottom: '15px', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '20px' }}>TSEA <span style={{ color: TSEA.vermelho }}>MASTER</span></h3>
          <small style={{ color: TSEA.cinzaBorda, fontSize: '10px' }}>GERAL / RH / TI</small>
        </div>
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <button onClick={() => setAbaAtivaSuper('registro_usuario')} className="btn-sidebar" style={{ backgroundColor: abaAtivaSuper === 'registro_usuario' ? TSEA.vermelho : 'transparent' }}>Registro de Usuário</button>
          <button onClick={() => setAbaAtivaSuper('gerenciamento_usuario')} className="btn-sidebar" style={{ backgroundColor: abaAtivaSuper === 'gerenciamento_usuario' ? TSEA.vermelho : 'transparent' }}>Gerenciamento TSEA</button>
          <button onClick={() => setAbaAtivaSuper('m_ativas')} className="btn-sidebar" style={{ backgroundColor: abaAtivaSuper === 'm_ativas' ? TSEA.vermelho : 'transparent' }}>Monitor de Ativas</button>
          <button onClick={() => setAbaAtivaSuper('m_estoque')} className="btn-sidebar" style={{ backgroundColor: abaAtivaSuper === 'm_estoque' ? TSEA.vermelho : 'transparent' }}>Monitor de Estoque</button>
        </nav>
        <button onClick={logout} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Sair</button>
      </aside>

      <main className="content-main">
        <header style={{ backgroundColor: TSEA.branco, padding: '15px 20px', borderRadius: '8px', borderLeft: `6px solid ${TSEA.vermelho}`, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
          <h3 style={{ margin: 0 }}>Painel Master de Auditoria de TI</h3>
        </header>

        {abaAtivaSuper === 'registro_usuario' && (
          <div style={{ backgroundColor: TSEA.branco, padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h4>Cadastrar Novo Usuário no Sistema</h4>
            <form onSubmit={handleCadastrar} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
              <input type="text" placeholder="Nome Completo" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="text" placeholder="Matrícula / RE" value={novaMatricula} onChange={(e) => setNovaMatricula(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <select value={novoPerfil} onChange={(e) => setNovoPerfil(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option value="Funcionário">Funcionário (Operador)</option>
                <option value="Almoxarife">Almoxarife</option>
              </select>
              <button type="submit" style={{ padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>SALVAR NO BANCO</button>
            </form>
          </div>
        )}

        {abaAtivaSuper === 'gerenciamento_usuario' && (
          <div style={{ backgroundColor: TSEA.branco, padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h4>Quadro Geral de Usuários - Base de Dados</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead><tr style={{ backgroundColor: '#eee' }}><th style={{ padding: '10px' }}>Nome</th><th style={{ padding: '10px' }}>Matrícula</th><th style={{ padding: '10px' }}>Perfil</th></tr></thead>
              <tbody>
                {listaFuncionariosTSEA.map((u, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '10px' }}>{u.nome}</td>
                    <td style={{ padding: '10px' }}>{u.matricula}</td>
                    <td style={{ padding: '10px' }}>{u.perfil}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {abaAtivaSuper === 'm_ativas' && (
          <div style={{ backgroundColor: TSEA.branco, padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h4>Auditoria Master: Ferramentas Ativas</h4>
            {ativosEmCustodiaTSEA.filter(a => a.status !== "DEVOLVIDO").map((item, idx) => (
              <div key={idx} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{item.funcionario} possui: {item.qtd}x {item.ferramenta}</div>
            ))}
          </div>
        )}

        {abaAtivaSuper === 'm_estoque' && (
          <div style={{ backgroundColor: TSEA.branco, padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h4>Auditoria Master: Estoque Consolidado</h4>
            {catalogoFerramentas.map(item => (
              <div key={item.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{item.nome} | Disponível: {item.disponivel} / Total: {item.total}</div>
            ))}
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
  const [logado, setLogado] = useState(false);
  const [perfilLogado, setPerfilLogado] = useState(null);
  const [perfil, setPerfil] = useState(null);

  const [operador] = useState({
    nome: "Carlos Eduardo Santos",
    matricula: "RE-40922",
    setor: "Bobinagem de Transformadores",
    cargo: "Técnico de Isolamento Especializado",
    empresa: "TSEA Energia S.A.",
    status: "Ativo Operacional"
  });

  const [abaAtiva, setAbaAtiva] = useState('confirme_cartao');
  const [abaAtivaAdm, setAbaAtivaAdm] = useState('solicitar_emprestimo');
  const [abaAtivaSuper, setAbaAtivaSuper] = useState('registro_usuario');

  const [carrinho, setCarrinho] = useState([]);
  const [statusBiometria, setStatusBiometria] = useState('desligado');
  const [progressoEscaneamento, setProgressoEscaneamento] = useState(0);
  const videoRef = useRef(null);

  const [idAlmoxarife, setIdAlmoxarife] = useState('');
  const [senhaLoginAlmoxarife, setSenhaLoginAlmoxarife] = useState('');
  const [senhaSuperAdmin, setSenhaSuperAdmin] = useState('');
  const [senhaAlmoxarife, setSenhaAlmoxarife] = useState('');
  const [senhaAlmoxarifeDevolucao, setSenhaAlmoxarifeDevolucao] = useState('');

  const [catalogoFerramentas, setCatalogoFerramentas] = useState([
    { id: 1, nome: "Chave Estrela 1/2 texturada TSEA", categoria: "Manuais", total: 15, disponivel: 15 },
    { id: 2, nome: "Alicate de Pressão Isolado 1000V", categoria: "Manuais", total: 10, disponivel: 10 },
    { id: 3, nome: "Multímetro Digital Fluke Industrial", categoria: "Medição", total: 5, disponivel: 5 },
    { id: 4, nome: "Torquímetro Snap-on Digital 10-200Nm", categoria: "Medição", total: 4, disponivel: 4 },
    { id: 5, nome: "Parafusadeira de Impacto Bosch 18V", categoria: "Elétricas", total: 8, disponivel: 8 }
  ]);

  const [ativosEmCustodiaTSEA, setAtivosEmCustodiaTSEA] = useState([]);
  const [ultimasRetiradas, setUltimasRetiradas] = useState([]);
  const [ultimasDevolucoes, setUltimasDevolucoes] = useState([]);
  const [devolucoesPendentes, setDevolucoesPendentes] = useState([]);
  const [pedidoAtivo, setPedidoAtivo] = useState(null);
  const [nfcLiberado, setNfcLiberado] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(0);

  const [listaFuncionariosTSEA, setListaFuncionariosTSEA] = useState([
    { nome: "Carlos Eduardo Santos", matricula: "RE-40922", perfil: "Funcionário" },
    { nome: "Almoxarife Sergio", matricula: "ID-1002", perfil: "Almoxarife" }
  ]);

  useEffect(() => {
    socket.on("nfcAuth", () => {
      setNfcLiberado(true);
      setTempoRestante(10 * 60);
    });
    return () => socket.off("nfcAuth");
  }, []);

  useEffect(() => {
    if (!nfcLiberado) return;
    const intervalo = setInterval(() => {
      setTempoRestante(prev => {
        if (prev <= 1) {
          clearInterval(intervalo);
          setNfcLiberado(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalo);
  }, [nfcLiberado]);

  const entrarComoAlmoxarife = () => {
    if (idAlmoxarife === 'admin' && senhaLoginAlmoxarife === '1234') {
      setPerfilLogado('adm'); setLogado(true);
    } else { alert("ID ou Senha de Almoxarife inválidos!"); }
  };

  const entrarComoSuperAdmin = () => {
    if (senhaSuperAdmin === 'adminadmin') {
      setPerfilLogado('superadmin'); setLogado(true);
    } else { alert("Chave mestre inválida!"); }
  };

  const alterarQuantidadeCarrinho = (nome, acao) => {
    const itemEstoque = catalogoFerramentas.find(f => f.nome === nome);
    const itemCarrinho = carrinho.find(c => c.nome === nome);
    if (acao === 'somar') {
      if (itemCarrinho && itemCarrinho.qtd >= itemEstoque.disponivel) {
        alert("Quantidade máxima disponível em estoque atingida!");
        return;
      }
      itemCarrinho
        ? setCarrinho(carrinho.map(c => c.nome === nome ? { ...c, qtd: c.qtd + 1 } : c))
        : setCarrinho([...carrinho, { nome, qtd: 1 }]);
    } else {
      if (!itemCarrinho) return;
      itemCarrinho.qtd === 1
        ? setCarrinho(carrinho.filter(c => c.nome !== nome))
        : setCarrinho(carrinho.map(c => c.nome === nome ? { ...c, qtd: c.qtd - 1 } : c));
    }
  };

  const emitirLotePeloAlmoxarife = (matricula) => {
    if (senhaAlmoxarife !== '9999') { alert("Código do Almoxarife incorreto!"); return; }
    const func = listaFuncionariosTSEA.find(f => f.matricula === matricula);
    const novoChamado = {
      idPedido: Math.floor(100000 + Math.random() * 900000),
      funcionario: func.nome,
      badge: func.matricula,
      timestamp: new Date().toLocaleString(),
      status: "Aguardando RFID",
      itens: carrinho.map(c => `${c.nome} (${c.qtd}x)`),
      itensPuros: carrinho
    };
    setPedidoAtivo(novoChamado);
    setSenhaAlmoxarife('');
    alert("Lote assinado! Peça ao operador para passar o cartão no Totem.");
  };

  const confirmarRetiradaComCartao = () => {
    const dataAtual = new Date().toLocaleString();
    setCatalogoFerramentas(prevEstoque => prevEstoque.map(ferr => {
      const correspondente = pedidoAtivo.itensPuros.find(c => c.nome === ferr.nome);
      return correspondente ? { ...ferr, disponivel: ferr.disponivel - correspondente.qtd } : ferr;
    }));
    pedidoAtivo.itensPuros.forEach(item => {
      const registro = { funcionario: pedidoAtivo.funcionario, matricula: pedidoAtivo.badge, ferramenta: item.nome, qtd: item.qtd, data: dataAtual, status: "EM CUSTÓDIA" };
      setAtivosEmCustodiaTSEA(prev => [registro, ...prev]);
      setUltimasRetiradas(prev => [registro, ...prev]);
    });
    setPedidoAtivo(null);
    setCarrinho([]);
    alert("Crachá reconhecido! Ferramentas vinculadas à sua RE e estoque atualizado!");
  };

  const solicitarDevolucaoImediata = (item) => {
    setAtivosEmCustodiaTSEA(ativosEmCustodiaTSEA.map(a => (a.matricula === item.matricula && a.ferramenta === item.ferramenta && a.status === "EM CUSTÓDIA") ? { ...a, status: "AGUARDANDO BAIXA" } : a));
    setDevolucoesPendentes([...devolucoesPendentes, { id: Date.now(), ...item }]);
    alert("Item colocado na esteira de devolução. Entregue a ferramenta no balcão.");
  };

  const aprovarBaixaDevolucao = (idDevolucao, funcNome, ferramentaNome) => {
    if (senhaAlmoxarifeDevolucao === '9999') {
      const dev = devolucoesPendentes.find(d => d.id === idDevolucao);
      setDevolucoesPendentes(devolucoesPendentes.filter(d => d.id !== idDevolucao));
      setAtivosEmCustodiaTSEA(ativosEmCustodiaTSEA.map(a => (a.funcionario === funcNome && a.ferramenta === ferramentaNome && a.status === "AGUARDANDO BAIXA") ? { ...a, status: "DEVOLVIDO" } : a));
      setCatalogoFerramentas(catalogoFerramentas.map(f => f.nome === ferramentaNome ? { ...f, disponivel: f.disponivel + dev.qtd } : f));
      setUltimasDevolucoes([{ funcionario: funcNome, matricula: dev.matricula, ferramenta: ferramentaNome, qtd: dev.qtd, dataDevolucao: new Date().toLocaleString() }, ...ultimasDevolucoes]);
      setSenhaAlmoxarifeDevolucao('');
      alert("Retorno processado! Estoque atualizado nas três frentes.");
    } else { alert("Senha do conferente incorreta!"); }
  };

  const cadastrarNovoUsuario = (u) => setListaFuncionariosTSEA([...listaFuncionariosTSEA, u]);

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
        @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
      `}</style>

      {!logado ? (
        <Login
          perfil={perfil} setPerfil={setPerfil} statusBiometria={statusBiometria} setStatusBiometria={setStatusBiometria} videoRef={videoRef}
          progressoEscaneamento={progressoEscaneamento} setProgressoEscaneamento={setProgressoEscaneamento}
          entrarNoPainelManualmente={() => { setPerfilLogado('func'); setLogado(true); }}
          idAlmoxarife={idAlmoxarife} setIdAlmoxarife={setIdAlmoxarife}
          senhaLoginAlmoxarife={senhaLoginAlmoxarife} setSenhaLoginAlmoxarife={setSenhaLoginAlmoxarife} entrarComoAlmoxarife={entrarComoAlmoxarife}
          senhaSuperAdmin={senhaSuperAdmin} setSenhaSuperAdmin={setSenhaSuperAdmin} entrarComoSuperAdmin={entrarComoSuperAdmin}
        />
      ) : perfilLogado === 'func' ? (
        <PainelOperador
          abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} operador={operador}
          ativosEmCustodiaTSEA={ativosEmCustodiaTSEA} solicitarDevolucaoImediata={solicitarDevolucaoImediata}
          pedidoAtivo={pedidoAtivo} confirmarRetiradaComCartao={confirmarRetiradaComCartao}
          logout={() => { setLogado(false); setPerfil(null); setStatusBiometria('desligado'); setProgressoEscaneamento(0); }}
        />
      ) : perfilLogado === 'adm' ? (
        <PainelAlmoxarife
          nfcLiberado={nfcLiberado} tempoRestante={tempoRestante}
          abaAtivaAdm={abaAtivaAdm} setAbaAtivaAdm={setAbaAtivaAdm} pedidoAtivo={pedidoAtivo}
          senhaAlmoxarife={senhaAlmoxarife} setSenhaAlmoxarife={setSenhaAlmoxarife}
          devolucoesPendentes={devolucoesPendentes} senhaAlmoxarifeDevolucao={senhaAlmoxarifeDevolucao}
          setSenhaAlmoxarifeDevolucao={setSenhaAlmoxarifeDevolucao} aprovarBaixaDevolucao={aprovarBaixaDevolucao}
          ativosEmCustodiaTSEA={ativosEmCustodiaTSEA} catalogoFerramentas={catalogoFerramentas} listaFuncionariosTSEA={listaFuncionariosTSEA}
          carrinho={carrinho} alterarQuantidadeCarrinho={alterarQuantidadeCarrinho} emitirLotePeloAlmoxarife={emitirLotePeloAlmoxarife}
          ultimasRetiradas={ultimasRetiradas} ultimasDevolucoes={ultimasDevolucoes}
          logout={() => { setLogado(false); setPerfil(null); setCarrinho([]); }}
        />
      ) : perfilLogado === 'superadmin' ? (
        <PainelMaster
          abaAtivaSuper={abaAtivaSuper} setAbaAtivaSuper={setAbaAtivaSuper} ativosEmCustodiaTSEA={ativosEmCustodiaTSEA}
          catalogoFerramentas={catalogoFerramentas} listaFuncionariosTSEA={listaFuncionariosTSEA}
          cadastrarNovoUsuario={cadastrarNovoUsuario}
          logout={() => { setLogado(false); setPerfil(null); }}
        />
      ) : null}
    </div>
  );
}

export default App;