import React, { useState, useEffect, useRef } from 'react';

// IMPORTAÇÃO DAS TELAS SEPARADAS
import Login from './components/Login';
import PainelOperador from './components/PainelOperador';
import PainelAlmoxarife from './components/PainelAlmoxarife';
import PainelMaster from './components/PainelMaster';

const TSEA = {
  vermelho: '#E30613',
  preto: '#1A1A1A',
  cinzaEscuro: '#4A4A4A',
  cinzaMedio: '#CCCCCC',
  cinzaClaro: '#F5F5F5',
  cinzaBorda: '#999999',
  branco: '#FFFFFF'
};

function App() {
  const [logado, setLogado] = useState(false);
  const [perfilLogado, setPerfilLogado] = useState(null); 
  const [perfil, setPerfil] = useState(null);             
  
  const [operador] = useState({
    nome: "Carlos Eduardo Santos",
    matricula: "RE-40922",
    setor: "Bobinagem de Transformadores",
    cargo: "Técnico de Isolamento Especializado",
    empresa: "TSEA Energia S.A.",
    status: "Ativo Operacional",
    biometria: "Face ID Cadastrado - Nível 3"
  });

  const [abaAtiva, setAbaAtiva] = useState('solicitar');
  const [carrinho, setCarrinho] = useState([]);
  const [termoAceito, setTermoAceito] = useState(false);
  const [statusBiometria, setStatusBiometria] = useState('desligado');
  const [progressoEscaneamento, setProgressoEscaneamento] = useState(0);
  const videoRef = useRef(null);

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

  const [abaAtivaAdm, setAbaAtivaAdm] = useState('aprovar_emprestimos');
  const [abaAtivaSuper, setAbaAtivaSuper] = useState('dashboard_setores');
  const [senhaAlmoxarife, setSenhaAlmoxarife] = useState('');
  const [senhaAlmoxarifeDevolucao, setSenhaAlmoxarifeDevolucao] = useState('');
  
  const [cpfAlmoxarife, setCpfAlmoxarife] = useState('');
  const [senhaLoginAlmoxarife, setSenhaLoginAlmoxarife] = useState('');
  const [senhaSuperAdmin, setSenhaSuperAdmin] = useState('');
  const [funcSelecionadoId, setFuncSelecionadoId] = useState(null);

  const [ativosEmCustodiaTSEA, setAtivosEmCustodiaTSEA] = useState([
    { funcionario: "Carlos Eduardo Santos", matricula: "RE-40922", ferramenta: "Torquímetro Snap-on Digital 10-200Nm", qtd: 1, data: "28/05/2026 07:42", status: "EM CUSTÓDIA", dataDevolucao: null },
    { funcionario: "Carlos Eduardo Santos", matricula: "RE-40922", ferramenta: "Parafusadeira de Impacto Bosch 18V", qtd: 1, data: "28/05/2026 07:42", status: "EM CUSTÓDIA", dataDevolucao: null },
    { funcionario: "Marcos Antônio Pereira", matricula: "RE-11054", ferramenta: "Multímetro Digital Fluke Industrial", qtd: 1, data: "27/05/2026 13:15", status: "AGUARDANDO BAIXA", dataDevolucao: null },
    { funcionario: "Fernanda Lima Souza", matricula: "RE-33821", ferramenta: "Cinto de Segurança Paraquedista Confort", qtd: 1, data: "29/05/2026 08:00", status: "DEVOLVIDO", dataDevolucao: "29/05/2026 17:10" },
    { funcionario: "Rodrigo Melo Alves", matricula: "RE-22941", ferramenta: "Esmerilhadeira Angular DeWalt 4.1/2", qtd: 1, data: "29/05/2026 09:30", status: "EM CUSTÓDIA", dataDevolucao: null }
  ]);

  const [pedidoAtivo, setPedidoAtivo] = useState(() => {
    const salvo = localStorage.getItem('pedidoTSEA');
    return salvo ? JSON.parse(salvo) : null;
  });

  const [devolucoesPendentes, setDevolucoesPendentes] = useState([
    { id: 101, funcionario: "Marcos Antônio Pereira", matricula: "RE-11054", ferramenta: "Multímetro Digital Fluke Industrial", qtd: 1 }
  ]);

  const listaFuncionariosTSEA = [
    { nome: "Carlos Eduardo Santos", matricula: "RE-40922", setor: "Bobinagem de Transformadores", cargo: "Técnico de Isolamento Especializado", empresa: "TSEA Energia S.A.", status: "Ativo", biometria: "Face ID Ativo" },
    { nome: "Marcos Antônio Pereira", matricula: "RE-11054", setor: "Montagem Eletromecânica", cargo: "Mecânico de Manutenção Pesada", empresa: "TSEA Energia S.A.", status: "Ativo", biometria: "Face ID Ativo" },
    { nome: "Fernanda Lima Souza", matricula: "RE-33821", setor: "Ensaios de Alta Tensão (Laboratório)", cargo: "Engenheira de Testes Industriais", empresa: "TSEA Energia S.A.", status: "Ativo", biometria: "Face ID Ativo" },
    { nome: "Rodrigo Melo Alves", matricula: "RE-22941", setor: "Manutenção de Subestações Internas", cargo: "Eletricista de Força e Luz", empresa: "TSEA Energia S.A.", status: "Ativo", biometria: "Face ID Ativo" }
  ];

  const ferramentasPorSetor = {
    "Bobinagem de Transformadores": 2,
    "Montagem Eletromecânica": 1,
    "Ensaios de Alta Tensão": 0,
    "Manutenção de Subestações": 1
  };

  const ligarWebcam = async () => {
    try {
      setStatusBiometria('camera_ativa');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) videoRef.current.srcObject = stream;
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

  const alterarQuantidadeCarrinho = (ferramentaNome, acao) => {
    const itemNoCarrinho = carrinho.find(c => c.nome === ferramentaNome);
    const itemCatalogo = catalogoFerramentas.find(f => f.nome === ferramentaNome);

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

  const resetSessao = () => {
    setLogado(false);
    setPerfil(null);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: TSEA.preto, backgroundColor: '#f9f9f9', minHeight: '100vh', margin: 0 }}>
      <style>{`
        .layout-container { display: flex; min-height: 100vh; }
        .sidebar { width: 260px; background-color: ${TSEA.preto}; color: white; padding: 25px 15px; display: flex; flex-direction: column; justify-content: space-between; }
        .content-main { flex: 1; padding: 30px; background-color: #f4f6f9; }
        .btn-sidebar { cursor: pointer; transition: all 0.2s; display: flex; align-items: center; }
        .btn-sidebar:hover { opacity: 0.9; transform: translateX(3px); }
        .grid-catalogo { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; margin-top: 15px; }
        .card-ferramenta { background: white; border: 1px solid ${TSEA.cinzaMedio}; border-radius: 6px; padding: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between; }
        .badge-categoria { font-size: 10px; text-transform: uppercase; background: ${TSEA.cinzaClaro}; color: #555; padding: 3px 6px; border-radius: 4px; font-weight: bold; width: max-content; }
        .card-funcionario-adm { background: white; padding: 15px; border-radius: 6px; border: 1px solid ${TSEA.cinzaMedio}; cursor: pointer; transition: 0.2s; }
        .card-funcionario-adm:hover { border-color: ${TSEA.vermelho}; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .card-setor { background: white; padding: 20px; border-radius: 6px; border-left: 5px solid ${TSEA.vermelho}; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .ficha-dados { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; background: ${TSEA.cinzaClaro}; padding: 15px; border-radius: 6px; }
        .ficha-item strong { display: block; font-size: 12px; color: #666; }
        .ficha-item span { font-size: 14px; font-weight: bold; }
        .table-responsive { width: 100%; overflow-x: auto; background: white; border-radius: 6px; border: 1px solid ${TSEA.cinzaMedio}; }
        .pisca-alerta { animation: pulsar 1.5s infinite; }
        @keyframes pulsar { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
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

      {/* RENDERIZAÇÃO CONDICIONAL COM BASE NO ESTADO DE COMPONENTES */}
      {!logado ? (
        <Login 
          TSEA={TSEA} perfil={perfil} setPerfil={setPerfil} statusBiometria={statusBiometria}
          videoRef={videoRef} progressoEscaneamento={progressoEscaneamento} ligarWebcam={ligarWebcam}
          iniciarEscanerManual={iniciarEscanerManual} entrarNoPainelManualmente={entrarNoPainelManualmente}
          desligarWebcam={desligarWebcam} cpfAlmoxarife={cpfAlmoxarife} setCpfAlmoxarife={setCpfAlmoxarife}
          senhaLoginAlmoxarife={senhaLoginAlmoxarife} setSenhaLoginAlmoxarife={setSenhaLoginAlmoxarife}
          entrarComoAlmoxarife={entrarComoAlmoxarife} senhaSuperAdmin={senhaSuperAdmin}
          setSenhaSuperAdmin={setSenhaSuperAdmin} entrarComoSuperAdmin={entrarComoSuperAdmin}
        />
      ) : perfilLogado === 'func' ? (
        <PainelOperador 
          TSEA={TSEA} abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} operador={operador}
          catalogoFerramentas={catalogoFerramentas} carrinho={carrinho} termoAceito={termoAceito}
          setTermoAceito={setTermoAceito} alterarQuantidadeCarrinho={alterarQuantidadeCarrinho}
          emitirPedidoSaidaCompleto={emitirPedidoSaidaCompleto} ativosEmCustodiaTSEA={ativosEmCustodiaTSEA}
          solicitarDevolucaoImediata={solicitarDevolucaoImediata} pedidoAtivo={pedidoAtivo}
          setAtivosEmCustodiaTSEA={setAtivosEmCustodiaTSEA} logout={resetSessao}
        />
      ) : perfilLogado === 'adm' ? (
        <PainelAlmoxarife 
          TSEA={TSEA} abaAtivaAdm={abaAtivaAdm} setAbaAtivaAdm={setAbaAtivaAdm} pedidoAtivo={pedidoAtivo}
          senhaAlmoxarife={senhaAlmoxarife} setSenhaAlmoxarife={setSenhaAlmoxarife} setPedidoAtivo={setPedidoAtivo}
          devolucoesPendentes={devolucoesPendentes} senhaAlmoxarifeDevolucao={senhaAlmoxarifeDevolucao}
          setSenhaAlmoxarifeDevolucao={setSenhaAlmoxarifeDevolucao} aprovarBaixaDevolucao={aprovarBaixaDevolucao}
          ativosEmCustodiaTSEA={ativosEmCustodiaTSEA} listaFuncionariosTSEA={listaFuncionariosTSEA}
          funcSelecionadoId={funcSelecionadoId} setFuncSelecionadoId={setFuncSelecionadoId} logout={resetSessao}
        />
      ) : perfilLogado === 'superadmin' ? (
        <PainelMaster 
          TSEA={TSEA} abaAtivaSuper={abaAtivaSuper} setAbaAtivaSuper={setAbaAtivaSuper}
          ferramentasPorSetor={ferramentasPorSetor} listaFuncionariosTSEA={listaFuncionariosTSEA}
          funcSelecionadoId={funcSelecionadoId} setFuncSelecionadoId={setFuncSelecionadoId}
          ativosEmCustodiaTSEA={ativosEmCustodiaTSEA} logout={resetSessao}
        />
      ) : null}

      {/* DOCUMENTO OCULTO DE IMPRESSÃO (PERMANECE NO ARQUIVO PRINCIPAL) */}
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
    </div>
  );
}

export default App;