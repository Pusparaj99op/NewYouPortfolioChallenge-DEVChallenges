import { Terminal, Database, Cloud, Shield, Cpu, Globe, Smartphone, Brain } from 'lucide-react';

export const ProblemStatements = () => {
  const domains = [
    { icon: <Globe />, name: "Web Development", desc: "Build scalable web solutions." },
    { icon: <Smartphone />, name: "App Development", desc: "Create innovative mobile experiences." },
    { icon: <Brain />, name: "AI / ML", desc: "Intelligent systems and automation." },
    { icon: <Cloud />, name: "Cloud Computing", desc: "Serverless and distributed systems." },
    { icon: <Shield />, name: "Cybersecurity", desc: "Secure the digital frontier." },
    { icon: <Database />, name: "Blockchain", desc: "Decentralized applications." },
    { icon: <Cpu />, name: "IoT", desc: "Connected hardware solutions." },
    { icon: <Terminal />, name: "Open Innovation", desc: "Solve a problem of your choice." },
  ];

  return (
    <section id="tracks" className="py-20 bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">Problem <span className="text-neon-purple">Domains</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We have 12 specific problem statements locked in a grid. They will be revealed at the start of the event. 
            Prepare yourself across these key domains.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {domains.map((domain, index) => (
            <div key={index} className="bg-card-bg p-6 rounded-xl border border-white/5 hover:border-neon-purple/50 transition-all duration-300 hover:-translate-y-1 group">
              <div className="text-neon-purple mb-4 group-hover:text-neon-green transition-colors">
                {domain.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{domain.name}</h3>
              <p className="text-sm text-gray-500">{domain.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-gradient-to-r from-neon-purple/10 to-neon-green/10 rounded-2xl border border-white/10 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Selection Rule</h3>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Teams will select <strong>ONE</strong> Problem Statement from the grid. You will have a <span className="text-neon-green font-bold">10-minute window</span> to change your selection. After that, it is <span className="text-red-500 font-bold">PERMANENTLY LOCKED</span>. Choose wisely.
          </p>
        </div>
      </div>
    </section>
  );
};
