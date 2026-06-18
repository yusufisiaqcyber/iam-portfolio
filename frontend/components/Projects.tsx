import { useState, useEffect } from 'react';
import { Github, ExternalLink, Star } from 'lucide-react';
import { getProjects, Project } from '../lib/api';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => setProjects(placeholderProjects))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <section id="projects" className="py-24 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="animate-pulse text-blue-500 font-mono">Loading projects...</div>
      </div>
    </section>
  );

  return (
    <section id="projects" className="py-24 px-4 bg-slate-50 dark:bg-[#0f1629]">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <p className="section-label">// Featured Work</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            IAM Projects
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-4 max-w-xl mx-auto">
            Hands-on labs and real implementations exploring identity security concepts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="card group hover:glow hover:-translate-y-1 transition-all duration-300 flex flex-col">

              {/* Featured badge */}
              {project.featured && (
                <div className="flex items-center gap-1 text-amber-500 text-xs font-mono mb-3">
                  <Star size={12} fill="currentColor" />
                  Featured
                </div>
              )}

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                {project.title}
              </h3>

              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 flex-grow">
                {project.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tech_stack.map(tech => (
                  <span key={tech} className="tag">{tech}</span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-3 mt-auto pt-4 border-t border-slate-100 dark:border-[#1e2d4a]">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-500 transition-colors"
                  >
                    <Github size={14} />
                    Source
                  </a>
                )}
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-500 transition-colors"
                  >
                    <ExternalLink size={14} />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Placeholders shown if API fails / no projects yet
const placeholderProjects: Project[] = [
  {
    id: 1,
    title: 'RBAC Implementation Lab',
    description: 'Built a role-based access control system with granular permissions, role hierarchies, and audit logging using Python and PostgreSQL.',
    tech_stack: ['Python', 'PostgreSQL', 'FastAPI', 'RBAC'],
    github_url: '#',
    featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'SSO Integration with SAML 2.0',
    description: 'Configured single sign-on across multiple applications using SAML 2.0 federation with an IdP and multiple service providers.',
    tech_stack: ['SAML 2.0', 'Okta', 'Azure AD', 'Node.js'],
    github_url: '#',
    featured: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Zero Trust Network Access',
    description: 'Designed and documented a zero-trust architecture framework with identity-centric security policies.',
    tech_stack: ['Zero Trust', 'MFA', 'PAM', 'Azure'],
    github_url: '#',
    demo_url: '#',
    featured: false,
    created_at: new Date().toISOString(),
  },
];
