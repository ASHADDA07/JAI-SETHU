import { useState, useRef } from 'react';
import { Send, Search, MoreVertical, Phone, Video, Calendar, Clock, Check, Minimize2, Maximize2, X, Minus } from 'lucide-react';

interface ChatProps {
  title: string;
  subtitle?: string;
  isAI?: boolean;
}

export const ChatLayout = ({ title, subtitle, isAI }: ChatProps) => {
  const [messages, setMessages] = useState([
    { id: 1, text: isAI ? "Jai Sethu AI online." : "Hello Advocate, when can we meet for the bail hearing discussion?", sender: 'them', time: '10:00 AM' }
  ]);
  const [input, setInput] = useState('');
  
  // DRAGGABLE WINDOW STATE
  const [showScheduler, setShowScheduler] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Event Details
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDetails, setMeetingDetails] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [meetingDate, setMeetingDate] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, sender: 'me', time: 'Now' }]);
    setInput('');
  };

  const sendMeetingInvite = () => {
    const inviteMsg = `Meeting: ${meetingTitle}\nDetails: ${meetingDetails}\nDate: ${meetingDate} | Time: ${meetingTime}\nPlease confirm.`;
    setMessages([...messages, { id: Date.now(), text: inviteMsg, sender: 'me', time: 'Now' }]);

    // Sync with Dashboard
    if (meetingDate) {
        const dayKey = parseInt(meetingDate.split('-')[2]);
        const currentEvents = JSON.parse(localStorage.getItem('jai-sethu-events') || '{}');
        currentEvents[dayKey] = {
            type: 'meeting',
            title: meetingTitle || "Client Meeting",
            details: meetingDetails,
            time: meetingTime
        };
        localStorage.setItem('jai-sethu-events', JSON.stringify(currentEvents));
        window.dispatchEvent(new Event('storage'));
    }

    setShowScheduler(false);
    setMeetingTitle(""); setMeetingDetails(""); setMeetingTime(""); setMeetingDate("");
  };

  // Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-legal relative">
      
      {/* Sidebar - Shows Clients AND Juniors */}
      <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-4 border-b border-gray-200">
           <div className="relative">
             <input type="text" placeholder="Search people..." className="w-full bg-white border border-gray-300 rounded-lg py-2 pl-4 text-sm focus-gold" />
             <Search className="absolute right-3 top-2.5 text-gray-400" size={16}/>
           </div>
        </div>
        <div className="flex-1 p-2 space-y-2">
            {/* Active Chat */}
            <div className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm border-l-4 border-l-judicial-gold cursor-pointer">
                <h4 className="font-bold text-sm text-black">Ramesh Kumar <span className="text-[10px] bg-gray-100 text-gray-500 px-1 rounded ml-1">Client</span></h4>
                <p className="text-xs text-gray-500">Bail Hearing Discussion</p>
            </div>
            {/* Junior Example */}
            <div className="p-4 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 cursor-pointer transition-colors">
                <h4 className="font-bold text-sm text-gray-700">Arjun Verma <span className="text-[10px] bg-blue-50 text-blue-600 px-1 rounded ml-1">Junior</span></h4>
                <p className="text-xs text-gray-500">Draft review pending...</p>
            </div>
        </div>
      </div>
      
      {/* Main Chat */}
      <div className="flex-1 flex flex-col bg-white relative">
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white shadow-sm">
          <div>
            <h3 className="text-black font-serif font-bold">{title}</h3>
            {subtitle && <p className="text-xs text-judicial-gold uppercase tracking-wider font-bold">{subtitle}</p>}
          </div>
          
          {/* --- RESTORED CALL & VIDEO BUTTONS --- */}
          <div className="flex gap-2 text-gray-400 items-center">
             {!isAI && (
                 <>
                    <button 
                        onClick={() => { setShowScheduler(!showScheduler); setPosition({x:0,y:0}); setIsMinimized(false); }}
                        className={`p-2 rounded hover:bg-judicial-gold hover:text-black transition-colors ${showScheduler ? 'bg-judicial-gold text-black' : ''}`} 
                        title="Schedule Meeting"
                    >
                        <Calendar size={20}/>
                    </button>
                    
                    {/* Phone Call */}
                    <button className="p-2 rounded hover:bg-green-50 hover:text-green-600 transition-colors" title="Audio Call">
                        <Phone size={20}/> 
                    </button>
                    
                    {/* Video Call */}
                    <button className="p-2 rounded hover:bg-blue-50 hover:text-blue-600 transition-colors" title="Video Call">
                        <Video size={20}/>
                    </button>
                 </>
             )}
             <MoreVertical className="hover:text-black cursor-pointer ml-2" size={20}/>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 relative">
          
          {/* --- DRAGGABLE WINDOW --- */}
          {showScheduler && (
            <div 
                className={`absolute z-50 bg-white rounded-xl shadow-2xl border border-judicial-gold overflow-hidden transition-all duration-100 ${isMaximized ? 'inset-4' : 'w-96'}`}
                style={!isMaximized ? { top: position.y || '16px', right: position.x ? 'auto' : '16px', left: position.x || 'auto' } : {}}
            >
                <div onMouseDown={handleMouseDown} className="bg-legal-black text-white p-2 px-4 flex justify-between items-center cursor-move select-none">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                        <Clock size={12} className="text-judicial-gold"/> Quick Schedule
                    </span>
                    <div className="flex items-center gap-2" onMouseDown={e => e.stopPropagation()}>
                        <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/10 rounded"><Minus size={12}/></button>
                        <button onClick={() => { setIsMaximized(!isMaximized); setPosition({x:0, y:0}); }} className="p-1 hover:bg-white/10 rounded">
                            {isMaximized ? <Minimize2 size={12}/> : <Maximize2 size={12}/>}
                        </button>
                        <button onClick={() => setShowScheduler(false)} className="p-1 hover:bg-red-500 rounded"><X size={12}/></button>
                    </div>
                </div>

                {!isMinimized && (
                    <div className="p-5 space-y-4 bg-white">
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Title</label>
                            <input type="text" className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-sm font-bold focus-gold" placeholder="Meeting Title" value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} />
                        </div>
                        <div>
                             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Details</label>
                             <textarea className="w-full p-2 bg-white border border-gray-200 rounded text-xs focus-gold resize-none h-24" placeholder="Agenda..." value={meetingDetails} onChange={(e) => setMeetingDetails(e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                             <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</label>
                                <input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} className="w-full p-2 border border-gray-200 rounded text-xs focus-gold" />
                             </div>
                             <div>
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Time</label>
                                <input type="time" value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} className="w-full p-2 border border-gray-200 rounded text-xs focus-gold" />
                             </div>
                        </div>
                        <button onClick={sendMeetingInvite} className="w-full btn-gold py-3 rounded text-sm font-bold flex items-center justify-center gap-2">
                            <Check size={14}/> Send Invite
                        </button>
                    </div>
                )}
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-4 rounded-xl text-sm shadow-sm ${msg.sender === 'me' ? 'bg-judicial-gold text-black font-medium rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}>
                <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-gray-200 flex gap-4">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." onKeyDown={(e) => e.key === 'Enter' && handleSend()} className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-black focus-gold" />
            <button onClick={handleSend} className="p-3 btn-gold rounded-lg"><Send size={20} /></button>
        </div>
      </div>
    </div>
  );
};