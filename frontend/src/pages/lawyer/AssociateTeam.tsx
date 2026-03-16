import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
// Redux Imports
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

import { DashboardLayout } from '../../layouts/DashboardLayout';
import { 
  UserPlus, Briefcase, Share2, Star, Loader2, 
  X, Copy, Check, Mail, ShieldCheck,
  Search, Users, Inbox, MessageSquare, Send, Gavel
} from 'lucide-react';
import { Input } from "@/components/ui/input";

const API_URL = 'http://localhost:3000';

interface Associate {
  id: string;
  fullName: string;
  role: string;
  avatar?: string;
  jaiId?: string; 
}

interface RequestItem {
  id: string;
  senderId: string;
  senderName: string;
  senderJaiId: string;
  message: string;
  status: string;
}

export default function AssociateTeam() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  // -- REAL DATA STATES --
  const [associates, setAssociates] = useState<Associate[]>([]);
  const [searchResults, setSearchResults] = useState<Associate[]>([]);
  const [inboxRequests, setInboxRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // -- UI & TAB STATES --
  const [activeTab, setActiveTab] = useState<'team' | 'search' | 'inbox'>('team');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Modal & Action States
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReplyBoxId, setShowReplyBoxId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');

  const inviteLink = `${window.location.origin}/auth/register?ref=${currentUser?.id}`;

  // 1. Fetch Real Team Data
  useEffect(() => {
    const fetchAssociates = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/associates?excludeUserId=${currentUser?.id}`);
        setAssociates(res.data);
      } catch (error) {
        console.error('Failed to load associates:', error);
      } finally {
        setLoading(false);
      }
    };

    // Placeholder for when we build the Inbox API backend
    const fetchInbox = async () => {
      try {
        // const res = await axios.get(`${API_URL}/requests/inbox/${currentUser?.id}`);
        // setInboxRequests(res.data);
      } catch (error) {
        console.error('Failed to load inbox:', error);
      }
    };

    if (currentUser?.id) {
      fetchAssociates();
      fetchInbox();
    }
  }, [currentUser?.id]);

  // 2. Real Search Function (Calls your existing backend route)
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const res = await axios.get(`${API_URL}/users/lawyers?query=${searchQuery}`);
      // Filter out the current user from search results just in case
      const filtered = res.data.filter((u: any) => u.id !== currentUser?.id);
      setSearchResults(filtered);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  // Action Handlers
  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); 
  };

  const handleEmail = () => {
    const subject = encodeURIComponent("Join my legal team on J.A.I - S.E.T.H.U");
    const body = encodeURIComponent(`Hello,\n\nI would like to invite you to join my secure workspace.\n\nPlease register using my direct firm link below:\n${inviteLink}\n\nBest regards,\n${currentUser?.fullName}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // Mock handler for sending requests until backend is ready
  const handleSendRequest = (targetId: string) => {
    alert(`Connection request sent! Once the backend Request Module is live, this will save to the database.`);
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
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-gray-900">Network & Associates</h2>
          <p className="text-lg text-gray-600 mt-1">Manage your team, search advocates, and handle incoming requests.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-5 py-2.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg">
            <span className="text-sm font-medium text-gray-600 uppercase tracking-wider">Your JAI-ID</span>
            <p className="text-lg font-bold font-mono text-gray-900 leading-tight">
              {currentUser?.jaiId || 'JAI-PENDING'}
            </p>
          </div>

          <button 
            onClick={() => setShowInviteModal(true)}
            className="px-6 py-4 bg-black text-white rounded-lg font-bold flex items-center gap-2 hover:bg-gray-800 transition-all active:scale-95 shadow-md hover:shadow-lg text-base"
          >
             <UserPlus size={20} /> Recruit Associate
          </button>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex gap-2 border-b-2 border-gray-200 mb-8">
        <button 
          onClick={() => setActiveTab('team')}
          className={`pb-4 px-6 font-bold text-lg flex items-center gap-2 transition-all border-b-4 -mb-[2px] ${
            activeTab === 'team' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Users size={22} /> My Team
        </button>
        <button 
          onClick={() => setActiveTab('search')}
          className={`pb-4 px-6 font-bold text-lg flex items-center gap-2 transition-all border-b-4 -mb-[2px] ${
            activeTab === 'search' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Search size={22} /> Search Network
        </button>
        <button 
          onClick={() => setActiveTab('inbox')}
          className={`pb-4 px-6 font-bold text-lg flex items-center gap-2 transition-all border-b-4 -mb-[2px] ${
            activeTab === 'inbox' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Inbox size={22} /> Requests Inbox
          {inboxRequests.length > 0 && (
            <span className="bg-red-500 text-white text-sm px-2.5 py-0.5 rounded-full ml-1">{inboxRequests.length}</span>
          )}
        </button>
      </div>

      {/* TABS CONTENT */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: MY TEAM */}
        {activeTab === 'team' && (
          <motion.div key="team" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {associates.length === 0 ? (
              <div className="col-span-full text-center py-24 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <Users className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-xl text-gray-600 font-medium">Your team is currently empty.</p>
                <p className="text-base text-gray-500 mt-2">Use the Recruit button or Search Network to add members.</p>
              </div>
            ) : (
              associates.map((person) => (
                <div key={person.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-[#D4AF37]/50 transition-all group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center font-bold text-2xl text-gray-600 overflow-hidden border border-gray-200">
                      {person.avatar ? <img src={person.avatar} className="w-full h-full object-cover" /> : person.fullName[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">{person.fullName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm bg-gray-100 border border-gray-200 px-2.5 py-1 rounded text-gray-700 font-bold uppercase tracking-wider">{person.role}</span>
                        {person.jaiId && <span className="text-sm text-gray-500 font-mono font-medium">{person.jaiId}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-base text-gray-600 mb-6 font-medium">
                     <span className="flex items-center gap-1"><Star size={18} className="text-[#D4AF37] fill-current"/> 4.5</span>
                     <span>•</span>
                     <span>Active Member</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 py-3 bg-gray-50 border border-gray-200 rounded-lg font-bold text-base text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                      <Share2 size={18}/> Share
                    </button>
                    <button className="flex-1 py-3 bg-black text-white rounded-lg font-bold text-base hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                      <MessageSquare size={18}/> Chat
                    </button>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* TAB 2: SEARCH NETWORK */}
        {activeTab === 'search' && (
          <motion.div key="search" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="relative max-w-3xl flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-4 text-gray-400" size={24} />
                <Input 
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search globally by Lawyer Name or JAI-ID..." 
                  className="pl-14 h-16 bg-white border-2 border-gray-200 text-lg rounded-xl shadow-sm focus:border-black focus:ring-0"
                />
              </div>
              <button onClick={handleSearch} disabled={searchLoading} className="h-16 px-8 bg-[#D4AF37] hover:bg-[#c4a030] text-black font-bold text-lg rounded-xl transition-colors shadow-sm flex items-center">
                {searchLoading ? <Loader2 className="animate-spin" size={24}/> : 'Search'}
              </button>
            </div>

            <div className="space-y-4 max-w-4xl">
              {searchResults.length === 0 && !searchLoading && searchQuery && (
                 <p className="text-lg text-gray-500 bg-white p-6 rounded-xl border border-gray-200">No legal professionals found matching "{searchQuery}".</p>
              )}
              
              {searchResults.map((lawyer: any) => (
                <div key={lawyer.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gray-50 border border-gray-200 text-gray-600 rounded-full flex items-center justify-center font-bold text-2xl">
                      {lawyer.avatar ? <img src={lawyer.avatar} className="w-full h-full object-cover rounded-full" /> : lawyer.fullName[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900">{lawyer.fullName}</h3>
                      <p className="text-base text-gray-600 font-medium mt-1">
                        <span className="font-mono text-gray-500 mr-2">{lawyer.jaiId || 'JAI-ID'}</span> • <span className="ml-2 uppercase text-sm tracking-wider font-bold">{lawyer.role}</span>
                      </p>
                    </div>
                  </div>
                  <button onClick={() => handleSendRequest(lawyer.id)} className="px-6 py-3 bg-black text-white font-bold rounded-lg text-base flex items-center gap-2 hover:bg-gray-800 transition-all">
                    <UserPlus size={18}/> Send Request
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 3: REQUESTS INBOX */}
        {activeTab === 'inbox' && (
          <motion.div key="inbox" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-6">
            {inboxRequests.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <Inbox className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-xl text-gray-600 font-medium">Your inbox is empty.</p>
                <p className="text-base text-gray-500 mt-2">You have no pending connection requests.</p>
              </div>
            ) : (
              inboxRequests.map(req => (
                <div key={req.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 flex items-center gap-3">
                        {req.senderName} 
                        <span className="text-sm border border-gray-200 bg-gray-50 px-3 py-1 rounded text-gray-600 font-mono">{req.senderJaiId}</span>
                      </h3>
                      <p className="text-base text-gray-700 mt-3 font-medium bg-gray-50 p-4 rounded-xl border border-gray-100 italic">"{req.message}"</p>
                    </div>
                    
                    {/* Action Buttons (Accept / Reject) */}
                    <div className="flex gap-3 ml-6">
                      <button onClick={() => setShowReplyBoxId(req.id)} className="w-12 h-12 rounded-full border-2 border-red-100 bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 hover:border-red-200 transition-all shadow-sm" title="Reject Request">
                        <X size={24} strokeWidth={2.5} />
                      </button>
                      <button onClick={() => setShowReplyBoxId(req.id)} className="w-12 h-12 rounded-full border-2 border-green-100 bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 hover:border-green-200 transition-all shadow-sm" title="Accept Request">
                        <Check size={24} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  {/* Reply Message Box */}
                  <AnimatePresence>
                    {showReplyBoxId === req.id && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-4 border-t border-gray-100 flex gap-3 overflow-hidden">
                        <Input 
                          value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)}
                          placeholder="Add an optional message explaining your decision..." 
                          className="bg-white border-2 border-gray-200 text-base h-14 flex-1 rounded-xl focus:border-black"
                        />
                        <button className="px-6 h-14 bg-black text-white font-bold text-base rounded-xl flex items-center gap-2 hover:bg-gray-800 transition-all shadow-sm">
                          Send Reply <Send size={18}/>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ PROFESSIONAL RECRUITMENT MODAL (Intact from previous) */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3 text-gray-900">
                  <ShieldCheck size={24} className="text-[#D4AF37]" />
                  <h3 className="font-bold text-xl font-serif">Secure Invitation</h3>
                </div>
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8">
                <p className="text-base text-gray-600 mb-6 font-medium leading-relaxed">
                  Share this private link with your junior associates or co-counsels. When they register, they will automatically be linked to your firm's workspace.
                </p>

                <div className="flex items-center gap-2 p-4 bg-gray-50 border-2 border-gray-200 rounded-xl mb-8">
                  <div className="flex-1 text-base text-gray-700 font-mono truncate select-all">
                    {inviteLink}
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button 
                    onClick={handleCopy}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-sm ${
                      copied ? 'bg-green-50 text-green-700 border-2 border-green-200' : 'bg-black text-white hover:bg-gray-800 border-2 border-transparent'
                    }`}
                  >
                    {copied ? <><Check size={20} /> Link Copied!</> : <><Copy size={20} /> Copy Invite Link</>}
                  </button>
                  
                  <button 
                    onClick={handleEmail}
                    className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    <Mail size={20} /> Send via Email
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </DashboardLayout>
  );
}