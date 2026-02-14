import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Briefcase, CheckCircle, Star, MessageSquare, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:3000';

export default function StudentNetwork() {
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch REAL Lawyers from Backend
  useEffect(() => {
    const fetchMentors = async () => {
        try {
            const res = await axios.get(`${API_URL}/users/lawyers`);
            setMentors(res.data);
        } catch (error) {
            console.error("Failed to load mentors", error);
        } finally {
            setLoading(false);
        }
    };
    fetchMentors();
  }, []);

  const handleConnect = (lawyer: any) => {
      // 2. Navigate to Messages with the REAL Lawyer object
      console.log("Connecting with:", lawyer); // Debug Log
      navigate('/student/messages', { state: { lawyer } });
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* HEADER */}
        <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900">Legal Network</h2>
            <p className="text-gray-500 mt-1">Connect with real advocates.</p>
        </div>

        {/* 1. FIND MENTORS */}
        <div>
           <h3 className="font-bold text-xl text-gray-900 mb-4">Recommended Advocates</h3>
           
           {loading ? (
               <div className="flex justify-center p-12"><Loader2 className="animate-spin text-[#D4AF37]" size={32}/></div>
           ) : mentors.length === 0 ? (
               <div className="p-8 bg-white border border-gray-200 rounded-xl text-center text-gray-500">
                   No lawyers found in the database.
               </div>
           ) : (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {mentors.map(mentor => (
                     <div key={mentor.id} className="bg-white p-5 rounded-xl border border-gray-200 hover:border-[#D4AF37] hover:shadow-lg transition-all group flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                           <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg overflow-hidden">
                              {mentor.avatar ? <img src={mentor.avatar} className="w-full h-full object-cover"/> : mentor.fullName?.[0]}
                           </div>
                           <div className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                              <Star size={12} fill="currentColor"/> 4.8
                           </div>
                        </div>
                        
                        <h4 className="font-bold text-lg text-gray-900 group-hover:text-[#D4AF37] transition-colors">{mentor.fullName}</h4>
                        <p className="text-sm text-gray-500 font-medium mb-4">{mentor.lawyerProfile?.specialization?.[0] || "General Practice"}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-400 mb-6 mt-auto">
                           <span className="flex items-center gap-1"><Briefcase size={12}/> {mentor.lawyerProfile?.barLicenseNo ? 'Licensed' : 'Practicing'}</span>
                           <span className="flex items-center gap-1"><CheckCircle size={12}/> Verified</span>
                        </div>

                        <button 
                            onClick={() => handleConnect(mentor)}
                            className="w-full py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 flex items-center justify-center gap-1"
                        >
                            <MessageSquare size={14}/> Message
                        </button>
                     </div>
                  ))}
               </div>
           )}
        </div>

      </div>
    </DashboardLayout>
  );
}