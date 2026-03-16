import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, Sparkles, FileText, User, Scale, AlignLeft, Loader2, Copy, Download, Save 
} from 'lucide-react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ✅ EXACT FIX: Using ONLY the '-new' package and CSS
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const DOCUMENT_TYPES = [
  "Legal Notice (Sec 138 NI Act)",
  "Bail Application (Sec 437 CrPC)",
  "Anticipatory Bail (Sec 438 CrPC)",
  "Writ Petition (Article 226)",
  "Consumer Complaint",
  "Eviction Notice",
  "Divorce Petition (Mutual Consent)"
];

const editorModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'align': [] }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    ['clean']
  ],
};

export default function DraftAssistant() {
  const [docType, setDocType] = useState(DOCUMENT_TYPES[0]);
  const [clientName, setClientName] = useState('');
  const [opposingParty, setOpposingParty] = useState('');
  const [facts, setFacts] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facts.trim()) return;

    setIsGenerating(true);
    
    try {
      // ✅ API CALL: Communicating with your NestJS Backend
      const response = await fetch('http://localhost:3000/ai/draft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          docType,
          clientName,
          opposingParty,
          facts
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to the AI server.');
      }

      const data = await response.json();
      setDraft(data.draft);
      
    } catch (error) {
      console.error("Drafting Error:", error);
      alert("Connection Error: Make sure your NestJS backend is running on port 3000.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Custom Legal Editor CSS overrides */}
      <style>{`
        .quill-legal-editor .ql-container.ql-snow {
          border: none;
          font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
          font-size: 1.125rem;
          line-height: 1.75;
          color: #111827;
        }
        .quill-legal-editor .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          background-color: #f9fafb;
          padding: 12px;
        }
        .quill-legal-editor .ql-editor {
          padding: 2rem 3rem;
          min-height: 100%;
        }
        .quill-legal-editor .ql-editor.ql-blank::before {
          font-style: normal;
          color: #9ca3af;
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
        
        {/* Page Header */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">AI Legal Drafter</h1>
              <p className="text-sm text-gray-500 font-medium mt-1">Generate highly accurate legal documents in seconds.</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3 px-5 py-2.5 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
             <Bot size={18} className="text-[#D4AF37]" />
             {/* ✅ CREDITS: Updated to 9999 so you don't worry about it! */}
             <span className="text-sm font-bold text-gray-900">9999 <span className="text-gray-500 font-normal">Credits Left</span></span>
          </div>
        </div>

        {/* Main Workspace Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[700px]">
          
          {/* LEFT PANEL: INPUT PARAMS */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="xl:col-span-4 flex flex-col gap-6"
          >
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex-1 overflow-y-auto custom-scrollbar group hover:shadow-md transition-all duration-300">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FileText size={18} className="text-[#D4AF37]" /> Case Parameters
              </h2>

              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Document Type</label>
                  <select 
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 font-bold focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all appearance-none shadow-sm cursor-pointer"
                  >
                    {DOCUMENT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Client Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3 top-3.5 text-gray-500" />
                      <Input 
                        value={clientName} onChange={(e) => setClientName(e.target.value)}
                        className="pl-9 h-12 bg-gray-50 border-gray-300 text-gray-900 font-bold placeholder:text-gray-400 focus:border-[#D4AF37] shadow-sm" placeholder="Ramesh K." 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Opposing Party</label>
                    <div className="relative">
                      <Scale size={16} className="absolute left-3 top-3.5 text-gray-500" />
                      <Input 
                        value={opposingParty} onChange={(e) => setOpposingParty(e.target.value)}
                        className="pl-9 h-12 bg-gray-50 border-gray-300 text-gray-900 font-bold placeholder:text-gray-400 focus:border-[#D4AF37] shadow-sm" placeholder="State of Mah..." 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 flex-1 pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                    <AlignLeft size={16}/> Case Facts & Context
                  </label>
                  <textarea 
                    required
                    value={facts}
                    onChange={(e) => setFacts(e.target.value)}
                    placeholder="Briefly describe the incident, dates, and key legal arguments you want to include..."
                    className="w-full h-48 p-4 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 font-medium placeholder:text-gray-400 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all resize-none shadow-sm"
                  />
                  <p className="text-[10px] text-gray-500 font-bold text-right">Be as specific as possible.</p>
                </div>

                {/* ✅ THE GOLD GENERATE BUTTON */}
                <Button 
                  type="submit" 
                  disabled={isGenerating || !facts.trim()}
                  className="w-full h-14 mt-2 bg-[#D4AF37] hover:bg-[#c4a030] text-gray-900 font-bold text-lg rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  {isGenerating ? (
                    <><Loader2 className="animate-spin mr-2" size={20} /> Generating Draft...</>
                  ) : (
                    <><Sparkles className="mr-2" size={20} /> Generate Legal Draft</>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* RIGHT PANEL: THE WHITE EDITOR CANVAS */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="xl:col-span-8 flex flex-col"
          >
            <div className="bg-white border border-gray-200 rounded-2xl flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden relative">
              
              {/* Document Action Bar */}
              <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-20 relative">
                 <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-gray-200 border border-gray-300"></div>
                    <div className="h-3 w-3 rounded-full bg-gray-200 border border-gray-300"></div>
                    <div className="h-3 w-3 rounded-full bg-gray-200 border border-gray-300"></div>
                 </div>
                 <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors" title="Copy Text"><Copy size={18}/></button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900 transition-colors" title="Save to Vault"><Save size={18}/></button>
                    <button className="px-4 py-2 hover:bg-[#D4AF37]/10 rounded-lg text-[#b8952b] transition-colors flex items-center gap-2 text-sm font-bold ml-2">
                      <Download size={16}/> Export PDF
                    </button>
                 </div>
              </div>

              {/* Editor Body */}
              <div className="flex-1 relative flex flex-col bg-white">
                 {/* Loading Overlay */}
                 {isGenerating && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm z-20">
                       <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mb-4" />
                       <p className="text-gray-900 font-serif font-bold text-xl">Drafting {docType}...</p>
                       <p className="text-gray-600 text-sm mt-2 font-medium">Analyzing facts and applying Indian Jurisprudence</p>
                    </div>
                 )}
                 
                 {/* ✅ ALWAYS VISIBLE RICH TEXT EDITOR */}
                 <ReactQuill 
                    theme="snow" 
                    value={draft} 
                    onChange={setDraft} 
                    modules={editorModules}
                    placeholder="Start typing your legal document here, or use the AI tools on the left to generate a draft..."
                    className="quill-legal-editor flex-1 flex flex-col h-full absolute inset-0 z-10"
                 />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </DashboardLayout>
  );
}