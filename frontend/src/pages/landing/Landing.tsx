import { useNavigate } from 'react-router-dom';
import { Scale, BookOpen, Users, ArrowRight, Gavel } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-legal-paper font-sans text-gray-900">
      
      {/* 1. NAVBAR */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
         <div className="flex items-center gap-2 text-judicial-black">
             <Scale size={32} className="text-judicial-gold" />
             <h1 className="text-2xl font-serif font-bold tracking-wide">JAI-SETHU</h1>
         </div>
         <div className="flex gap-4">
             <button 
                onClick={() => navigate('/login')}
                className="px-6 py-2 font-bold text-gray-600 hover:text-black transition-colors"
             >
                Login
             </button>
         </div>
      </nav>

      {/* 2. HERO SECTION */}
      <header className="text-center py-16 px-4">
         <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-judicial-black">
            Justice Accessible Instantly
         </h2>
         <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            A unified legal interface connecting Citizens, Lawyers, and Students with AI-powered assistance and secure evidence management.
         </p>
      </header>

      {/* 3. ROLE SELECTION CARDS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 pb-20">
         
         {/* PUBLIC CARD */}
         <div 
            onClick={() => navigate('/public/register')}
            className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-2xl hover:border-judicial-gold transition-all cursor-pointer relative overflow-hidden"
         >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users size={120} />
            </div>
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users size={28} />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-2">Public Citizen</h3>
            <p className="text-gray-500 mb-6">Find lawyers, store evidence in the vault, and get AI legal advice.</p>
            <span className="flex items-center gap-2 text-blue-600 font-bold group-hover:gap-4 transition-all">
                Register Now <ArrowRight size={18} />
            </span>
         </div>

         {/* LAWYER CARD */}
         <div 
            onClick={() => navigate('/lawyer/register')}
            className="group bg-judicial-black text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:translate-y-[-4px] transition-all cursor-pointer relative overflow-hidden"
         >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Gavel size={120} />
            </div>
            <div className="w-14 h-14 bg-judicial-gold text-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Gavel size={28} />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-2">Advocate</h3>
            <p className="text-gray-400 mb-6">Manage clients, draft documents, and expand your legal practice.</p>
            <span className="flex items-center gap-2 text-judicial-gold font-bold group-hover:gap-4 transition-all">
                Join Bar Council <ArrowRight size={18} />
            </span>
         </div>

         {/* STUDENT CARD */}
         <div 
            onClick={() => navigate('/student/register')}
            className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-2xl hover:border-judicial-gold transition-all cursor-pointer relative overflow-hidden"
         >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BookOpen size={120} />
            </div>
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen size={28} />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-2">Law Student</h3>
            <p className="text-gray-500 mb-6">Access study materials, practice drafting, and learn from seniors.</p>
            <span className="flex items-center gap-2 text-green-600 font-bold group-hover:gap-4 transition-all">
                Start Learning <ArrowRight size={18} />
            </span>
         </div>

      </div>

      {/* FOOTER */}
      <footer className="text-center text-gray-400 text-sm py-8 border-t border-gray-200">
         © 2026 JAI-SETHU Legal Tech. Secure & Encrypted.
      </footer>
    </div>
  );
}