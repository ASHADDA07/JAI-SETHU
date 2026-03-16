import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInSuccess } from '../../redux/userSlice';
import type { RootState } from '../../redux/store';

import { DashboardLayout } from '../../layouts/DashboardLayout';
import { 
  User, Shield, Mail, Phone, MapPin, 
  Camera, Briefcase, CreditCard,
  Loader2, Save, CheckCircle, AlertCircle, Edit3, X
} from 'lucide-react';

const API_URL = 'http://localhost:3000';

interface ProfileProps {
  role?: 'lawyer' | 'student' | 'public';
}

export default function ProfileSettings({ role = 'lawyer' }: ProfileProps) {
  const dispatch = useDispatch();
  const { currentUser, loading: contextLoading } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  
  // ✅ RESTORED BILLING TAB
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'billing'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', location: '',
    barLicenseNo: '', specialization: '', courtJurisdiction: '',
    university: '', yearOfStudy: 1
  });

  const transactions = [
    { id: "INV-001", date: "Feb 01, 2026", desc: "Pro Plan Subscription", amount: "₹499.00", status: "Paid" },
    { id: "INV-002", date: "Jan 01, 2026", desc: "Pro Plan Subscription", amount: "₹499.00", status: "Paid" },
  ];

  useEffect(() => {
    const token = localStorage.getItem('token'); 
    if (!token && !currentUser && !contextLoading) {
        navigate('/login');
        return;
    }

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${API_URL}/users?email=${currentUser?.email}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const dbUser = res.data;
            
            // ✅ MATCHED EXACTLY WITH PRISMA DB
            setFormData({
                fullName: dbUser.fullName || '',
                email: dbUser.email || '',
                barLicenseNo: dbUser.lawyerProfile?.barEnrollmentNo || '',
                specialization: dbUser.lawyerProfile?.specialization || '',
                courtJurisdiction: dbUser.lawyerProfile?.practicingCourt || '',
                university: dbUser.studentProfile?.university || '',
                yearOfStudy: dbUser.studentProfile?.year || 1,
                phone: dbUser.phone || '',
                location: dbUser.location || '',
            });
        } catch (err) {
            console.error("Failed to load profile", err);
        } finally {
            setFetching(false);
        }
    };

    if (currentUser?.email) fetchProfile();
  }, [currentUser, contextLoading, navigate]);

  const handleSaveProfile = async () => {
    if (!currentUser?.id) return;
    setSaving(true);
    setToast(null);
    const token = localStorage.getItem('token');

    try {
        const payload: any = {
            fullName: formData.fullName,
            phone: formData.phone,
            location: formData.location,
        };

        if (role === 'lawyer') {
            payload.barEnrollmentNo = formData.barLicenseNo;
            payload.specialization = formData.specialization;
            payload.practicingCourt = formData.courtJurisdiction;
        }

        const res = await axios.put(`${API_URL}/users/${currentUser.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        dispatch(signInSuccess({ ...currentUser, ...res.data }));
        setToast({ type: 'success', text: "Profile updated successfully!" });
        setIsEditing(false);
        setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
        setToast({ type: 'error', text: err.response?.data?.message || "Failed to save changes." });
    } finally {
        setSaving(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentUser) {
      const fakeUrl = URL.createObjectURL(file);
      dispatch(signInSuccess({ ...currentUser, avatar: fakeUrl }));
      setToast({ type: 'success', text: "Profile photo updated visually!" });
      setTimeout(() => setToast(null), 3000);
    }
  };

  // ✅ NAME FALLBACK FIX
  const displayName = currentUser?.fullName || (currentUser as any)?.name || 'Advocate';

  if (contextLoading || fetching) return (
      <DashboardLayout>
        <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-[#D4AF37]" size={48} /> 
            <p className="text-gray-500 font-bold">Loading your secure profile...</p>
        </div>
      </DashboardLayout>
  );

  return (
    <DashboardLayout>
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold text-sm animate-in slide-in-from-top-5 ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            {toast.type === 'success' ? <CheckCircle size={18}/> : <AlertCircle size={18}/>}
            {toast.text}
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-serif font-bold text-gray-900">Account Settings</h2>
            <p className="text-gray-500 mt-1">Manage your professional identity and personal details.</p>
        </div>
        <div className="px-4 py-1.5 rounded-md text-xs font-bold bg-[#D4AF37]/10 text-[#B8962E] border border-[#D4AF37]/30 uppercase tracking-widest">
            {role} PROFILE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden sticky top-24">
             <div className="p-8 text-center border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white relative">
                
                <div className="relative w-32 h-32 mx-auto mb-5 group">
                   <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-900 text-[#D4AF37] flex items-center justify-center font-serif font-bold text-5xl relative z-0">
                      { (currentUser?.avatar?.length || 0) > 5 ? <img src={currentUser?.avatar || ''} className="w-full h-full object-cover" /> : displayName[0] }
                   </div>
                   
                   <div onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer">
                      <Camera className="text-white mb-1" size={24} />
                      <span className="text-white text-xs font-bold">Change</span>
                   </div>
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect}/>
                </div>
                
                <h3 className="font-bold text-gray-900 text-xl">{displayName}</h3>
                <p className="text-sm font-mono text-gray-500 mt-1 bg-gray-100 inline-block px-3 py-1 rounded-full">{currentUser?.jaiId || 'JAI-PENDING'}</p>
             </div>
             
             <nav className="p-3 space-y-1">
                <NavButton icon={User} label="My Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                <NavButton icon={Shield} label="Security" active={activeTab === 'security'} onClick={() => setActiveTab('security')} />
                {role !== 'public' && (
                    <NavButton icon={CreditCard} label="Billing & Payments" active={activeTab === 'billing'} onClick={() => setActiveTab('billing')} />
                )}
             </nav>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
               <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                      isEditing ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isEditing ? <><X size={16}/> Cancel</> : <><Edit3 size={16}/> Edit Profile</>}
                  </button>
               </div>
               
               <div className="p-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InputGroup label="Full Name" icon={User} value={formData.fullName} onChange={(e:any) => setFormData({...formData, fullName: e.target.value})} readOnly={!isEditing} />
                    <InputGroup label="Email Address" icon={Mail} value={formData.email} readOnly={true} /> 
                    <InputGroup label="Phone Number" icon={Phone} value={formData.phone} onChange={(e:any) => setFormData({...formData, phone: e.target.value})} readOnly={!isEditing} placeholder="Add your phone number" />
                    <InputGroup label="Location / City" icon={MapPin} value={formData.location} onChange={(e:any) => setFormData({...formData, location: e.target.value})} readOnly={!isEditing} placeholder="Add your city" />

                    {role === 'lawyer' && (
                      <div className="md:col-span-2 bg-gradient-to-br from-[#D4AF37]/10 to-transparent p-6 rounded-2xl border border-[#D4AF37]/30 mt-4 relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-4 opacity-10"><Briefcase size={100}/></div>
                         <h4 className="font-bold text-gray-900 flex items-center gap-2 text-sm uppercase tracking-widest mb-6 text-[#B8962E]">
                             <Shield size={18}/> Verified Advocate Details
                         </h4>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                             <InputGroup label="Bar Enrollment No" icon={Briefcase} value={formData.barLicenseNo} onChange={(e:any) => setFormData({...formData, barLicenseNo: e.target.value})} readOnly={!isEditing} placeholder="e.g. MAH/1234/2020" />
                             <InputGroup label="Practicing Court" icon={MapPin} value={formData.courtJurisdiction} onChange={(e:any) => setFormData({...formData, courtJurisdiction: e.target.value})} readOnly={!isEditing} placeholder="e.g. Supreme Court" />
                             <div className="md:col-span-2">
                                <InputGroup label="Specializations" icon={Briefcase} value={formData.specialization} onChange={(e:any) => setFormData({...formData, specialization: e.target.value})} readOnly={!isEditing} placeholder="e.g. Corporate Law, Criminal Defense" />
                             </div>
                         </div>
                      </div>
                    )}
                 </div>

                 {isEditing && (
                   <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end animate-in fade-in">
                      <button 
                        onClick={handleSaveProfile} 
                        disabled={saving}
                        className="px-8 py-3.5 bg-black text-white rounded-xl font-bold text-base hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                      >
                          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                          Save Changes
                      </button>
                   </div>
                 )}
               </div>
            </div>
          )}

          {activeTab === 'security' && (
             <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
                 <Shield className="mx-auto mb-4 text-[#D4AF37]" size={56} />
                 <h3 className="font-bold text-2xl text-gray-900">Security Settings</h3>
                 <p className="text-base text-gray-500 mb-8 mt-2 max-w-md mx-auto">Update your password or enable Two-Factor Authentication to keep your legal data secure.</p>
                 <button className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors">
                     Send Password Reset Link
                 </button>
             </div>
          )}

          {/* ✅ RESTORED BILLING CONTENT */}
          {activeTab === 'billing' && role !== 'public' && (
             <div className="space-y-6">
                <div className="bg-gradient-to-r from-gray-900 to-black text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                   <div className="flex justify-between items-center relative z-10">
                      <div>
                         <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-2">Current Subscription</p>
                         <h3 className="text-4xl font-serif font-bold text-[#D4AF37]">Premium Firm</h3>
                      </div>
                      <div className="text-right">
                         <p className="text-3xl font-bold">₹499<span className="text-base text-gray-400 font-normal">/mo</span></p>
                         <p className="text-sm text-gray-400 mt-1">Renews on Mar 01, 2026</p>
                      </div>
                   </div>
                </div>
                
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                   <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                      <h3 className="text-xl font-bold text-gray-900">Payment History</h3>
                   </div>
                   <div className="p-0">
                      <table className="w-full text-left">
                         <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-500 tracking-wider">
                             <tr>
                                 <th className="px-8 py-4">Invoice ID</th>
                                 <th className="px-8 py-4">Date</th>
                                 <th className="px-8 py-4">Amount</th>
                                 <th className="px-8 py-4">Status</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100">
                            {transactions.map((tx) => (
                               <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-8 py-5 font-mono text-gray-600 text-sm">{tx.id}</td>
                                  <td className="px-8 py-5 text-sm text-gray-700">{tx.date}</td>
                                  <td className="px-8 py-5 font-bold text-gray-900">{tx.amount}</td>
                                  <td className="px-8 py-5">
                                      <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200">{tx.status}</span>
                                  </td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>
             </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function NavButton({ icon: Icon, label, active, onClick }: any) {
    return (
        <button onClick={onClick} className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm rounded-xl transition-all ${active ? 'bg-[#D4AF37] text-black font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-50 font-medium'}`}>
          <Icon size={18}/> {label}
        </button>
    )
}

function InputGroup({ label, icon: Icon, value, onChange, readOnly, placeholder }: any) {
    return (
        <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">{label}</label>
            <div className={`flex items-center gap-3 p-3.5 border-2 rounded-xl transition-colors ${readOnly ? 'bg-gray-50 border-gray-100 text-gray-500' : 'bg-white border-gray-200 focus-within:border-[#D4AF37]'}`}>
                <Icon size={20} className={readOnly ? "text-gray-400" : "text-[#D4AF37]"}/>
                <input 
                  type="text" 
                  value={value} 
                  onChange={onChange} 
                  readOnly={readOnly} 
                  placeholder={placeholder}
                  className="bg-transparent w-full text-base font-bold text-gray-900 focus:outline-none placeholder:font-medium placeholder:text-gray-400" 
                />
            </div>
        </div>
    )
}