import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, User, Mail, Phone, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    teamName: '',
    email: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    localStorage.setItem('hackthonix_user', JSON.stringify(formData));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neon-purple/5 via-transparent to-neon-green/5"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-card-bg border border-white/10 rounded-2xl p-8 relative z-10 shadow-2xl shadow-black/50"
      >
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-neon-green/10 border border-neon-green/30 mb-4">
            <Terminal className="text-neon-green" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Team Login</h1>
          <p className="text-gray-400">Enter your details to access the dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <User size={16} className="text-neon-purple" /> Team Name
            </label>
            <input 
              type="text" 
              required
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all"
              placeholder="e.g. Code Warriors"
              value={formData.teamName}
              onChange={(e) => setFormData({...formData, teamName: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Mail size={16} className="text-neon-purple" /> Lead Email
            </label>
            <input 
              type="email" 
              required
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all"
              placeholder="lead@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Phone size={16} className="text-neon-purple" /> Contact Number
            </label>
            <input 
              type="tel" 
              required
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green transition-all"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-neon-green text-black font-bold py-4 rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2 group"
          >
            Enter Dashboard
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
            ← Back to Home
          </a>
        </div>
      </motion.div>
    </div>
  );
};
