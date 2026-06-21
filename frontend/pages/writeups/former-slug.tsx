import { GetStaticPaths, GetStaticProps } from 'next';
import { ArrowLeft, Calendar, Tag, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Subscribe from '../../components/Subscribe';
import { getWriteups, getWriteup, Writeup } from '../../lib/api';

interface Props { writeup: Writeup; }

export default function WriteupPage({ writeup }: Props) {
  if (!writeup) return <div>Write-up not found</div>;

  const readTime = Math.ceil((writeup.content?.split(' ').length || 0) / 200);

  return (
    <>
      <Head>
        <title>{writeup.title} — Yusuf Isiaq</title>
        <meta name="description" content={writeup.summary} />
      </Head>

      <style>{`
        .prose-content h1 { font-size: 1.75rem; font-weight: 700; margin: 2rem 0 1rem; color: var(--heading); line-height: 1.3; }
        .prose-content h2 { font-size: 1.375rem; font-weight: 700; margin: 2rem 0 0.75rem; color: #378ADD; line-height: 1.3; }
        .prose-content h3 { font-size: 1.125rem; font-weight: 600; margin: 1.5rem 0 0.5rem; color: var(--heading); }
        .prose-content p  { margin: 0 0 1.25rem; line-height: 1.85; color: var(--body); }
        .prose-content ul, .prose-content ol { margin: 0 0 1.25rem 1.5rem; color: var(--body); }
        .prose-content li { margin-bottom: 0.4rem; line-height: 1.75; }
        .prose-content ul { list-style: disc; }
        .prose-content ol { list-style: decimal; }
        .prose-content strong { font-weight: 600; color: var(--heading); }
        .prose-content em { font-style: italic; color: var(--body); }
        .prose-content a  { color: #378ADD; text-decoration: underline; text-underline-offset: 3px; }
        .prose-content a:hover { opacity: 0.8; }
        .prose-content blockquote {
          border-left: 3px solid #378ADD;
          padding: 0.75rem 1.25rem;
          margin: 1.5rem 0;
          background: rgba(55,138,221,0.05);
          border-radius: 0 8px 8px 0;
          color: var(--body);
          font-style: italic;
        }
        .prose-content code {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 0.8em;
          background: rgba(55,138,221,0.08);
          color: #378ADD;
          padding: 0.15em 0.45em;
          border-radius: 4px;
          border: 1px solid rgba(55,138,221,0.15);
        }
        .prose-content pre {
          background: #0a0f1e;
          border: 1px solid #1e2d4a;
          border-radius: 10px;
          padding: 1.25rem 1.5rem;
          margin: 1.5rem 0;
          overflow-x: auto;
        }
        .prose-content pre code {
          background: none;
          border: none;
          color: #85B7EB;
          font-size: 0.85em;
          padding: 0;
        }
        .prose-content hr {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.07);
          margin: 2rem 0;
        }
        .prose-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.9em;
        }
        .prose-content th {
          background: rgba(55,138,221,0.08);
          color: #378ADD;
          font-weight: 600;
          padding: 0.6rem 1rem;
          text-align: left;
          border-bottom: 1px solid #1e2d4a;
        }
        .prose-content td {
          padding: 0.6rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          color: var(--body);
        }
        :root { --heading: #0f172a; --body: #475569; }
        .dark { --heading: #e2e8f0; --body: #94a3b8; }
      `}</style>

      <Navbar />

      <main className="min-h-screen pt-24 pb-16 bg-white dark:bg-[#0a0f1e]">
        <article className="max-w-2xl mx-auto px-4">

          {/* Back */}
          <Link href="/#writeups"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-blue-500 transition-colors mb-10 text-sm font-medium group">
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Write-ups
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {writeup.tags.map(tag => (
              <span key={tag} className="tag flex items-center gap-1">
                <Tag size={9} /> {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight tracking-tight">
            {writeup.title}
          </h1>

          {/* Summary */}
          <p className="text-lg text-slate-500 dark:text-slate-400 mb-6 leading-relaxed border-l-2 border-blue-500 pl-4">
            {writeup.summary}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-5 text-xs text-slate-400 font-mono mb-8 pb-8 border-b border-slate-100 dark:border-[#1e2d4a]">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {new Date(writeup.published_at).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              {readTime} min read
            </span>
          </div>

          {/* Content */}
          <div className="prose-content text-base">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {writeup.content || ''}
            </ReactMarkdown>
          </div>

          {/* Footer nav */}
          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-[#1e2d4a]">
            <Link href="/#writeups"
              className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-500 transition-colors group">
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to all write-ups
            </Link>
          </div>
        </article>

        {/* Subscribe CTA */}
        <div className="mt-16">
          <Subscribe />
        </div>
      </main>

      <Footer />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const writeups = await getWriteups();
    return { paths: writeups.map(w => ({ params: { slug: w.slug } })), fallback: 'blocking' };
  } catch {
    return { paths: [], fallback: 'blocking' };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const writeup = await getWriteup(params?.slug as string);
    return { props: { writeup }, revalidate: 60 };
  } catch {
    return { notFound: true };
  }
};
