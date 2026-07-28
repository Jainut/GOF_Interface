import { useEffect } from 'react';
import PainelMaster from '../components/PainelMaster';
import { useAppData } from '../hooks/useAppData';
import { useAuth } from '../hooks/useAuth';

export default function MasterPage() {
  const { logout, usuarioLogado } = useAuth();
  const {
    abaAtivaSuper,
    setAbaAtivaSuper,
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
    <PainelMaster
      abaAtivaSuper={abaAtivaSuper}
      setAbaAtivaSuper={setAbaAtivaSuper}
      ativosEmCustodiaGofProject={ativosEmCustodiaGofProject}
      catalogoFerramentas={catalogoFerramentas}
      ultimasRetiradas={ultimasRetiradas}
      ultimasDevolucoes={ultimasDevolucoes}
      usuarioLogado={usuarioLogado}
      logout={sair}
    />
  );
}
