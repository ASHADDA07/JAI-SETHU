import { useState, useEffect } from 'react';
import axios from 'axios';
// 1. Redux Imports
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Check, X, User, Clock, MapPin, Phone, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:3000';

interface CaseData {
  id: string;
  title: string;
  description?: string;
  status: string;
  client: {
    id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
}

export default function ClientIntake() {
  // 2. Get User from Redux
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  const [cases, setCases] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch Pending Cases
  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchPendingCases = async () => {
      try {
        const res = await axios.get(`${API_URL}/cases/pending?lawyerId=${currentUser.id}`);
        setCases(res.data);
      } catch (error) {
        console.error('Failed to load pending cases:', error);
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingCases();
  }, [currentUser?.id]);

  // Handle Accept Case
  const handleAccept = async (caseId: string) => {
    setActionLoading(caseId);
    try {
      await axios.patch(`${API_URL}/cases/${caseId}/status`, { status: 'OPEN' });
      setCases(prev => prev.filter(c => c.id !== caseId));
    } catch (error) {
      console.error('Failed to accept case:', error);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Decline Case
  const handleDecline = async (caseId: string) => {
    setActionLoading(caseId);
    try {
      await axios.patch(`${API_URL}/cases/${caseId}/status`, { status: 'ARCHIVED' });
      setCases(prev => prev.filter(c => c.id !== caseId));
    } catch (error) {
      console.error('Failed to decline case:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-96">
          <Loader2 size={40} className="animate-spin text-[#D4AF37]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-black">Client Intake Queue</h2>
        <p className="text-gray-500 mt-1">Review and approve new consultation requests from the database.</p>
      </div>

      {cases.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <User size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No Pending Requests</h3>
          <p className="text-gray-500">When clients request your service, they will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {cases.map((caseItem) => (
            <div key={caseItem.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden group hover:border-[#D4AF37] transition-all">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D4AF37]"></div>
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <User />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{caseItem.client.fullName}</h3>
                  <p className="text-sm text-gray-700 font-medium">{caseItem.title}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Clock size={14}/> {new Date(caseItem.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Phone size={14}/> {caseItem.client.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button 
                  onClick={() => handleDecline(caseItem.id)}
                  disabled={!!actionLoading}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-red-500 hover:bg-red-50 font-bold flex items-center justify-center gap-2"
                >
                  <X size={18}/> Decline
                </button>
                <button 
                  onClick={() => handleAccept(caseItem.id)}
                  disabled={!!actionLoading}
                  className="flex-1 px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-bold hover:bg-[#B8962E] flex items-center justify-center gap-2"
                >
                  <Check size={18}/> Accept Case
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}