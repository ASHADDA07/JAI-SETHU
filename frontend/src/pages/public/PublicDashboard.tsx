import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// 1. Redux Imports
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

import { DashboardLayout } from '../../layouts/DashboardLayout';
import { 
  Scale, FileText, Bot, Shield, Search, ArrowRight, 
  Upload
} from 'lucide-react';

const API_URL = 'http://localhost:3000';

export default function PublicDashboard() {
  // 2. Get User from Redux
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  
  // Real Stats (Default to 0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stats, setStats] = useState({
    activeCases: 0,
    savedDocs: 0,
    consultations: 0
  });

  // Fetch Real Stats from DB
  useEffect(() => {
    const fetchStats = async () => {
      if (!currentUser?.id) return;
      try {
        // We will build this endpoint later. For now, it gracefully fails to 0.
        // const res = await axios.get(`${API_URL}/users/${user.id}/stats`);
        // setStats(res.data);
      } catch (e) {
        console.log("No stats found, defaulting to 0");
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?.id) fetchStats();
  }, [currentUser?.id]);

  if (!currentUser) return null;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* 1. WELCOME BANNER (Dynamic Name) */}
        <div className="bg-judicial-black text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10">
             <h1 className="text-3xl font-serif font-bold mb-2">
                Welcome, {currentUser.fullName || currentUser.email?.split('@')[0] || 'Citizen'}
             </h1>
             <p className="text-gray-400 max-w-xl">
                Your legal command center. Manage your cases, secure your evidence, and consult with AI.
             </p>
             <div className="flex gap-4 mt-6">
                <button 
                   onClick={() => navigate('/public/connect')}
                   className="px-6 py-3 bg-[#D4AF37] text-black font-bold rounded-lg hover:brightness-110 transition-all flex items-center gap-2"
                >
                   <Search size={18} /> Find a Lawyer
                </button>
                <button 
                   onClick={() => navigate('/public/vault')}
                   className="px-6 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-all flex items-center gap-2 border border-white/10"
                >
                   <Upload size={18} /> Upload Evidence
                </button>
             </div>
          </div>
        </div>

        {/* 2. REAL STATS (No Fake Numbers) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <StatCard 
             label="Active Cases" 
             value={stats.activeCases} 
             icon={Scale} 
             color="text-blue-600" 
             bg="bg-blue-50" 
           />
           <StatCard 
             label="Evidence Files" 
             value={stats.savedDocs} 
             icon={FileText} 
             color="text-purple-600" 
             bg="bg-purple-50" 
           />
           <StatCard 
             label="AI Consultations" 
             value={stats.consultations} 
             icon={Bot} 
             color="text-green-600" 
             bg="bg-green-50" 
           />
        </div>

        {/* 3. LIVE TOOLS (Buttons that actually Navigate) */}
        <h2 className="text-xl font-bold text-gray-900 mt-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           
           <ActionCard 
              title="Find a Lawyer" 
              desc="Search verified advocates in your area."
              icon={Search}
              onClick={() => navigate('/public/connect')}
           />

           <ActionCard 
              title="AI Legal Advisor" 
              desc="Get instant answers from JAI-AI."
              icon={Bot}
              onClick={() => navigate('/public/ai')}
           />

           <ActionCard 
              title="Evidence Vault" 
              desc="Securely store and hash your documents."
              icon={Shield}
              onClick={() => navigate('/public/vault')}
           />

        </div>
      </div>
    </DashboardLayout>
  );
}

// --- SUB COMPONENTS ---

function StatCard({ label, value, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bg}`}>
                <Icon size={24} className={color} />
            </div>
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{label}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
        </div>
    )
}

function ActionCard({ title, desc, icon: Icon, onClick }: any) {
    return (
        <div 
           onClick={onClick}
           className="bg-white p-6 rounded-xl border border-gray-200 hover:border-[#D4AF37] cursor-pointer group transition-all hover:shadow-lg"
        >
           <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                 <Icon size={20} />
              </div>
              <ArrowRight size={20} className="text-gray-300 group-hover:text-[#D4AF37] transition-colors" />
           </div>
           <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
           <p className="text-sm text-gray-500">{desc}</p>
        </div>
    )
}