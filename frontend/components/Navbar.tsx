import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, X, Shield, Youtube } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

const navItems = [
  { href: '/#home',     label: 'Home' },
  { href: '/#projects', label: 'Projects' },
  { href: '/#skills',   label: 'Skills' },
  { href: '/#writeups', label: 'Write-ups' },
  { href: '/#about',    label: 'About' },
  { href: '/#contact',  label: 'Contact' },
];

// Inlined nav-link styles — no @apply dependency
const navLinkCls = 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150 font-medium';

export default function Navbar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');

  return (
    <nav className={clsx(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-white/90 dark:bg-[#0a0f1e]/90 backdrop-blur-md shadow-lg border-b border-slate-200 dark:border-[#1e2d4a]'
        : 'bg-transparent'
    )}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-mono font-bold text-blue-600 dark:text-blue-400">
            <Shield size={20} />
            <span className="text-lg">"YUSUF ISIAQ"</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <Link key={item.href} href={item.href} className={`${navLinkCls} text-sm`}>
                {item.label}
              </Link>
            ))}

            {/* YouTube Button */}
            <a
              href={process.env.NEXT_PUBLIC_YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Youtube size={14} />
              YouTube
            </a>

            {/* Dark Mode Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-100 dark:bg-[#1e2d4a] text-slate-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                aria-label="Toggle dark mode"
              >
                {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-100 dark:bg-[#1e2d4a] text-slate-600 dark:text-blue-300"
              >
                {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            )}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200 dark:border-[#1e2d4a] mt-2 pt-4 flex flex-col gap-3">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`${navLinkCls} text-sm px-2 py-1`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={process.env.NEXT_PUBLIC_YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium w-fit"
            >
              <Youtube size={14} /> YouTube
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
