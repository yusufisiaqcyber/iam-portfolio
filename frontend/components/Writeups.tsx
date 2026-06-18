import { useState, useEffect } from 'react';
import { Calendar, Tag, ArrowRight, Youtube } from 'lucide-react';
import Link from 'next/link';
import { getWriteups, Writeup } from '../lib/api';

export default function Writeups() {
  const [writeups, setWriteups] = useState<Writeup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    getWriteups()
      .then(setWriteups)
      .catch(() => setWriteups(placeholderWriteups))
      .finally(() => setLoading(false));
  }, []);

  // Get all unique tags
  const allTags = ['All', ...Array.from(new Set(writeups.flatMap(w => w.tags)))];

  const filtered = filter === 'All'
    ? writeups
    : writeups.filter(w => w.tags.includes(filter));

  return (
    <section id="writeups" className="py-24 px-4 bg-slate-50 dark:bg-[#0f1629]">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-12">
          <p className="section-label">// Knowledge Sharing</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Write-ups & Research
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Deep dives into IAM concepts, security engineering, and lessons learned from hands-on labs.
          </p>
        </div>

        {/* Tag filter */}
        {allTags.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
                  filter === tag
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-[#0a0f1e] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-[#1e2d4a] hover:border-blue-500'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Write-ups list */}
        {loading ? (
          <div className="text-center text-blue-500 font-mono animate-pulse">Loading write-ups...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-4xl mb-4">📝</p>
            <p>No write-ups published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map((writeup) => (
              <Link
                key={writeup.id}
                href={`/writeups/${writeup.slug}`}
                className="card flex flex-col sm:flex-row sm:items-start gap-4 group hover:glow cursor-pointer block"
              >
                {/* Date */}
                <div className="sm:w-28 flex-shrink-0">
                  <div className="flex items-center gap-1 text-blue-500 font-mono text-xs">
                    <Calendar size={11} />
                    {new Date(writeup.published_at || writeup.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors mb-1.5">
                    {writeup.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-3">
                    {writeup.summary}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {writeup.tags.map(tag => (
                      <span key={tag} className="tag flex items-center gap-1">
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <div className="sm:self-center text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">
                  <ArrowRight size={18} />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* YouTube CTA */}
        <div className="mt-12 p-6 rounded-xl bg-red-600/5 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
            📺 Prefer video format? I also cover these topics on YouTube!
          </p>
          <a
            href={process.env.NEXT_PUBLIC_YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
          >
            <Youtube size={15} />
            Watch on YouTube
          </a>
        </div>
      </div>
    </section>
  );
}

const placeholderWriteups: Writeup[] = [
  {
    id: 1,
    title: 'Understanding Zero Trust: A Practical Guide for IAM Engineers',
    slug: 'understanding-zero-trust',
    summary: 'Breaking down Zero Trust architecture principles and how identity plays a central role in every access decision.',
    tags: ['Zero Trust', 'Architecture', 'IAM'],
    published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'RBAC vs ABAC: Choosing the Right Access Control Model',
    slug: 'rbac-vs-abac',
    summary: 'A deep comparison of role-based and attribute-based access control, with real-world use cases for each approach.',
    tags: ['RBAC', 'ABAC', 'Access Control'],
    published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
];
