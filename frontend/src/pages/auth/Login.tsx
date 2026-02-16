import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../../redux/userSlice';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  GraduationCap, 
  Gavel, 
  ArrowRight, 
  Loader2, 
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { cn } from "@/lib/utils"; 

// --- 1. DESIGN TOKEN SYSTEM (The "Soul" of the UI) ---
const ROLES = {
  public: {
    id: 'public',
    label: 'Citizen',
    color: 'text-slate-900',
    accent: 'bg-slate-900 hover:bg-slate-800',
    subtle: 'bg-slate-100',
    border: 'border-slate-200',
    focus: 'focus:ring-slate-400',
    icon: Shield,
    headline: 'Grievance Portal',
    subhead: 'Securely file and track your cases.'
  },
  lawyer: {
    id: 'lawyer',
    label: 'Advocate',
    color: 'text-stone-900',
    accent: 'bg-[#D4AF37] hover:bg-[#C5A028]', // Official Legal Gold
    subtle: 'bg-stone-50',
    border: 'border-[#D4AF37]/30',
    focus: 'focus:ring-[#D4AF37]',
    icon: Gavel,
    headline: 'Bar Council Login',
    subhead: 'Practice management & evidence verification.'
  },
  student: {
    id: 'student',
    label: 'Student',
    color: 'text-teal-900',
    accent: 'bg-teal-700 hover:bg-teal-600',
    subtle: 'bg-teal-50',
    border: 'border-teal-200',
    focus: 'focus:ring-teal-500',
    icon: GraduationCap,
    headline: 'Academic Workspace',
    subhead: 'Access case studies and drafting tools.'
  }
};

const API_URL = 'http://localhost:3000';

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Initialize Role based on URL (e.g. /login?role=lawyer)
  const initialRoleParam = searchParams.get('role');
  const initialRole = (initialRoleParam && ROLES[initialRoleParam as keyof typeof ROLES]) 
    ? initialRoleParam as keyof typeof ROLES 
    : 'public';

  const [role, setRole] = useState<keyof typeof ROLES>(initialRole);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeTheme = ROLES[role];

  // Keep URL in sync if user navigates back/forth
  useEffect(() => {
    const urlRole = searchParams.get('role');
    if (urlRole && ROLES[urlRole as keyof typeof ROLES]) {
      setRole(urlRole as keyof typeof ROLES);
    }
  }, [searchParams]);

  const switchRole = (newRole: keyof typeof ROLES) => {
    setRole(newRole);
    setError(null);
    setFormData({ email: '', password: '' }); // Clear inputs for security
    // Optional: Update URL without reloading
    window.history.replaceState(null, '', `?role=${newRole}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    dispatch(signInStart());

    try {
      // 1. Backend Call
      const res = await axios.post(`${API_URL}/auth/login`, {
        ...formData,
        role: role.toUpperCase() // Critical Fix: Backend expects UPPERCASE
      });
      
      // 2. Success Handling
      sessionStorage.setItem('token', res.data.access_token);
      dispatch(signInSuccess(res.data.user));

      // 3. Smart Redirect Logic
      const userRole = res.data.user.role.toUpperCase();
      const routes = {
        'LAWYER': '/lawyer/dashboard',
        'STUDENT': '/student/workspace',
        'ADMIN': '/admin/dashboard',
        'PUBLIC': '/public/dashboard'
      };
      
      // Fallback redirect if something weird happens
      navigate(routes[userRole as keyof typeof routes] || '/public/dashboard');

    } catch (err: any) {
      dispatch(signInFailure(err.message));
      // User-Friendly Error Messages
      if(err.response?.status === 401) setError("Incorrect email or password.");
      else if(err.response?.status === 400) setError("Please select the correct role.");
      else setError("Server unreachable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden font-sans selection:bg-slate-200">
      
      {/* Subtle Background Ambience (No heavy blobs) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-slate-200/40 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-slate-200/40 to-transparent rounded-full blur-3xl" />
      </div>

      {/* --- THE TRUST CARD --- */}
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[440px] bg-white relative z-10 rounded-[32px] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden ring-1 ring-slate-100"
      >
        
        {/* 1. Dynamic Header */}
        <div className="px-8 pt-10 pb-6 text-center">
          <motion.div 
            key={role}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn("mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-500 shadow-inner", activeTheme.subtle)}
          >
            <activeTheme.icon className={cn("w-8 h-8 transition-colors duration-500", activeTheme.color)} strokeWidth={2} />
          </motion.div>
          
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
            J.A.I - S.E.T.H.U
          </h1>
          <AnimatePresence mode="wait">
            <motion.div
              key={role + "-text"}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mt-2">
                {activeTheme.headline}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 2. The "Pill" Role Selector */}
        <div className="px-8 mb-8">
          <div className="bg-slate-100/80 p-1 rounded-2xl flex relative shadow-inner">
            {Object.values(ROLES).map((r) => {
              const isActive = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => switchRole(r.id as any)}
                  className={cn(
                    "flex-1 py-2.5 text-xs font-bold uppercase tracking-wide rounded-xl relative z-10 transition-colors duration-300",
                    isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeRole"
                      className="absolute inset-0 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] rounded-xl border border-slate-200/50"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. The Form */}
        <div className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                Official Email
              </label>
              <Input 
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="name@example.com"
                className={cn(
                  "h-12 rounded-xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 transition-all duration-300 focus:bg-white",
                  activeTheme.focus
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                Password
              </label>
              <div className="relative">
                <Input 
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className={cn(
                    "h-12 rounded-xl bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 transition-all duration-300 focus:bg-white",
                    activeTheme.focus
                  )}
                />
              </div>
              <div className="flex justify-end mt-1">
                 <a href="#" className="text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 transition-colors">
                   Forgot Password?
                 </a>
              </div>
            </div>

            {/* Animated Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-red-50 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100"
                >
                  <AlertCircle size={18} className="shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Button */}
            <Button 
              disabled={loading}
              className={cn(
                "w-full h-14 rounded-xl text-base font-bold shadow-lg shadow-slate-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
                activeTheme.accent,
                role === 'lawyer' ? 'text-white' : 'text-white' // Ensuring text is visible
              )}
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : (
                <>
                  Secure Login <ArrowRight className="ml-2 opacity-80" size={18} />
                </>
              )}
            </Button>

          </form>

          {/* Footer Link */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
             <p className="text-slate-500 text-sm font-medium">
               New to the platform? 
               <button 
                 onClick={() => navigate(`/register?role=${role}`)}
                 className={cn("ml-1.5 font-bold hover:underline", activeTheme.color)}
               >
                 Register as {activeTheme.label}
               </button>
             </p>
          </div>
        </div>

      </motion.div>

      {/* Govt Compliance Footer */}
      <div className="absolute bottom-6 left-0 w-full text-center text-[10px] font-bold tracking-widest text-slate-300 uppercase">
        <p>Govt. of India Compliance • End-to-End Encryption • 2026</p>
      </div>

    </div>
  );
}