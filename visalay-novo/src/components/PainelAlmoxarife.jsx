import { useState } from 'react';

// ── Ícones SVG inline ────────────────────────────────────────────────────────
const Icons = {
  nfc: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2z"/>
      <path d="M9 12h.01M12 12h.01M15 12h.01"/>
    </svg>
  ),
  tools: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  return: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 14 4 9l5-5"/>
      <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>
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
  history: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5M12 7v5l4 2"/>
    </svg>
  ),
  historyReturn: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/>
      <path d="m9 12 2 2 4-4"/>
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  ban: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
    </svg>
  ),
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  clock: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  package: (size = 28) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),
  loan: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  stockLg: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  ),
  returned: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 14 4 9l5-5"/>
      <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>
    </svg>
  ),
};

export default function PainelAlmoxarife({
  TSEA,
  nfcLiberado,
  tempoRestante,
  operadorNFC,
  registrarEmprestimoNFC,
  devolverFerramenta,
  emprestimosOperador,
  mensagemSistema,
  setMensagemSistema,
  abaAtivaAdm,
  setAbaAtivaAdm,
  ativosEmCustodiaTSEA,
  catalogoFerramentas,
  ultimasRetiradas,
  ultimasDevolucoes,
  logout,
  // Função para cancelar/limpar acesso NFC — precisa ser passada via prop do App.jsx
  cancelarAcessoNFC,
}) {
  const [selecionadas, setSelecionadas] = useState({});

  const alterarQtd = (item, delta) => {
    setSelecionadas(prev => {
      const atual = prev[item.id] ?? 0;
      const nova = Math.max(0, Math.min(atual + delta, item.disponivel));
      if (nova === 0) {
        const resto = { ...prev };
        delete resto[item.id];
        return resto;
      }
      return { ...prev, [item.id]: nova };
    });
  };

  const itensCarrinho = catalogoFerramentas
    .filter(f => selecionadas[f.id] > 0)
    .map(f => ({ ...f, qtd: selecionadas[f.id] }));

  const finalizarEmprestimo = () => {
    if (itensCarrinho.length === 0) {
      setMensagemSistema({ tipo: 'aviso', texto: 'Nenhuma ferramenta selecionada.' });
      return;
    }
    registrarEmprestimoNFC(itensCarrinho);
    setSelecionadas({});
  };

  // ── Cores das mensagens ──────────────────────────────────────────────────
  const corMensagem =
    mensagemSistema?.tipo === 'sucesso' ? '#2e7d32'
    : mensagemSistema?.tipo === 'erro'  ? '#c62828'
    : mensagemSistema?.tipo === 'aviso' ? '#e65100'
    : '#1565c0';

  const bgMensagem =
    mensagemSistema?.tipo === 'sucesso' ? '#e8f5e9'
    : mensagemSistema?.tipo === 'erro'  ? '#ffebee'
    : mensagemSistema?.tipo === 'aviso' ? '#fff3e0'
    : '#e3f2fd';

  // ── Métricas para os cards do dashboard ─────────────────────────────────
  const totalEmCustodia = ativosEmCustodiaTSEA.filter(a => a.status !== 'DEVOLVIDO').length;
  const totalFerramentas = catalogoFerramentas.reduce((s, f) => s + f.total, 0);
  const disponiveis = catalogoFerramentas.reduce((s, f) => s + f.disponivel, 0);
  const totalDevolucoes = ultimasDevolucoes.length;

  // ── Tela bloqueada aguardando NFC ────────────────────────────────────────
  const telaBloqueada = (
    <div style={{
      backgroundColor: TSEA.branco, padding: '60px 40px', borderRadius: '8px',
      textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      <div style={{ color: TSEA.cinzaBorda, marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
        {Icons.nfc}
      </div>
      <h2 style={{ color: TSEA.preto, margin: '0 0 10px 0' }}>Aguardando Cartão NFC</h2>
      <p style={{ color: '#666', margin: 0, fontSize: '15px' }}>
        Peça ao operador para aproximar o cartão no totem para identificação automática.
      </p>
    </div>
  );

  // ── Banner do operador identificado ─────────────────────────────────────
  const bannerOperador = nfcLiberado && (
    <div style={{
      padding: '12px 16px', background: '#e8f5e9', borderRadius: '6px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      border: '1px solid #a5d6a7', flexWrap: 'wrap', gap: '10px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#2e7d32' }}>{Icons.user}</span>
        <div>
          <strong style={{ fontSize: '15px' }}>{operadorNFC?.nome}</strong>
          {operadorNFC?.cpf && (
            <span style={{ marginLeft: '12px', color: '#555', fontSize: '13px' }}>
              CPF: {operadorNFC.cpf}
            </span>
          )}
          {operadorNFC?.setor && (
            <span style={{ marginLeft: '12px', color: '#555', fontSize: '13px' }}>
              Setor: {operadorNFC.setor}
            </span>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          fontFamily: 'monospace', fontWeight: 'bold',
          color: tempoRestante < 60 ? '#c62828' : '#2e7d32'
        }}>
          {Icons.clock}
          {Math.floor(tempoRestante / 60)}:{(tempoRestante % 60).toString().padStart(2, '0')}
        </span>
        {/* ── Botão Cancelar Acesso ── */}
        {cancelarAcessoNFC && (
          <button
            onClick={cancelarAcessoNFC}
            title="Encerrar sessão do operador"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px', background: '#c62828',
              color: 'white', border: 'none', borderRadius: '4px',
              fontWeight: 'bold', fontSize: '13px', cursor: 'pointer'
            }}
          >
            {Icons.ban}
            Cancelar Acesso
          </button>
        )}
      </div>
    </div>
  );

  // ── Card de métrica ──────────────────────────────────────────────────────
  const MetricCard = ({ icon, label, value, color, bg }) => (
    <div style={{
      background: TSEA.branco, borderRadius: '8px', padding: '20px 24px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      borderLeft: `4px solid ${color}`,
      display: 'flex', alignItems: 'center', gap: '18px', flex: '1 1 180px'
    }}>
      <div style={{
        width: '52px', height: '52px', borderRadius: '10px',
        background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: color, flexShrink: 0
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '28px', fontWeight: '800', color: TSEA.preto, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: '12px', color: TSEA.cinzaBorda, marginTop: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      </div>
    </div>
  );

  return (
    <div className="layout-container">

      {/* ── SIDEBAR ── */}
      <aside className="sidebar no-print">
        <div style={{
          textAlign: 'center', borderBottom: `3px solid ${TSEA.vermelho}`,
          paddingBottom: '15px', marginBottom: '20px'
        }}>
          <h3 style={{ margin: 0, fontSize: '20px' }}>
            TSEA <span style={{ color: TSEA.vermelho }}>ADM</span>
          </h3>
          <small style={{ color: TSEA.cinzaBorda, fontSize: '10px' }}>ALMOXARIFADO GESTÃO</small>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {[
            { key: 'solicitar_emprestimo', label: 'Solicitar Empréstimo', icon: Icons.tools },
            { key: 'devolucao',            label: 'Devolução',            icon: Icons.return },
            { key: 'monitor_ativas',       label: 'Monitor de Ativas',    icon: Icons.monitor },
            { key: 'monitor_estoque',      label: 'Monitor de Estoque',   icon: Icons.stock },
            { key: 'historico_retiradas',  label: 'Últimas Retiradas',    icon: Icons.history },
            { key: 'historico_devolucoes', label: 'Últimas Devoluções',   icon: Icons.historyReturn },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setAbaAtivaAdm(key)}
              className="btn-sidebar"
              style={{
                backgroundColor: abaAtivaAdm === key ? TSEA.vermelho : 'transparent',
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
          {Icons.logout}
          Sair
        </button>
      </aside>

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <main className="content-main">

        {/* Cards de métricas — visíveis em todas as abas */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
          <MetricCard
            icon={Icons.loan}
            label="Em custódia"
            value={totalEmCustodia}
            color={TSEA.vermelho}
            bg="#fff0f0"
          />
          <MetricCard
            icon={Icons.package}
            label="Total de ferramentas"
            value={totalFerramentas}
            color="#1565c0"
            bg="#e3f2fd"
          />
          <MetricCard
            icon={Icons.stockLg}
            label="Disponíveis"
            value={disponiveis}
            color="#2e7d32"
            bg="#e8f5e9"
          />
          <MetricCard
            icon={Icons.returned}
            label="Devoluções"
            value={totalDevolucoes}
            color="#6a1b9a"
            bg="#f3e5f5"
          />
        </div>

        {/* Mensagem inline */}
        {mensagemSistema && (
          <div style={{
            padding: '12px 16px', borderRadius: '6px', marginBottom: '16px',
            background: bgMensagem, color: corMensagem, fontWeight: 'bold',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span>{mensagemSistema.texto}</span>
            <button
              onClick={() => setMensagemSistema(null)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: corMensagem, display: 'flex', alignItems: 'center'
              }}
            >
              {Icons.close}
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════
            ABA: SOLICITAR EMPRÉSTIMO
        ══════════════════════════════════════ */}
        {abaAtivaAdm === 'solicitar_emprestimo' && (
          !nfcLiberado ? telaBloqueada : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {bannerOperador}

              <div style={{
                backgroundColor: TSEA.branco, padding: '20px',
                borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}>
                <h3 style={{
                  margin: '0 0 15px 0',
                  borderBottom: `2px solid ${TSEA.cinzaClaro}`,
                  paddingBottom: '8px'
                }}>
                  Ferramentas Disponíveis
                </h3>

                {catalogoFerramentas.length === 0 ? (
                  <p style={{ color: '#888', fontStyle: 'italic' }}>Carregando ferramentas...</p>
                ) : (
                  <div className="grid-catalogo">
                    {catalogoFerramentas.map((item, idx) => {
                      const qtdSelecionada = selecionadas[item.id] ?? 0;
                      const esgotado = item.disponivel === 0;
                      const noMaximo = qtdSelecionada >= item.disponivel;
                      return (
                        <div
                          key={`${item.id}-${idx}`}
                          className="card-ferramenta"
                          style={{ opacity: esgotado ? 0.5 : 1 }}
                        >
                          <div>
                            <span className="badge-categoria">{item.categoria}</span>
                            <h4 style={{ margin: '10px 0 5px 0', fontSize: '14px' }}>{item.nome}</h4>
                            <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: '#666' }}>
                              Disponível:{' '}
                              <strong style={{ color: esgotado ? 'red' : 'green' }}>
                                {item.disponivel}
                              </strong>{' '}
                              / {item.total}
                            </p>
                          </div>

                          <div style={{
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between',
                            background: TSEA.cinzaClaro, padding: '5px', borderRadius: '4px'
                          }}>
                            <button
                              onClick={() => alterarQtd(item, -1)}
                              disabled={qtdSelecionada === 0}
                              style={{
                                width: '30px', height: '30px',
                                background: qtdSelecionada === 0 ? '#ccc' : TSEA.cinzaEscuro,
                                color: 'white', border: 'none', borderRadius: '4px',
                                cursor: qtdSelecionada === 0 ? 'default' : 'pointer',
                                fontWeight: 'bold', fontSize: '16px'
                              }}
                            >−</button>

                            <span style={{ fontWeight: 'bold', minWidth: '28px', textAlign: 'center', fontSize: '16px' }}>
                              {qtdSelecionada}
                            </span>

                            <button
                              onClick={() => alterarQtd(item, 1)}
                              disabled={esgotado || noMaximo}
                              style={{
                                width: '30px', height: '30px',
                                background: (esgotado || noMaximo) ? '#ccc' : TSEA.vermelho,
                                color: 'white', border: 'none', borderRadius: '4px',
                                cursor: (esgotado || noMaximo) ? 'default' : 'pointer',
                                fontWeight: 'bold', fontSize: '16px'
                              }}
                            >+</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {itensCarrinho.length > 0 && (
                <div style={{
                  backgroundColor: TSEA.branco, padding: '20px', borderRadius: '8px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  borderTop: `4px solid ${TSEA.vermelho}`
                }}>
                  <h4 style={{ margin: '0 0 12px 0', color: TSEA.vermelho }}>Resumo do Empréstimo</h4>
                  <ul style={{ margin: '0 0 16px 0', paddingLeft: '20px' }}>
                    {itensCarrinho.map((c, i) => (
                      <li key={i} style={{ fontSize: '14px', marginBottom: '4px' }}>
                        <strong>{c.qtd}x</strong> {c.nome}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={finalizarEmprestimo}
                    style={{
                      padding: '12px 28px', background: '#2e7d32',
                      color: 'white', border: 'none', borderRadius: '4px',
                      fontWeight: 'bold', fontSize: '15px', cursor: 'pointer'
                    }}
                  >
                    Finalizar Empréstimo
                  </button>
                </div>
              )}

            </div>
          )
        )}

        {/* ══════════════════════════════════════
            ABA: DEVOLUÇÃO
        ══════════════════════════════════════ */}
        {abaAtivaAdm === 'devolucao' && (
          !nfcLiberado ? telaBloqueada : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {bannerOperador}

              <div style={{
                backgroundColor: TSEA.branco, padding: '20px',
                borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}>
                <h3 style={{
                  margin: '0 0 15px 0',
                  borderBottom: `2px solid ${TSEA.cinzaClaro}`,
                  paddingBottom: '8px'
                }}>
                  Ferramentas em Empréstimo
                </h3>

                {!emprestimosOperador || emprestimosOperador.length === 0 ? (
                  <p style={{ color: '#888', fontStyle: 'italic' }}>
                    Nenhuma ferramenta em empréstimo para este operador.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {emprestimosOperador.map((item, idx) => (
                      <div
                        key={`${item.emprestimo_id}-${idx}`}
                        style={{
                          display: 'flex', justifyContent: 'space-between',
                          alignItems: 'center', padding: '14px 16px',
                          border: `1px solid ${TSEA.cinzaMedio}`,
                          borderRadius: '6px', backgroundColor: TSEA.branco
                        }}
                      >
                        <div>
                          <h5 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{item.ferramenta}</h5>
                          <small style={{ color: '#666' }}>
                            Retirada: {item.data} | Qtd: <strong>{item.qtd}x</strong>
                          </small>
                        </div>
                        <button
                          onClick={() => devolverFerramenta(item.emprestimo_id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '7px',
                            padding: '9px 18px', background: '#2e7d32',
                            color: 'white', border: 'none', borderRadius: '4px',
                            fontWeight: 'bold', cursor: 'pointer', fontSize: '13px'
                          }}
                        >
                          {Icons.check}
                          Devolver
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {/* ══════════════════════════════════════
            ABA: MONITOR DE ATIVAS
        ══════════════════════════════════════ */}
        {abaAtivaAdm === 'monitor_ativas' && (
          <div style={{
            backgroundColor: TSEA.branco, padding: '25px',
            borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
          }}>
            <h4>Monitor Geral de Ferramentas Ativas</h4>
            {ativosEmCustodiaTSEA.filter(a => a.status !== 'DEVOLVIDO').length === 0 ? (
              <p style={{ color: '#888' }}>Nenhuma ferramenta em custódia no momento.</p>
            ) : (
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
                  {ativosEmCustodiaTSEA.filter(a => a.status !== 'DEVOLVIDO').map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{item.funcionario} ({item.matricula})</td>
                      <td style={{ padding: '12px' }}>{item.ferramenta}</td>
                      <td style={{ padding: '12px' }}>{item.qtd}x</td>
                      <td style={{ padding: '12px' }}>{item.data}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold',
                          background: item.status === 'EM CUSTÓDIA' ? '#ffebee' : '#fff3e0',
                          color: item.status === 'EM CUSTÓDIA' ? TSEA.vermelho : '#ef6c00'
                        }}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════
            ABA: MONITOR DE ESTOQUE
        ══════════════════════════════════════ */}
        {abaAtivaAdm === 'monitor_estoque' && (
          <div style={{
            backgroundColor: TSEA.branco, padding: '25px',
            borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
          }}>
            <h4>Inventário Físico do Almoxarifado</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: TSEA.cinzaClaro }}>
                  <th style={{ padding: '12px' }}>Ferramenta</th>
                  <th style={{ padding: '12px' }}>Categoria</th>
                  <th style={{ padding: '12px' }}>Disponível</th>
                  <th style={{ padding: '12px' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {catalogoFerramentas.map((item, idx) => (
                  <tr key={`${item.id}-${idx}`} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px' }}><strong>{item.nome}</strong></td>
                    <td style={{ padding: '12px' }}>{item.categoria}</td>
                    <td style={{ padding: '12px', color: item.disponivel === 0 ? 'red' : 'green', fontWeight: 'bold' }}>
                      {item.disponivel}
                    </td>
                    <td style={{ padding: '12px' }}>{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ══════════════════════════════════════
            ABA: HISTÓRICO RETIRADAS
        ══════════════════════════════════════ */}
        {abaAtivaAdm === 'historico_retiradas' && (
          <div style={{
            backgroundColor: TSEA.branco, padding: '25px',
            borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
          }}>
            <h4>Histórico de Últimas Retiradas</h4>
            {ultimasRetiradas.length === 0 ? (
              <p style={{ color: '#888' }}>Nenhuma retirada registrada.</p>
            ) : (
              ultimasRetiradas.map((r, i) => (
                <div key={i} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                  {r.data} — <strong>{r.funcionario}</strong> retirou {r.qtd}x {r.ferramenta}
                </div>
              ))
            )}
          </div>
        )}

        {/* ══════════════════════════════════════
            ABA: HISTÓRICO DEVOLUÇÕES
        ══════════════════════════════════════ */}
        {abaAtivaAdm === 'historico_devolucoes' && (
          <div style={{
            backgroundColor: TSEA.branco, padding: '25px',
            borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
          }}>
            <h4>Histórico de Últimas Devoluções</h4>
            {ultimasDevolucoes.length === 0 ? (
              <p style={{ color: '#888' }}>Nenhuma devolução registrada.</p>
            ) : (
              ultimasDevolucoes.map((d, i) => (
                <div key={i} style={{ padding: '10px', borderBottom: '1px solid #eee', color: '#2e7d32' }}>
                  {d.dataDevolucao} — <strong>{d.funcionario}</strong> devolveu {d.qtd}x {d.ferramenta}
                </div>
              ))
            )}
          </div>
        )}

      </main>
    </div>
  );
}
