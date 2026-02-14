import { useState } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { 
  Wand2, Download, Printer, Copy, FileText, 
  Search, ChevronLeft, Gavel, Scale, FileSignature, 
  ArrowRight, ShieldAlert, Users, Ban, Mail 
} from 'lucide-react';

const TEMPLATES = [
  { id: 1, title: "Bail Application", section: "CrPC 437", category: "Criminal", icon: Gavel },
  { id: 2, title: "Anticipatory Bail", section: "CrPC 438", category: "Criminal", icon: ShieldAlert },
  { id: 3, title: "Cheque Bounce Notice", section: "NI Act 138", category: "Civil", icon: FileText },
  { id: 4, title: "Writ Petition", section: "Art 226/32", category: "Constitutional", icon: Scale },
  { id: 5, title: "Divorce Petition", section: "Hindu Marriage Act", category: "Family", icon: Users },
  { id: 6, title: "Vakalatnama", section: "General", category: "Procedural", icon: FileSignature },
  { id: 7, title: "FIR Quashing", section: "CrPC 482", category: "Criminal", icon: Ban },
  { id: 8, title: "Legal Notice", section: "General", category: "Civil", icon: Mail },
];

export default function DraftAssistant() {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");

  const filteredTemplates = TEMPLATES.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.section.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      {!selectedTemplate ? (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl font-serif font-bold text-black">Document Template Library</h2>
            <p className="text-gray-500">Select a legal format to begin AI-assisted drafting</p>
            
            {/* --- FIXED SEARCH BAR --- */}
            <div className="max-w-xl mx-auto relative pt-4">
              <input 
                type="text" 
                placeholder="Search templates (e.g. 'Bail')..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-full shadow-lg text-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
              />
              {/* Perfectly Centered Icon */}
              <Search className="absolute left-5 top-1/2 pt-2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <button 
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(template);
                  setGeneratedContent(`IN THE COURT OF...\n\nSUBJECT: ${template.title.toUpperCase()} UNDER ${template.section.toUpperCase()}\n\n...`);
                }}
                className="group flex items-start gap-4 p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl hover:border-[#D4AF37] transition-all duration-300 text-left hover:-translate-y-1"
              >
                <div className="p-4 rounded-lg bg-gray-50 text-gray-600 group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">
                  <template.icon size={24} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-gray-900 group-hover:text-[#D4AF37] transition-colors">{template.title}</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{template.section}</p>
                </div>
                <div className="ml-auto self-center opacity-0 group-hover:opacity-100 transition-opacity text-[#D4AF37]">
                  <ArrowRight />
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* WORKSPACE VIEW (Unchanged) */
        <div className="flex flex-col h-[calc(100vh-100px)] animate-in slide-in-from-right duration-300">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => setSelectedTemplate(null)}
              className="flex items-center gap-2 text-gray-500 hover:text-black hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} /> Back to Library
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h3 className="font-serif font-bold text-xl flex items-center gap-2">
              <selectedTemplate.icon className="text-[#D4AF37]" size={20}/> 
              {selectedTemplate.title} 
            </h3>
          </div>

          <div className="flex flex-1 gap-6 overflow-hidden">
            <div className="w-80 flex flex-col gap-4 overflow-y-auto pb-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                  <Wand2 size={14} className="text-[#D4AF37]" /> AI Input Facts
                </h4>
                <textarea 
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg h-64 text-sm focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none resize-none leading-relaxed"
                  placeholder="Enter case facts..."
                ></textarea>
                <button className="w-full mt-4 py-3 bg-[#D4AF37] hover:bg-[#bfa030] rounded-lg shadow-md font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                  <Wand2 size={16} /> Auto-Draft Content
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gray-100 rounded-xl border border-gray-200 shadow-inner overflow-hidden flex flex-col relative">
              <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
                <span className="text-xs text-gray-400 uppercase tracking-widest">Live Editor</span>
                <div className="flex gap-2">
                   <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><Copy size={16}/></button>
                   <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><Printer size={16}/></button>
                   <button className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded hover:bg-gray-800 flex items-center gap-2">
                     <Download size={12} /> Save PDF
                   </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-[#F3F4F6]">
                <div className="bg-white w-[210mm] min-h-[297mm] shadow-2xl p-[25mm] relative">
                  <textarea 
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="w-full h-full bg-transparent border-none resize-none focus:outline-none font-serif text-lg leading-[1.8] text-black placeholder-gray-300"
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}