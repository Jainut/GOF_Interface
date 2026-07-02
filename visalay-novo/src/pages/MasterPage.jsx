import { useEffect } from 'react';
import PainelMaster from '../components/PainelMaster';
import { useAppData } from '../hooks/useAppData';
import { useAuth } from '../hooks/useAuth';

export default function MasterPage() {
  const { logout } = useAuth();
  const {
    abaAtivaSuper,
    setAbaAtivaSuper,
    ativosEmCustodiaTSEA,
    catalogoFerramentas,
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
      ativosEmCustodiaTSEA={ativosEmCustodiaTSEA}
      catalogoFerramentas={catalogoFerramentas}
      logout={sair}
    />
  );
}
