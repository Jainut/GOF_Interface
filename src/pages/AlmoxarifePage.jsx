import { useEffect } from 'react';
import PainelAlmoxarife from '../components/PainelAlmoxarife';
import { useAppData } from '../hooks/useAppData';
import { useAuth } from '../hooks/useAuth';
import { TSEA } from '../utils/theme';

export default function AlmoxarifePage() {
  const { logout } = useAuth();
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
    ativosEmCustodiaTSEA,
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
      TSEA={TSEA}
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
      ativosEmCustodiaTSEA={ativosEmCustodiaTSEA}
      catalogoFerramentas={catalogoFerramentas}
      ultimasRetiradas={ultimasRetiradas}
      ultimasDevolucoes={ultimasDevolucoes}
      logout={sair}
    />
  );
}
