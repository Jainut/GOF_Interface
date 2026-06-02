import React, { useState } from 'react';

export default function PainelMaster({
  TSEA, abaAtivaSuper, setAbaAtivaSuper, ativosEmCustodiaTSEA, catalogoFerramentas, 
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
                  <tr key={i} style={{ borderBottom: '1px solid #eee' }}><td style={{ padding: '10px' }}>{u.nome}</td><td style={{ padding: '10px' }}>{u.matricula}</td><td style={{ padding: '10px' }}>{u.perfil}</td></tr>
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