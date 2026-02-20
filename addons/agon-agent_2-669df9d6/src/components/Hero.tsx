import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export const Hero = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Target date: March 10th, 2026, 7:00 AM
    const targetDate = new Date('2026-03-10T07:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/hero-bg.png" 
          alt="Cyberpunk Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-dark-bg"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green text-sm font-semibold mb-6 tracking-wider">
            PRESENTED BY CODING CLUB, KDKCE
          </span>
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-4 text-white">
            HACK<span className="text-neon-green text-glow">THONIX</span> 2.0
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto font-light">
            10-HOUR INNOVATION SPRINT
            <br />
            <span className="text-neon-purple font-semibold">Build from Zero | Ship before Sunset | Outperform the Rest</span>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-card-bg/50 backdrop-blur border border-white/10 p-4 rounded-lg w-24 md:w-32">
              <div className="text-3xl md:text-4xl font-bold text-white">{timeLeft.days}</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest">Days</div>
            </div>
            <div className="bg-card-bg/50 backdrop-blur border border-white/10 p-4 rounded-lg w-24 md:w-32">
              <div className="text-3xl md:text-4xl font-bold text-white">{timeLeft.hours}</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest">Hours</div>
            </div>
            <div className="bg-card-bg/50 backdrop-blur border border-white/10 p-4 rounded-lg w-24 md:w-32">
              <div className="text-3xl md:text-4xl font-bold text-white">{timeLeft.minutes}</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest">Mins</div>
            </div>
            <div className="bg-card-bg/50 backdrop-blur border border-white/10 p-4 rounded-lg w-24 md:w-32">
              <div className="text-3xl md:text-4xl font-bold text-neon-green">{timeLeft.seconds}</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest">Secs</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#register"
              className="px-8 py-4 bg-neon-green text-black font-bold text-lg rounded hover:bg-white hover:scale-105 transition-all duration-200 shadow-[0_0_20px_rgba(0,255,157,0.4)]"
            >
              Register Now
            </a>
            <a 
              href="#about"
              className="px-8 py-4 bg-transparent border border-white/30 text-white font-bold text-lg rounded hover:bg-white/10 hover:border-white transition-all duration-200"
            >
              Learn More
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
