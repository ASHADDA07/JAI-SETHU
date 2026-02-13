import { DashboardLayout } from '../../layouts/DashboardLayout';
import { ChatLayout } from '../../components/ChatLayout';

export default function AIConsultant() {
  return (
    <DashboardLayout role="public">
      <div className="h-full flex flex-col">
        <div className="mb-6">
           <h2 className="text-3xl font-serif font-bold text-black">JAI-Sethu AI Advisor</h2>
           <p className="text-gray-500 mt-1 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> 
             Online • Trained on Indian Penal Code, CrPC, & Constitution
           </p>
        </div>
        
        <div className="flex-1">
          <ChatLayout 
            title="AI Legal Assistant" 
            subtitle="Virtual Consultant" 
            isAI={true} // <-- Enables AI Mode
          />
        </div>
      </div>
    </DashboardLayout>
  );
}