import React, { useEffect, useState } from 'react';
import { Search, Mail, X, Calendar, User, ArrowRight } from 'lucide-react';
import LazyImage from '../../components/common/LazyMedia/LazyImage';
import axios from 'axios';
import Swal from 'sweetalert2';

const formatBlogContent = (html) => {
  if (!html) return '';
  return html
    // Strip all inline color properties (e.g. color:#000000 from Google Docs/Word)
    .replace(/color\s*:\s*[^;"]+;?/gi, '')
    // Strip inline background-color properties
    .replace(/background-color\s*:\s*[^;"]+;?/gi, '')
    // Strip inline font-family (Calibri, Arial, etc.) so site font is used
    .replace(/font-family\s*:\s*[^;"]+;?/gi, '')
    // Strip white-space: pre / pre-wrap that causes overflow
    .replace(/white-space\s*:\s*pre[^;"]*;?/gi, '')
    // Strip inline line-height
    .replace(/line-height\s*:\s*[^;"]+;?/gi, '')
    // Clean up empty style attributes
    .replace(/style="\s*"/gi, '')
    // Remove Apple / Google Docs junk tags
    .replace(/<br class="Apple-interchange-newline">/gi, '')
    .replace(/id="docs-internal-guid-[^"]*"/gi, '');
};

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [artisans, setArtisans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/submissions/newsletter`, { email });
      Swal.fire({
        title: 'Subscribed!',
        text: 'Thank you for subscribing to our newsletter.',
        icon: 'success',
        background: '#1C1713',
        color: '#fff',
        confirmButtonColor: '#c8956c'
      });
      setEmail('');
    } catch (error) {
      if (error.response?.data?.message?.includes('duplicate key') || error.response?.data?.message?.includes('E11000')) {
        Swal.fire({
          title: 'Already Subscribed',
          text: 'This email is already in our newsletter list.',
          icon: 'info',
          background: '#1C1713',
          color: '#fff',
          confirmButtonColor: '#c8956c'
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Failed to subscribe. Please try again.',
          icon: 'error',
          background: '#1C1713',
          color: '#fff',
          confirmButtonColor: '#c8956c'
        });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fetch blogs
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/blogs`)
      .then(res => setBlogs(res.data))
      .catch(err => console.error(err));
      
    // Fetch artisans
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/artisans`)
      .then(res => setArtisans(res.data))
      .catch(err => console.error(err));
      
    // Fetch categories
    axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/blog-categories`)
      .then(res => setCategories(res.data.map(c => c.name)))
      .catch(err => console.error(err));
  }, []);

  const [activeTab, setActiveTab] = useState('All Posts');

  const topics = ['All Posts', ...categories];

  const subTopics = [
    'Latest Blogs',
    'Recommended Blogs',
    'Woven Stories'
  ];


  return (
    <div className="font-sans text-[var(--hww-dark)] bg-[#15110F] overflow-x-hidden">
      {/* Hero Section */}
      <section className="text-white pt-[120px] px-5 pb-[60px] text-center relative">
        <div className="max-w-[800px] mx-auto relative z-10" data-aos="fade-up">
          <h1 className="font-serif text-[3.5rem] font-normal text-white mb-[30px] leading-[1.2]">Hieil <span className="text-[var(--color-brand-base)]">Insights</span></h1>
          <div className="flex max-w-[500px] mx-auto bg-[rgba(28,23,19,0.6)] backdrop-blur-[10px] border border-[#4a3e35] rounded-[30px] p-[5px_5px_5px_25px] transition-all duration-300 focus-within:border-[#c8956c] focus-within:shadow-[0_0_20px_rgba(194,163,115,0.1)] flex-col md:flex-row gap-[15px] md:gap-0 bg-transparent md:bg-[rgba(28,23,19,0.6)] rounded-none md:rounded-[30px] p-0 md:p-[5px_5px_5px_25px] border-none md:border md:border-[#4a3e35]">
            <input type="text" placeholder="Search Topics..." className="flex-grow border-none outline-none text-[1rem] text-white bg-[rgba(28,23,19,0.6)] md:bg-transparent rounded-[30px] md:rounded-none p-[15px_25px] md:p-0 w-full md:w-auto border md:border-none border-[#4a3e35]" />
            <button className="bg-[#c8956c] md:bg-transparent border border-[#c8956c] md:border-none text-[#15110F] md:text-[#c8956c] p-[15px_30px] md:p-[10px_15px] flex items-center justify-center rounded-[25px] md:rounded-full transition-all duration-300 cursor-pointer w-full md:w-auto uppercase tracking-[2px] font-semibold md:font-normal text-[12px] md:text-[inherit] hover:bg-transparent hover:text-[#c8956c] md:hover:bg-[rgba(194,163,115,0.1)] md:hover:text-[#e6c89c]"><Search size={20} className="hidden md:block" /><span className="md:hidden">Search</span></button>
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section className="py-[60px] bg-[#15110F]">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="flex items-center gap-[20px] mb-[30px] flex-wrap md:flex-row flex-col md:items-center items-start" data-aos="fade-up">
            <h3 className="text-[1.2rem] text-white font-semibold m-0">Explore Topics:</h3>
            <div className="flex gap-[15px] flex-wrap">
              {topics.map((topic, index) => (
                <button 
                  key={index} 
                  className={`bg-transparent border border-[#4a3e35] text-[#c8956c] p-[10px_25px] text-[12px] tracking-[2px] uppercase transition-all duration-300 font-medium cursor-pointer rounded-[30px] hover:bg-[rgba(194,163,115,0.1)] hover:text-[#c8956c] hover:border-[#c8956c] hover:shadow-[0_0_15px_rgba(194,163,115,0.2)] ${activeTab === topic ? 'bg-[rgba(194,163,115,0.1)] !text-[#c8956c] border-[#c8956c] shadow-[0_0_15px_rgba(194,163,115,0.2)]' : ''}`}
                  onClick={() => setActiveTab(topic)}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-[15px] mb-[40px] flex-wrap" data-aos="fade-up" data-aos-delay="100">
            {subTopics.map((sub, index) => (
              <button key={index} className="bg-transparent border-none text-[#8c8279] p-[8px_15px] text-[13px] tracking-[1px] uppercase transition-all duration-300 font-medium cursor-pointer relative hover:text-[#c8956c]">{sub}</button>
            ))}
          </div>

          {blogs.length === 0 ? (
            <div className="bg-[rgba(28,23,19,0.6)] backdrop-blur-[10px] rounded-[20px] p-[100px_20px] text-center border border-[#2c241c]" data-aos="fade-in" data-aos-delay="200">
              <div className="">
                <p className="text-[#b5aaa0] text-[1.2rem] font-normal tracking-[1px]">No Articles Found In This Collection.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-aos="fade-up" data-aos-delay="200">
              {blogs.filter(b => activeTab === 'All Posts' || (b.category && b.category.trim().toLowerCase() === activeTab.trim().toLowerCase())).map(blog => (
                <div 
                  key={blog._id} 
                  onClick={() => setSelectedBlog(blog)}
                  className="group bg-[rgba(28,23,19,0.6)] backdrop-blur-[10px] border border-[#2c241c] rounded-[20px] overflow-hidden transition-all duration-400 hover:border-[#c8956c] hover:-translate-y-[5px] cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="h-[240px] overflow-hidden">
                      <LazyImage src={blog.image || '/blog1.png'} alt={blog.title} className="w-full h-full [&>img]:object-cover [&>img]:transition-transform [&>img]:duration-400 group-hover:[&>img]:scale-105" />
                    </div>
                    <div className="p-[25px]">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[#c8956c] font-sans text-[0.7rem] tracking-[2px] uppercase block">{blog.tag || blog.category}</span>
                        {blog.createdAt && (
                          <span className="text-gray-400 text-[0.75rem]">
                            {new Date(blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                      <h4 className="font-serif text-[1.3rem] text-white mb-[15px] group-hover:text-[#c8956c] transition-colors">{blog.title}</h4>
                      <p className="text-[#b5aaa0] text-[0.95rem] leading-[1.6] line-clamp-3">{blog.description}</p>
                    </div>
                  </div>
                  <div className="px-[25px] pb-[25px] pt-0">
                    <span className="text-[#c8956c] text-[0.85rem] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Read Full Article <ArrowRight size={15} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Artisans Section */}
      <section className="py-[80px] bg-[#15110F]">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-[60px]" data-aos="fade-up">
            <h2 className="font-serif text-[2.5rem] font-normal text-white mb-[15px]">Meet <br /> <span className="text-[var(--color-brand-base)]">Our Artisans</span></h2>
            <p className="text-[1.1rem] text-[#b5aaa0] leading-[1.6] max-w-[600px] mx-auto">Authentic videos showcasing the skill, dedication, and stories behind our master craftsmen.</p>
            <h3 className="text-[1.1rem] text-[var(--color-brand-base)] mt-[30px] font-semibold">The Hands Behind Our Crafts</h3>
          </div>

          <div className="flex flex-col gap-[60px] mt-[50px]">
            {artisans.map((artisan, index) => {
              const textParts = artisan.text ? artisan.text.split('\n\n') : [];
              return (
              <div className="flex flex-col lg:flex-row bg-[rgba(28,23,19,0.6)] backdrop-blur-[10px] border border-[#2c241c] rounded-[20px] overflow-hidden transition-all duration-400 hover:border-[#4a3e35] hover:-translate-y-[5px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] group" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="flex-[0_0_45%] relative min-h-[300px] lg:min-h-[400px] overflow-hidden bg-[#3e332a]">
                  {/* Using an image to showcase the artisan */}
                  <LazyImage src={artisan.preview || '/artisan1.png'} alt={artisan.title} className="w-full h-full [&>img]:object-cover absolute top-0 left-0 [&>img]:transition-transform [&>img]:duration-400 [&>img]:opacity-80 group-hover:[&>img]:scale-105" />
                  <span className="absolute top-[20px] left-[20px] bg-[var(--color-brand-base)] text-white p-[6px_15px] rounded-[20px] text-[0.8rem] font-semibold tracking-[1px] uppercase">Artisan Work</span>
                </div>
                <div className="p-[30px_20px] lg:p-[50px_40px] flex-1">
                  <span className="text-[#c8956c] font-normal text-[1rem] mb-[10px] block">{artisan.description}</span>
                  <h3 className="font-serif text-[1.6rem] lg:text-[2.2rem] text-white mb-[25px]">{artisan.title}</h3>
                  <div className="">
                    {textParts.map((para, i) => (
                      <p className="text-[#b5aaa0] leading-[1.8] mb-[15px] text-[1rem] last:mb-0" key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="pt-[80px] pb-[120px] bg-[#15110F]">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="bg-[rgba(28,23,19,0.6)] backdrop-blur-[10px] border border-[#c8956c] rounded-[30px] p-[40px_20px] lg:p-[60px] flex flex-col lg:flex-row items-center justify-between gap-[40px] text-white shadow-[0_10px_40px_rgba(194,163,115,0.05)] text-center lg:text-left" data-aos="zoom-in">
            <div className="flex-1">
              <h2 className="font-serif text-[2.5rem] mb-[15px]">Get <br /> <span className="text-[var(--color-brand-base)]">Importer-Focused Insights</span></h2>
              <p className="text-[1.05rem] text-[#b5aaa0] leading-[1.7] max-w-[500px] mx-auto lg:mx-0">Subscribe to receive exclusive guides, market intelligence, and early access to new artisan collections curated for international buyers.</p>
            </div>
            <div className="flex-1 w-full lg:w-[450px] lg:max-w-[500px] max-w-[500px]">
              <form onSubmit={handleSubscribe} className="flex flex-col lg:flex-row items-center bg-transparent lg:bg-[rgba(21,17,15,0.8)] border-none lg:border lg:border-[#4a3e35] rounded-none lg:rounded-[30px] p-0 lg:p-[5px_7px] mb-[15px] transition-all duration-300 focus-within:border-[#c8956c] gap-[15px] lg:gap-0">
                <Mail size={20} className="text-[#8c8279] ml-[20px] hidden lg:block" />
                <input 
                  type="email" 
                  placeholder="Enter your business email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-grow border-none outline-none p-[15px_25px] lg:p-[15px] text-[1rem] text-white bg-[rgba(21,17,15,0.8)] lg:bg-transparent w-full lg:w-auto rounded-[30px] lg:rounded-none border lg:border-none border-[#4a3e35]" 
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-[#c8956c] border border-[#c8956c] text-[#15110F] rounded-[25px] p-[15px_30px] text-[12px] tracking-[2px] uppercase transition-all duration-300 font-semibold cursor-pointer w-full lg:w-auto hover:bg-transparent hover:text-[#c8956c] disabled:opacity-50"
                >
                  {loading ? 'WAIT...' : 'Subscribe'}
                </button>
              </form>
              <p className="text-[0.85rem] opacity-70 text-center">We respect your privacy. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Article Reader Modal */}
      {selectedBlog && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedBlog(null)}
        >
          <div 
            className="bg-[#1C1713] border border-[#3e3228] w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-y-auto shadow-2xl relative flex flex-col text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#1C1713]/95 backdrop-blur border-b border-[#2c241c]">
              <div className="flex items-center gap-3">
                <span className="bg-[#c8956c]/20 text-[#c8956c] border border-[#c8956c]/40 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-medium">
                  {selectedBlog.category || 'Article'}
                </span>
                {selectedBlog.createdAt && (
                  <span className="text-xs text-[#b5aaa0] flex items-center gap-1.5">
                    <Calendar size={13} className="text-[#c8956c]" /> {new Date(selectedBlog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
              <button 
                onClick={() => setSelectedBlog(null)}
                className="w-9 h-9 rounded-full bg-[#2c241c] hover:bg-[#3e3228] text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-10 space-y-6">
              <h1 className="font-serif text-2xl md:text-4xl text-white leading-tight">
                {selectedBlog.title}
              </h1>

              {selectedBlog.image && (
                <div className="w-full max-h-[420px] rounded-xl overflow-hidden border border-[#2c241c]">
                  <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" />
                </div>
              )}

              {selectedBlog.description && (
                <div className="p-4 rounded-xl bg-[rgba(200,149,108,0.08)] border-l-4 border-[#c8956c] text-[#f3ede6] italic text-base leading-relaxed">
                  {selectedBlog.description}
                </div>
              )}

              {selectedBlog.content ? (
                <div 
                  className="blog-article-content max-w-none text-[#f3ede6] leading-relaxed space-y-4"
                  dangerouslySetInnerHTML={{ __html: formatBlogContent(selectedBlog.content) }}
                />
              ) : (
                <p className="text-gray-400">Full article content not available.</p>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-[#161210] border-t border-[#2c241c] flex items-center justify-between">
              <span className="text-xs text-[#b5aaa0]">Hind Import Export International (HIEIL)</span>
              <button 
                onClick={() => setSelectedBlog(null)}
                className="px-6 py-2 rounded-lg bg-[#c8956c] hover:bg-[#b07d56] text-[#15110F] font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
