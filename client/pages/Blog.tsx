import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  Tag, 
  Search,
  MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { BlogAPI } from '../services/api';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  featuredImage: string;
  createdAt: any;
  published: boolean;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Maintenance', 'Detailing Tips', 'Ceramic Coating', 'Industry News', 'Paint Correction', 'New Car Tips', 'Tips & Guides'];

  useEffect(() => {
    async function fetchPosts() {
      try {
        const storedPosts = await BlogAPI.getPosts() as BlogPost[];
        setPosts(storedPosts.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-zinc-50 pt-32 pb-24">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-20">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tighter italic mb-6">
              The Detailer's <span className="text-emerald-500">Journal</span>
            </h1>
            <p className="text-xl text-zinc-600 max-w-2xl leading-relaxed font-medium">
              Pro tips, maintenance guides, and inside looks at the world of showroom-quality detailing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-6 rounded-[2.5rem] border border-zinc-100 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  selectedCategory === cat
                    ? 'bg-zinc-900 text-white shadow-lg'
                    : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              aria-label="Search detailing articles"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="container mx-auto px-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[4/3] bg-zinc-100 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`} className="group block h-full">
                  <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden h-full flex flex-col transition-all hover:shadow-xl hover:-translate-y-1">
                    <div className="aspect-[16/10] overflow-hidden relative">
                      <img
                        src={post.featuredImage || '/20191020_110329.jpg'}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 shadow-inner"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-900 shadow-sm">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-8 flex-grow flex flex-col">
                      <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3" />
                          5 min read
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-zinc-900 leading-tight mb-4 group-hover:text-emerald-500 transition-colors italic tracking-tight">
                        {post.title}
                      </h3>
                      <p className="text-zinc-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3 font-medium">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-6 border-t border-zinc-50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white text-[10px] font-black italic">
                            {post.author.charAt(0)}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900 italic">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-500 font-black italic text-xs group-hover:gap-2 transition-all">
                          Read More <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-zinc-100">
            <BookOpen className="h-16 w-16 text-zinc-100 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-zinc-900 italic mb-2">No articles found</h2>
            <p className="text-zinc-500 font-medium">Try adjusting your search or category filter.</p>
            <Button 
              variant="outline" 
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="mt-8 rounded-2xl font-black italic border-zinc-200"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </section>

      {/* Help choosing a service */}
      <section className="container mx-auto px-4 mt-24">
        <div className="bg-zinc-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 opacity-10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-10 blur-[100px]" />
          
          <div className="max-w-2xl relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter mb-6 leading-none">
              Not Sure What Your Vehicle <span className="text-emerald-500 underline decoration-4 underline-offset-8">Needs?</span>
            </h2>
            <p className="text-zinc-400 text-lg mb-10 font-medium leading-relaxed">
              Send a few photos and a short description. Bryan can recommend the right service before you schedule.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button className="h-14 rounded-2xl bg-emerald-500 px-10 font-black text-white hover:bg-emerald-600" asChild>
                <Link to="/quote">Request a Recommendation</Link>
              </Button>
              <Button variant="outline" className="h-14 rounded-2xl border-zinc-700 bg-transparent px-10 font-black text-white hover:bg-zinc-800 hover:text-white" asChild>
                <Link to="/services">Compare Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
