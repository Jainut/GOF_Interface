import React, { useState } from 'react';

export default function PainelAlmoxarife({
  TSEA, abaAtivaAdm, setAbaAtivaAdm, pedidoAtivo, senhaAlmoxarife, setSenhaAlmoxarife,
  devolucoesPendentes, senhaAlmoxarifeDevolucao, setSenhaAlmoxarifeDevolucao,
  aprovarBaixaDevolucao, ativosEmCustodiaTSEA, catalogoFerramentas, listaFuncionariosTSEA,
  carrinho, alterarQuantidadeCarrinho, emitirLotePeloAlmoxarife, ultimasRetiradas, ultimasDevolucoes, logout, nfcLiberado, tempoRestante
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
                  {Math.floor(tempoRestante / 60)}:
                  {(tempoRestante % 60).toString().padStart(2, '0')}
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
                    <input
                      type="password"
                      value={senhaAlmoxarife}
                      onChange={(e) => setSenhaAlmoxarife(e.target.value)}
                      placeholder="Digite o código"
                      style={{ padding: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!funcSelecionado) return alert("Selecione um funcionário antes de lançar!");
                      emitirLotePeloAlmoxarife(funcSelecionado);
                    }}
                    style={{ padding: '14px 25px', background: 'green', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' }}
                  >
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