import React from 'react';

export default function PainelOperador({
  TSEA, abaAtiva, setAbaAtiva, operador, catalogoFerramentas, carrinho, termoAceito, 
  setTermoAceito, alterarQuantidadeCarrinho, emitirPedidoSaidaCompleto, ativosEmCustodiaTSEA, 
  solicitarDevolucaoImediata, pedidoAtivo, setAtivosEmCustodiaTSEA, logout
}) {
  return (
    <div className="layout-container no-print">
      <aside className="sidebar">
        <div style={{ textAlign: 'center', borderBottom: `3px solid ${TSEA.vermelho}`, paddingBottom: '15px', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '22px', letterSpacing: '1px' }}>TSEA <span style={{ color: TSEA.vermelho }}>MOBILE</span></h3>
          <small style={{ color: TSEA.cinzaMedio, fontSize: '11px' }}>TOTEM OPERACIONAL</small>
        </div>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => setAbaAtiva('solicitar')} className="btn-sidebar" style={{ width: '100%', padding: '12px', backgroundColor: abaAtiva === 'solicitar' ? TSEA.vermelho : 'transparent', color: 'white', border: 'none', textAlign: 'left', fontWeight: 'bold', borderRadius: '4px' }}>🛒 Solicitar Ferramentas</button>
          <button onClick={() => setAbaAtiva('custodia')} className="btn-sidebar" style={{ width: '100%', padding: '12px', backgroundColor: abaAtiva === 'custodia' ? TSEA.vermelho : 'transparent', color: 'white', border: 'none', textAlign: 'left', fontWeight: 'bold', borderRadius: '4px' }}>🛡️ Minha Custódia ({ativosEmCustodiaTSEA.filter(a => a.matricula === operador.matricula && a.status === "EM CUSTÓDIA").length})</button>
          <button onClick={() => setAbaAtiva('status')} className="btn-sidebar" style={{ width: '100%', padding: '12px', backgroundColor: abaAtiva === 'status' ? TSEA.vermelho : 'transparent', color: 'white', border: 'none', textAlign: 'left', fontWeight: 'bold', borderRadius: '4px' }}>📋 Status do Chamado</button>
        </nav>

        <button onClick={logout} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Sair do Totem</button>
      </aside>

      <main className="content-main">
        <header style={{ backgroundColor: TSEA.branco, padding: '15px 20px', borderRadius: '6px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '18px' }}>{operador.nome}</h4>
            <small style={{ color: '#555' }}>{operador.cargo} | <strong>{operador.matricula}</strong></small>
          </div>
          <span style={{ padding: '5px 10px', background: '#e8f5e9', color: 'green', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{operador.status}</span>
        </header>

        {abaAtiva === 'solicitar' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: TSEA.branco, padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
              <h3 style={{ margin: '0 0 10px 0', borderBottom: `2px solid ${TSEA.cinzaClaro}`, paddingBottom: '8px' }}>Catálogo de Ativos Operacionais</h3>
              <div className="grid-catalogo">
                {catalogoFerramentas.map(item => {
                  const noCarrinho = carrinho.find(c => c.nome === item.nome)?.qtd || 0;
                  return (
                    <div key={item.id} className="card-ferramenta">
                      <div>
                        <span className="badge-categoria">{item.categoria}</span>
                        <h4 style={{ margin: '10px 0 5px 0', fontSize: '15px' }}>{item.nome}</h4>
                        <p style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#666' }}>Disponível no armário: <strong>{item.disponivel}</strong> / {item.total}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: TSEA.cinzaClaro, padding: '6px', borderRadius: '4px' }}>
                        <button onClick={() => alterarQuantidadeCarrinho(item.nome, 'subtrair')} style={{ width: '32px', height: '32px', background: TSEA.cinzaEscuro, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>-</button>
                        <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{noCarrinho}</span>
                        <button onClick={() => alterarQuantidadeCarrinho(item.nome, 'somar')} style={{ width: '32px', height: '32px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>+</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {carrinho.length > 0 && (
              <div style={{ backgroundColor: TSEA.branco, padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', borderTop: `4px solid ${TSEA.vermelho}` }}>
                <h3 style={{ margin: '0 0 15px 0', color: TSEA.vermelho }}>Confirmação e Cautela Digital</h3>
                <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                  {carrinho.map((c, i) => <li key={i} style={{ padding: '4px 0', fontSize: '14px' }}><strong>{c.qtd}x</strong> - {c.nome}</li>)}
                </ul>

                <div style={{ padding: '15px', background: TSEA.cinzaClaro, borderRadius: '6px', marginBottom: '20px', borderLeft: `4px solid ${TSEA.cinzaEscuro}` }}>
                  <h5 style={{ margin: '0 0 8px 0', textTransform: 'uppercase' }}>Termo de Compromisso TSEA</h5>
                  <p style={{ margin: 0, fontSize: '12px', lineHeight: '1.5', color: '#444', textAlign: 'justify' }}>
                    Responsabilizo-me pela guarda, conservação e uso estrito profissional das ferramentas acima descritas. Estou ciente da obrigatoriedade de devolução imediata ao almoxarifado após o encerramento da jornada técnica ou atividade específica do setor.
                  </p>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                    <input type="checkbox" checked={termoAceito} onChange={(e) => setTermoAceito(e.target.checked)} />
                    Aceito os termos de cautela estabelecidos pela TSEA Energia
                  </label>
                </div>

                <button onClick={emitirPedidoSaidaCompleto} style={{ width: '100%', padding: '15px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>EMITIR SOLICITAÇÃO VIA BIOMETRIA</button>
              </div>
            )}
          </div>
        )}

        {abaAtiva === 'custodia' && (
          <div style={{ backgroundColor: TSEA.branco, padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>Seus Ativos em Custódia Operacional</h3>
            {ativosEmCustodiaTSEA.filter(a => a.matricula === operador.matricula).length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>Nenhuma ferramenta vinculada à sua matrícula no momento.</p>
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
                      <button onClick={() => solicitarDevolucaoImediata(item)} style={{ padding: '8px 12px', background: TSEA.cinzaEscuro, color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Devolver Item</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {abaAtiva === 'status' && (
          <div style={{ backgroundColor: TSEA.branco, padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>Acompanhamento de Solicitações</h3>
            {!pedidoAtivo ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>Nenhum processo em andamento para esta RE.</p>
            ) : (
              <div style={{ padding: '20px', border: `2px solid ${TSEA.vermelho}`, borderRadius: '8px', backgroundColor: '#fafafa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${TSEA.cinzaMedio}`, paddingBottom: '10px', marginBottom: '15px' }}>
                  <strong>Chamado: #{pedidoAtivo.idPedido}</strong>
                  <span style={{ color: '#666', fontSize: '12px' }}>{pedidoAtivo.timestamp}</span>
                </div>
                <p style={{ fontSize: '14px' }}><strong>Status Atual:</strong> <span style={{ color: TSEA.vermelho, fontWeight: 'bold' }}>{pedidoAtivo.status}</span></p>
                <h5 style={{ margin: '15px 0 5px 0' }}>Itens Solicitados:</h5>
                <ul style={{ paddingLeft: '20px', fontSize: '13px' }}>
                  {pedidoAtivo.itens?.map((it, idx) => <li key={idx} style={{ fontWeight: 'bold' }}>{it}</li>)}
                </ul>

                {pedidoAtivo.status === "Aprovado pelo Almoxarife" && (
                  <div style={{ marginTop: '20px', padding: '15px', background: '#e8f5e9', borderRadius: '6px', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 10px 0', color: 'green', fontWeight: 'bold' }}>O almoxarife conferiu e separou seus ativos!</p>
                    <button onClick={() => {
                      pedidoAtivo.status = "Confirmado pelo Funcionario";
                      localStorage.setItem('pedidoTSEA', JSON.stringify(pedidoAtivo));
                      
                      const novosAtivos = pedidoAtivo.itensPuros.map(p => ({
                        funcionario: operador.nome,
                        matricula: operador.matricula,
                        ferramenta: p.nome,
                        qtd: p.qtd,
                        data: new Date().toLocaleString(),
                        status: "EM CUSTÓDIA",
                        dataDevolucao: null
                      }));
                      setAtivosEmCustodiaTSEA([...novosAtivos, ...ativosEmCustodiaTSEA]);
                      
                      alert("Retirada registrada e confirmada com sucesso!");
                      setAbaAtiva('custodia');
                    }} style={{ padding: '10px 20px', background: 'green', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>CONFIRMAR RETIRADA FÍSICA NO BALCÃO</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}