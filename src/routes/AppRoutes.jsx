import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import AlmoxarifePage from '../pages/AlmoxarifePage';
import LoginPage from '../pages/LoginPage';
import MasterPage from '../pages/MasterPage';
import OperadorPage from '../pages/OperadorPage';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute allowedProfiles={['func']} />}>
          <Route path="/operador" element={<OperadorPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedProfiles={['adm']} />}>
          <Route path="/almoxarife" element={<AlmoxarifePage />} />
        </Route>
        <Route element={<ProtectedRoute allowedProfiles={['superadmin']} />}>
          <Route path="/master" element={<MasterPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  );
}
