import { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/Card';
import { Plus, Save, Trash2, Calendar } from 'lucide-react';

export default function StudentNotes() {
  const [activeNote, setActiveNote] = useState(0);
  const notes = [
    { id: 0, title: 'IPC Section 302 Analysis', date: 'Feb 5, 2026', content: 'Punishment for murder. Needs review of Bachan Singh vs State of Punjab case regarding "rarest of rare" doctrine.' },
    { id: 1, title: 'Constitutional Law - Art 21', date: 'Feb 4, 2026', content: 'Right to Life and Personal Liberty. Does it cover privacy? (Puttaswamy Judgement).' },
    { id: 2, title: 'Torts: Negligence Notes', date: 'Feb 1, 2026', content: 'Donoghue v Stevenson principle - Duty of Care.' },
  ];

  return (
    <DashboardLayout role="student">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
        
        {/* Sidebar List */}
        <div className="col-span-1 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-legal">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="text-black font-serif font-bold">My Notebook</h3>
            <button className="p-2 bg-judicial-gold text-black rounded hover:bg-[#D4B06A] transition-colors shadow-sm">
              <Plus size={16} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {notes.map((note, idx) => (
              <div 
                key={note.id} 
                onClick={() => setActiveNote(idx)}
                // --- THE MIDAS TOUCH HIGHLIGHT ---
                className={`
                  p-4 rounded-lg transition-all duration-300
                  ${activeNote === idx 
                    ? 'active-gold' // <-- Solid Gold when selected
                    : 'bg-white hover-gold text-gray-600 hover:text-black' // <-- Glows on hover
                  }
                `}
              >
                <h4 className="font-bold mb-1 truncate">{note.title}</h4>
                <div className={`flex items-center gap-2 text-xs ${activeNote === idx ? 'text-black/80' : 'text-gray-400'}`}>
                  <Calendar size={10} /> {note.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="col-span-2 flex flex-col bg-white border border-gray-200 rounded-xl shadow-legal p-6">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
             <input 
               type="text" 
               defaultValue={notes[activeNote].title}
               // --- MIDAS TOUCH INPUT ---
               className="text-2xl font-serif font-bold text-black w-full px-2 py-1 rounded focus-gold bg-transparent"
             />
             <div className="flex gap-2">
               <button className="flex items-center gap-2 px-3 py-1.5 text-red-500 border border-red-200 rounded hover:bg-red-50 transition-colors">
                 <Trash2 size={14} />
               </button>
               <button className="flex items-center gap-2 px-4 py-1.5 btn-gold rounded">
                 <Save size={14} /> Save
               </button>
             </div>
          </div>
          <textarea 
            // --- MIDAS TOUCH TEXTAREA ---
            className="flex-1 w-full p-4 rounded-xl text-gray-700 text-lg leading-relaxed resize-none focus-gold bg-gray-50/50"
            defaultValue={notes[activeNote].content}
            placeholder="Start typing your legal notes here..."
          ></textarea>
        </div>
      </div>
    </DashboardLayout>
  );
}