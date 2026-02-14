import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Shield, Scale, BookOpen, Gavel } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="p-6 flex justify-between items-center bg-white border-b">
        <h1 className="text-2xl font-serif font-bold tracking-tighter text-slate-900">J.A.I SETHU</h1>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
          <Button className="bg-[#D4AF37] text-black hover:bg-[#bfa030]" onClick={() => navigate('/register')}>Join Portal</Button>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto py-20 px-6 text-center">
        <h2 className="text-6xl font-serif font-bold mb-6">Equal Justice, <span className="text-[#D4AF37]">Digitally Secured.</span></h2>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">The first legal aid platform with immutable audit logs and AI-powered case assistance.</p>
        <div className="flex justify-center gap-4">
          <Button size="lg" className="h-14 px-10 text-lg bg-slate-900" onClick={() => navigate('/public/incident-wizard')}>File a Case</Button>
          <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-slate-300">Learn More</Button>
        </div>
      </main>
    </div>
  );
}
