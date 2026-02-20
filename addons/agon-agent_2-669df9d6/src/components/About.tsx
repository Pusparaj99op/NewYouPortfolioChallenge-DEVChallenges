import { Calendar, MapPin, Users, Clock, Zap, Target, Trophy } from 'lucide-react';

export const About = () => {
  return (
    <section id="about" className="py-20 bg-dark-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-white">
              About <span className="text-neon-purple">The Event</span>
            </h2>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              Hackthonix 2.0 is not just a hackathon; it's a test of speed, precision, and innovation. 
              Organized by the <strong className="text-white">Coding Club at K.D.K. College of Engineering</strong>, 
              this event challenges you to build a functional prototype from scratch in just 10 hours.
            </p>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              Whether you are a college student, professional, or coding enthusiast, this is your arena 
              to prove your mettle. With 12 unique problem statements and a "Ship before Sunset" philosophy, 
              only the most agile teams will survive.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-card-bg rounded-lg border border-white/5">
                <Calendar className="text-neon-green" size={24} />
                <div>
                  <h4 className="font-bold text-white">Date</h4>
                  <p className="text-sm text-gray-400">10th March 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-card-bg rounded-lg border border-white/5">
                <Clock className="text-neon-green" size={24} />
                <div>
                  <h4 className="font-bold text-white">Time</h4>
                  <p className="text-sm text-gray-400">7:00 AM - 5:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-card-bg rounded-lg border border-white/5">
                <MapPin className="text-neon-green" size={24} />
                <div>
                  <h4 className="font-bold text-white">Venue</h4>
                  <p className="text-sm text-gray-400">KDKCE (Block-B), CSE Dept.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-card-bg rounded-lg border border-white/5">
                <Users className="text-neon-green" size={24} />
                <div>
                  <h4 className="font-bold text-white">Team Size</h4>
                  <p className="text-sm text-gray-400">2-4 Members</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-neon-purple/20 blur-xl rounded-full"></div>
            <div className="relative grid grid-cols-2 gap-4">
              <div className="bg-card-bg p-6 rounded-xl border border-white/10 hover:border-neon-purple/50 transition-colors">
                <Zap className="text-neon-purple mb-4" size={40} />
                <h3 className="text-xl font-bold mb-2">Sprint Mode</h3>
                <p className="text-gray-400 text-sm">10 hours of intense coding. No fluff, just shipping.</p>
              </div>
              <div className="bg-card-bg p-6 rounded-xl border border-white/10 hover:border-neon-purple/50 transition-colors mt-8">
                <Target className="text-neon-purple mb-4" size={40} />
                <h3 className="text-xl font-bold mb-2">12 Problems</h3>
                <p className="text-gray-400 text-sm">Choose from a grid of real-world challenges.</p>
              </div>
              <div className="bg-card-bg p-6 rounded-xl border border-white/10 hover:border-neon-purple/50 transition-colors">
                <Users className="text-neon-purple mb-4" size={40} />
                <h3 className="text-xl font-bold mb-2">Open to All</h3>
                <p className="text-gray-400 text-sm">Students, pros, and enthusiasts welcome.</p>
              </div>
              <div className="bg-card-bg p-6 rounded-xl border border-white/10 hover:border-neon-purple/50 transition-colors mt-8">
                <Trophy className="text-neon-purple mb-4" size={40} />
                <h3 className="text-xl font-bold mb-2">Big Prizes</h3>
                <p className="text-gray-400 text-sm">Cash rewards and recognition for top teams.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
