import React, { useState, useRef } from 'react';
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
    status: "Ativo Operacional"
  });

  const [abaAtiva, setAbaAtiva] = useState('confirme_cartao');
  const [abaAtivaAdm, setAbaAtivaAdm] = useState('solicitar_emprestimo');
  const [abaAtivaSuper, setAbaAtivaSuper] = useState('registro_usuario');
  
  const [carrinho, setCarrinho] = useState([]);
  const [statusBiometria, setStatusBiometria] = useState('desligado');
  const [progressoEscaneamento, setProgressoEscaneamento] = useState(0);
  const videoRef = useRef(null);

  const [idAlmoxarife, setIdAlmoxarife] = useState('');
  const [senhaLoginAlmoxarife, setSenhaLoginAlmoxarife] = useState('');
  const [senhaSuperAdmin, setSenhaSuperAdmin] = useState('');
  const [senhaAlmoxarife, setSenhaAlmoxarife] = useState('');
  const [senhaAlmoxarifeDevolucao, setSenhaAlmoxarifeDevolucao] = useState('');

  const [catalogoFerramentas, setCatalogoFerramentas] = useState([
    { id: 1, nome: "Chave Estrela 1/2 texturada TSEA", categoria: "Manuais", total: 15, disponivel: 15 },
    { id: 2, nome: "Alicate de Pressão Isolado 1000V", categoria: "Manuais", total: 10, disponivel: 10 },
    { id: 3, nome: "Multímetro Digital Fluke Industrial", categoria: "Medição", total: 5, disponivel: 5 },
    { id: 4, nome: "Torquímetro Snap-on Digital 10-200Nm", categoria: "Medição", total: 4, disponivel: 4 },
    { id: 5, nome: "Parafusadeira de Impacto Bosch 18V", categoria: "Elétricas", total: 8, disponivel: 8 }
  ]);

  const [ativosEmCustodiaTSEA, setAtivosEmCustodiaTSEA] = useState([]);
  const [ultimasRetiradas, setUltimasRetiradas] = useState([]);
  const [ultimasDevolucoes, setUltimasDevolucoes] = useState([]);
  const [devolucoesPendentes, setDevolucoesPendentes] = useState([]);
  const [pedidoAtivo, setPedidoAtivo] = useState(null);

  const [listaFuncionariosTSEA, setListaFuncionariosTSEA] = useState([
    { nome: "Carlos Eduardo Santos", matricula: "RE-40922", perfil: "Funcionário" },
    { nome: "Almoxarife Sergio", matricula: "ID-1002", perfil: "Almoxarife" }
  ]);

  const entrarComoAlmoxarife = () => {
    if (idAlmoxarife === 'admin' && senhaLoginAlmoxarife === '1234') {
      setPerfilLogado('adm'); setLogado(true);
    } else { alert("ID ou Senha de Almoxarife inválidos!"); }
  };

  const entrarComoSuperAdmin = () => {
    if (senhaSuperAdmin === 'adminadmin') {
      setPerfilLogado('superadmin'); setLogado(true);
    } else { alert("Chave mestre inválida!"); }
  };

  const alterarQuantidadeCarrinho = (nome, acao) => {
    const itemEstoque = catalogoFerramentas.find(f => f.nome === nome);
    const itemCarrinho = carrinho.find(c => c.nome === nome);

    if (acao === 'somar') {
      if (itemCarrinho && itemCarrinho.qtd >= itemEstoque.disponivel) {
        alert("Quantidade máxima disponível em estoque atingida!");
        return;
      }
      itemCarrinho 
        ? setCarrinho(carrinho.map(c => c.nome === nome ? {...c, qtd: c.qtd + 1} : c)) 
        : setCarrinho([...carrinho, { nome, qtd: 1 }]);
    } else {
      if (!itemCarrinho) return;
      itemCarrinho.qtd === 1 
        ? setCarrinho(carrinho.filter(c => c.nome !== nome)) 
        : setCarrinho(carrinho.map(c => c.nome === nome ? {...c, qtd: c.qtd - 1} : c));
    }
  };

  const emitirLotePeloAlmoxarife = (matricula) => {
    if (senhaAlmoxarife !== '9999') {
      alert("Código do Almoxarife incorreto!");
      return;
    }
    const func = listaFuncionariosTSEA.find(f => f.matricula === matricula);
    const novoChamado = {
      idPedido: Math.floor(100000 + Math.random() * 900000),
      funcionario: func.nome,
      badge: func.matricula,
      timestamp: new Date().toLocaleString(),
      status: "Aguardando RFID",
      itens: carrinho.map(c => `${c.nome} (${c.qtd}x)`),
      itensPuros: carrinho
    };
    setPedidoAtivo(novoChamado);
    setSenhaAlmoxarife('');
    alert("Lote assinado! Peça ao operador para passar o cartão no Totem.");
  };

  const confirmarRetiradaComCartao = () => {
    const dataAtual = new Date().toLocaleString();
    
    setCatalogoFerramentas(prevEstoque => prevEstoque.map(ferr => {
      const correspondente = pedidoAtivo.itensPuros.find(c => c.nome === ferr.nome);
      return correspondente ? { ...ferr, disponivel: ferr.disponivel - correspondente.qtd } : ferr;
    }));

    pedidoAtivo.itensPuros.forEach(item => {
      const registro = { 
        funcionario: pedidoAtivo.funcionario, 
        matricula: pedidoAtivo.badge, 
        ferramenta: item.nome, 
        qtd: item.qtd, 
        data: dataAtual, 
        status: "EM CUSTÓDIA" 
      };
      setAtivosEmCustodiaTSEA(prev => [registro, ...prev]);
      setUltimasRetiradas(prev => [registro, ...prev]);
    });

    setPedidoAtivo(null);
    setCarrinho([]);
    alert("Crachá reconhecido! Ferramentas vinculadas à sua RE e estoque atualizado!");
  };

  const solicitarDevolucaoImediata = (item) => {
    setAtivosEmCustodiaTSEA(ativosEmCustodiaTSEA.map(a => (a.matricula === item.matricula && a.ferramenta === item.ferramenta && a.status === "EM CUSTÓDIA") ? { ...a, status: "AGUARDANDO BAIXA" } : a));
    setDevolucoesPendentes([...devolucoesPendentes, { id: Date.now(), ...item }]);
    alert("Item colocado na esteira de devolução. Entregue a ferramenta no balcão.");
  };

  const aprovarBaixaDevolucao = (idDevolucao, funcNome, ferramentaNome) => {
    if(senhaAlmoxarifeDevolucao === '9999') {
      const dev = devolucoesPendentes.find(d => d.id === idDevolucao);
      setDevolucoesPendentes(devolucoesPendentes.filter(d => d.id !== idDevolucao));
      setAtivosEmCustodiaTSEA(ativosEmCustodiaTSEA.map(a => (a.funcionario === funcNome && a.ferramenta === ferramentaNome && a.status === "AGUARDANDO BAIXA") ? { ...a, status: "DEVOLVIDO" } : a));
      
      setCatalogoFerramentas(catalogoFerramentas.map(f => f.nome === ferramentaNome ? { ...f, disponivel: f.disponivel + dev.qtd } : f));
      setUltimasDevolucoes([{ funcionario: funcNome, matricula: dev.matricula, ferramenta: ferramentaNome, qtd: dev.qtd, dataDevolucao: new Date().toLocaleString() }, ...ultimasDevolucoes]);
      setSenhaAlmoxarifeDevolucao('');
      alert("Retorno processado! Estoque atualizado nas três frentes.");
    } else { alert("Senha do conferente incorreta!"); }
  };

  const cadastrarNovoUsuario = (u) => setListaFuncionariosTSEA([...listaFuncionariosTSEA, u]);

  return (
    <div>
      <style>{`
        .layout-container { display: flex; min-height: 100vh; font-family: sans-serif; }
        .sidebar { width: 260px; background-color: ${TSEA.preto}; color: white; padding: 25px 15px; display: flex; flex-direction: column; justify-content: space-between; }
        .content-main { flex: 1; padding: 30px; background-color: #f4f6f9; }
        .btn-sidebar { cursor: pointer; display: flex; align-items: center; margin-bottom: 5px; background: transparent; color: white; border: none; padding: 12px; text-align: left; width: 100%; font-weight: bold; border-radius: 4px; }
        .btn-sidebar:hover { background-color: rgba(255,255,255,0.1); }
        .grid-catalogo { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; margin-top: 10px; }
        .card-ferramenta { background: white; border: 1px solid ${TSEA.cinzaMedio}; border-radius: 6px; padding: 12px; display: flex; flex-direction: column; justify-content: space-between; }
        .badge-categoria { font-size: 9px; text-transform: uppercase; background: ${TSEA.cinzaClaro}; padding: 2px 5px; border-radius: 4px; font-weight: bold; width: max-content; }
        .ficha-dados { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
        .ficha-item strong { display: block; font-size: 12px; color: #666; }
        .ficha-item span { font-size: 14px; font-weight: bold; }
        @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
      `}</style>

      {!logado ? (
        <Login 
          TSEA={TSEA} perfil={perfil} setPerfil={setPerfil} statusBiometria={statusBiometria} setStatusBiometria={setStatusBiometria} videoRef={videoRef} 
          progressoEscaneamento={progressoEscaneamento} setProgressoEscaneamento={setProgressoEscaneamento}
          entrarNoPainelManualmente={() => { setPerfilLogado('func'); setLogado(true); }}
          idAlmoxarife={idAlmoxarife} setIdAlmoxarife={setIdAlmoxarife}
          senhaLoginAlmoxarife={senhaLoginAlmoxarife} setSenhaLoginAlmoxarife={setSenhaLoginAlmoxarife} entrarComoAlmoxarife={entrarComoAlmoxarife} 
          senhaSuperAdmin={senhaSuperAdmin} setSenhaSuperAdmin={setSenhaSuperAdmin} entrarComoSuperAdmin={entrarComoSuperAdmin}
        />
      ) : perfilLogado === 'func' ? (
        <PainelOperador 
          TSEA={TSEA} abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} operador={operador} 
          ativosEmCustodiaTSEA={ativosEmCustodiaTSEA} solicitarDevolucaoImediata={solicitarDevolucaoImediata} 
          pedidoAtivo={pedidoAtivo} confirmarRetiradaComCartao={confirmarRetiradaComCartao} 
          logout={() => { setLogado(false); setPerfil(null); setStatusBiometria('desligado'); setProgressoEscaneamento(0); }}
        />
      ) : perfilLogado === 'adm' ? (
        <PainelAlmoxarife 
          TSEA={TSEA} abaAtivaAdm={abaAtivaAdm} setAbaAtivaAdm={setAbaAtivaAdm} pedidoAtivo={pedidoAtivo} senhaAlmoxarife={senhaAlmoxarife} 
          setSenhaAlmoxarife={setSenhaAlmoxarife} devolucoesPendentes={devolucoesPendentes} senhaAlmoxarifeDevolucao={senhaAlmoxarifeDevolucao} 
          setSenhaAlmoxarifeDevolucao={setSenhaAlmoxarifeDevolucao} aprovarBaixaDevolucao={aprovarBaixaDevolucao} 
          ativosEmCustodiaTSEA={ativosEmCustodiaTSEA} catalogoFerramentas={catalogoFerramentas} listaFuncionariosTSEA={listaFuncionariosTSEA} 
          carrinho={carrinho} alterarQuantidadeCarrinho={alterarQuantidadeCarrinho} emitirLotePeloAlmoxarife={emitirLotePeloAlmoxarife}
          ultimasRetiradas={ultimasRetiradas} ultimasDevolucoes={ultimasDevolucoes} 
          logout={() => { setLogado(false); setPerfil(null); setCarrinho([]); }}
        />
      ) : perfilLogado === 'superadmin' ? (
        <PainelMaster 
          TSEA={TSEA} abaAtivaSuper={abaAtivaSuper} setAbaAtivaSuper={setAbaAtivaSuper} ativosEmCustodiaTSEA={ativosEmCustodiaTSEA} 
          catalogoFerramentas={catalogoFerramentas} listaFuncionariosTSEA={listaFuncionariosTSEA} cadastrarNovoUsuario={cadastrarNovoUsuario} 
          logout={() => { setLogado(false); setPerfil(null); }}
        />
      ) : null}
    </div>
  );
}

export default App;