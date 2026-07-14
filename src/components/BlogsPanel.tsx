import React, { useState, useEffect } from "react";
import { 
  Search, 
  Calendar, 
  User as UserIcon, 
  BookOpen, 
  Eye, 
  ArrowRight, 
  ArrowLeft,
  Tag, 
  TrendingUp, 
  Sparkles 
} from "lucide-react";
import ReactMarkdown from "react-markdown";

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

export default function BlogsPanel() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/blogs");
      const data = await res.json();
      if (data.success) {
        // Only display published blogs on public panel
        const published = (data.blogs || []).filter((b: BlogPost) => b.status === "Published");
        setBlogs(published);
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReadBlog = async (blog: BlogPost) => {
    setSelectedBlog(blog);
    // Track view in backend
    try {
      await fetch(`/api/blogs/${blog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ views: (blog.views || 0) + 1 })
      });
      // Update locally
      setBlogs(prev => prev.map(b => b.id === blog.id ? { ...b, views: (b.views || 0) + 1 } : b));
    } catch (err) {
      console.error("Error updating views:", err);
    }
  };

  const categories = ["All", ...Array.from(new Set(blogs.map(b => b.category)))];

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          blog.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredBlog = filteredBlogs[0];
  const regularBlogs = filteredBlogs.slice(1);

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12" id="blogs-header">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 text-white text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI-POWERED MARKET INTEGRATION</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-sans font-bold tracking-tight text-neutral-900 mb-4">
            Nairobi Real Estate Intelligence
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Deep analyses, expert developers reports, legal guidelines, and local growth patterns curated by our DeepSeek-powered PropSphere AI.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm" id="blogs-filters">
          {/* Category Pills */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? "bg-stone-900 text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search intelligence blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-stone-50 text-stone-800 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-900 text-xs transition-all"
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-stone-400" />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-stone-900"></div>
            <p className="mt-4 text-stone-500 font-mono text-xs">Loading market intelligence...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-sm">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stone-800">No Intelligence Blogs Found</h3>
            <p className="text-stone-500 text-sm mt-1">Try resetting your filter parameters or search queries.</p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Featured Blog Card (Only if no specific search/category filtering or if we have results) */}
            {featuredBlog && selectedCategory === "All" && searchQuery === "" && (
              <div 
                onClick={() => handleReadBlog(featuredBlog)}
                className="group bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer grid grid-cols-1 lg:grid-cols-12"
                id={`featured-blog-${featuredBlog.id}`}
              >
                <div className="lg:col-span-7 relative h-64 sm:h-96 lg:h-full min-h-[300px]">
                  <img
                    src={featuredBlog.imageUrl}
                    alt={featuredBlog.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-stone-950/90 backdrop-blur-md text-white text-[10px] font-mono px-3 py-1 rounded-full flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                    <span>FEATURED REPORT</span>
                  </div>
                </div>

                <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-xs font-mono text-amber-700 tracking-wider uppercase font-bold bg-amber-50 px-2.5 py-1 rounded-lg">
                      {featuredBlog.category}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-sans font-bold text-stone-900 group-hover:text-amber-800 transition-colors leading-tight">
                      {featuredBlog.title}
                    </h2>
                    <p className="text-stone-600 text-sm leading-relaxed">
                      {featuredBlog.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-stone-100 flex items-center justify-between mt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center border border-stone-200">
                        <UserIcon className="w-4 h-4 text-stone-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-stone-800">{featuredBlog.author}</p>
                        <p className="text-[10px] text-stone-400 font-mono">
                          {new Date(featuredBlog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-stone-500 text-xs font-mono">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{featuredBlog.views || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Blogs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="blogs-grid">
              {(selectedCategory !== "All" || searchQuery !== "" ? filteredBlogs : regularBlogs).map((blog) => (
                <div
                  key={blog.id}
                  onClick={() => handleReadBlog(blog)}
                  className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                  id={`blog-card-${blog.id}`}
                >
                  <div>
                    <div className="relative h-48 overflow-hidden bg-stone-100">
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-stone-900 text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-stone-200/50">
                        {blog.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="text-base font-bold text-stone-900 line-clamp-2 group-hover:text-amber-800 transition-colors leading-snug">
                        {blog.title}
                      </h3>
                      <p className="text-stone-500 text-xs line-clamp-3 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-stone-700">{blog.author}</span>
                      <span className="text-stone-300">•</span>
                      <span className="text-[9px] text-stone-400 font-mono">
                        {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-stone-400 text-[10px] font-mono">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {blog.views || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ================================== DEEP READ DETAIL MODAL ================================== */}
        {selectedBlog && (
          <div className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
              
              {/* Header Bar */}
              <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="flex items-center gap-2 text-xs font-mono text-stone-300 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Intelligence</span>
                </button>
                <div className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                  DeepSeek AI Verified
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6">
                
                {/* Meta details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-amber-700 tracking-wider uppercase font-bold bg-amber-50 px-2.5 py-1 rounded-lg">
                      {selectedBlog.category}
                    </span>
                    <span className="text-stone-300 font-mono text-xs">|</span>
                    <span className="text-xs font-mono text-stone-500">
                      Published: {new Date(selectedBlog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-sans font-bold text-stone-900 leading-tight">
                    {selectedBlog.title}
                  </h1>

                  <div className="flex items-center gap-4 py-3 border-y border-stone-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center border border-stone-200">
                        <UserIcon className="w-4 h-4 text-stone-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-800">{selectedBlog.author}</p>
                        <p className="text-[9px] text-stone-400 font-mono">Expert Analyst</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 ml-auto text-stone-500 text-xs font-mono">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{selectedBlog.views} views</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main image */}
                <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden bg-stone-100 relative">
                  <img
                    src={selectedBlog.imageUrl}
                    alt={selectedBlog.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Excerpt */}
                <p className="text-stone-600 italic text-base border-l-4 border-amber-600 pl-4 font-serif leading-relaxed">
                  "{selectedBlog.excerpt}"
                </p>

                {/* Blog content parsed via ReactMarkdown */}
                <div className="prose prose-stone prose-sm sm:prose max-w-none text-stone-800 leading-relaxed space-y-4">
                  <div className="markdown-body">
                    <ReactMarkdown>{selectedBlog.content}</ReactMarkdown>
                  </div>
                </div>

              </div>

              {/* Sticky Footer Action */}
              <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex items-center justify-end gap-3 shrink-0">
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-medium text-xs hover:bg-stone-800 transition-colors shadow-sm"
                >
                  Close Reader
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
