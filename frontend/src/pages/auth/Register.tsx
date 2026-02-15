import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, GraduationCap, Gavel, CheckCircle, ArrowRight, MapPin, Phone, Mail, User, Loader2, ArrowLeft, Lock, FileText, QrCode } from 'lucide-react';

// --- THEMES: THE DRAGON PALETTES ---
const THEMES = {
  public: {
    bg: "bg-slate-50",
    card: "bg-[#0f172a] border-blue-900 shadow-2xl shadow-blue-900/30",
    text: "text-white",
    subText: "text-blue-200",
    accent: "bg-blue-600 hover:bg-blue-500 text-white font-bold",
    inputBg: "bg-[#1e293b] border-blue-800 text-white placeholder:text-slate-500 focus:ring-blue-500",
    icon: "text-blue-400"
  },
  student: {
    bg: "bg-slate-50", 
    card: "bg-[#115e59] border-teal-800 shadow-2xl shadow-teal-900/30",
    text: "text-white",
    subText: "text-teal-100",
    accent: "bg-teal-400 hover:bg-teal-300 text-teal-950 font-bold",
    inputBg: "bg-[#134e4a] border-teal-700 text-white placeholder:text-teal-200/50 focus:ring-teal-400",
    icon: "text-teal-300"
  },
  lawyer: {
    bg: "bg-[#e7e5e4]", 
    card: "bg-[#0a0a0a] border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/20",
    text: "text-white",
    subText: "text-[#D4AF37]",
    accent: "bg-[#D4AF37] hover:bg-[#bfa030] text-black font-bold",
    inputBg: "bg-[#171717] border-[#333] text-white placeholder:text-neutral-500 focus:ring-[#D4AF37]",
    icon: "text-[#D4AF37]"
  }
};

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // LOGIC: If URL has ?role=..., force that role. Otherwise default to step 1.
  const urlRole = searchParams.get('role') as 'public' | 'student' | 'lawyer';
  
  const [step, setStep] = useState(urlRole ? 2 : 1); 
  const [role, setRole] = useState<'public' | 'student' | 'lawyer'>(urlRole || 'public');
  const [loading, setLoading] = useState(false);
  
  const theme = THEMES[role];

  // If URL changes, update state
  useEffect(() => {
     if(urlRole) {
         setRole(urlRole);
         setStep(2);
     }
  }, [urlRole]);

  const handleRoleSelect = (selected: 'public' | 'student' | 'lawyer') => {
    setRole(selected);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
        setLoading(false);
        setStep(3);
    }, 2500);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-700 ${theme.bg}`}>
      
      <AnimatePresence mode='wait'>
        
        {/* --- STEP 1: CHOOSE IDENTITY (Only if no role in URL) --- */}
        {step === 1 && !urlRole && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -100 }}
            className="max-w-7xl w-full"
          >
             <div className="text-center mb-12">
                <h1 className="text-5xl md:text-7xl font-serif font-black text-slate-900 mb-4 tracking-tight">
                   Choose Your <span className="text-[#D4AF37]">Identity.</span>
                </h1>
                <p className="text-slate-500 text-xl font-medium">Select your profile type to access the secure network.</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4">
                <RoleCard 
                   icon={Shield} 
                   title="Citizen" 
                   desc="Secure Grievance Filing" 
                   style="navy"
                   onClick={() => handleRoleSelect('public')}
                />
                <RoleCard 
                   icon={Gavel} 
                   title="Advocate" 
                   desc="Legal Practice Management" 
                   style="gold"
                   onClick={() => handleRoleSelect('lawyer')}
                />
                <RoleCard 
                   icon={GraduationCap} 
                   title="Student" 
                   desc="Academic & Drafting Portal" 
                   style="teal"
                   onClick={() => handleRoleSelect('student')}
                />
             </div>
             
             <div className="text-center mt-12">
                <p className="text-slate-500 text-lg">Already have an ID? <span onClick={() => navigate('/login')} className="text-slate-900 font-bold cursor-pointer hover:underline">Login here</span></p>
             </div>
          </motion.div>
        )}

        {/* --- STEP 2: THE FORM (Role Locked) --- */}
        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`max-w-3xl w-full relative rounded-3xl overflow-hidden border-2 ${theme.card}`}
          >
             {/* Top Strip */}
             <div className={`absolute top-0 left-0 w-full h-3 ${role === 'lawyer' ? 'bg-[#D4AF37]' : (role === 'student' ? 'bg-teal-400' : 'bg-blue-500')}`}></div>

             <div className="p-8 md:p-12 relative z-10">
                {/* Back button only if they didn't come from Landing Page */}
                {!urlRole && (
                    <button onClick={() => setStep(1)} className={`absolute top-8 left-8 p-2 rounded-full hover:bg-white/10 transition-colors ${theme.text}`}>
                        <ArrowLeft size={32} />
                    </button>
                )}

                <div className="text-center mb-10 mt-6">
                   <div className={`mx-auto w-24 h-24 rounded-3xl flex items-center justify-center mb-6 text-5xl shadow-2xl border-2 border-white/10 ${role === 'lawyer' ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : (role === 'student' ? 'bg-teal-500/20 text-teal-300' : 'bg-blue-600/30 text-blue-300')}`}>
                      {role === 'lawyer' ? <Gavel size={48} /> : (role === 'student' ? <GraduationCap size={48} /> : <Shield size={48} />)}
                   </div>
                   <h2 className={`text-5xl font-serif font-bold ${theme.text}`}>
                       {role === 'public' ? 'Citizen Portal' : (role === 'lawyer' ? 'Advocate Access' : 'Student Hub')}
                   </h2>
                   <p className={`mt-3 text-xl ${theme.subText} font-medium`}>Secure Blockchain Enrollment</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputGroup label="Full Name" icon={User} placeholder="e.g. Aditi Rao" theme={theme} />
                      <InputGroup label="Phone Number" icon={Phone} placeholder="+91 98765 43210" theme={theme} />
                   </div>
                   
                   <InputGroup label="Email Address" icon={Mail} placeholder="name@example.com" theme={theme} type="email" />
                   <InputGroup label="Current City" icon={MapPin} placeholder="e.g. Mumbai" theme={theme} />

                   {/* --- DYNAMIC ROLE SPECIFIC FIELDS --- */}
                   <AnimatePresence>
                       {role === 'student' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-6 bg-teal-900/40 rounded-2xl border border-teal-500/30 space-y-6">
                              <h4 className="text-sm font-bold text-teal-200 uppercase tracking-widest flex items-center gap-2">
                                 <GraduationCap size={18}/> Academic Verification
                              </h4>
                              <InputGroup label="University Name" icon={GraduationCap} placeholder="e.g. NLSIU Bangalore" theme={theme} />
                              <div className="grid grid-cols-2 gap-6">
                                 <InputGroup label="Year" icon={CheckCircle} placeholder="e.g. 3rd" theme={theme} />
                                 <InputGroup label="Enrollment No" icon={User} placeholder="University ID" theme={theme} />
                              </div>
                          </motion.div>
                       )}

                       {role === 'lawyer' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-6 bg-[#D4AF37]/10 rounded-2xl border border-[#D4AF37]/40 space-y-6">
                              <h4 className="text-sm font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-2">
                                 <Gavel size={18}/> Bar Council Data
                              </h4>
                              <InputGroup label="Bar Enrollment No." icon={FileText} placeholder="MAH/1234/2020" theme={theme} />
                              <InputGroup label="Practicing Court" icon={MapPin} placeholder="e.g. High Court of Bombay" theme={theme} />
                          </motion.div>
                       )}
                   </AnimatePresence>
                   
                   {/* Password Section */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <InputGroup label="Password" icon={Lock} placeholder="••••••••" type="password" theme={theme} />
                       <InputGroup label="Confirm Password" icon={Lock} placeholder="••••••••" type="password" theme={theme} />
                   </div>

                   <Button className={`w-full h-16 text-xl shadow-xl mt-8 rounded-2xl ${theme.accent} transition-transform active:scale-95`} disabled={loading}>
                      {loading ? <Loader2 className="animate-spin mr-3" size={24} /> : "Finalize Registration"}
                      {!loading && <ArrowRight className="ml-3 h-6 w-6 opacity-80" />}
                   </Button>
                </form>
             </div>
          </motion.div>
        )}

        {/* --- STEP 3: THE ULTIMATE CARD REVEAL --- */}
        {step === 3 && (
            <motion.div 
               key="step3"
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="text-center relative z-50 max-w-4xl w-full flex flex-col items-center"
            >
               <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={600} colors={role === 'lawyer' ? ['#D4AF37', '#000', '#FFF'] : (role === 'student' ? ['#2dd4bf', '#115e59', '#FFF'] : ['#3b82f6', '#1e3a8a', '#FFF'])} />
               
               <motion.div 
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: 0.2 }}
                 className="mb-10 text-center"
               >
                   <h2 className="text-6xl font-serif font-bold text-slate-900 mb-4 drop-shadow-sm">Welcome to J.A.I</h2>
                   <p className="text-slate-500 text-2xl font-medium">Your identity has been cryptographically secured.</p>
               </motion.div>

               {/* THE CARD REVEAL */}
               <motion.div 
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 60, damping: 12, delay: 0.5 }}
                  className={`relative w-full max-w-lg aspect-[1.586/1] rounded-[2rem] shadow-2xl overflow-hidden text-left p-8 flex flex-col justify-between border-4 ${role === 'lawyer' ? 'bg-black border-[#D4AF37] shadow-[#D4AF37]/30' : (role === 'student' ? 'bg-teal-900 border-teal-500 shadow-teal-500/30' : 'bg-blue-900 border-blue-500 shadow-blue-500/30')}`}
               >
                  {/* Background Patterns */}
                  <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                  <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-40 ${role === 'lawyer' ? 'bg-[#D4AF37]' : 'bg-white'}`}></div>

                  {/* Header */}
                  <div className="relative z-10 flex justify-between items-start">
                     <div>
                        <p className={`text-xs font-bold uppercase tracking-[0.3em] ${role === 'lawyer' ? 'text-[#D4AF37]' : 'text-white/70'}`}>Official Identity Card</p>
                        <h3 className="text-3xl font-serif font-bold text-white mt-1">J.A.I - S.E.T.H.U</h3>
                     </div>
                     {role === 'lawyer' ? <Gavel className="text-[#D4AF37]" size={40} /> : (role === 'student' ? <GraduationCap className="text-teal-400" size={40} /> : <Shield className="text-blue-400" size={40} />)}
                  </div>

                  {/* Details */}
                  <div className="relative z-10 grid grid-cols-2 gap-4 mt-8">
                     <div>
                        <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Name</p>
                        <p className="text-xl font-bold text-white">Aditi Rao</p>
                     </div>
                     <div>
                        <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">Role</p>
                        <p className={`text-xl font-bold ${role === 'lawyer' ? 'text-[#D4AF37]' : 'text-white'}`}>{role === 'public' ? 'CITIZEN' : role.toUpperCase()}</p>
                     </div>
                     <div>
                        <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest">JAI-ID</p>
                        <p className="text-xl font-mono font-bold text-white tracking-widest">USR-8821-X</p>
                     </div>
                     <div className="flex items-end justify-end">
                        <QrCode className="text-white/80" size={48} />
                     </div>
                  </div>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 1.5 }}
                 className="mt-12 w-full max-w-md"
               >
                   <p className="text-slate-400 text-sm mb-4">Please use your <strong className="text-slate-900">Registered Email</strong> to login.</p>
                   <Button onClick={() => navigate(`/login?role=${role}`)} className="w-full h-16 text-xl bg-slate-900 text-white font-bold hover:bg-black rounded-2xl shadow-xl transition-all hover:scale-105">
                      Proceed to Dashboard <ArrowRight className="ml-2"/>
                   </Button>
               </motion.div>

            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS (Clean & Consistent) ---

function RoleCard({ icon: Icon, title, desc, style, onClick }: any) {
    const styles = {
        navy: "bg-[#0f172a] border-2 border-blue-900 text-white hover:border-blue-500 hover:shadow-blue-500/20",
        gold: "bg-[#0a0a0a] border-2 border-[#D4AF37] text-white hover:border-[#ffe16b] hover:shadow-[#D4AF37]/20",
        teal: "bg-[#115e59] border-2 border-teal-700 text-white hover:border-teal-400 hover:shadow-teal-400/20"
    };

    const iconColors = {
        navy: "text-blue-200 bg-blue-900/50",
        gold: "text-[#D4AF37] bg-[#D4AF37]/20",
        teal: "text-teal-200 bg-teal-800/50"
    };

    return (
        <motion.div 
           whileHover={{ y: -10, scale: 1.02 }}
           whileTap={{ scale: 0.98 }}
           onClick={onClick}
           className={`group relative h-64 p-8 rounded-[2.5rem] cursor-pointer transition-all duration-300 shadow-xl flex flex-col justify-between ${styles[style as keyof typeof styles]}`}
        >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner ${iconColors[style as keyof typeof iconColors]}`}>
                <Icon size={32} />
            </div>
            <div>
                <h3 className="text-3xl font-serif font-bold mb-2 tracking-wide text-white">{title}</h3>
                <p className="text-lg opacity-80 font-medium leading-relaxed text-white">{desc}</p>
            </div>
            <div className="absolute top-8 right-8 p-3 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={24} className="text-white" />
            </div>
        </motion.div>
    );
}

function InputGroup({ label, icon: Icon, placeholder, theme, type = "text" }: any) {
    return (
        <div className="space-y-2 group">
            <label className={`text-sm font-bold uppercase tracking-widest ml-1 ${theme.subText} opacity-90`}>{label}</label>
            <div className="relative">
                <Icon size={22} className={`absolute left-5 top-[1.1rem] transition-colors ${theme.icon} z-10`} />
                <Input 
                   type={type}
                   placeholder={placeholder} 
                   className={`pl-14 h-16 text-lg rounded-2xl transition-all border-2 ${theme.inputBg} focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent ${theme.ring}`}
                />
            </div>
        </div>
    );
}