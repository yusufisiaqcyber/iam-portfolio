import { useState, useEffect } from 'react';
import Head from 'next/head';
import { getProjects, getWriteups, subscribe } from '../lib/api';

const YOUTUBE_URL = process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://youtube.com/@cybernuggetz-iam';
const GITHUB_URL = 'https://github.com/yusufisiaqcyber';
const LINKEDIN_URL = 'https://linkedin.com/in/yusuf-isiaq';
const EMAIL = 'yusufisiaqcyber@gmail.com';

export default function Home() {
  const [dark, setDark] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [writeups, setWriteups] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [subName, setSubName] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.className = dark ? 'dark' : '';
  }, [dark]);

  useEffect(() => {
    getProjects().then(setProjects).catch(() => {});
    getWriteups().then(setWriteups).catch(() => {});
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubStatus('loading');
    try {
      await subscribe(email, subName);
      setSubStatus('success');
      setEmail('');
      setSubName('');
    } catch {
      setSubStatus('error');
    }
  };

  const publishedWriteups = writeups.filter(w => w.published);

  return (
    <>
      <Head>
        <title>Yusuf Isiaq — IAM Engineer</title>
        <meta name="description" content="Identity & Access Management Engineer portfolio — Zero Trust, RBAC, OIDC, and IAM solutions." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #ffffff; --bg2: #f5f8fc; --bg3: #E6F1FB;
          --text: #1a1a1a; --text2: #555;
          --blue: #185FA5; --blue2: #378ADD; --blue3: #B5D4F4;
          --border: rgba(0,0,0,0.09); --card: #ffffff;
          --tag-bg: #E6F1FB; --tag-c: #0C447C; --tag-b: #B5D4F4;
          --stat-bg: #E6F1FB; --stat-n: #0C447C;
        }
        body.dark {
          --bg: #0f1117; --bg2: #181c27; --bg3: #0c1e33;
          --text: #e8eaf0; --text2: #8b92a5;
          --blue: #378ADD; --blue2: #85B7EB; --blue3: #185FA5;
          --border: rgba(255,255,255,0.07); --card: #181c27;
          --tag-bg: #0c1e33; --tag-c: #85B7EB; --tag-b: #185FA5;
          --stat-bg: #0c1e33; --stat-n: #85B7EB;
        }
        body { font-family: 'Inter', system-ui, sans-serif; background: var(--bg); color: var(--text); transition: background .25s, color .25s; }
        a { color: inherit; text-decoration: none; }

        /* NAV */
        nav { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; border-bottom: .5px solid var(--border); position: sticky; top: 0; background: var(--bg); z-index: 20; }
        .logo { font-size: 15px; font-weight: 700; color: var(--blue); letter-spacing: -.01em; font-family: 'JetBrains Mono', monospace; }
        .logo span { color: var(--text2); font-weight: 400; }
        .nav-right { display: flex; align-items: center; gap: 1.5rem; }
        .nav-links { display: flex; gap: 1.25rem; }
        .nav-links a { font-size: 13px; color: var(--text2); cursor: pointer; transition: color .15s; }
        .nav-links a:hover { color: var(--blue); }
        .toggle { display: flex; align-items: center; gap: 6px; padding: 6px 12px; font-size: 13px; border: .5px solid var(--border); border-radius: 8px; background: none; color: var(--text2); cursor: pointer; transition: all .15s; font-family: inherit; }
        .toggle:hover { border-color: var(--blue); color: var(--blue); }

        /* SECTIONS */
        section { padding: 3rem 2rem; border-bottom: .5px solid var(--border); max-width: 900px; margin: 0 auto; }
        .sec-label { font-size: 11px; color: var(--blue); text-transform: uppercase; letter-spacing: .1em; font-weight: 600; margin-bottom: 1.5rem; font-family: 'JetBrains Mono', monospace; }

        /* HERO */
        .accent { width: 36px; height: 3px; background: var(--blue); border-radius: 2px; margin-bottom: 1rem; }
        .eyebrow { font-size: 13px; color: var(--blue); font-weight: 500; margin-bottom: .5rem; }
        h1 { font-size: 36px; font-weight: 700; line-height: 1.2; margin-bottom: 1rem; letter-spacing: -.02em; }
        h1 em { color: var(--blue); font-style: normal; }
        .hero-desc { font-size: 15px; color: var(--text2); max-width: 540px; line-height: 1.75; margin-bottom: 1.5rem; }
        .btn-group { display: flex; gap: 10px; flex-wrap: wrap; }
        .btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; font-size: 14px; border-radius: 8px; border: .5px solid var(--border); background: var(--card); color: var(--text); cursor: pointer; text-decoration: none; transition: all .15s; font-weight: 500; font-family: inherit; }
        .btn:hover { border-color: var(--blue); color: var(--blue); }
        .btn-primary { background: #185FA5; color: #fff !important; border-color: #185FA5; }
        .btn-primary:hover { background: #0C447C; border-color: #0C447C; }
        .btn-yt { background: #E24B4A; color: #fff !important; border-color: #E24B4A; }
        .btn-yt:hover { background: #c93a39; }

        /* PROJECTS */
        .grid3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; }
        .card { background: var(--card); border: .5px solid var(--border); border-radius: 12px; padding: 1.25rem; display: flex; flex-direction: column; gap: 10px; transition: border-color .15s, transform .15s; }
        .card:hover { border-color: var(--blue2); transform: translateY(-2px); }
        .card-icon { font-size: 22px; color: var(--blue); }
        .card h3 { font-size: 15px; font-weight: 600; }
        .card p { font-size: 13px; color: var(--text2); line-height: 1.6; flex: 1; }
        .tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .tag { font-size: 11px; padding: 3px 10px; border-radius: 100px; background: var(--tag-bg); color: var(--tag-c); border: .5px solid var(--tag-b); font-weight: 500; }
        .clinks { display: flex; gap: 12px; }
        .clinks a { font-size: 12px; color: var(--blue); display: flex; align-items: center; gap: 4px; transition: opacity .15s; }
        .clinks a:hover { opacity: .7; }
        .empty { font-size: 14px; color: var(--text2); padding: 2rem 0; }

        /* SKILLS */
        .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.25rem; }
        .sg h4 { font-size: 12px; font-weight: 600; color: var(--text2); text-transform: uppercase; letter-spacing: .06em; margin-bottom: 10px; }
        .si { display: flex; align-items: center; gap: 8px; font-size: 14px; padding: 7px 0; border-bottom: .5px solid var(--border); color: var(--text); }
        .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .d1 { background: #185FA5; } .d2 { background: #378ADD; } .d3 { background: #B5D4F4; }
        .legend { display: flex; gap: 16px; margin-top: 1.25rem; flex-wrap: wrap; }
        .leg { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text2); }

        /* WRITE-UPS */
        .wi { display: flex; gap: 1.25rem; padding: 1.25rem 0; border-bottom: .5px solid var(--border); }
        .wi:first-child { border-top: .5px solid var(--border); }
        .wdate { display: flex; flex-direction: column; align-items: center; min-width: 44px; padding-top: 2px; }
        .wdate .mo { font-size: 10px; color: var(--blue); text-transform: uppercase; letter-spacing: .08em; font-weight: 600; }
        .wdate .dy { font-size: 22px; font-weight: 700; color: var(--blue); line-height: 1; }
        .wdate .yr { font-size: 10px; color: var(--text2); }
        .wb h3 { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
        .wb p { font-size: 13px; color: var(--text2); line-height: 1.6; margin-bottom: 8px; }
        .wfoot { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .rlink { font-size: 12px; color: var(--blue); display: flex; align-items: center; gap: 4px; font-weight: 500; }
        .yt-banner { background: var(--bg3); border: .5px solid var(--tag-b); border-radius: 12px; padding: 1.25rem 1.5rem; display: flex; align-items: center; gap: 1rem; margin-top: 1.5rem; flex-wrap: wrap; }
        .yt-banner h4 { font-size: 15px; font-weight: 600; }
        .yt-banner p { font-size: 13px; color: var(--text2); margin-top: 2px; }

        /* SUBSCRIBE */
        .sub-box { background: var(--bg3); border: .5px solid var(--tag-b); border-radius: 12px; padding: 2rem; max-width: 520px; }
        .sub-box h3 { font-size: 18px; font-weight: 600; margin-bottom: .5rem; }
        .sub-box p { font-size: 14px; color: var(--text2); margin-bottom: 1.25rem; line-height: 1.65; }
        .sub-row { display: flex; gap: 8px; flex-wrap: wrap; }
        .sub-input { flex: 1; min-width: 200px; padding: 10px 14px; font-size: 14px; border: .5px solid var(--border); border-radius: 8px; background: var(--card); color: var(--text); outline: none; transition: border-color .15s; font-family: inherit; }
        .sub-input:focus { border-color: var(--blue2); }
        .sub-btn { padding: 10px 20px; font-size: 14px; background: #185FA5; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; transition: background .15s; font-family: inherit; }
        .sub-btn:hover { background: #0C447C; }
        .sub-btn:disabled { opacity: .6; cursor: not-allowed; }

        /* ABOUT */
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .at p { font-size: 15px; color: var(--text2); margin-bottom: 1rem; line-height: 1.75; }
        .astats { display: flex; flex-direction: column; gap: 12px; }
        .sc { background: var(--stat-bg); border-radius: 10px; padding: 1rem 1.25rem; }
        .sc .num { font-size: 26px; font-weight: 700; color: var(--stat-n); }
        .sc .lbl { font-size: 12px; color: var(--blue); margin-top: 2px; font-weight: 500; }

        /* CONTACT */
        .contact-row { display: flex; gap: 10px; flex-wrap: wrap; }
        .cb { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; font-size: 14px; border-radius: 8px; border: .5px solid var(--border); background: var(--card); color: var(--text); cursor: pointer; text-decoration: none; transition: all .15s; font-weight: 500; }
        .cb:hover { background: var(--bg3); border-color: var(--blue2); color: var(--blue); }

        /* FOOTER */
        footer { padding: 2rem; text-align: center; font-size: 12px; color: var(--text2); border-top: .5px solid var(--border); }

        @media(max-width: 640px) {
          .about-grid { grid-template-columns: 1fr; }
          .nav-links { display: none; }
          h1 { font-size: 28px; }
          section { padding: 2.5rem 1.25rem; }
        }
      `}</style>

      {/* NAV */}
      <nav>
        <span className="logo">&lt;IAM.Engineer <span>/&gt;</span></span>
        <div className="nav-right">
          <div className="nav-links">
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="#writeups">Write-ups</a>
            <a href="#subscribe">Subscribe</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
          <button className="toggle" onClick={() => setDark(d => !d)}>
            {dark ? '☀ Light' : '☾ Dark'}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="accent" />
        <p className="eyebrow">🛡 IAM Engineer</p>
        <h1>Securing identities,<br />one <em>policy</em> at a time.</h1>
        <p className="hero-desc">
          I'm Yusuf Isiaq — an Identity & Access Management engineer passionate about zero-trust architecture,
          least-privilege access, and building secure authentication systems. Sharing what I learn through
          write-ups and YouTube.
        </p>
        <div className="btn-group">
          <a className="btn btn-primary" href="#projects">📁 View projects</a>
          <a className="btn btn-yt" href={YOUTUBE_URL} target="_blank" rel="noreferrer">▶ YouTube</a>
          <a className="btn" href={GITHUB_URL} target="_blank" rel="noreferrer">⌥ GitHub</a>
          <a className="btn" href={LINKEDIN_URL} target="_blank" rel="noreferrer">in LinkedIn</a>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <p className="sec-label">// Featured Work</p>
        <div className="grid3">
          {projects.length === 0 ? (
            <p className="empty">No projects yet — check back soon.</p>
          ) : projects.map(p => (
            <div className="card" key={p.id}>
              <div className="card-icon">🔑</div>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="tags">
                {(p.tech_stack || []).map((t: string) => <span className="tag" key={t}>{t}</span>)}
              </div>
              <div className="clinks">
                {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer">⌥ GitHub</a>}
                {p.demo_url && <a href={p.demo_url} target="_blank" rel="noreferrer">↗ Demo</a>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills">
        <p className="sec-label">// Technical Expertise</p>
        <div className="skills-grid">
          <div className="sg">
            <h4>IAM Platforms</h4>
            <div className="si"><span className="dot d1" />Okta</div>
            <div className="si"><span className="dot d1" />Azure Active Directory</div>
            <div className="si"><span className="dot d2" />AWS IAM</div>
            <div className="si"><span className="dot d2" />Keycloak</div>
            <div className="si"><span className="dot d3" />Google Cloud IAM</div>
          </div>
          <div className="sg">
            <h4>Protocols & Standards</h4>
            <div className="si"><span className="dot d1" />OAuth 2.0 / OIDC</div>
            <div className="si"><span className="dot d1" />SAML 2.0</div>
            <div className="si"><span className="dot d2" />LDAP / Active Directory</div>
            <div className="si"><span className="dot d2" />JWT</div>
            <div className="si"><span className="dot d3" />SCIM</div>
          </div>
          <div className="sg">
            <h4>Security Concepts</h4>
            <div className="si"><span className="dot d1" />Zero Trust Architecture</div>
            <div className="si"><span className="dot d1" />RBAC / ABAC</div>
            <div className="si"><span className="dot d2" />PAM / PIM</div>
            <div className="si"><span className="dot d2" />MFA Implementation</div>
          </div>
          <div className="sg">
            <h4>Tools & Languages</h4>
            <div className="si"><span className="dot d2" />Python</div>
            <div className="si"><span className="dot d2" />PowerShell</div>
            <div className="si"><span className="dot d2" />Docker</div>
            <div className="si"><span className="dot d3" />Terraform</div>
            <div className="si"><span className="dot d3" />Git</div>
          </div>
        </div>
        <div className="legend">
          <span className="leg"><span className="dot d1" style={{display:'inline-block'}} /> Proficient</span>
          <span className="leg"><span className="dot d2" style={{display:'inline-block'}} /> Familiar</span>
          <span className="leg"><span className="dot d3" style={{display:'inline-block'}} /> Learning</span>
        </div>
      </section>

      {/* WRITE-UPS */}
      <section id="writeups">
        <p className="sec-label">// Write-ups & Research</p>
        <div>
          {publishedWriteups.length === 0 ? (
            <p className="empty">No write-ups published yet. Check back soon!</p>
          ) : publishedWriteups.map(w => {
            const date = new Date(w.published_at || w.created_at);
            return (
              <div className="wi" key={w.id}>
                <div className="wdate">
                  <span className="mo">{date.toLocaleString('default', { month: 'short' })}</span>
                  <span className="dy">{date.getDate().toString().padStart(2, '0')}</span>
                  <span className="yr">{date.getFullYear()}</span>
                </div>
                <div className="wb">
                  <h3>{w.title}</h3>
                  <p>{w.summary}</p>
                  <div className="wfoot">
                    <a className="rlink" href={`/writeups/${w.slug}`}>↗ Read write-up</a>
                    <div className="tags">
                      {(w.tags || []).map((t: string) => <span className="tag" key={t}>{t}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="yt-banner">
          <span style={{fontSize:'28px', color:'#E24B4A', flexShrink:0}}>▶</span>
          <div style={{flex:1}}>
            <h4>I also cover these topics on YouTube</h4>
            <p>Video walkthroughs, lab demos, and IAM explainers — practical content for engineers.</p>
          </div>
          <a className="btn btn-yt" href={YOUTUBE_URL} target="_blank" rel="noreferrer" style={{flexShrink:0}}>Watch</a>
        </div>
      </section>

      {/* SUBSCRIBE */}
      <section id="subscribe">
        <p className="sec-label">// Stay in the loop</p>
        <div className="sub-box">
          <h3>Subscribe to my write-ups</h3>
          <p>Get notified whenever I publish a new article on IAM, identity security, or cloud access. No spam — just signal.</p>
          {subStatus === 'success' ? (
            <p style={{color: 'var(--blue)', fontWeight: 600}}>✓ You're subscribed! Thanks for joining.</p>
          ) : (
            <form onSubmit={handleSubscribe}>
              <div className="sub-row" style={{marginBottom: '8px'}}>
                <input
                  className="sub-input"
                  type="text"
                  placeholder="Your name (optional)"
                  value={subName}
                  onChange={e => setSubName(e.target.value)}
                />
              </div>
              <div className="sub-row">
                <input
                  className="sub-input"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <button className="sub-btn" type="submit" disabled={subStatus === 'loading'}>
                  {subStatus === 'loading' ? 'Subscribing...' : '→ Subscribe'}
                </button>
              </div>
              {subStatus === 'error' && <p style={{color:'#E24B4A', fontSize:'13px', marginTop:'8px'}}>Something went wrong. Please try again.</p>}
            </form>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <p className="sec-label">// My Story</p>
        <div className="about-grid">
          <div className="at">
            <p>I'm an IAM engineer passionate about building secure, scalable identity systems. My focus is on designing access controls that protect resources without creating friction for legitimate users.</p>
            <p>I specialize in Zero Trust architecture, role-based access control implementation, and identity federation protocols like SAML 2.0 and OAuth 2.0. I believe that strong identity security is the foundation of every secure system.</p>
            <p>Currently deepening my expertise in cloud IAM platforms including Azure Active Directory / Entra ID and AWS IAM, while pursuing industry certifications to validate my skills.</p>
            <p style={{marginTop:'1rem', fontSize:'14px', color:'var(--blue)', fontWeight:500}}>Currently focused on:</p>
            <ul style={{paddingLeft:'1.25rem', fontSize:'14px', color:'var(--text2)', lineHeight:'1.9', marginTop:'0.5rem'}}>
              <li>Mastering Privileged Access Management (PAM)</li>
              <li>Building cloud infrastructure with Terraform</li>
              <li>Creating educational content on YouTube</li>
              <li>Preparing for SC-300 certification</li>
            </ul>
          </div>
          <div className="astats">
            <div className="sc">
              <div className="num">{projects.length || '3'}+</div>
              <div className="lbl">IAM projects completed</div>
            </div>
            <div className="sc">
              <div className="num">{publishedWriteups.length || '0'}</div>
              <div className="lbl">Write-ups published</div>
            </div>
            <div className="sc">
              <div className="num">2</div>
              <div className="lbl">Certifications in progress</div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact">
        <p className="sec-label">// Get in Touch</p>
        <p style={{fontSize:'15px', color:'var(--text2)', marginBottom:'1.5rem', maxWidth:'480px', lineHeight:'1.7'}}>
          I'm actively looking for opportunities in IAM. Feel free to reach out — I'd love to connect.
        </p>
        <div className="contact-row">
          <a className="cb" href={`mailto:${EMAIL}`}>✉ Email me</a>
          <a className="cb" href={LINKEDIN_URL} target="_blank" rel="noreferrer">in LinkedIn</a>
          <a className="cb" href={GITHUB_URL} target="_blank" rel="noreferrer">⌥ GitHub</a>
          <a className="cb" href={YOUTUBE_URL} target="_blank" rel="noreferrer" style={{color:'#E24B4A', borderColor:'#E24B4A'}}>▶ YouTube</a>
        </div>
      </section>

      <footer>
        <p>© {new Date().getFullYear()} Yusuf Isiaq · IAM Engineer · Built with Next.js</p>
      </footer>
    </>
  );
}
