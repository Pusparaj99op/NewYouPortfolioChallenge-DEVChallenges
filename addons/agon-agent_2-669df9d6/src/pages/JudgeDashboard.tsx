import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Star, GitCommit, Code, 
  CheckCircle, Search, LogOut
} from 'lucide-react';

const TEAMS = [
  { id: 1, name: "Code Warriors", ps: "AI-Powered Traffic Management", repo: "github.com/cw/traffic-ai", commits: 45, score: 0 },
  { id: 2, name: "Null Pointers", ps: "Smart Waste Management IoT", repo: "github.com/np/waste-iot", commits: 32, score: 0 },
  { id: 3, name: "Binary Bosses", ps: "Decentralized Voting System", repo: "github.com/bb/vote-chain", commits: 67, score: 85 },
  { id: 4, name: "Syntax Terrors", ps: "Fake News Detection Engine", repo: "github.com/st/fake-news", commits: 12, score: 0 },
  { id: 5, name: "Agile Avengers", ps: "Rural Healthcare Telemed App", repo: "github.com/aa/telemed", commits: 55, score: 92 },
];

export const JudgeDashboard = () => {
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);
  const [scores, setScores] = useState({ c1: 0, c2: 0, c3: 0, c4: 0 });
  const [searchTerm, setSearchTerm] = useState("");

  const handleScoreChange = (criteria: string, value: string) => {
    setScores(prev => ({ ...prev, [criteria]: parseInt(value) || 0 }));
  };

  const calculateTotal = () => scores.c1 + scores.c2 + scores.c3 + scores.c4;

  const handleSubmitScore = () => {
    alert(`Score submitted for team! Total: ${calculateTotal()}/100`);
    setSelectedTeam(null);
    setScores({ c1: 0, c2: 0, c3: 0, c4: 0 });
  };

  const filteredTeams = TEAMS.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans">
      <nav className="bg-card-bg border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-neon-purple/20 p-2 rounded-lg">
            <Star className="text-neon-purple" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">JUDGE <span className="text-neon-purple">PANEL</span></h1>
            <p className="text-xs text-gray-400">Welcome, Judge Davis</p>
          </div>
        </div>
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition-colors">
            <LogOut size={20} />
        </button>
      </nav>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Team List */}
        <div className="lg:col-span-1 space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                    type="text" 
                    placeholder="Search teams..." 
                    className="w-full bg-black border border-white/10 rounded-lg pl-10 pr-4 py-3 focus:border-neon-purple outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {filteredTeams.map(team => (
                    <button
                        key={team.id}
                        onClick={() => setSelectedTeam(team.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${selectedTeam === team.id ? 'border-neon-purple bg-neon-purple/10' : 'border-white/5 bg-card-bg hover:bg-white/5'}`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="font-bold">{team.name}</h3>
                            {team.score > 0 && <CheckCircle size={16} className="text-green-500" />}
                        </div>
                        <p className="text-xs text-gray-400 truncate">{team.ps}</p>
                    </button>
                ))}
            </div>
        </div>

        {/* Evaluation Panel */}
        <div className="lg:col-span-2">
            {selectedTeam ? (
                <div className="bg-card-bg border border-white/10 rounded-2xl p-6 md:p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">{TEAMS.find(t => t.id === selectedTeam)?.name}</h2>
                            <p className="text-gray-400 flex items-center gap-2">
                                <Code size={16} /> {TEAMS.find(t => t.id === selectedTeam)?.ps}
                            </p>
                        </div>
                        <div className="text-right">
                             <a href={`https://${TEAMS.find(t => t.id === selectedTeam)?.repo}`} target="_blank" className="flex items-center gap-2 text-neon-green hover:underline mb-1">
                                <GitCommit size={16} /> View Repo
                             </a>
                             <p className="text-xs text-gray-500">
                                {TEAMS.find(t => t.id === selectedTeam)?.commits} commits tracked
                             </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {[
                            { id: 'c1', label: 'Commit Frequency', desc: 'Consistency of activity' },
                            { id: 'c2', label: 'Code Quality', desc: 'Structure & Best Practices' },
                            { id: 'c3', label: 'Problem Relevance', desc: 'Accuracy to Problem Statement' },
                            { id: 'c4', label: 'Final Submission', desc: 'Innovation & Completeness' },
                        ].map((c) => (
                            <div key={c.id} className="bg-black/30 p-4 rounded-xl border border-white/5">
                                <label className="flex justify-between mb-2">
                                    <span className="font-bold text-gray-200">{c.label}</span>
                                    <span className="text-neon-purple font-mono">{scores[c.id as keyof typeof scores]}/25</span>
                                </label>
                                <p className="text-xs text-gray-500 mb-3">{c.desc}</p>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="25" 
                                    value={scores[c.id as keyof typeof scores]}
                                    onChange={(e) => handleScoreChange(c.id, e.target.value)}
                                    className="w-full accent-neon-purple h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                        <div className="text-center">
                            <span className="block text-xs text-gray-400 uppercase tracking-widest">Total Score</span>
                            <span className="text-4xl font-bold text-white">{calculateTotal()}</span>
                            <span className="text-gray-500">/100</span>
                        </div>
                        <button 
                            onClick={handleSubmitScore}
                            className="bg-neon-purple text-white px-8 py-4 rounded-xl font-bold hover:bg-neon-purple/80 transition-all shadow-[0_0_20px_rgba(189,0,255,0.3)]"
                        >
                            Submit Evaluation
                        </button>
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 border border-white/5 rounded-2xl bg-white/5 p-12 text-center">
                    <Users size={48} className="mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">Select a Team</h3>
                    <p>Choose a team from the list to start evaluation.</p>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};
