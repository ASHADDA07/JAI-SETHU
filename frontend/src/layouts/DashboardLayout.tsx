import { useState, type ReactNode } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
// 1. Redux Imports (Replacing useUser)
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../redux/userSlice';
import type { RootState } from '../redux/store';

import { useLanguage } from '../context/LanguageContext';
import { 
  LogOut, LayoutDashboard, FileText, Scale, 
  MessageSquare, ShieldAlert, BookOpen, Users,
  Menu, PanelLeftClose, Briefcase, Home, User, Settings, ChevronDown, Globe 
} from 'lucide-react';

interface LayoutProps {
  children?: ReactNode; // Made optional to prevent strict errors
}

export const DashboardLayout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // 2. Get Global Data from Redux & Language Context
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { lang, toggleLanguage, t } = useLanguage();

  // 3. Local UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // 4. Handle Logout (Redux Version)
  const handleLogout = () => {
    dispatch(signOut());
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  // 5. Determine Role & Menu
  // Default to 'public' if no user is logged in
  const role = currentUser?.role?.toLowerCase() || 'public';

  const menus: Record<string, any[]> = {
    lawyer: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/lawyer' },
      { icon: Users, label: 'Client Intake', path: '/lawyer/intake' },
      { icon: Briefcase, label: 'Associate Team', path: '/lawyer/associates' },
      { icon: FileText, label: 'Legal Drafter', path: '/lawyer/draft' },
      { icon: MessageSquare, label: 'Messages', path: '/lawyer/messages' },
      { icon: User, label: 'My Profile', path: '/lawyer/profile' },
    ],
    student: [
      { icon: BookOpen, label: 'Study Workspace', path: '/student' },
      { icon: FileText, label: 'Draft Practice', path: '/student/practice' },
      { icon: FileText, label: 'My Notes', path: '/student/notes' },
      { icon: User, label: 'My Profile', path: '/student/profile' },
    ],
    public: [
      { icon: Home, label: 'Home', path: '/public' },
      { icon: Users, label: 'Find Lawyer', path: '/public/connect' },
      { icon: ShieldAlert, label: 'Evidence Vault', path: '/public/vault' },
      { icon: BookOpen, label: 'AI Consultant', path: '/public/ai' },
      { icon: MessageSquare, label: 'Messages', path: '/public/messages' },
      { icon: User, label: 'My Profile', path: '/public/profile' },
    ],
    admin: [ { icon: ShieldAlert, label: 'Approvals', path: '/admin' } ],
    founder: [ { icon: LayoutDashboard, label: 'Overview', path: '/founder' } ]
  };
  
  const currentMenu = menus[role] || menus['public'];

  // Safety Variables
  const userName = currentUser?.fullName || 'User';
  const userEmail = currentUser?.email || '';
  const userAvatar = currentUser?.avatar || '';
  const hasImageAvatar = userAvatar.length > 5;

  return (
    <div className="flex h-screen bg-[#F3F4F6] text-gray-900 overflow-hidden font-sans">
      
      {/* --- SIDEBAR (Dark Theme Restored) --- */}
      <aside 
        className={`
          bg-[#1a1a1a] text-white flex flex-col shadow-2xl z-20 
          transition-all duration-300 ease-in-out border-r border-white/10
          ${isSidebarOpen ? 'w-64 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-full overflow-hidden'}
        `}
      >
        {/* Logo Area */}
        <div className="p-6 flex items-center gap-3 border-b border-white/10 min-w-[250px]">
          <Scale className="w-8 h-8 text-[#D4AF37]" /> {/* Judicial Gold */}
          <div>
            <h1 className="font-serif font-bold text-lg tracking-wide text-white">J.A.I-S.E.T.H.U</h1>
            <p className="text-[10px] uppercase text-[#D4AF37] tracking-widest">{role} PORTAL</p>
          </div>
        </div>

        {/* Menu Links */}
        <nav className="flex-1 p-4 space-y-2 min-w-[250px] overflow-y-auto">
          {currentMenu.map((item: any) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === `/` + role}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 border border-transparent whitespace-nowrap
                ${isActive 
                  ? 'bg-[#D4AF37] text-black font-bold shadow-lg' 
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 min-w-[250px] space-y-3">
          <button 
            onClick={toggleLanguage}
            className="w-full py-2.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-xs font-bold text-[#D4AF37] hover:bg-[#D4AF37]/20 flex items-center justify-center gap-2 transition-colors"
          >
             <Globe size={14} />
             {lang === 'en' ? 'తెలుగులో చూడండి' : 'Switch to English'}
          </button>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-400 hover:bg-red-900/10 rounded-lg transition-colors whitespace-nowrap"
          >
            <LogOut className="w-5 h-5" />
            <span>{t('sign_out')}</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F3F4F6] transition-all duration-300">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm relative">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 mr-4 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {isSidebarOpen ? <PanelLeftClose size={24} /> : <Menu size={24} />}
            </button>
            <h2 className="font-serif text-xl font-bold text-gray-900 capitalize hidden sm:block">
              {role} Workspace
            </h2>
          </div>
          
          <div className="relative">
             <button 
               onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
               className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-xl transition-colors focus:outline-none"
             >
                <div className="text-right hidden md:block">
                   <p className="text-sm font-bold text-gray-900 leading-none">{userName}</p>
                   <p className="text-[10px] text-gray-500 font-bold tracking-wide uppercase mt-1">{role} Account</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-serif font-bold shadow-md overflow-hidden border border-gray-200">
                   {hasImageAvatar ? (
                     <img src={userAvatar} className="w-full h-full object-cover" alt="Profile" />
                   ) : (
                     userAvatar || userName.charAt(0)
                   )}
                </div>
                <ChevronDown size={14} className="text-gray-400"/>
             </button>

             {/* Dropdown Menu */}
             {isProfileMenuOpen && (
               <>
                 <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)}></div>
                 <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 z-50">
                    <div className="p-4 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-serif font-bold overflow-hidden">
                          {hasImageAvatar ? (
                            <img src={userAvatar} className="w-full h-full object-cover" alt="Profile" />
                          ) : (
                            userAvatar || userName.charAt(0)
                          )}
                       </div>
                       <div className="overflow-hidden">
                          <p className="text-sm font-bold text-gray-900 truncate">{userName}</p>
                          <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                       </div>
                    </div>
                    <div className="p-2">
                       <button 
                         onClick={() => { navigate(`/${role}/profile`); setIsProfileMenuOpen(false); }} 
                         className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                       >
                          <User size={16}/> My Profile
                       </button>
                       <button 
                         onClick={() => { navigate(`/${role}/profile`); setIsProfileMenuOpen(false); }} 
                         className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                       >
                          <Settings size={16}/> Settings
                       </button>
                    </div>
                    <div className="p-2 border-t border-gray-100">
                       <button 
                         onClick={handleLogout} 
                         className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors font-bold"
                       >
                          <LogOut size={16}/> {t('sign_out')}
                       </button>
                    </div>
                 </div>
               </>
             )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};