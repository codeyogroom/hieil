import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FaHome, FaList, FaTags, FaShoppingCart, FaCogs, 
  FaThLarge, FaBlogger, FaPowerOff, FaStar, FaBell,
  FaBuilding, FaClipboardList, FaUserTie, FaUsers,
  FaImages, FaQuestionCircle, FaCertificate, FaSlidersH,
  FaEnvelope, FaInfoCircle, FaDownload, FaUserCog,
  FaBoxOpen, FaStore, FaLayerGroup, FaShippingFast, FaTruck,
  FaMapMarkerAlt, FaUserShield, FaChevronDown, FaChevronRight, FaCog, FaCrown
} from 'react-icons/fa';

const SidebarItem = ({ to, icon, label, exact, children, isSidebarOpen }) => {
  const location = useLocation();
  
  const isChildActive = children && children.some(child => {
    const childPath = `/admin${child.to}`;
    return location.pathname === childPath || location.pathname.startsWith(`${childPath}/`);
  });

  const [isOpen, setIsOpen] = useState(isChildActive);
  const Icon = icon;
  const adminTo = to === '/' ? '/admin' : (to ? `/admin${to}` : undefined);

  if (children) {
    return (
      <li className="mb-1">
        <div 
          className={`flex items-center justify-between py-3 px-4 rounded-lg cursor-pointer transition-colors duration-200 ${
            isChildActive ? 'bg-[#3b82f6] text-white' : 'text-gray-300 hover:bg-[#2d3748] hover:text-white'
          } ${!isSidebarOpen ? 'justify-center px-0 mx-2' : ''}`} 
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className={`flex items-center ${!isSidebarOpen ? 'justify-center' : ''}`}>
            <Icon className={`${isSidebarOpen ? 'mr-3 text-[16px]' : 'mr-0 text-[20px]'} flex-shrink-0`} /> 
            {isSidebarOpen && <span className="text-[14px] font-medium whitespace-nowrap">{label}</span>}
          </div>
          {isSidebarOpen && (isOpen ? <FaChevronDown className="text-[12px]" /> : <FaChevronRight className="text-[12px]" />)}
        </div>
        {isSidebarOpen && (
          <ul className={`pl-8 pr-4 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100 py-2' : 'max-h-0 opacity-0 py-0'}`}>
            {children.map((child, idx) => (
              <li key={idx} className="mb-1">
                <NavLink 
                  to={`/admin${child.to}`} 
                  className={({ isActive }) => `block py-2 px-3 rounded-lg text-[13px] transition-colors duration-200 ${
                    isActive ? 'text-[#3b82f6] font-semibold bg-[#2d3748]' : 'text-gray-400 hover:text-white hover:bg-[#2d3748]'
                  }`}
                >
                  <span className="whitespace-nowrap">{child.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li className="mb-1">
      <NavLink 
        to={adminTo} 
        end={exact}
        className={({ isActive }) => `flex items-center py-3 px-4 rounded-lg cursor-pointer transition-colors duration-200 ${
          isActive ? 'bg-[#3b82f6] text-white' : 'text-gray-300 hover:bg-[#2d3748] hover:text-white'
        } ${!isSidebarOpen ? 'justify-center px-0 mx-2' : ''}`}
      >
        <Icon className={`${isSidebarOpen ? 'mr-3 text-[16px]' : 'mr-0 text-[20px]'} flex-shrink-0`} /> 
        {isSidebarOpen && <span className="text-[14px] font-medium whitespace-nowrap">{label}</span>}
      </NavLink>
    </li>
  );
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const adminRole = localStorage.getItem('adminRole') || 'superadmin';
  const rawPermissions = localStorage.getItem('adminPermissions');
  const adminPermissions = rawPermissions && rawPermissions !== 'undefined' ? JSON.parse(rawPermissions) : {};

  const hasPermission = (moduleName) => {
    if (adminRole === 'superadmin') return true;
    return adminPermissions[moduleName]?.view === true;
  };

  return (
    <div className={`fixed top-0 left-0 h-screen bg-[#212b36] dark:bg-[#1a1c23] text-white flex flex-col transition-all duration-300 ease-in-out z-[1000] overflow-x-hidden ${isOpen ? 'w-[260px]' : 'w-[70px] max-md:-translate-x-full'} max-md:w-[260px] max-md:${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className={`flex items-center p-5 border-b border-[#2d3748] dark:border-gray-800 flex-shrink-0 ${!isOpen ? 'justify-center max-md:justify-start' : ''}`}>
        <div className="flex-shrink-0 cursor-pointer" onClick={() => window.location.href = '/admin/profile'}>
          <img src="https://i.pravatar.cc/150?img=11" alt="Admin" className={`rounded-full border-2 border-white object-cover ${isOpen ? 'w-[50px] h-[50px] mr-4' : 'w-[40px] h-[40px] mr-0 max-md:w-[50px] max-md:h-[50px] max-md:mr-4'}`} />
        </div>
        {isOpen && (
          <div className="overflow-hidden whitespace-nowrap cursor-pointer" onClick={() => window.location.href = '/admin/profile'}>
            <h3 className="m-0 text-[16px] font-semibold">HIEIL ADMIN</h3>
            <p className="m-0 text-[13px] text-gray-400">hieil@gmail.com</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-500">
        {isOpen && <div className="px-5 py-3 text-[11px] font-bold text-gray-500 tracking-[1px] uppercase whitespace-nowrap">WEBSITE CONTENT DATA</div>}
        <nav className="px-2">
          <ul className="list-none p-0 m-0">
            {hasPermission('Dashboard') && <SidebarItem isSidebarOpen={isOpen} to="/" icon={FaHome} label="Dashboard" exact />}
            {hasPermission("Category's") && <SidebarItem isSidebarOpen={isOpen} to="/categories" icon={FaList} label="Category's" />}
            {hasPermission("Subcategory's") && <SidebarItem isSidebarOpen={isOpen} to="/subcategories" icon={FaList} label="Subcategory's" />}
            {hasPermission("Product's") && <SidebarItem isSidebarOpen={isOpen} to="/products" icon={FaShoppingCart} label="Product's" />}
            {hasPermission("Custom Products") && <SidebarItem isSidebarOpen={isOpen} to="/custom-products" icon={FaCogs} label="Custom Products" />}
            {hasPermission("Blog Category") && <SidebarItem isSidebarOpen={isOpen} to="/blog-category" icon={FaTags} label="Blog Category" />}
            {hasPermission("Blog's") && <SidebarItem isSidebarOpen={isOpen} to="/blogs" icon={FaBlogger} label="Blog's" />}
            {hasPermission("Submissions") && <SidebarItem isSidebarOpen={isOpen} icon={FaBell} label="Manage Submissions">
               {[
                 {to: '/submissions/reviews', label: 'Reviews/Testimonials'},
                 {to: '/submissions/user-moments', label: 'User Moments/Photos'},
                 {to: '/submissions/feedback', label: 'Customer Feedback'},
                 {to: '/submissions/newsletter', label: 'Newsletter Subscribers'}
               ]}
            </SidebarItem>}
            {hasPermission("Brands") && <SidebarItem isSidebarOpen={isOpen} to="/brands" icon={FaBuilding} label="Brands" />}
            {hasPermission("Product C & Q") && <SidebarItem isSidebarOpen={isOpen} to="/product-cq" icon={FaClipboardList} label="Product C & Q" />}
            {hasPermission("Artisan") && <SidebarItem isSidebarOpen={isOpen} to="/artisan" icon={FaUserTie} label="Our Artisan" />}
            {hasPermission("Leader's") && <SidebarItem isSidebarOpen={isOpen} to="/leaders" icon={FaUsers} label="Our Leader's" />}
            {hasPermission("Gallery") && <SidebarItem isSidebarOpen={isOpen} to="/gallery-category" icon={FaImages} label="Gallery Category" />}
            {hasPermission("Gallery") && <SidebarItem isSidebarOpen={isOpen} to="/gallery" icon={FaImages} label="Gallery" />}
            {hasPermission("FAQ") && <SidebarItem isSidebarOpen={isOpen} to="/faq-category" icon={FaQuestionCircle} label="FAQ Category" />}
            {hasPermission("FAQ") && <SidebarItem isSidebarOpen={isOpen} to="/faq" icon={FaQuestionCircle} label="FAQ" />}
            {hasPermission("Certifications") && <SidebarItem isSidebarOpen={isOpen} to="/certifications" icon={FaCertificate} label="Our Certifications" />}
            {hasPermission("Download Leads") && <SidebarItem isSidebarOpen={isOpen} to="/download-leads" icon={FaDownload} label="Certificate Downloads" />}
            {hasPermission("Contact") && <SidebarItem isSidebarOpen={isOpen} to="/contact" icon={FaEnvelope} label="Contact" />}
          </ul>
        </nav>

        {isOpen && <div className="px-5 mt-4 py-3 text-[11px] font-bold text-gray-500 tracking-[1px] uppercase whitespace-nowrap">ADMIN & OPERATIONS</div>}
        <nav className="px-2">
          <ul className="list-none p-0 m-0">
            {hasPermission("Service Inquiries") && <SidebarItem isSidebarOpen={isOpen} to="/service-inquiries" icon={FaInfoCircle} label="Service Inquiries" />}
            {hasPermission("Vendor Management") && <SidebarItem isSidebarOpen={isOpen} icon={FaUserCog} label="Vendor Management">
               {[
                 {to: '/vendor-management/master', label: 'Vendor Master'},
                 {to: '/vendor-management/orders', label: 'Vendor Orders'},
                 {to: '/vendor-management/report', label: 'Vendor Report'},
                 {to: '/vendor-management/payout', label: 'Vendor Payout'}
               ]}
            </SidebarItem>}
            {hasPermission("Membership") && <SidebarItem isSidebarOpen={isOpen} icon={FaCrown} label="Subscription">
               {[
                 {to: '/membership-plans', label: 'Subscription Plans'},
                 {to: '/membership-enquiries', label: 'Subscription Enquiries'}
               ]}
            </SidebarItem>}
            {hasPermission("Inquiry System") && <SidebarItem isSidebarOpen={isOpen} icon={FaBoxOpen} label="Inquiry System">
               {[
                 {to: '/inquiry-system/product-inquiries', label: 'Product Inquiries'},
                 {to: '/inquiry-system/quick-inquiries', label: 'Quick Inquiries'},
                 {to: '/inquiry-system/orders', label: 'Orders'},
                 {to: '/inquiry-system/quotations', label: 'Quotations'},
                 {to: '/inquiry-system/invoices', label: 'Invoices'},
                 {to: '/inquiry-system/payments', label: 'Payments'},
                 {to: '/inquiry-system/shipping', label: 'Shipping'},
                 {to: '/inquiry-system/reports', label: 'Inquiry Reports'}
               ]}
            </SidebarItem>}
            {/*
            {hasPermission("Retailer System") && <SidebarItem isSidebarOpen={isOpen} icon={FaStore} label="Retailer System">
               {[
                 {to: '/retailer-system/product-inquiries', label: 'Product Inquiries'},
                 {to: '/retailer-system/orders', label: 'Orders'},
                 {to: '/retailer-system/quotations', label: 'Quotations'},
                 {to: '/retailer-system/invoices', label: 'Invoices'},
                 {to: '/retailer-system/payments', label: 'Payments'},
                 {to: '/retailer-system/shipping', label: 'Shipping'}
               ]}
            </SidebarItem>}
            */}
            {hasPermission("Shipping List") && <SidebarItem isSidebarOpen={isOpen} icon={FaTruck} label="Shipping List">
                {[
                  {to: '/domestic-logistics', label: 'Domestic Logistics (E-Way Bill)'}
                ]}
              </SidebarItem>}
            {hasPermission("Settings") && <SidebarItem isSidebarOpen={isOpen} to="/settings" icon={FaCog} label="Settings" />}
          </ul>
        </nav>

        {hasPermission("Sub Admin Management") && <>
          {isOpen && <div className="px-5 mt-4 py-3 text-[11px] font-bold text-gray-500 tracking-[1px] uppercase whitespace-nowrap">SUB ADMIN CONTROL</div>}
          <nav className="px-2">
            <ul className="list-none p-0 m-0">
              <SidebarItem isSidebarOpen={isOpen} to="/sub-admin-mgmt" icon={FaUserShield} label="Sub Admin Mgmt" />
            </ul>
          </nav>
        </>}
      </div>

      <div className="p-4 border-t border-[#2d3748] dark:border-gray-800">
        <button 
          className={`flex items-center bg-[#ef4444] text-white border-none cursor-pointer hover:bg-[#dc2626] transition-colors duration-200 rounded-lg ${isOpen ? 'w-full py-3 px-4 justify-start' : 'w-[40px] h-[40px] p-0 justify-center mx-auto'}`}
          onClick={() => { localStorage.removeItem('isAuthenticated'); window.location.href = '/'; }}
        >
          <FaPowerOff className={`${isOpen ? 'mr-3 text-[16px]' : 'mr-0 text-[20px]'}`} /> 
          {isOpen && <span className="text-[14px] font-medium whitespace-nowrap">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
