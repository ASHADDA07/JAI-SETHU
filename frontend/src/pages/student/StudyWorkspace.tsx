import { useState, useEffect } from 'react';
import axios from 'axios';
// 1. Redux Imports
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/Card';
import { BookOpen, Clock, Trophy, Check, Search, Play, Pause, RotateCcw, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:3000';

export default function StudyWorkspace() {
  // 2. Get Real User Data
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [stats, setStats] = useState({ streak: 0, goals: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  // 3. Fetch Real Stats
  useEffect(() => {
    const fetchStudentStats = async () => {
        if (!currentUser?.id) return;
        try {
            // We will create this endpoint in the backend later. 
            // For now, it handles the "Loading" state gracefully.
            const res = await axios.get(`${API_URL}/users/${currentUser.id}/stats`);
            setStats(res.data);
        } catch (error) {
            console.log("No stats found, starting fresh.");
        } finally {
            setLoadingStats(false);
        }
    };
    fetchStudentStats();
  }, [currentUser?.id]);

  // Timer Logic
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      // Play sound or alert here in future
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentUser) return null;

  return (
    <DashboardLayout>
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-8 animate-in fade-in duration-500">
        <div>
           <h2 className="text-3xl font-serif font-bold text-black">
             Welcome, {currentUser.fullName || currentUser.email?.split('@')[0] || 'Student'}
           </h2>
           <p className="text-gray-500 mt-1">Master the law with focused study & practice.</p>
        </div>
        
        {/* REAL STREAK COUNTER */}
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
           <Trophy className="text-[#D4AF37]" size={20} />
           <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Current Streak</p>
              {loadingStats ? (
                  <Loader2 size={16} className="animate-spin ml-auto"/> 
              ) : (
                  <p className="text-lg font-bold text-black leading-none">{stats.streak} Days</p>
              )}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Study Tools */}
        <div className="space-y-6">
           
           {/* 1. FOCUS TIMER */}
           <div className="bg-[#1a1a1a] text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/20 rounded-full -mr-10 -mt-10 blur-xl"></div>
              
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold flex items-center gap-2"><Clock size={16} className="text-[#D4AF37]"/> Focus Timer</h3>
                 <span className="text-xs bg-white/10 px-2 py-1 rounded">Pomodoro</span>
              </div>

              <div className="text-6xl font-mono font-bold text-center mb-8 tracking-wider">
                 {formatTime(timeLeft)}
              </div>

              <div className="flex justify-center gap-4">
                 <button 
                   onClick={() => setTimerActive(!timerActive)}
                   className="w-12 h-12 rounded-full bg-[#D4AF37] text-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-[#D4AF37]/20"
                 >
                    {timerActive ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1"/>}
                 </button>
                 <button 
                   onClick={() => { setTimerActive(false); setTimeLeft(25*60); }}
                   className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                 >
                    <RotateCcw size={20} />
                 </button>
              </div>
           </div>

           {/* 2. TODAY'S GOALS (Placeholder for Phase 2 DB) */}
           <Card title="Today's Targets">
              <div className="space-y-3">
                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#D4AF37]"></div>
                    <span className="text-sm font-medium text-gray-700">Read Kesavananda Bharati Case</span>
                 </div>
                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-5 h-5 rounded border-2 border-[#D4AF37] bg-[#D4AF37] flex items-center justify-center cursor-pointer">
                        <Check size={12} className="text-black" strokeWidth={4}/>
                    </div>
                    <span className="text-sm font-medium text-gray-400 line-through">Draft a Mock Bail Application</span>
                 </div>
              </div>
           </Card>

        </div>

        {/* RIGHT COLUMN: Library & Recent */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* LANDMARK CASES LIBRARY (Static Resource for now) */}
            <Card 
              title="Landmark Judgments Library" 
              action={<div className="relative"><input type="text" placeholder="Search cases..." className="pl-8 pr-3 py-1 bg-gray-50 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-[#D4AF37] outline-none"/><Search size={12} className="absolute left-2.5 top-2 text-gray-400"/></div>}
            >
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                     { title: "Kesavananda Bharati v. State of Kerala", tag: "Basic Structure", year: "1973" },
                     { title: "Maneka Gandhi v. Union of India", tag: "Art 21 - Personal Liberty", year: "1978" },
                     { title: "Vishaka v. State of Rajasthan", tag: "Workplace Safety", year: "1997" },
                     { title: "Puttaswamy v. Union of India", tag: "Right to Privacy", year: "2017" }
                  ].map((c, i) => (
                     <div key={i} className="group p-4 border border-gray-200 rounded-xl hover:border-[#D4AF37] hover:shadow-md transition-all cursor-pointer bg-white">
                        <div className="flex justify-between items-start mb-2">
                           <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded">{c.year}</span>
                           <BookOpen size={16} className="text-gray-300 group-hover:text-[#D4AF37] transition-colors" />
                        </div>
                        <h4 className="font-serif font-bold text-gray-900 leading-tight mb-1">{c.title}</h4>
                        <p className="text-xs text-[#D4AF37] font-medium">{c.tag}</p>
                     </div>
                  ))}
               </div>
            </Card>

        </div>
      </div>
    </DashboardLayout>
  );
}