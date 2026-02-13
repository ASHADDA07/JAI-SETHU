import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/Card';
import { UserCheck, Shield, Activity, X } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Pending Verifications" value="3" icon={<UserCheck />} color="text-yellow-500" />
        <StatCard label="System Load" value="12%" icon={<Activity />} color="text-green-500" />
        <StatCard label="Security Alerts" value="0" icon={<Shield />} color="text-blue-500" />
      </div>

      <h3 className="text-xl font-serif text-white mb-4">Pending Bar Council Verifications</h3>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
            <Card key={i} className="flex flex-row items-center justify-between py-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-serif text-lg">
                        L{i}
                    </div>
                    <div>
                        <h4 className="text-white font-medium">Adv. Sanjay Mishra</h4>
                        <p className="text-xs text-legal-gray">Bar ID: UP/1234/20{20+i} • Uploaded ID Card</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="p-2 border border-red-900 text-red-500 rounded hover:bg-red-900/20"><X size={18} /></button>
                    <button className="px-4 py-2 bg-judicial-gold text-black text-sm font-bold rounded hover:bg-yellow-500">Approve</button>
                </div>
            </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}

function StatCard({ label, value, icon, color }: any) {
    return (
        <div className="bg-legal-surface border border-white/5 p-6 rounded-xl flex items-center justify-between">
            <div>
                <p className="text-legal-gray text-xs uppercase tracking-widest">{label}</p>
                <p className="text-3xl font-serif text-white mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-full bg-white/5 ${color}`}>{icon}</div>
        </div>
    )
}