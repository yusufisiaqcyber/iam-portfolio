import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-8 px-4 border-t border-slate-200 dark:border-[#1e2d4a]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-mono text-blue-500 text-sm">
          <Shield size={14} />
          <span>"IAM Engineer"</span>
        </div>
        <p className="text-slate-400 text-sm">
          © {new Date().getFullYear()} · Built with Next.js · Secured with 🔐
        </p>
        <p className="text-slate-500 text-xs font-mono">
          Identity is the new perimeter
        </p>
      </div>
    </footer>
  );
}
