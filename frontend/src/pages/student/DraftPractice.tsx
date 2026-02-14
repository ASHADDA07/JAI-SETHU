import { DashboardLayout } from "../../layouts/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenTool, CheckCircle, AlertTriangle, Save } from "lucide-react";

export default function DraftPractice() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-white">Drafting Practice</h2>
        <p className="text-slate-400">Refine your legal writing with AI-guided templates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Area */}
        <div className="lg:col-span-2">
          <Card className="border-white/5 bg-slate-900/50">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-white flex items-center gap-2">
                <PenTool size={18} className="text-[#D4AF37]" />
                Legal Petition Template
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <textarea 
                className="w-full h-96 bg-transparent text-slate-200 border-none focus:outline-none resize-none font-mono text-sm"
                placeholder="In the Court of..."
              />
              <div className="mt-4 flex justify-end gap-3">
                <Button variant="outline" className="border-white/10 text-white">Discard</Button>
                <Button className="bg-[#D4AF37] text-black font-bold">
                  <Save size={18} className="mr-2" /> Save Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Sidebar */}
        <div className="space-y-6">
          <Card className="border-white/5 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-sm text-[#D4AF37] uppercase tracking-widest">AI Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3 text-sm text-green-400">
                <CheckCircle size={18} />
                <span>Format follows CPC guidelines.</span>
              </div>
              <div className="flex gap-3 text-sm text-yellow-400">
                <AlertTriangle size={18} />
                <span>Verify the jurisdiction clause.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}