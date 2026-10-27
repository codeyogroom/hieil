import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ items }) => {
  const location = useLocation();

  // Hide global breadcrumb on product details page as it has its own
  if (location.pathname.startsWith('/product/')) return null;

  const breadcrumbItems = items || (() => {
    const paths = location.pathname.split('/').filter(p => p);
    
    if (paths.length === 0) return [];

    let currentUrl = '';
    const processedPaths = [];
    for (let i = 0; i < paths.length; i++) {
      if (paths[i] === 'about' && paths[i+1] === 'us') {
        processedPaths.push('about/us');
        i++;
      } else {
        processedPaths.push(paths[i]);
      }
    }

    const generated = processedPaths.map((path, index) => {
      if (path === 'about/us') {
         currentUrl = '/about/us';
      } else {
         currentUrl += `/${path}`;
      }
      
      const isLast = index === processedPaths.length - 1;
      
      // Map of specific path segments to their full names
      const customLabels = {
        'custom': 'Custom Product Development',
        'wholesale': 'Bulk Wholesale Supply',
        'export': 'Export Logistics',
        'quality': 'Quality Assurance',
        'private-labeling': 'Private Labeling',
        'b2b': 'B2B Partnerships',
        'affiliate': 'Affiliate Program',
        'about/us': 'About Us',
        'why-choose-us': 'Why Choose Us',
        'how-we-work': 'How We Work',
        'legal-info': 'Legal Info',
        'membership': 'Subscription',
        'subscription': 'Subscription'
      };

      let label = path.replace(/-/g, ' ');
      label = label.charAt(0).toUpperCase() + label.slice(1);
      
      if (customLabels[path.toLowerCase()]) {
        label = customLabels[path.toLowerCase()];
      }
      
      return {
        label,
        href: currentUrl,
        isCurrent: isLast
      };
    });

    return [{ label: 'Home', href: '/' }, ...generated];
  })();

  if (breadcrumbItems.length <= 1) return null;

  return (
    <div className="bg-[#15110F] border-b border-[#2c241c]">
      <nav className="px-6 py-3 max-w-7xl mx-auto font-sans relative z-10" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center m-0 p-0">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1 || item.isCurrent;
            return (
              <li key={index} className="flex items-center text-[0.85rem] text-[#b5aaa0] tracking-[0.5px]">
                {isLast ? (
                  <span className="text-[#c8956c] font-medium" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link to={item.href} className="text-[#b5aaa0] no-underline transition-colors duration-200 hover:text-[#c8956c]">
                    {item.label}
                  </Link>
                )}
                {!isLast && <ChevronRight size={14} className="mx-2 text-[#4a3e35] opacity-70" />}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
