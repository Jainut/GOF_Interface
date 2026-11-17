import { useEffect } from 'react';
import PainelOperador from '../components/PainelOperador';
import { demoEnabled } from '../demo/demoApi';
import { useAppData } from '../hooks/useAppData';
import { useAuth } from '../hooks/useAuth';
import { GOF_PROJECT } from '../utils/theme';

export default function OperadorPage() {
  const { logout } = useAuth();
  const {
    abaAtiva,
    setAbaAtiva,
    operador,
    ativosEmCustodiaGofProject,
    carregarDadosProtegidos,
    limparSessaoVisual
  } = useAppData();
  useEffect(() => {
    if (demoEnabled) carregarDadosProtegidos();
  }, [carregarDadosProtegidos]);

  const sair = () => {
    limparSessaoVisual();
    logout();
  };

  return (
    <PainelOperador
      GOF_PROJECT={GOF_PROJECT}
      abaAtiva={abaAtiva}
      setAbaAtiva={setAbaAtiva}
      operador={operador}
      ativosEmCustodiaGofProject={ativosEmCustodiaGofProject}
      logout={sair}
    />
  );
}
