import { GetStaticPaths, GetStaticProps } from 'next';
import { ArrowLeft, Calendar, Tag, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Subscribe from '../../components/Subscribe';
import { getWriteups, getWriteup, Writeup } from '../../lib/api';

interface Props {
  writeup: Writeup;
}

export default function WriteupPage({ writeup }: Props) {
  if (!writeup) return <div>Write-up not found</div>;

  const readTime = Math.ceil((writeup.content?.split(' ').length || 0) / 200);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <article className="max-w-3xl mx-auto px-4">

          {/* Back button */}
          <Link href="/#writeups" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors mb-8 text-sm">
            <ArrowLeft size={16} />
            Back to Write-ups
          </Link>

          {/* Header */}
          <header className="mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              {writeup.tags.map(tag => (
                <span key={tag} className="tag flex items-center gap-1">
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
              {writeup.title}
            </h1>

            <p className="text-xl text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              {writeup.summary}
            </p>

            <div className="flex items-center gap-4 text-sm text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                {new Date(writeup.published_at).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={13} />
                {readTime} min read
              </span>
            </div>

            <hr className="mt-6 border-slate-200 dark:border-[#1e2d4a]" />
          </header>

          {/* Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none
            prose-headings:text-slate-900 dark:prose-headings:text-white
            prose-h2:text-blue-500 dark:prose-h2:text-blue-400
            prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline
            prose-code:text-blue-600 dark:prose-code:text-blue-400
            prose-code:bg-slate-100 dark:prose-code:bg-[#1e2d4a]
            prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-[#0a0f1e] prose-pre:border prose-pre:border-[#1e2d4a]
          ">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {writeup.content || ''}
            </ReactMarkdown>
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
    const paths = writeups.map(w => ({ params: { slug: w.slug } }));
    return { paths, fallback: 'blocking' };
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
