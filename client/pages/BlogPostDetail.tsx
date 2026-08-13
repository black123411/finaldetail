import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { getBlogSeoDescription, getBlogSeoTitle } from '@/shared/data/seo';
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  Share2, 
  Tag, 
  User,
  ArrowRight,
  Sparkles,
  Link as LinkIcon,
  Twitter,
  Facebook
} from 'lucide-react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '../components/ui/button';
import { BlogAPI } from '../services/api';
import NotFound from './NotFound';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  featuredImage: string;
  createdAt: any;
  published: boolean;
}

const ARTICLE_MARKDOWN_COMPONENTS: Components = {
  h2: ({ node: _node, ...props }) => (
    <h2 className="mt-14 border-t border-zinc-200 pt-10 text-3xl font-black leading-tight tracking-tight text-zinc-950 md:text-4xl" {...props} />
  ),
  h3: ({ node: _node, ...props }) => (
    <h3 className="mb-4 mt-10 text-2xl font-black leading-tight tracking-tight text-zinc-950 md:text-3xl" {...props} />
  ),
  h4: ({ node: _node, ...props }) => (
    <h4 className="mb-3 mt-8 text-xl font-black leading-tight text-zinc-950" {...props} />
  ),
  p: ({ node: _node, ...props }) => (
    <p className="my-5 text-lg font-normal leading-8 text-zinc-700" {...props} />
  ),
  a: ({ node: _node, ...props }) => (
    <a className="font-bold text-emerald-700 underline decoration-emerald-300 decoration-2 underline-offset-4 hover:text-emerald-800" {...props} />
  ),
  strong: ({ node: _node, ...props }) => (
    <strong className="font-black text-zinc-950" {...props} />
  ),
  ul: ({ node: _node, ...props }) => (
    <ul className="my-6 list-disc space-y-3 pl-7 text-lg leading-8 text-zinc-700 marker:text-emerald-600" {...props} />
  ),
  ol: ({ node: _node, ...props }) => (
    <ol className="my-6 list-decimal space-y-3 pl-7 text-lg leading-8 text-zinc-700 marker:font-bold marker:text-emerald-700" {...props} />
  ),
  blockquote: ({ node: _node, ...props }) => (
    <blockquote className="my-8 border-l-4 border-emerald-500 bg-emerald-50 px-6 py-4 text-lg leading-8 text-zinc-700" {...props} />
  ),
  table: ({ node: _node, ...props }) => (
    <div className="my-8 overflow-x-auto rounded-2xl border border-zinc-200">
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  th: ({ node: _node, ...props }) => (
    <th className="border-b border-zinc-200 bg-zinc-100 px-4 py-3 font-black text-zinc-950" {...props} />
  ),
  td: ({ node: _node, ...props }) => (
    <td className="border-b border-zinc-100 px-4 py-3 text-zinc-700" {...props} />
  ),
};

function estimateReadTime(content: string) {
  const wordCount = content
    .replace(/[#_*`>\[\]()|~-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(wordCount / 220));
}

export default function BlogPostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      try {
        const [postData, storedPosts] = await Promise.all([
          BlogAPI.getPost(slug) as Promise<BlogPost>,
          BlogAPI.getPosts() as Promise<BlogPost[]>,
        ]);
        setPost(postData);
        const otherPosts = storedPosts.filter(item => item.slug !== slug);
        const relatedCandidates = [
          ...otherPosts.filter(item => item.category === postData.category),
          ...otherPosts.filter(item => item.category !== postData.category),
        ];
        setRelatedPosts(relatedCandidates.slice(0, 3));
      } catch {
        // A missing or unpublished slug should remain a real 404 route rather than
        // silently redirecting visitors to the blog index.
        setPost(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 pt-32 pb-24 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <Sparkles className="h-12 w-12 text-emerald-500" />
        </motion.div>
      </div>
    );
  }

  if (!post) return <NotFound />;

  const readTime = estimateReadTime(post.content);
  const articleUrl = `https://bryansdetailingomaha.com/blog/${post.slug}`;
  const socialImage = post.featuredImage || 'https://bryansdetailingomaha.com/20211009_025807-COLLAGE.jpg';
  const seoTitle = getBlogSeoTitle(post.slug, post.title);
  const seoDescription = getBlogSeoDescription(post.slug, post.excerpt);

  return (
    <div className="min-h-screen bg-zinc-50 pt-32 pb-24">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="robots" content="index,follow,max-image-preview:large" />
        <link rel="canonical" href={articleUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={socialImage} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={articleUrl} />
        <meta property="twitter:title" content={seoTitle} />
        <meta property="twitter:description" content={seoDescription} />
        <meta property="twitter:image" content={socialImage} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "image": socialImage,
            "author": {
              "@type": "Person",
              "name": post.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "Bryan's Showroom Quality Mobile Detailing",
              "logo": {
                "@type": "ImageObject",
                "url": "https://bryansdetailingomaha.com/20211009_025807-COLLAGE.jpg"
              }
            },
            "datePublished": post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString()
          })}
        </script>
      </Helmet>
      {/* Article Header */}
      <div className="container mx-auto px-4 max-w-4xl mb-12">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-zinc-400 font-black uppercase tracking-widest text-[10px] mb-8 hover:text-emerald-500 transition-colors"
        >
          <ChevronLeft className="h-3 w-3" /> Back to Articles
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex gap-2 mb-6">
            <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
              {post.category}
            </span>
          </div>
          <h1 className="mb-8 text-4xl font-black leading-[1.08] tracking-tight text-zinc-900 md:text-5xl">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 border-b border-zinc-100 pb-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white italic font-black shadow-lg">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Written By</p>
                <p className="text-sm font-black text-zinc-900 italic">{post.author}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Date</p>
                <p className="text-sm font-black text-zinc-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-emerald-500" />
                  {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Read Time</p>
                <p className="text-sm font-black text-zinc-900 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-500" />
                  {readTime} min
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Featured Image */}
      <div className="container mx-auto px-4 max-w-6xl mb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl"
        >
          <img 
            src={post.featuredImage || '/20191020_110329.jpg'} 
            alt={post.title} 
            className="w-full h-full object-cover shadow-inner"
          />
        </motion.div>
      </div>

      {/* Content Grid */}
      <div className="container mx-auto px-4 max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Main Content */}
        <article className="lg:col-span-8">
          <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-zinc-100 shadow-sm">
            <div className="max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={ARTICLE_MARKDOWN_COMPONENTS}>{post.content}</ReactMarkdown>
            </div>
            
            <div className="mt-16 pt-12 border-t border-zinc-50 flex flex-wrap items-center justify-between gap-8">
              <div className="flex items-center gap-4">
                <Tag className="h-4 w-4 text-zinc-300" />
                <div className="flex gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-50 px-3 py-1 rounded-full">#detailing</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-50 px-3 py-1 rounded-full">#omaha</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-50 px-3 py-1 rounded-full">#carcare</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 italic">Share This Post</p>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-emerald-50 hover:text-emerald-500 transition-all" title="Share on Twitter" aria-label="Share on Twitter">
                    <Twitter className="h-4 w-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-emerald-50 hover:text-emerald-500 transition-all" title="Share on Facebook" aria-label="Share on Facebook">
                    <Facebook className="h-4 w-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 hover:bg-emerald-50 hover:text-emerald-500 transition-all" title="Copy Link" aria-label="Copy Link">
                    <LinkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-12">
          {/* Related Articles */}
          <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white">
            <h3 className="text-xl font-black italic tracking-tight mb-8 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-emerald-500" /> Related Articles
            </h3>
            <div className="space-y-8">
              {relatedPosts.map(rel => (
                <Link key={rel.id} to={`/blog/${rel.slug}`} className="group block">
                  <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500 mb-2 truncate">
                    {rel.category}
                  </p>
                  <h4 className="text-sm font-black italic leading-snug group-hover:text-emerald-400 transition-colors">
                    {rel.title}
                  </h4>
                  <div className="mt-2 flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-zinc-500 italic">
                    Read More <ArrowRight className="h-2 w-2" />
                  </div>
                </Link>
              ))}
              {relatedPosts.length === 0 && (
                <p className="text-sm text-zinc-500 italic">No related articles found yet.</p>
              )}
            </div>
          </div>

          {/* Booking CTA */}
          <div className="bg-emerald-500 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <Sparkles className="w-48 h-48" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black italic tracking-tight mb-4">Not Sure What to Book?</h3>
              <p className="text-emerald-100 text-sm font-medium mb-8 leading-relaxed">
                Send me a few clear photos and tell me what you want done. I’ll take a look and give you a straight answer.
              </p>
              <Button asChild className="w-full h-14 bg-zinc-900 hover:bg-black text-white rounded-2xl font-black italic tracking-tight shadow-xl">
                <Link to="/quote">Send Photos</Link>
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
