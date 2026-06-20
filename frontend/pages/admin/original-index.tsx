import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Shield, Plus, Trash2, Edit, Eye, EyeOff, LogOut, Users, BookOpen, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminLogin, verifyToken, getSubscribers, getAllWriteups, getProjects,
         createProject, deleteProject, createWriteup, deleteWriteup, updateWriteup } from '../../lib/api';

type Tab = 'projects' | 'writeups' | 'subscribers';

export default function AdminDashboard() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('projects');

  // Data
  const [projects, setProjects] = useState<any[]>([]);
  const [writeups, setWriteups] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);

  // Forms
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showWriteupForm, setShowWriteupForm] = useState(false);
  const [projectForm, setProjectForm] = useState({ title: '', description: '', tech_stack: '', github_url: '', demo_url: '', featured: false });
  const [writeupForm, setWriteupForm] = useState({ title: '', summary: '', content: '', tags: '', published: false });

  useEffect(() => {
    verifyToken()
      .then(() => { setAuthed(true); loadData(); })
      .catch(() => setAuthed(false))
      .finally(() => setLoading(false));
  }, []);

  const loadData = async () => {
    try {
      const [p, w, s] = await Promise.all([getProjects(), getAllWriteups(), getSubscribers()]);
      setProjects(p);
      setWriteups(w);
      setSubscribers(s);
    } catch (err) {
      console.error('Load data error', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token } = await adminLogin(loginData.username, loginData.password);
      localStorage.setItem('admin_token', token);
      setAuthed(true);
      loadData();
      toast.success('Welcome back!');
    } catch {
      toast.error('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setAuthed(false);
    toast.success('Logged out');
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject({
        ...projectForm,
        tech_stack: projectForm.tech_stack.split(',').map(t => t.trim()),
      });
      toast.success('Project created!');
      setShowProjectForm(false);
      setProjectForm({ title: '', description: '', tech_stack: '', github_url: '', demo_url: '', featured: false });
      loadData();
    } catch { toast.error('Failed to create project'); }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    try {
      await deleteProject(id);
      toast.success('Project deleted');
      loadData();
    } catch { toast.error('Failed to delete'); }
  };

  const handleCreateWriteup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createWriteup({
        ...writeupForm,
        tags: writeupForm.tags.split(',').map(t => t.trim()),
      });
      toast.success(writeupForm.published ? 'Write-up published! Subscribers notified.' : 'Draft saved!');
      setShowWriteupForm(false);
      setWriteupForm({ title: '', summary: '', content: '', tags: '', published: false });
      loadData();
    } catch { toast.error('Failed to save write-up'); }
  };

  const handleTogglePublish = async (writeup: any) => {
    try {
      await updateWriteup(writeup.id, { ...writeup, published: !writeup.published });
      toast.success(writeup.published ? 'Unpublished' : 'Published! Subscribers notified.');
      loadData();
    } catch { toast.error('Failed to update'); }
  };

  const handleDeleteWriteup = async (id: number) => {
    if (!confirm('Delete this write-up?')) return;
    try {
      await deleteWriteup(id);
      toast.success('Write-up deleted');
      loadData();
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin text-blue-500">⟳</div></div>;

  // ── Login Screen ───────────────────────────────────────────
  if (!authed) return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-[#0a0f1e]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Shield className="text-blue-500 mx-auto mb-3" size={40} />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Access</h1>
          <p className="text-slate-500 text-sm mt-1">IAM Portfolio Management</p>
        </div>
        <form onSubmit={handleLogin} className="card space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Username</label>
            <input
              type="text"
              value={loginData.username}
              onChange={e => setLoginData(p => ({ ...p, username: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#1e2d4a] bg-white dark:bg-[#0a0f1e] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={loginData.password}
              onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#1e2d4a] bg-white dark:bg-[#0a0f1e] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full">Sign In</button>
        </form>
      </div>
    </main>
  );

  // ── Dashboard ──────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e]">

      {/* Header */}
      <div className="bg-white dark:bg-[#0f1629] border-b border-slate-200 dark:border-[#1e2d4a] px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="text-blue-500" size={20} />
            <span className="font-mono font-bold text-blue-500">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-sm text-slate-500 hover:text-blue-500">View Site ↗</a>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Projects', value: projects.length, icon: FolderOpen },
            { label: 'Write-ups', value: writeups.length, icon: BookOpen },
            { label: 'Subscribers', value: subscribers.filter(s => s.is_active).length, icon: Users },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="card text-center">
              <Icon className="text-blue-500 mx-auto mb-2" size={20} />
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
              <div className="text-slate-500 text-sm">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white dark:bg-[#0f1629] border border-slate-200 dark:border-[#1e2d4a] rounded-lg p-1 w-fit">
          {(['projects', 'writeups', 'subscribers'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                tab === t ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-blue-500'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Projects Tab ── */}
        {tab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Projects</h2>
              <button onClick={() => setShowProjectForm(!showProjectForm)} className="btn-primary flex items-center gap-2 text-sm py-2">
                <Plus size={14} /> Add Project
              </button>
            </div>

            {showProjectForm && (
              <form onSubmit={handleCreateProject} className="card mb-6 space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">New Project</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { field: 'title', label: 'Title *', required: true },
                    { field: 'github_url', label: 'GitHub URL', required: false },
                    { field: 'demo_url', label: 'Demo URL', required: false },
                    { field: 'tech_stack', label: 'Tech Stack (comma-separated) *', required: true },
                  ].map(({ field, label, required }) => (
                    <div key={field}>
                      <label className="block text-xs text-slate-500 mb-1">{label}</label>
                      <input
                        value={(projectForm as any)[field]}
                        onChange={e => setProjectForm(p => ({ ...p, [field]: e.target.value }))}
                        required={required}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#1e2d4a] bg-white dark:bg-[#0a0f1e] text-sm focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Description *</label>
                  <textarea
                    value={projectForm.description}
                    onChange={e => setProjectForm(p => ({ ...p, description: e.target.value }))}
                    required
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#1e2d4a] bg-white dark:bg-[#0a0f1e] text-sm focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <input type="checkbox" checked={projectForm.featured} onChange={e => setProjectForm(p => ({ ...p, featured: e.target.checked }))} />
                  Mark as Featured
                </label>
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary text-sm py-2">Save Project</button>
                  <button type="button" onClick={() => setShowProjectForm(false)} className="btn-outline text-sm py-2">Cancel</button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {projects.map(p => (
                <div key={p.id} className="card flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{p.title}</h3>
                      {p.featured && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Featured</span>}
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{p.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.tech_stack?.map((t: string) => <span key={t} className="tag text-xs">{t}</span>)}
                    </div>
                  </div>
                  <button onClick={() => handleDeleteProject(p.id)} className="text-red-400 hover:text-red-600 flex-shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {projects.length === 0 && <p className="text-center text-slate-400 py-8">No projects yet. Add your first one!</p>}
            </div>
          </div>
        )}

        {/* ── Write-ups Tab ── */}
        {tab === 'writeups' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Write-ups</h2>
              <button onClick={() => setShowWriteupForm(!showWriteupForm)} className="btn-primary flex items-center gap-2 text-sm py-2">
                <Plus size={14} /> New Write-up
              </button>
            </div>

            {showWriteupForm && (
              <form onSubmit={handleCreateWriteup} className="card mb-6 space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">New Write-up</h3>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Title *</label>
                  <input
                    value={writeupForm.title}
                    onChange={e => setWriteupForm(p => ({ ...p, title: e.target.value }))}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#1e2d4a] bg-white dark:bg-[#0a0f1e] text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Tags (comma-separated) *</label>
                  <input
                    value={writeupForm.tags}
                    onChange={e => setWriteupForm(p => ({ ...p, tags: e.target.value }))}
                    placeholder="Zero Trust, IAM, RBAC"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#1e2d4a] bg-white dark:bg-[#0a0f1e] text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Summary *</label>
                  <textarea
                    value={writeupForm.summary}
                    onChange={e => setWriteupForm(p => ({ ...p, summary: e.target.value }))}
                    required rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#1e2d4a] bg-white dark:bg-[#0a0f1e] text-sm focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Content (Markdown) *</label>
                  <textarea
                    value={writeupForm.content}
                    onChange={e => setWriteupForm(p => ({ ...p, content: e.target.value }))}
                    required rows={10}
                    placeholder="# Introduction&#10;&#10;Write your content in **Markdown**..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#1e2d4a] bg-white dark:bg-[#0a0f1e] text-sm focus:outline-none focus:border-blue-500 resize-y font-mono"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <input type="checkbox" checked={writeupForm.published} onChange={e => setWriteupForm(p => ({ ...p, published: e.target.checked }))} />
                  Publish immediately (will notify subscribers)
                </label>
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary text-sm py-2">
                    {writeupForm.published ? '🚀 Publish' : '💾 Save Draft'}
                  </button>
                  <button type="button" onClick={() => setShowWriteupForm(false)} className="btn-outline text-sm py-2">Cancel</button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {writeups.map(w => (
                <div key={w.id} className="card flex items-start justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{w.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                        w.published
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {w.published ? '● Published' : '○ Draft'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{w.summary}</p>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {w.tags?.map((t: string) => <span key={t} className="tag text-xs">{t}</span>)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleTogglePublish(w)}
                      title={w.published ? 'Unpublish' : 'Publish'}
                      className="text-blue-400 hover:text-blue-600"
                    >
                      {w.published ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button onClick={() => handleDeleteWriteup(w.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {writeups.length === 0 && <p className="text-center text-slate-400 py-8">No write-ups yet. Start writing!</p>}
            </div>
          </div>
        )}

        {/* ── Subscribers Tab ── */}
        {tab === 'subscribers' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Subscribers — {subscribers.filter(s => s.is_active).length} active
              </h2>
            </div>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-[#1e2d4a]">
                    <th className="text-left py-2 text-slate-500 font-medium">Email</th>
                    <th className="text-left py-2 text-slate-500 font-medium">Name</th>
                    <th className="text-left py-2 text-slate-500 font-medium">Date</th>
                    <th className="text-left py-2 text-slate-500 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map(s => (
                    <tr key={s.id} className="border-b border-slate-50 dark:border-[#1e2d4a]/50">
                      <td className="py-2 text-slate-700 dark:text-slate-300 font-mono">{s.email}</td>
                      <td className="py-2 text-slate-500">{s.name || '—'}</td>
                      <td className="py-2 text-slate-400 text-xs">{new Date(s.subscribed_at).toLocaleDateString()}</td>
                      <td className="py-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          s.is_active
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-slate-100 text-slate-400'
                        }`}>
                          {s.is_active ? 'Active' : 'Unsubscribed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {subscribers.length === 0 && <p className="text-center text-slate-400 py-8">No subscribers yet.</p>}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
