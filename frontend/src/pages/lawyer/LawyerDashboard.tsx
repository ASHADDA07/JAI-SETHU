import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { 
  Briefcase, Users, Scale, FileText, 
  Calendar, Plus, MapPin, ChevronRight,
  MessageSquare, AlertCircle
} from 'lucide-react';

const API_URL = 'http://localhost:3000';

export default function LawyerDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);

  // --- STATIC MOCK DATA FOR CALENDAR (Kept as USP) ---
  const events = [
    { id: 1, title: 'High Court Hearing', time: '10:30 AM', date: 'Today', type: 'hearing', location: 'Court Hall 4' },
    { id: 2, title: 'Client Consultation', time: '02:00 PM', date: 'Today', type: 'meeting', location: 'Office' },
    { id: 3, title: 'Bail Application Filing', time: '11:00 AM', date: 'Tomorrow', type: 'filing', location: 'Registry' },
  ];

  // 0. Safety Check
  if (!user) return null;

  // 1. FETCH REAL MESSAGES
  useEffect(() => {
    const fetchDashboardData = async () => {
        try {
            const res = await axios.get(`${API_URL}/messages/inbox?userId=${user.id}`);
            setInquiries(res.data);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchDashboardData();
  }, [user.id]);

  // 2. REAL STATS (Removed Fake Numbers)
  const stats = {
    activeCases: 0, // Reset to 0 (Real data will come from Case Module later)
    newClients: inquiries.length, // Real Data from Inbox
    pendingDocs: 0, // Reset to 0
    upcomingHearings: events.filter(e => e.type === 'hearing').length // From Calendar
  };

  return (
    <DashboardLayout role="lawyer">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* 1. HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div>
                <h1 className="text-2xl font-serif font-bold text-gray-900">
                    Advocate {user.name}
                </h1>
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    <Briefcase size={14} className="text-[#D4AF37]"/> {/* Judicial Gold */}
                    License No: <span className="font-mono font-bold text-gray-700">{user.barLicenseNo || 'Pending Update'}</span>
                </p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
                <button 
                    onClick={() => navigate('/lawyer/messages')}
                    className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                >
                    Messages
                </button>
                <button 
                    className="px-4 py-2 bg-[#D4AF37] text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors shadow-sm flex items-center gap-2"
                >
                    <Plus size={18}/> Add Event
                </button>
            </div>
        </div>

        {/* 2. METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <DashboardCard label="Active Cases" value={stats.activeCases} icon={Scale} />
            <DashboardCard label="Clients" value={stats.newClients} icon={Users} />
            <DashboardCard label="Drafts Pending" value={stats.pendingDocs} icon={FileText} />
            <DashboardCard label="Hearings" value={stats.upcomingHearings} icon={Calendar} />
        </div>

        {/* 3. MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT: Calendar & Schedule */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* UPCOMING SCHEDULE */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <Calendar className="text-[#D4AF37]" size={20}/> Schedule
                        </h2>
                        <button className="text-xs font-bold text-blue-600 hover:underline">View Calendar</button>
                    </div>
                    <div className="p-0">
                        {events.map((event) => (
                            <div key={event.id} className="flex items-center p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                                <div className="w-16 text-center border-r border-gray-100 pr-4 mr-4">
                                    <span className="block text-xs font-bold text-gray-400 uppercase">{event.date}</span>
                                    <span className="block text-lg font-bold text-gray-900">{event.time.split(' ')[0]}</span>
                                    <span className="block text-[10px] text-gray-500">{event.time.split(' ')[1]}</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 text-sm group-hover:text-[#D4AF37] transition-colors">{event.title}</h4>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase
                                            ${event.type === 'hearing' ? 'bg-red-50 text-red-600' : 
                                              event.type === 'meeting' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}
                                        `}>
                                            {event.type}
                                        </span>
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <MapPin size={10}/> {event.location}
                                        </span>
                                    </div>
                                </div>
                                <button className="p-2 text-gray-300 hover:text-gray-600">
                                    <ChevronRight size={18}/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RECENT INQUIRIES */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Recent Inquiries</h2>
                        <button onClick={() => navigate('/lawyer/messages')} className="text-xs font-bold text-[#D4AF37] hover:underline">View All</button>
                    </div>
                    
                    {inquiries.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                            <MessageSquare size={24} className="mx-auto mb-2 opacity-30"/>
                            <p className="text-sm">No new messages.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {inquiries.slice(0, 3).map((chat) => (
                                <div 
                                    key={chat.id}
                                    onClick={() => navigate('/lawyer/messages')}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center font-bold text-xs">
                                            {chat.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-900">{chat.name}</h4>
                                            <p className="text-xs text-gray-500 truncate max-w-[150px]">{chat.lastMsg}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-400">{new Date(chat.time).toLocaleDateString()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: Quick Actions & Notifications */}
            <div className="space-y-6">
                
                {/* ACTIONS */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <ActionCard 
                            title="Draft Document" 
                            icon={FileText}
                            onClick={() => navigate('/lawyer/draft')}
                        />
                        <ActionCard 
                            title="Client Intake" 
                            icon={Users}
                            onClick={() => navigate('/lawyer/intake')}
                        />
                         <ActionCard 
                            title="Case Status" 
                            icon={Scale}
                            onClick={() => navigate('/lawyer/cases')}
                        />
                    </div>
                </div>

                {/* NOTIFICATIONS */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-[#D4AF37] shrink-0" size={20}/>
                        <div>
                            <h4 className="font-bold text-sm text-gray-900">Profile Status</h4>
                            <p className="text-xs text-gray-500 mt-1">
                                License <b>{user.barLicenseNo}</b> pending verification.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

// Components
function DashboardCard({ label, value, icon: Icon }: any) {
    return (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
            </div>
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600">
                <Icon size={20} />
            </div>
        </div>
    )
}

function ActionCard({ title, icon: Icon, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-left group"
        >
            <div className="w-8 h-8 bg-[#D4AF37]/10 text-[#D4AF37] rounded-md flex items-center justify-center">
                <Icon size={16}/>
            </div>
            <span className="font-bold text-sm text-gray-700 group-hover:text-gray-900">{title}</span>
        </button>
    )
}