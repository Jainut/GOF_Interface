import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { apiRequest, clearStoredToken, readJson, setStoredToken } from '../services/api';
import { refreshSocketAuth } from '../services/socket';

const SESSION_KEY = 'tsea_session';
const AuthContext = createContext(null);

const readStoredSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) ?? { perfil: null };
  } catch {
    return { perfil: null };
  }
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);

  const persistSession = useCallback((nextSession) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  }, []);

  const loginOperador = useCallback(() => {
    persistSession({ perfil: 'func' });
  }, [persistSession]);

  const loginAlmoxarife = useCallback(async ({ cpf, senha }) => {
    const res = await apiRequest('/login/almoxarife', {
      method: 'POST',
      body: JSON.stringify({ cpf, senha })
    });
    const data = await readJson(res);

    if (!res.ok) {
      throw new Error(data?.message ?? 'Credenciais invalidas.');
    }

    if (data?.token) {
      setStoredToken(data.token);
      refreshSocketAuth();
    }
    persistSession({
      perfil: 'adm',
      usuario: data?.usuario?.nome ?? data?.nome ?? data?.user?.nome ?? 'Almoxarife'
    });
    return data;
  }, [persistSession]);

  const loginSuperAdmin = useCallback(async ({ cpf, senha }) => {
    const res = await apiRequest('/login/admin', {
      method: 'POST',
      body: JSON.stringify({ cpf, senha })
    });
    const data = await readJson(res);

    if (!res.ok) {
      throw new Error(data?.message ?? 'Credenciais invalidas.');
    }

    if (data?.token) {
      setStoredToken(data.token);
      refreshSocketAuth();
    }
    persistSession({
      perfil: 'superadmin',
      usuario: data?.usuario?.nome ?? data?.nome ?? data?.user?.nome ?? 'Administrador'
    });
    return data;
  }, [persistSession]);

  const logout = useCallback(() => {
    clearStoredToken();
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.clear();
    refreshSocketAuth();
    setSession({ perfil: null });
  }, []);

  const value = useMemo(() => ({
    perfilLogado: session.perfil,
    usuarioLogado: session.usuario ?? null,
    logado: Boolean(session.perfil),
    loginOperador,
    loginAlmoxarife,
    loginSuperAdmin,
    logout
  }), [loginAlmoxarife, loginOperador, loginSuperAdmin, logout, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }
  return context;
}
