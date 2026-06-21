import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Shield, Plus, Trash2, Eye, EyeOff, LogOut, Users, BookOpen, FolderOpen, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminLogin, verifyToken, getSubscribers, getAllWriteups, getProjects,
         createProject, deleteProject, createWriteup, deleteWriteup, updateWriteup } from '../../lib/api';

type Tab = 'projects' | 'writeups' | 'subscribers';

const inputCls = `w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#1e2d4a]
  bg-white dark:bg-[#0a0f1e] text-slate-900 dark:text-white text-sm
  focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all`;

const labelCls = 'block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide';

export default function AdminDashboard() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('projects');

  const [projects, setProjects] = useState<any[]>([]);
  const [writeups, setWriteups] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);

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
      setProjects(p); setWriteups(w); setSubscribers(s);
    } catch (err) { console.error('Load data error', err); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { token } = await adminLogin(loginData.username, loginData.password);
      localStorage.setItem('admin_token', token);
      setAuthed(true); loadData();
      toast.success('Welcome back!');
    } catch { toast.error('Invalid credentials'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setAuthed(false);
    toast.success('Logged out');
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject({ ...projectForm, tech_stack: projectForm.tech_stack.split(',').map(t => t.trim()) });
      toast.success('Project created!');
      setShowProjectForm(false);
      setProjectForm({ title: '', description: '', tech_stack: '', github_url: '', demo_url: '', featured: false });
      loadData();
    } catch { toast.error('Failed to create project'); }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    try { await deleteProject(id); toast.success('Project deleted'); loadData(); }
    catch { toast.error('Failed to delete'); }
  };

  const handleCreateWriteup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createWriteup({ ...writeupForm, tags: writeupForm.tags.split(',').map(t => t.trim()) });
      toast.success(writeupForm.published ? '🚀 Published! Subscribers notified.' : '💾 Draft saved!');
      setShowWriteupForm(false);
      setWriteupForm({ title: '', summary: '', content: '', tags: '', published: false });
      loadData();
    } catch { toast.error('Failed to save write-up'); }
  };

  const handleTogglePublish = async (writeup: any) => {
    try {
      await updateWriteup(writeup.id, { ...writeup, published: !writeup.published });
      toast.success(writeup.published ? 'Unpublished' : '🚀 Published! Subscribers notified.');
      loadData();
    } catch { toast.error('Failed to update'); }
  };

  const handleDeleteWriteup = async (id: number) => {
    if (!confirm('Delete this write-up?')) return;
    try { await deleteWriteup(id); toast.success('Write-up deleted'); loadData(); }
    catch { toast.error('Failed to delete'); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0a0f1e]">
      <div className="flex items-center gap-3 text-blue-500">
        <Shield size={20} className="animate-pulse" />
        <span className="font-mono text-sm">Authenticating...</span>
      </div>
    </div>
  );

  // ── Login ──────────────────────────────────────────────────
  if (!authed) return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-[#0a0f1e]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 mb-4">
            <Shield className="text-blue-500" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Access</h1>
          <p className="text-slate-500 text-sm mt-1 font-mono">IAM Portfolio Management</p>
        </div>
        <form onSubmit={handleLogin} className="card space-y-5">
          <div>
            <label className={labelCls}>Username</label>
            <input
              type="text"
              value={loginData.username}
              onChange={e => setLoginData(p => ({ ...p, username: e.target.value }))}
              className={inputCls}
              placeholder="admin"
              required
            />
          </div>
          <div>
            <label className={labelCls}>Password</label>
            <input
              type="password"
              value={loginData.password}
              onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))}
              className={inputCls}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full justify-center">
            <Shield size={15} /> Sign In
          </button>
        </form>
      </div>
    </main>
  );

  // ── Dashboard ──────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0a0f1e]">

      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#0f1629]/80 backdrop-blur border-b border-slate-200 dark:border-[#1e2d4a]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="text-blue-500" size={18} />
            <span className="font-mono font-bold text-blue-500 text-sm">&lt;Admin /&gt;</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-500 transition-colors">
              <ExternalLink size={12} /> View Site
            </a>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-500 transition-colors">
              <LogOut size={12} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Projects', value: projects.length, icon: FolderOpen, color: 'text-blue-500' },
            { label: 'Write-ups', value: writeups.length, icon: BookOpen, color: 'text-violet-500' },
            { label: 'Subscribers', value: subscribers.filter(s => s.is_active).length, icon: Users, color: 'text-emerald-500' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card text-center hover:-translate-y-0.5 transition-transform">
              <Icon className={`${color} mx-auto mb-2`} size={18} />
              <div className="text-3xl font-bold text-slate-900 dark:text-white mb-0.5">{value}</div>
              <div className="text-slate-500 text-xs font-mono uppercase tracking-wide">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white dark:bg-[#0f1629] border border-slate-200 dark:border-[#1e2d4a] rounded-xl p-1 w-fit">
          {(['projects', 'writeups', 'subscribers'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                tab === t
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}>
              {t}
            </button>
          ))}
        </div>

        {/* ── Projects Tab ── */}
        {tab === 'projects' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Projects <span className="text-slate-400 font-normal text-sm ml-1">({projects.length})</span>
              </h2>
              <button onClick={() => setShowProjectForm(!showProjectForm)} className="btn-primary text-sm py-2 px-4">
                <Plus size={14} /> Add Project
              </button>
            </div>

            {showProjectForm && (
              <form onSubmit={handleCreateProject} className="card mb-6 space-y-4 border-blue-500/20">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Plus size={14} className="text-blue-500" /> New Project
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Title *</label>
                    <input value={projectForm.title} onChange={e => setProjectForm(p => ({ ...p, title: e.target.value }))} required className={inputCls} placeholder="Project name" />
                  </div>
                  <div>
                    <label className={labelCls}>Tech Stack (comma-separated) *</label>
                    <input value={projectForm.tech_stack} onChange={e => setProjectForm(p => ({ ...p, tech_stack: e.target.value }))} required className={inputCls} placeholder="Docker, Keycloak, LDAP" />
                  </div>
                  <div>
                    <label className={labelCls}>GitHub URL</label>
                    <input value={projectForm.github_url} onChange={e => setProjectForm(p => ({ ...p, github_url: e.target.value }))} className={inputCls} placeholder="https://github.com/..." />
                  </div>
                  <div>
                    <label className={labelCls}>Demo URL</label>
                    <input value={projectForm.demo_url} onChange={e => setProjectForm(p => ({ ...p, demo_url: e.target.value }))} className={inputCls} placeholder="https://..." />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Description *</label>
                  <textarea value={projectForm.description} onChange={e => setProjectForm(p => ({ ...p, description: e.target.value }))} required rows={3}
                    className={`${inputCls} resize-none`} placeholder="What does this project do?" />
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input type="checkbox" checked={projectForm.featured} onChange={e => setProjectForm(p => ({ ...p, featured: e.target.checked }))}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  Mark as Featured
                </label>
                <div className="flex gap-3 pt-1">
                  <button type="submit" className="btn-primary text-sm py-2 px-4">Save Project</button>
                  <button type="button" onClick={() => setShowProjectForm(false)} className="btn-outline text-sm py-2 px-4">Cancel</button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {projects.map(p => (
                <div key={p.id} className="card flex items-start justify-between gap-4 hover:border-blue-500/30 transition-colors">
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{p.title}</h3>
                      {p.featured && <span className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 px-2 py-0.5 rounded-full">★ Featured</span>}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-2">{p.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {p.tech_stack?.map((t: string) => <span key={t} className="tag">{t}</span>)}
                    </div>
                  </div>
                  <button onClick={() => handleDeleteProject(p.id)} className="text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors flex-shrink-0 mt-0.5">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              {projects.length === 0 && (
                <div className="card text-center py-12 border-dashed">
                  <FolderOpen className="text-slate-300 mx-auto mb-3" size={32} />
                  <p className="text-slate-400 text-sm">No projects yet — add your first one above.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Write-ups Tab ── */}
        {tab === 'writeups' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Write-ups <span className="text-slate-400 font-normal text-sm ml-1">({writeups.length})</span>
              </h2>
              <button onClick={() => setShowWriteupForm(!showWriteupForm)} className="btn-primary text-sm py-2 px-4">
                <Plus size={14} /> New Write-up
              </button>
            </div>

            {showWriteupForm && (
              <form onSubmit={handleCreateWriteup} className="card mb-6 space-y-4 border-blue-500/20">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <Plus size={14} className="text-blue-500" /> New Write-up
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Title *</label>
                    <input value={writeupForm.title} onChange={e => setWriteupForm(p => ({ ...p, title: e.target.value }))} required className={inputCls} placeholder="Write-up title" />
                  </div>
                  <div>
                    <label className={labelCls}>Tags (comma-separated) *</label>
                    <input value={writeupForm.tags} onChange={e => setWriteupForm(p => ({ ...p, tags: e.target.value }))} required className={inputCls} placeholder="Zero Trust, IAM, RBAC" />
                  </div>
                  <div>
                    <label className={labelCls}>Summary *</label>
                    <input value={writeupForm.summary} onChange={e => setWriteupForm(p => ({ ...p, summary: e.target.value }))} required className={inputCls} placeholder="One-line description" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Content (Markdown) *</label>
                  <textarea value={writeupForm.content} onChange={e => setWriteupForm(p => ({ ...p, content: e.target.value }))} required rows={12}
                    placeholder="# Introduction&#10;&#10;Write your content in **Markdown**..."
                    className={`${inputCls} resize-y font-mono text-xs leading-relaxed`} />
                  <p className="text-xs text-slate-400 mt-1">Supports Markdown: **bold**, `code`, ## headings, - lists</p>
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                  <input type="checkbox" checked={writeupForm.published} onChange={e => setWriteupForm(p => ({ ...p, published: e.target.checked }))}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  Publish immediately — subscribers will be notified
                </label>
                <div className="flex gap-3 pt-1">
                  <button type="submit" className="btn-primary text-sm py-2 px-4">
                    {writeupForm.published ? '🚀 Publish' : '💾 Save Draft'}
                  </button>
                  <button type="button" onClick={() => setShowWriteupForm(false)} className="btn-outline text-sm py-2 px-4">Cancel</button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {writeups.map(w => (
                <div key={w.id} className="card flex items-start justify-between gap-4 hover:border-blue-500/30 transition-colors">
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{w.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-mono border ${
                        w.published
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                      }`}>
                        {w.published ? '● Live' : '○ Draft'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-2">{w.summary}</p>
                    <div className="flex gap-1 flex-wrap">
                      {w.tags?.map((t: string) => <span key={t} className="tag">{t}</span>)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                    <button onClick={() => handleTogglePublish(w)} title={w.published ? 'Unpublish' : 'Publish'}
                      className="text-slate-300 dark:text-slate-600 hover:text-blue-500 transition-colors">
                      {w.published ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                    <button onClick={() => handleDeleteWriteup(w.id)}
                      className="text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
              {writeups.length === 0 && (
                <div className="card text-center py-12 border-dashed">
                  <BookOpen className="text-slate-300 mx-auto mb-3" size={32} />
                  <p className="text-slate-400 text-sm">No write-ups yet — start writing above.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Subscribers Tab ── */}
        {tab === 'subscribers' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Subscribers
                <span className="ml-2 text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                  {subscribers.filter(s => s.is_active).length} active
                </span>
              </h2>
            </div>
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-[#1e2d4a]">
                    {['Email', 'Name', 'Joined', 'Status'].map(h => (
                      <th key={h} className="text-left py-3 px-2 text-xs font-medium text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map(s => (
                    <tr key={s.id} className="border-b border-slate-50 dark:border-[#1e2d4a]/50 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-2 text-slate-700 dark:text-slate-300 font-mono text-xs">{s.email}</td>
                      <td className="py-3 px-2 text-slate-500 text-xs">{s.name || <span className="text-slate-300">—</span>}</td>
                      <td className="py-3 px-2 text-slate-400 text-xs">{new Date(s.subscribed_at).toLocaleDateString()}</td>
                      <td className="py-3 px-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-mono ${
                          s.is_active
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}>
                          {s.is_active ? 'Active' : 'Unsubscribed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {subscribers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="text-slate-300 mx-auto mb-3" size={32} />
                  <p className="text-slate-400 text-sm">No subscribers yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
