import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// 1. Redux Imports
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

import { DashboardLayout } from '../../layouts/DashboardLayout';
import { 
  Briefcase, Users, Scale, FileText, 
  Calendar, Plus, MapPin, ChevronRight,
  MessageSquare, AlertCircle, Clock, Gavel, Loader2 // <--- Added Loader2
} from 'lucide-react';

const API_URL = 'http://localhost:3000';

export default function LawyerDashboard() {
  // 2. Get User from Redux
  const { currentUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);

  // --- ADVANCED CALENDAR DATA (Mock for UI) ---
  const events = [
    { id: 1, title: 'High Court Hearing: State vs. Sharma', time: '10:30 AM', date: 'Today', type: 'hearing', location: 'Court Hall 4, HC' },
    { id: 2, title: 'Client Consultation: Real Estate Dispute', time: '02:00 PM', date: 'Today', type: 'meeting', location: 'Office Conf Room' },
    { id: 3, title: 'Bail Application Filing', time: '11:00 AM', date: 'Tomorrow', type: 'filing', location: 'Registry Counter 3' },
    { id: 4, title: 'Team Review Meeting', time: '04:30 PM', date: 'Tomorrow', type: 'internal', location: 'Zoom' },
  ];

  // 0. Safety Check
  if (!currentUser) return null;

  // 1. FETCH REAL MESSAGES
  useEffect(() => {
    const fetchDashboardData = async () => {
        try {
            const res = await axios.get(`${API_URL}/messages/inbox?userId=${currentUser.id}`);
            setInquiries(res.data);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            setLoading(false);
        }
    };
    if (currentUser?.id) {
        fetchDashboardData();
    }
  }, [currentUser?.id]);

  // 2. REAL STATS (Removed Fake Numbers)
  const stats = {
    activeCases: 0, // Reset to 0 (Real data will come from Case Module later)
    newClients: inquiries.length, // Real Data from Inbox
    pendingDocs: 0, // Reset to 0
    upcomingHearings: events.filter(e => e.type === 'hearing').length // From Calendar
  };
  // 3. LOADING STATE
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
          <span className="ml-3 text-gray-500 font-medium">Loading Dashboard...</span>
        </div>
      </DashboardLayout>
    );
  }

 

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* 1. HEADER CARD (Advanced Gradient & Hover) */}
        <div className="relative overflow-hidden bg-white p-8 rounded-2xl border border-gray-200 shadow-sm group hover:shadow-md transition-all duration-300">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-judicial-gold/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-judicial-gold/10 transition-all duration-500"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">
                        Advocate {currentUser.fullName || currentUser.email?.split('@')[0] || 'Lawyer'}
                    </h1>
                    <div className="flex items-center gap-4 mt-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200">
                            <Briefcase size={12} className="text-[#D4AF37]"/> 
                            {currentUser.role}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">
                            License: <span className="font-mono text-gray-900">{currentUser.email || 'Pending'}</span>
                        </span>
                    </div>
                </div>
                
                {/* Action Buttons (Always Visible + Hover Effect) */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => navigate('/lawyer/messages')}
                        className="flex-1 md:flex-none px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95"
                    >
                        Messages
                    </button>
                    <button 
                        className="flex-1 md:flex-none px-5 py-2.5 bg-[#D4AF37] text-judicial-black font-bold rounded-xl hover:bg-[#c4a030] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 group"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300"/> 
                        Add Event
                    </button>
                </div>
            </div>
        </div>

        {/* 2. METRICS GRID (With Hover Lift & Glow) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard label="Active Cases" value={stats.activeCases} icon={Gavel} color="text-blue-600" bg="bg-blue-50" />
            <DashboardCard label="New Clients" value={stats.newClients} icon={Users} color="text-green-600" bg="bg-green-50" />
            <DashboardCard label="Drafts Pending" value={stats.pendingDocs} icon={FileText} color="text-purple-600" bg="bg-purple-50" />
            <DashboardCard label="Hearings" value={stats.upcomingHearings} icon={Scale} color="text-[#D4AF37]" bg="bg-yellow-50" />
        </div>

        {/* 3. MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT: Calendar & Schedule (The Advanced Timeline) */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* UPCOMING SCHEDULE */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Calendar className="text-[#D4AF37]" size={20}/> 
                            Today's Schedule
                        </h2>
                        <button className="text-xs font-bold text-judicial-gold hover:text-black hover:underline transition-colors">
                            View Full Calendar
                        </button>
                    </div>
                    
                    <div className="divide-y divide-gray-50">
                        {events.map((event) => (
                            <div 
                                key={event.id} 
                                className="group relative p-5 hover:bg-gray-50 transition-all duration-300 cursor-pointer border-l-4 border-transparent hover:border-[#D4AF37]"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Time Column */}
                                    <div className="w-20 shrink-0 flex flex-col items-center justify-center pt-1">
                                        <span className="text-sm font-bold text-gray-900">{event.time}</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{event.date}</span>
                                    </div>

                                    {/* Event Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`
                                                inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide
                                                ${event.type === 'hearing' ? 'bg-red-100 text-red-700' : 
                                                  event.type === 'meeting' ? 'bg-blue-100 text-blue-700' : 
                                                  event.type === 'filing' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}
                                            `}>
                                                {event.type}
                                            </span>
                                            {event.type === 'hearing' && <span className="animate-pulse w-2 h-2 rounded-full bg-red-500"></span>}
                                        </div>
                                        
                                        <h4 className="font-bold text-gray-900 text-base mb-1 truncate group-hover:text-[#D4AF37] transition-colors">
                                            {event.title}
                                        </h4>
                                        
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Clock size={12}/> 1h 30m
                                            </span>
                                            <span className="flex items-center gap-1 text-gray-600 font-medium">
                                                <MapPin size={12}/> {event.location}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Arrow Icon (Only shows on hover) */}
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center">
                                        <ChevronRight size={20} className="text-gray-400"/>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <button className="w-full py-3 text-center text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors border-t border-gray-100">
                        Show Tomorrow's Events
                    </button>
                </div>

                {/* RECENT INQUIRIES (The List View) */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Recent Inquiries</h2>
                        <button onClick={() => navigate('/lawyer/messages')} className="text-xs font-bold text-[#D4AF37] hover:underline">View Inbox</button>
                    </div>
                    
                    {inquiries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                <MessageSquare size={20} className="opacity-50"/>
                            </div>
                            <p className="text-sm font-medium">No new messages yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {inquiries.slice(0, 3).map((chat) => (
                                <div 
                                    key={chat.id}
                                    onClick={() => navigate('/lawyer/messages')}
                                    className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:border-[#D4AF37] hover:shadow-md cursor-pointer transition-all duration-200 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
                                            {chat.name[0]}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-900">{chat.name}</h4>
                                            <p className="text-xs text-gray-500 truncate max-w-[200px] mt-0.5">{chat.lastMsg}</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                        {new Date(chat.time).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: Quick Actions & Notifications (Sticky Sidebar) */}
            <div className="space-y-6">
                
                {/* QUICK ACTIONS */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Plus size={14}/> Quick Actions
                    </h2>
                    <div className="space-y-3">
                        <ActionCard 
                            title="Draft New Document" 
                            desc="Create contracts, notices, etc."
                            icon={FileText}
                            onClick={() => navigate('/lawyer/draft')}
                        />
                        <ActionCard 
                            title="New Client Intake" 
                            desc="Add a new client profile"
                            icon={Users}
                            onClick={() => navigate('/lawyer/intake')}
                        />
                         <ActionCard 
                            title="Check Case Status" 
                            desc="Track court updates"
                            icon={Scale}
                            onClick={() => navigate('/lawyer/cases')}
                        />
                    </div>
                </div>

                {/* NOTIFICATIONS (Alert Box) */}
                <div className="bg-gradient-to-br from-white to-orange-50 p-5 rounded-2xl border border-orange-100 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600 shrink-0">
                            <AlertCircle size={20}/>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-gray-900">Profile Incomplete</h4>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                Your Bar License <b>{currentUser.email}</b> is pending verification. Some features may be limited.
                            </p>
                            <button className="mt-3 text-xs font-bold text-orange-700 hover:text-orange-900 hover:underline">
                                Complete Profile →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

// --- SUB COMPONENTS (Polished) ---

function DashboardCard({ label, value, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
                </div>
                <div className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    )
}

function ActionCard({ title, desc, icon: Icon, onClick }: any) {
    return (
        <button 
            onClick={onClick}
            className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-left group active:scale-98"
        >
            <div className="w-10 h-10 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-white transition-colors duration-300 shadow-sm">
                <Icon size={20}/>
            </div>
            <div>
                <span className="block font-bold text-sm text-gray-800 group-hover:text-gray-900">{title}</span>
                <span className="block text-xs text-gray-500 group-hover:text-gray-600">{desc}</span>
            </div>
            <ChevronRight size={16} className="ml-auto text-gray-300 group-hover:text-[#D4AF37] transition-colors"/>
        </button>
    )
}