import React, { useEffect } from 'react';
import { Globe } from 'lucide-react';
import './GoogleTranslate.css';

const GoogleTranslate = () => {
  useEffect(() => {
    const initTranslate = () => {
      if (window.google && window.google.translate) {
        const container = document.getElementById('google_translate_element');
        if (container && container.children.length === 0) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              autoDisplay: false,
            },
            'google_translate_element'
          );
        }
      }
    };

    window.googleTranslateElementInit = initTranslate;

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else {
      initTranslate();
    }
  }, []);

  return (
    <div 
      className="google-translate-wrapper flex items-center gap-1.5 bg-[#1C1713] border border-[#4a3e35] hover:border-[#c8956c] px-2 sm:px-2.5 py-1 sm:py-1.5 rounded transition-all duration-300 shadow-sm"
      title="Select Language"
    >
      <Globe size={14} className="text-[#c8956c] shrink-0 pointer-events-none" />
      <div id="google_translate_element" className="flex items-center" />
    </div>
  );
};

export default GoogleTranslate;
