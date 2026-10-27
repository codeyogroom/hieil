import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import Swal from 'sweetalert2';
import { Send, X, Sparkles, Check, ChevronDown } from 'lucide-react';

const defaultPlans = [
  {
    _id: 'default-1',
    name: 'HIEIL Essential',
    duration: '3 months',
    price: '$1,499',
    originalPrice: '$1,799',
    offerBadge: 'Save $300',
    targetAudience: 'For new importers, independent retailers and boutique businesses.',
    features: [
      'Eligible catalogue at verified manufacturer prices',
      'Custom-design sourcing from your images or specifications',
      'MOQ guidance, generally from 100 pieces where applicable',
      'Product specification sheets before order confirmation',
      'Pre-production sample coordination',
      'Photo and video updates during production, where available',
      'Pre-dispatch inspection coordination',
      'Export packaging guidance and one sourcing consultation',
      'Email support and order-status updates'
    ],
    promise: 'Start sourcing without building a supplier network from scratch.',
    isPopular: false,
    order: 1
  },
  {
    _id: 'default-2',
    name: 'HIEIL Business',
    duration: '6 months',
    price: '$2,499',
    originalPrice: '$2,999',
    offerBadge: 'Save $500',
    targetAudience: 'For growing retailers, importers and gift businesses.',
    extraHeader: 'Everything in Essential, plus',
    features: [
      'Priority sourcing across multiple categories',
      'Consolidated quotations from multiple manufacturers',
      'Supplier price, specification and lead-time comparison',
      'Private-label and packaging customisation coordination',
      'Agreed inspection checkpoints and milestone progress reports',
      'Material, finish and measurement verification',
      'SEO-friendly descriptions for up to 20 products',
      'Buyer-ready digital catalogue support',
      'Priority account coordination and monthly sourcing review'
    ],
    promise: 'A more consistent supply chain with less time spent chasing manufacturers.',
    isPopular: true,
    popularTag: 'Most Popular',
    order: 2
  },
  {
    _id: 'default-3',
    name: 'HIEIL Global Partner',
    duration: '12 months',
    price: '$3,999',
    originalPrice: '$4,999',
    offerBadge: 'Save $1,000',
    targetAudience: 'For wholesalers, established importers and multi-store retailers.',
    extraHeader: 'Everything in Business, plus',
    features: [
      'Annual sourcing and collection planning session',
      'Custom collection development coordination',
      'Private-label and branded packaging projects',
      'Dedicated account coordinator',
      'Repeat-order forecasting and production scheduling',
      'SEO-friendly content for up to 50 products',
      'Annual catalogue refresh and seasonal merchandising',
      'Preferential order service-fee terms in your contract',
      'First access to selected new collections',
      'Agreed exclusivity for qualifying custom designs, where achievable'
    ],
    promise: 'A long-term sourcing partnership in India, from design to repeat orders.',
    isPopular: false,
    order: 3
  }
];

const countryList = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
  'France', 'United Arab Emirates', 'Saudi Arabia', 'Singapore', 'Japan', 
  'Italy', 'Spain', 'Netherlands', 'Sweden', 'Switzerland', 'India', 'Other'
];

const Membership = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState(defaultPlans);
  const [loadingPlans, setLoadingPlans] = useState(true);

  // Modal State
  const [selectedPlanForModal, setSelectedPlanForModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Enquiry Form State
  const [formData, setFormData] = useState({
    planName: 'HIEIL Business',
    duration: '6 months',
    price: '$2,499',
    name: '',
    email: '',
    phone: '',
    companyName: '',
    productCategories: '',
    targetMarket: '',
    expectedOrderSize: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Auto-populate logged in user info
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        companyName: user.companyName || prev.companyName
      }));
    }
  }, [user]);

  // Fetch plans from backend API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await api.get('/subscription-plans');
        if (res.data && res.data.length > 0) {
          const activePlans = res.data.filter(p => p.status !== 'Inactive');
          if (activePlans.length > 0) {
            setPlans(activePlans);
          }
        }
      } catch (err) {
        console.error('Error fetching subscription plans:', err);
      } finally {
        setLoadingPlans(false);
      }
    };
    fetchPlans();
  }, []);

  const handleOpenModal = (plan) => {
    setSelectedPlanForModal(plan);
    setFormData(prev => ({
      ...prev,
      planName: plan.name,
      duration: plan.duration,
      price: plan.price
    }));
    setIsModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'planName') {
      const found = plans.find(p => p.name === value);
      setFormData(prev => ({
        ...prev,
        planName: value,
        duration: found ? found.duration : prev.duration,
        price: found ? found.price : prev.price
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitEnquiry = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      Swal.fire({
        title: 'Required Information',
        text: 'Please enter your name and email address.',
        icon: 'warning',
        background: '#1C1713',
        color: '#fff',
        confirmButtonColor: '#c8956c'
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        userId: user ? user.id : undefined
      };
      await api.post('/subscription-enquiries', payload);
      
      Swal.fire({
        title: 'Application Received!',
        html: `Thank you <b>${formData.name}</b>. Your membership enquiry for <b>${formData.planName}</b> has been received. Our international sourcing director will contact you within 24 hours.`,
        icon: 'success',
        confirmButtonColor: '#c8956c',
        background: '#1C1713',
        color: '#ffffff'
      });

      if (isModalOpen) setIsModalOpen(false);

      // Reset form while keeping user contact info
      setFormData(prev => ({
        ...prev,
        productCategories: '',
        targetMarket: '',
        expectedOrderSize: '',
        message: ''
      }));
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: 'Submission Failed',
        text: err.response?.data?.message || 'Something went wrong. Please try again or reach out on WhatsApp.',
        icon: 'error',
        confirmButtonColor: '#c8956c',
        background: '#1C1713',
        color: '#ffffff'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="font-sans text-white bg-[#15110F] overflow-x-hidden pt-[50px]">
      
      {/* HERO SECTION */}
      <section className="py-12 md:py-20 bg-[#15110F] border-b border-[#2c241c]">
        <div className="max-w-[1200px] mx-auto px-5 text-center">
          <div data-aos="fade-up">
            <span className="font-sans text-[0.75rem] tracking-[4px] uppercase text-[#c8956c] border border-[#c8956c] rounded-full py-2 px-6 inline-flex items-center gap-3 mb-[30px] bg-transparent">
              <Sparkles size={14} /> Hind Import Export International &middot; Jaipur, India
            </span>
            <h1 className="text-3xl md:text-5xl/15 font-serif font-normal text-white uppercase tracking-[1px] mb-6 max-w-[900px] mx-auto">
              Source Indian handicrafts through <span style={{ color: 'var(--color-brand-base)' }}>one trusted partner</span>
            </h1>
            <p className="text-[1.05rem] md:text-[1.1rem] text-[#b5aaa0] leading-[1.8] max-w-[800px] mx-auto mb-10">
              Blue pottery, metal, stone, wood and handcrafted clocks, sourced at verified manufacturer prices with transparent quotations, quality checks and export coordination.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a 
                href="#plans" 
                className="inline-block bg-[#c8956c] text-[#15110F] border border-[#c8956c] py-3.5 px-8 text-[12px] tracking-[2px] uppercase font-bold transition-all duration-300 hover:bg-transparent hover:text-[#c8956c] rounded-[6px]"
              >
                View Membership Plans
              </a>
              <a 
                href="#contact" 
                className="inline-block bg-transparent text-[#c8956c] border border-[#4a3e35] py-3.5 px-8 text-[12px] tracking-[2px] uppercase font-bold transition-all duration-300 hover:border-[#c8956c] hover:bg-[rgba(194,163,115,0.08)] rounded-[6px]"
              >
                Request Consultation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* HOW HIEIL WORKS */}
      <section id="how" className="py-[80px] bg-[#1C1713] border-b border-[#2c241c]">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-[60px]" data-aos="fade-up">
            <h2 className="text-3xl md:text-5xl/15 font-serif font-normal text-white uppercase tracking-[1px] mb-[15px]">
              How HIEIL Works
            </h2>
            <p className="font-sans text-[1.05rem] md:text-[1.1rem] font-normal text-[#b5aaa0] max-w-[700px] mx-auto">
              No hidden markup. Every quotation shows each cost on its own line.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[25px]">
            <div className="bg-[rgba(28,23,19,0.6)] backdrop-blur-[10px] border border-[#2c241c] rounded-[20px] p-7 transition-all duration-400 ease-in-out hover:border-[#c8956c] hover:shadow-[0_10px_40px_rgba(194,163,115,0.05)] hover:-translate-y-[5px]" data-aos="fade-up" data-aos-delay="100">
              <div className="w-[54px] h-[54px] mb-5 flex items-center justify-center bg-[rgba(200,149,108,0.1)] border border-[rgba(200,149,108,0.3)] text-[#c8956c] font-serif text-2xl font-bold rounded-full">
                01
              </div>
              <h3 className="font-serif text-[1.2rem] font-bold text-white mb-2 uppercase tracking-[1px]">Choose a membership</h3>
              <p className="text-[#b5aaa0] leading-[1.6] text-[14px] m-0">Pick a 3-month, 6-month or annual plan to match how you buy.</p>
            </div>
            <div className="bg-[rgba(28,23,19,0.6)] backdrop-blur-[10px] border border-[#2c241c] rounded-[20px] p-7 transition-all duration-400 ease-in-out hover:border-[#c8956c] hover:shadow-[0_10px_40px_rgba(194,163,115,0.05)] hover:-translate-y-[5px]" data-aos="fade-up" data-aos-delay="200">
              <div className="w-[54px] h-[54px] mb-5 flex items-center justify-center bg-[rgba(200,149,108,0.1)] border border-[rgba(200,149,108,0.3)] text-[#c8956c] font-serif text-2xl font-bold rounded-full">
                02
              </div>
              <h3 className="font-serif text-[1.2rem] font-bold text-white mb-2 uppercase tracking-[1px]">Select handicrafts</h3>
              <p className="text-[#b5aaa0] leading-[1.6] text-[14px] m-0">Choose from our catalogue or send images, drawings or specifications for custom designs.</p>
            </div>
            <div className="bg-[rgba(28,23,19,0.6)] backdrop-blur-[10px] border border-[#2c241c] rounded-[20px] p-7 transition-all duration-400 ease-in-out hover:border-[#c8956c] hover:shadow-[0_10px_40px_rgba(194,163,115,0.05)] hover:-translate-y-[5px]" data-aos="fade-up" data-aos-delay="300">
              <div className="w-[54px] h-[54px] mb-5 flex items-center justify-center bg-[rgba(200,149,108,0.1)] border border-[rgba(200,149,108,0.3)] text-[#c8956c] font-serif text-2xl font-bold rounded-full">
                03
              </div>
              <h3 className="font-serif text-[1.2rem] font-bold text-white mb-2 uppercase tracking-[1px]">Review quotation</h3>
              <p className="text-[#b5aaa0] leading-[1.6] text-[14px] m-0">Product cost, service fee, packaging, transport, export costs and taxes, shown separately.</p>
            </div>
            <div className="bg-[rgba(28,23,19,0.6)] backdrop-blur-[10px] border border-[#2c241c] rounded-[20px] p-7 transition-all duration-400 ease-in-out hover:border-[#c8956c] hover:shadow-[0_10px_40px_rgba(194,163,115,0.05)] hover:-translate-y-[5px]" data-aos="fade-up" data-aos-delay="400">
              <div className="w-[54px] h-[54px] mb-5 flex items-center justify-center bg-[rgba(200,149,108,0.1)] border border-[rgba(200,149,108,0.3)] text-[#c8956c] font-serif text-2xl font-bold rounded-full">
                04
              </div>
              <h3 className="font-serif text-[1.2rem] font-bold text-white mb-2 uppercase tracking-[1px]">Confirm and ship</h3>
              <p className="text-[#b5aaa0] leading-[1.6] text-[14px] m-0">We coordinate sourcing, inspection and export under the agreed shipping terms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PLANS SECTION */}
      <section id="plans" className="py-[80px] bg-[#15110F] border-b border-[#2c241c]">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-[60px]" data-aos="fade-up">
            <h2 className="text-3xl md:text-5xl/15 font-serif font-normal text-white uppercase tracking-[1px] mb-[15px]">
              Importer Membership Plans
            </h2>
            <p className="font-sans text-[1.05rem] md:text-[1.1rem] font-normal text-[#b5aaa0] max-w-[700px] mx-auto">
              Membership fees are separate from product, shipping and order service costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] items-stretch">
            {plans.map((plan, idx) => {
              const isPop = plan.isPopular;
              return (
                <article 
                  key={plan._id || plan.name}
                  data-aos="fade-up"
                  data-aos-delay={(idx + 1) * 100}
                  className={`bg-[rgba(28,23,19,0.6)] backdrop-blur-[10px] rounded-[20px] p-8 md:p-10 flex flex-col relative transition-all duration-400 ease-in-out hover:-translate-y-[5px] border ${
                    isPop 
                      ? 'border-[#c8956c] shadow-[0_10px_40px_rgba(194,163,115,0.12)] bg-[rgba(35,28,23,0.8)]' 
                      : 'border-[#2c241c] hover:border-[#c8956c] hover:shadow-[0_10px_40px_rgba(194,163,115,0.05)]'
                  }`}
                >
                  {/* Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {isPop ? (
                      <span className="bg-[#c8956c] text-[#15110F] text-[11px] font-bold tracking-[2px] uppercase py-1 px-3.5 rounded-full">
                        {plan.popularTag || 'Most Popular'}
                      </span>
                    ) : <span />}
                    {plan.offerBadge && (
                      <span className="bg-[rgba(200,149,108,0.15)] border border-[#c8956c] text-[#c8956c] text-[11px] font-bold tracking-[1.5px] uppercase py-1 px-3 rounded-full">
                        {plan.offerBadge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-[1.6rem] md:text-[1.8rem] text-white font-normal mb-1 uppercase tracking-[1px]">
                    {plan.name}
                  </h3>
                  <div className="text-[#c8956c] text-xs font-medium uppercase tracking-[2px] mb-4">
                    {plan.duration}
                  </div>
                  
                  {/* Pricing */}
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl md:text-4xl font-serif font-normal text-[#c8956c] tracking-normal">
                      {plan.price}
                    </span>
                    {plan.originalPrice && (
                      <span className="text-lg text-[#8c8279] line-through font-sans ml-2">
                        {plan.originalPrice}
                      </span>
                    )}
                  </div>

                  <p className="text-[#b5aaa0] leading-[1.6] text-[14px] mb-6 min-h-[44px]">
                    {plan.targetAudience}
                  </p>

                  {plan.extraHeader && (
                    <div className="text-[#c8956c] text-xs tracking-[1.5px] uppercase font-bold mb-3 border-b border-[#2c241c] pb-2">
                      {plan.extraHeader}
                    </div>
                  )}

                  {/* Features List */}
                  <ul className="list-none p-0 m-0 mb-6 flex-1 text-sm">
                    {(Array.isArray(plan.features) ? plan.features : []).map((feat, fIdx) => (
                      <li key={fIdx} className="py-2.5 pl-6 relative border-t border-[#2c241c] text-[#b5aaa0] text-[14px] leading-relaxed">
                        <span className="absolute left-0 top-[11px] text-[#c8956c] text-[10px]">◆</span>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  {plan.promise && (
                    <p className="font-serif italic text-[15px] text-[#b5aaa0] mb-6 pt-4 border-t border-[#2c241c] text-center leading-[1.6]">
                      &ldquo;{plan.promise}&rdquo;
                    </p>
                  )}

                  <button
                    onClick={() => handleOpenModal(plan)}
                    className={`w-full py-3.5 px-6 font-bold tracking-[2px] text-[12px] uppercase rounded-[6px] transition-all duration-300 cursor-pointer ${
                      isPop 
                        ? 'bg-[#c8956c] text-[#15110F] border border-[#c8956c] hover:bg-transparent hover:text-[#c8956c]' 
                        : 'bg-transparent text-[#c8956c] border border-[#4a3e35] hover:border-[#c8956c] hover:bg-[rgba(194,163,115,0.08)]'
                    }`}
                  >
                    Enquire about {plan.name.replace('HIEIL ', '')}
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* PLANS AT A GLANCE TABLE */}
      <section id="compare" className="py-[80px] bg-[#1C1713] border-b border-[#2c241c]">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-[60px]" data-aos="fade-up">
            <h2 className="text-3xl md:text-5xl/15 font-serif font-normal text-white uppercase tracking-[1px] mb-[15px]">
              Plans at a Glance
            </h2>
            <p className="font-sans text-[1.05rem] md:text-[1.1rem] font-normal text-[#b5aaa0] max-w-[700px] mx-auto">
              Clear deliverables and limits, so you know exactly what each plan includes.
            </p>
          </div>

          <div className="overflow-x-auto bg-[rgba(28,23,19,0.6)] backdrop-blur-[10px] border border-[#2c241c] rounded-[20px]" data-aos="fade-up">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead>
                <tr className="border-b border-[#2c241c] bg-[rgba(21,17,15,0.9)]">
                  <th className="p-5 font-serif text-[1rem] md:text-[1.1rem] text-[#c8956c] font-normal uppercase tracking-[1px]">Benefit</th>
                  <th className="p-5 font-serif text-[1rem] md:text-[1.1rem] text-[#c8956c] font-normal uppercase tracking-[1px]">Essential</th>
                  <th className="p-5 font-serif text-[1rem] md:text-[1.1rem] text-[#c8956c] font-normal uppercase tracking-[1px] border-x border-[#2c241c]">Business (Popular)</th>
                  <th className="p-5 font-serif text-[1rem] md:text-[1.1rem] text-[#c8956c] font-normal uppercase tracking-[1px]">Global Partner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2c241c] text-[14px]">
                <tr>
                  <td className="p-5 text-[#ffffff] font-medium">Membership duration</td>
                  <td className="p-5 text-[#b5aaa0]">3 months</td>
                  <td className="p-5 text-[#c8956c] font-semibold border-x border-[#2c241c] bg-[rgba(200,149,108,0.04)]">6 months</td>
                  <td className="p-5 text-[#b5aaa0]">12 months</td>
                </tr>
                <tr>
                  <td className="p-5 text-[#ffffff] font-medium">Product content support</td>
                  <td className="p-5 text-[#b5aaa0]">5 products</td>
                  <td className="p-5 text-[#c8956c] font-semibold border-x border-[#2c241c] bg-[rgba(200,149,108,0.04)]">20 products</td>
                  <td className="p-5 text-[#b5aaa0]">50 products</td>
                </tr>
                <tr>
                  <td className="p-5 text-[#ffffff] font-medium">Sourcing review</td>
                  <td className="p-5 text-[#b5aaa0]">1 introductory session</td>
                  <td className="p-5 text-[#c8956c] font-semibold border-x border-[#2c241c] bg-[rgba(200,149,108,0.04)]">Monthly review</td>
                  <td className="p-5 text-[#b5aaa0]">Annual strategic review + scheduled reviews</td>
                </tr>
                <tr>
                  <td className="p-5 text-[#ffffff] font-medium">Account support</td>
                  <td className="p-5 text-[#b5aaa0]">Standard</td>
                  <td className="p-5 text-[#c8956c] font-semibold border-x border-[#2c241c] bg-[rgba(200,149,108,0.04)]">Priority</td>
                  <td className="p-5 text-[#b5aaa0]">Dedicated coordinator</td>
                </tr>
                <tr>
                  <td className="p-5 text-[#ffffff] font-medium">Custom-product sourcing</td>
                  <td className="p-5 text-[#b5aaa0]">Included</td>
                  <td className="p-5 text-[#c8956c] font-semibold border-x border-[#2c241c] bg-[rgba(200,149,108,0.04)]">Priority</td>
                  <td className="p-5 text-[#b5aaa0]">Priority development coordination</td>
                </tr>
                <tr>
                  <td className="p-5 text-[#ffffff] font-medium">Quality inspection</td>
                  <td className="p-5 text-[#b5aaa0]">Coordination; cost extra</td>
                  <td className="p-5 text-[#c8956c] font-semibold border-x border-[#2c241c] bg-[rgba(200,149,108,0.04)]">Coordination; cost extra</td>
                  <td className="p-5 text-[#b5aaa0]">Coordination; cost extra</td>
                </tr>
                <tr>
                  <td className="p-5 text-[#ffffff] font-medium">Order service fee</td>
                  <td className="p-5 text-[#b5aaa0]">Separately quoted</td>
                  <td className="p-5 text-[#c8956c] font-semibold border-x border-[#2c241c] bg-[rgba(200,149,108,0.04)]">Preferential terms</td>
                  <td className="p-5 text-[#b5aaa0]">Contractual preferential terms</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[#8c8279] text-xs text-center mt-5">
            Turnaround times, revision limits and support hours are confirmed in your membership agreement.
          </p>
        </div>
      </section>

      {/* OUR PRICING PRINCIPLES */}
      <section id="pricing" className="py-[80px] bg-[#15110F] border-b border-[#2c241c]">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-[60px]" data-aos="fade-up">
            <h2 className="text-3xl md:text-5xl/15 font-serif font-normal text-white uppercase tracking-[1px] mb-[15px]">
              Our Pricing Principles
            </h2>
            <p className="font-sans text-[1.05rem] md:text-[1.1rem] font-normal text-[#b5aaa0] max-w-[700px] mx-auto">
              Transparency is the foundation of the HIEIL model.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[25px]">
            <div className="bg-[rgba(28,23,19,0.6)] backdrop-blur-[10px] border border-[#2c241c] border-l-4 border-l-[#c8956c] rounded-[20px] p-7 transition-all duration-400 ease-in-out hover:border-[#c8956c] hover:shadow-[0_10px_40px_rgba(194,163,115,0.05)] hover:-translate-y-[5px]" data-aos="fade-up" data-aos-delay="100">
              <h3 className="font-serif text-[1.2rem] font-bold text-white mb-2 uppercase tracking-[1px]">Verified, not lowest</h3>
              <p className="text-[#b5aaa0] leading-[1.6] text-[14px] m-0">Manufacturer pricing is verified for every quotation. We never promise a lowest price we cannot show.</p>
            </div>
            <div className="bg-[rgba(28,23,19,0.6)] backdrop-blur-[10px] border border-[#2c241c] border-l-4 border-l-[#c8956c] rounded-[20px] p-7 transition-all duration-400 ease-in-out hover:border-[#c8956c] hover:shadow-[0_10px_40px_rgba(194,163,115,0.05)] hover:-translate-y-[5px]" data-aos="fade-up" data-aos-delay="200">
              <h3 className="font-serif text-[1.2rem] font-bold text-white mb-2 uppercase tracking-[1px]">Fees disclosed upfront</h3>
              <p className="text-[#b5aaa0] leading-[1.6] text-[14px] m-0">Any per-order service fee is stated before you confirm an order.</p>
            </div>
            <div className="bg-[rgba(28,23,19,0.6)] backdrop-blur-[10px] border border-[#2c241c] border-l-4 border-l-[#c8956c] rounded-[20px] p-7 transition-all duration-400 ease-in-out hover:border-[#c8956c] hover:shadow-[0_10px_40px_rgba(194,163,115,0.05)] hover:-translate-y-[5px]" data-aos="fade-up" data-aos-delay="300">
              <h3 className="font-serif text-[1.2rem] font-bold text-white mb-2 uppercase tracking-[1px]">Costs kept separate</h3>
              <p className="text-[#b5aaa0] leading-[1.6] text-[14px] m-0">Samples, inspection, shipping, customs duties and freight forwarding are quoted as separate lines.</p>
            </div>
            <div className="bg-[rgba(28,23,19,0.6)] backdrop-blur-[10px] border border-[#2c241c] border-l-4 border-l-[#c8956c] rounded-[20px] p-7 transition-all duration-400 ease-in-out hover:border-[#c8956c] hover:shadow-[0_10px_40px_rgba(194,163,115,0.05)] hover:-translate-y-[5px]" data-aos="fade-up" data-aos-delay="400">
              <h3 className="font-serif text-[1.2rem] font-bold text-white mb-2 uppercase tracking-[1px]">Clear order minimums</h3>
              <p className="text-[#b5aaa0] leading-[1.6] text-[14px] m-0">The standard MOQ is 100 pieces where applicable. Some products may need a different MOQ.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONSULTATION ENQUIRY FORM SECTION */}
      <section id="contact" className="py-[100px] bg-[#1C1713]">
        <div className="max-w-[900px] mx-auto px-5">
          <div className="text-center mb-[50px]" data-aos="fade-up">
            <h2 className="text-3xl md:text-5xl/15 font-serif font-normal text-white uppercase tracking-[1px] mb-[15px]">
              Start Your Sourcing Partnership
            </h2>
            <p className="font-sans text-[1.05rem] md:text-[1.1rem] font-normal text-[#b5aaa0] max-w-[700px] mx-auto">
              Tell us your product categories, target market and expected order size, and we will recommend the right plan.
            </p>
          </div>

          <div className="p-[30px] md:p-[50px] rounded-[20px] bg-[rgba(28,23,19,0.6)] backdrop-blur-[10px] border border-[#2c241c]" data-aos="fade-up">
            <form onSubmit={handleSubmitEnquiry} className="flex flex-col gap-[25px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[25px]">
                <div className="flex flex-col">
                  <label className="font-medium mb-[10px] text-white text-[0.95rem] tracking-[1px]">Select Plan *</label>
                  <div className="relative">
                    <select
                      name="planName"
                      value={formData.planName}
                      onChange={handleFormChange}
                      className="appearance-none cursor-pointer w-full p-[15px] border border-[#4a3e35] rounded-[10px] bg-[rgba(21,17,15,0.8)] text-[1rem] text-white transition-all duration-300 outline-none focus:border-[#c8956c] focus:shadow-[0_0_15px_rgba(194,163,115,0.1)]"
                      required
                    >
                      {plans.map(p => (
                        <option key={p._id || p.name} value={p.name} className="bg-[#15110F] text-white">
                          {p.name} ({p.duration} - {p.price})
                        </option>
                      ))}
                      <option value="Custom Sourcing Requirement" className="bg-[#15110F] text-white">Custom Sourcing / Enterprise Partnership</option>
                    </select>
                    <ChevronDown className="absolute right-[15px] top-[50%] -translate-y-1/2 text-[#8c8279] pointer-events-none" size={18} />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="font-medium mb-[10px] text-white text-[0.95rem] tracking-[1px]">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="e.g. John Doe"
                    required
                    className="w-full p-[15px] border border-[#4a3e35] rounded-[10px] bg-[rgba(21,17,15,0.8)] text-[1rem] text-white transition-all duration-300 outline-none focus:border-[#c8956c] focus:shadow-[0_0_15px_rgba(194,163,115,0.1)] placeholder-[#70665d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[25px]">
                <div className="flex flex-col">
                  <label className="font-medium mb-[10px] text-white text-[0.95rem] tracking-[1px]">Business Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="name@company.com"
                    required
                    className="w-full p-[15px] border border-[#4a3e35] rounded-[10px] bg-[rgba(21,17,15,0.8)] text-[1rem] text-white transition-all duration-300 outline-none focus:border-[#c8956c] focus:shadow-[0_0_15px_rgba(194,163,115,0.1)] placeholder-[#70665d]"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-medium mb-[10px] text-white text-[0.95rem] tracking-[1px]">Phone / WhatsApp</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full p-[15px] border border-[#4a3e35] rounded-[10px] bg-[rgba(21,17,15,0.8)] text-[1rem] text-white transition-all duration-300 outline-none focus:border-[#c8956c] focus:shadow-[0_0_15px_rgba(194,163,115,0.1)] placeholder-[#70665d]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[25px]">
                <div className="flex flex-col">
                  <label className="font-medium mb-[10px] text-white text-[0.95rem] tracking-[1px]">Company / Brand Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleFormChange}
                    placeholder="e.g. Acme Imports Ltd."
                    className="w-full p-[15px] border border-[#4a3e35] rounded-[10px] bg-[rgba(21,17,15,0.8)] text-[1rem] text-white transition-all duration-300 outline-none focus:border-[#c8956c] focus:shadow-[0_0_15px_rgba(194,163,115,0.1)] placeholder-[#70665d]"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-medium mb-[10px] text-white text-[0.95rem] tracking-[1px]">Target Market / Destination</label>
                  <div className="relative">
                    <select
                      name="targetMarket"
                      value={formData.targetMarket}
                      onChange={handleFormChange}
                      className="appearance-none cursor-pointer w-full p-[15px] border border-[#4a3e35] rounded-[10px] bg-[rgba(21,17,15,0.8)] text-[1rem] text-white transition-all duration-300 outline-none focus:border-[#c8956c] focus:shadow-[0_0_15px_rgba(194,163,115,0.1)]"
                    >
                      <option value="" className="bg-[#15110F] text-white">Select Destination Market...</option>
                      {countryList.map((country) => (
                        <option key={country} value={country} className="bg-[#15110F] text-white">{country}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-[15px] top-[50%] -translate-y-1/2 text-[#8c8279] pointer-events-none" size={18} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[25px]">
                <div className="flex flex-col">
                  <label className="font-medium mb-[10px] text-white text-[0.95rem] tracking-[1px]">Handicraft Categories</label>
                  <input
                    type="text"
                    name="productCategories"
                    value={formData.productCategories}
                    onChange={handleFormChange}
                    placeholder="e.g. Blue Pottery, Wooden Decor, Metal Art"
                    className="w-full p-[15px] border border-[#4a3e35] rounded-[10px] bg-[rgba(21,17,15,0.8)] text-[1rem] text-white transition-all duration-300 outline-none focus:border-[#c8956c] focus:shadow-[0_0_15px_rgba(194,163,115,0.1)] placeholder-[#70665d]"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="font-medium mb-[10px] text-white text-[0.95rem] tracking-[1px]">Expected Order Volume</label>
                  <div className="relative">
                    <select
                      name="expectedOrderSize"
                      value={formData.expectedOrderSize}
                      onChange={handleFormChange}
                      className="appearance-none cursor-pointer w-full p-[15px] border border-[#4a3e35] rounded-[10px] bg-[rgba(21,17,15,0.8)] text-[1rem] text-white transition-all duration-300 outline-none focus:border-[#c8956c] focus:shadow-[0_0_15px_rgba(194,163,115,0.1)]"
                    >
                      <option value="" className="bg-[#15110F] text-white">Select Order Volume...</option>
                      <option value="Sample / Trial Order" className="bg-[#15110F] text-white">Sample / Trial Order</option>
                      <option value="$5,000 - $15,000" className="bg-[#15110F] text-white">$5,000 - $15,000</option>
                      <option value="$15,000 - $50,000" className="bg-[#15110F] text-white">$15,000 - $50,000</option>
                      <option value="$50,000 - $100,000+" className="bg-[#15110F] text-white">$50,000 - $100,000+</option>
                      <option value="Full Container Load (FCL)" className="bg-[#15110F] text-white">Full Container Load (FCL)</option>
                    </select>
                    <ChevronDown className="absolute right-[15px] top-[50%] -translate-y-1/2 text-[#8c8279] pointer-events-none" size={18} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="font-medium mb-[10px] text-white text-[0.95rem] tracking-[1px]">Specific Requirements / Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  rows={4}
                  placeholder="Tell us about custom design needs, required timelines, or questions regarding our sourcing..."
                  className="w-full p-[15px] border border-[#4a3e35] rounded-[10px] bg-[rgba(21,17,15,0.8)] text-[1rem] text-white transition-all duration-300 outline-none focus:border-[#c8956c] focus:shadow-[0_0_15px_rgba(194,163,115,0.1)] placeholder-[#70665d] resize-y"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#c8956c] border border-[#c8956c] text-[#15110F] p-[16px_30px] text-[12px] font-bold tracking-[2px] uppercase cursor-pointer flex items-center justify-center gap-[10px] transition-all duration-300 w-full rounded-[6px] hover:bg-transparent hover:text-[#c8956c] disabled:opacity-50"
              >
                {submitting ? 'Submitting Application...' : 'Submit Membership Application'} <Send size={16} />
              </button>

              <div className="text-center text-xs text-[#8c8279]">
                Direct assistance? Email us at <a href="mailto:indiaexport@hieil.com" className="text-[#c8956c] hover:underline">indiaexport@hieil.com</a> or message on WhatsApp.
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* POPUP MODAL FOR QUICK PLAN ENQUIRY */}
      {isModalOpen && selectedPlanForModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#1C1713] border border-[#c8956c] p-6 sm:p-8 w-full max-w-lg relative rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto">
            <button 
              className="absolute top-5 right-5 text-[#8c8279] hover:text-[#c8956c] transition-colors p-1"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={24} />
            </button>

            <div className="mb-6">
              <span className="text-[#c8956c] text-xs uppercase tracking-[2px] font-bold block mb-1">Membership Application</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white uppercase tracking-[1px]">{selectedPlanForModal.name}</h3>
              <div className="text-[#b5aaa0] text-sm mt-1">
                Duration: <span className="text-white font-medium">{selectedPlanForModal.duration}</span> &middot; Investment: <span className="text-[#c8956c] font-bold">{selectedPlanForModal.price}</span>
              </div>
            </div>

            <form onSubmit={handleSubmitEnquiry} className="flex flex-col gap-4">
              <div>
                <label className="font-medium mb-[6px] text-white text-[0.85rem] tracking-[1px] uppercase block">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  placeholder="Full name"
                  className="w-full p-[12px] border border-[#4a3e35] rounded-[8px] bg-[rgba(21,17,15,0.8)] text-[0.95rem] text-white transition-all duration-300 outline-none focus:border-[#c8956c] placeholder-[#70665d]"
                />
              </div>

              <div>
                <label className="font-medium mb-[6px] text-white text-[0.85rem] tracking-[1px] uppercase block">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  placeholder="Business email"
                  className="w-full p-[12px] border border-[#4a3e35] rounded-[8px] bg-[rgba(21,17,15,0.8)] text-[0.95rem] text-white transition-all duration-300 outline-none focus:border-[#c8956c] placeholder-[#70665d]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium mb-[6px] text-white text-[0.85rem] tracking-[1px] uppercase block">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="Phone / WhatsApp"
                    className="w-full p-[12px] border border-[#4a3e35] rounded-[8px] bg-[rgba(21,17,15,0.8)] text-[0.95rem] text-white transition-all duration-300 outline-none focus:border-[#c8956c] placeholder-[#70665d]"
                  />
                </div>
                <div>
                  <label className="font-medium mb-[6px] text-white text-[0.85rem] tracking-[1px] uppercase block">Company</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleFormChange}
                    placeholder="Company name"
                    className="w-full p-[12px] border border-[#4a3e35] rounded-[8px] bg-[rgba(21,17,15,0.8)] text-[0.95rem] text-white transition-all duration-300 outline-none focus:border-[#c8956c] placeholder-[#70665d]"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium mb-[6px] text-white text-[0.85rem] tracking-[1px] uppercase block">Product Focus / Sourcing Requirements</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Categories of interest, expected quantities, custom designs..."
                  className="w-full p-[12px] border border-[#4a3e35] rounded-[8px] bg-[rgba(21,17,15,0.8)] text-[0.95rem] text-white transition-all duration-300 outline-none focus:border-[#c8956c] placeholder-[#70665d] resize-y"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#c8956c] border border-[#c8956c] text-[#15110F] p-[14px_24px] text-[12px] font-bold tracking-[2px] uppercase cursor-pointer flex items-center justify-center gap-[10px] transition-all duration-300 w-full rounded-[6px] hover:bg-transparent hover:text-[#c8956c] disabled:opacity-50 mt-2"
              >
                {submitting ? 'Submitting Application...' : `Confirm & Enquire for ${selectedPlanForModal.name.replace('HIEIL ', '')}`}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Membership;
