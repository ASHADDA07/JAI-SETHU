import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store'; // Adjust path if needed

interface RoleProtectedRouteProps {
  allowedRoles: string[];
}

export default function RoleProtectedRoute({ allowedRoles }: RoleProtectedRouteProps) {
  const { currentUser, isAuthenticated } = useSelector((state: RootState) => state.user);

  // 1. If they aren't logged in at all, kick them to the login page
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 2. If they ARE logged in, but their role isn't allowed on this URL...
  const userRole = currentUser.role.toLowerCase();
  if (!allowedRoles.includes(userRole)) {
    // Redirect them to their own specific dashboard!
    return <Navigate to={`/${userRole}`} replace />;
  }

  // 3. If they pass the check, let them see the page
  return <Outlet />;
}