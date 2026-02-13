import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { ChevronRight, ChevronLeft, Upload, MapPin, Calendar, Mic, FileText, AlertTriangle } from 'lucide-react';

export default function IncidentWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    files: [] as File[]
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const renderStep = () => {
    switch(step) {
      case 1: // The Story
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Tell us what happened</h2>
            <p className="text-gray-500">Don't worry about legal terms. Just tell your story in your own words.</p>
            
            <div className="space-y-4">
              <label className="block">
                <span className="font-bold text-gray-700">Give this a short title</span>
                <input 
                  type="text" 
                  className="w-full mt-2 p-4 border border-gray-200 rounded-xl focus:border-[#D4AF37] outline-none"
                  placeholder="e.g., Harassment by neighbor, Property dispute..."
                  value={data.title}
                  onChange={e => setData({...data, title: e.target.value})}
                />
              </label>

              <label className="block">
                <span className="font-bold text-gray-700">What happened?</span>
                <div className="relative mt-2">
                    <textarea 
                    className="w-full p-4 h-40 border border-gray-200 rounded-xl focus:border-[#D4AF37] outline-none resize-none"
                    placeholder="Start from the beginning..."
                    value={data.description}
                    onChange={e => setData({...data, description: e.target.value})}
                    />
                    <button className="absolute bottom-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600" title="Use Voice Input">
                        <Mic size={20} />
                    </button>
                </div>
              </label>
            </div>
          </div>
        );
      case 2: // Context
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-serif font-bold text-gray-900">When and Where?</h2>
            <p className="text-gray-500">This helps lawyers verify your alibi and jurisdiction.</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 border border-gray-200 rounded-xl hover:border-[#D4AF37] cursor-pointer transition-colors bg-white">
                <Calendar className="text-[#D4AF37] mb-3" size={24} />
                <label className="block">
                    <span className="font-bold text-gray-700">Date & Time</span>
                    <input 
                    type="datetime-local" 
                    className="w-full mt-2 p-2 bg-gray-50 rounded-lg outline-none"
                    value={data.date}
                    onChange={e => setData({...data, date: e.target.value})}
                    />
                </label>
              </div>

              <div className="p-6 border border-gray-200 rounded-xl hover:border-[#D4AF37] cursor-pointer transition-colors bg-white">
                <MapPin className="text-[#D4AF37] mb-3" size={24} />
                <label className="block">
                    <span className="font-bold text-gray-700">Location</span>
                    <input 
                    type="text" 
                    className="w-full mt-2 p-2 bg-gray-50 rounded-lg outline-none"
                    placeholder="e.g., Koramangala, Bangalore"
                    value={data.location}
                    onChange={e => setData({...data, location: e.target.value})}
                    />
                </label>
              </div>
            </div>
          </div>
        );
      case 3: // Evidence
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Do you have proof?</h2>
            <p className="text-gray-500">Photos, Screenshots, Audio Recordings, or PDF Documents.</p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#D4AF37]/10 group-hover:text-[#D4AF37] transition-colors">
                    <Upload size={32} className="text-gray-400 group-hover:text-[#D4AF37]" />
                </div>
                <h3 className="font-bold text-gray-900">Click to Upload Evidence</h3>
                <p className="text-sm text-gray-500 mt-2">Files are automatically hashed and secured.</p>
                <input type="file" multiple className="hidden" />
            </div>

            <div className="bg-yellow-50 p-4 rounded-xl flex items-start gap-3 text-sm text-yellow-800">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <p><strong>Pro Tip:</strong> Don't edit screenshots or crop photos. Original files have "metadata" that acts as digital proof.</p>
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <DashboardLayout role="public">
      <div className="max-w-3xl mx-auto py-8">
        {/* Progress Bar */}
        <div className="flex justify-between mb-8 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10"></div>
            <div className={`absolute top-1/2 left-0 h-1 bg-[#D4AF37] -z-10 transition-all duration-300`} style={{width: `${((step-1)/2)*100}%`}}></div>
            {[1, 2, 3].map(i => (
                <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= i ? 'bg-[#D4AF37] text-black shadow-lg' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                    {i}
                </div>
            ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 min-h-[400px] flex flex-col justify-between">
            {renderStep()}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                <button 
                    onClick={handleBack} 
                    disabled={step === 1}
                    className="flex items-center gap-2 px-6 py-3 font-bold text-gray-500 disabled:opacity-30 hover:bg-gray-100 rounded-xl transition-colors"
                >
                    <ChevronLeft size={20} /> Back
                </button>
                
                {step < 3 ? (
                    <button 
                        onClick={handleNext}
                        className="flex items-center gap-2 px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg"
                    >
                        Next Step <ChevronRight size={20} />
                    </button>
                ) : (
                    <button 
                        onClick={() => navigate('/public/connect')} // In real app, submit to backend first
                        className="flex items-center gap-2 px-8 py-3 bg-[#D4AF37] text-black font-bold rounded-xl hover:bg-[#bfa030] transition-all shadow-lg"
                    >
                        <FileText size={20} /> Generate Case & Find Lawyer
                    </button>
                )}
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}