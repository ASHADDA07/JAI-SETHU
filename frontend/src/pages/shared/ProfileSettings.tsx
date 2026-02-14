import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// 1. Redux Imports
import { useDispatch, useSelector } from 'react-redux';
import { signInSuccess } from '../../redux/userSlice'; // We use this to update the user data too
import type { RootState } from '../../redux/store';

import { DashboardLayout } from '../../layouts/DashboardLayout';
import { Card } from '../../components/Card';
import { 
  User, CreditCard, Shield, Mail, Phone, MapPin, 
  Camera, Maximize2, X, Briefcase, GraduationCap,
  Loader2, Save, CheckCircle, AlertCircle, Lock
} from 'lucide-react';

const API_URL = 'http://localhost:3000';

interface ProfileProps {
  role: 'lawyer' | 'student' | 'public';
}

export default function ProfileSettings({ role }: ProfileProps) {
  // 2. Redux Hooks
  const dispatch = useDispatch();
  const { currentUser, loading: contextLoading } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'security'>('profile');
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    barLicenseNo: '',
    specialization: '', 
    courtJurisdiction: '',
    university: '',
    yearOfStudy: 1
  });

  const transactions = [
    { id: "INV-001", date: "Feb 01, 2026", desc: "Pro Plan Subscription", amount: "₹499.00", status: "Paid" },
    { id: "INV-002", date: "Jan 01, 2026", desc: "Pro Plan Subscription", amount: "₹499.00", status: "Paid" },
  ];

  // 1. STRICT AUTH CHECK & LOAD DATA
  useEffect(() => {
    const token = sessionStorage.getItem('token'); 
    if (!token || !currentUser) {
        // If Redux has no user, try to wait or redirect
        if (!contextLoading) navigate('/login');
        return;
    }

    const fetchProfile = async () => {
        try {
            // In a real app, we might just use the Redux data, but fetching fresh data is safer
            const res = await axios.get(`${API_URL}/users?email=${currentUser.email}`);
            const dbUser = res.data;
            
            setFormData(prev => ({
                ...prev,
                fullName: dbUser.fullName,
                email: dbUser.email,
                barLicenseNo: dbUser.lawyerProfile?.barLicenseNo || '',
                specialization: dbUser.lawyerProfile?.specialization?.join(', ') || '',
                courtJurisdiction: dbUser.lawyerProfile?.courtJurisdiction?.join(', ') || '',
                university: dbUser.studentProfile?.university || '',
                yearOfStudy: dbUser.studentProfile?.yearOfStudy || 1,
                phone: dbUser.phone || '', // Get real phone
location: dbUser.location || '', // Get real location
            }));
        } catch (err) {
            console.error("Failed to load profile", err);
        } finally {
            setFetching(false);
        }
    };

    fetchProfile();
  }, [currentUser, contextLoading, navigate]);

  // 2. SAVE HANDLER (Fixed to send only relevant data)
  const handleSaveProfile = async () => {
    if (!currentUser?.id) return;
    setSaving(true);
    setMessage(null);

    try {
        // 1. Base Payload (Shared Data)
        const basePayload = {
            fullName: formData.fullName,  // Only send fullName (The DB loves this)
            email: formData.email,
        };

        let finalPayload = {};

        // 2. Add Role-Specific Data
        if (role === 'lawyer') {
            finalPayload = {
                ...basePayload,
                barLicenseNo: formData.barLicenseNo,
                specialization: formData.specialization.split(',').map(s => s.trim()).filter(Boolean),
                courtJurisdiction: formData.courtJurisdiction.split(',').map(s => s.trim()).filter(Boolean),
            };
        } else if (role === 'student') {
            finalPayload = {
                ...basePayload,
                university: formData.university,
                yearOfStudy: formData.yearOfStudy,
                // Explicitly send undefined for lawyer fields so they don't overwrite/conflict
                barLicenseNo: undefined 
            };
        } else {
            // Public
            finalPayload = basePayload;
        }

        const res = await axios.put(`${API_URL}/users/${currentUser.id}`, finalPayload);
        
        // Update Redux Store
        dispatch(signInSuccess(res.data));
        
        setMessage({ type: 'success', text: "Profile updated successfully!" });
    } catch (err: any) {
        console.error(err);
        // Show the specific error message from backend if available
        const errorMsg = err.response?.data?.message || "Failed to save changes. (Check for duplicate data)";
        setMessage({ type: 'error', text: errorMsg });
    } finally {
        setSaving(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTempImage(URL.createObjectURL(file));
      setShowCropModal(true);
      setShowImageModal(false);
      e.target.value = ''; 
    }
  };

  const handleSaveCrop = (croppedImageUrl: string) => {
    // In a real app, upload to server first. Here we update local state.
    if(currentUser) {
        const updatedUser = { ...currentUser, avatar: croppedImageUrl };
        dispatch(signInSuccess(updatedUser)); // Update Redux
    }
    setShowCropModal(false);
    setTempImage(null);
  };

  if (contextLoading || fetching) return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-[#D4AF37]" size={48} /> 
          <p className="text-gray-500 font-bold">Verifying Access...</p>
      </div>
  );

  return (
    <DashboardLayout>
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-serif font-bold text-black">Account Settings</h2>
            <p className="text-gray-500 text-sm">
                {role === 'lawyer' ? 'Manage your Bar Council details.' : 'Manage your personal details.'}
            </p>
        </div>
        <div className="px-4 py-1 rounded-full text-xs font-bold border bg-gray-100 text-gray-500 border-gray-200">
            {role.toUpperCase()} PROFILE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT: NAVIGATION */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden sticky top-24">
             <div className="p-6 text-center border-b border-gray-100 bg-gray-50/50">
                <div 
                  className="relative w-28 h-28 mx-auto mb-4 group cursor-pointer"
                  onClick={() => setShowImageModal(true)}
                >
                   <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl bg-judicial-black text-[#D4AF37] flex items-center justify-center font-serif font-bold text-4xl relative z-0">
                      { (currentUser?.avatar?.length || 0) > 5 ? <img src={currentUser?.avatar || ''} className="w-full h-full object-cover" /> : currentUser?.fullName?.[0] }
                   </div>
                   <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <Maximize2 className="text-white" size={24} />
                   </div>
                   <div className="absolute bottom-0 right-0 bg-[#D4AF37] p-2 rounded-full border-2 border-white shadow-sm z-20 hover:scale-110 transition-transform">
                      <Camera size={14} className="text-black"/>
                   </div>
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{currentUser?.fullName}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">{role} Account</p>
             </div>
             <nav className="p-2 space-y-1">
                <NavButton icon={User} label="My Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                <NavButton icon={Shield} label="Security & Privacy" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
                {role !== 'public' && (
                    <NavButton icon={CreditCard} label="Billing & Payments" active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} />
                )}
             </nav>
          </div>
        </div>

        {/* RIGHT: CONTENT AREA */}
        <div className="lg:col-span-3 space-y-6">
          
          {message && (
             <div className={`p-4 rounded-lg flex items-center gap-2 text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                 {message.type === 'success' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
                 {message.text}
             </div>
          )}

          {/* --- TAB 1: PROFILE --- */}
          {activeTab === 'profile' && (
            <Card title={role === 'lawyer' ? "Professional & Personal Info" : "Personal Information"}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Common Fields */}
                  <InputGroup label="Full Name" icon={User} value={formData.fullName} onChange={(e:any) => setFormData({...formData, fullName: e.target.value})} />
                  <InputGroup label="Email Address" icon={Mail} value={formData.email} readOnly />
                  <InputGroup label="Phone Number" icon={Phone} value={formData.phone} readOnly />
                  <InputGroup label="Location" icon={MapPin} value={formData.location} readOnly />

                  {/* LAWYER ONLY SECTION */}
                  {role === 'lawyer' && (
                    <div className="md:col-span-2 bg-[#D4AF37]/5 p-4 rounded-xl border border-[#D4AF37]/20 mt-4">
                       <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm uppercase tracking-wide mb-4 text-[#D4AF37]">
                           <Briefcase size={16}/> Advocate Details
                       </h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <InputGroup label="Bar License No" icon={Shield} value={formData.barLicenseNo} onChange={(e:any) => setFormData({...formData, barLicenseNo: e.target.value})} />
                           <InputGroup label="Court Jurisdiction" icon={MapPin} value={formData.courtJurisdiction} onChange={(e:any) => setFormData({...formData, courtJurisdiction: e.target.value})} />
                           <div className="md:col-span-2">
                              <InputGroup label="Specialization (comma separated)" icon={Briefcase} value={formData.specialization} onChange={(e:any) => setFormData({...formData, specialization: e.target.value})} />
                           </div>
                       </div>
                    </div>
                  )}

                  {/* STUDENT ONLY SECTION */}
                  {role === 'student' && (
                    <div className="md:col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4">
                       <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm uppercase tracking-wide mb-4 text-blue-800">
                           <GraduationCap size={16}/> Academic Details
                       </h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <InputGroup label="University / College" icon={GraduationCap} value={formData.university} onChange={(e:any) => setFormData({...formData, university: e.target.value})} />
                           <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Year of Study</label>
                                <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg bg-white">
                                    <GraduationCap size={18} className="text-gray-400"/>
                                    <select 
                                        className="bg-transparent w-full text-sm font-bold text-gray-900 focus:outline-none"
                                        value={formData.yearOfStudy}
                                        onChange={(e) => setFormData({...formData, yearOfStudy: parseInt(e.target.value)})}
                                    >
                                        {[1, 2, 3, 4, 5].map(y => <option key={y} value={y}>{y} Year</option>)}
                                    </select>
                                </div>
                           </div>
                       </div>
                    </div>
                  )}
               </div>

               {/* --- SAVE BUTTON --- */}
               <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={handleSaveProfile} 
                    disabled={saving}
                    className="px-8 py-3 bg-black text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                      {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                      Save Changes
                  </button>
               </div>
            </Card>
          )}

          {/* --- TAB 2: SECURITY --- */}
          {activeTab === 'security' && (
             <Card title="Security Settings">
                   <div className="text-center py-10">
                       <Lock className="mx-auto mb-4 text-gray-300" size={48} />
                       <h3 className="font-bold text-gray-900">Password Management</h3>
                       <p className="text-sm text-gray-500 mb-6">Change your password or enable 2FA.</p>
                       <button className="px-6 py-2 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition-colors">
                           Reset Password Email
                       </button>
                   </div>
             </Card>
          )}

          {/* --- TAB 3: BILLING --- */}
          {activeTab === 'billing' && role !== 'public' && (
            <>
               <div className="bg-gradient-to-r from-gray-900 to-black text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                  <div className="flex justify-between items-start relative z-10">
                     <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Current Subscription</p>
                        <h3 className="text-3xl font-serif font-bold text-[#D4AF37] mb-4">Gold Tier</h3>
                     </div>
                     <div className="text-right">
                        <p className="text-2xl font-bold">₹499<span className="text-sm text-gray-400 font-normal">/mo</span></p>
                        <p className="text-xs text-gray-500">Renews on Mar 01, 2026</p>
                     </div>
                  </div>
               </div>
               
               <Card title="Payment History">
                  <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                         <tbody className="divide-y divide-gray-100">
                            {transactions.map((tx) => (
                               <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="py-4 pl-2 font-mono text-gray-600">{tx.id}</td>
                                  <td className="py-4 font-bold text-gray-900">{tx.amount}</td>
                                  <td className="py-4"><span className="px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-bold">{tx.status}</span></td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                  </div>
               </Card>
            </>
          )}

        </div>
      </div>

      {/* --- MODAL: IMAGE CROP --- */}
      {showImageModal && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
          <button onClick={() => setShowImageModal(false)} className="absolute top-6 right-6 text-white"><X size={24} /></button>
          <div className="flex flex-col items-center gap-8">
             <div className="w-64 h-64 rounded-full border-4 border-white/20 bg-black flex items-center justify-center overflow-hidden">
                { (currentUser?.avatar?.length || 0) > 5 ? <img src={currentUser?.avatar || ''} className="w-full h-full object-cover" /> : <span className="text-6xl text-[#D4AF37]">{currentUser?.fullName?.[0]}</span> }
             </div>
             <div className="flex gap-4">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect}/>
                <button onClick={() => fileInputRef.current?.click()} className="px-6 py-2 bg-[#D4AF37] font-bold rounded-lg hover:brightness-110">Upload New</button>
             </div>
          </div>
        </div>
      )}

      {showCropModal && tempImage && (
        <ImageCropper src={tempImage} onCancel={() => { setShowCropModal(false); setTempImage(null); }} onSave={handleSaveCrop}/>
      )}

    </DashboardLayout>
  );
}

function ImageCropper({ src, onCancel, onSave }: { src: string, onCancel: () => void, onSave: (url: string) => void }) {
    return (
        <div className="fixed inset-0 z-[110] bg-black flex flex-col items-center justify-center p-4">
            <h3 className="text-white font-bold mb-4">Confirm Photo</h3>
            <img src={src} className="max-w-xs max-h-xs border-2 border-[#D4AF37] rounded-full mb-6" />
            <div className="flex gap-4">
                <button onClick={onCancel} className="text-white font-bold">Cancel</button>
                <button onClick={() => onSave(src)} className="px-8 py-2 bg-[#D4AF37] font-bold rounded-full">Save</button>
            </div>
        </div>
    )
}

function NavButton({ icon: Icon, label, active, onClick }: any) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${active ? 'bg-[#D4AF37] text-black font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
          <Icon size={18}/> {label}
        </button>
    )
}

function InputGroup({ label, icon: Icon, value, onChange, readOnly }: any) {
    return (
        <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">{label}</label>
            <div className={`flex items-center gap-3 p-3 border rounded-lg ${readOnly ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-300'}`}>
                <Icon size={18} className="text-gray-400"/>
                <input type="text" value={value} onChange={onChange} readOnly={readOnly} className="bg-transparent w-full text-sm font-bold text-gray-900 focus:outline-none" />
            </div>
        </div>
    )
}