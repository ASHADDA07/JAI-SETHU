import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { 
  Search, MapPin, Star, MessageSquare, Filter, 
  Loader2, Briefcase, Shield 
} from 'lucide-react';

const API_URL = 'http://localhost:3000';

export default function ConnectLawyer() {
  const navigate = useNavigate();
  
  // -- STATE --
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  // 1. Fetch Real Lawyers from DB
  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/lawyers`);
        setLawyers(res.data);
      } catch (e) {
        console.error("Failed to load lawyers", e);
      } finally {
        setLoading(false);
      }
    };
    fetchLawyers();
  }, []);

  // 2. Filter Logic (Client Side)
  const filteredLawyers = lawyers.filter(lawyer => {
      const matchesSearch = lawyer.fullName?.toLowerCase().includes(search.toLowerCase()) || 
                            lawyer.lawyerProfile?.specialization?.join(' ').toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'All' || lawyer.lawyerProfile?.specialization?.includes(filter);
      
      return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* HEADER */}
        <div>
           <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Find a Legal Expert</h1>
           <p className="text-gray-500">Connect with verified advocates for advice and representation.</p>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search by name (e.g. Arjun) or specialization..." 
                  className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            
            {/* Filter Dropdown */}
            <div className="relative min-w-[200px]">
                <Filter className="absolute left-3 top-3.5 text-gray-400" size={18} />
                <select 
                   className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#D4AF37] cursor-pointer appearance-none transition-all"
                   value={filter}
                   onChange={(e) => setFilter(e.target.value)}
                >
                   <option value="All">All Specializations</option>
                   <option value="Criminal">Criminal Law</option>
                   <option value="Civil">Civil Law</option>
                   <option value="Corporate">Corporate Law</option>
                   <option value="Family">Family Law</option>
                </select>
            </div>
        </div>

        {/* RESULTS GRID */}
        {loading ? (
            <div className="flex justify-center py-20">
                <Loader2 size={40} className="animate-spin text-[#D4AF37]" />
            </div>
        ) : filteredLawyers.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase size={32} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No Lawyers Found</h3>
                <p className="text-gray-500 max-w-sm mx-auto mt-2">
                    {search ? `No results for "${search}". Try a different keyword.` : "There are no registered lawyers in the database yet."}
                </p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLawyers.map((lawyer) => (
                    <div key={lawyer.id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 flex flex-col group hover:-translate-y-1">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-serif font-bold text-xl overflow-hidden shadow-sm">
                                    {lawyer.avatar?.length > 5 ? <img src={lawyer.avatar} className="w-full h-full object-cover" alt="Profile"/> : lawyer.fullName[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#D4AF37] transition-colors">{lawyer.fullName}</h3>
                                    <p className="text-xs text-gray-500">{lawyer.email}</p>
                                </div>
                            </div>
                            {lawyer.lawyerProfile?.verified && (
                                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                    <Shield size={10} /> VERIFIED
                                </span>
                            )}
                        </div>

                        <div className="space-y-3 mb-6 flex-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Briefcase size={16} className="text-[#D4AF37]" />
                                <span>{lawyer.lawyerProfile?.specialization?.join(', ') || 'General Practice'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin size={16} className="text-[#D4AF37]" />
                                <span>{lawyer.lawyerProfile?.courtJurisdiction || 'India'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                <span>4.8/5.0 Rating (Mock)</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => navigate('/public/messages', { state: { lawyer } })}
                            className="w-full py-3 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-black hover:text-white hover:border-black transition-all flex items-center justify-center gap-2"
                        >
                            <MessageSquare size={18} /> Contact Now
                        </button>
                    </div>
                ))}
            </div>
        )}

      </div>
    </DashboardLayout>
  );
}