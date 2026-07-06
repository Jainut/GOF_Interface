import PainelOperador from '../components/PainelOperador';
import { useAppData } from '../hooks/useAppData';
import { useAuth } from '../hooks/useAuth';
import { TSEA } from '../utils/theme';

export default function OperadorPage() {
  const { logout } = useAuth();
  const {
    abaAtiva,
    setAbaAtiva,
    operador,
    ativosEmCustodiaTSEA,
    limparSessaoVisual
  } = useAppData();

  const sair = () => {
    limparSessaoVisual();
    logout();
  };

  return (
    <PainelOperador
      TSEA={TSEA}
      abaAtiva={abaAtiva}
      setAbaAtiva={setAbaAtiva}
      operador={operador}
      ativosEmCustodiaTSEA={ativosEmCustodiaTSEA}
      logout={sair}
    />
  );
}
