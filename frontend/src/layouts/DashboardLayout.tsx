import { useState, type ReactNode } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Redux Imports
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../redux/userSlice';
import type { RootState } from '../redux/store';

import { useLanguage } from '../context/LanguageContext';
import { 
  LogOut, LayoutDashboard, FileText, Scale, 
  MessageSquare, ShieldAlert, BookOpen, Users,
  Menu, X, Briefcase, Home, User, Settings, 
  ChevronDown, Globe, Search, Bell
} from 'lucide-react';

interface LayoutProps {
  children?: ReactNode; 
}

export const DashboardLayout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get Global Data
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { lang, toggleLanguage, t } = useLanguage();

  // Local UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default closed on mobile, auto-opens via CSS on desktop
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Handle Logout
  const handleLogout = () => {
    dispatch(signOut());
    sessionStorage.removeItem('token');
    navigate('/login');
  };

  // Determine Role & Menu
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
      { icon: Users, label: 'Legal Network', path: '/student/network' },
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
  const userName = currentUser?.fullName || (currentUser as any)?.name || 'Advocate';
  const userEmail = currentUser?.email || '';
  const userAvatar = currentUser?.avatar || '';
  const hasImageAvatar = userAvatar.length > 5;

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-gray-900 overflow-hidden font-sans">
      
      {/* --- MOBILE SIDEBAR OVERLAY --- */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* --- SIDEBAR --- */}
      <aside 
        className={`
          fixed lg:static top-0 left-0 h-full bg-[#111111] text-gray-300 flex flex-col shadow-2xl z-40 
          transition-transform duration-300 ease-in-out border-r border-white/5 w-72 lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo Area */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center">
              <Scale className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl tracking-wide text-white leading-tight">JAI-SETHU</h1>
              <p className="text-[10px] font-bold uppercase text-[#D4AF37] tracking-widest">{role} Portal</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10">
            <X size={20} />
          </button>
        </div>

        {/* Menu Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          {currentMenu.map((item: any) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === `/${role}`}
              onClick={() => setIsSidebarOpen(false)} // Auto close on mobile click
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium whitespace-nowrap
                ${isActive 
                  ? 'bg-[#D4AF37] text-black font-bold shadow-lg shadow-[#D4AF37]/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 shrink-0 space-y-3 bg-[#0a0a0a]">
          <button 
            onClick={toggleLanguage}
            className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-gray-300 hover:bg-white/10 hover:text-white flex items-center justify-center gap-2 transition-all"
          >
            <Globe size={16} className={lang === 'te' ? 'text-[#D4AF37]' : ''} />
            {lang === 'en' ? 'తెలుగులో చూడండి' : 'Switch to English'}
          </button>

          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-3 w-full text-red-400 font-bold hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors whitespace-nowrap border border-transparent hover:border-red-500/20"
          >
            <LogOut className="w-5 h-5" />
            <span>{t('sign_out')}</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 flex flex-col min-w-0 w-full relative z-0">
        
        {/* --- PREMIUM TOP HEADER --- */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 z-40 shrink-0">
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Menu size={24} />
            </button>
            
            {/* Global Search Bar */}
            <div className="hidden md:flex relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search cases, clients, documents..." 
                className="pl-11 pr-4 py-3 w-80 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-6">
            
            {/* --- NOTIFICATION BELL & DROPDOWN --- */}
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors focus:outline-none"
              >
                <Bell size={22} />
                {/* The Red Dot only pulses if there are unread notifications */}
                <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              </button>

              {/* Notification Dropdown Panel */}
              <AnimatePresence>
                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 origin-top-right"
                    >
                      <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        <button className="text-xs font-bold text-[#D4AF37] hover:underline">Mark all read</button>
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto">
                        {/* Mock Notification 1 */}
                        <div className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors flex gap-4">
                          <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500 shrink-0"></div>
                          <div>
                            <p className="text-sm text-gray-900 font-medium leading-snug">New client inquiry from <span className="font-bold">Ramesh Patel</span>.</p>
                            <p className="text-xs text-gray-500 mt-1 font-bold">10 mins ago</p>
                          </div>
                        </div>

                        {/* Mock Notification 2 */}
                        <div className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors flex gap-4">
                          <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500 shrink-0"></div>
                          <div>
                            <p className="text-sm text-gray-900 font-medium leading-snug">Hearing reminder: <span className="font-bold">High Court Case #402</span> tomorrow at 10:30 AM.</p>
                            <p className="text-xs text-gray-500 mt-1 font-bold">2 hours ago</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
                        <button className="text-sm font-bold text-gray-600 hover:text-black transition-colors">View All Activity</button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
            
            {/* --- PROFILE DROPDOWN (Bulletproof Z-Index) --- */}
            <div className="relative z-50">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-3 p-1.5 sm:pr-4 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              >
                  <div className="w-10 h-10 rounded-full bg-black text-[#D4AF37] flex items-center justify-center font-serif font-bold text-lg shadow-sm border border-gray-200 overflow-hidden">
                    {hasImageAvatar ? (
                      <img src={userAvatar} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                      userName.charAt(0)
                    )}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-bold text-gray-900 leading-none">{userName}</p>
                    <p className="text-[10px] text-gray-500 font-bold tracking-wider uppercase mt-1">{role}</p>
                  </div>
                  <ChevronDown size={16} className={`text-gray-400 hidden sm:block transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`}/>
              </button>

              {/* Profile Dropdown Menu Card */}
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)}></div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 origin-top-right"
                    >
                        <div className="p-5 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-black text-[#D4AF37] flex items-center justify-center font-serif font-bold text-xl shrink-0 overflow-hidden shadow-inner">
                              {hasImageAvatar ? (
                                <img src={userAvatar} className="w-full h-full object-cover" alt="Profile" />
                              ) : (
                                userName.charAt(0)
                              )}
                          </div>
                          <div className="overflow-hidden">
                              <p className="text-base font-bold text-gray-900 truncate">{userName}</p>
                              <p className="text-xs text-gray-500 font-medium truncate mt-0.5">{userEmail}</p>
                          </div>
                        </div>

                        {/* Quick JAI-ID Display */}
                        <div className="px-5 py-3 bg-gray-50/50 border-b border-gray-100">
                           <div className="flex justify-between items-center bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                             <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">JAI-ID</span>
                             <span className="text-sm font-mono font-bold text-gray-900">{currentUser?.jaiId || 'PENDING'}</span>
                           </div>
                        </div>

                        <div className="p-2">
                          <button 
                            onClick={() => { navigate(`/${role}/profile`); setIsProfileMenuOpen(false); }} 
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors"
                          >
                              <User size={18} className="text-gray-400"/> View Full Profile
                          </button>
                          <button 
                            onClick={() => { navigate(`/${role}/profile`); setIsProfileMenuOpen(false); }} 
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors"
                          >
                              <Settings size={18} className="text-gray-400"/> Account Settings
                          </button>
                        </div>

                        <div className="p-2 border-t border-gray-100 bg-gray-50/50">
                          <button 
                            onClick={handleLogout} 
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-100 rounded-xl transition-colors font-bold"
                          >
                              <LogOut size={18} className="text-red-500"/> Sign Out
                          </button>
                        </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* --- DYNAMIC PAGE CONTENT --- */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-0">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};