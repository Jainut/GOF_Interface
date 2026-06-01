import React, { useState, useEffect, useRef } from 'react';

// PALETA DE CORES OFICIAL TSEA ENERGIA
const TSEA = {
  vermelho: '#E30613',     // Vermelho Institucional
  preto: '#1A1A1A',        // Grafite Escuro / Texto
  cinzaEscuro: '#4A4A4A',  // Elementos secundários
  cinzaMedio: '#CCCCCC',   // Bordas e divisores
  cinzaClaro: '#F5F5F5',   // Fundos de cards e tabelas
  cinzaBorda: '#999999',   // Linhas finas
  branco: '#FFFFFF'        // Fundo principal
};

function App() {
  // --- ESTADOS DA PARTE 1 (OPERADOR / TOTEM) ---
  const [logado, setLogado] = useState(false);
  const [perfilLogado, setPerfilLogado] = useState(null); // 'func', 'adm', 'superadmin'
  const [perfil, setPerfil] = useState(null);             // Controle da tela de login
  
  // Dados do operador logado via biometria
  const [operador, setOperador] = useState({
    nome: "Carlos Eduardo Santos",
    matricula: "RE-40922",
    setor: "Bobinagem de Transformadores",
    cargo: "Técnico de Isolamento Especializado",
    empresa: "TSEA Energia S.A.",
    status: "Ativo Operacional",
    biometria: "Face ID Cadastrado - Nível 3"
  });

  // Carrinho de ferramentas e estados de abas
  const [abaAtiva, setAbaAtiva] = useState('solicitar');
  const [carrinho, setCarrinho] = useState([]);
  const [termoAceito, setTermoAceito] = useState(false);
  
  // Estado da Biometria/Webcam
  const [statusBiometria, setStatusBiometria] = useState('desligado');
  const [progressoEscaneamento, setProgressoEscaneamento] = useState(0);
  const videoRef = useRef(null);

  // Lista de Ferramentas Disponíveis no Catálogo
  const [catalogoFerramentas, setCatalogoFerramentas] = useState([
    { id: 1, nome: "Chave Estrela 1/2 texturada TSEA", categoria: "Manuais", total: 15, disponivel: 12 },
    { id: 2, nome: "Alicate de Pressão Isolado 1000V", categoria: "Manuais", total: 10, disponivel: 7 },
    { id: 3, nome: "Multímetro Digital Fluke Industrial", categoria: "Medição", total: 5, disponivel: 3 },
    { id: 4, nome: "Torquímetro Snap-on Digital 10-200Nm", categoria: "Medição", total: 4, disponivel: 2 },
    { id: 5, nome: "Parafusadeira de Impacto Bosch 18V", categoria: "Elétricas", total: 8, disponivel: 5 },
    { id: 6, nome: "Esmerilhadeira Angular DeWalt 4.1/2", categoria: "Elétricas", total: 6, disponivel: 4 },
    { id: 7, nome: "Calibrador de Processos Fluke 754", categoria: "Calibração", total: 2, disponivel: 1 },
    { id: 8, nome: "Micrômetro Externo Mitutoyo 0-25mm", categoria: "Medição", total: 6, disponivel: 6 },
    { id: 9, nome: "Cinto de Segurança Paraquedista Confort", categoria: "EPI", total: 20, disponivel: 18 },
    { id: 10, nome: "Protetor Auricular Concha 3M 24dB", categoria: "EPI", total: 50, disponivel: 45 }
  ]);

  // --- ESTADOS DA PARTE 2 & 3 (ALMOXARIFE E SUPER MASTER) ---
  const [abaAtivaAdm, setAbaAtivaAdm] = useState('aprovar_emprestimos');
  const [abaAtivaSuper, setAbaAtivaSuper] = useState('dashboard_setores');
  const [senhaAlmoxarife, setSenhaAlmoxarife] = useState('');
  const [senhaAlmoxarifeDevolucao, setSenhaAlmoxarifeDevolucao] = useState('');
  
  // NOVOS CAMPOS DE LOGIN ADM
  const [cpfAlmoxarife, setCpfAlmoxarife] = useState('');
  const [senhaLoginAlmoxarife, setSenhaLoginAlmoxarife] = useState('');
  
  const [senhaSuperAdmin, setSenhaSuperAdmin] = useState('');
  const [funcSelecionadoId, setFuncSelecionadoId] = useState(null);

  // Histórico Global de Ativos em Custódia (Simulação de Banco de Dados)
  const [ativosEmCustodiaTSEA, setAtivosEmCustodiaTSEA] = useState([
    { funcionario: "Carlos Eduardo Santos", matricula: "RE-40922", ferramenta: "Torquímetro Snap-on Digital 10-200Nm", qtd: 1, data: "28/05/2026 07:42", status: "EM CUSTÓDIA", dataDevolucao: null },
    { funcionario: "Carlos Eduardo Santos", matricula: "RE-40922", ferramenta: "Parafusadeira de Impacto Bosch 18V", qtd: 1, data: "28/05/2026 07:42", status: "EM CUSTÓDIA", dataDevolucao: null },
    { funcionario: "Marcos Antônio Pereira", matricula: "RE-11054", ferramenta: "Multímetro Digital Fluke Industrial", qtd: 1, data: "27/05/2026 13:15", status: "AGUARDANDO BAIXA", dataDevolucao: null },
    { funcionario: "Fernanda Lima Souza", matricula: "RE-33821", ferramenta: "Cinto de Segurança Paraquedista Confort", qtd: 1, data: "29/05/2026 08:00", status: "DEVOLVIDO", dataDevolucao: "29/05/2026 17:10" },
    { funcionario: "Rodrigo Melo Alves", matricula: "RE-22941", ferramenta: "Esmerilhadeira Angular DeWalt 4.1/2", qtd: 1, data: "29/05/2026 09:30", status: "EM CUSTÓDIA", dataDevolucao: null }
  ]);

  // Pedidos Pendentes de Saída (Almoxarifado)
  const [pedidoAtivo, setPedidoAtivo] = useState(() => {
    const salvo = localStorage.getItem('pedidoTSEA');
    return salvo ? JSON.parse(salvo) : null;
  });

  // Devoluções Pendentes de Conferência
  const [devolucoesPendentes, setDevolucoesPendentes] = useState([
    { id: 101, funcionario: "Marcos Antônio Pereira", matricula: "RE-11054", ferramenta: "Multímetro Digital Fluke Industrial", qtd: 1 }
  ]);

  // Lista Completa de Funcionários para Consulta Corporativa
  const listaFuncionariosTSEA = [
    { nome: "Carlos Eduardo Santos", matricula: "RE-40922", setor: "Bobinagem de Transformadores", cargo: "Técnico de Isolamento Especializado", empresa: "TSEA Energia S.A.", status: "Ativo", biometria: "Face ID Ativo" },
    { nome: "Marcos Antônio Pereira", matricula: "RE-11054", setor: "Montagem Eletromecânica", cargo: "Mecânico de Manutenção Pesada", empresa: "TSEA Energia S.A.", status: "Ativo", biometria: "Face ID Ativo" },
    { nome: "Fernanda Lima Souza", matricula: "RE-33821", setor: "Ensaios de Alta Tensão (Laboratório)", cargo: "Engenheira de Testes Industriais", empresa: "TSEA Energia S.A.", status: "Ativo", biometria: "Face ID Ativo" },
    { nome: "Rodrigo Melo Alves", matricula: "RE-22941", setor: "Manutenção de Subestações Internas", cargo: "Eletricista de Força e Luz", empresa: "TSEA Energia S.A.", status: "Ativo", biometria: "Face ID Ativo" }
  ];

  // Agrupamento para Dashboard Volumétrica por Setor
  const ferramentasPorSetor = {
    "Bobinagem de Transformadores": 2,
    "Montagem Eletromecânica": 1,
    "Ensaios de Alta Tensão": 0,
    "Manutenção de Subestações": 1
  };

  // --- COMPORTAMENTOS DA WEBCAM (SIMULAÇÃO BIOMÉTRICA) ---
  const ligarWebcam = async () => {
    try {
      setStatusBiometria('camera_ativa');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn("Câmera real indisponível. Ativando simulador gráfico de segurança.");
    }
  };

  const desligarWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const iniciarEscanerManual = () => {
    setStatusBiometria('escanear');
    setProgressoEscaneamento(0);
  };

  useEffect(() => {
    let intervalo;
    if (statusBiometria === 'escanear') {
      intervalo = setInterval(() => {
        setProgressoEscaneamento(prev => {
          if (prev >= 100) {
            clearInterval(intervalo);
            setStatusBiometria('sucesso');
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    }
    return () => clearInterval(intervalo);
  }, [statusBiometria]);

  const entrarNoPainelManualmente = () => {
    desligarWebcam();
    setPerfilLogado('func');
    setLogado(true);
  };

  // --- LOGINS ADMINISTRATIVOS ---
  const entrarComoAlmoxarife = () => {
    if (cpfAlmoxarife.trim() !== '' && senhaLoginAlmoxarife === '1234') {
      setPerfilLogado('adm');
      setLogado(true);
      setCpfAlmoxarife('');
      setSenhaLoginAlmoxarife('');
    } else {
      alert("CPF ou Senha incorretos! (Dica: Senha padrão é 1234)");
    }
  };

  const entrarComoSuperAdmin = () => {
    if (senhaSuperAdmin === 'adminadmin') {
      setPerfilLogado('superadmin');
      setLogado(true);
      setSenhaSuperAdmin('');
    } else {
      alert("Chave mestra incorreta!");
    }
  };

  // --- INTERAÇÕES DO OPERADOR (CARRINHO) ---
  const alterarQuantidadeCarrinho = (ferramentaNome, acao) => {
    const itemNoCarrinho = carrinho.find(c => c.nome === ferramentaNome);
    const itemCatalogo = catalogoFerramentas.find(f => f.nome === herramientaNome);

    if (acao === 'somar') {
      if (itemNoCarrinho && itemNoCarrinho.qtd >= itemCatalogo.disponivel) {
        alert("Quantidade máxima disponível atingida no estoque!");
        return;
      }
      if (!itemNoCarrinho && itemCatalogo.disponivel === 0) {
        alert("Item esgotado no estoque!");
        return;
      }

      if (itemNoCarrinho) {
        setCarrinho(carrinho.map(c => c.nome === ferramentaNome ? { ...c, qtd: c.qtd + 1 } : c));
      } else {
        setCarrinho([...carrinho, { nome: ferramentaNome, qtd: 1 }]);
      }
    } else if (acao === 'subtrair') {
      if (!itemNoCarrinho) return;
      if (itemNoCarrinho.qtd === 1) {
        setCarrinho(carrinho.filter(c => c.nome !== ferramentaNome));
      } else {
        setCarrinho(carrinho.map(c => c.nome === ferramentaNome ? { ...c, qtd: c.qtd - 1 } : c));
      }
    }
  };

  const emitirPedidoSaidaCompleto = () => {
    if (!termoAceito) {
      alert("É obrigatório aceitar o Termo de Cautela e Responsabilidade Corporativa.");
      return;
    }
    if (carrinho.length === 0) {
      alert("Seu carrinho de ferramentas está vazio!");
      return;
    }

    const novoChamado = {
      idPedido: Math.floor(100000 + Math.random() * 900000),
      funcionario: operador.nome,
      badge: operador.matricula,
      setor: operador.setor,
      cargo: operador.cargo,
      timestamp: new Date().toLocaleString(),
      status: "Aguardando Separação",
      itens: carrinho.map(c => `${c.nome} (${c.qtd}x)`),
      itensPuros: carrinho
    };

    localStorage.setItem('pedidoTSEA', JSON.stringify(novoChamado));
    setPedidoAtivo(novoChamado);
    
    // Atualiza estoque local
    setCatalogoFerramentas(catalogoFerramentas.map(f => {
      const pedido = carrinho.find(c => c.nome === f.nome);
      return pedido ? { ...f, disponivel: f.disponivel - pedido.qtd } : f;
    }));

    setCarrinho([]);
    setTermoAceito(false);
    alert("Pedido enviado ao Almoxarifado! Aguarde a liberação física dos itens.");
    setAbaAtiva('status');
  };

  const solicitarDevolucaoImediata = (itemCustodia) => {
    if (window.confirm(`Confirmar intenção de retorno da ferramenta:\n${itemCustodia.ferramenta}?`)) {
      setAtivosEmCustodiaTSEA(ativosEmCustodiaTSEA.map(a => 
        (a.matricula === itemCustodia.matricula && a.ferramenta === itemCustodia.ferramenta && a.status === "EM CUSTÓDIA")
          ? { ...a, status: "AGUARDANDO BAIXA" }
          : a
      ));

      setDevolucoesPendentes([...devolucoesPendentes, {
        id: Math.floor(100 + Math.random() * 900),
        funcionario: itemCustodia.funcionario,
        matricula: itemCustodia.matricula,
        ferramenta: itemCustodia.ferramenta,
        qtd: itemCustodia.qtd
      }]);

      alert("Solicitação de baixa enviada! Devolva o item fisicamente no balcão do almoxarifado.");
    }
  };

  // --- OPERAÇÕES DO ALMOXARIFE (ADM) ---
  const aprovarBaixaDevolucao = (idDevolucao, funcionarioNome, ferramentaNome) => {
    if (senhaAlmoxarifeDevolucao === '9999') {
      setDevolucoesPendentes(devolucoesPendentes.filter(d => d.id !== idDevolucao));
      
      setAtivosEmCustodiaTSEA(ativosEmCustodiaTSEA.map(a => 
        (a.funcionario === funcionarioNome && a.ferramenta === ferramentaNome && a.status === "AGUARDANDO BAIXA")
          ? { ...a, status: "DEVOLVIDO", dataDevolucao: new Date().toLocaleString() }
          : a
      ));

      setCatalogoFerramentas(catalogoFerramentas.map(f => 
        f.nome === ferramentaNome ? { ...f, disponivel: Math.min(f.total, f.disponivel + 1) } : f
      ));

      setSenhaAlmoxarifeDevolucao('');
      alert("Baixa confirmada com sucesso! Ativo retornado ao estoque regular.");
    } else {
      alert("Código de liberação inválido!");
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: TSEA.preto, backgroundColor: '#f9f9f9', minHeight: '100vh', margin: 0 }}>
      
      {/* --- ESTILOS EMBUTIDOS DO APP --- */}
      <style>{`
        .layout-container { display: flex; min-height: 100vh; }
        .sidebar { width: 260px; backgroundColor: ${TSEA.preto}; color: white; padding: 25px 15px; display: flex; flexDirection: column; justify-content: space-between; }
        .content-main { flex: 1; padding: 30px; backgroundColor: #f4f6f9; }
        .btn-sidebar { cursor: pointer; transition: all 0.2s; display: flex; align-items: center; }
        .btn-sidebar:hover { opacity: 0.9; transform: translateX(3px); }
        .grid-catalogo { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; margin-top: 15px; }
        .card-ferramenta { background: white; border: 1px solid ${TSEA.cinzaMedio}; borderRadius: 6px; padding: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); display: flex; flexDirection: column; justify-content: space-between; }
        .badge-categoria { font-size: 10px; text-transform: uppercase; background: ${TSEA.cinzaClaro}; color: #555; padding: 3px 6px; borderRadius: 4px; font-weight: bold; width: max-content; }
        .card-funcionario-adm { background: white; padding: 15px; borderRadius: 6px; border: 1px solid ${TSEA.cinzaMedio}; cursor: pointer; transition: 0.2s; }
        .card-funcionario-adm:hover { border-color: ${TSEA.vermelho}; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .card-setor { background: white; padding: 20px; borderRadius: 6px; border-left: 5px solid ${TSEA.vermelho}; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .ficha-dados { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; background: ${TSEA.cinzaClaro}; padding: 15px; borderRadius: 6px; }
        .ficha-item strong { display: block; font-size: 12px; color: #666; }
        .ficha-item span { font-size: 14px; font-weight: bold; }
        .table-responsive { width: 100%; overflow-x: auto; background: white; border-radius: 6px; border: 1px solid ${TSEA.cinzaMedio}; }
        .pisca-alerta { animation: pulsar 1.5s infinite; }
        @keyframes pulsar { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
        
        /* REGRAS CRÍTICAS PARA IMPRESSÃO DE TERMO CAUTELA */
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .print-document { display: block !important; padding: 0; margin: 0; }
          .layout-container { display: block !important; }
          .content-main { padding: 0 !important; background: transparent !important; }
        }
        @media screen { .print-document { display: none; } }
        .print-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .print-table th, .print-table td { border: 1px solid #000; padding: 8px; text-align: left; }
        .print-table th { background-color: #f2f2f2 !important; -webkit-print-color-adjust: exact; }
        .print-signatures { display: flex; justify-content: space-between; margin-top: 60px; }
        .print-sig-box { width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 8px; font-size: 12px; }
      `}</style>

      {/* --- PAINEL DO OPERADOR (TOTEM MÓVEL) --- */}
      {logado && perfilLogado === 'func' && (
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

            <button onClick={() => { setLogado(false); setPerfil(null); }} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Sair do Totem</button>
          </aside>

          <main className="content-main">
            <header style={{ backgroundColor: TSEA.branco, padding: '15px 20px', borderRadius: '6px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '18px' }}>{operador.nome}</h4>
                <small style={{ color: '#555' }}>{operador.cargo} | <strong>{operador.matricula}</strong></small>
              </div>
              <span style={{ padding: '5px 10px', background: '#e8f5e9', color: 'green', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{operador.status}</span>
            </header>

            {/* ABA 1: SOLICITAR ATIVOS */}
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

                {/* FORMULÁRIO DO CHECKOUT / CARRINHO */}
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

            {/* ABA 2: CUSTÓDIA ATUAL */}
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

            {/* ABA 3: STATUS DO CHAMADO */}
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
                          
                          // Adiciona os itens ao painel de custódia
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
      )}

      {/* --- PAINEL DO ALMOXARIFE (ADM) --- */}
      {logado && perfilLogado === 'adm' && (
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
            <button onClick={() => { setLogado(false); setPerfil(null); }} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Sair</button>
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
      )}

      {/* --- NOVA AREA DO SUPER ADMIN (ADMIN ADMIN) --- */}
      {logado && perfilLogado === 'superadmin' && (
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
            <button onClick={() => { setLogado(false); setPerfil(null); }} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Sair</button>
          </aside>

          <main className="content-main">
            <header style={{ backgroundColor: TSEA.branco, padding: '20px', borderRadius: '8px', borderLeft: `6px solid ${TSEA.vermelho}`, boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: TSEA.preto }}>Painel de Gestão Corporativa</h3>
              <span style={{ fontSize: '14px', color: '#555' }}>Nível de Acesso: <strong>Administrador Geral</strong></span>
            </header>

            {/* ABA NOVA: QUANTAS FERRAMENTAS POR SETOR */}
            {abaAtivaSuper === 'dashboard_setores' && (
              <div style={{ backgroundColor: TSEA.branco, padding: '25px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 5px 0' }}>Distribuição Volumétrica de Ativos</h4>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>Quantidade total de ferramentas atualmente alocadas e em trânsito por setor operacional.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {Object.keys(ferramentasPorSetor).map((setorNome) => (
                    <div key={setorNome} className="card-setor">
                      <div style={{ display: 'flex', justifyInterms: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
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

            {/* ABA DE INFORMAÇÕES DE TODOS OS FUNCIONÁRIOS (RH EXPANDIDO) */}
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

            {/* ESPELHO COMPLETO DO ALMOXARIFADO */}
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
      )}

      {/* --- AREA DO RELATÓRIO DO PDF --- */}
      {pedidoAtivo && (
        <div className="print-document">
          <div style={{ borderBottom: '3px solid #000', paddingBottom: '10px', marginBottom: '25px', textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 5px 0', letterSpacing: '1px' }}>TSEA ENERGIA S.A.</h2>
            <h3>TERMO DE RESPONSABILIDADE E CAUTELA DE FERRAMENTAS</h3>
            <p style={{ margin: 0, fontSize: '13px', color: '#333' }}>Emissão do Documento: {pedidoAtivo.timestamp}</p>
          </div>

          <div style={{ border: '1px solid #000', padding: '15px', marginBottom: '25px', fontSize: '14px', lineHeight: '1.6' }}>
            <h4>1. DADOS DO COLABORADOR</h4>
            <p><strong>Nome Completo:</strong> {pedidoAtivo.funcionario}</p>
            <p><strong>RE / Matrícula:</strong> {pedidoAtivo.badge}</p>
            <p><strong>Departamento/Setor:</strong> {pedidoAtivo.setor}</p>
            <p><strong>Cargo Cadastrado:</strong> {pedidoAtivo.cargo}</p>
          </div>

          <h4>2. RELAÇÃO DE EQUIPAMENTOS CAUTELADOS</h4>
          <table className="print-table">
            <thead>
              <tr>
                <th>Item / Descrição da Ferramenta</th>
                <th>Quantidade</th>
                <th>Estado de Entrega</th>
              </tr>
            </thead>
            <tbody>
              {pedidoAtivo.itensPuros?.map((it, idx) => (
                <tr key={idx}>
                  <td>{it.nome}</td>
                  <td>{it.qtd} x</td>
                  <td>( X ) Regular / Bom</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '30px', fontSize: '12px', textAlign: 'justify', lineHeight: '1.5' }}>
            <p><strong>Declaração de Responsabilidade:</strong> Declaro para os devidos fins que recebi da empresa TSEA Energia, a título de empréstimo por cautela operacional, as ferramentas acima relacionadas de propriedade da empresa. Me responsabilizo integralmente pelo uso adequado, guarda e estrita conservação das mesmas, comprometendo-me a reportar qualquer avaria e devolvê-las ao almoxarifado ao término da execução das atividades operacionais.</p>
          </div>

          <div className="print-signatures">
            <div className="print-sig-box">
              <strong>{pedidoAtivo.funcionario}</strong><br />
              Assinatura do Colaborador (RE: {pedidoAtivo.badge})
              <br /><span style={{ fontSize: '10px', color: '#444' }}>Confirmado via Biometria Facial</span>
            </div>
            <div className="print-sig-box">
              <br />
              <strong>Responsável pelo Almoxarifado</strong><br />
              TSEA Energia
            </div>
          </div>
        </div>
      )}

      {/* --- LOGIN GERAL INTEGRADO --- */}
      {!logado && (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <header style={{ backgroundColor: TSEA.vermelho, padding: '20px', textAlign: 'center', color: 'white' }}>
            <h2 style={{ margin: 0 }}>TSEA ENERGIA</h2>
          </header>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px' }}>
            <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', width: '100%', maxWidth: '380px', borderTop: `5px solid ${TSEA.vermelho}`, textAlign: 'center' }}>
              
              {!perfil && (
                <>
                  <h4 style={{ margin: '0 0 20px 0' }}>CONTROLE DE ACESSO MÓVEL</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button onClick={() => setPerfil('func')} style={{ padding: '15px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Acessar Totem Operacional</button>
                    <button onClick={() => setPerfil('adm')} style={{ padding: '15px', background: TSEA.cinzaEscuro, color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Área do Almoxarife (ADM)</button>
                    <button onClick={() => setPerfil('superadmin')} style={{ padding: '15px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Administrador Geral (MASTER)</button>
                  </div>
                </>
              )}

              {perfil === 'func' && (
                <div>
                  <h5>Validação Biométrica Móvel</h5>
                  <div style={{ width: '180px', height: '180px', backgroundColor: '#111', borderRadius: '50%', margin: '0 auto 20px auto', position: 'relative', overflow: 'hidden', border: `4px solid ${statusBiometria === 'sucesso' ? 'green' : TSEA.vermelho}`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {statusBiometria === 'desligado' && <div style={{ color: '#666', fontSize: '28px' }}>Câmera</div>}
                    <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', transform: 'scaleX(-1)' }} />
                    {statusBiometria === 'escanear' && (
                      <>
                        <div style={{ position: 'absolute', width: '100%', height: '3px', backgroundColor: TSEA.vermelho, top: `${progressoEscaneamento}%`, left: 0 }} />
                        <div style={{ position: 'absolute', bottom: '5px', color: '#fff', fontSize: '10px', background: 'rgba(0,0,0,0.7)', padding: '2px 6px' }}>Mapeando: {progressoEscaneamento}%</div>
                      </>
                    )}
                    {statusBiometria === 'sucesso' && <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(46,125,50,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontWeight: 'bold' }}>Permitido</div>}
                  </div>

                  {statusBiometria === 'desligado' && <button onClick={ligarWebcam} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Habilitar Câmera</button>}
                  {statusBiometria === 'camera_ativa' && <button onClick={iniciarEscanerManual} style={{ width: '100%', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Reconhecer Rosto</button>}
                  {statusBiometria === 'sucesso' && <button onClick={entrarNoPainelManualmente} style={{ width: '100%', padding: '14px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Entrar no Sistema</button>}
                  <button onClick={() => { desligarWebcam(); setPerfil(null); setStatusBiometria('desligado'); }} style={{ marginTop: '15px', background: 'none', border: 'none', color: TSEA.vermelho, fontWeight: 'bold', cursor: 'pointer' }}>← Voltar</button>
                </div>
              )}

              {perfil === 'adm' && (
                <div>
                  <h5>Acesso Restrito Almoxarifado</h5>
                  <input type="text" placeholder="CPF do Almoxarife" value={cpfAlmoxarife} onChange={(e) => setCpfAlmoxarife(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: `1px solid ${TSEA.cinzaMedio}`, textAlign: 'center', marginBottom: '10px', boxSizing: 'border-box' }} />
                  <input type="password" placeholder="Senha ADM" value={senhaLoginAlmoxarife} onChange={(e) => setSenhaLoginAlmoxarife(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: `1px solid ${TSEA.cinzaMedio}`, textAlign: 'center', marginBottom: '15px', boxSizing: 'border-box' }} />
                  <button onClick={entrarComoAlmoxarife} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Acessar Painel</button>
                  <button onClick={() => setPerfil(null)} style={{ marginTop: '15px', background: 'none', border: 'none', color: TSEA.vermelho, fontWeight: 'bold', cursor: 'pointer' }}>← Voltar</button>
                </div>
              )}

              {perfil === 'superadmin' && (
                <div>
                  <h5>Acesso Master Geral</h5>
                  <input type="password" placeholder="Senha Master" value={senhaSuperAdmin} onChange={(e) => setSenhaSuperAdmin(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: `1px solid ${TSEA.cinzaMedio}`, textAlign: 'center', marginBottom: '15px', boxSizing: 'border-box' }} />
                  <button onClick={entrarComoSuperAdmin} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Entrar como Admin Admin</button>
                  <button onClick={() => setPerfil(null)} style={{ marginTop: '15px', background: 'none', border: 'none', color: TSEA.vermelho, fontWeight: 'bold', cursor: 'pointer' }}>← Voltar</button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;