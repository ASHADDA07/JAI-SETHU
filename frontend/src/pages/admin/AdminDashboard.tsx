import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card, CardContent } from "@/components/ui/card"; // Cleaned up unused imports
import { Button } from "@/components/ui/button"; // Added shadcn button
import { UserCheck, Shield, Activity, X, Check } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <DashboardLayout> {/* Removed 'role' prop to fix TS2322 error */}
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Pending Verifications" value="3" icon={<UserCheck />} color="text-yellow-500" />
        <StatCard label="System Load" value="12%" icon={<Activity />} color="text-green-500" />
        <StatCard label="Security Alerts" value="0" icon={<Shield />} color="text-blue-500" />
      </div>

      <h3 className="text-xl font-serif text-white mb-6">Pending Bar Council Verifications</h3>
      
      {/* VERIFICATION LIST */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-white/5 bg-slate-900/50 backdrop-blur-sm">
            <CardContent className="flex flex-row items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center font-serif text-[#D4AF37] text-lg border border-[#D4AF37]/20">
                  L{i}
                </div>
                <div>
                  <h4 className="text-white font-medium">Adv. Sanjay Mishra</h4>
                  <p className="text-xs text-slate-400">
                    Bar ID: UP/1234/20{20 + i} • <span className="text-[#D4AF37] cursor-pointer hover:underline">View ID Card</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                {/* Replaced manual buttons with professional variants */}
                <Button variant="outline" size="icon" className="border-red-900/50 text-red-500 hover:bg-red-900/20 hover:text-red-400">
                  <X size={18} />
                </Button>
                <Button className="bg-[#D4AF37] text-black hover:bg-[#bfa030] font-bold">
                  <Check className="mr-2 h-4 w-4" /> Approve
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}

// Sub-component for Stats
function StatCard({ label, value, icon, color }: any) {
  return (
    <div className="bg-slate-900 border border-white/5 p-6 rounded-xl flex items-center justify-between shadow-lg">
      <div>
        <p className="text-slate-400 text-xs uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-serif text-white mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full bg-white/5 ${color}`}>{icon}</div>
    </div>
  );
}