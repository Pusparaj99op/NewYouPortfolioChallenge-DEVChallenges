export const Schedule = () => {
    const events = [
      { time: "07:00 AM", title: "Reporting & Check-in", desc: "Get your ID cards and swag." },
      { time: "08:00 AM", title: "Opening Ceremony", desc: "Welcome address and rules briefing." },
      { time: "08:30 AM", title: "Problem Statement Reveal", desc: "The grid is unlocked." },
      { time: "09:00 AM", title: "Hacking Begins", desc: "10-hour countdown starts." },
      { time: "01:00 PM", title: "Lunch Break", desc: "Refuel and network." },
      { time: "04:00 PM", title: "Mentorship Round", desc: "Feedback from industry experts." },
      { time: "07:00 PM", title: "Coding Ends", desc: "Hands off keyboards!" },
      { time: "07:30 PM", title: "Presentations", desc: "Round 2: Pitch your prototype." },
      { time: "09:00 PM", title: "Prize Distribution", desc: "Winners announced." },
    ];
  
    return (
      <section id="schedule" className="py-20 bg-dark-bg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Event <span className="text-neon-purple">Timeline</span></h2>
            <p className="text-gray-400">A packed day of coding, learning, and competing.</p>
          </div>
  
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neon-green/50 before:to-transparent">
            {events.map((event, index) => (
              <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-neon-green/50 bg-black shadow-[0_0_10px_rgba(0,255,157,0.3)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <div className="w-3 h-3 bg-neon-green rounded-full"></div>
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card-bg p-6 rounded-xl border border-white/5 hover:border-neon-green/30 transition-all shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-neon-green">{event.time}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                  <p className="text-gray-400 text-sm">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
