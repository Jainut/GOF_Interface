import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import Header from './Header.jsx';
import Register from './Register.jsx';

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
  const [fazendoRegistro, setFazendoRegistro] = useState(false);

  // --- ESTADOS DO BANCO DE DADOS ---
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
      // Busca Empréstimos
      const resEmprestimos = await fetch(`${API_URL}/listar/Emprestimos`);
      const dadosEmprestimos = await resEmprestimos.json();
      
      // Busca Devoluções
      const resDevolucoes = await fetch(`${API_URL}/listar/Devolucoes`);
      const dadosDevolucoes = await resDevolucoes.json();

      console.log("✅ DADOS RECEBIDOS:", { emprestimos: dadosEmprestimos, devolucoes: dadosDevolucoes });

      // GARANTIA: Verifica se a API mandou um array diretamente ou dentro de uma propriedade
      const listaEmprestimos = Array.isArray(dadosEmprestimos) ? dadosEmprestimos : (dadosEmprestimos.data || []);
      const listaDevolucoes = Array.isArray(dadosDevolucoes) ? dadosDevolucoes : (dadosDevolucoes.data || []);

      setEmprestimos(listaEmprestimos);
      setDevolucoes(listaDevolucoes);
      
    } catch (error) {
      console.error("❌ Erro ao buscar dados da API:", error);
    }
  };

  const realizarLoginSucesso = () => {
    setExibirMensagemBoasVindas(true);
    setLogado(true);
  };

  // ==========================================
  // 5. EFEITOS (UseEffect)
  // ==========================================
  useEffect(() => {
    if (exibirMensagemBoasVindas) {
      const timer = setTimeout(() => setExibirMensagemBoasVindas(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [exibirMensagemBoasVindas]);

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
        
        <div style={{ backgroundColor: 'white', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #ff00ff' }}>
          <h2 style={{ color: '#4b0082', margin: 0 }}>PAINEL DO ALMOXARIFADO</h2>
          <button 
            onClick={() => {setLogado(false); setPerfil(null); setMetodoRH(null);}} 
            style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            SAIR
          </button>
        </div>

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
                  {emprestimos.length === 0 ? (
                    <tr><td colSpan="2" style={{ padding: '12px', textAlign: 'center' }}>Nenhuma ferramenta ativa no momento.</td></tr>
                  ) : (
                    emprestimos
                      // Flexibilizei o filtro caso o nome da coluna de status no seu banco seja diferente
                      .filter(emp => emp.ferramenta_status === 'Emprestado' || emp.status === 'Emprestado' || !emp.data_devolucao)
                      .map((emp, index) => (
                        <tr key={`ativa-${emp.id || emp.emprestimo_id || index}`} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px' }}>{emp.tipo_ferramenta || emp.ferramenta || 'Não informado'}</td>
                          <td style={{ padding: '12px' }}><strong>{emp.nome_operador || emp.operador || 'Não informado'}</strong></td>
                        </tr>
                      ))
                  )}
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
                  {emprestimos.length === 0 ? (
                    <tr><td colSpan="4" style={{ padding: '12px', textAlign: 'center' }}>Nenhum registro de retirada.</td></tr>
                  ) : (
                    emprestimos.map((emp, index) => (
                      <tr key={`hist-${emp.id || emp.emprestimo_id || index}`} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>{emp.tipo_ferramenta || emp.ferramenta || '-'}</td>
                        <td style={{ padding: '12px' }}>{emp.nome_operador || emp.operador || '-'}</td>
                        <td style={{ padding: '12px' }}>{emp.setor_operador || emp.setor || '-'}</td>
                        <td style={{ padding: '12px' }}>
                           {emp.data_retirada ? new Date(emp.data_retirada).toLocaleString() : 'Data não registrada'}
                        </td>
                      </tr>
                    ))
                  )}
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
                  {devolucoes.length === 0 ? (
                    <tr><td colSpan="4" style={{ padding: '12px', textAlign: 'center' }}>Nenhum registro de devolução.</td></tr>
                  ) : (
                    devolucoes.map((dev, index) => (
                      <tr key={`dev-${dev.id || dev.devolucao_id || index}`} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>{dev.tipo_ferramenta || dev.ferramenta || '-'}</td>
                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{dev.nome_operador || dev.operador || '-'}</td>
                        <td style={{ padding: '12px' }}>{dev.setor_operador || dev.setor || '-'}</td>
                        <td style={{ padding: '12px', color: '#28a745', fontWeight: 'bold' }}>
                          {dev.data_devolucao ? new Date(dev.data_devolucao).toLocaleString() : 'Data não registrada'}
                        </td>
                      </tr>
                    ))
                  )}
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
                    {emprestimos
                      .filter(emp => emp.ferramenta_status === 'Emprestado' || emp.status === 'Emprestado')
                      .map((emp, index) => (
                        <tr key={`fora-${emp.id || emp.emprestimo_id || index}`}>
                          <td style={{ padding: '12px' }}>{emp.tipo_ferramenta || emp.ferramenta || 'N/A'}</td>
                          <td style={{ padding: '12px' }}>{emp.nome_operador || emp.operador || 'N/A'}</td>
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

  // ==========================================
  // 7. RENDERIZAÇÃO: TELAS DE LOGIN
  // ==========================================
  // ==========================================
  // 7. RENDERIZAÇÃO: TELAS DE LOGIN / REGISTRO
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
            {/* TELA DE REGISTRO */}
            {fazendoRegistro ? (
              <Register onBack={() => setFazendoRegistro(false)} />
            ) : (
              <>
                {/* ESCOLHA DE PERFIL INICIAL */}
                {!perfil && (
                  <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', textAlign: 'center', width: '350px' }}>
                    <h2 style={{ color: '#4b0082' }}>VisAlay</h2>
                    <button onClick={() => setPerfil('funcionario')} style={btnPerfilStyle}>SOU FUNCIONÁRIO</button>
                    <button onClick={() => setPerfil('rh')} style={btnPerfilStyle}>ADM / SUPERVISOR</button>
                    
                    {/* Botão para ativar o estado de registro */}
                    <p 
                      onClick={() => setFazendoRegistro(true)} 
                      style={{ cursor: 'pointer', color: '#4b0082', fontSize: '14px', marginTop: '15px', textDecoration: 'underline', fontWeight: 'bold' }}
                    >
                      Não tem conta? Cadastre-se
                    </p>
                  </div>
                )}

                {/* LOGIN FUNCIONÁRIO */}
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

                {/* LOGIN ADM / RH */}
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
          </>
        )}
      </main>
    </div>
  );
}

export default App;