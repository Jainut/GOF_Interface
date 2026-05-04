import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import Header from './Header.jsx';

function App() {
  // ==========================================
  // 1. ESTADOS DO SISTEMA
  // ==========================================
  const [perfil, setPerfil] = useState(null); 
  const [metodoRH, setMetodoRH] = useState(null); 
  const [logado, setLogado] = useState(false); 
  const [exibirMensagemBoasVindas, setExibirMensagemBoasVindas] = useState(false);
  const [erroAcesso, setErroAcesso] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('ativas'); 

  // --- NOVOS ESTADOS PARA O BANCO DE DADOS ---
  const [emprestimos, setEmprestimos] = useState([]);
  const [devolucoes, setDevolucoes] = useState([]);

  // ==========================================
  // 2. DADOS LOCAIS (MOCK) E CONFIGURAÇÕES
  // ==========================================
  const API_URL = ''; 

  const alertasAnomalias = [
    { id: 1, tipo: 'Atraso', msg: 'Furadeira Bosch não devolvida por Carlos Eduardo.', hora: '17:05h' },
    { id: 2, tipo: 'Acesso', msg: 'Tentativa de login não reconhecido no terminal 02.', hora: '18:20h' }
  ];

  const ferramentasSaude = [
    { id: 1, nome: 'Furadeira Bosch', saude: '85%', mediaQuebra: '180 dias', status: 'Bom' },
    { id: 2, nome: 'Gerador Honda', saude: '28%', mediaQuebra: '40 dias', status: 'Crítico' }
  ];

  // ==========================================
  // 3. ESTILOS
  // ==========================================
  const btnPerfilStyle = { 
    backgroundColor: '#4b0082', 
    color: 'white', 
    border: 'none', 
    padding: '15px', 
    borderRadius: '12px', 
    fontSize: '16px', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    width: '100%', 
    marginBottom: '10px',
    transition: '0.3s'
  };

  // ==========================================
  // 4. FUNÇÕES
  // ==========================================
  const buscarDadosDoBanco = async () => {
    try {
      const resEmprestimos = await fetch(`${API_URL}/listar/Emprestimos`);
      const dadosEmprestimos = await resEmprestimos.json();
      setEmprestimos(dadosEmprestimos);

      const resDevolucoes = await fetch(`${API_URL}/listar/Devolucoes`);
      const dadosDevolucoes = await resDevolucoes.json();
      setDevolucoes(dadosDevolucoes);

      console.log("✅ CONECTADO! Os dados vieram do Supabase/API:", {
        emprestimos: dadosEmprestimos, 
        devolucoes: dadosDevolucoes
      });
      
    } catch (error) {
      console.error("Erro ao buscar dados da API:", error);
    }
  };

  const realizarLoginSucesso = () => {
    setExibirMensagemBoasVindas(true);
    setLogado(true);
  };

  // ==========================================
  // 5. EFEITOS (UseEffect)
  // ==========================================
  
  // Efeito 1: Controlar o tempo da mensagem de boas vindas
  useEffect(() => {
    if (exibirMensagemBoasVindas) {
      const timer = setTimeout(() => setExibirMensagemBoasVindas(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [exibirMensagemBoasVindas]);

  // Efeito 2: Buscar dados na API assim que logar
  useEffect(() => {
    if (logado && !exibirMensagemBoasVindas) {
      buscarDadosDoBanco();
    }
  }, [logado, exibirMensagemBoasVindas]);

  // ==========================================
  // 6. RENDERIZAÇÃO: PAINEL ADMINISTRATIVO
  // ==========================================
  if (logado && !exibirMensagemBoasVindas) {
    return (
      <div style={{ backgroundColor: '#a0a0a0', minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
        <Header />
        
        {/* CABEÇALHO DO PAINEL */}
        <div style={{ backgroundColor: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #ff00ff' }}>
          <h2 style={{ color: '#4b0082', margin: 0 }}>PAINEL DO ALMOXARIFADO</h2>
          <button 
            onClick={() => {setLogado(false); setPerfil(null); setMetodoRH(null);}} 
            style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            SAIR
          </button>
        </div>

        {/* NAVEGAÇÃO POR ABAS */}
        <nav style={{ display: 'flex', backgroundColor: '#4b0082', padding: '0 20px', gap: '5px', overflowX: 'auto' }}>
          <button onClick={() => setAbaAtiva('ativas')} style={{ padding: '15px 20px', border: 'none', backgroundColor: abaAtiva === 'ativas' ? '#ff00ff' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}>FERRAMENTAS ATIVAS</button>
          <button onClick={() => setAbaAtiva('retiradas')} style={{ padding: '15px 20px', border: 'none', backgroundColor: abaAtiva === 'retiradas' ? '#ff00ff' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}>TELA DE RETIRADAS</button>
          <button onClick={() => setAbaAtiva('devolucoes')} style={{ padding: '15px 20px', border: 'none', backgroundColor: abaAtiva === 'devolucoes' ? '#ff00ff' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}>TELA DE DEVOLUÇÕES</button>
          <button onClick={() => setAbaAtiva('manutencao')} style={{ padding: '15px 20px', border: 'none', backgroundColor: abaAtiva === 'manutencao' ? '#00d4ff' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}>🛠️ MANUTENÇÃO</button>
          <button onClick={() => setAbaAtiva('alertas')} style={{ padding: '15px 20px', border: 'none', backgroundColor: abaAtiva === 'alertas' ? '#d9534f' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}>🚨 ALERTAS</button>
          <button onClick={() => setAbaAtiva('almoxarifado')} style={{ padding: '15px 20px', border: 'none', backgroundColor: abaAtiva === 'almoxarifado' ? '#ff00ff' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: 'bold', whiteSpace: 'nowrap' }}>ALMOXARIFADO</button>
        </nav>

        <main style={{ padding: '30px', flex: 1 }}>
          
          {/* 1. ABA FERRAMENTAS ATIVAS */}
          {abaAtiva === 'ativas' && (
            <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              <h3 style={{ color: '#4b0082', marginTop: 0 }}>🛠️ Ferramentas Atualmente em Uso</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Ferramenta</th>
                    <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Responsável</th>
                  </tr>
                </thead>
                <tbody>
                  {emprestimos
                    .filter(emp => emp.ferramenta_status === 'Emprestado')
                    .map(emp => (
                      <tr key={`ativa-${emp.emprestimo_id}`} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>{emp.tipo_ferramenta}</td>
                        <td style={{ padding: '12px' }}><strong>{emp.nome_operador}</strong></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 2. ABA TELA DE RETIRADAS */}
          {abaAtiva === 'retiradas' && (
            <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              <h3 style={{ color: '#4b0082', marginTop: 0 }}>📋 Histórico de Retiradas</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Ferramenta</th>
                    <th style={{ padding: '12px' }}>Responsável</th>
                    <th style={{ padding: '12px' }}>Setor</th>
                    <th style={{ padding: '12px' }}>Data/Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {emprestimos.map(emp => (
                    <tr key={`hist-${emp.emprestimo_id}`} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{emp.tipo_ferramenta}</td>
                      <td style={{ padding: '12px' }}>{emp.nome_operador}</td>
                      <td style={{ padding: '12px' }}>{emp.setor_operador}</td>
                      <td style={{ padding: '12px' }}>
                         {new Date(emp.data_retirada).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 3. ABA TELA DE DEVOLUÇÕES */}
          {abaAtiva === 'devolucoes' && (
            <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              <h3 style={{ color: '#4b0082', marginTop: 0 }}>🔄 Histórico de Devoluções</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Ferramenta</th>
                    <th style={{ padding: '12px' }}>Responsável</th>
                    <th style={{ padding: '12px' }}>Setor</th>
                    <th style={{ padding: '12px' }}>Data/Hora Devolução</th>
                  </tr>
                </thead>
                <tbody>
                  {devolucoes.map(dev => (
                    <tr key={`dev-${dev.devolucao_id}`} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{dev.tipo_ferramenta}</td>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{dev.nome_operador}</td>
                      <td style={{ padding: '12px' }}>{dev.setor_operador}</td>
                      <td style={{ padding: '12px', color: '#28a745', fontWeight: 'bold' }}>
                        {new Date(dev.data_devolucao).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 4. ABA MANUTENÇÃO */}
          {abaAtiva === 'manutencao' && (
            <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              <h3 style={{ color: '#007bff', marginTop: 0 }}>📊 Saúde e Manutenção Preventiva</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead><tr style={{ backgroundColor: '#f8f9fa' }}><th style={{ padding: '12px' }}>Item</th><th>Saúde</th><th>Média Quebra</th><th>Status</th></tr></thead>
                <tbody>
                  {ferramentasSaude.map(f => (
                    <tr key={f.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{f.nome}</td>
                      <td style={{ color: parseInt(f.saude) < 30 ? 'red' : 'green', fontWeight: 'bold' }}>{f.saude}</td>
                      <td>{f.mediaQuebra}</td>
                      <td><strong>{f.status}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 5. ABA ALERTAS */}
          {abaAtiva === 'alertas' && (
            <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
              <h3 style={{ color: '#d9534f', marginTop: 0 }}>🚨 Central de Alertas e Anomalias</h3>
              {alertasAnomalias.map(alerta => (
                <div key={alerta.id} style={{ padding: '15px', borderLeft: '5px solid #d9534f', backgroundColor: '#fff5f5', marginBottom: '10px', borderRadius: '4px' }}>
                  <strong>{alerta.tipo}:</strong> {alerta.msg} <small style={{ float: 'right' }}>{alerta.hora}</small>
                </div>
              ))}
            </div>
          )}

          {/* 6. ABA ALMOXARIFADO */}
          {abaAtiva === 'almoxarifado' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '25px', borderLeft: '8px solid #28a745', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                <h3 style={{ color: '#28a745', marginTop: 0 }}>✅ Disponíveis no Almoxarifado</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}><th style={{ padding: '12px' }}>Equipamento</th><th style={{ padding: '12px' }}>Qtd</th><th style={{ padding: '12px' }}>Local</th></tr>
                  </thead>
                  <tbody>
                    <tr><td style={{ padding: '12px' }}>Multímetro Fluke 87V</td><td style={{ padding: '12px' }}>01</td><td style={{ padding: '12px' }}>Prateleira C3</td></tr>
                    <tr><td style={{ padding: '12px' }}>Chave Phillips</td><td style={{ padding: '12px' }}>15</td><td style={{ padding: '12px' }}>Prateleira A1</td></tr>
                  </tbody>
                </table>
              </div>
              
              <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '25px', borderLeft: '8px solid #ff4d4d', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                <h3 style={{ color: '#ff4d4d', marginTop: 0 }}>⚠️ Fora do Almoxarifado (Em Uso)</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8f9fa' }}><th style={{ padding: '12px' }}>Equipamento</th><th style={{ padding: '12px' }}>Quem Retirou</th></tr>
                  </thead>
                  <tbody>
                    <tr><td style={{ padding: '12px' }}>Furadeira Industrial</td><td style={{ padding: '12px' }}>Carlos Eduardo</td></tr>
                    <tr><td style={{ padding: '12px' }}>Gerador Honda</td><td style={{ padding: '12px' }}>Marcos Vinícius</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ==========================================
  // 7. RENDERIZAÇÃO: TELAS DE LOGIN
  // ==========================================
  return (
    <div style={{ backgroundColor: '#a0a0a0', minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      <Header />
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        
        {exibirMensagemBoasVindas ? (
            <div style={{ backgroundColor: 'white', padding: '50px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', textAlign: 'center' }}>
              <h1 style={{ color: '#4b0082' }}>Acesso Concedido! ✅</h1>
              <p style={{ fontSize: '20px' }}>Carregando Painel VisAlay...</p>
            </div>
        ) : (
          <>
            {/* TELA 1: SELEÇÃO INICIAL */}
            {!perfil && (
              <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', textAlign: 'center', width: '350px' }}>
                <h2 style={{ color: '#4b0082' }}>VisAlay</h2>
                <button onClick={() => setPerfil('funcionario')} style={btnPerfilStyle}>SOU FUNCIONÁRIO</button>
                <button onClick={() => setPerfil('rh')} style={btnPerfilStyle}>ADM / SUPERVISOR</button>
              </div>
            )}

            {/* TELA 2: LOGIN FUNCIONÁRIO (Webcam) */}
            {perfil === 'funcionario' && (
              <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '25px', textAlign: 'center', width: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                <button onClick={() => {setPerfil(null); setErroAcesso(false);}} style={{ float: 'left', border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}>←</button>
                <h2 style={{ color: '#4b0082' }}>Login Facial</h2>
                {erroAcesso && <div style={{ backgroundColor: '#ffcccc', color: '#cc0000', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>ERRO: Acesso negado! <br/> Use a Área Restrita.</div>}
                <div style={{ width: '100%', height: '250px', backgroundColor: '#000', borderRadius: '15px', overflow: 'hidden', border: '3px solid #4b0082' }}>
                  <Webcam width="100%" height="100%" />
                </div>
                <button onClick={() => {setErroAcesso(true); setTimeout(()=>setErroAcesso(false), 3000)}} style={{...btnPerfilStyle, marginTop: '15px'}}>IDENTIFICAR FUNCIONÁRIO</button>
              </div>
            )}

            {/* TELA 3: LOGIN GESTOR/RH */}
            {perfil === 'rh' && (
              <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '25px', textAlign: 'center', width: '380px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                <button onClick={() => {setPerfil(null); setMetodoRH(null);}} style={{ float: 'left', border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}>←</button>
                <h2 style={{ color: '#4b0082' }}>Área Restrita</h2>
                {!metodoRH ? (
                  <>
                    <button onClick={() => setMetodoRH('senha')} style={btnPerfilStyle}>E-mail e Senha</button>
                    <button onClick={() => setMetodoRH('facial')} style={btnPerfilStyle}>Reconhecimento Facial</button>
                  </>
                ) : (
                  <div style={{ marginTop: '20px' }}>
                    {metodoRH === 'facial' && (
                        <div style={{ width: '100%', height: '220px', backgroundColor: '#000', borderRadius: '15px', marginBottom: '15px', overflow: 'hidden', border: '2px solid #4b0082' }}>
                            <Webcam width="100%" height="100%" />
                        </div>
                    )}
                    {metodoRH === 'senha' && (
                      <input type="password" placeholder="Senha do Gestor" style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                    )}
                    <button onClick={realizarLoginSucesso} style={btnPerfilStyle}>ENTRAR COMO SUPERVISOR</button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;