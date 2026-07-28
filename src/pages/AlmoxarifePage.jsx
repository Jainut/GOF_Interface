import { useEffect } from 'react';
import PainelAlmoxarife from '../components/PainelAlmoxarife';
import { useAppData } from '../hooks/useAppData';
import { useAuth } from '../hooks/useAuth';
import { GOF_PROJECT } from '../utils/theme';

export default function AlmoxarifePage() {
  const { logout, usuarioLogado } = useAuth();
  const {
    nfcLiberado,
    tempoRestante,
    operadorNFC,
    registrarEmprestimoNFC,
    devolverFerramenta,
    cancelarAcessoNFC,
    emprestimosOperador,
    mensagemSistema,
    setMensagemSistema,
    abaAtivaAdm,
    setAbaAtivaAdm,
    ativosEmCustodiaGofProject,
    catalogoFerramentas,
    ultimasRetiradas,
    ultimasDevolucoes,
    carregarDadosProtegidos,
    limparSessaoVisual
  } = useAppData();

  useEffect(() => {
    carregarDadosProtegidos();
  }, [carregarDadosProtegidos]);

  const sair = () => {
    limparSessaoVisual();
    logout();
  };

  return (
    <PainelAlmoxarife
      GOF_PROJECT={GOF_PROJECT}
      nfcLiberado={nfcLiberado}
      tempoRestante={tempoRestante}
      operadorNFC={operadorNFC}
      registrarEmprestimoNFC={registrarEmprestimoNFC}
      devolverFerramenta={devolverFerramenta}
      cancelarAcessoNFC={cancelarAcessoNFC}
      emprestimosOperador={emprestimosOperador}
      mensagemSistema={mensagemSistema}
      setMensagemSistema={setMensagemSistema}
      abaAtivaAdm={abaAtivaAdm}
      setAbaAtivaAdm={setAbaAtivaAdm}
      ativosEmCustodiaGofProject={ativosEmCustodiaGofProject}
      catalogoFerramentas={catalogoFerramentas}
      ultimasRetiradas={ultimasRetiradas}
      ultimasDevolucoes={ultimasDevolucoes}
      usuarioLogado={usuarioLogado}
      logout={sair}
    />
  );
}
