import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Scale, Loader2, ArrowRight, Lock } from 'lucide-react';

// 1. Redux Imports
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../../redux/userSlice';
import type { RootState } from '../../redux/store';

const API_URL = 'http://localhost:3000';

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 2. Get state from Redux (instead of local state)
  const { loading, error } = useSelector((state: RootState) => state.user);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 3. Start Redux Loading
    dispatch(signInStart());

    try {
      // Send Login Request
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      const { access_token, user } = res.data;

      // Save to Session
      sessionStorage.setItem('token', access_token);

      // 4. Update Redux with User Data
      dispatch(signInSuccess(user));

      // SMART REDIRECT (Based on Role)
      switch (user.role?.toLowerCase()) {
        case 'lawyer':
          navigate('/lawyer');
          break;
        case 'student':
          navigate('/student');
          break;
        case 'admin':
          navigate('/admin');
          break;
        case 'founder':
          navigate('/founder');
          break;
        default:
          navigate('/public');
      }

    } catch (err: any) {
      console.error(err);
      // 5. Send Error to Redux
      dispatch(signInFailure(err.response?.data?.message || 'Invalid email or password.'));
    }
  };

  return (
    <div className="min-h-screen bg-legal-paper flex items-center justify-center p-4">
       <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
           
           {/* Header */}
           <div className="bg-judicial-black p-8 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-judicial-gold/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
               <Scale className="mx-auto text-judicial-gold mb-3 relative z-10" size={40} />
               <h1 className="text-2xl font-serif font-bold text-white tracking-wide relative z-10">JAI-SETHU</h1>
               <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1 relative z-10">
                   Secure Portal Access
               </p>
           </div>

           {/* Form */}
           <div className="p-8">
               {error && (
                   <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg border border-red-100 flex items-center gap-2">
                       <Lock size={14}/> {error}
                   </div>
               )}

               <form onSubmit={handleLogin} className="space-y-5">
                   <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email Address</label>
                       <input 
                           type="email" 
                           required
                           className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-judicial-gold focus:bg-white transition-all font-medium"
                           value={email}
                           onChange={e => setEmail(e.target.value)}
                           placeholder="name@example.com"
                       />
                   </div>
                   
                   <div>
                       <div className="flex justify-between items-center mb-1">
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                          <a href="#" className="text-xs text-judicial-gold hover:underline">Forgot?</a>
                       </div>
                       <input 
                           type="password" 
                           required
                           className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-judicial-gold focus:bg-white transition-all font-medium"
                           value={password}
                           onChange={e => setPassword(e.target.value)}
                           placeholder="••••••••"
                       />
                   </div>

                   <button 
                       type="submit" 
                       disabled={loading}
                       className="w-full py-3 bg-judicial-gold text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 mt-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                   >
                       {loading ? <Loader2 className="animate-spin" size={20}/> : <ArrowRight size={20} />}
                       {loading ? 'Authenticating...' : 'Access Account'}
                   </button>
               </form>

               <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
                   Don't have an account? 
                   <div className="flex justify-center gap-4 mt-3">
                       <Link to="/public/register" className="text-judicial-black font-bold hover:text-judicial-gold transition-colors">Citizen</Link>
                       <span className="text-gray-300">|</span>
                       <Link to="/lawyer/register" className="text-judicial-black font-bold hover:text-judicial-gold transition-colors">Lawyer</Link>
                       <span className="text-gray-300">|</span>
                       <Link to="/student/register" className="text-judicial-black font-bold hover:text-judicial-gold transition-colors">Student</Link>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
}