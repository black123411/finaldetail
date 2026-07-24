import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Save, 
  X, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  ChevronRight,
  Send,
  FileText
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { BlogAPI } from '../services/api';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  featuredImage: string;
  published: boolean;
  createdAt: any;
}

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [storageLabel, setStorageLabel] = useState('Checking storage...');
  const [postPendingDelete, setPostPendingDelete] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchPosts();
    BlogAPI.getAdminStorage()
      .then((result) => setStorageLabel(result.persistent ? 'Cloud Storage connected' : 'Local development storage'))
      .catch(() => setStorageLabel('Storage status unavailable'));
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      setPosts(await BlogAPI.getAdminPosts());
    } catch (error) {
      console.error('Error fetching posts:', error);
      setStatus({ success: false, message: 'Unable to load articles from the admin server.' });
    } finally {
      setLoading(false);
    }
  }

  const handleCreateNew = () => {
    setCurrentPost({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: 'Bryan',
      category: 'Maintenance',
      featuredImage: '',
      published: false
    });
    setIsEditorOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setCurrentPost(post);
    setIsEditorOpen(true);
  };

  const handleDelete = async () => {
    if (!postPendingDelete) return;
    try {
      await BlogAPI.deletePost(postPendingDelete.id);
      setStatus({ success: true, message: 'Post deleted successfully!' });
      setPostPendingDelete(null);
      fetchPosts();
    } catch (error) {
      setStatus({ success: false, message: 'Failed to delete post.' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPost) return;

    try {
      const postData = {
        ...currentPost,
        slug: currentPost.slug || currentPost.title?.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]+/g, '')
      };

      if (currentPost.id) {
        await BlogAPI.updatePost(currentPost.id, postData);
      } else {
        await BlogAPI.createPost(postData);
      }

      setStatus({ success: true, message: 'Post saved successfully!' });
      setIsEditorOpen(false);
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      setStatus({ success: false, message: 'Failed to save post.' });
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50 pt-32 pb-24 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="flex items-center gap-4">
             <Link to="/admin" className="p-3 bg-white rounded-2xl border border-zinc-100 shadow-sm text-zinc-400 hover:text-zinc-900 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-zinc-900 tracking-tighter italic">Blog Manager</h1>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Create & refine showroom-quality content · {storageLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleCreateNew}
              className="h-14 px-8 rounded-2xl bg-zinc-900 border-0 text-white font-black italic shadow-xl shadow-zinc-200 hover:bg-zinc-800 transition-all flex items-center gap-2"
            >
              <Plus className="h-5 w-5" /> New Article
            </Button>
          </div>
        </div>

        {status && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-4 rounded-2xl flex items-center gap-3 ${
              status.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'
            }`}
          >
            {status.success ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <p className="text-sm font-black italic">{status.message}</p>
            <button onClick={() => setStatus(null)} aria-label="Close status" className="ml-auto"><X className="h-4 w-4" /></button>
          </motion.div>
        )}

        {/* Toolbar */}
        <div className="bg-white p-6 rounded-[2.5rem] border border-zinc-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
           <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Filter by title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 border-none rounded-2xl text-xs font-black uppercase tracking-widest placeholder:text-zinc-300 focus:ring-2 focus:ring-zinc-900 transition-all"
            />
          </div>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <span className="flex items-center gap-2">
              <FileText className="h-3 w-3" /> {posts.length} Posts
            </span>
            <span className="flex items-center gap-2">
              <Edit3 className="h-3 w-3" /> {posts.filter(p => !p.published).length} Drafts
            </span>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-50 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  <th className="px-8 py-6 text-left">Article</th>
                  <th className="px-8 py-6 text-left">Status</th>
                  <th className="px-8 py-6 text-left">Date</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredPosts.map(post => (
                  <tr key={post.id} className="group hover:bg-zinc-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-100">
                          {post.featuredImage ? (
                            <img src={post.featuredImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-zinc-300" aria-hidden="true">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-zinc-900 group-hover:text-emerald-500 transition-colors">{post.title}</p>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{post.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        post.published ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-xl hover:bg-zinc-100"
                            asChild
                          >
                            <Link
                              to={`/blog/${post.slug}`}
                              target="_blank"
                              aria-label={`Preview ${post.title}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-xl hover:bg-zinc-100"
                            onClick={() => handleEdit(post)}
                            aria-label={`Edit ${post.title}`}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-xl hover:bg-red-50 text-red-500"
                            onClick={() => setPostPendingDelete(post)}
                            aria-label={`Delete ${post.title}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                       </div>
                    </td>
                  </tr>
                ))}
                {filteredPosts.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                       <FileText className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
                       <p className="text-zinc-500 font-medium italic">No articles found in this catalog.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {postPendingDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.button
              type="button"
              aria-label="Cancel article deletion"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPostPendingDelete(null)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-article-title"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              className="relative w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl"
            >
              <h2 id="delete-article-title" className="text-2xl font-black italic tracking-tight text-zinc-950">
                Delete this article?
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                “{postPendingDelete.title}” will be removed from blog storage. This cannot be undone.
              </p>
              <div className="mt-8 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setPostPendingDelete(null)}
                  className="rounded-xl font-black italic"
                >
                  Keep Article
                </Button>
                <Button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-xl bg-red-600 font-black italic text-white hover:bg-red-700"
                >
                  Delete Article
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Editor Modal */}
      <AnimatePresence>
        {isEditorOpen && currentPost && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditorOpen(false)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Editor Header */}
              <div className="p-8 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white italic font-black">
                    {currentPost.id ? 'EP' : 'NP'}
                  </div>
                  <div>
                    <h2 className="text-xl font-black italic tracking-tight">{currentPost.id ? 'Edit Article' : 'New Article'}</h2>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Drafting showroom quality content</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-2 mr-6">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Published Status</span>
                      <button 
                        type="button"
                        aria-label="Toggle publish status"
                        onClick={() => setCurrentPost(prev => ({ ...prev!, published: !prev?.published }))}
                        className={`w-12 h-6 rounded-full transition-all relative ${currentPost.published ? 'bg-emerald-500' : 'bg-zinc-200'}`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-all ${currentPost.published ? 'translate-x-6' : ''}`} />
                      </button>
                   </div>
                  <button 
                    onClick={() => setIsEditorOpen(false)}
                    aria-label="Close editor"
                    className="p-2 hover:bg-zinc-200 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Editor Content */}
              <form onSubmit={handleSave} className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  <div className="lg:col-span-8 space-y-8">
                    {/* Title */}
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 italic">Article Title</label>
                       <input 
                        type="text" 
                        required
                        value={currentPost.title}
                        onChange={(e) => setCurrentPost(prev => ({ ...prev!, title: e.target.value }))}
                        placeholder="e.g. 5 Maintenance Tips for Ceramic Coatings"
                        className="w-full text-3xl font-black italic tracking-tighter placeholder:text-zinc-100 border-none focus:ring-0 p-0"
                       />
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 italic">Summary / Excerpt</label>
                       <textarea 
                        required
                        value={currentPost.excerpt}
                        onChange={(e) => setCurrentPost(prev => ({ ...prev!, excerpt: e.target.value }))}
                        rows={3}
                        placeholder="A brief teaser for the article list..."
                        className="w-full bg-zinc-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-zinc-900 transition-all"
                       />
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 italic flex justify-between">
                         Main Content (Markdown Supported)
                         <span className="font-bold text-zinc-300"># Heading, **Bold**, [Link]()</span>
                       </label>
                       <textarea 
                        required
                        value={currentPost.content}
                        onChange={(e) => setCurrentPost(prev => ({ ...prev!, content: e.target.value }))}
                        rows={15}
                        placeholder="Start typing your article..."
                        className="w-full bg-zinc-50 border-none rounded-2xl p-6 text-sm font-medium font-sans focus:ring-2 focus:ring-zinc-900 transition-all leading-relaxed"
                       />
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-8">
                    {/* Metadata */}
                    <div className="bg-zinc-50 p-6 rounded-[2.5rem] border border-zinc-100 space-y-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 italic">Slug (URL)</label>
                        <input 
                          type="text" 
                          value={currentPost.slug}
                          onChange={(e) => setCurrentPost(prev => ({ ...prev!, slug: e.target.value }))}
                          placeholder="tips-for-ceramic"
                          className="w-full bg-white border border-zinc-100 rounded-xl p-3 text-[10px] font-mono focus:ring-2 focus:ring-zinc-900"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 italic">Category</label>
                        <select 
                          aria-label="Category"
                          value={currentPost.category}
                          onChange={(e) => setCurrentPost(prev => ({ ...prev!, category: e.target.value }))}
                          className="w-full bg-white border border-zinc-100 rounded-xl p-3 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-zinc-900"
                        >
                          <option>Maintenance</option>
                          <option>Detailing Tips</option>
                          <option>Ceramic Coating</option>
                          <option>Industry News</option>
                          <option>Paint Correction</option>
                          <option>New Car Tips</option>
                          <option>Tips &amp; Guides</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400 italic">Featured Image URL</label>
                        <div className="relative">
                          <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-300" />
                          <input 
                            type="text" 
                            value={currentPost.featuredImage}
                            onChange={(e) => setCurrentPost(prev => ({ ...prev!, featuredImage: e.target.value }))}
                            placeholder="Unsplash / Public path URL"
                            className="w-full pl-10 pr-3 py-3 bg-white border border-zinc-100 rounded-xl text-[10px] font-mono focus:ring-2 focus:ring-zinc-900"
                          />
                        </div>
                        {currentPost.featuredImage && (
                          <div className="mt-3 aspect-video rounded-xl overflow-hidden border border-zinc-100">
                             <img src={currentPost.featuredImage} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-6 bg-zinc-900 rounded-[2.5rem] text-white">
                       <h4 className="text-xs font-black italic tracking-tight mb-4 flex items-center gap-2">
                         <Send className="h-3.5 w-3.5 text-emerald-500" /> Publication Tip
                       </h4>
                       <p className="text-[10px] font-medium text-zinc-400 leading-relaxed uppercase tracking-wider italic">
                         Always proofread your content before checking "Published". Once published, articles are instantly visible on the live site.
                       </p>
                    </div>
                  </div>
                </div>

                {/* Editor Actions sticky footer */}
                <div className="sticky bottom-0 pt-8 mt-12 bg-white border-t border-zinc-100 flex justify-end gap-4 pb-2">
                  <Button 
                    type="button"
                    variant="ghost" 
                    onClick={() => setIsEditorOpen(false)}
                    className="font-black italic text-zinc-400 hover:bg-zinc-50 rounded-xl h-12 px-8 uppercase"
                  >
                    Discard Changes
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-zinc-900 text-white rounded-xl h-12 px-12 font-black italic tracking-tight shadow-xl shadow-zinc-200 hover:bg-zinc-800 transition-all flex items-center gap-2"
                  >
                    <Save className="h-5 w-5" /> Save Article
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
