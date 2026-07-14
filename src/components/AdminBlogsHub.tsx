import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Plus, 
  Sparkles, 
  Loader2, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  status: "Draft" | "Published";
  imageUrl: string;
  createdAt: string;
  views: number;
}

export default function AdminBlogsHub() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  
  // AI Generator states
  const [generatorPrompt, setGeneratorPrompt] = useState("");
  const [generatorCategory, setGeneratorCategory] = useState("Market Insights");
  const [generatorAuthor, setGeneratorAuthor] = useState("AI Analyst");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");

  // Editor states
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("SuperAdmin");
  const [category, setCategory] = useState("Market Insights");
  const [status, setStatus] = useState<"Draft" | "Published">("Published");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/blogs");
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs || []);
      }
    } catch (err) {
      console.error("Failed to load blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const startCreate = () => {
    setEditingBlog(null);
    setTitle("");
    setExcerpt("");
    setContent("");
    setAuthor("SuperAdmin");
    setCategory("Market Insights");
    setStatus("Published");
    setImageUrl("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200");
    setIsCreating(true);
    setShowGenerator(false);
  };

  const startEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setAuthor(blog.author);
    setCategory(blog.category);
    setStatus(blog.status);
    setImageUrl(blog.imageUrl);
    setIsCreating(false);
    setShowGenerator(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }

    const payload = {
      title,
      excerpt,
      content,
      author,
      category,
      status,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200"
    };

    try {
      let res;
      if (editingBlog) {
        res = await fetch(`/api/blogs/${editingBlog.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (data.success) {
        fetchBlogs();
        cancelEdit();
      } else {
        alert(data.error || "Failed to save blog post.");
      }
    } catch (err) {
      console.error("Error saving blog:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        fetchBlogs();
      }
    } catch (err) {
      console.error("Failed to delete blog:", err);
    }
  };

  const handleGenerateAI = async () => {
    if (!generatorPrompt) {
      setGenError("Please provide a prompt/topic for the AI.");
      return;
    }

    setGenerating(true);
    setGenError("");

    try {
      const res = await fetch("/api/blogs/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titlePrompt: generatorPrompt,
          category: generatorCategory,
          author: generatorAuthor
        })
      });

      const data = await res.json();
      if (data.success) {
        setTitle(data.title || generatorPrompt);
        setExcerpt(data.excerpt || "");
        setContent(data.content || "");
        setCategory(generatorCategory);
        setAuthor(generatorAuthor);
        setStatus("Draft");
        setImageUrl("https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=80&w=1200");
        
        setIsCreating(true);
        setShowGenerator(false);
      } else {
        setGenError(data.error || "Failed to generate blog with AI.");
      }
    } catch (err) {
      console.error("AI Generation failed:", err);
      setGenError("API request failed. Verify that DEEPSEEK_API_KEY is configured.");
    } finally {
      setGenerating(false);
    }
  };

  const cancelEdit = () => {
    setEditingBlog(null);
    setIsCreating(false);
    setShowGenerator(false);
    setGenError("");
    setGeneratorPrompt("");
  };

  return (
    <div className="space-y-6" id="admin-blogs-root">
      
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-stone-200">
        <div>
          <h3 className="text-2xl font-sans font-black text-neutral-950 uppercase tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-orange-500" />
            <span>Market Intelligence Blogs Hub</span>
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Manage, publish, and leverage DeepSeek AI models to auto-generate fully structured real estate investment reports.
          </p>
        </div>
        
        {!isCreating && !editingBlog && !showGenerator && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowGenerator(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Blog Generator</span>
            </button>
            <button
              onClick={startCreate}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Write Post</span>
            </button>
          </div>
        )}
      </div>

      {/* AI BLOG GENERATOR CARD PANEL */}
      {showGenerator && (
        <div className="bg-neutral-900 text-white rounded-3xl border border-neutral-800 p-6 sm:p-8 space-y-6" id="ai-generator-panel">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <strong className="text-sm font-black uppercase tracking-wider">DeepSeek AI Writer Agent</strong>
            </div>
            <button onClick={cancelEdit} className="text-neutral-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-mono font-bold uppercase text-neutral-400 mb-2">
                What topic or thesis would you like to explore?
              </label>
              <textarea
                rows={3}
                placeholder="e.g., Why Nairobi's Expressway nodes are yielding 12% in off-plan luxury duplexes..."
                value={generatorPrompt}
                onChange={(e) => setGeneratorPrompt(e.target.value)}
                className="w-full p-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-xs text-stone-200 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-neutral-400 mb-2">Category</label>
                <select
                  value={generatorCategory}
                  onChange={(e) => setGeneratorCategory(e.target.value)}
                  className="w-full p-3.5 bg-neutral-950 border border-neutral-800 rounded-2xl text-xs text-stone-200 focus:outline-none"
                >
                  <option>Market Insights</option>
                  <option>Investment Guides</option>
                  <option>Legal Compliance</option>
                  <option>Nairobi Development</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-neutral-400 mb-2">Author Name</label>
                <input
                  type="text"
                  value={generatorAuthor}
                  onChange={(e) => setGeneratorAuthor(e.target.value)}
                  className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded-2xl text-xs text-stone-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {genError && (
            <div className="p-4 bg-red-950/40 border border-red-900 rounded-2xl flex items-center gap-3 text-red-200 text-xs font-mono">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{genError}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              onClick={cancelEdit}
              className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-750 font-mono text-xs font-bold uppercase tracking-wider rounded-xl text-stone-300"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateAI}
              disabled={generating}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-neutral-950 font-mono text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Deep Report...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Draft with DeepSeek</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* BLOG EDITOR (CREATE OR EDIT FORM) */}
      {(isCreating || editingBlog) && (
        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6" id="blog-editor-form">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <strong className="text-sm font-bold uppercase tracking-wider text-stone-800">
              {editingBlog ? `Edit Post: ${editingBlog.title}` : "Write New Market Intelligence Post"}
            </strong>
            <button type="button" onClick={cancelEdit} className="text-stone-400 hover:text-stone-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-stone-500 mb-1.5">Article Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Unlocking 12.5% Yield on Kilimani Residential Towers"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-800 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-stone-500 mb-1.5">Short Excerpt (Meta Description)</label>
                <textarea
                  rows={2}
                  placeholder="A brief 1-2 sentence overview summarizing this investment report..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-800 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-stone-500 mb-1.5">Full Content (Markdown Supported)</label>
                <textarea
                  rows={14}
                  required
                  placeholder="### Market Intelligence Report... Use markdown headings, lists, and tables to write a premium report."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-4 bg-stone-50 border border-stone-200 rounded-2xl text-xs font-mono text-stone-800 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            <div className="md:col-span-4 space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-stone-500 mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-800 focus:outline-none"
                >
                  <option>Market Insights</option>
                  <option>Investment Guides</option>
                  <option>Legal Compliance</option>
                  <option>Nairobi Development</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-stone-500 mb-1.5">Author</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-stone-500 mb-1.5">Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-stone-500 mb-1.5">Publish Status</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus("Published")}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                      status === "Published"
                        ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 font-extrabold"
                        : "bg-stone-50 text-stone-400 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    Published
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("Draft")}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                      status === "Draft"
                        ? "bg-amber-500/10 text-amber-700 border-amber-500/20 font-extrabold"
                        : "bg-stone-50 text-stone-400 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    Draft
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-stone-100">
            <button
              type="button"
              onClick={cancelEdit}
              className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 font-mono text-xs font-bold uppercase tracking-wider rounded-xl text-stone-600"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-850 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save intelligence</span>
            </button>
          </div>
        </form>
      )}

      {/* BLOGS LIST TABLE / GRID */}
      {!isCreating && !editingBlog && !showGenerator && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
            <strong className="text-xs font-mono uppercase tracking-widest text-neutral-400">Published & Draft Ledger</strong>
            <span className="text-[10px] bg-stone-200 px-2.5 py-1 rounded-full font-mono text-stone-600 font-bold">
              Total: {blogs.length} Posts
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900"></div>
              <p className="mt-3 text-stone-500 font-mono text-[10px]">Fetching articles...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="p-12 text-center text-xs font-mono text-stone-400">
              No articles registered. Click "Write Post" or "AI Blog Generator" to initialize.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-100 border-b border-stone-200 text-[10px] font-mono uppercase tracking-wider text-stone-500">
                    <th className="p-4 pl-6">Title / Category</th>
                    <th className="p-4">Author</th>
                    <th className="p-4">Views</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-150">
                  {blogs.map((blog) => {
                    const isPublished = blog.status === "Published";
                    return (
                      <tr key={blog.id} className="text-xs text-stone-700 hover:bg-stone-50/50 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={blog.imageUrl}
                              alt={blog.title}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 object-cover rounded-lg border border-stone-200 shrink-0"
                            />
                            <div>
                              <strong className="text-stone-900 block font-sans font-semibold max-w-xs truncate">{blog.title}</strong>
                              <span className="text-[9px] font-mono text-stone-400 uppercase bg-stone-100 px-2 py-0.5 rounded-md mt-0.5 inline-block">
                                {blog.category}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-stone-800">{blog.author}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 font-mono text-stone-500">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{blog.views || 0}</span>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-[10px] text-stone-400">
                          {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                            isPublished
                              ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-700 border border-amber-500/20"
                          }`}>
                            {isPublished ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                <span>Published</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-3 h-3" />
                                <span>Draft</span>
                              </>
                            )}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => startEdit(blog)}
                              className="p-1.5 text-stone-500 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-all"
                              title="Edit Article"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(blog.id)}
                              className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all"
                              title="Delete Article"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
