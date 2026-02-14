import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/Card';
import { PenTool, CheckCircle, AlertTriangle } from 'lucide-react';

export default function DraftPractice() {
  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-serif text-white">Legal Drafting Practice</h2>
          <p className="text-legal-gray text-sm mt-1">Assignment: <span className="text-white">Bail Application (Sec 437 CrPC)</span></p>
        </div>
        <div className="flex gap-3">
            <span className="px-3 py-1 rounded border border-yellow-500/30 text-yellow-500 text-xs flex items-center gap-2">
                <AlertTriangle size={14} /> Difficulty: Intermediate
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Editor Area */}
        <Card className="col-span-2 flex flex-col bg-[#0f0f0f] border-judicial-gold/20">
            <div className="border-b border-white/5 pb-3 mb-3 flex justify-between">
                <span className="text-legal-gray text-xs uppercase tracking-wider">Draft Editor</span>
                <span className="text-green-500 text-xs flex items-center gap-1"><CheckCircle size={12}/> Auto-saved</span>
            </div>
            <textarea 
                className="flex-1 w-full bg-transparent border-none text-white font-serif text-lg leading-relaxed focus:outline-none resize-none placeholder-white/20"
                placeholder="IN THE COURT OF..."
                defaultValue={`IN THE COURT OF THE CHIEF METROPOLITAN MAGISTRATE

APPLICATION FOR BAIL UNDER SECTION 437 OF THE CODE OF CRIMINAL PROCEDURE

MOST RESPECTFULLY SHOWETH:

1. That the petitioner is...`}
            ></textarea>
        </Card>

        {/* Instructions & Feedback */}
        <div className="space-y-6">
            <Card title="Key Requirements">
                <ul className="space-y-3 text-sm text-legal-gray">
                    <li className="flex gap-2"><div className="w-1 h-1 bg-judicial-gold rounded-full mt-2"></div>Mention the FIR Number explicitly.</li>
                    <li className="flex gap-2"><div className="w-1 h-1 bg-judicial-gold rounded-full mt-2"></div>Argue lack of flight risk.</li>
                    <li className="flex gap-2"><div className="w-1 h-1 bg-judicial-gold rounded-full mt-2"></div>Cite precedent if possible.</li>
                </ul>
            </Card>

            <button className="w-full py-4 bg-white/5 border border-judicial-gold text-judicial-gold font-bold uppercase tracking-widest hover:bg-judicial-gold hover:text-black transition-all rounded">
                Submit for Review
            </button>
        </div>
      </div>
    </DashboardLayout>
  );
}