import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Globe, Users, Server } from 'lucide-react';

export default function FounderDashboard() {
  return (
    <DashboardLayout role="founder">
      {/* Cinematic Header */}
      <div className="relative h-48 rounded-2xl overflow-hidden mb-8 border border-judicial-gold/30">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-judicial-gold/20 to-black"></div>
        <div className="absolute bottom-6 left-8">
            <h2 className="text-4xl font-serif text-white">System Overwatch</h2>
            <p className="text-judicial-gold uppercase tracking-[0.2em] text-xs mt-2">J.A.I-S.E.T.H.U Master Control</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard label="Total Users" value="1,240" icon={<Users />} />
        <MetricCard label="Active Cities" value="12" icon={<Globe />} />
        <MetricCard label="Server Status" value="Online" icon={<Server />} active />
      </div>

      <div className="mt-8 bg-black/40 border border-white/5 rounded-xl p-8 text-center">
        <h3 className="text-legal-gray uppercase tracking-widest text-sm mb-4">Feedback Inbox</h3>
        <p className="text-white font-serif italic text-lg">"The AI drafting tool saved me 3 hours today. Incredible work."</p>
        <p className="text-judicial-gold text-xs mt-2">- Adv. Verma, Delhi High Court</p>
      </div>
    </DashboardLayout>
  );
}

function MetricCard({ label, value, icon, active }: any) {
    return (
        <div className="p-8 bg-legal-surface border border-white/5 rounded-xl hover:border-judicial-gold/50 transition-colors group">
            <div className="flex justify-between items-start mb-4">
                <div className="text-legal-gray group-hover:text-judicial-gold transition-colors">{icon}</div>
                {active && <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>}
            </div>
            <h3 className="text-4xl font-serif text-white font-bold">{value}</h3>
            <p className="text-xs text-legal-gray uppercase tracking-wider mt-1">{label}</p>
        </div>
    )
}