import { Shield, Target, BookOpen, Award } from 'lucide-react';

const stats = [
  { label: 'Projects Built', value: '10+', icon: Shield },
  { label: 'Write-ups Published', value: '5+', icon: BookOpen },
  { label: 'Certs in Progress', value: '3', icon: Award },
  { label: 'Years in Tech', value: '2+', icon: Target },
];

export default function About() {
  return (
    <section id="about" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <p className="section-label">// My Story</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            About Me
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left — Text */}
          <div className="space-y-6">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
              I'm an <span className="text-blue-500 font-semibold">IAM Engineer</span> passionate
              about building secure, scalable identity systems. My focus is on designing access
              controls that protect resources without creating friction for legitimate users.
            </p>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              I specialize in Zero Trust architecture, role-based access control implementation,
              and identity federation protocols like SAML 2.0 and OAuth 2.0. I believe that
              strong identity security is the foundation of every secure system.
            </p>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Currently deepening my expertise in cloud IAM platforms including Azure Active
              Directory / Entra ID and AWS IAM, while pursuing industry certifications to validate
              my skills.
            </p>

            {/* Current Focus */}
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
              <p className="text-blue-700 dark:text-blue-400 font-semibold text-sm mb-2">
                🎯 Currently focused on:
              </p>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>• Mastering Privileged Access Management (PAM)</li>
                <li>• Building cloud IAM automation with Terraform</li>
                <li>• Creating educational content on YouTube</li>
                <li>• Preparing for SC-300 certification</li>
              </ul>
            </div>
          </div>

          {/* Right — Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="card text-center hover:-translate-y-1 transition-all duration-300 hover:glow"
              >
                <Icon className="text-blue-500 mx-auto mb-3" size={28} />
                <div className="text-3xl font-bold gradient-text mb-1">{value}</div>
                <div className="text-slate-500 dark:text-slate-400 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
