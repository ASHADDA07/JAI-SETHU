import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Plus, Save, Trash2, Calendar, Loader2, FileText } from 'lucide-react';

const API_URL = 'http://localhost:3000';

export default function StudentNotes() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  
  const [notes, setNotes] = useState<any[]>([]);
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Fetch Real Notes
  useEffect(() => {
    const fetchNotes = async () => {
        if (!currentUser?.id) return;
        try {
            const res = await axios.get(`${API_URL}/notes?userId=${currentUser.id}`);
            setNotes(res.data);
            if (res.data.length > 0) setActiveNote(0);
        } catch (error) {
            console.error("Failed to fetch notes", error);
        } finally {
            setLoading(false);
        }
    };
    fetchNotes();
  }, [currentUser?.id]);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)] animate-in fade-in duration-500">
        
        {/* Sidebar List */}
        <div className="col-span-1 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="text-black font-serif font-bold">My Notebook</h3>
            <button className="p-2 bg-[#D4AF37] text-black rounded hover:bg-[#bfa030] transition-colors shadow-sm">
              <Plus size={16} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loading ? (
                <div className="flex justify-center p-10"><Loader2 className="animate-spin text-gray-400"/></div>
            ) : notes.length === 0 ? (
                <div className="text-center p-8 text-gray-400">
                    <FileText size={32} className="mx-auto mb-2 opacity-30"/>
                    <p className="text-sm">No notes created yet.</p>
                </div>
            ) : (
                notes.map((note, idx) => (
                <div 
                    key={note.id} 
                    onClick={() => setActiveNote(idx)}
                    className={`
                    p-4 rounded-lg transition-all duration-300 cursor-pointer
                    ${activeNote === idx 
                        ? 'bg-[#D4AF37] text-black shadow-md transform scale-[1.02]' 
                        : 'bg-white border border-gray-100 text-gray-600 hover:border-[#D4AF37] hover:shadow-sm'
                    }
                    `}
                >
                    <h4 className="font-bold mb-1 truncate">{note.title}</h4>
                    <div className={`flex items-center gap-2 text-xs ${activeNote === idx ? 'text-black/80' : 'text-gray-400'}`}>
                    <Calendar size={10} /> {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                </div>
                ))
            )}
          </div>
        </div>

        {/* Editor Area */}
        <div className="col-span-2 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm p-6 relative">
          {activeNote !== null && notes.length > 0 ? (
              <>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <input 
                        type="text" 
                        defaultValue={notes[activeNote].title}
                        className="text-2xl font-serif font-bold text-black w-full px-2 py-1 rounded focus:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 bg-transparent transition-all"
                    />
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 text-red-500 border border-red-200 rounded hover:bg-red-50 transition-colors">
                        <Trash2 size={14} />
                        </button>
                        <button className="flex items-center gap-2 px-4 py-1.5 bg-[#D4AF37] text-black font-bold rounded hover:brightness-110">
                        {saving ? <Loader2 size={14} className="animate-spin"/> : <Save size={14} />} Save
                        </button>
                    </div>
                </div>
                <textarea 
                    className="flex-1 w-full p-4 rounded-xl text-gray-700 text-lg leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 bg-gray-50/50 transition-all"
                    defaultValue={notes[activeNote].content}
                    placeholder="Start typing your legal notes here..."
                ></textarea>
              </>
          ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                  <FileText size={64} className="mb-4 opacity-20"/>
                  <p className="text-lg font-serif">Select a note or create a new one.</p>
              </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}