import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon } from 'lucide-react';
import { signOut } from '../redux/userSlice';
import type { RootState } from '../redux/store'; // Note the 'type' import here too!

export default function Topbar({ title }: { title: string }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get current user from Redux
  const { currentUser } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    // 1. Clear Redux State
    dispatch(signOut());
    // 2. Clear Session Storage
    sessionStorage.removeItem('token');
    // 3. Redirect to Login
    navigate('/login');
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* Title */}
      <h2 className="text-xl font-bold text-judicial-black font-serif">{title}</h2>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-judicial-gold/20 rounded-full flex items-center justify-center text-judicial-black font-bold">
            {currentUser?.fullName ? currentUser.fullName[0].toUpperCase() : <UserIcon size={16}/>}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden md:block">
            {currentUser?.fullName || 'Guest'}
          </span>
        </div>

        <button 
          onClick={handleLogout}
          className="p-2 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-lg transition-colors"
          title="Sign Out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}