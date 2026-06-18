const skillGroups = [
  {
    category: 'IAM Platforms',
    skills: [
      { name: 'Okta', level: 'learning' },
      { name: 'Azure AD / Entra ID', level: 'learning' },
      { name: 'AWS IAM', level: 'familiar' },
      { name: 'SailPoint', level: 'learning' },
    ]
  },
  {
    category: 'Protocols & Standards',
    skills: [
      { name: 'OAuth 2.0', level: 'familiar' },
      { name: 'OIDC', level: 'familiar' },
      { name: 'SAML 2.0', level: 'learning' },
      { name: 'LDAP / AD', level: 'familiar' },
    ]
  },
  {
    category: 'Security Concepts',
    skills: [
      { name: 'Zero Trust Architecture', level: 'familiar' },
      { name: 'RBAC / ABAC', level: 'proficient' },
      { name: 'PAM', level: 'learning' },
      { name: 'MFA Implementation', level: 'familiar' },
    ]
  },
  {
    category: 'Tools & Languages',
    skills: [
      { name: 'Python', level: 'familiar' },
      { name: 'PowerShell', level: 'familiar' },
      { name: 'Terraform', level: 'learning' },
      { name: 'Git', level: 'proficient' },
    ]
  },
];

const levelConfig = {
  proficient: { color: 'bg-blue-600', label: 'Proficient', width: 'w-full' },
  familiar:   { color: 'bg-blue-400', label: 'Familiar',   width: 'w-2/3' },
  learning:   { color: 'bg-blue-200 dark:bg-blue-800', label: 'Learning', width: 'w-1/3' },
};

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <p className="section-label">// Technical Expertise</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Skills & Technologies
          </h2>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {Object.entries(levelConfig).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <div className={`w-3 h-3 rounded-full ${val.color}`} />
              {val.label}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillGroups.map((group) => (
            <div key={group.category} className="card">
              <h3 className="font-mono text-blue-500 font-semibold mb-4 text-sm uppercase tracking-wide">
                {group.category}
              </h3>
              <div className="space-y-4">
                {group.skills.map((skill) => {
                  const config = levelConfig[skill.level as keyof typeof levelConfig];
                  return (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {skill.name}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{config.label}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 dark:bg-[#1e2d4a] rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${config.color} ${config.width} transition-all duration-700`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="mt-12 card text-center">
          <p className="section-label">// Currently Pursuing</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {['CompTIA Security+', 'SC-300 (Microsoft)', 'AWS Security Specialty', 'Okta Certified'].map(cert => (
              <span key={cert} className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-full text-sm font-medium border border-amber-200 dark:border-amber-800">
                🎯 {cert}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
