import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from "@/components/ui/button";
import { Shield, Lock, Gavel, GraduationCap, ChevronRight } from 'lucide-react';
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import type { RootState } from '../../redux/store';

export default function Landing() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);

  // --- 1. THE AUTO-REDIRECT LOGIC (FIXED: UPPERCASE ROLES) ---
  useEffect(() => {
    if (currentUser) {
      // Prisma/Database roles are UPPERCASE
      if (currentUser.role === 'LAWYER') navigate('/lawyer/dashboard');
      else if (currentUser.role === 'STUDENT') navigate('/student/workspace');
      else if (currentUser.role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/public/dashboard');
    }
  }, [currentUser, navigate]);

  // Animation Physics
  const containerVars: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.2, delayChildren: 0.3 } 
    }
  };

  const itemVars: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 100, damping: 10 } 
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
      
      {/* NAVBAR */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 backdrop-blur-xl px-6 py-4 flex justify-between items-center shadow-sm"
      >
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="relative">
             <Shield className="h-8 w-8 text-[#D4AF37] fill-current" />
             <div className="absolute inset-0 bg-[#D4AF37] blur-md opacity-40 animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-serif font-black tracking-tighter leading-none">
              J.A.I - S.E.T.H.U
            </h1>
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
              Official Portal
            </span>
          </div>
        </div>
        <div className="flex gap-4">
           <Button variant="ghost" onClick={() => navigate('/login')} className="hover:text-[#D4AF37]">Login</Button>
           <Button onClick={() => navigate('/register')} className="bg-slate-900 text-white hover:bg-black font-bold shadow-lg hover:shadow-xl transition-all">Join Portal</Button>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <main className="relative pt-24 pb-20 px-4 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#D4AF37]/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <motion.div 
          variants={containerVars}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto flex flex-col items-center text-center z-10"
        >
            <motion.div variants={itemVars} className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-white shadow-sm text-xs font-bold tracking-wider text-slate-600 uppercase">
                    <Lock size={12} className="text-[#D4AF37]" /> Secure Evidence Tracking Unit
                </span>
            </motion.div>

            <motion.h1 variants={itemVars} className="text-6xl md:text-8xl font-serif font-black tracking-tighter text-slate-900 mb-2">
                J.A.I <span className="text-[#D4AF37]">-</span> S.E.T.H.U
            </motion.h1>

            <motion.div variants={itemVars} className="mb-8 relative group cursor-default">
                <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <h2 className="text-lg md:text-2xl font-bold text-slate-500 tracking-wide uppercase relative">
                   <span className="text-slate-900">J</span>ustice <span className="text-slate-900">A</span>dministration <span className="text-slate-900">I</span>nitiative
                   <span className="mx-4 text-[#D4AF37] opacity-50">/</span>
                   <span className="text-slate-900">S</span>ecure <span className="text-slate-900">E</span>vidence <span className="text-slate-900">T</span>racking <span className="text-slate-900">U</span>nit
                </h2>
            </motion.div>

            <motion.p variants={itemVars} className="max-w-2xl text-xl text-slate-600 mb-24 leading-relaxed">
                The nation's first decentralized justice protocol. Whether you seek justice, administer it, or study it—your data is <span className="font-bold text-slate-900">cryptographically secured</span>.
            </motion.p>

            {/* --- THE 3 IDENTITY CARDS --- */}
            <motion.div 
                variants={containerVars}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left"
            >
                
                {/* 1. CITIZEN (Redirects to Blue Login) */}
                <motion.div 
                    whileHover={{ y: -10 }}
                    onClick={() => navigate('/login?role=public')} 
                    className="group relative bg-[#0f172a] rounded-[2.5rem] p-8 border-2 border-blue-900 shadow-xl cursor-pointer hover:border-blue-500 hover:shadow-blue-500/20 transition-all overflow-hidden"
                >
                    <div className="h-14 w-14 rounded-2xl bg-blue-900/50 text-blue-200 flex items-center justify-center mb-6 text-2xl shadow-inner">
                        <Shield className="h-7 w-7" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">Citizens</h3>
                    <p className="text-blue-100/80 mb-6 text-sm font-medium leading-relaxed">
                        File grievances with zero fear. Your identity is protected, and your evidence is hashed on the blockchain forever.
                    </p>
                    <div className="flex items-center text-blue-400 font-bold text-sm hover:underline">
                        File Now <ChevronRight size={16} />
                    </div>
                </motion.div>

                {/* 2. ADVOCATE (Redirects to Gold Login) */}
                <motion.div 
                    whileHover={{ y: -10 }}
                    onClick={() => navigate('/login?role=lawyer')} 
                    className="group relative bg-[#0a0a0a] rounded-[2.5rem] p-8 border-2 border-[#D4AF37] shadow-xl cursor-pointer hover:border-[#ffe16b] hover:shadow-[#D4AF37]/20 transition-all overflow-hidden"
                >
                    <div className="h-14 w-14 rounded-2xl bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center mb-6 text-2xl shadow-inner">
                        <Gavel className="h-7 w-7" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">Advocates</h3>
                    <p className="text-slate-300/80 mb-6 text-sm font-medium leading-relaxed">
                        Manage your practice with military-grade security. Verify evidence integrity instantly and manage client timelines.
                    </p>
                    <div className="flex items-center text-[#D4AF37] font-bold text-sm hover:underline">
                        Access Court Portal <ChevronRight size={16} />
                    </div>
                </motion.div>

                {/* 3. STUDENT (Redirects to Teal Login) */}
                <motion.div 
                    whileHover={{ y: -10 }}
                    onClick={() => navigate('/login?role=student')}
                    className="group relative bg-[#115e59] rounded-[2.5rem] p-8 border-2 border-teal-700 shadow-xl cursor-pointer hover:border-teal-400 hover:shadow-teal-400/20 transition-all overflow-hidden"
                >
                    <div className="h-14 w-14 rounded-2xl bg-teal-800/50 text-teal-200 flex items-center justify-center mb-6 text-2xl shadow-inner">
                        <GraduationCap className="h-7 w-7" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">Law Students</h3>
                    <p className="text-teal-100/80 mb-6 text-sm font-medium leading-relaxed">
                        Bridge the gap between theory and practice. Draft real petitions with AI assistance and study landmark cases.
                    </p>
                    <div className="flex items-center text-teal-300 font-bold text-sm hover:underline">
                        Enter Workspace <ChevronRight size={16} />
                    </div>
                </motion.div>

            </motion.div>
        </motion.div>
      </main>

      <footer className="py-10 text-center border-t border-slate-200 bg-white">
        <p className="text-slate-500 text-sm font-medium">
            &copy; 2026 J.A.I - S.E.T.H.U. <span className="mx-2 text-slate-300">|</span> 
            Powered by <span className="font-bold text-slate-900">Secure Evidence Tracking Unit</span>
        </p>
      </footer>
    </div>
  );
}
