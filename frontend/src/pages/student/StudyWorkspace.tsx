import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/Card';
import { BookOpen, Clock, Trophy, Target, Book, ChevronRight, Search, Play, Pause, RotateCcw } from 'lucide-react';

export default function StudyWorkspace() {
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes

  // Timer Logic
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <DashboardLayout role="student">
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-8">
        <div>
           <h2 className="text-3xl font-serif font-bold text-black">Student Workspace</h2>
           <p className="text-gray-500 mt-1">Master the law with focused study & practice.</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
           <Trophy className="text-judicial-gold" size={20} />
           <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Current Streak</p>
              <p className="text-lg font-bold text-black leading-none">12 Days</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Study Tools */}
        <div className="space-y-6">
           
           {/* 1. FOCUS TIMER */}
           <div className="bg-legal-black text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-judicial-gold/20 rounded-full -mr-10 -mt-10 blur-xl"></div>
              
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold flex items-center gap-2"><Clock size={16} className="text-judicial-gold"/> Focus Timer</h3>
                 <span className="text-xs bg-white/10 px-2 py-1 rounded">Pomodoro</span>
              </div>

              <div className="text-6xl font-mono font-bold text-center mb-8 tracking-wider">
                 {formatTime(timeLeft)}
              </div>

              <div className="flex justify-center gap-4">
                 <button 
                   onClick={() => setTimerActive(!timerActive)}
                   className="w-12 h-12 rounded-full bg-judicial-gold text-black flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-judicial-gold/20"
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

           {/* 2. TODAY'S GOALS */}
           <Card title="Today's Targets">
              <div className="space-y-3">
                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center cursor-pointer hover:border-judicial-gold"></div>
                    <span className="text-sm font-medium text-gray-700">Read Kesavananda Bharati Case</span>
                 </div>
                 <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-5 h-5 rounded border-2 border-judicial-gold bg-judicial-gold flex items-center justify-center cursor-pointer">
                        <Check size={12} className="text-black" strokeWidth={4}/>
                    </div>
                    <span className="text-sm font-medium text-gray-400 line-through">Draft a Mock Bail Application</span>
                 </div>
              </div>
           </Card>

        </div>

        {/* RIGHT COLUMN: Library & Recent */}
        <div className="lg:col-span-2 space-y-6">
           
           {/* LANDMARK CASES LIBRARY */}
           <Card 
             title="Landmark Judgments Library" 
             action={<div className="relative"><input type="text" placeholder="Search cases..." className="pl-8 pr-3 py-1 bg-gray-50 border border-gray-200 rounded text-xs focus-gold"/><Search size={12} className="absolute left-2.5 top-2 text-gray-400"/></div>}
           >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                    { title: "Kesavananda Bharati v. State of Kerala", tag: "Basic Structure", year: "1973" },
                    { title: "Maneka Gandhi v. Union of India", tag: "Art 21 - Personal Liberty", year: "1978" },
                    { title: "Vishaka v. State of Rajasthan", tag: "Workplace Safety", year: "1997" },
                    { title: "Puttaswamy v. Union of India", tag: "Right to Privacy", year: "2017" }
                 ].map((c, i) => (
                    <div key={i} className="group p-4 border border-gray-200 rounded-xl hover:border-judicial-gold hover:shadow-md transition-all cursor-pointer bg-white">
                       <div className="flex justify-between items-start mb-2">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded">{c.year}</span>
                          <BookOpen size={16} className="text-gray-300 group-hover:text-judicial-gold transition-colors" />
                       </div>
                       <h4 className="font-serif font-bold text-gray-900 leading-tight mb-1">{c.title}</h4>
                       <p className="text-xs text-judicial-gold font-medium">{c.tag}</p>
                    </div>
                 ))}
              </div>
           </Card>

           {/* CONTINUE STUDYING */}
           <div className="bg-judicial-gold/10 border border-judicial-gold/20 rounded-xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-judicial-gold">
                    <Book size={24} />
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-900">Continue: Indian Penal Code</h3>
                    <p className="text-sm text-gray-600">Chapter XVI - Offences Affecting Human Body</p>
                    <div className="w-48 h-1.5 bg-white rounded-full mt-2 overflow-hidden">
                       <div className="h-full bg-judicial-gold w-[65%]"></div>
                    </div>
                 </div>
              </div>
              <button className="px-6 py-3 bg-judicial-gold text-black font-bold rounded-lg shadow-md hover:brightness-110 flex items-center gap-2">
                 Resume <ChevronRight size={16} />
              </button>
           </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

// Helper icon
import { Check } from 'lucide-react';