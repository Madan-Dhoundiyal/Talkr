import { Link } from 'react-router-dom';
import { Video, Plus, LogOut, LayoutDashboard } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 sticky top-0 z-50 bg-[#0f0f1a]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Talkr</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/create" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition flex items-center gap-2">
              <Plus className="w-4 h-4" /> New video
            </Link>
            <button onClick={handleLogout} className="text-slate-400 hover:text-white text-sm transition flex items-center gap-2 px-3 py-2">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-10">
          <LayoutDashboard className="w-6 h-6 text-violet-400" />
          <h1 className="text-2xl font-bold">My videos</h1>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-violet-500/10 rounded-2xl flex items-center justify-center mb-4">
            <Video className="w-8 h-8 text-violet-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No videos yet</h2>
          <p className="text-slate-400 text-sm mb-6">Create your first talking avatar video to get started.</p>
          <Link to="/create"
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create your first video
          </Link>
        </div>
      </div>
    </div>
  );
}
