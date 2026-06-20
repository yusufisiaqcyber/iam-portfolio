import { Shield, ChevronDown, Youtube, Github, Linkedin, Mail } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">

      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(55,138,221,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(55,138,221,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Blue glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">

        {/* Eyebrow */}
        <p className="font-mono text-blue-500 text-sm uppercase tracking-widest mb-4">
          — Identity & Access Management —
        </p>

        {/* Name */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
          <span className="text-slate-900 dark:text-white">Yusuf Isiaq</span>
        </h1>

        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Shield className="text-blue-500" size={20} />
          <h2 className="text-xl sm:text-2xl font-mono text-blue-500 font-semibold">
            IAM Engineer
          </h2>
          <span className="w-0.5 h-6 bg-blue-500 animate-pulse" />
        </div>

        {/* Bio */}
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          Securing digital identities through Zero Trust architecture, RBAC implementation,
          and IAM solutions. Sharing what I learn through write-ups and YouTube.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <a href="#projects" className="btn-primary flex items-center gap-2">
            <Shield size={16} />
            View My Projects
          </a>
          <a href="#writeups" className="btn-outline flex items-center gap-2">
            Read Write-ups
          </a>
          <a
            href={process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://youtube.com/@cybernuggetz-iam'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
          >
            <Youtube size={16} />
            YouTube
          </a>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4">
          {[
            { icon: Github, href: 'https://github.com/yusufisiaqcyber', label: 'GitHub' },
            { icon: Linkedin, href: 'https://linkedin.com/in/yusuf-isiaq', label: 'LinkedIn' },
            { icon: Mail, href: 'mailto:yusufisiaqcyber@gmail.com', label: 'Email' },
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
            >
              <Icon size={20} />
            </a>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#projects"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 hover:text-blue-500 animate-bounce transition-colors"
      >
        <ChevronDown size={24} />
      </a>
    </section>
  );
}
