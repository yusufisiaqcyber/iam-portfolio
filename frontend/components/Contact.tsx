import { Github, Linkedin, Mail, Youtube, Twitter } from 'lucide-react';

const contacts = [
  {
    icon: Github,
    label: 'GitHub',
    handle: '@yourusername',
    href: 'https://github.com/yourusername',
    color: 'hover:text-slate-900 dark:hover:text-white'
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    handle: 'Connect with me',
    href: 'https://linkedin.com/in/yourusername',
    color: 'hover:text-blue-600'
  },
  {
    icon: Youtube,
    label: 'YouTube',
    handle: '@YourChannel',
    href: process.env.NEXT_PUBLIC_YOUTUBE_URL || '#',
    color: 'hover:text-red-600'
  },
  {
    icon: Mail,
    label: 'Email',
    handle: 'you@email.com',
    href: 'mailto:you@email.com',
    color: 'hover:text-blue-500'
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">

        <p className="section-label">// Get In Touch</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Let's Connect
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-12 max-w-xl mx-auto">
          Open to collaborations, discussions about IAM security, or just connecting with
          fellow engineers in the identity space.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {contacts.map(({ icon: Icon, label, handle, href, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={`card flex flex-col items-center gap-3 text-center group hover:-translate-y-1 transition-all duration-300 ${color}`}
            >
              <Icon size={24} className="text-blue-500 group-hover:scale-110 transition-transform" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">{label}</p>
                <p className="text-slate-400 text-xs mt-0.5 font-mono">{handle}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="card inline-block px-8 py-6">
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-1">Preferred contact</p>
          <a
            href="mailto:you@email.com"
            className="text-blue-500 hover:text-blue-600 font-mono font-semibold text-lg"
          >
            you@email.com
          </a>
        </div>
      </div>
    </section>
  );
}
