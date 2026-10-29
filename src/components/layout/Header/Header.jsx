import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronUp, ChevronRight, User, FileText, CheckSquare, Square, Lock, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { HEADER_LINKS } from '../../../constants/navigation';
import api from '../../../config/api';
import Swal from 'sweetalert2';
import GoogleTranslate from '../../common/GoogleTranslate/GoogleTranslate';


const AVAILABLE_CATALOGUES = [
  {
    id: 'blue-pottery',
    title: 'Handcrafted Blue Pottery',
    badge: 'Blue Pottery',
    subtitle: 'Jaipur traditional ceramic art, tiles, vases, dinnerware & planters',
    file: 'HIEIL_Blue_Pottery_Catalogue.pdf'
  },
  {
    id: 'clocks',
    title: 'Luxury Handcrafted Clocks',
    badge: 'Clocks',
    subtitle: 'Artisanal antique & contemporary wall, table & grandfather timepieces',
    file: 'HIEIL_Handcrafted_Clock_Catalogue.pdf'
  },
  {
    id: 'metal',
    title: 'Handcrafted Metal Art & Decor',
    badge: 'Metal Art',
    subtitle: 'Brass, bell metal, iron sculptures, lanterns, hardware & accents',
    file: 'HIEIL_Handcrafted_Metal_Catalogue.pdf'
  },
  {
    id: 'stone',
    title: 'Handcrafted Natural Stone Decor',
    badge: 'Stone Decor',
    subtitle: 'Marble inlay, soapstone, sandstone carving & architectural decor',
    file: 'HIEIL_Handcrafted_Stone_Catalogue.pdf'
  },
  {
    id: 'wood',
    title: 'Handcrafted Woodcraft & Furniture',
    badge: 'Woodcraft',
    subtitle: 'Sheesham, mango wood carvings, carved panels & artisan furniture',
    file: 'HIEIL_Handcrafted_Wood_Catalogue.pdf'
  }
];

const Header = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);
  const [openMobileSubDropdown, setOpenMobileSubDropdown] = useState(null);
  
  const [productCategories, setProductCategories] = useState([]);
  const [productSubcategories, setProductSubcategories] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const navigate = useNavigate();

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quoteName, setQuoteName] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [selectedCatalogues, setSelectedCatalogues] = useState(AVAILABLE_CATALOGUES.map(c => c.id));
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      if (!quoteEmail && user.email) setQuoteEmail(user.email);
      if (!quoteName && user.name) setQuoteName(user.name);
      if (!quotePhone && user.phone) setQuotePhone(user.phone);
    }
  }, [user]);

  useEffect(() => {
    const handleOpenModal = () => {
      if (user) {
        setQuoteEmail(user.email || '');
        setQuoteName(user.name || '');
        setQuotePhone(user.phone || '');
      }
      setIsQuoteModalOpen(true);
    };
    window.addEventListener('open-catalogue-modal', handleOpenModal);
    window.addEventListener('open-quote-modal', handleOpenModal);
    return () => {
      window.removeEventListener('open-catalogue-modal', handleOpenModal);
      window.removeEventListener('open-quote-modal', handleOpenModal);
    };
  }, [user]);

  const toggleCatalogue = (id) => {
    if (selectedCatalogues.includes(id)) {
      setSelectedCatalogues(selectedCatalogues.filter(item => item !== id));
    } else {
      setSelectedCatalogues([...selectedCatalogues, id]);
    }
  };

  const toggleSelectAllCatalogues = () => {
    if (selectedCatalogues.length === AVAILABLE_CATALOGUES.length) {
      setSelectedCatalogues([]);
    } else {
      setSelectedCatalogues(AVAILABLE_CATALOGUES.map(c => c.id));
    }
  };

  const handleOpenQuoteModal = () => {
    if (user) {
      setQuoteEmail(user.email || '');
      setQuoteName(user.name || '');
      setQuotePhone(user.phone || '');
    }
    if (selectedCatalogues.length === 0) {
      setSelectedCatalogues(AVAILABLE_CATALOGUES.map(c => c.id));
    }
    setIsQuoteModalOpen(true);
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    if (!quoteEmail) {
      Swal.fire({
        title: 'Email Required',
        text: 'Please enter your email address to receive catalogue access.',
        icon: 'warning',
        confirmButtonColor: '#c8956c',
        background: '#110e0c',
        color: '#fff'
      });
      return;
    }
    if (selectedCatalogues.length === 0) {
      Swal.fire({
        title: 'Select Catalogues',
        text: 'Please select at least one catalogue topic to proceed.',
        icon: 'warning',
        confirmButtonColor: '#c8956c',
        background: '#110e0c',
        color: '#fff'
      });
      return;
    }

    setQuoteSubmitting(true);
    try {
      const chosenCatalogues = AVAILABLE_CATALOGUES.filter(c => selectedCatalogues.includes(c.id));
      await api.post('/catalogue-requests', {
        email: quoteEmail.trim().toLowerCase(),
        name: quoteName.trim(),
        phone: quotePhone.trim(),
        catalogues: chosenCatalogues,
        userId: user ? user.id : undefined
      });

      setIsQuoteModalOpen(false);

      Swal.fire({
        title: 'Request Submitted!',
        html: `
          <div style="text-align: left; font-size: 14px; line-height: 1.6; color: #ece6dc;">
            <p style="margin-bottom: 12px;">Your request for <strong>${chosenCatalogues.length} catalogue(s)</strong> has been successfully submitted to our export team.</p>
            <div style="background: rgba(200,149,108,0.1); border: 1px solid rgba(200,149,108,0.3); padding: 12px; border-radius: 6px; margin-bottom: 12px;">
              <p style="margin: 0; color: #c8956c; font-size: 13px; font-weight: bold;">🔒 Admin Verification Required:</p>
              <p style="margin: 4px 0 0; font-size: 13px; color: #a39a8c;">To protect manufacturer pricing, catalogues remain locked until verified by admin. Once approved, the PDF files will be immediately unlocked in your <strong>Account Dashboard</strong>.</p>
            </div>
            ${!user ? '<p style="font-size: 12px; color: #9ca3af; margin: 0;">💡 Log in or register with <strong>' + quoteEmail + '</strong> to access your catalogues once approved.</p>' : ''}
          </div>
        `,
        icon: 'success',
        confirmButtonColor: '#c8956c',
        confirmButtonText: user ? 'Go to My Catalogues' : 'OK, Got It',
        showCancelButton: Boolean(user),
        cancelButtonText: 'Stay on Page',
        cancelButtonColor: '#4b5563',
        background: '#110e0c',
        color: '#fff'
      }).then((result) => {
        if (result.isConfirmed && user) {
          navigate('/account');
        }
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'Failed to submit catalogue request',
        icon: 'error',
        confirmButtonColor: '#c8956c',
        background: '#110e0c',
        color: '#fff'
      });
    } finally {
      setQuoteSubmitting(false);
    }
  };

  useEffect(() => {
    // Fetch Categories
    api.get('/categories').then(res => {
      if (res.data) {
        setProductCategories(res.data);
        if (res.data.length > 0) {
          setHoveredCategory(res.data[0].name);
        }
      }
    }).catch(err => console.error(err));

    // Fetch Subcategories
    api.get('/subcategories').then(res => {
      if (res.data) {
          // Filter for unique subcategory names
          const uniqueSubcategories = [];
          const seenNames = new Set();
          
          res.data.forEach(sub => {
            const name = sub.subcategoryName || sub.name || '';
            const cleanName = typeof name === 'string' ? name.replace(/<[^>]*>?/gm, '').trim() : name;
            const uniqueKey = (sub.category || '') + '_' + cleanName.toLowerCase();
            
            if (cleanName !== '' && !seenNames.has(uniqueKey)) {
              seenNames.add(uniqueKey);
              uniqueSubcategories.push({ ...sub, subcategoryName: cleanName, name: cleanName });
            }
          });
          
          setProductSubcategories(uniqueSubcategories);
      }
    }).catch(err => console.error(err));
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenMobileDropdown(null);
    setOpenMobileSubDropdown(null);
  };

  const toggleMobileDropdown = (e, label) => {
    e.preventDefault();
    setOpenMobileDropdown(openMobileDropdown === label ? null : label);
    if (openMobileDropdown !== label) {
      setOpenMobileSubDropdown(null);
    }
  };

  const toggleMobileSubDropdown = (e, label) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMobileSubDropdown(openMobileSubDropdown === label ? null : label);
  };

  return (
    <header className="bg-[#15110F] flex justify-between items-center px-4 sm:px-6 xl:px-8 2xl:px-12 h-[70px] sm:h-[85px] font-sans border-b border-white/5 sticky top-0 z-50 w-full max-w-full box-border">
      <Link to="/" className="flex items-center gap-3 sm:gap-4 no-underline group shrink-0 mr-2 xl:mr-5">
        <img src="/logo.png" alt="HIEIL Logo" className="w-8 h-8 sm:w-10 sm:h-10 stroke-[#c8956c] stroke-1 fill-none" />
        <span className="text-[18px] sm:text-[20px] 2xl:text-[22px] tracking-[3px] 2xl:tracking-[4px] font-light text-white font-serif shrink-0 whitespace-nowrap">HIEIL</span>
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden xl:flex gap-1 2xl:gap-3.5 h-full items-center shrink-0">
        {HEADER_LINKS.map((link) => {
          if (link.label === 'PRODUCTS') {
            return (
              <div key={link.label} className="relative h-full flex items-center group">
                <Link to={link.href} className="text-[#b5aaa0] no-underline text-[11px] 2xl:text-[12px] tracking-[0.5px] 2xl:tracking-[1.2px] font-medium transition-colors duration-300 uppercase flex items-center gap-1 px-1.5 py-1.5 2xl:px-2.5 2xl:py-2 group-hover:text-[#c8956c] whitespace-nowrap">
                  {link.label}
                  <ChevronDown size={14} className="-mt-[1px]" />
                </Link>
                
                {/* Mega Menu Dropdown */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-2.5 bg-[#15110F]/98 backdrop-blur-md border border-[#2c241c] w-[600px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] opacity-0 invisible transition-all duration-300 z-50 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 flex h-[350px]">
                  
                  {/* Left Pane - Categories */}
                  <div className="w-1/2 border-r border-[#2c241c] py-4 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#4a3e35] [&::-webkit-scrollbar-track]:bg-transparent">
                    {productCategories.map((cat) => (
                      <div 
                        key={cat._id || cat.name}
                        className={`px-6 py-3 text-[12px] tracking-[1.5px] uppercase transition-all duration-300 cursor-pointer flex justify-between items-center ${hoveredCategory === cat.name ? 'text-[#c8956c] bg-[#c2a373]/5 pl-7' : 'text-[#b5aaa0] hover:text-[#c8956c] hover:bg-[#c2a373]/5 hover:pl-7'}`}
                        onMouseEnter={() => setHoveredCategory(cat.name)}
                        onClick={() => navigate(`/shop?category=${encodeURIComponent(cat.name)}`)}
                      >
                        {cat.name}
                        <ChevronRight size={14} className={`transition-opacity ${hoveredCategory === cat.name ? 'opacity-100' : 'opacity-0'}`} />
                      </div>
                    ))}
                  </div>

                  {/* Right Pane - Subcategories */}
                  <div className="w-1/2 py-4 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#4a3e35] [&::-webkit-scrollbar-track]:bg-transparent">
                    {hoveredCategory && (
                      <Link 
                        to={`/products?category=${encodeURIComponent(hoveredCategory)}`}
                        className="block px-6 py-2.5 text-[#c8956c] font-semibold no-underline text-[12px] tracking-[1px] uppercase transition-all duration-300 whitespace-nowrap hover:bg-[#c2a373]/10 hover:pl-7 border-b border-[#2c241c] mb-2 pb-3"
                      >
                        View All {hoveredCategory}
                      </Link>
                    )}
                    
                    {productSubcategories
                        .filter(sub => sub.category === hoveredCategory)
                        .map(sub => (
                        <Link 
                          key={sub._id || sub.subcategoryName}
                          to={`/products?category=${encodeURIComponent(hoveredCategory)}&subcategory=${encodeURIComponent(sub.subcategoryName)}`}
                          className="block px-6 py-2.5 text-[#8c8279] no-underline text-[12px] tracking-[1px] uppercase transition-all duration-300 whitespace-nowrap hover:text-[#c8956c] hover:bg-[#c2a373]/5 hover:pl-7"
                        >
                          {sub.subcategoryName}
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={link.label} className="relative h-full flex items-center group">
              {link.hasDropdown ? (
                <>
                  <Link to={link.href} className="text-[#b5aaa0] no-underline text-[11px] 2xl:text-[12px] tracking-[0.5px] 2xl:tracking-[1.2px] font-medium transition-colors duration-300 uppercase flex items-center gap-1 px-1.5 py-1.5 2xl:px-2.5 2xl:py-2 group-hover:text-[#c8956c] whitespace-nowrap">
                    {link.label}
                    <ChevronDown size={14} className="-mt-[1px]" />
                  </Link>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-2.5 bg-[#15110F]/98 backdrop-blur-md border border-[#2c241c] min-w-[250px] py-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] opacity-0 invisible transition-all duration-300 z-50 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                    {link.dropdownItems.map((item) => (
                      <Link key={item.label} to={item.href} className="block px-6 py-2.5 text-[#b5aaa0] no-underline text-[12px] tracking-[1.5px] uppercase transition-all duration-300 whitespace-nowrap hover:text-[#c8956c] hover:bg-[#c2a373]/5 hover:pl-7">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link to={link.href} className="text-[#b5aaa0] no-underline text-[11px] 2xl:text-[12px] tracking-[0.5px] 2xl:tracking-[1.2px] font-medium transition-colors duration-300 uppercase flex items-center gap-1 px-1.5 py-1.5 2xl:px-2.5 2xl:py-2 hover:text-[#c8956c] whitespace-nowrap">
                  {link.label}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      <div className="flex items-center gap-1.5 sm:gap-2.5 2xl:gap-3 shrink-0 ml-auto xl:ml-0">
        <GoogleTranslate />
        <Link 
          to="/account" 
          className="hidden sm:flex items-center justify-center border border-[#c8956c] text-[#c8956c] w-8 h-8 2xl:w-9 2xl:h-9 rounded-full hover:bg-[#c8956c] hover:text-[#110e0c] transition-all shrink-0" 
          title={user ? `Account (${user.name})` : 'Account / Login'}
          aria-label="Account"
        >
          <User size={16} />
        </Link>
        <Link to="/subscription" className="hidden xl:flex items-center justify-center border border-[#c8956c] text-[#c8956c] py-1.5 px-3 2xl:py-2.5 2xl:px-4 text-[11px] 2xl:text-[12px] tracking-[1px] 2xl:tracking-[2px] cursor-pointer uppercase font-bold transition-all duration-300 hover:bg-[#c8956c] hover:text-[#110e0c] shrink-0 whitespace-nowrap">SUBSCRIPTION</Link>
        <button className="hidden sm:block bg-[#c8956c] text-[#110e0c] border border-[#c8956c] py-1.5 px-3.5 2xl:py-2.5 2xl:px-6 text-[11px] 2xl:text-[12px] tracking-[1px] 2xl:tracking-[2px] cursor-pointer uppercase font-bold transition-all duration-300 hover:bg-transparent hover:text-[#c8956c] shrink-0 whitespace-nowrap" onClick={handleOpenQuoteModal}>GET QUOTE</button>
        <button className="block xl:hidden bg-transparent border-none text-[#c8956c] cursor-pointer p-1 shrink-0 ml-1" onClick={toggleMobileMenu} aria-label="Toggle menu">
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {isMobileMenuOpen && (
        <div className="block xl:hidden absolute top-[70px] sm:top-[85px] left-0 right-0 bg-[#110e0c] px-5 py-5 pb-8 sm:px-[30px] sm:py-[20px] sm:pb-[40px] border-b border-white/5 z-40 shadow-[0_4px_20px_rgba(0,0,0,0.5)] h-[calc(100vh-70px)] sm:h-[calc(100vh-85px)] overflow-y-auto">
          <div className="flex flex-col gap-2.5">
            {HEADER_LINKS.map((link) => (
              <div key={link.label} className="flex flex-col">
                {link.label === 'PRODUCTS' ? (
                  <>
                    <div 
                      className="text-[#b5aaa0] no-underline text-[14px] tracking-[2px] font-medium uppercase transition-colors duration-300 py-2.5 flex justify-between items-center cursor-pointer hover:text-[#c8956c]" 
                      onClick={(e) => toggleMobileDropdown(e, link.label)}
                    >
                      {link.label}
                      {openMobileDropdown === link.label ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                    {openMobileDropdown === link.label && (
                      <div className="flex flex-col pl-5 border-l border-[#2c241c] mt-1 mb-2.5 ml-2.5">
                        {productCategories.map((cat) => (
                          <div key={cat._id || cat.name} className="flex flex-col">
                            <div 
                              className="text-[#8c8279] no-underline text-[12px] tracking-[1px] py-2.5 uppercase transition-colors duration-300 flex justify-between items-center cursor-pointer hover:text-[#c8956c]"
                              onClick={(e) => toggleMobileSubDropdown(e, cat.name)}
                            >
                              {cat.name}
                              {openMobileSubDropdown === cat.name ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                            {openMobileSubDropdown === cat.name && (
                              <div className="flex flex-col pl-4 border-l border-[#2c241c] mt-1 mb-1 ml-2">
                                <Link 
                                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                                  className="text-[#c8956c] font-semibold no-underline text-[11px] tracking-[1px] py-2 uppercase transition-colors duration-300"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  View All {cat.name}
                                </Link>
                                {productSubcategories
                                  .filter(sub => sub.category === cat.name)
                                  .map(sub => (
                                    <Link 
                                      key={sub._id || sub.subcategoryName}
                                      to={`/products?category=${encodeURIComponent(cat.name)}&subcategory=${encodeURIComponent(sub.subcategoryName)}`}
                                      className="text-[#70665d] no-underline text-[11px] tracking-[1px] py-2 uppercase transition-colors duration-300 hover:text-[#c8956c]"
                                      onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                      {sub.subcategoryName}
                                    </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : link.hasDropdown ? (
                  <>
                    <div 
                      className="text-[#b5aaa0] no-underline text-[14px] tracking-[2px] font-medium uppercase transition-colors duration-300 py-2.5 flex justify-between items-center cursor-pointer hover:text-[#c8956c]" 
                      onClick={(e) => toggleMobileDropdown(e, link.label)}
                    >
                      {link.label}
                      {openMobileDropdown === link.label ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                    {openMobileDropdown === link.label && (
                      <div className="flex flex-col pl-5 border-l border-[#2c241c] mt-1 mb-2.5 ml-2.5">
                        {link.dropdownItems.map((item) => (
                          <Link 
                            key={item.label} 
                            to={item.href} 
                            className="text-[#8c8279] no-underline text-[12px] tracking-[1px] py-2.5 uppercase transition-colors duration-300 hover:text-[#c8956c]"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link 
                    to={link.href} 
                    className="text-[#b5aaa0] no-underline text-[14px] tracking-[2px] font-medium uppercase transition-colors duration-300 py-2.5 flex justify-between items-center cursor-pointer hover:text-[#c8956c]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
            <Link to="/account" className="block w-full border border-[#c8956c] text-[#c8956c] py-3.5 px-7 text-[12px] tracking-[2px] cursor-pointer uppercase font-bold mt-5 text-center transition-all duration-300 hover:bg-[#c8956c] hover:text-[#110e0c]" onClick={() => setIsMobileMenuOpen(false)}><div className="flex items-center justify-center gap-2"><User size={16} />{user ? user.name.split(' ')[0] : 'LOGIN / REGISTER'}</div></Link>
            <Link to="/membership" className="block w-full border border-[#c8956c] text-[#c8956c] py-3.5 px-7 text-[12px] tracking-[2px] cursor-pointer uppercase font-bold mt-3 text-center transition-all duration-300 hover:bg-[#c8956c] hover:text-[#110e0c]" onClick={() => setIsMobileMenuOpen(false)}>MEMBERSHIP</Link>
            <button className="bg-[#c8956c] text-[#110e0c] border border-[#c8956c] py-3.5 px-7 text-[12px] tracking-[2px] cursor-pointer uppercase font-bold mt-3 text-center transition-all duration-300 hover:bg-transparent hover:text-[#c8956c]" onClick={() => { handleOpenQuoteModal(); setIsMobileMenuOpen(false); }}>GET QUOTE</button>
          </div>
        </div>
      )}
    
      {/* Quick Quote & Catalogue Request Modal */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
          <div className="bg-[#110e0c] border border-[#c8956c]/40 p-6 sm:p-8 w-full max-w-2xl relative my-auto max-h-[92vh] overflow-y-auto shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
            <button 
              className="absolute top-4 right-4 text-[#888888] hover:text-[#c8956c] transition-colors p-1"
              onClick={() => setIsQuoteModalOpen(false)}
              aria-label="Close"
            >
              <X size={22} />
            </button>

            <div className="mb-6">
              <div className="text-[#c8956c] text-[11px] font-bold tracking-[2px] uppercase mb-1 flex items-center gap-2">
                <FileText size={14} /> Official Export Catalogues
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-white uppercase tracking-[1px]">
                Get Catalogues & Quotation
              </h3>
              <p className="text-[#a39a8c] text-sm mt-1">
                Select the Indian handicraft catalogues you would like to receive. Catalogues are verified and unlocked in your account.
              </p>
            </div>

            <form onSubmit={handleQuoteSubmit} className="flex flex-col gap-5">
              {/* Client Email Field */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#c8956c] font-semibold mb-1.5">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input 
                  type="email" 
                  value={quoteEmail}
                  onChange={(e) => setQuoteEmail(e.target.value)}
                  placeholder="name@company.com" 
                  required
                  className="w-full bg-[#15110F] border border-[#2c241c] p-3.5 text-sm text-white placeholder-[#666] focus:outline-none focus:border-[#c8956c] transition-colors rounded-sm"
                />
                <p className="text-[12px] text-[#888] mt-1.5">
                  Your official PDF catalogues will be unlocked and linked to this email address.
                </p>
              </div>

              {/* Catalogue Selection Section */}
              <div className="border-t border-[#2c241c] pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#c8956c] font-semibold">
                      Select Catalogues <span className="text-red-400">*</span>
                    </span>
                    <span className="text-[11px] text-[#888] ml-2">
                      ({selectedCatalogues.length} of {AVAILABLE_CATALOGUES.length} selected)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleSelectAllCatalogues}
                    className="text-xs text-[#c8956c] hover:underline cursor-pointer bg-transparent border-none p-0 font-medium"
                  >
                    {selectedCatalogues.length === AVAILABLE_CATALOGUES.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                <div className="flex flex-col gap-2.5 max-h-[260px] overflow-y-auto pr-1">
                  {AVAILABLE_CATALOGUES.map((cat) => {
                    const isChecked = selectedCatalogues.includes(cat.id);
                    return (
                      <div
                        key={cat.id}
                        onClick={() => toggleCatalogue(cat.id)}
                        className={'p-3 rounded border transition-all cursor-pointer flex items-start gap-3 ' + (isChecked ? 'bg-[#c8956c]/10 border-[#c8956c]' : 'bg-[#15110F] border-[#2c241c] hover:border-[#c8956c]/40')}
                      >
                        <div className="pt-0.5 shrink-0">
                          {isChecked ? (
                            <CheckSquare size={18} className="text-[#c8956c]" />
                          ) : (
                            <Square size={18} className="text-[#666]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className={'text-sm font-medium ' + (isChecked ? 'text-white' : 'text-[#b5aaa0]')}>
                              {cat.title}
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#2c241c] text-[#c8956c] shrink-0">
                              PDF
                            </span>
                          </div>
                          <p className="text-[12px] text-[#888] mt-0.5 leading-snug">
                            {cat.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Security & Verification Notice */}
              <div className="bg-[#15110F] border border-[#2c241c] p-3 rounded flex items-start gap-2.5">
                <ShieldCheck size={18} className="text-[#c8956c] shrink-0 mt-0.5" />
                <div className="text-[11px] text-[#a39a8c] leading-relaxed">
                  <strong className="text-[#ece6dc]">Admin Verification:</strong> To protect verified manufacturer pricing, full PDF catalogues are unlocked after verification. You will be able to view and download them in your <span className="text-[#c8956c]">Account Dashboard</span>.
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={quoteSubmitting || selectedCatalogues.length === 0}
                className="w-full bg-[#c8956c] text-[#110e0c] font-bold uppercase tracking-[2px] py-3.5 hover:bg-[#b5855c] transition-colors disabled:opacity-50 cursor-pointer text-xs sm:text-sm mt-1"
              >
                {quoteSubmitting ? 'Submitting Request...' : 'Submit Request (' + selectedCatalogues.length + ' Catalogues)'}
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
