import { Trophy, Medal, Award } from 'lucide-react';

export const Prizes = () => {
  return (
    <section id="prizes" className="py-20 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neon-green/5 via-transparent to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">Prize <span className="text-neon-green">Pool</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Code hard, ship fast, and take home the glory (and the cash).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
          {/* 2nd Place */}
          <div className="bg-card-bg border border-white/10 rounded-xl p-8 text-center transform hover:-translate-y-2 transition-transform duration-300 relative group">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gray-300 text-black p-3 rounded-full border-4 border-card-bg">
              <Medal size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mt-8 mb-2">2nd Runner Up</h3>
            <div className="text-4xl font-bold text-white mb-4">₹7,500</div>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>Certificate of Excellence</li>
              <li>Swag Kit</li>
              <li>Mentorship Session</li>
            </ul>
          </div>

          {/* 1st Place */}
          <div className="bg-card-bg border border-neon-green/50 rounded-xl p-8 text-center transform hover:-translate-y-2 transition-transform duration-300 relative group shadow-[0_0_30px_rgba(0,255,157,0.15)] scale-105 z-10">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neon-green text-black p-4 rounded-full border-4 border-card-bg shadow-lg shadow-neon-green/50">
              <Trophy size={40} />
            </div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-green to-transparent"></div>
            <h3 className="text-3xl font-bold text-neon-green mt-10 mb-2">WINNER</h3>
            <div className="text-5xl font-bold text-white mb-6">₹10,000</div>
            <ul className="text-gray-300 space-y-3">
              <li className="flex items-center justify-center gap-2"><Award size={16} className="text-neon-green" /> Winner Trophy</li>
              <li className="flex items-center justify-center gap-2"><Award size={16} className="text-neon-green" /> Certificate of Merit</li>
              <li className="flex items-center justify-center gap-2"><Award size={16} className="text-neon-green" /> Premium Swag</li>
              <li className="flex items-center justify-center gap-2"><Award size={16} className="text-neon-green" /> Internship Opportunity</li>
            </ul>
          </div>

          {/* 3rd Place */}
          <div className="bg-card-bg border border-white/10 rounded-xl p-8 text-center transform hover:-translate-y-2 transition-transform duration-300 relative group">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-amber-700 text-white p-3 rounded-full border-4 border-card-bg">
              <Medal size={32} />
            </div>
            <h3 className="text-2xl font-bold text-amber-600 mt-8 mb-2">3rd Runner Up</h3>
            <div className="text-4xl font-bold text-white mb-4">₹5,000</div>
            <ul className="text-gray-400 space-y-2 text-sm">
              <li>Certificate of Excellence</li>
              <li>Swag Kit</li>
              <li>Mentorship Session</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
