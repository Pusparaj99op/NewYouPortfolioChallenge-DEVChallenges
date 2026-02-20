import { Github, Instagram, Linkedin, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-card-bg border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
               <img src="/images/logo.png" alt="Logo" className="h-8 w-8 rounded-full" />
               <span className="font-bold text-xl text-white">HACKTHONIX 2.0</span>
            </div>
            <p className="text-gray-400 max-w-sm mb-6">
              Presented by Coding Club, K.D.K. College of Engineering, Nagpur.
              An Autonomous Institute | Accredited by NAAC and NBA.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-neon-green transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-neon-green transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-neon-green transition-colors"><Github size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-neon-green transition-colors"><Mail size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#about" className="hover:text-neon-green">About</a></li>
              <li><a href="#schedule" className="hover:text-neon-green">Schedule</a></li>
              <li><a href="#prizes" className="hover:text-neon-green">Prizes</a></li>
              <li><a href="#tracks" className="hover:text-neon-green">Tracks</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Demo Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/login" className="hover:text-neon-green">Participant Login</a></li>
              <li><a href="/judge" className="hover:text-neon-green">Judge Dashboard</a></li>
              <li><a href="/admin" className="hover:text-neon-green">Admin Dashboard</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 Hackthonix. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-2">
            Built with <span className="text-neon-green">⚡</span> by Design Arena Agent
          </p>
        </div>
      </div>
    </footer>
  );
};
