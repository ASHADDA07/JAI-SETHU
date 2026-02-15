import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../../redux/userSlice';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, GraduationCap, Gavel, ArrowRight, Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';
import axios from 'axios';

// --- HIGH CONTRAST THEMES ---
const THEMES = {
  public: {
    bg: "bg-slate-50",
    card: "bg-[#0f172a] border-blue-600 shadow-2xl shadow-blue-900/50",
    text: "text-white",
    label: "text-blue-300",
    accent: "bg-blue-600 hover:bg-blue-500 text-white font-bold",
    inputBg: "bg-[#1e293b] border-blue-500/50 text-white placeholder:text-slate-400 focus:ring-blue-400",
    icon: "text-blue-400"
  },
  student: {
    bg: "bg-slate-50", 
    card: "bg-[#042f2e] border-teal-500 shadow-2xl shadow-teal-900/50",
    text: "text-white",
    label: "text-teal-300",
    accent: "bg-teal-500 hover:bg-teal-400 text-white font-bold",
    inputBg: "bg-[#115e59] border-teal-500/50 text-white placeholder:text-teal-200/50 focus:ring-teal-400",
    icon: "text-teal-300"
  },
  lawyer: {
    bg: "bg-[#e7e5e4]", 
    card: "bg-[#0a0a0a] border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/40",
    text: "text-white",
    label: "text-[#D4AF37]",
    accent: "bg-[#D4AF37] hover:bg-[#bfa030] text-black font-bold",
    inputBg: "bg-[#171717] border-[#D4AF37]/50 text-white placeholder:text-neutral-400 focus:ring-[#D4AF37]",
    icon: "text-[#D4AF37]"
  }
};

const API_URL = 'http://localhost:3000';

export default function Login() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') as 'public' | 'student' | 'lawyer' || 'public';
  
  const [role, setRole] = useState(initialRole);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const theme = THEMES[role];

  useEffect(() => {
     const urlRole = searchParams.get('role') as 'public' | 'student' | 'lawyer';
     if(urlRole) setRole(urlRole);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    dispatch(signInStart());

    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
         ...formData,
         role 
      });
      
      sessionStorage.setItem('token', res.data.access_token);
      dispatch(signInSuccess(res.data.user));

      // --- FIXED REDIRECT LOGIC (UPPERCASE CHECK) ---
      const userRole = res.data.user.role.toUpperCase(); // Normalize to Uppercase
      
      if (userRole === 'LAWYER') navigate('/lawyer/dashboard');
      else if (userRole === 'STUDENT') navigate('/student/workspace');
      else if (userRole === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/public/dashboard');

    } catch (err: any) {
      dispatch(signInFailure(err.message));
      setError("Invalid credentials or wrong portal selected.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-700 ${theme.bg}`}>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-[2.5rem] shadow-2xl border-4 ${role === 'lawyer' ? 'border-[#D4AF37]' : (role === 'student' ? 'border-teal-500' : 'border-blue-600')} ${theme.card}`}
      >
         
         {/* LEFT SIDE: VISUAL IDENTIFIER */}
         <div className={`relative hidden lg:flex flex-col items-center justify-center p-12 text-center overflow-hidden bg-black/20`}>
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] opacity-60 ${role === 'lawyer' ? 'bg-[#D4AF37]' : (role === 'student' ? 'bg-teal-500' : 'bg-blue-600')}`}></div>
            
            <div className="relative z-10">
                <motion.div 
                   key={role}
                   initial={{ scale: 0.8, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   transition={{ type: "spring", stiffness: 100 }}
                   className={`w-40 h-40 rounded-[2rem] flex items-center justify-center mb-8 text-7xl shadow-2xl border-2 border-white/20 backdrop-blur-md ${role === 'lawyer' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : (role === 'student' ? 'bg-teal-500/20 text-teal-200' : 'bg-blue-600/30 text-blue-200')}`}
                >
                    {role === 'lawyer' ? <Gavel size={80} /> : (role === 'student' ? <GraduationCap size={80} /> : <Shield size={80} />)}
                </motion.div>
                
                <h2 className="text-4xl font-serif font-bold text-white mb-4 drop-shadow-md">
                    {role === 'public' ? 'Citizen Secure Login' : (role === 'lawyer' ? 'Advocate Portal' : 'Student Workspace')}
                </h2>
                <p className="text-lg text-white/90 max-w-sm mx-auto leading-relaxed font-medium">
                    {role === 'public' ? 'Access your filed grievances and track status securely.' : 
                    (role === 'lawyer' ? 'Manage case files and verify evidence integrity.' : 
                    'Access drafting tools and legal resources.')}
                </p>
            </div>
         </div>

         {/* RIGHT SIDE: THE FORM */}
         <div className={`p-10 md:p-16 flex flex-col justify-center relative ${role === 'lawyer' ? 'bg-[#050505]' : (role === 'student' ? 'bg-[#022c22]' : 'bg-[#0b1120]')}`}>
            
            <button onClick={() => navigate('/')} className={`absolute top-8 left-8 p-2 rounded-full hover:bg-white/10 transition-colors text-white hover:text-white/80`}>
               <ArrowLeft size={28} />
            </button>

            <div className="mb-10">
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
                <p className="text-white/70 text-lg">Please enter your credentials.</p>
            </div>

            {/* Role Switcher Tabs */}
            <div className="flex p-1 bg-white/5 rounded-xl mb-8 border border-white/10">
               {['public', 'lawyer', 'student'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r as any)}
                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${role === r ? theme.accent : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                  >
                    {r}
                  </button>
               ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                    <label className={`text-sm font-bold uppercase tracking-widest ml-1 ${theme.label}`}>Email ID</label>
                    <div className="relative">
                        <Mail size={22} className={`absolute left-4 top-[1.1rem] ${theme.icon} z-10`} />
                        <Input 
                           type="email" 
                           placeholder="name@example.com"
                           value={formData.email}
                           onChange={(e) => setFormData({...formData, email: e.target.value})}
                           className={`pl-14 h-16 text-lg rounded-xl border-2 ${theme.inputBg} focus:ring-2 focus:ring-offset-0`}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <label className={`text-sm font-bold uppercase tracking-widest ml-1 ${theme.label}`}>Password</label>
                    <div className="relative">
                        <Lock size={22} className={`absolute left-4 top-[1.1rem] ${theme.icon} z-10`} />
                        <Input 
                           type="password" 
                           placeholder="••••••••"
                           value={formData.password}
                           onChange={(e) => setFormData({...formData, password: e.target.value})}
                           className={`pl-14 h-16 text-lg rounded-xl border-2 ${theme.inputBg} focus:ring-2 focus:ring-offset-0`}
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 text-red-200 text-sm font-bold text-center animate-pulse">
                        {error}
                    </div>
                )}

                <Button className={`w-full h-16 text-xl font-bold rounded-xl shadow-lg mt-6 ${theme.accent}`} disabled={loading}>
                   {loading ? <Loader2 className="animate-spin mr-2" /> : "Secure Login"}
                   {!loading && <ArrowRight className="ml-2 h-6 w-6 opacity-80" />}
                </Button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-white/60 text-base">Don't have an ID? <span onClick={() => navigate(`/register?role=${role}`)} className={`font-bold cursor-pointer hover:underline ${theme.label} ml-1`}>Create Account</span></p>
            </div>

         </div>

      </motion.div>
    </div>
  );
}