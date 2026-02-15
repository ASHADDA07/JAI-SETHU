import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenTool, CheckCircle, AlertTriangle, Save, FileText } from "lucide-react";

export default function DraftPractice() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-slate-900">Drafting Practice</h2>
        <p className="text-slate-500">Refine your legal writing with AI-guided templates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Area */}
        <div className="lg:col-span-2">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
                <PenTool size={18} className="text-[#D4AF37]" />
                Legal Petition Template
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative">
                <textarea 
                  className="w-full h-96 p-4 bg-slate-50 text-slate-800 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 resize-none font-mono text-sm leading-relaxed"
                  placeholder="IN THE HIGH COURT OF JUDICATURE AT..."
                />
                <div className="absolute bottom-4 right-4 text-xs text-slate-400 font-mono">
                   Words: 0
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-50">
                  Discard Draft
                </Button>
                <Button className="bg-[#D4AF37] text-black font-bold hover:bg-[#bfa030]">
                  <Save size={16} className="mr-2" /> Save Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Sidebar */}
        <div className="space-y-6">
          <Card className="bg-slate-900 text-white border-none shadow-lg">
            <CardHeader>
              <CardTitle className="text-sm text-[#D4AF37] uppercase tracking-widest flex items-center gap-2">
                 <FileText size={16}/> AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                 <div className="flex gap-3 text-sm text-green-400 mb-1">
                    <CheckCircle size={16} className="mt-0.5" />
                    <span className="font-bold">Format Check</span>
                 </div>
                 <p className="text-xs text-slate-400 ml-7">Standard petition structure detected.</p>
              </div>

              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                 <div className="flex gap-3 text-sm text-yellow-400 mb-1">
                    <AlertTriangle size={16} className="mt-0.5" />
                    <span className="font-bold">Suggestion</span>
                 </div>
                 <p className="text-xs text-slate-400 ml-7">Consider adding a Jurisdiction Clause under Para 3.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
             <CardHeader>
                <CardTitle className="text-sm font-bold">Recent Drafts</CardTitle>
             </CardHeader>
             <CardContent className="space-y-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-200">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-slate-500 font-serif">
                             Draft
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-700">Bail Application {i}</p>
                             <p className="text-[10px] text-slate-400">Edited 2 hours ago</p>
                          </div>
                       </div>
                    </div>
                ))}
             </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}