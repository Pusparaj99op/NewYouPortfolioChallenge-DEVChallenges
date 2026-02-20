import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Github, Clock, CheckCircle, Lock, 
  Terminal, LogOut, Code,
  AlertTriangle, Info, X, Activity
} from 'lucide-react';

// Mock Data for Problem Statements
const PROBLEM_STATEMENTS = [
  { id: 1, title: "AI-Powered Traffic Management", domain: "AI/ML", difficulty: "Hard" },
  { id: 2, title: "Decentralized Voting System", domain: "Blockchain", difficulty: "Medium" },
  { id: 3, title: "Rural Healthcare Telemed App", domain: "App Dev", difficulty: "Medium" },
  { id: 4, title: "Smart Waste Management IoT", domain: "IoT", difficulty: "Hard" },
  { id: 5, title: "Student Mental Health Tracker", domain: "Web Dev", difficulty: "Easy" },
  { id: 6, title: "Fake News Detection Engine", domain: "AI/ML", difficulty: "Medium" },
  { id: 7, title: "Disaster Relief Coordination", domain: "Cloud", difficulty: "Hard" },
  { id: 8, title: "Sustainable Energy Dashboard", domain: "Web Dev", difficulty: "Easy" },
  { id: 9, title: "Secure File Sharing Protocol", domain: "Cybersecurity", difficulty: "Hard" },
  { id: 10, title: "AR Campus Navigation", domain: "AR/VR", difficulty: "Medium" },
  { id: 11, title: "Automated Resume Screener", domain: "AI/ML", difficulty: "Medium" },
  { id: 12, title: "Open Innovation (Wildcard)", domain: "Open", difficulty: "Variable" },
];

export const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [selectedPS, setSelectedPS] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [repoSubmitted, setRepoSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60 * 60); // 10 hours in seconds
  const [lockTimer, setLockTimer] = useState(600); // 10 mins to lock
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('hackthonix_user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));

    // Restore state
    const savedPS = localStorage.getItem('selected_ps');
    if (savedPS) setSelectedPS(parseInt(savedPS));
    
    const savedLock = localStorage.getItem('ps_locked');
    if (savedLock === 'true') setIsLocked(true);

    const savedRepo = localStorage.getItem('repo_url');
    if (savedRepo) {
        setRepoUrl(savedRepo);
        setRepoSubmitted(true);
    }
  }, [navigate]);

  // Main Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Lock Timer
  useEffect(() => {
    if (selectedPS && !isLocked && lockTimer > 0) {
      const timer = setInterval(() => {
        setLockTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (lockTimer === 0 && !isLocked && selectedPS) {
        handleLock();
    }
  }, [selectedPS, isLocked, lockTimer]);

  const handleSelectPS = (id: number) => {
    if (isLocked) return;
    setSelectedPS(id);
    localStorage.setItem('selected_ps', id.toString());
    setLockTimer(600); // Reset lock timer on change (simulated rule)
  };

  const handleLock = () => {
    setIsLocked(true);
    localStorage.setItem('ps_locked', 'true');
  };

  const handleRepoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoUrl) {
      setRepoSubmitted(true);
      localStorage.setItem('repo_url', repoUrl);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hackthonix_user');
    localStorage.removeItem('selected_ps');
    localStorage.removeItem('ps_locked');
    localStorage.removeItem('repo_url');
    navigate('/');
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans relative">
      {/* Sidebar / Topbar */}
      <nav className="bg-card-bg border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-40 shadow-lg shadow-black/50">
        <div className="flex items-center gap-3">
          <div className="bg-neon-green/20 p-2 rounded-lg">
            <Terminal className="text-neon-green" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">HACKTHONIX <span className="text-neon-green">DASHBOARD</span></h1>
            <p className="text-xs text-gray-400">Team: {user?.teamName}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex items-center gap-2 bg-black/50 px-4 py-2 rounded-lg border border-white/10 shadow-inner">
                <Clock size={16} className="text-neon-purple" />
                <span className="font-mono font-bold text-xl tracking-widest">{formatTime(timeLeft)}</span>
            </div>
            <button 
              onClick={() => setShowRules(true)}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors bg-white/5 px-3 py-2 rounded hover:bg-white/10"
            >
              <Info size={16} /> <span className="hidden sm:inline">Judging Criteria</span>
            </button>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors" title="Logout">
                <LogOut size={20} />
            </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* PS Status */}
            <div className={`p-6 rounded-xl border transition-all duration-300 ${selectedPS ? (isLocked ? 'border-neon-green/50 bg-neon-green/5 shadow-[0_0_20px_rgba(0,255,157,0.1)]' : 'border-yellow-500/50 bg-yellow-500/5') : 'border-white/10 bg-card-bg'}`}>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg">Problem Statement</h3>
                    {isLocked ? <Lock size={20} className="text-neon-green" /> : <AlertTriangle size={20} className="text-yellow-500" />}
                </div>
                {selectedPS ? (
                    <div>
                        <p className="text-xl font-bold mb-1">{PROBLEM_STATEMENTS.find(p => p.id === selectedPS)?.title}</p>
                        <p className="text-sm opacity-70 mb-4">{PROBLEM_STATEMENTS.find(p => p.id === selectedPS)?.domain}</p>
                        {!isLocked && (
                            <div className="flex items-center gap-2 text-yellow-500 text-sm bg-yellow-500/10 p-2 rounded">
                                <Clock size={14} /> Locking in {Math.floor(lockTimer / 60)}m {lockTimer % 60}s
                                <button onClick={handleLock} className="ml-auto font-bold hover:text-white underline">Lock Now</button>
                            </div>
                        )}
                        {isLocked && <div className="text-neon-green text-sm flex items-center gap-1 font-bold"><CheckCircle size={14} /> LOCKED</div>}
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm">Action Required: Select a problem statement from the grid below.</p>
                )}
            </div>

            {/* Repo Status */}
            <div className={`p-6 rounded-xl border transition-all duration-300 ${repoSubmitted ? 'border-neon-green/50 bg-neon-green/5 shadow-[0_0_20px_rgba(0,255,157,0.1)]' : 'border-red-500/30 bg-red-500/5'}`}>
                <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg">Repository</h3>
                    <Github size={20} className={repoSubmitted ? "text-neon-green" : "text-gray-400"} />
                </div>
                {repoSubmitted ? (
                    <div>
                        <p className="text-sm text-gray-400 mb-2">Connected Repository:</p>
                        <a href={repoUrl} target="_blank" className="text-neon-green underline truncate block mb-4 hover:text-white transition-colors">{repoUrl}</a>
                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-black/30 p-2 rounded">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            System tracking commits every 5 mins
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleRepoSubmit} className="space-y-3">
                        <input 
                            type="url" 
                            placeholder="https://github.com/username/repo"
                            className="w-full bg-black border border-white/20 rounded px-3 py-2 text-sm focus:border-neon-green outline-none transition-colors text-white"
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            required
                        />
                        <button type="submit" className="w-full bg-white/10 hover:bg-white/20 text-white text-sm font-bold py-2 rounded transition-colors border border-white/10">
                            Connect Repo
                        </button>
                    </form>
                )}
            </div>

            {/* Activity Status */}
            <div className="p-6 rounded-xl border border-white/10 bg-card-bg relative overflow-hidden">
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <h3 className="font-bold text-lg">Live Activity</h3>
                    <Activity size={20} className="text-neon-purple animate-pulse" />
                </div>
                
                <div className="space-y-3 relative z-10">
                   <div className="flex items-center gap-3 text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-green"></div>
                      <span>Team <strong>Alpha</strong> committed 2 mins ago</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-neon-purple"></div>
                      <span>Team <strong>Beta</strong> locked PS #4</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-gray-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                      <span>Team <strong>Gamma</strong> deployed to prod</span>
                   </div>
                </div>

                {/* Graph BG */}
                <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10 flex items-end gap-1 px-4">
                    {[40, 60, 30, 80, 50, 90, 70, 40, 60, 80, 50, 70, 90, 60, 40].map((h, i) => (
                        <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-white rounded-t-sm"></div>
                    ))}
                </div>
            </div>
        </div>

        {/* Problem Grid */}
        <div className="pb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Code className="text-neon-green" /> Problem Statements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {PROBLEM_STATEMENTS.map((ps) => (
                    <button
                        key={ps.id}
                        onClick={() => handleSelectPS(ps.id)}
                        disabled={isLocked}
                        className={`text-left p-5 rounded-xl border transition-all duration-200 relative overflow-hidden group h-full flex flex-col
                            ${selectedPS === ps.id 
                                ? 'border-neon-green bg-neon-green/10 shadow-[0_0_15px_rgba(0,255,157,0.2)]' 
                                : 'border-white/10 bg-card-bg hover:border-white/30 hover:bg-white/5'
                            }
                            ${isLocked && selectedPS !== ps.id ? 'opacity-40 cursor-not-allowed grayscale' : ''}
                        `}
                    >
                        <div className="flex justify-between items-start mb-3 w-full">
                            <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider
                                ${ps.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' : 
                                  ps.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 
                                  'bg-red-500/20 text-red-400'}
                            `}>
                                {ps.difficulty}
                            </span>
                            {selectedPS === ps.id && <CheckCircle size={18} className="text-neon-green" />}
                        </div>
                        <h3 className="font-bold text-white mb-2 group-hover:text-neon-green transition-colors text-lg">{ps.title}</h3>
                        <p className="text-sm text-gray-400 mt-auto pt-4 border-t border-white/5 w-full flex justify-between items-center">
                            <span>{ps.domain}</span>
                            <span className="text-xs px-2 py-0.5 bg-white/10 rounded-full">#{ps.id}</span>
                        </p>
                    </button>
                ))}
            </div>
        </div>
      </main>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-card-bg border border-white/20 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
                <button 
                    onClick={() => setShowRules(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X size={24} />
                </button>
                
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Info className="text-neon-green" /> Judging Criteria
                </h2>

                <div className="space-y-6">
                    <p className="text-gray-300">Teams will be evaluated by judges on 4 key criteria (0-25 points each). Total Score: 100.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-black/30 p-4 rounded-lg border border-white/10">
                            <h3 className="font-bold text-neon-purple mb-1">1. Commit Frequency</h3>
                            <p className="text-sm text-gray-400">Consistency of work and activity pattern. We track your GitHub commits every 5 minutes.</p>
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg border border-white/10">
                            <h3 className="font-bold text-neon-purple mb-1">2. Code Quality</h3>
                            <p className="text-sm text-gray-400">Structure, readability, modularity, and adherence to best practices.</p>
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg border border-white/10">
                            <h3 className="font-bold text-neon-purple mb-1">3. Problem Relevance</h3>
                            <p className="text-sm text-gray-400">Accuracy of the solution to the selected problem statement.</p>
                        </div>
                        <div className="bg-black/30 p-4 rounded-lg border border-white/10">
                            <h3 className="font-bold text-neon-purple mb-1">4. Final Submission</h3>
                            <p className="text-sm text-gray-400">Completeness, innovation, and functionality of the final prototype.</p>
                        </div>
                    </div>

                    <div className="bg-neon-green/10 border border-neon-green/20 p-4 rounded-lg">
                        <p className="text-sm text-neon-green font-bold text-center">
                            "Build from Zero | Ship before Sunset"
                        </p>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
