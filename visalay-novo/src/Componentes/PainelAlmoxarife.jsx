import { useState } from 'react';

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
  logout
}) {
  const [selecionadas, setSelecionadas] = useState({});

  const alterarQtd = (item, delta) => {
    setSelecionadas(prev => {
      const atual = prev[item.id] ?? 0;
      const nova = Math.max(0, Math.min(atual + delta, item.disponivel));
      if (nova === 0) {
        const { [item.id]: _, ...resto } = prev;
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

  // Cores das mensagens inline
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

  // Tela exibida enquanto aguarda o cartão NFC
  const telaBloqueada = (
    <div style={{
      backgroundColor: TSEA.branco, padding: '60px 40px', borderRadius: '8px',
      textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📡</div>
      <h2 style={{ color: TSEA.preto, margin: '0 0 10px 0' }}>Aguardando Cartão NFC</h2>
      <p style={{ color: '#666', margin: 0, fontSize: '15px' }}>
        Peça ao operador para aproximar o cartão no totem para identificação automática.
      </p>
    </div>
  );

  // Banner com dados do operador identificado + contador de sessão
  const bannerOperador = nfcLiberado && (
    <div style={{
      padding: '12px 16px', background: '#e8f5e9', borderRadius: '6px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      border: '1px solid #a5d6a7'
    }}>
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
      <span style={{ fontFamily: 'monospace', fontWeight: 'bold', color: tempoRestante < 60 ? '#c62828' : '#2e7d32' }}>
        ⏱ {Math.floor(tempoRestante / 60)}:{(tempoRestante % 60).toString().padStart(2, '0')}
      </span>
    </div>
  );

  return (
    <div className="layout-container">

      {/* ---- SIDEBAR ---- */}
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
          <button
            onClick={() => setAbaAtivaAdm('solicitar_emprestimo')}
            className="btn-sidebar"
            style={{ backgroundColor: abaAtivaAdm === 'solicitar_emprestimo' ? TSEA.vermelho : 'transparent' }}
          >
            Solicitar Empréstimo
          </button>
          <button
            onClick={() => setAbaAtivaAdm('devolucao')}
            className="btn-sidebar"
            style={{ backgroundColor: abaAtivaAdm === 'devolucao' ? TSEA.vermelho : 'transparent' }}
          >
            Devolução
          </button>
          <button
            onClick={() => setAbaAtivaAdm('monitor_ativas')}
            className="btn-sidebar"
            style={{ backgroundColor: abaAtivaAdm === 'monitor_ativas' ? TSEA.vermelho : 'transparent' }}
          >
            Monitor de Ativas
          </button>
          <button
            onClick={() => setAbaAtivaAdm('monitor_estoque')}
            className="btn-sidebar"
            style={{ backgroundColor: abaAtivaAdm === 'monitor_estoque' ? TSEA.vermelho : 'transparent' }}
          >
            Monitor de Estoque
          </button>
          <button
            onClick={() => setAbaAtivaAdm('historico_retiradas')}
            className="btn-sidebar"
            style={{ backgroundColor: abaAtivaAdm === 'historico_retiradas' ? TSEA.vermelho : 'transparent' }}
          >
            Últimas Retiradas
          </button>
          <button
            onClick={() => setAbaAtivaAdm('historico_devolucoes')}
            className="btn-sidebar"
            style={{ backgroundColor: abaAtivaAdm === 'historico_devolucoes' ? TSEA.vermelho : 'transparent' }}
          >
            Últimas Devoluções
          </button>
        </nav>

        <button
          onClick={logout}
          style={{
            width: '100%', padding: '12px', background: TSEA.vermelho,
            color: 'white', border: 'none', borderRadius: '4px',
            fontWeight: 'bold', cursor: 'pointer'
          }}
        >
          Sair
        </button>
      </aside>

      {/* ---- CONTEÚDO PRINCIPAL ---- */}
      <main className="content-main">

        {/* Mensagem inline (sem alert, sem modal) */}
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
                color: corMensagem, fontWeight: 'bold', fontSize: '18px', lineHeight: 1
              }}
            >×</button>
          </div>
        )}

        {/* ==============================
            ABA: SOLICITAR EMPRÉSTIMO
        ============================== */}
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

                          {/* Seletor +/- */}
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

              {/* Resumo + botão finalizar */}
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

        {/* ==============================
            ABA: DEVOLUÇÃO
        ============================== */}
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
                            padding: '9px 18px', background: '#2e7d32',
                            color: 'white', border: 'none', borderRadius: '4px',
                            fontWeight: 'bold', cursor: 'pointer', fontSize: '13px'
                          }}
                        >
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

        {/* ==============================
            ABA: MONITOR DE ATIVAS
        ============================== */}
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

        {/* ==============================
            ABA: MONITOR DE ESTOQUE
        ============================== */}
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

        {/* ==============================
            ABA: HISTÓRICO RETIRADAS
        ============================== */}
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

        {/* ==============================
            ABA: HISTÓRICO DEVOLUÇÕES
        ============================== */}
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