import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

import { DashboardLayout } from '../../layouts/DashboardLayout';
import {
  Briefcase, Users, Scale, FileText,
  Calendar, Plus, MapPin, ChevronRight,
  MessageSquare, AlertCircle, Clock, Gavel, Loader2, X, CheckCircle, AlignLeft
} from 'lucide-react';

const API_URL = 'http://localhost:3000';

// ─── Axios instance with auth token ───────────────────────────────────────────
// All requests automatically include the JWT token stored in localStorage.
// Your NestJS @UseGuards(JwtAuthGuard) endpoints will now accept them.
const api = axios.create({ baseURL: API_URL });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function LawyerDashboard() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  // ─── REAL DATA STATES ─────────────────────────────────────────────────────
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [activeCaseCount, setActiveCaseCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // for modals

  // ─── MODAL STATES ─────────────────────────────────────────────────────────
  const [isEventModalOpen, setEventModalOpen] = useState(false);
  const [isAcceptModalOpen, setAcceptModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  // ─── FORM STATES ──────────────────────────────────────────────────────────
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', type: '', location: '', description: '' });
  const [consultation, setConsultation] = useState({ date: '', time: '' });

  // ─── MOTIVATIONAL GREETINGS ───────────────────────────────────────────────
  const greetingData = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { time: 'Good morning', quote: 'Ready to conquer the courtroom today? Let\'s pursue justice.' };
    if (hour < 17) return { time: 'Good afternoon', quote: 'Sharp mind, strong arguments. Keep up the great momentum!' };
    return { time: 'Good evening', quote: 'Great work today. Rest, recharge, and prepare for tomorrow\'s victories.' };
  }, []);

  if (!currentUser) return null;

  // ─── 1. FETCH ALL REAL DATA ON LOAD ───────────────────────────────────────
  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Run all three requests in parallel for speed
        const [inquiriesRes, eventsRes, casesRes] = await Promise.allSettled([
          // Pending client inquiries (messages not yet accepted)
          api.get(`/messages/inbox?userId=${currentUser.id}`),
          // Lawyer's scheduled events from DB
          api.get(`/events?lawyerId=${currentUser.id}`),
          // Count of active cases for stats card
          api.get(`/cases?lawyerId=${currentUser.id}&status=active`),
        ]);

        if (inquiriesRes.status === 'fulfilled') setInquiries(inquiriesRes.value.data);
        if (eventsRes.status === 'fulfilled') {
          // Sort events by date ascending
          const sorted = eventsRes.value.data.sort(
            (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          setEvents(sorted);
        }
        if (casesRes.status === 'fulfilled') {
          // Backend returns array or { count: N } — handle both
          const data = casesRes.value.data;
          setActiveCaseCount(Array.isArray(data) ? data.length : data.count ?? 0);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser?.id]);

  // ─── 2. ADD EVENT — saves to DB, then updates local state ─────────────────
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const payload = {
        ...newEvent,
        lawyerId: currentUser.id,
      };
      const res = await api.post('/events', payload);
      // Use the DB-returned object (has a real ID, timestamps, etc.)
      const savedEvent = res.data;
      setEvents(prev =>
        [...prev, savedEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      );
      setEventModalOpen(false);
      setNewEvent({ title: '', date: '', time: '', type: '', location: '', description: '' });
    } catch (error) {
      console.error('Failed to save event:', error);
      alert('Could not save event. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // ─── 3. ACCEPT CASE — creates a real Case in DB + schedules a real Event ──
  const handleAcceptCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;
    setActionLoading(true);
    try {
      // Step 1: Create the case in the database
      // This converts the raw inquiry into an official active case
      await api.post('/cases', {
        lawyerId: currentUser.id,
        clientId: selectedClient.clientId ?? selectedClient.id, // adjust field name to match your schema
        inquiryId: selectedClient.id,
        status: 'active',
        title: `Case: ${selectedClient.name}`,
      });

      // Step 2: Schedule the consultation as a real calendar event in DB
      const eventPayload = {
        lawyerId: currentUser.id,
        title: `Consultation: ${selectedClient.name}`,
        date: consultation.date,
        time: consultation.time,
        type: 'Client Meeting',
        location: 'Virtual / Office',
        description: 'Initial case evaluation and onboarding.',
      };
      const eventRes = await api.post('/events', eventPayload);
      const savedEvent = eventRes.data;

      // Step 3: Update local state — add event, remove inquiry from inbox
      setEvents(prev =>
        [...prev, savedEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      );
      setInquiries(prev => prev.filter(msg => msg.id !== selectedClient.id));
      // Bump active case count
      setActiveCaseCount(prev => prev + 1);

      setAcceptModalOpen(false);
      setSelectedClient(null);
      setConsultation({ date: '', time: '' });
    } catch (error) {
      console.error('Failed to accept case:', error);
      alert('Could not accept case. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // ─── 4. URGENCY CALCULATOR ────────────────────────────────────────────────
  const getEventUrgency = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateStr.toLowerCase() === 'today') return { color: 'border-red-500', text: 'text-red-600', bg: 'bg-red-500', label: 'TODAY' };
    if (dateStr.toLowerCase() === 'tomorrow') return { color: 'border-orange-500', text: 'text-orange-600', bg: 'bg-orange-500', label: 'TOMORROW' };

    const eventDate = new Date(dateStr);
    eventDate.setHours(0, 0, 0, 0);

    if (eventDate.getTime() <= today.getTime()) return { color: 'border-red-500', text: 'text-red-600', bg: 'bg-red-500', label: 'TODAY' };
    if (eventDate.getTime() === tomorrow.getTime()) return { color: 'border-orange-500', text: 'text-orange-600', bg: 'bg-orange-500', label: 'TOMORROW' };
    return { color: 'border-green-500', text: 'text-green-600', bg: 'bg-green-500', label: eventDate.toLocaleDateString() };
  };

  // ─── REAL STATS (all from DB) ──────────────────────────────────────────────
  const stats = {
    activeCases: activeCaseCount,        // real case count from /cases endpoint
    newClients: inquiries.length,         // real pending inquiry count
    pendingDocs: 0,                       // TODO: wire to /drafts?status=pending when Phase 4 is ready
    upcomingHearings: events.length,      // real event count from /events endpoint
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
          <span className="ml-3 text-gray-600 font-bold text-lg">Loading Dashboard...</span>
        </div>
      </DashboardLayout>
    );
  }

  const advocateName = currentUser?.fullName || (currentUser as any)?.name || 'Advocate';

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">

        {/* 1. HEADER */}
        <div className="relative overflow-hidden bg-white p-8 rounded-2xl border border-gray-200 shadow-sm group hover:shadow-md transition-all duration-300 z-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-judicial-gold/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-[#D4AF37]/10 transition-all duration-500"></div>
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-serif font-black text-gray-900 tracking-tight">
                {greetingData.time}, <span className="text-[#D4AF37]">{advocateName}</span>.
              </h1>
              <p className="text-lg text-gray-600 font-medium mt-2 italic">"{greetingData.quote}"</p>
              <div className="flex items-center gap-4 mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-bold border border-gray-200">
                  <Briefcase size={14} className="text-[#D4AF37]" /> {currentUser.role}
                </span>
                <span className="text-sm text-gray-600 font-medium flex items-center gap-2">
                  JAI-ID: <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{currentUser.jaiId || 'JAI-PENDING'}</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                onClick={() => navigate('/lawyer/messages')}
                className="flex-1 md:flex-none px-6 py-3 bg-white border-2 border-gray-200 text-gray-800 font-bold text-base rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
              >
                <MessageSquare size={18} /> Messages
              </button>
              <button
                onClick={() => setEventModalOpen(true)}
                className="flex-1 md:flex-none px-6 py-3 bg-[#D4AF37] text-black font-bold text-base rounded-xl hover:bg-[#c4a030] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 group"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> Add Event
              </button>
            </div>
          </div>
        </div>

        {/* 2. STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard label="Active Cases" value={stats.activeCases} icon={Gavel} color="text-blue-600" bg="bg-blue-50" />
          <DashboardCard label="Pending Inquiries" value={stats.newClients} icon={Users} color="text-green-600" bg="bg-green-50" />
          <DashboardCard label="Drafts Pending" value={stats.pendingDocs} icon={FileText} color="text-purple-600" bg="bg-purple-50" />
          <DashboardCard label="Total Events" value={stats.upcomingHearings} icon={Scale} color="text-[#D4AF37]" bg="bg-yellow-50" />
        </div>

        {/* 3. MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: Schedule + Inquiries */}
          <div className="lg:col-span-2 space-y-8">

            {/* Schedule */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <Calendar className="text-[#D4AF37]" size={24} /> Your Schedule
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {events.length === 0 ? (
                  <div className="p-10 text-center text-gray-500 font-medium">
                    <Calendar size={40} className="mx-auto mb-3 text-gray-300" />
                    No upcoming events. Click "Add Event" to schedule your day.
                  </div>
                ) : (
                  events.map((event) => {
                    const urgency = getEventUrgency(event.date);
                    return (
                      <div key={event.id} className={`group relative p-6 hover:bg-gray-50 transition-all duration-300 border-l-4 ${urgency.color}`}>
                        <div className="flex items-start gap-6">
                          <div className="w-24 shrink-0 flex flex-col items-center justify-center pt-1 border-r border-gray-100 pr-4">
                            <span className={`text-base font-black ${urgency.text}`}>{event.time}</span>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1 text-center">{urgency.label}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="inline-block px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide bg-gray-100 text-gray-700 border border-gray-200">
                                {event.type || 'Event'}
                              </span>
                              {urgency.color === 'border-red-500' && (
                                <span className={`animate-pulse w-2.5 h-2.5 rounded-full ${urgency.bg} shadow-[0_0_8px_rgba(239,68,68,0.6)]`}></span>
                              )}
                            </div>
                            <h4 className="font-bold text-gray-900 text-lg mb-1 truncate group-hover:text-black transition-colors">{event.title}</h4>
                            {event.description && (
                              <p className="text-sm text-gray-500 font-medium mb-3 line-clamp-2">{event.description}</p>
                            )}
                            <div className="flex items-center gap-6 text-sm text-gray-600 font-medium mt-2">
                              <span className="flex items-center gap-2"><Clock size={16} /> Scheduled</span>
                              <span className="flex items-center gap-2"><MapPin size={16} /> {event.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Pending Inquiries */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Users size={24} className="text-[#D4AF37]" /> Pending Client Inquiries
                </h2>
                <button onClick={() => navigate('/lawyer/messages')} className="text-sm font-bold text-[#D4AF37] hover:underline">View All</button>
              </div>
              {inquiries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-gray-100">
                  <MessageSquare size={32} className="opacity-50 mb-3" />
                  <p className="text-base font-medium text-gray-600">No new client inquiries right now.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((chat) => (
                    <div key={chat.id} className="p-5 bg-white border-2 border-gray-100 rounded-xl flex items-center justify-between hover:border-gray-200 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg">
                          {chat.name ? chat.name[0] : 'U'}
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-gray-900">{chat.name}</h4>
                          <p className="text-sm text-gray-600 mt-1 max-w-sm truncate">"{chat.lastMsg || 'New inquiry received.'}"</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setSelectedClient(chat); setAcceptModalOpen(true); }}
                        className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 font-bold rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2"
                      >
                        <CheckCircle size={16} /> Accept & Schedule
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Quick Actions */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-5 flex items-center gap-2">
                <Plus size={16} /> Quick Actions
              </h2>
              <div className="space-y-4">
                <ActionCard title="Draft Legal Document" desc="Contracts, notices, affidavits" icon={FileText} onClick={() => navigate('/lawyer/draft')} />
                <ActionCard title="Manage Cases" desc="Track court updates and files" icon={Scale} onClick={() => navigate('/lawyer/cases')} />
                <ActionCard title="Associate Team" desc="Assign work to juniors" icon={Users} onClick={() => navigate('/lawyer/team')} />
              </div>
            </div>
            <div className="bg-gradient-to-br from-white to-orange-50 p-6 rounded-2xl border border-orange-100 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 rounded-xl text-orange-600 shrink-0">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-base text-gray-900">Profile Verification Pending</h4>
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed font-medium">
                    Please upload your Bar Council ID to fully activate your public directory listing.
                  </p>
                  <button
                    onClick={() => navigate('/lawyer/profile')}
                    className="mt-4 text-sm font-bold text-orange-700 hover:text-orange-900 hover:underline flex items-center gap-1"
                  >
                    Complete Profile <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          MODAL 1: ADD EVENT — saves to DB via POST /events
      ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isEventModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-xl font-serif text-gray-900">Add Schedule Event</h3>
                <button onClick={() => setEventModalOpen(false)} className="text-gray-400 hover:text-gray-900 bg-white rounded-full p-2"><X size={20} /></button>
              </div>
              <form onSubmit={handleAddEvent} className="p-6 space-y-5">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Event Title</label>
                  <input required value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} type="text" className="w-full border-2 border-gray-200 rounded-xl p-3 text-base focus:border-black outline-none" placeholder="e.g. High Court Hearing" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Date</label>
                    <input required value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} type="date" className="w-full border-2 border-gray-200 rounded-xl p-3 text-base focus:border-black outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Time</label>
                    <input required value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} type="time" className="w-full border-2 border-gray-200 rounded-xl p-3 text-base focus:border-black outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Location</label>
                    <input required value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} type="text" className="w-full border-2 border-gray-200 rounded-xl p-3 text-base focus:border-black outline-none" placeholder="e.g. Court Hall 4" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Category / Type</label>
                    <input required value={newEvent.type} onChange={e => setNewEvent({ ...newEvent, type: e.target.value })} type="text" list="event-types" className="w-full border-2 border-gray-200 rounded-xl p-3 text-base focus:border-black outline-none bg-white" placeholder="e.g. Hearing, Client Call" />
                    <datalist id="event-types">
                      <option value="Court Hearing" />
                      <option value="Client Consultation" />
                      <option value="Document Filing" />
                      <option value="Mediation" />
                      <option value="Internal Team Meeting" />
                    </datalist>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2"><AlignLeft size={14} /> Extra Notes / Message</label>
                  <textarea value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} className="w-full border-2 border-gray-200 rounded-xl p-3 text-base focus:border-black outline-none min-h-[100px] resize-none" placeholder="Add details, zoom links, or case notes here..." />
                </div>
                <button type="submit" disabled={actionLoading} className="w-full py-4 mt-2 bg-black text-white font-bold rounded-xl text-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                  {actionLoading ? <><Loader2 size={20} className="animate-spin" /> Saving...</> : 'Save Event'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════
          MODAL 2: ACCEPT CASE — POST /cases + POST /events
      ══════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isAcceptModalOpen && selectedClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-green-50 p-6 border-b border-green-100 flex items-start gap-4">
                <CheckCircle className="text-green-600 shrink-0" size={28} />
                <div>
                  <h3 className="font-bold text-xl text-gray-900">Accept Case Request</h3>
                  <p className="text-sm text-green-800 mt-1 font-medium">You are accepting an inquiry from {selectedClient.name}. Schedule the initial consultation below.</p>
                </div>
              </div>
              <form onSubmit={handleAcceptCase} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Consultation Date</label>
                    <input required value={consultation.date} onChange={e => setConsultation({ ...consultation, date: e.target.value })} type="date" className="w-full border-2 border-gray-200 rounded-xl p-3 text-base focus:border-green-600 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Time</label>
                    <input required value={consultation.time} onChange={e => setConsultation({ ...consultation, time: e.target.value })} type="time" className="w-full border-2 border-gray-200 rounded-xl p-3 text-base focus:border-green-600 outline-none" />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setAcceptModalOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                  <button type="submit" disabled={actionLoading} className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                    {actionLoading ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : 'Confirm & Schedule'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

// ─── SUB COMPONENTS (unchanged) ───────────────────────────────────────────────
function DashboardCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</p>
          <h3 className="text-4xl font-black text-gray-900 mt-2">{value}</h3>
        </div>
        <div className={`w-14 h-14 ${bg} ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}

function ActionCard({ title, desc, icon: Icon, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-50 border-2 border-transparent hover:border-[#D4AF37]/50 hover:bg-white transition-all text-left group active:scale-95"
    >
      <div className="w-12 h-12 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-white transition-colors duration-300 shadow-sm shrink-0">
        <Icon size={24} />
      </div>
      <div>
        <span className="block font-bold text-base text-gray-900">{title}</span>
        <span className="block text-sm text-gray-600 mt-0.5 font-medium">{desc}</span>
      </div>
      <ChevronRight size={20} className="ml-auto text-gray-400 group-hover:text-[#D4AF37] transition-colors" />
    </button>
  );
}