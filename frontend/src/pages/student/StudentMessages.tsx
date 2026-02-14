import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../../context/SocketContext';
// 1. Redux Imports
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

import { DashboardLayout } from '../../layouts/DashboardLayout';
import { 
  Send, MessageSquare, Search, MoreVertical, 
  Phone, Video, Paperclip, CheckCheck, Loader2
} from 'lucide-react';

const API_URL = 'http://localhost:3000';

export default function StudentMessages() {
  // 2. Get User from Redux
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  const { socket } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const initialLawyer = location.state?.lawyer;

  // -- STATE --
  const [inbox, setInbox] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<any>(null);

  // 0. Safety Check
  if (!currentUser) return null;
  

  // 1. Fetch Inbox (List of people I talked to)
  const fetchInbox = async () => {
    try {
        const res = await axios.get(`${API_URL}/messages/inbox?userId=${currentUser.id}`);
        let inboxData = res.data;

        // If redirected from "Find Lawyer", ensure they appear in the list
        if (initialLawyer && !inboxData.find((c:any) => c.id === initialLawyer.id)) {
            const newChat = {
                id: initialLawyer.id, 
                name: initialLawyer.fullName, 
                lastMsg: "Drafting message...", 
                time: new Date().toISOString()
            };
            inboxData = [newChat, ...inboxData];
            setActiveChat(newChat); // Auto-select them
        } else if (initialLawyer) {
            // If they exist, find and select them
            const existing = inboxData.find((c:any) => c.id === initialLawyer.id);
            setActiveChat(existing);
        }
        
        setInbox(inboxData);
    } catch(e) { console.error(e); } finally { setLoading(false); }
  };
  

  // 2. Fetch Chat History
  const fetchHistory = async () => {
    if (!activeChat) return;
    try {
        const res = await axios.get(`${API_URL}/messages/history?u1=${currentUser.id}&u2=${activeChat.id}`);
        setMessages(res.data);
        // Scroll to bottom
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch(e) { console.error(e); }
  };
  
// 3. Send Message
  const sendMessage = async () => {
      // Safety Check
      if (!input.trim() || !activeChat || !currentUser) return;
      
      const payload = {
          senderId: currentUser.id,
          receiverId: activeChat.id,
          content: input
      };

      // 1. Send via Socket (Backend saves it automatically)
      socket?.emit('sendMessage', payload);
      
      // 2. Update UI immediately
      setMessages(prev => [...prev, { ...payload, createdAt: new Date().toISOString() }]); 
      setInput('');
  };

// 4. REAL-TIME LISTENER
  useEffect(() => {
    if (!socket) return;

    socket.on('receiveMessage', (newMessage: any) => {
      // If the message belongs to the current chat, add it to the list
      if (activeChat && (newMessage.senderId === activeChat.id || newMessage.receiverId === activeChat.id)) {
        setMessages((prev) => [...prev, newMessage]);
        // Scroll to bottom
        setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }
      // If it's a new person, refresh the inbox
      fetchInbox();
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [socket, activeChat]);
  
  // Effects
  useEffect(() => { fetchInbox(); }, [currentUser.id]);
  useEffect(() => { 
      if(activeChat) {
          fetchHistory();
          const interval = setInterval(fetchHistory, 3000); // Poll for new messages
          return () => clearInterval(interval);
      }
  }, [activeChat]);

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-140px)] bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
        
        {/* --- LEFT: INBOX SIDEBAR --- */}
        <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
           {/* Header & Search */}
           <div className="p-4 border-b border-gray-200 bg-white">
               <h2 className="text-xl font-serif font-bold text-gray-900 mb-4">Messages</h2>
               <div className="relative">
                   <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                   <input 
                     type="text" 
                     placeholder="Search chats..." 
                     className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#D4AF37] outline-none transition-all"
                   />
               </div>
           </div>
           
           {/* Conversation List */}
           <div className="overflow-y-auto flex-1">
              {loading && <div className="p-4 text-center text-gray-400 text-sm"><Loader2 className="animate-spin mx-auto mb-2"/>Loading...</div>}
              
              {!loading && inbox.length === 0 && (
                  <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                      <MessageSquare size={32} className="mb-2 opacity-20"/>
                      <p className="text-sm">No conversations yet.</p>
                      <button onClick={() => navigate('/public/connect')} className="text-xs text-[#D4AF37] font-bold mt-2 hover:underline">Find a Lawyer</button>
                  </div>
              )}

              {inbox.map((contact) => (
                  <div 
                    key={contact.id} 
                    onClick={() => setActiveChat(contact)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-white transition-all flex gap-3 items-center
                        ${activeChat?.id === contact.id ? 'bg-white border-l-4 border-l-[#D4AF37] shadow-sm' : 'border-l-4 border-l-transparent'}
                    `}
                  >
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-[#1a1a1a] text-[#D4AF37] flex items-center justify-center font-bold text-sm shrink-0">
                          {contact.name[0]}
                      </div>
                      
                      {/* Text Info */}
                      <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-1">
                              <h4 className={`text-sm truncate ${activeChat?.id === contact.id ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                  {contact.name}
                              </h4>
                              <span className="text-[10px] text-gray-400">
                                  {new Date(contact.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                          </div>
                          <p className="text-xs text-gray-500 truncate">{contact.lastMsg}</p>
                      </div>
                  </div>
              ))}
           </div>
        </div>

        {/* --- RIGHT: CHAT AREA --- */}
        {activeChat ? (
            <div className="flex-1 flex flex-col bg-[#F3F4F6]">
                
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white shadow-sm flex justify-between items-center z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#D4AF37] text-black rounded-full flex items-center justify-center font-bold">
                            {activeChat.name[0]}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{activeChat.name}</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-xs text-gray-500">Online</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Phone size={20}/></button>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><Video size={20}/></button>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><MoreVertical size={20}/></button>
                    </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                    {messages.map((msg, idx) => {
                        const isMe = msg.senderId === currentUser.id;
                        return (
                            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`
                                    max-w-[70%] p-3 rounded-2xl text-sm shadow-sm relative group
                                    ${isMe 
                                        ? 'bg-[#1a1a1a] text-white rounded-tr-none' 
                                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'}
                                `}>
                                    {msg.content}
                                    <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${isMe ? 'text-gray-400' : 'text-gray-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        {isMe && <CheckCheck size={12} className="text-[#D4AF37]"/>}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={scrollRef}></div>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <div className="flex items-end gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 focus-within:border-[#D4AF37] focus-within:ring-1 focus-within:ring-[#D4AF37]/20 transition-all">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors"><Paperclip size={20}/></button>
                        <textarea 
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm max-h-32 resize-none py-2"
                            placeholder="Type your message..."
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage();
                                }
                            }}
                        />
                        <button 
                            onClick={sendMessage}
                            disabled={!input.trim()} 
                            className="p-2 bg-[#D4AF37] text-black rounded-lg hover:bg-[#bfa030] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>

            </div>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                    <MessageSquare size={40} className="text-[#D4AF37]" />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Select a Conversation</h3>
                <p className="text-gray-500 max-w-sm text-center mb-8">
                    Choose a lawyer from the sidebar to start chatting or search for a new legal expert.
                </p>
                <button 
                    onClick={() => navigate('/public/connect')}
                    className="px-6 py-3 bg-[#1a1a1a] text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-md flex items-center gap-2"
                >
                    <Search size={18} /> Find a Lawyer
                </button>
            </div>
        )}

      </div>
    </DashboardLayout>
  );
}