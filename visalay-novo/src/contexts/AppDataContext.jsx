import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { apiRequest, readJson } from '../services/api';
import socket from '../services/socket';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const [perfil, setPerfil] = useState(null);

  const [operador] = useState({
    nome: 'Carlos Eduardo Santos',
    matricula: 'RE-40922',
    setor: 'Bobinagem de Transformadores',
    cargo: 'Técnico de Isolamento Especializado',
    empresa: 'TSEA Energia S.A.',
    status: 'Ativo Operacional'
  });

  const [abaAtiva, setAbaAtiva] = useState('custodia');
  const [abaAtivaAdm, setAbaAtivaAdm] = useState('solicitar_emprestimo');
  const [abaAtivaSuper, setAbaAtivaSuper] = useState('dashboard');

  const [statusBiometria, setStatusBiometria] = useState('desligado');
  const [progressoEscaneamento, setProgressoEscaneamento] = useState(0);
  const videoRef = useRef(null);

  const [idAlmoxarife, setIdAlmoxarife] = useState('');
  const [senhaLoginAlmoxarife, setSenhaLoginAlmoxarife] = useState('');
  const [cpfSuperAdmin, setCpfSuperAdmin] = useState('');
  const [senhaSuperAdmin, setSenhaSuperAdmin] = useState('');

  const [nfcLiberado, setNfcLiberado] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [operadorNFC, setOperadorNFC] = useState(null);
  const [mensagemSistema, setMensagemSistema] = useState(null);

  const [catalogoFerramentas, setCatalogoFerramentas] = useState([]);
  const [ativosEmCustodiaTSEA, setAtivosEmCustodiaTSEA] = useState([]);
  const [ultimasRetiradas, setUltimasRetiradas] = useState([]);
  const [ultimasDevolucoes, setUltimasDevolucoes] = useState([]);
  const [emprestimosOperador, setEmprestimosOperador] = useState([]);

  const carregarFerramentas = useCallback(async () => {
    try {
      const res = await apiRequest('/listar/Ferramentas');
      const data = await readJson(res);
      if (res.ok && Array.isArray(data)) {
        setCatalogoFerramentas(data.map(f => ({
          id: f.id,
          nome: f.tipo,
          categoria: f.categoria ?? 'Geral',
          total: f.ferramenta_estoque?.[0]?.quantidade ?? 0,
          disponivel: f.ferramenta_estoque?.[0]?.quantidade ?? 0
        })));
      }
    } catch (e) {
      console.error('Erro ao carregar ferramentas:', e);
    }
  }, []);

  const carregarAtivos = useCallback(async () => {
    try {
      const res = await apiRequest('/listar/Ativos');
      const data = await readJson(res);
      if (res.ok && Array.isArray(data)) {
        setAtivosEmCustodiaTSEA(data.flatMap(emp =>
          emp.item_emprestimo.map(item => ({
            emprestimo_id: emp.id,
            funcionario: emp.usuario.nome,
            matricula: emp.usuario.cpf,
            setor: emp.usuario.setor ?? emp.usuario.setor_usuario ?? emp.usuario.departamento ?? emp.setor ?? 'Sem setor',
            ferramenta: item.ferramenta.tipo,
            ferramenta_id: item.ferramenta_id,
            qtd: item.quantidade,
            data: new Date(emp.data_retirada).toLocaleString('pt-BR'),
            status: 'EM CUSTÓDIA'
          }))
        ));
      }
    } catch (e) {
      console.error('Erro ao carregar ativos:', e);
    }
  }, []);

  const carregarEmprestimos = useCallback(async () => {
    try {
      const res = await apiRequest('/listar/Emprestimos');
      const data = await readJson(res);
      if (res.ok && Array.isArray(data)) {
        const retiradas = data.flatMap(emp => {
          const timestamp = new Date(emp.data_retirada).getTime();
          return emp.ferramentas.map(f => ({
            emprestimo_id: emp.emprestimo_id,
            funcionario: emp.usuario.nome_usuario,
            matricula: emp.usuario.setor_usuario,
            ferramenta: f.tipo_ferramenta,
            ferramenta_id: f.ferramenta_id,
            qtd: f.quantidade,
            data: new Date(emp.data_retirada).toLocaleString('pt-BR'),
            timestamp,
            status: emp.ferramenta_status === 'Emprestado' ? 'EM CUSTÓDIA' : 'DEVOLVIDO'
          }));
        });
        setUltimasRetiradas(retiradas.sort((a, b) => b.timestamp - a.timestamp));
      }
    } catch (e) {
      console.error('Erro ao carregar empréstimos:', e);
    }
  }, []);

  const carregarDevolucoes = useCallback(async () => {
    try {
      const res = await apiRequest('/listar/Devolucoes');
      const data = await readJson(res);
      if (res.ok && Array.isArray(data)) {
        setUltimasDevolucoes(data.map(d => ({
          id: d.devolucao_id,
          funcionario: d.nome_usuario,
          matricula: d.setor_usuario,
          ferramenta: d.tipo_ferramenta,
          qtd: 1,
          dataDevolucao: new Date(d.data_devolucao).toLocaleString('pt-BR'),
          timestamp: new Date(d.data_devolucao).getTime(),
          status: d.status
        })).sort((a, b) => b.timestamp - a.timestamp));
      } else if (!res.ok) {
        console.error('A API retornou erro ao carregar devoluções:', data);
      }
    } catch (e) {
      console.error('Erro ao carregar devoluções:', e);
    }
  }, []);

  const carregarEmprestimosDoOperador = useCallback(async (cpf) => {
    try {
      const res = await apiRequest('/listar/Ativos');
      const data = await readJson(res);
      if (res.ok && Array.isArray(data)) {
        const doOperador = data
          .filter(emp => emp.usuario?.cpf === cpf)
          .flatMap(emp =>
            emp.item_emprestimo.map(item => ({
              emprestimo_id: emp.id,
              ferramenta: item.ferramenta.tipo,
              ferramenta_id: item.ferramenta_id,
              qtd: item.quantidade,
              data: new Date(emp.data_retirada).toLocaleString('pt-BR')
            }))
          );
        setEmprestimosOperador(doOperador);
      }
    } catch (e) {
      console.error('Erro ao carregar empréstimos do operador:', e);
    }
  }, []);

  const carregarDadosProtegidos = useCallback(() => {
    carregarFerramentas();
    carregarAtivos();
    carregarEmprestimos();
    carregarDevolucoes();
  }, [carregarAtivos, carregarDevolucoes, carregarEmprestimos, carregarFerramentas]);

  const registrarEmprestimoNFC = useCallback(async (itensCarrinho) => {
    if (!operadorNFC) {
      setMensagemSistema({ tipo: 'erro', texto: 'Nenhum operador identificado pelo NFC.' });
      return;
    }
    if (!itensCarrinho?.length) {
      setMensagemSistema({ tipo: 'aviso', texto: 'Nenhuma ferramenta selecionada.' });
      return;
    }

    try {
      const res = await apiRequest('/registrar/Emprestimo', {
        method: 'POST',
        body: JSON.stringify({
          user_cpf: operadorNFC.cpf,
          ferramentas: itensCarrinho.map(i => ({
            ferramenta_id: i.id,
            quantidade: i.quantidade || i.qtd || 1
          }))
        })
      });

      if (res.ok) {
        setMensagemSistema({ tipo: 'sucesso', texto: 'Empréstimo registrado com sucesso!' });
        carregarAtivos();
        carregarEmprestimos();
        setNfcLiberado(false);
        setOperadorNFC(null);
        setTempoRestante(0);
        setEmprestimosOperador([]);
      } else {
        const erroData = await readJson(res);
        setMensagemSistema({ tipo: 'erro', texto: erroData?.message || 'Erro ao registrar empréstimo no servidor.' });
      }
    } catch (erro) {
      console.error('Erro ao realizar empréstimo:', erro);
      setMensagemSistema({ tipo: 'erro', texto: 'Falha de comunicação com o servidor.' });
    }
  }, [carregarAtivos, carregarEmprestimos, operadorNFC]);

  const devolverFerramenta = useCallback(async (emprestimoId) => {
    try {
      const res = await apiRequest('/registrar/Devolucao', {
        method: 'POST',
        body: JSON.stringify({
          emprestimo_id: emprestimoId,
          user_cpf: operadorNFC.cpf
        })
      });
      const data = await readJson(res);

      if (res.ok) {
        setEmprestimosOperador(prev => prev.filter(e => e.emprestimo_id !== emprestimoId));
        setMensagemSistema({ tipo: 'sucesso', texto: 'Devolução registrada com sucesso.' });
        carregarAtivos();
        carregarDevolucoes();
        carregarFerramentas();
      } else {
        setMensagemSistema({ tipo: 'erro', texto: data?.message ?? 'Erro ao registrar devolução.' });
      }
    } catch (e) {
      console.error('Erro ao devolver ferramenta:', e);
      setMensagemSistema({ tipo: 'erro', texto: 'Erro de conexão ao registrar devolução.' });
    }
  }, [carregarAtivos, carregarDevolucoes, carregarFerramentas, operadorNFC]);

  const cancelarAcessoNFC = useCallback(() => {
    setNfcLiberado(false);
    setOperadorNFC(null);
    setEmprestimosOperador([]);
    setMensagemSistema({ tipo: 'aviso', texto: 'Acesso do operador encerrado.' });
  }, []);

  const limparSessaoVisual = useCallback(() => {
    setPerfil(null);
    setIdAlmoxarife('');
    setSenhaLoginAlmoxarife('');
    setCpfSuperAdmin('');
    setSenhaSuperAdmin('');
    setStatusBiometria('desligado');
    setProgressoEscaneamento(0);
    setNfcLiberado(false);
    setOperadorNFC(null);
    setEmprestimosOperador([]);
    setMensagemSistema(null);
  }, []);

  useEffect(() => {
    const handleNfcAuth = (payload) => {
      if (!payload?.operador) {
        setMensagemSistema({ tipo: 'erro', texto: 'Cartão NFC não reconhecido no sistema.' });
        return;
      }

      const op = {
        nome: payload.operador.nome,
        cpf: payload.operador.cpf,
        setor: payload.operador.setor
      };
      setOperadorNFC(op);
      setNfcLiberado(true);
      setTempoRestante(10 * 60);
      setAbaAtivaAdm('solicitar_emprestimo');
      carregarEmprestimosDoOperador(op.cpf);
    };

    socket.on('nfcAuth', handleNfcAuth);
    return () => socket.off('nfcAuth');
  }, [carregarEmprestimosDoOperador]);

  useEffect(() => {
    if (!nfcLiberado) return undefined;
    const intervalo = setInterval(() => {
      setTempoRestante(prev => {
        if (prev <= 1) {
          clearInterval(intervalo);
          setNfcLiberado(false);
          setOperadorNFC(null);
          setEmprestimosOperador([]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalo);
  }, [nfcLiberado]);

  const value = useMemo(() => ({
    perfil,
    setPerfil,
    operador,
    abaAtiva,
    setAbaAtiva,
    abaAtivaAdm,
    setAbaAtivaAdm,
    abaAtivaSuper,
    setAbaAtivaSuper,
    statusBiometria,
    setStatusBiometria,
    progressoEscaneamento,
    setProgressoEscaneamento,
    videoRef,
    idAlmoxarife,
    setIdAlmoxarife,
    senhaLoginAlmoxarife,
    setSenhaLoginAlmoxarife,
    cpfSuperAdmin,
    setCpfSuperAdmin,
    senhaSuperAdmin,
    setSenhaSuperAdmin,
    nfcLiberado,
    tempoRestante,
    operadorNFC,
    mensagemSistema,
    setMensagemSistema,
    catalogoFerramentas,
    ativosEmCustodiaTSEA,
    ultimasRetiradas,
    ultimasDevolucoes,
    emprestimosOperador,
    carregarDadosProtegidos,
    registrarEmprestimoNFC,
    devolverFerramenta,
    cancelarAcessoNFC,
    limparSessaoVisual
  }), [
    abaAtiva,
    abaAtivaAdm,
    abaAtivaSuper,
    ativosEmCustodiaTSEA,
    cancelarAcessoNFC,
    carregarDadosProtegidos,
    catalogoFerramentas,
    cpfSuperAdmin,
    devolverFerramenta,
    emprestimosOperador,
    idAlmoxarife,
    limparSessaoVisual,
    mensagemSistema,
    nfcLiberado,
    operador,
    operadorNFC,
    perfil,
    progressoEscaneamento,
    registrarEmprestimoNFC,
    senhaLoginAlmoxarife,
    senhaSuperAdmin,
    statusBiometria,
    tempoRestante,
    ultimasDevolucoes,
    ultimasRetiradas
  ]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData deve ser usado dentro de AppDataProvider.');
  }
  return context;
}
