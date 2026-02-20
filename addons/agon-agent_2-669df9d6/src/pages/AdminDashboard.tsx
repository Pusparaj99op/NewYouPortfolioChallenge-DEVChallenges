import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Shield, Settings, Trophy, 
  LogOut, Unlock,
  Play, Pause, RefreshCw
} from 'lucide-react';

const TEAMS = [
  { id: 1, name: "Code Warriors", ps: "AI-Powered Traffic Management", status: "Locked", score: 0 },
  { id: 2, name: "Null Pointers", ps: "Smart Waste Management IoT", status: "Locked", score: 0 },
  { id: 3, name: "Binary Bosses", ps: "Decentralized Voting System", status: "Submitted", score: 85 },
  { id: 4, name: "Syntax Terrors", ps: "Fake News Detection Engine", status: "Coding", score: 0 },
  { id: 5, name: "Agile Avengers", ps: "Rural Healthcare Telemed App", status: "Submitted", score: 92 },
];

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [eventStatus, setEventStatus] = useState<'idle' | 'active' | 'paused' | 'ended'>('active');
  const [teams, setTeams] = useState(TEAMS);

  const toggleEventStatus = () => {
    if (eventStatus === 'active') setEventStatus('paused');
    else setEventStatus('active');
  };

  const handleForceUnlock = (id: number) => {
    setTeams(teams.map(t => t.id === id ? { ...t, status: 'Coding' } : t));
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans">
      <nav className="bg-card-bg border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-red-500/20 p-2 rounded-lg">
            <Shield className="text-red-500" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">ADMIN <span className="text-red-500">CONTROL</span></h1>
            <p className="text-xs text-gray-400">Master Access</p>
          </div>
        </div>
        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition-colors">
            <LogOut size={20} />
        </button>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Control Center */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card-bg p-6 rounded-xl border border-white/10">
                <h3 className="text-gray-400 text-sm font-bold uppercase mb-4">Event Status</h3>
                <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${eventStatus === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                        <div className={`w-2 h-2 rounded-full ${eventStatus === 'active' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                        {eventStatus.toUpperCase()}
                    </div>
                    <button onClick={toggleEventStatus} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        {eventStatus === 'active' ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                </div>
            </div>

            <div className="bg-card-bg p-6 rounded-xl border border-white/10">
                <h3 className="text-gray-400 text-sm font-bold uppercase mb-4">Total Teams</h3>
                <div className="flex items-center gap-4">
                    <Users size={32} className="text-neon-purple" />
                    <span className="text-4xl font-bold">42</span>
                </div>
            </div>

            <div className="bg-card-bg p-6 rounded-xl border border-white/10">
                <h3 className="text-gray-400 text-sm font-bold uppercase mb-4">System Health</h3>
                <div className="flex items-center gap-4">
                    <Settings size={32} className="text-blue-500" />
                    <span className="text-xl font-bold text-green-500">Operational</span>
                </div>
            </div>
        </div>

        {/* Team Management */}
        <div className="bg-card-bg border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Users className="text-neon-purple" /> Team Management
                </h2>
                <button className="text-sm text-neon-green hover:underline flex items-center gap-1">
                    <RefreshCw size={14} /> Refresh Data
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-black/30 text-gray-400 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4">Team Name</th>
                            <th className="px-6 py-4">Selected PS</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Score</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {teams.map((team) => (
                            <tr key={team.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-bold">{team.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-300">{team.ps}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold
                                        ${team.status === 'Locked' ? 'bg-red-500/20 text-red-500' : 
                                          team.status === 'Submitted' ? 'bg-green-500/20 text-green-500' : 
                                          'bg-blue-500/20 text-blue-500'}
                                    `}>
                                        {team.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono">{team.score > 0 ? team.score : '-'}</td>
                                <td className="px-6 py-4">
                                    {team.status === 'Locked' && (
                                        <button 
                                            onClick={() => handleForceUnlock(team.id)}
                                            className="text-yellow-500 hover:text-yellow-400 text-sm flex items-center gap-1"
                                            title="Force Unlock PS Selection"
                                        >
                                            <Unlock size={14} /> Unlock
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Leaderboard Preview */}
        <div className="bg-gradient-to-r from-neon-purple/10 to-neon-green/10 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Trophy className="text-yellow-500" /> Live Leaderboard
            </h2>
            <div className="space-y-2">
                {teams.filter(t => t.score > 0).sort((a,b) => b.score - a.score).map((team, index) => (
                    <div key={team.id} className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/5">
                        <div className="flex items-center gap-3">
                            <span className={`font-bold w-6 text-center ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                                #{index + 1}
                            </span>
                            <span>{team.name}</span>
                        </div>
                        <span className="font-mono font-bold text-neon-green">{team.score} pts</span>
                    </div>
                ))}
                {teams.filter(t => t.score > 0).length === 0 && (
                    <p className="text-gray-500 text-sm italic">No scores submitted yet.</p>
                )}
            </div>
        </div>
      </main>
    </div>
  );
};
