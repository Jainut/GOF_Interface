import React, { useState, useEffect, useRef } from 'react';

function App() {
  // --- ESTADOS DO SISTEMA ---
  const [perfil, setPerfil] = useState(null); 
  const [logado, setLogado] = useState(false); 
  const [perfilLogado, setPerfilLogado] = useState(''); 
  const [abaAtiva, setAbaAtiva] = useState('pedir_emprestimo'); 
  const [abaAtivaAdm, setAbaAtivaAdm] = useState('aprovar_emprestimos'); 
  const [abaAtivaSuper, setAbaAtivaSuper] = useState('dashboard_setores');

  // Estado para controlar qual funcionário o almoxarife/admin está inspecionando
  const [funcSelecionadoId, setFuncSelecionadoId] = useState(null);

  // --- ESTADOS DO RECONHECIMENTO FACIAL REAL MULTIPLATAFORMA ---
  const [statusBiometria, setStatusBiometria] = useState('desligado'); 
  const [progressoEscaneamento, setProgressoEscaneamento] = useState(0);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // --- BANCO DE DADOS DE FUNCIONÁRIOS DA TSEA ---
  const listaFuncionariosTSEA = [
    { matricula: '1111', nome: 'João Silva', setor: 'Manutenção de Linha Viva', cargo: 'Eletricista de Distribuição II', empresa: 'TSEA Energia', status: 'ATIVO', biometria: 'MAPEADA' },
    { matricula: '2222', nome: 'Pedro Santos', setor: 'Subestações', cargo: 'Técnico de Proteção e Controle', empresa: 'TSEA Energia', status: 'ATIVO', biometria: 'MAPEADA' },
    { matricula: '3333', nome: 'Maria Oliveira', setor: 'Ensaios Elétricos', cargo: 'Engenheira de Alta Tensão', empresa: 'TSEA Energia', status: 'ATIVO', biometria: 'MAPEADA' }
  ];

  // O funcionário que está logando no momento (João Silva)
  const [operadorLogado, setOperadorLogado] = useState(listaFuncionariosTSEA[0]);

  // --- ESTADOS DO FLUXO DO TOTEM ---
  const [etapaTotem, setEtapaTotem] = useState('selecao');
  const [quantidades, setQuantidades] = useState([0, 0, 0, 0]);
  const [badgeReconfirmar, setBadgeReconfirmar] = useState('');
  
  const [itemSendoDevolvido, setItemSendoDevolvido] = useState(null);
  const [raDevolucaoFunc, setRaDevolucaoFunc] = useState('');

  const ferramentas = [
    { id: 1, nome: "Chave Estrela Isolada 19mm", img: 'https://placehold.co/80x80/f4f4f4/cc0000?text=Chave' },
    { id: 2, nome: "Torquímetro de Estalo 1/2", img: 'https://placehold.co/80x80/f4f4f4/cc0000?text=Torq' },
    { id: 3, nome: "Megômetro Digital 5KV", img: 'https://placehold.co/80x80/f4f4f4/cc0000?text=Mego' },
    { id: 4, nome: "Cinta de Elevação (3T)", img: 'https://placehold.co/80x80/f4f4f4/cc0000?text=Cinta' }
  ];

  const [ferramentasEmPosse, setFerramentasEmPosse] = useState([]);
  const [ativosEmCustodiaTSEA, setAtivosEmCustodiaTSEA] = useState([]);
  const [devolucoesPendentes, setDevolucoesPendentes] = useState([]);
  const [pedidoAtivo, setPedidoAtivo] = useState(null);
  const [senhaAlmoxarife, setSenhaAlmoxarife] = useState('');
  const [senhaAlmoxarifeDevolucao, setSenhaAlmoxarifeDevolucao] = useState('');
  const [senhaSuperAdmin, setSenhaSuperAdmin] = useState('');

  const TSEA = {
    vermelho: '#cc0000',
    vermelhoEscuro: '#990000',
    cinzaClaro: '#f4f4f4',
    cinzaMedio: '#e0e0e0',
    cinzaBorda: '#cccccc',
    cinzaEscuro: '#222222',
    branco: '#ffffff',
    preto: '#000000',
    verdeSucesso: '#2e7d32',
    azulInfo: '#1d4ed8'
  };

  useEffect(() => {
    const sincronizarDados = () => {
      const dadosJson = localStorage.getItem('pedidoTSEA');
      if (dadosJson) {
        const ped = JSON.parse(dadosJson);
        setPedidoAtivo(ped);
        if (perfilLogado === 'funcionario') {
          if (ped.status === "Aguardando Separação") setEtapaTotem('espera');
          if (ped.status === "Aprovado pelo Almoxarife") setEtapaTotem('reconfirmar');
        }
      } else {
        setPedidoAtivo(null);
        if (perfilLogado === 'funcionario' && etapaTotem !== 'selecao') setEtapaTotem('selecao');
      }

      const devJson = localStorage.getItem('devolucoesTSEA');
      if (devJson) {
        setDevolucoesPendentes(JSON.parse(devJson));
      } else {
        setDevolucoesPendentes([]);
      }

      const custodiaJson = localStorage.getItem('ativosEmCustodiaTSEA');
      if (custodiaJson) {
        setAtivosEmCustodiaTSEA(JSON.parse(custodiaJson));
      } else {
        const dadosIniciais = [
          { id: '999', funcionario: "Pedro Santos", matricula: "2222", ferramenta: "Megômetro Digital 5KV", qtd: 1, data: "24/05/2026 - 07:15", status: "EM CUSTÓDIA", setor: "Subestações" }
        ];
        localStorage.setItem('ativosEmCustodiaTSEA', JSON.stringify(dadosIniciais));
        setAtivosEmCustodiaTSEA(dadosIniciais);
      }

      const posseJson = localStorage.getItem('ativosEmCustodiaTSEA');
      if (posseJson) {
        const todosAtivos = JSON.parse(posseJson);
        const meusAtivos = todosAtivos.filter(a => a.matricula === operadorLogado.matricula && (a.status === "EM CUSTÓDIA" || a.status === "AGUARDANDO BAIXA"));
        setFerramentasEmPosse(meusAtivos);
      }
    };

    const interval = setInterval(sincronizarDados, 1000);
    return () => clearInterval(interval);
  }, [perfilLogado, etapaTotem, operadorLogado.matricula]);

  useEffect(() => {
    let timer;
    if (statusBiometria === 'escanear') {
      if (progressoEscaneamento < 100) {
        timer = setTimeout(() => {
          setProgressoEscaneamento(prev => prev + 5); 
        }, 80); 
      } else {
        setStatusBiometria('sucesso');
        desligarWebcam();
      }
    }
    return () => clearTimeout(timer);
  }, [statusBiometria, progressoEscaneamento]);

  // --- LÓGICA DE CÁLCULO DE FERRAMENTAS POR SETOR ---
  const obterFerramentasPorSetor = () => {
    const setores = {
      'Manutenção de Linha Viva': 0,
      'Subestações': 0,
      'Ensaios Elétricos': 0
    };

    ativosEmCustodiaTSEA.forEach(ativo => {
      if (ativo.status === "EM CUSTÓDIA" || ativo.status === "AGUARDANDO BAIXA") {
        // Encontra o setor do funcionário dono do ativo
        const func = listaFuncionariosTSEA.find(f => f.matricula === ativo.matricula);
        const nomeSetor = func ? func.setor : ativo.setor;
        if (setores[nomeSetor] !== undefined) {
          setores[nomeSetor] += ativo.qtd;
        }
      }
    });

    return setores;
  };

  const ligarWebcam = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const constraints = { 
          video: { width: { ideal: 640 }, height: { ideal: 640 }, facingMode: "user" } 
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', true);
        }
        setStatusBiometria('camera_ativa');
      } else {
        alert("Navegador sem suporte para câmera. Use o Chrome ou Firefox.");
      }
    } catch (err) {
      alert("Acesso à câmera negado. Dê a permissão nas configurações do navegador.");
      setStatusBiometria('desligado');
    }
  };

  const iniciarEscanerManual = () => {
    setProgressoEscaneamento(0);
    setStatusBiometria('escanear');
  };

  const entrarNoPainelManualmente = () => {
    setQuantidades([0, 0, 0, 0]); 
    setEtapaTotem('selecao'); 
    setPerfilLogado('funcionario');
    setLogado(true);
    setStatusBiometria('desligado');
    setProgressoEscaneamento(0);
    setAbaAtiva('pedir_emprestimo');
  };

  const entrarComoAlmoxarife = () => {
    setPerfilLogado('adm');
    setAbaAtivaAdm('aprovar_emprestimos');
    setLogado(true);
  };

  const entrarComoSuperAdmin = () => {
    if (senhaSuperAdmin === 'admin123') {
      setPerfilLogado('superadmin');
      setAbaAtivaSuper('dashboard_setores');
      setLogado(true);
      setSenhaSuperAdmin('');
    } else {
      alert("Senha do Administrador Geral incorreta!");
    }
  };

  const desligarWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const enviarPedido = () => {
    const itens = ferramentas.map((f, i) => quantidades[i] > 0 ? { nome: f.nome, qtd: quantidades[i] } : null).filter(Boolean);
    if (itens.length === 0) return alert("Selecione pelo menos um item!");
    
    const novoPedido = {
      idPedido: Math.floor(1000 + Math.random() * 9000),
      funcionario: operadorLogado.nome,
      badge: operadorLogado.matricula,
      setor: operadorLogado.setor,
      cargo: operadorLogado.cargo,
      itens: itens.map(i => `${i.nome} (${i.qtd}x)`),
      itensPuros: itens, 
      status: "Aguardando Separação",
      timestamp: new Date().toLocaleDateString() + " - " + new Date().toLocaleTimeString()
    };
    localStorage.setItem('pedidoTSEA', JSON.stringify(novoPedido));
    setEtapaTotem('espera');
  };

  const finalizarRetirada = () => {
    if (badgeReconfirmar !== operadorLogado.matricula) return alert("Matrícula Incorreta!");
    const pedido = JSON.parse(localStorage.getItem('pedidoTSEA'));
    const ativosAtuais = localStorage.getItem('ativosEmCustodiaTSEA') ? JSON.parse(localStorage.getItem('ativosEmCustodiaTSEA')) : [];
    
    const novosAtivosVinculados = pedido.itensPuros.map(item => ({
      id: Math.floor(10000 + Math.random() * 90000).toString(),
      funcionario: operadorLogado.nome,
      matricula: operadorLogado.matricula,
      ferramenta: item.nome,
      qtd: item.qtd,
      data: new Date().toLocaleDateString() + " - " + new Date().toLocaleTimeString(),
      status: "EM CUSTÓDIA",
      setor: operadorLogado.setor
    }));

    const novaListaGeral = [...novosAtivosVinculados, ...ativosAtuais];
    localStorage.setItem('ativosEmCustodiaTSEA', JSON.stringify(novaListaGeral));
    setAtivosEmCustodiaTSEA(novaListaGeral);

    pedido.status = "Confirmado pelo Funcionario";
    localStorage.setItem('pedidoTSEA', JSON.stringify(pedido));
    
    alert("Identidade Confirmada! Equipamentos vinculados à sua conta.");
    setQuantidades([0, 0, 0, 0]);
    setEtapaTotem('selecao');
    setBadgeReconfirmar('');
    setAbaAtiva('ferramentas_retiradas'); 
  };

  const abrirDevolucao = (index) => {
    setItemSendoDevolvido(index);
    setRaDevolucaoFunc('');
  };

  const confirmarDevolucaoFuncionario = () => {
    if (raDevolucaoFunc !== operadorLogado.matricula) {
      return alert("RA incorreto!");
    }

    const itemDoClick = ferramentasEmPosse[itemSendoDevolvido];
    const devAtuais = localStorage.getItem('devolucoesTSEA') ? JSON.parse(localStorage.getItem('devolucoesTSEA')) : [];
    const novaDevolucao = {
      id: itemDoClick.id,
      funcionario: operadorLogado.nome,
      matricula: operadorLogado.matricula,
      ferramenta: itemDoClick.ferramenta,
      qtd: itemDoClick.qtd
    };
    localStorage.setItem('devolucoesTSEA', JSON.stringify([...devAtuais, novaDevolucao]));

    const todosAtivos = JSON.parse(localStorage.getItem('ativosEmCustodiaTSEA'));
    const ativosAtualizados = todosAtivos.map(ativo => {
      if (ativo.id === itemDoClick.id) {
        return { ...ativo, status: "AGUARDANDO BAIXA" };
      }
      return ativo;
    });
    
    localStorage.setItem('ativosEmCustodiaTSEA', JSON.stringify(ativosAtualizados));
    setAtivosEmCustodiaTSEA(ativosAtualizados);
    
    alert("Solicitação de devolução enviada ao Almoxarifado.");
    setItemSendoDevolvido(null);
  };

  const aprovarBaixaDevolucao = (id, funcionario, ferramenta) => {
    if (senhaAlmoxarifeDevolucao !== '9999') {
      return alert("Código autorizador incorreto!");
    }

    const listaFiltradaDev = devolucoesPendentes.filter(d => d.id !== id);
    localStorage.setItem('devolucoesTSEA', JSON.stringify(listaFiltradaDev));
    setDevolucoesPendentes(listaFiltradaDev);
    setSenhaAlmoxarifeDevolucao('');

    const todosAtivos = JSON.parse(localStorage.getItem('ativosEmCustodiaTSEA'));
    const ativosAtualizados = todosAtivos.map(ativo => {
      if (ativo.id === id) {
        return { 
          ...ativo, 
          status: "DEVOLVIDO", 
          dataDevolucao: new Date().toLocaleDateString() + " - " + new Date().toLocaleTimeString() 
        };
      }
      return ativo;
    });

    localStorage.setItem('ativosEmCustodiaTSEA', JSON.stringify(ativosAtualizados));
    setAtivosEmCustodiaTSEA(ativosAtualizados);
    alert(`Baixa processada da ferramenta: "${ferramenta}".`);
  };

  const ferramentasPorSetor = obterFerramentasPorSetor();

  return (
    <div style={{ backgroundColor: TSEA.cinzaClaro, minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      <style>{`
        .layout-container { display: flex; flex-direction: row; }
        .sidebar { width: 280px; min-height: 100vh; background-color: ${TSEA.cinzaEscuro}; padding: 20px; color: white; display: flex; flex-direction: column; }
        .content-main { flex: 1; padding: 30px; box-sizing: border-box; }
        .grid-ferramentas { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
        .table-responsive { width: 100%; overflow-x: auto; display: block; }
        .ficha-dados { background: ${TSEA.branco}; padding: 25px; border-radius: 8px; border: 1px solid ${TSEA.cinzaMedio}; margin-top: 15px; }
        .ficha-item { padding: 12px 0; border-bottom: 1px solid ${TSEA.cinzaClaro}; display: flex; justify-content: space-between; font-size: 14px; }
        .card-funcionario-adm { border: 1px solid ${TSEA.cinzaBorda}; padding: 15px; border-radius: 6px; background: #fff; margin-bottom: 10px; cursor: pointer; transition: 0.2s; }
        .card-funcionario-adm:hover { border-color: ${TSEA.vermelho}; background: #fdfafb; }
        .card-setor { background: #fff; padding: 20px; border-radius: 8px; border-left: 5px solid ${TSEA.azulInfo}; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

        @media (max-width: 768px) {
          .layout-container { flex-direction: column; }
          .sidebar { width: 100%; min-height: auto; padding: 15px; }
          .nav-menu { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 15px; }
          .content-main { padding: 15px; }
          .btn-sidebar { font-size: 12px !important; padding: 10px !important; margin-bottom: 0 !important; width: auto !important; flex: 1 1 40%; }
        }
        @keyframes piscar { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
        .pisca-alerta { animation: piscar 1.5s infinite; }

        @media print {
          body * { visibility: hidden; }
          .print-document, .print-document * { visibility: visible; }
          .print-document { position: absolute; left: 0; top: 0; width: 100% !important; background: #fff !important; color: #000 !important; padding: 30px !important; box-sizing: border-box; font-family: sans-serif; }
          .print-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .print-table th, .print-table td { border: 1px solid #000 !important; padding: 10px !important; text-align: left; }
          .print-table th { background-color: #f2f2f2 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-signatures { display: flex !important; justify-content: space-between !important; margin-top: 60px; }
          .print-sig-box { width: 45%; border-top: 1px solid #000; text-align: center; padding-top: 8px; font-size: 13px; }
        }
        @media screen { .print-document { display: none !important; } }
      `}</style>

      {/* PAINEL DO FUNCIONÁRIO */}
      {logado && perfilLogado === 'funcionario' && (
        <div className="layout-container">
          <aside className="sidebar no-print">
            <div style={{ textAlign: 'center', borderBottom: `3px solid ${TSEA.vermelho}`, paddingBottom: '15px', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '20px' }}>TSEA <span style={{ color: TSEA.vermelho }}>ENERGIA</span></h3>
              <small style={{ color: TSEA.cinzaBorda, fontSize: '10px' }}>TOTEM COLABORADOR</small>
            </div>
            <nav className="nav-menu" style={{ flex: 1 }}>
              <button onClick={() => setAbaAtiva('pedir_emprestimo')} className="btn-sidebar" style={{ width: '100%', padding: '12px', backgroundColor: abaAtiva === 'pedir_emprestimo' ? TSEA.vermelho : 'transparent', color: 'white', border: 'none', textAlign: 'left', fontWeight: 'bold', borderRadius: '4px', marginBottom: '5px', cursor: 'pointer' }}>Novo Empréstimo</button>
              <button onClick={() => setAbaAtiva('ferramentas_retiradas')} className="btn-sidebar" style={{ width: '100%', padding: '12px', backgroundColor: abaAtiva === 'ferramentas_retiradas' ? TSEA.vermelho : 'transparent', color: 'white', border: 'none', textAlign: 'left', fontWeight: 'bold', borderRadius: '4px', marginBottom: '5px', cursor: 'pointer' }}>Minha Custódia</button>
              <button onClick={() => setAbaAtiva('devolucoes')} className="btn-sidebar" style={{ width: '100%', padding: '12px', backgroundColor: abaAtiva === 'devolucoes' ? TSEA.vermelho : 'transparent', color: 'white', border: 'none', textAlign: 'left', fontWeight: 'bold', borderRadius: '4px', marginBottom: '5px', cursor: 'pointer' }}>Devolver Itens</button>
              <button onClick={() => setAbaAtiva('meus_dados')} className="btn-sidebar" style={{ width: '100%', padding: '12px', backgroundColor: abaAtiva === 'meus_dados' ? TSEA.vermelho : 'transparent', color: 'white', border: 'none', textAlign: 'left', fontWeight: 'bold', borderRadius: '4px', marginBottom: '5px', cursor: 'pointer' }}>Meus Dados</button>
            </nav>
            <button onClick={() => { setLogado(false); setPerfil(null); }} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Sair</button>
          </aside>

          <main className="content-main">
            <header className="no-print" style={{ backgroundColor: TSEA.branco, padding: '20px', borderRadius: '8px', borderLeft: `6px solid ${TSEA.vermelho}`, boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: TSEA.preto }}>Sistema de Cautelas</h3>
              <span style={{ fontSize: '14px', color: '#555' }}><strong>{operadorLogado.nome}</strong> | RE: {operadorLogado.matricula}</span>
            </header>

            {abaAtiva === 'pedir_emprestimo' && (
              <div style={{ backgroundColor: TSEA.branco, padding: '20px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                {etapaTotem === 'selecao' && (
                  <>
                    <h4 style={{ margin: '0 0 15px 0' }}>Selecione as Ferramentas</h4>
                    <div className="grid-ferramentas">
                      {ferramentas.map((f, i) => (
                        <div key={f.id} style={{ padding: '15px', border: `1px solid ${TSEA.cinzaMedio}`, borderRadius: '6px', textAlign: 'center', backgroundColor: '#fff' }}>
                          <img src={f.img} alt="" style={{ width: '60px', height: '60px', marginBottom: '10px' }} />
                          <div style={{ fontSize: '13px', fontWeight: 'bold', minHeight: '34px' }}>{f.nome}</div>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                            <button onClick={() => { let q = [...quantidades]; q[i] = Math.max(0, q[i]-1); setQuantidades(q); }} style={{ background: TSEA.cinzaEscuro, color: 'white', border: 'none', width: '28px', height: '28px', borderRadius: '4px' }}>-</button>
                            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{quantidades[i]}</span>
                            <button onClick={() => { let q = [...quantidades]; q[i] = q[i]+1; setQuantidades(q); }} style={{ background: TSEA.cinzaEscuro, color: 'white', border: 'none', width: '28px', height: '28px', borderRadius: '4px' }}>+</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={enviarPedido} style={{ width: '100%', padding: '14px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', marginTop: '20px', cursor: 'pointer' }}>Solicitar Ferramentas</button>
                  </>
                )}

                {etapaTotem === 'espera' && (
                  <div style={{ textAlign: 'center', padding: '30px 0' }}>
                    <div style={{ fontSize: '45px', color: TSEA.vermelho }}>...</div>
                    <h4>Aguardando liberação do Almoxarifado...</h4>
                  </div>
                )}

                {etapaTotem === 'reconfirmar' && (
                  <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <div style={{ fontSize: '45px', color: 'green' }}>✓</div>
                    <h4>Equipamentos Prontos!</h4>
                    <p style={{ fontSize: '13px' }}>Digite seu RE para assinar digitalmente:</p>
                    <input type="password" value={badgeReconfirmar} onChange={(e) => setBadgeReconfirmar(e.target.value)} style={{ width: '100%', maxWidth: '280px', padding: '12px', textAlign: 'center', fontSize: '20px', marginBottom: '15px', borderRadius: '6px', border: `2px solid ${TSEA.vermelho}` }} placeholder="Ex: 1111" />
                    <button onClick={finalizarRetirada} style={{ width: '100%', maxWidth: '280px', padding: '14px', background: TSEA.cinzaEscuro, color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Confirmar Coleta</button>
                  </div>
                )}
              </div>
            )}

            {abaAtiva === 'ferramentas_retiradas' && (
              <div style={{ backgroundColor: TSEA.branco, padding: '20px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 15px 0' }}>Ativos Sob Minha Custódia</h4>
                {ferramentasEmPosse.length === 0 ? (
                  <p style={{ color: '#888', textAlign: 'center' }}>Nenhum item em posse.</p>
                ) : (
                  <div className="table-responsive">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
                      <thead>
                        <tr style={{ backgroundColor: TSEA.cinzaClaro }}>
                          <th style={{ padding: '12px' }}>Ferramenta</th>
                          <th style={{ padding: '12px' }}>Qtd.</th>
                          <th style={{ padding: '12px' }}>Data Retirada</th>
                          <th style={{ padding: '12px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ferramentasEmPosse.map((item, index) => (
                          <tr key={index} style={{ borderBottom: `1px solid ${TSEA.cinzaMedio}` }}>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.ferramenta}</td>
                            <td style={{ padding: '12px' }}>{item.qtd}x</td>
                            <td style={{ padding: '12px', color: '#555', fontSize: '13px' }}>{item.data}</td>
                            <td style={{ padding: '12px' }}>
                              <span style={{ background: item.status === "EM CUSTÓDIA" ? '#ffebee' : '#fff3e0', color: item.status === "EM CUSTÓDIA" ? TSEA.vermelho : '#ef6c00', padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' }}>{item.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {abaAtiva === 'devolucoes' && (
              <div style={{ backgroundColor: TSEA.branco, padding: '20px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 15px 0' }}>Logística de Devolução</h4>
                {itemSendoDevolvido === null ? (
                  ferramentasEmPosse.filter(i => i.status === "EM CUSTÓDIA").length === 0 ? (
                    <p style={{ color: '#888', textAlign: 'center' }}>Nenhuma ferramenta pendente para devolução.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {ferramentasEmPosse.filter(i => i.status === "EM CUSTÓDIA").map((item, index) => (
                        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: `1px solid ${TSEA.cinzaMedio}`, borderRadius: '6px', backgroundColor: '#fafafa' }}>
                          <div>
                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{item.ferramenta}</div>
                            <small style={{ color: '#666' }}>Qtd: {item.qtd}x</small>
                          </div>
                          <button onClick={() => abrirDevolucao(index)} style={{ padding: '8px 12px', background: TSEA.cinzaEscuro, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}>Devolver</button>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div style={{ textAlign: 'center', padding: '15px', backgroundColor: TSEA.cinzaClaro, borderRadius: '8px', border: `2px solid ${TSEA.vermelho}`, maxWidth: '400px', margin: '0 auto' }}>
                    <h5>Validação de Devolução</h5>
                    <p style={{ fontSize: '12px' }}>Confirme seu <strong>RA</strong> para liberar o item <strong>{ferramentasEmPosse[itemSendoDevolvido].ferramenta}</strong>:</p>
                    <input type="password" value={raDevolucaoFunc} onChange={(e) => setRaDevolucaoFunc(e.target.value)} placeholder="Digite seu RA" style={{ padding: '10px', width: '80%', borderRadius: '4px', border: `1px solid ${TSEA.cinzaBorda}`, textAlign: 'center', marginBottom: '15px' }} />
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button onClick={() => setItemSendoDevolvido(null)} style={{ padding: '8px 15px', background: '#888', color: '#fff', border: 'none', borderRadius: '4px' }}>Voltar</button>
                      <button onClick={confirmarDevolucaoFuncionario} style={{ padding: '8px 15px', background: TSEA.vermelho, color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Confirmar</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {abaAtiva === 'meus_dados' && (
              <div style={{ backgroundColor: TSEA.branco, padding: '20px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h4 style={{ margin: '0 0 5px 0' }}>Dados Funcionais</h4>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>Informações integradas com o RH da TSEA Energia.</p>
                <div className="ficha-dados">
                  <div className="ficha-item"><strong>Nome Completo:</strong> <span>{operadorLogado.nome}</span></div>
                  <div className="ficha-item"><strong>RE / Matrícula:</strong> <span>{operadorLogado.matricula}</span></div>
                  <div className="ficha-item"><strong>Setor Atuante:</strong> <span>{operadorLogado.setor}</span></div>
                  <div className="ficha-item"><strong>Cargo Cadastrado:</strong> <span>{operadorLogado.cargo}</span></div>
                  <div className="ficha-item"><strong>Empresa Vinculada:</strong> <span>{operadorLogado.empresa}</span></div>
                  <div className="ficha-item"><strong>Status Operacional:</strong> <span style={{ color: 'green', fontWeight: 'bold' }}>ATIVO</span></div>
                  <div className="ficha-item"><strong>Biometria Facial:</strong> <span style={{ color: '#2563eb', fontWeight: 'bold' }}>MAPEADA</span></div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* PAINEL DO ALMOXARIFE (ADM) */}
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

      {/* NOVA AREA DO SUPER ADMIN (ADMIN ADMIN) */}
      {logado && perfilLogado === 'superadmin' && (
        <div className="layout-container">
          <aside className="sidebar no-print">
            <div style={{ textAlign: 'center', borderBottom: `3px solid ${TSEA.azulInfo}`, paddingBottom: '15px', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '20px' }}>TSEA <span style={{ color: TSEA.azulInfo }}>GERAL</span></h3>
              <small style={{ color: TSEA.cinzaBorda, fontSize: '10px' }}>ADMINISTRADOR MASTER</small>
            </div>
            <nav className="nav-menu" style={{ flex: 1 }}>
              <button onClick={() => setAbaAtivaSuper('dashboard_setores')} className="btn-sidebar" style={{ width: '100%', padding: '12px', backgroundColor: abaAtivaSuper === 'dashboard_setores' ? TSEA.azulInfo : 'transparent', color: 'white', border: 'none', textAlign: 'left', fontWeight: 'bold', borderRadius: '4px', marginBottom: '5px' }}>Ativos por Setor</button>
              <button onClick={() => { setAbaAtivaSuper('rh_funcionarios'); setFuncSelecionadoId(null); }} className="btn-sidebar" style={{ width: '100%', padding: '12px', backgroundColor: abaAtivaSuper === 'rh_funcionarios' ? TSEA.azulInfo : 'transparent', color: 'white', border: 'none', textAlign: 'left', fontWeight: 'bold', borderRadius: '4px', marginBottom: '5px' }}>Fichas de Funcionários</button>
              <button onClick={() => setAbaAtivaSuper('gestao_almoxarifado')} className="btn-sidebar" style={{ width: '100%', padding: '12px', backgroundColor: abaAtivaSuper === 'gestao_almoxarifado' ? TSEA.azulInfo : 'transparent', color: 'white', border: 'none', textAlign: 'left', fontWeight: 'bold', borderRadius: '4px', marginBottom: '5px' }}>Espelho Almoxarifado</button>
            </nav>
            <button onClick={() => { setLogado(false); setPerfil(null); }} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Sair</button>
          </aside>

          <main className="content-main">
            <header style={{ backgroundColor: TSEA.branco, padding: '20px', borderRadius: '8px', borderLeft: `6px solid ${TSEA.azulInfo}`, boxShadow: '0 4px 10px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
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
                          <span style={{ fontSize: '24px', fontWeight: 'bold', color: TSEA.azulInfo }}>{ferramentasPorSetor[setorNome]}</span>
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
                      <div key={func.matricula} className="card-funcionario-adm" style={{ borderLeft: `4px solid ${TSEA.azulInfo}` }} onClick={() => setFuncSelecionadoId(func)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong style={{ fontSize: '16px' }}>{func.nome}</strong>
                            <div style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>RE: {func.matricula} | {func.cargo}</div>
                          </div>
                          <button style={{ padding: '6px 12px', background: TSEA.azulInfo, color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>Ver Ficha Completa</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ border: `2px solid ${TSEA.azulInfo}`, padding: '25px', borderRadius: '8px', backgroundColor: '#fff' }}>
                    <button onClick={() => setFuncSelecionadoId(null)} style={{ background: TSEA.cinzaEscuro, color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', marginBottom: '20px' }}>← Voltar para Todos</button>
                    
                    <h3 style={{ margin: '0 0 5px 0', color: TSEA.azulInfo }}>{funcSelecionadoId.nome}</h3>
                    <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#555' }}>RE Cadastrado: {funcSelecionadoId.matricula}</p>
                    
                    <div className="ficha-dados" style={{ marginTop: '0', marginBottom: '20px' }}>
                      <div className="ficha-item"><strong>Setor Operacional:</strong> <span>{funcSelecionadoId.setor}</span></div>
                      <div className="ficha-item"><strong>Cargo Técnico:</strong> <span>{funcSelecionadoId.cargo}</span></div>
                      <div className="ficha-item"><strong>Corporação Mãe:</strong> <span>{funcSelecionadoId.empresa}</span></div>
                      <div className="ficha-item"><strong>Status Funcional no RH:</strong> <span style={{ color: 'green', fontWeight: 'bold' }}>{funcSelecionadoId.status}</span></div>
                      <div className="ficha-item"><strong>Validação Facial Cadastrada:</strong> <span style={{ color: TSEA.azulInfo, fontWeight: 'bold' }}>{funcSelecionadoId.biometria}</span></div>
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

      {/* AREA DO RELATÓRIO DO PDF */}
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

      {/* LOGIN GERAL INTEGRADO */}
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
                    <button onClick={() => setPerfil('superadmin')} style={{ padding: '15px', background: TSEA.azulInfo, color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Administrador Geral (MASTER)</button>
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
                  <input type="password" placeholder="Senha ADM" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: `1px solid ${TSEA.cinzaMedio}`, textAlign: 'center', marginBottom: '15px', boxSizing: 'border-box' }} />
                  <button onClick={entrarComoAlmoxarife} style={{ width: '100%', padding: '12px', background: TSEA.vermelho, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Acessar Painel</button>
                  <button onClick={() => setPerfil(null)} style={{ marginTop: '15px', background: 'none', border: 'none', color: TSEA.vermelho, fontWeight: 'bold', cursor: 'pointer' }}>← Voltar</button>
                </div>
              )}

              {perfil === 'superadmin' && (
                <div>
                  <h5>Acesso Master Geral</h5>
                  <input type="password" placeholder="Senha Master" value={senhaSuperAdmin} onChange={(e) => setSenhaSuperAdmin(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: `1px solid ${TSEA.cinzaMedio}`, textAlign: 'center', marginBottom: '15px', boxSizing: 'border-box' }} />
                  <button onClick={entrarComoSuperAdmin} style={{ width: '100%', padding: '12px', background: TSEA.azulInfo, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Entrar como Admin Admin</button>
                  <button onClick={() => setPerfil(null)} style={{ marginTop: '15px', background: 'none', border: 'none', color: TSEA.azulInfo, fontWeight: 'bold', cursor: 'pointer' }}>← Voltar</button>
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