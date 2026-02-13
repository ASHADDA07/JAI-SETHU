import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { UserPlus, Briefcase, Share2, Star, Loader2, User } from 'lucide-react';

const API_URL = 'http://localhost:3000';

interface Associate {
  id: string;
  fullName: string;
  role: string;
  avatar?: string;
}

export default function AssociateTeam() {
  const { user } = useUser();
  const [associates, setAssociates] = useState<Associate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssociates = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/associates?excludeUserId=${user?.id}`);
        setAssociates(res.data);
      } catch (error) {
        console.error('Failed to load associates:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchAssociates();
  }, [user?.id]);

  if (loading) {
    return (
      <DashboardLayout role="lawyer">
        <div className="flex justify-center items-center h-96">
          <Loader2 size={40} className="animate-spin text-[#D4AF37]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="lawyer">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-black">Associate Team</h2>
          <p className="text-gray-500 mt-1">Connect with other lawyers and students in the system.</p>
        </div>
        <button className="px-6 py-3 bg-black text-white rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800 transition-all">
           <UserPlus size={18} /> Recruit Associate
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {associates.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">No other legal professionals found in the system yet.</p>
          </div>
        ) : (
          associates.map((person) => (
            <div key={person.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-[#D4AF37] transition-all group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xl text-gray-600 overflow-hidden">
                  {person.avatar ? <img src={person.avatar} className="w-full h-full object-cover" /> : person.fullName[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{person.fullName}</h3>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-bold uppercase tracking-wider">{person.role}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                 <span className="flex items-center gap-1"><Star size={14} className="text-yellow-400 fill-current"/> 4.5</span>
                 <span>•</span>
                 <span>{Math.floor(Math.random() * 5)} Active Cases</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 border border-gray-200 rounded font-bold text-sm hover:bg-gray-50 flex items-center justify-center gap-2"><Share2 size={14}/> Share</button>
                <button className="flex-1 py-2 bg-[#D4AF37] text-black rounded font-bold text-sm hover:bg-[#B8962E] flex items-center justify-center gap-2"><Briefcase size={14}/> Assign</button>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}