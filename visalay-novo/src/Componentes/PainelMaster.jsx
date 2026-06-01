import React from 'react';

export default function PainelMaster({
  TSEA, abaAtivaSuper, setAbaAtivaSuper, ferramentasPorSetor, listaFuncionariosTSEA, 
  funcSelecionadoId, setFuncSelecionadoId, ativosEmCustodiaTSEA, logout
}) {
  return (
    <div className="layout-container">
      <aside className="sidebar no-print">
        <div style={{ textAlign: 'center', borderBottom: `3px solid ${TSEA.vermelho}`, paddingBottom: '15px', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '20px' }}>TSEA <span style={{ color: TSEA.vermelho }}>GERAL</span></h3>
          <small style={{ color: TSEA.cinzaBorda, fontSize: '10px' }}>ADMINISTRADOR MASTER</small>
        </div>
        <nav className="nav-menu" style={{ flex: 1 }}>
          <button onClick={() => setAbaAtivaSuper('dashboard_setores')} className="btn-sidebar" style={{ width: '100%', padding: '12px', backgroundColor: abaAtivaSuper === 'dashboard_setores' ? TSEA.vermelho : 'transparent', color: 'white', border: 'none', textAlign: 'left', fontWeight: 'bold', borderRadius: '4px', marginBottom: '5px' }}>Ativos por Setor</button>
          <button onClick={() => { setAbaAtivaSuper('rh_funcionarios'); setFuncSelecionadoId(null); }} className="btn-sidebar" style={{ width: '100%', padding: '12px', backgroundColor: abaAtivaSuper === 'rh_funcionarios' ? TSEA.vermelho : 'transparent', color: 'white', border: 'none', textAlign: 'left', fontWeight: 'bold', borderRadius: '4px', marginBottom: '5px' }}>Fichas de Funcionários</button>
          <button onClick={() => setAbaAtivaSuper('gestao_almoxarifado')} className="btn-sidebar" style={{ width: '100%', padding: '12px', backgroundColor: abaAtivaSuper === 'gestao_almoxarifado' ? TSEA.vermelho : 'transparent', color: 'white', border: 'none', textAlign: 'left', fontWeight: 'bold', borderRadius: '4px', marginBottom: '5px' }}>Espelho Almoxarifado</button>
        </nav>
        <button onClick={logout} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Sair</button>
      </aside>

      <main className="content-main">
        <header style={{ backgroundColor: TSEA.branco, padding: '20px', borderRadius: '8px', borderLeft: `6px solid ${TSEA.vermelho}`, boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: TSEA.preto }}>Painel de Gestão Corporativa</h3>
          <span style={{ fontSize: '14px', color: '#555' }}>Nível de Acesso: <strong>Administrador Geral</strong></span>
        </header>

        {abaAtivaSuper === 'dashboard_setores' && (
          <div style={{ backgroundColor: TSEA.branco, padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 5px 0' }}>Distribuição Volumétrica de Ativos</h4>
            <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>Quantidade total de ferramentas atualmente alocadas e em trânsito por setor operacional.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {Object.keys(ferramentasPorSetor).map((setorNome) => (
                <div key={setorNome} className="card-setor">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h5 style={{ margin: 0, fontSize: '16px', color: TSEA.preto }}>{setorNome}</h5>
                      <small style={{ color: '#666' }}>TSEA Energia Industrial</small>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '24px', fontWeight: 'bold', color: TSEA.vermelho }}>{ferramentasPorSetor[setorNome]}</span>
                      <div style={{ fontSize: '11px', color: '#888' }}>ferramentas em posse</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {abaAtivaSuper === 'rh_funcionarios' && (
          <div style={{ backgroundColor: TSEA.branco, padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>Painel Maestro de Colaboradores</h4>
            
            {funcSelecionadoId === null ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                {listaFuncionariosTSEA.map((func) => (
                  <div key={func.matricula} className="card-funcionario-adm" style={{ borderLeft: `4px solid ${TSEA.vermelho}` }} onClick={() => setFuncSelecionadoId(func)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ fontSize: '16px' }}>{func.nome}</strong>
                        <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>RE: {func.matricula} | {func.cargo}</div>
                      </div>
                      <button style={{ padding: '6px 12px', background: TSEA.vermelho, color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Ver Ficha Completa</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ border: `2px solid ${TSEA.vermelho}`, padding: '25px', borderRadius: '8px', backgroundColor: '#fff' }}>
                <button onClick={() => setFuncSelecionadoId(null)} style={{ background: TSEA.cinzaEscuro, color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', marginBottom: '20px' }}>← Voltar para Todos</button>
                
                <h3 style={{ margin: '0 0 5px 0', color: TSEA.vermelho }}>{funcSelecionadoId.nome}</h3>
                <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#555' }}>RE Cadastrado: {funcSelecionadoId.matricula}</p>
                
                <div className="ficha-dados" style={{ marginTop: '0', marginBottom: '20px' }}>
                  <div className="ficha-item"><strong>Setor Operacional:</strong> <span>{funcSelecionadoId.setor}</span></div>
                  <div className="ficha-item"><strong>Cargo Técnico:</strong> <span>{funcSelecionadoId.cargo}</span></div>
                  <div className="ficha-item"><strong>Corporação Mãe:</strong> <span>{funcSelecionadoId.empresa}</span></div>
                  <div className="ficha-item"><strong>Status Funcional no RH:</strong> <span style={{ color: 'green', fontWeight: 'bold' }}>{funcSelecionadoId.status}</span></div>
                  <div className="ficha-item"><strong>Validação Facial Cadastrada:</strong> <span style={{ color: TSEA.vermelho, fontWeight: 'bold' }}>{funcSelecionadoId.biometria}</span></div>
                </div>

                <h5 style={{ margin: '20px 0 10px 0', color: '#111' }}>Ferramentas Atuais Vinculadas à Ficha:</h5>
                {ativosEmCustodiaTSEA.filter(a => a.matricula === funcSelecionadoId.matricula && (a.status === "EM CUSTÓDIA" || a.status === "AGUARDANDO BAIXA")).length === 0 ? (
                  <p style={{ color: '#888', fontStyle: 'italic', fontSize: '13px' }}>Nenhum item em custódia ativa para este funcionário.</p>
                ) : (
                  <ul style={{ paddingLeft: '20px', fontSize: '14px', lineHeight: '1.8' }}>
                    {ativosEmCustodiaTSEA
                      .filter(a => a.matricula === funcSelecionadoId.matricula && (a.status === "EM CUSTÓDIA" || a.status === "AGUARDANDO BAIXA"))
                      .map((item, idx) => (
                        <li key={idx}>
                          <strong>{item.ferramenta}</strong> ({item.qtd}x) - <span style={{ color: '#ef6c00', fontWeight: 'bold' }}>{item.status}</span>
                        </li>
                      ))
                    }
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {abaAtivaSuper === 'gestao_almoxarifado' && (
          <div style={{ backgroundColor: TSEA.branco, padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h4 style={{ margin: '0 0 15px 0' }}>Rastreamento de Ativos e Logística Interna</h4>
            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ backgroundColor: TSEA.cinzaClaro }}>
                    <th style={{ padding: '12px' }}>Colaborador</th>
                    <th style={{ padding: '12px' }}>Ferramenta</th>
                    <th style={{ padding: '12px' }}>Qtd.</th>
                    <th style={{ padding: '12px' }}>Status Atual</th>
                  </tr>
                </thead>
                <tbody>
                  {ativosEmCustodiaTSEA.map((item, index) => (
                    <tr key={index} style={{ borderBottom: `1px solid ${TSEA.cinzaMedio}` }}>
                      <td style={{ padding: '12px' }}><strong>{item.funcionario}</strong><div style={{ fontSize: '11px', color: '#666' }}>RE: {item.matricula}</div></td>
                      <td style={{ padding: '12px' }}>{item.ferramenta}</td>
                      <td style={{ padding: '12px' }}>{item.qtd}x</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          background: item.status === "DEVOLVIDO" ? '#e8f5e9' : '#ffebee', 
                          color: item.status === "DEVOLVIDO" ? 'green' : TSEA.vermelho, 
                          padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' 
                        }}>{item.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}