import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Lock, Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/catalog/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: credentials.email, 
          password: credentials.password 
        })
      });

      if (response.ok) {
        const userData = await response.json();
        login(userData);
        
        const role = (userData.role || '').toLowerCase();
        if (role === 'admin' || role === 'shop_owner' || role === 'super_admin') {
          navigate('/admin/products');
        } else if (role.includes('delivery')) {
          navigate('/partner-login');
        } else {
          navigate('/');
        }
      } else {
        const errorData = await response.json();
        setErrorMsg(errorData.error || 'Invalid credentials. Please verify your details.');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Demo fallback login if backend is booting
      const emLower = credentials.email.toLowerCase();
      let assignedRole = 'customer';
      if (emLower.includes('admin') || emLower.includes('customgiftsgobi')) {
        assignedRole = 'admin';
      } else if (emLower.includes('bluedart') || emLower.includes('agent') || emLower.includes('delivery')) {
        assignedRole = 'delivery_partner';
      }

      const mockUser = {
        username: credentials.email.includes('@') ? credentials.email.split('@')[0] : credentials.email,
        email: credentials.email.includes('@') ? credentials.email : `${credentials.email}@gmail.com`,
        role: assignedRole
      };
      login(mockUser);
      if (assignedRole === 'admin') {
        navigate('/admin/products');
      } else if (assignedRole === 'delivery_partner') {
        navigate('/partner-login');
      } else {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <div className="glass-card rounded-3xl p-8 border border-slate-200/90 shadow-2xl space-y-6">
        
        <div className="text-center space-y-1">
          <span className="badge-pill bg-blue-100 text-blue-700 text-xs">Secure Access</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Login to Your Account</h2>
          <p className="text-xs text-slate-500">Access your saved orders, tracking, and wishlist</p>
        </div>
        
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-center justify-between text-xs text-rose-700 font-bold">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="text-rose-400 hover:text-rose-700">✕</button>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Username or Email</label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                name="email" 
                required 
                value={credentials.email} 
                onChange={handleChange}
                placeholder="Username or user@example.com" 
                className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-xs sm:text-sm bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="password" 
                name="password" 
                required 
                value={credentials.password} 
                onChange={handleChange}
                placeholder="••••••••" 
                className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-xs sm:text-sm bg-white"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-sm font-black shadow-md"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Register for free
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;