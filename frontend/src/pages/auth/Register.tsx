import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Scale, Loader2, ArrowRight } from 'lucide-react';

const API_URL = 'http://localhost:3000';

export default function Register() {
  const navigate = useNavigate();
  // 1. Get Role from URL (e.g., /public/register -> role = "public")
  const { role } = useParams<{ role: string }>(); 
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 2. Validate Role on Load
  useEffect(() => {
      // If someone goes to just /register without role, default to public
      if (!role || (role !== 'public' && role !== 'lawyer' && role !== 'student')) {
          console.log("Invalid role, defaulting to public");
      }
  }, [role]);

  // 3. Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
    }

    setLoading(true);

    try {
        // Send to Backend
        await axios.post(`${API_URL}/auth/register`, {
            email: formData.email,
            password: formData.password,
            fullName: formData.fullName,
            role: role // Send the URL role to the backend
        });

        // Success -> Go to Login
        alert("Registration Successful! Please login.");
        navigate('/login');
        
    } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || 'Registration failed. Try a different email.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-legal-paper flex items-center justify-center p-4">
       <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
           
           {/* Header */}
           <div className="bg-judicial-black p-8 text-center">
               <Scale className="mx-auto text-judicial-gold mb-3" size={40} />
               <h1 className="text-2xl font-serif font-bold text-white tracking-wide">JAI-SETHU</h1>
               <p className="text-judicial-gold text-xs font-bold uppercase tracking-widest mt-1">
                   {role?.toUpperCase()} REGISTRATION
               </p>
           </div>

           {/* Form */}
           <div className="p-8">
               {error && (
                   <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg border border-red-100 flex items-center justify-center">
                       {error}
                   </div>
               )}

               <form onSubmit={handleSubmit} className="space-y-4">
                   <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                       <input 
                           type="text" 
                           required
                           className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-judicial-gold transition-colors"
                           value={formData.fullName}
                           onChange={e => setFormData({...formData, fullName: e.target.value})}
                       />
                   </div>
                   
                   <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                       <input 
                           type="email" 
                           required
                           className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-judicial-gold transition-colors"
                           value={formData.email}
                           onChange={e => setFormData({...formData, email: e.target.value})}
                       />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                       <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password</label>
                           <input 
                               type="password" 
                               required
                               className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-judicial-gold transition-colors"
                               value={formData.password}
                               onChange={e => setFormData({...formData, password: e.target.value})}
                           />
                       </div>
                       <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Confirm</label>
                           <input 
                               type="password" 
                               required
                               className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-judicial-gold transition-colors"
                               value={formData.confirmPassword}
                               onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                           />
                       </div>
                   </div>

                   <button 
                       type="submit" 
                       disabled={loading}
                       className="w-full py-3 bg-judicial-gold text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 mt-2"
                   >
                       {loading ? <Loader2 className="animate-spin"/> : <ArrowRight size={18} />}
                       Create Account
                   </button>
               </form>

               <div className="mt-6 text-center text-sm text-gray-500">
                   Already have an account? <Link to="/login" className="text-judicial-black font-bold hover:underline">Sign In</Link>
               </div>
           </div>
       </div>
    </div>
  );
}