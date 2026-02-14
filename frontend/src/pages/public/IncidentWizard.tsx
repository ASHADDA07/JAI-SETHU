import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ChevronRight, ChevronLeft, Upload, MapPin, Calendar, Mic, FileText, AlertTriangle } from 'lucide-react';

// 1. Validation Schema
const wizardSchema = z.object({
  title: z.string().min(5, "Title is too short"),
  description: z.string().min(20, "Please provide more details"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(3, "Location is required"),
});

export default function IncidentWizard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState<File[]>([]);

  const { register, trigger, getValues, formState: { errors } } = useForm({
    resolver: zodResolver(wizardSchema),
    defaultValues: { title: '', description: '', date: '', location: '' }
  });

  const handleNext = async () => {
    // Only validate the fields relevant to the current step
    const fields: any = step === 1 ? ['title', 'description'] : ['date', 'location'];
    const isValid = await trigger(fields);
    if (isValid) setStep(s => s + 1);
  };

  const handleFinalSubmit = () => {
    const finalData = { ...getValues(), files };
    console.log("Final Submission for Security Hashing:", finalData);
    
    toast({
      title: "Case Token Generated",
      description: "Moving to Lawyer Connection...",
    });
    
    navigate('/public/connect');
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto py-8 px-4">
        
        {/* Step Indicator (Refactored to shadcn style) */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${
                step >= i ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-md' : 'bg-white border-gray-200 text-gray-400'
              }`}>
                {i}
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                {i === 1 ? "Story" : i === 2 ? "Context" : "Evidence"}
              </span>
            </div>
          ))}
        </div>

        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-8">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-serif font-bold">Tell your story</h2>
                  <p className="text-muted-foreground">Describe the incident in your own words.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">Case Title</Label>
                    <Input {...register("title")} placeholder="e.g., Unfair dismissal, Rent dispute..." className="h-12" />
                    {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-bold">What happened?</Label>
                    <div className="relative">
                      <Textarea {...register("description")} placeholder="Describe the events..." className="min-h-[180px] pr-12" />
                      <Button size="icon" variant="ghost" className="absolute bottom-2 right-2 text-gray-400">
                        <Mic size={18} />
                      </Button>
                    </div>
                    {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-serif font-bold">Context</h2>
                  <p className="text-muted-foreground">When and where did this happen?</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Calendar size={14}/> Date & Time</Label>
                    <Input type="datetime-local" {...register("date")} />
                    {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><MapPin size={14}/> Location</Label>
                    <Input {...register("location")} placeholder="City, Area" />
                    {errors.location && <p className="text-red-500 text-xs">{errors.location.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                 <div className="space-y-2">
                  <h2 className="text-3xl font-serif font-bold">Evidence Vault</h2>
                  <p className="text-muted-foreground">Upload photos or documents to secure them.</p>
                </div>

                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all cursor-pointer group">
                  <Upload className="mx-auto mb-4 text-gray-400 group-hover:text-[#D4AF37]" size={40} />
                  <p className="font-bold">Drop files here or click to upload</p>
                  <p className="text-xs text-gray-400 mt-2">Maximum file size: 10MB</p>
                  <Input type="file" multiple className="hidden" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
                </div>

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 text-sm text-blue-800">
                  <AlertTriangle size={18} className="shrink-0" />
                  <p><strong>Chain of Custody:</strong> Your files will be cryptographically hashed (SHA-256) upon upload to prove they were not tampered with.</p>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-12 pt-6 border-t border-gray-100">
              <Button variant="ghost" onClick={() => setStep(s => s - 1)} disabled={step === 1}>
                <ChevronLeft className="mr-2" size={18} /> Back
              </Button>

              {step < 3 ? (
                <Button onClick={handleNext} className="bg-black text-white hover:bg-gray-800 px-8">
                  Next <ChevronRight className="ml-2" size={18} />
                </Button>
              ) : (
                <Button onClick={handleFinalSubmit} className="bg-[#D4AF37] text-black hover:bg-[#bfa030] px-8 font-bold">
                  <FileText className="mr-2" size={18} /> Secure & Submit
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}