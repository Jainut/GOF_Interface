import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ allowedProfiles }) {
  const { perfilLogado } = useAuth();

  if (!perfilLogado) {
    return <Navigate to="/login" replace />;
  }

  if (allowedProfiles?.length && !allowedProfiles.includes(perfilLogado)) {
    const fallback = {
      func: '/operador',
      adm: '/almoxarife',
      superadmin: '/master'
    }[perfilLogado] ?? '/login';

    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
