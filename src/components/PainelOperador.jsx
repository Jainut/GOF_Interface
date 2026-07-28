import { useState } from 'react';

export default function PainelOperador({
  GOF_PROJECT, abaAtiva, setAbaAtiva, operador, ativosEmCustodiaGofProject, solicitarDevolucaoImediata = () => {},
  pedidoAtivo = null, confirmarRetiradaComCartao = () => {}, logout
}) {
  const [rfidInput, setRfidInput] = useState('');

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div style={{ textAlign: 'center', borderBottom: `3px solid ${GOF_PROJECT.azul}`, paddingBottom: '15px', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '22px' }}>GOF <span style={{ color: GOF_PROJECT.amarelo }}>PROJECT</span></h3>
          <small style={{ color: GOF_PROJECT.azulClaro, fontSize: '11px' }}>TOTEM OPERACIONAL</small>
        </div>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button onClick={() => setAbaAtiva('confirme_cartao')} className="btn-sidebar" style={{ backgroundColor: abaAtiva === 'confirme_cartao' ? GOF_PROJECT.azul : 'transparent' }}>Confirme seu Cartão</button>
          <button onClick={() => setAbaAtiva('custodia')} className="btn-sidebar" style={{ backgroundColor: abaAtiva === 'custodia' ? GOF_PROJECT.azul : 'transparent' }}>Minha Custódia ({ativosEmCustodiaGofProject.filter(a => a.matricula === operador.matricula && a.status === "EM CUSTÓDIA").length})</button>
          <button onClick={() => setAbaAtiva('info')} className="btn-sidebar" style={{ backgroundColor: abaAtiva === 'info' ? GOF_PROJECT.azul : 'transparent' }}>Minhas Infos</button>
        </nav>

        <button onClick={logout} style={{ width: '100%', padding: '12px', background: GOF_PROJECT.azul, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Sair do Totem</button>
      </aside>

      <main className="content-main">
        <header style={{ backgroundColor: GOF_PROJECT.branco, padding: '15px 20px', borderRadius: '6px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '18px' }}>{operador.nome}</h4>
            <small style={{ color: '#555' }}>{operador.cargo} | <strong>{operador.matricula}</strong></small>
          </div>
          <span style={{ padding: '5px 10px', background: '#E6F1FF', color: '#0057B8', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{operador.status}</span>
        </header>

        {abaAtiva === 'confirme_cartao' && (
          <div style={{ backgroundColor: GOF_PROJECT.branco, padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 10px 0', color: GOF_PROJECT.azul }}>Aproximação de Crachá RFID</h3>
            <p style={{ color: '#555', fontSize: '15px', marginBottom: '25px' }}>Valide a retirada física das ferramentas preparadas pelo almoxarife.</p>
            
            {!pedidoAtivo ? (
              <div style={{ padding: '30px', border: '2px dashed #B8CBE3', borderRadius: '8px', backgroundColor: '#F7FBFF', color: '#777' }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>Nenhum lote aguardando liberação no sensor para você.</p>
                <small>Solicite ao conferente do almoxarifado para registrar suas ferramentas.</small>
              </div>
            ) : pedidoAtivo.status === "Aguardando RFID" ? (
              <div style={{ maxWidth: '450px', margin: '0 auto', padding: '25px', border: `2px solid ${GOF_PROJECT.azul}`, borderRadius: '8px', backgroundColor: '#F7FBFF' }}>
                <h4 style={{ color: GOF_PROJECT.azul, margin: '0 0 10px 0', animation: 'blink 1.5s infinite' }}>PASSE SEU CARTÃO NO TOTEM</h4>
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
                    style={{ padding: '12px', borderRadius: '4px', border: '1px solid #B8CBE3', width: '220px', textAlign: 'center', fontWeight: 'bold' }}
                  />
                  <button onClick={() => {
                    if (rfidInput === operador.matricula) {
                      confirmarRetiradaComCartao();
                      setRfidInput('');
                      setAbaAtiva('custodia');
                    } else {
                      alert("Cartão não corresponde ao titular do pedido lançado!");
                    }
                  }} style={{ padding: '12px 20px', background: '#0057B8', color: 'white', border: 'none', borderRadius: '4px', marginLeft: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Simular Bip</button>
                </div>
              </div>
            ) : (
              <p>Status do lote: {pedidoAtivo.status}</p>
            )}
          </div>
        )}

        {abaAtiva === 'custodia' && (
          <div style={{ backgroundColor: GOF_PROJECT.branco, padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>Seus Ativos em Custódia Operacional</h3>
            {ativosEmCustodiaGofProject.filter(a => a.matricula === operador.matricula).length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>Nenhuma ferramenta vinculada à sua RE no momento.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {ativosEmCustodiaGofProject.filter(a => a.matricula === operador.matricula).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', border: `1px solid ${GOF_PROJECT.azulClaro}`, borderRadius: '6px', background: item.status === "AGUARDANDO BAIXA" ? '#FFFBEA' : '#fff' }}>
                    <div>
                      <h5 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{item.ferramenta}</h5>
                      <small style={{ color: '#666' }}>Retirada: {item.data} | Qtd: <strong>{item.qtd}x</strong></small>
                      <div style={{ marginTop: '5px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px', background: item.status === "DEVOLVIDO" ? '#E6F1FF' : item.status === "AGUARDANDO BAIXA" ? '#FFF8D6' : '#FFF4CC', color: item.status === "DEVOLVIDO" ? '#0057B8' : item.status === "AGUARDANDO BAIXA" ? '#A36F00' : GOF_PROJECT.azul }}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    {item.status === "EM CUSTÓDIA" && (
                      <button onClick={() => solicitarDevolucaoImediata(item)} style={{ padding: '8px 12px', background: GOF_PROJECT.azulProfundo, color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Solicitar Devolução</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {abaAtiva === 'info' && (
          <div style={{ backgroundColor: GOF_PROJECT.branco, padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 15px 0', color: GOF_PROJECT.azul }}>Ficha Cadastral do Colaborador</h3>
            <div className="ficha-dados" style={{ background: GOF_PROJECT.azulMuitoClaro, padding: '20px', borderRadius: '6px' }}>
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
