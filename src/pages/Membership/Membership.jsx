import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../config/api';
import Swal from 'sweetalert2';
import { Check, Shield, Star, Clock, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';

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
        confirmButtonColor: '#C9A96E'
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
        confirmButtonColor: '#C9A96E',
        background: '#161412',
        color: '#ece6dc'
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
        confirmButtonColor: '#C9A96E',
        background: '#161412',
        color: '#ece6dc'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0c0b0a] text-[#ece6dc] font-sans min-h-screen pt-[90px]">
      
      {/* HERO SECTION */}
      <header className="py-20 md:py-28 text-center border-b border-[#2a2621] relative overflow-hidden bg-gradient-to-b from-[#141210] to-[#0c0b0a]">
        <div className="max-w-[1120px] mx-auto px-6 relative z-10">
          <div className="text-[#C9A96E] tracking-[0.28em] text-xs uppercase font-medium mb-4 flex items-center justify-center gap-2">
            <Sparkles size={14} /> Hind Import Export International &middot; Jaipur, India
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-semibold leading-[1.12] max-w-[880px] mx-auto mb-6 text-white">
            Source Indian handicrafts through <em className="text-[#C9A96E] not-italic">one trusted partner</em>
          </h1>
          <p className="text-[#a39a8c] max-w-[660px] mx-auto text-lg sm:text-xl leading-relaxed mb-10">
            Blue pottery, metal, stone, wood and handcrafted clocks, sourced at verified manufacturer prices with transparent quotations, quality checks and export coordination.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a 
              href="#plans" 
              className="inline-block bg-[#C9A96E] text-[#16120b] font-semibold py-3.5 px-8 rounded-sm tracking-[0.04em] transition-all hover:bg-[#e2c994] shadow-lg hover:shadow-[#C9A96E]/20"
            >
              View Membership Plans
            </a>
            <a 
              href="#contact" 
              className="inline-block bg-transparent text-[#C9A96E] border border-[#C9A96E] font-semibold py-3.5 px-8 rounded-sm tracking-[0.04em] transition-all hover:bg-[#C9A96E] hover:text-[#16120b]"
            >
              Request Consultation
            </a>
          </div>
        </div>
      </header>

      {/* HOW HIEIL WORKS */}
      <section id="how" className="py-20 border-b border-[#2a2621]">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-3">How HIEIL Works</h2>
            <p className="text-[#a39a8c] max-w-[620px] mx-auto text-base sm:text-lg">No hidden markup. Every quotation shows each cost on its own line.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-[#161412] border border-[#2a2621] p-7 transition-all duration-300 hover:border-[#C9A96E]/40 hover:-translate-y-1">
              <b className="font-serif text-4xl text-[#C9A96E] block mb-2">01</b>
              <h3 className="font-serif text-2xl text-white mb-2 font-medium">Choose a membership</h3>
              <p className="text-[#a39a8c] text-sm leading-relaxed m-0">Pick a 3-month, 6-month or annual plan to match how you buy.</p>
            </div>
            <div className="bg-[#161412] border border-[#2a2621] p-7 transition-all duration-300 hover:border-[#C9A96E]/40 hover:-translate-y-1">
              <b className="font-serif text-4xl text-[#C9A96E] block mb-2">02</b>
              <h3 className="font-serif text-2xl text-white mb-2 font-medium">Select handicrafts</h3>
              <p className="text-[#a39a8c] text-sm leading-relaxed m-0">Choose from our catalogue or send images, drawings or specifications for custom designs.</p>
            </div>
            <div className="bg-[#161412] border border-[#2a2621] p-7 transition-all duration-300 hover:border-[#C9A96E]/40 hover:-translate-y-1">
              <b className="font-serif text-4xl text-[#C9A96E] block mb-2">03</b>
              <h3 className="font-serif text-2xl text-white mb-2 font-medium">Review quotation</h3>
              <p className="text-[#a39a8c] text-sm leading-relaxed m-0">Product cost, service fee, packaging, transport, export costs and taxes, shown separately.</p>
            </div>
            <div className="bg-[#161412] border border-[#2a2621] p-7 transition-all duration-300 hover:border-[#C9A96E]/40 hover:-translate-y-1">
              <b className="font-serif text-4xl text-[#C9A96E] block mb-2">04</b>
              <h3 className="font-serif text-2xl text-white mb-2 font-medium">Confirm and ship</h3>
              <p className="text-[#a39a8c] text-sm leading-relaxed m-0">We coordinate sourcing, inspection and export under the agreed shipping terms.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PLANS SECTION */}
      <section id="plans" className="py-20 border-b border-[#2a2621] relative">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-3">Importer Membership Plans</h2>
            <p className="text-[#a39a8c] max-w-[640px] mx-auto text-base sm:text-lg">Membership fees are separate from product, shipping and order service costs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan) => {
              const isPop = plan.isPopular;
              return (
                <article 
                  key={plan._id || plan.name}
                  className={`bg-[#161412] border p-8 flex flex-col relative transition-all duration-300 hover:-translate-y-1.5 ${
                    isPop ? 'border-[#C9A96E] shadow-[0_0_30px_rgba(201,169,110,0.15)] bg-gradient-to-b from-[#1c1814] to-[#161412]' : 'border-[#2a2621]'
                  }`}
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {isPop && (
                      <span className="bg-[#C9A96E] text-[#16120b] text-[11px] font-bold tracking-[0.16em] uppercase py-1 px-3 rounded-xs shadow">
                        {plan.popularTag || 'Most Popular'}
                      </span>
                    )}
                    {plan.offerBadge && (
                      <span className="bg-[#ef4444]/20 border border-[#ef4444]/40 text-[#f87171] text-[11px] font-bold tracking-[0.1em] uppercase py-1 px-2.5 rounded-xs ml-auto">
                        {plan.offerBadge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-3xl text-[#C9A96E] font-medium mb-1">{plan.name}</h3>
                  <div className="text-[#a39a8c] text-sm mb-4">{plan.duration}</div>
                  
                  {/* Pricing */}
                  <div className="font-serif flex items-baseline gap-2 mb-2">
                    <span className="text-4xl sm:text-5xl font-bold text-white tracking-tight">{plan.price}</span>
                    {plan.originalPrice && (
                      <span className="text-lg text-[#70665d] line-through font-normal">{plan.originalPrice}</span>
                    )}
                  </div>

                  <p className="text-[#a39a8c] text-sm mb-6 leading-relaxed min-h-[42px]">{plan.targetAudience}</p>

                  {plan.extraHeader && (
                    <div className="text-[#C9A96E] text-xs tracking-[0.08em] uppercase font-semibold mb-3 border-b border-[#2a2621] pb-2">
                      {plan.extraHeader}
                    </div>
                  )}

                  {/* Features List */}
                  <ul className="list-none p-0 m-0 mb-6 flex-1 text-sm">
                    {(Array.isArray(plan.features) ? plan.features : []).map((feat, idx) => (
                      <li key={idx} className="py-2.5 pl-6 relative border-t border-[#2a2621] text-[#ece6dc]/90 text-[14px] leading-snug">
                        <span className="absolute left-0 top-[11px] text-[#C9A96E] text-[10px]">◆</span>
                        {feat}
                      </li>
                    ))}
                  </ul>

                  {plan.promise && (
                    <p className="font-serif italic text-base text-[#a39a8c] mb-6 pt-2 border-t border-[#2a2621]/60">
                      &ldquo;{plan.promise}&rdquo;
                    </p>
                  )}

                  <button
                    onClick={() => handleOpenModal(plan)}
                    className={`w-full py-3.5 px-6 font-semibold tracking-wider text-xs uppercase rounded-xs transition-all cursor-pointer ${
                      isPop 
                        ? 'bg-[#C9A96E] text-[#16120b] hover:bg-[#e2c994]' 
                        : 'bg-transparent text-[#C9A96E] border border-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#16120b]'
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
      <section id="compare" className="py-20 border-b border-[#2a2621]">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-3">Plans at a Glance</h2>
            <p className="text-[#a39a8c] max-w-[620px] mx-auto text-base sm:text-lg">Clear deliverables and limits, so you know exactly what each plan includes.</p>
          </div>

          <div className="overflow-x-auto border border-[#2a2621] bg-[#161412] rounded-xs">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="border-b border-[#2a2621]">
                  <th className="p-4 sm:p-5 font-serif text-lg text-[#C9A96E] font-semibold bg-[#1a1714]">Benefit</th>
                  <th className="p-4 sm:p-5 font-serif text-lg text-[#C9A96E] font-semibold bg-[#1a1714]">Essential</th>
                  <th className="p-4 sm:p-5 font-serif text-lg text-[#C9A96E] font-semibold bg-[#1a1714] border-x border-[#2a2621]">Business (Popular)</th>
                  <th className="p-4 sm:p-5 font-serif text-lg text-[#C9A96E] font-semibold bg-[#1a1714]">Global Partner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2621] text-sm">
                <tr>
                  <td className="p-4 sm:p-5 text-[#a39a8c] font-medium">Membership duration</td>
                  <td className="p-4 sm:p-5 text-white">3 months</td>
                  <td className="p-4 sm:p-5 text-[#C9A96E] font-semibold border-x border-[#2a2621] bg-[#C9A96E]/5">6 months</td>
                  <td className="p-4 sm:p-5 text-white">12 months</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 text-[#a39a8c] font-medium">Product content support</td>
                  <td className="p-4 sm:p-5 text-white">5 products</td>
                  <td className="p-4 sm:p-5 text-[#C9A96E] font-semibold border-x border-[#2a2621] bg-[#C9A96E]/5">20 products</td>
                  <td className="p-4 sm:p-5 text-white">50 products</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 text-[#a39a8c] font-medium">Sourcing review</td>
                  <td className="p-4 sm:p-5 text-white">1 introductory session</td>
                  <td className="p-4 sm:p-5 text-[#C9A96E] font-semibold border-x border-[#2a2621] bg-[#C9A96E]/5">Monthly review</td>
                  <td className="p-4 sm:p-5 text-white">Annual strategic review + scheduled reviews</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 text-[#a39a8c] font-medium">Account support</td>
                  <td className="p-4 sm:p-5 text-white">Standard</td>
                  <td className="p-4 sm:p-5 text-[#C9A96E] font-semibold border-x border-[#2a2621] bg-[#C9A96E]/5">Priority</td>
                  <td className="p-4 sm:p-5 text-white">Dedicated coordinator</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 text-[#a39a8c] font-medium">Custom-product sourcing</td>
                  <td className="p-4 sm:p-5 text-white">Included</td>
                  <td className="p-4 sm:p-5 text-[#C9A96E] font-semibold border-x border-[#2a2621] bg-[#C9A96E]/5">Priority</td>
                  <td className="p-4 sm:p-5 text-white">Priority development coordination</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 text-[#a39a8c] font-medium">Quality inspection</td>
                  <td className="p-4 sm:p-5 text-white">Coordination; cost extra</td>
                  <td className="p-4 sm:p-5 text-[#C9A96E] font-semibold border-x border-[#2a2621] bg-[#C9A96E]/5">Coordination; cost extra</td>
                  <td className="p-4 sm:p-5 text-white">Coordination; cost extra</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 text-[#a39a8c] font-medium">Order service fee</td>
                  <td className="p-4 sm:p-5 text-white">Separately quoted</td>
                  <td className="p-4 sm:p-5 text-[#C9A96E] font-semibold border-x border-[#2a2621] bg-[#C9A96E]/5">Preferential terms</td>
                  <td className="p-4 sm:p-5 text-white">Contractual preferential terms</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[#a39a8c] text-xs text-center mt-4">
            Turnaround times, revision limits and support hours are confirmed in your membership agreement.
          </p>
        </div>
      </section>

      {/* OUR PRICING PRINCIPLES */}
      <section id="pricing" className="py-20 border-b border-[#2a2621]">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-white mb-3">Our Pricing Principles</h2>
            <p className="text-[#a39a8c] max-w-[620px] mx-auto text-base sm:text-lg">Transparency is the foundation of the HIEIL model.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border-l-2 border-[#C9A96E] pl-5 py-2">
              <h3 className="font-serif text-xl font-medium text-white mb-2">Verified, not lowest</h3>
              <p className="text-[#a39a8c] text-sm leading-relaxed m-0">Manufacturer pricing is verified for every quotation. We never promise a lowest price we cannot show.</p>
            </div>
            <div className="border-l-2 border-[#C9A96E] pl-5 py-2">
              <h3 className="font-serif text-xl font-medium text-white mb-2">Fees disclosed upfront</h3>
              <p className="text-[#a39a8c] text-sm leading-relaxed m-0">Any per-order service fee is stated before you confirm an order.</p>
            </div>
            <div className="border-l-2 border-[#C9A96E] pl-5 py-2">
              <h3 className="font-serif text-xl font-medium text-white mb-2">Costs kept separate</h3>
              <p className="text-[#a39a8c] text-sm leading-relaxed m-0">Samples, inspection, shipping, customs duties and freight forwarding are quoted as separate lines.</p>
            </div>
            <div className="border-l-2 border-[#C9A96E] pl-5 py-2">
              <h3 className="font-serif text-xl font-medium text-white mb-2">Clear order minimums</h3>
              <p className="text-[#a39a8c] text-sm leading-relaxed m-0">The standard MOQ is 100 pieces where applicable. Some products may need a different MOQ.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONSULTATION ENQUIRY FORM SECTION */}
      <section id="contact" className="py-24 relative bg-gradient-to-t from-[#141210] to-[#0c0b0a]">
        <div className="max-w-[820px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-white mb-3">Start Your Sourcing Partnership</h2>
            <p className="text-[#a39a8c] max-w-[620px] mx-auto text-base sm:text-lg">
              Tell us your product categories, target market and expected order size, and we will recommend the right plan.
            </p>
          </div>

          <form onSubmit={handleSubmitEnquiry} className="bg-[#161412] border border-[#2a2621] p-6 sm:p-10 rounded-xs shadow-2xl flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#a39a8c] mb-2 font-medium">Select Plan *</label>
                <select
                  name="planName"
                  value={formData.planName}
                  onChange={handleFormChange}
                  className="w-full bg-[#0c0b0a] border border-[#2a2621] text-white p-3 rounded-xs focus:border-[#C9A96E] outline-none text-sm"
                  required
                >
                  {plans.map(p => (
                    <option key={p._id || p.name} value={p.name}>
                      {p.name} ({p.duration} - {p.price})
                    </option>
                  ))}
                  <option value="Custom Sourcing Requirement">Custom Sourcing / Enterprise Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#a39a8c] mb-2 font-medium">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="Your full name"
                  required
                  className="w-full bg-[#0c0b0a] border border-[#2a2621] text-white p-3 rounded-xs focus:border-[#C9A96E] outline-none text-sm placeholder-[#555]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#a39a8c] mb-2 font-medium">Business Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="name@company.com"
                  required
                  className="w-full bg-[#0c0b0a] border border-[#2a2621] text-white p-3 rounded-xs focus:border-[#C9A96E] outline-none text-sm placeholder-[#555]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#a39a8c] mb-2 font-medium">Phone / WhatsApp</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-[#0c0b0a] border border-[#2a2621] text-white p-3 rounded-xs focus:border-[#C9A96E] outline-none text-sm placeholder-[#555]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#a39a8c] mb-2 font-medium">Company / Brand Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleFormChange}
                  placeholder="e.g. Acme Imports Ltd."
                  className="w-full bg-[#0c0b0a] border border-[#2a2621] text-white p-3 rounded-xs focus:border-[#C9A96E] outline-none text-sm placeholder-[#555]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#a39a8c] mb-2 font-medium">Target Market / Destination</label>
                <input
                  type="text"
                  name="targetMarket"
                  value={formData.targetMarket}
                  onChange={handleFormChange}
                  placeholder="e.g. United States, UK, Europe, UAE"
                  className="w-full bg-[#0c0b0a] border border-[#2a2621] text-white p-3 rounded-xs focus:border-[#C9A96E] outline-none text-sm placeholder-[#555]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#a39a8c] mb-2 font-medium">Handicraft Categories</label>
                <input
                  type="text"
                  name="productCategories"
                  value={formData.productCategories}
                  onChange={handleFormChange}
                  placeholder="e.g. Blue Pottery, Wooden Decor, Metal Art"
                  className="w-full bg-[#0c0b0a] border border-[#2a2621] text-white p-3 rounded-xs focus:border-[#C9A96E] outline-none text-sm placeholder-[#555]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#a39a8c] mb-2 font-medium">Expected Order / Shipment Size</label>
                <select
                  name="expectedOrderSize"
                  value={formData.expectedOrderSize}
                  onChange={handleFormChange}
                  className="w-full bg-[#0c0b0a] border border-[#2a2621] text-white p-3 rounded-xs focus:border-[#C9A96E] outline-none text-sm"
                >
                  <option value="">-- Select Order Volume --</option>
                  <option value="Sample / Trial Order">Sample / Trial Order</option>
                  <option value="$5,000 - $15,000">$5,000 - $15,000</option>
                  <option value="$15,000 - $50,000">$15,000 - $50,000</option>
                  <option value="$50,000 - $100,000+">$50,000 - $100,000+</option>
                  <option value="Full Container Load (FCL)">Full Container Load (FCL)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#a39a8c] mb-2 font-medium">Specific Requirements / Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                rows={4}
                placeholder="Tell us about custom design needs, required timelines, or questions regarding our sourcing..."
                className="w-full bg-[#0c0b0a] border border-[#2a2621] text-white p-3 rounded-xs focus:border-[#C9A96E] outline-none text-sm placeholder-[#555] resize-y"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#C9A96E] text-[#16120b] font-bold py-4 px-8 rounded-xs tracking-[0.08em] uppercase transition-all duration-300 hover:bg-[#e2c994] disabled:opacity-50 cursor-pointer shadow-lg hover:shadow-[#C9A96E]/20"
              >
                {submitting ? 'Submitting Application...' : 'Submit Membership Application'}
              </button>
            </div>

            <div className="text-center text-xs text-[#70665d]">
              Direct assistance? Email us at <a href="mailto:indiaexport@hieil.com" className="text-[#C9A96E] hover:underline">indiaexport@hieil.com</a> or message on WhatsApp.
            </div>
          </form>
        </div>
      </section>

      {/* POPUP MODAL FOR QUICK PLAN ENQUIRY */}
      {isModalOpen && selectedPlanForModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#161412] border border-[#C9A96E]/40 p-6 sm:p-8 w-full max-w-lg relative rounded-xs shadow-2xl max-h-[90vh] overflow-y-auto">
            <button 
              className="absolute top-4 right-4 text-[#888] hover:text-[#C9A96E] transition-colors p-1"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={24} />
            </button>

            <div className="mb-6">
              <span className="text-[#C9A96E] text-xs uppercase tracking-widest font-semibold block mb-1">Membership Application</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-white">{selectedPlanForModal.name}</h3>
              <div className="text-[#a39a8c] text-sm mt-1">
                Duration: <span className="text-white font-medium">{selectedPlanForModal.duration}</span> &middot; Investment: <span className="text-[#C9A96E] font-bold">{selectedPlanForModal.price}</span>
              </div>
            </div>

            <form onSubmit={handleSubmitEnquiry} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#a39a8c] mb-1 font-medium">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  placeholder="Full name"
                  className="w-full bg-[#0c0b0a] border border-[#2a2621] text-white p-3 rounded-xs focus:border-[#C9A96E] outline-none text-sm placeholder-[#555]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#a39a8c] mb-1 font-medium">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  placeholder="Business email"
                  className="w-full bg-[#0c0b0a] border border-[#2a2621] text-white p-3 rounded-xs focus:border-[#C9A96E] outline-none text-sm placeholder-[#555]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#a39a8c] mb-1 font-medium">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="Phone / WhatsApp"
                    className="w-full bg-[#0c0b0a] border border-[#2a2621] text-white p-3 rounded-xs focus:border-[#C9A96E] outline-none text-sm placeholder-[#555]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#a39a8c] mb-1 font-medium">Company</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleFormChange}
                    placeholder="Company name"
                    className="w-full bg-[#0c0b0a] border border-[#2a2621] text-white p-3 rounded-xs focus:border-[#C9A96E] outline-none text-sm placeholder-[#555]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#a39a8c] mb-1 font-medium">Product Focus / Sourcing Requirements</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  rows={3}
                  placeholder="Categories of interest, expected quantities, custom designs..."
                  className="w-full bg-[#0c0b0a] border border-[#2a2621] text-white p-3 rounded-xs focus:border-[#C9A96E] outline-none text-sm placeholder-[#555] resize-y"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#C9A96E] text-[#16120b] font-bold py-3.5 px-6 rounded-xs tracking-[0.08em] uppercase transition-all duration-300 hover:bg-[#e2c994] disabled:opacity-50 cursor-pointer shadow-lg mt-2"
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
