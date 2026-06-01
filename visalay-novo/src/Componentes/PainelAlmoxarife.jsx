import React from 'react';

export default function PainelAlmoxarife({
  TSEA, abaAtivaAdm, setAbaAtivaAdm, pedidoAtivo, senhaAlmoxarife, setSenhaAlmoxarife, 
  setPedidoAtivo, devolucoesPendentes, senhaAlmoxarifeDevolucao, setSenhaAlmoxarifeDevolucao, 
  aprovarBaixaDevolucao, ativosEmCustodiaTSEA, listaFuncionariosTSEA, funcSelecionadoId, 
  setFuncSelecionadoId, logout
}) {
  return (
    <div className="layout-container">
      <aside className="sidebar no-print">
        <div style={{ textAlign: 'center', borderBottom: `3px solid ${TSEA.vermelho}`, paddingBottom: '15px', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '20px' }}>TSEA <span style={{ color: TSEA.vermelho }}>ADM</span></h3>
          <small style={{ color: TSEA.cinzaBorda, fontSize: '10px' }}>ALMOXARIFADO</small>
        </div>
        <nav className="nav-menu" style={{ flex: 1 }}>
          <button onClick={() => setAbaAtivaAdm('aprovar_emprestimos')} className="btn-sidebar" style={{ width: '100%', padding: '12px', backgroundColor: abaAtivaAdm === 'aprovar_emprestimos' ? TSEA.vermelho : 'transparent', color: 'white', border: 'none', textAlign: 'left', fontWeight: 'bold', borderRadius: '4px', marginBottom: '5px' }}>Pedidos Saída</button>
          <button onClick={() => setAbaAtivaAdm('aprovar_devolucoes')} className="btn-sidebar" style={{ width: '100%', padding: '12px', backgroundColor: abaAtivaAdm === 'aprovar_devolucoes' ? TSEA.vermelho : 'transparent', color: 'white', border: 'none', textAlign: 'left', fontWeight: 'bold', borderRadius: '4px', marginBottom: '5px' }}>Retornos / Baixas</button>
          <button onClick={() => setAbaAtivaAdm('ferramentas_emprestadas')} className="btn-sidebar" style={{ width: '100%', padding: '12px', backgroundColor: abaAtivaAdm === 'ferramentas_emprestadas' ? TSEA.vermelho : 'transparent', color: 'white', border: 'none', textAlign: 'left', fontWeight: 'bold', borderRadius: '4px', marginBottom: '5px' }}>Monitor de Ativos</button>
          <button onClick={() => { setAbaAtivaAdm('id_funcionarios'); setFuncSelecionadoId(null); }} className="btn-sidebar" style={{ width: '100%', padding: '12px', backgroundColor: abaAtivaAdm === 'id_funcionarios' ? TSEA.vermelho : 'transparent', color: 'white', border: 'none', textAlign: 'left', fontWeight: 'bold', borderRadius: '4px', marginBottom: '5px' }}>ID dos Funcionários</button>
        </nav>
        <button onClick={logout} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Sair</button>
      </aside>

      <main className="content-main">
        {abaAtivaAdm === 'aprovar_emprestimos' && (
          <div style={{ backgroundColor: TSEA.branco, padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            {!pedidoAtivo ? (
              <div className="no-print" style={{ textAlign: 'center', padding: '30px 0', color: '#888' }}>
                <h3>Nenhum pedido pendente</h3>
              </div>
            ) : (
              <div>
                <div className="no-print" style={{ borderBottom: `2px solid ${TSEA.cinzaClaro}`, paddingBottom: '10px', marginBottom: '15px' }}>
                  <h4 style={{ margin: 0 }}>Chamado: #{pedidoAtivo.idPedido}</h4>
                  <small style={{ color: '#666' }}>Emissão: {pedidoAtivo.timestamp}</small>
                </div>
                <div className="no-print" style={{ fontSize: '14px', marginBottom: '15px' }}>
                  <p><strong>Operador:</strong> {pedidoAtivo.funcionario} (RE: {pedidoAtivo.badge})</p>
                </div>
                <h5 className="no-print" style={{ color: TSEA.vermelho, margin: '10px 0' }}>Ativos Solicitados:</h5>
                <ul className="no-print" style={{ paddingLeft: '20px', fontSize: '14px' }}>
                  {pedidoAtivo.itens?.map((it, idx) => <li key={idx} style={{ fontWeight: 'bold', marginBottom: '5px' }}>{it}</li>)}
                </ul>

                {pedidoAtivo.status === "Aguardando Separação" && (
                  <div className="no-print" style={{ marginTop: '20px', padding: '15px', backgroundColor: TSEA.cinzaClaro, borderRadius: '6px' }}>
                    <h5 style={{ margin: '0 0 10px 0' }}>Validar Saída</h5>
                    <input type="password" value={senhaAlmoxarife} onChange={(e) => setSenhaAlmoxarife(e.target.value)} placeholder="Código (9999)" style={{ padding: '10px', width: '150px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
                    <button onClick={() => { 
                      if(senhaAlmoxarife === '9999'){ 
                        pedidoAtivo.status = "Aprovado pelo Almoxarife"; 
                        localStorage.setItem('pedidoTSEA', JSON.stringify(pedidoAtivo)); 
                        setSenhaAlmoxarife(''); 
                        alert("Saída Autorizada!"); 
                      } else { alert("Código incorreto!"); }
                    }} style={{ padding: '10px 15px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>AUTORIZAR</button>
                  </div>
                )}

                {pedidoAtivo.status === "Confirmado pelo Funcionario" && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }} className="no-print">
                    <button onClick={() => window.print()} style={{ flex: 1, padding: '12px', background: '#0284c7', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>EMITIR RELATÓRIO PDF</button>
                    <button onClick={() => { localStorage.removeItem('pedidoTSEA'); setPedidoAtivo(null); }} style={{ padding: '12px', background: TSEA.cinzaEscuro, color: 'white', border: 'none', borderRadius: '4px' }}>Fechar Chamado</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {abaAtivaAdm === 'aprovar_devolucoes' && (
          <div style={{ backgroundColor: TSEA.branco, padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 15px 0' }}>Baixas de Devolução</h4>
            {devolucoesPendentes.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888' }}>Nenhuma devolução aguardando conferência.</p>
            ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {devolucoesPendentes.map((dev) => (
                      <div key={dev.id} style={{ padding: '15px', border: `2px solid ${TSEA.cinzaMedio}`, borderRadius: '6px', backgroundColor: '#fafafa' }}>
                        <span style={{ background: '#e0f2f1', color: '#004d40', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>RA CONFIRMADO</span>
                        <h5 style={{ margin: '10px 0 5px 0' }}>Ferramenta: {dev.ferramenta} ({dev.qtd}x)</h5>
                        <small style={{ color: '#555' }}>De: {dev.funcionario} | RE: {dev.matricula}</small>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center' }}>
                          <input type="password" placeholder="Código (9999)" value={senhaAlmoxarifeDevolucao} onChange={(e) => setSenhaAlmoxarifeDevolucao(e.target.value)} style={{ padding: '8px', width: '130px', borderRadius: '4px', border: '1px solid #ccc' }} />
                          <button onClick={() => aprovarBaixaDevolucao(dev.id, dev.funcionario, dev.ferramenta)} style={{ padding: '8px 12px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '12px' }}>DAR BAIXA</button>
                        </div>
                      </div>
                    ))}
                  </div>
            )}
          </div>
        )}

        {abaAtivaAdm === 'ferramentas_emprestadas' && (
          <div style={{ backgroundColor: TSEA.branco, padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 15px 0' }}>Rastreabilidade de Ativos (Tempo Real)</h4>
            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ backgroundColor: TSEA.cinzaClaro }}>
                    <th style={{ padding: '12px' }}>Colaborador</th>
                    <th style={{ padding: '12px' }}>Ferramenta</th>
                    <th style={{ padding: '12px' }}>Qtd.</th>
                    <th style={{ padding: '12px' }}>Registro</th>
                    <th style={{ padding: '12px' }}>Status Ativo</th>
                  </tr>
                </thead>
                <tbody>
                  {ativosEmCustodiaTSEA.map((item, index) => {
                    let bgStatus = '#ffebee'; let corStatus = TSEA.vermelho; let classeAdicional = "";
                    if (item.status === "AGUARDANDO BAIXA") { bgStatus = '#fff3e0'; corStatus = '#ef6c00'; classeAdicional = "pisca-alerta"; }
                    else if (item.status === "DEVOLVIDO") { bgStatus = '#e8f5e9'; corStatus = 'green'; }
                    return (
                      <tr key={index} style={{ borderBottom: `1px solid ${TSEA.cinzaMedio}` }}>
                        <td style={{ padding: '12px' }}><strong>{item.funcionario}</strong><div style={{ fontSize: '11px', color: '#666' }}>RE: {item.matricula}</div></td>
                        <td style={{ padding: '12px' }}>{item.ferramenta}</td>
                        <td style={{ padding: '12px' }}>{item.qtd}x</td>
                        <td style={{ padding: '12px', fontSize: '12px' }}>
                          {item.status === "DEVOLVIDO" ? <div><del>{item.data}</del><div style={{ color: 'green', fontWeight: 'bold' }}>Retornado: {item.dataDevolucao}</div></div> : item.data}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span className={classeAdicional} style={{ background: bgStatus, color: corStatus, padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', display: 'inline-block' }}>{item.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {abaAtivaAdm === 'id_funcionarios' && (
          <div style={{ backgroundColor: TSEA.branco, padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>ID dos Funcionários com Ferramentas</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
              {funcSelecionadoId === null ? (
                listaFuncionariosTSEA.map((func) => {
                  const qtdFerramentasAtivas = ativosEmCustodiaTSEA.filter(
                    a => a.matricula === func.matricula && (a.status === "EM CUSTÓDIA" || a.status === "AGUARDANDO BAIXA")
                  ).length;

                  return (
                    <div key={func.matricula} className="card-funcionario-adm" onClick={() => setFuncSelecionadoId(func)}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div>
                          <strong style={{ fontSize: '16px', color: TSEA.preto }}>{func.nome}</strong>
                          <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>RE: {func.matricula} | {func.cargo} ({func.setor})</div>
                        </div>
                        <span style={{ 
                          background: qtdFerramentasAtivas > 0 ? '#ffebee' : '#f0f0f0', 
                          color: qtdFerramentasAtivas > 0 ? TSEA.vermelho : '#666', 
                          padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' 
                        }}>
                          {qtdFerramentasAtivas} item(ns) em custódia
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ border: `2px solid ${TSEA.vermelho}`, padding: '20px', borderRadius: '8px', backgroundColor: '#fff' }}>
                  <button onClick={() => setFuncSelecionadoId(null)} style={{ background: TSEA.cinzaEscuro, color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', marginBottom: '15px' }}>← Voltar para Lista</button>
                  <h4 style={{ margin: '0 0 5px 0', color: TSEA.vermelho }}>{funcSelecionadoId.nome}</h4>
                  <p style={{ margin: '0', fontSize: '13px', color: '#555' }}>RE: {funcSelecionadoId.matricula} | {funcSelecionadoId.cargo} - {funcSelecionadoId.setor}</p>
                  <h5 style={{ marginTop: '25px', marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '5px' }}>Equipamentos Atuais do Colaborador:</h5>
                  {ativosEmCustodiaTSEA.filter(a => a.matricula === funcSelecionadoId.matricula && (a.status === "EM CUSTÓDIA" || a.status === "AGUARDANDO BAIXA")).length === 0 ? (
                    <p style={{ color: '#888', fontStyle: 'italic', fontSize: '13px' }}>Nenhum ativo vinculado a este RE no momento.</p>
                  ) : (
                    <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                      {ativosEmCustodiaTSEA
                        .filter(a => a.matricula === funcSelecionadoId.matricula && (a.status === "EM CUSTÓDIA" || a.status === "AGUARDANDO BAIXA"))
                        .map((item, idx) => (
                          <li key={idx}>
                            <strong>{item.ferramenta}</strong> ({item.qtd}x) - <span style={{ color: item.status === "EM CUSTÓDIA" ? TSEA.vermelho : '#ef6c00', fontWeight: 'bold', fontSize: '12px' }}>{item.status}</span>
                            <div style={{ fontSize: '11px', color: '#666' }}>Retirado em: {item.data}</div>
                          </li>
                        ))
                      }
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}