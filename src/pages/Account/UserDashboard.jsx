import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Heart, FileText, CheckCircle, Crown, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import api from '../../config/api';
import Swal from 'sweetalert2';

const UserDashboard = () => {
  const { user, token, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [inquiries, setInquiries] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token, activeTab]);

  const fetchDashboardData = async () => {
    setDataLoading(true);
    try {
      if (activeTab === 'inquiries' || activeTab === 'quotations') {
        const res = await api.get('/users/auth/inquiries', { headers: { Authorization: 'Bearer ' + token } });
        setInquiries(res.data.inquiries || []);
        setQuotations(res.data.quotations || []);
      } else if (activeTab === 'orders') {
        const res = await api.get('/users/auth/orders', { headers: { Authorization: 'Bearer ' + token } });
        setOrders(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleAcceptQuotation = async (quotationId) => {
    try {
      const result = await Swal.fire({
        title: 'Accept Quotation & Place Order?',
        text: 'Are you sure you want to proceed with this quotation?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#c8956c',
        cancelButtonColor: '#ef4444',
        confirmButtonText: 'Yes, Place Order'
      });
      
      if (result.isConfirmed) {
        await api.post(`/users/auth/quotations/${quotationId}/accept`, {}, {
          headers: { Authorization: 'Bearer ' + token }
        });
        Swal.fire('Success', 'Order placed successfully!', 'success');
        fetchDashboardData();
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Failed to accept quotation', 'error');
    }
  };

  if (loading) return <div className="min-h-screen bg-[#15110F] text-white flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/auth" />;

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <User size={18} /> },
    { id: 'inquiries', label: 'My Inquiries', icon: <FileText size={18} /> },
    { id: 'quotations', label: 'My Quotations', icon: <FileText size={18} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={18} /> },
    { id: 'orders', label: 'Orders', icon: <CheckCircle size={18} /> },
    { id: 'membership', label: 'My Membership', icon: <Crown size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#15110F] pt-[120px] pb-[60px] font-sans">
      <div className="max-w-[1200px] mx-auto px-5 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-[300px] shrink-0">
          <div className="bg-[rgba(28,23,19,0.6)] backdrop-blur-[10px] border border-[#2c241c] rounded-2xl p-6 sticky top-[100px]">
            <h3 className="text-2xl font-serif text-white mb-6 uppercase tracking-[1px]">My Account</h3>
            <div className="flex flex-col gap-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ' + (activeTab === tab.id ? 'bg-[#c8956c] text-[#15110F] font-bold' : 'text-[#b5aaa0] hover:bg-[#2c241c] hover:text-white')}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
              <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors text-left mt-4">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[rgba(28,23,19,0.6)] backdrop-blur-[10px] border border-[#2c241c] rounded-2xl p-6 md:p-8 text-white">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div>
              <h3 className="text-2xl font-serif text-[#c8956c] mb-6">Profile Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#15110F] p-6 rounded-xl border border-[#2c241c]">
                <div>
                  <label className="block text-sm text-[#b5aaa0] mb-1">Full Name</label>
                  <p className="text-lg">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm text-[#b5aaa0] mb-1">Email</label>
                  <p className="text-lg">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm text-[#b5aaa0] mb-1">Phone</label>
                  <p className="text-lg">{user.phone || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm text-[#b5aaa0] mb-1">Company</label>
                  <p className="text-lg">{user.companyName || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
          
                      {/* INQUIRIES TAB */}
            {activeTab === 'inquiries' && (
              <div>
                <h3 className="text-2xl font-serif text-[#c8956c] mb-6">My Inquiries</h3>
                {dataLoading ? (
                  <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-[#c8956c] border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {inquiries.length === 0 ? (
                      <p className="text-[#b5aaa0]">You haven't made any inquiries yet.</p>
                    ) : (
                      <>
                        {inquiries.filter(i => i.status !== 'Accepted').map(inq => (
                          <div key={inq._id} className="bg-[#15110F] p-6 rounded-xl border border-[#2c241c]">
                            <div className="flex justify-between items-start mb-4">
                              <h4 className="font-serif text-lg text-white">{inq.product || 'General Inquiry'}</h4>
                              <span className="bg-[#2c241c] text-[#b5aaa0] text-xs px-2 py-1 rounded uppercase">{inq.status || 'Pending'}</span>
                            </div>
                            <p className="text-sm text-[#b5aaa0] mb-2"><span className="text-[#b5aaa0]">Quantity:</span> {inq.qty || 'N/A'}</p>
                            <p className="text-sm text-[#b5aaa0] mb-4"><span className="text-[#b5aaa0]">Message:</span> {inq.message || 'No additional message'}</p>
                            
                            {inq.productId && (
                              <Link 
                                to={`/product/${inq.productId}`}
                                className="inline-block mt-2 bg-[#2c241c] hover:bg-[#c8956c] hover:text-[#15110F] text-[#b5aaa0] text-xs font-bold tracking-wide uppercase px-4 py-2 rounded transition-colors"
                              >
                                View Product
                              </Link>
                            )}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* QUOTATIONS TAB */}
            {activeTab === 'quotations' && (
              <div>
                <h3 className="text-2xl font-serif text-[#c8956c] mb-6">My Quotations</h3>
                {dataLoading ? (
                  <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-[#c8956c] border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {quotations.length === 0 ? (
                      <p className="text-[#b5aaa0]">No quotations received yet.</p>
                    ) : (
                      <>
                        {quotations.filter(q => q.status !== 'Accepted').map(quote => (
                          <div key={quote._id} className="bg-[#15110F] p-6 rounded-xl border border-[#c8956c] relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-[#c8956c] text-[#15110F] text-xs font-bold px-3 py-1 uppercase rounded-bl-lg">Quotation Received</div>
                            <h4 className="font-serif text-xl mb-2 text-white">Quotation #{quote.quoteNo || quote._id.substring(0,6)}</h4>
                            <div className="grid grid-cols-2 gap-4 mb-4 text-[#b5aaa0] text-sm">
                              <div><span className="block text-[#b5aaa0]">Product</span>{quote.product}</div>
                              <div><span className="block text-[#b5aaa0]">Total Amount</span>${quote.total}</div>
                              <div><span className="block text-[#b5aaa0]">Valid Till</span>{quote.validTill || 'N/A'}</div>
                              <div><span className="block text-[#b5aaa0]">Status</span><span className={`font-bold ${quote.status === 'Accepted' ? 'text-green-500' : 'text-white'}`}>{quote.status || 'Sent'}</span></div>
                            </div>
                            {quote.status !== 'Accepted' && (
                              <button 
                                onClick={() => handleAcceptQuotation(quote._id)}
                                className="mt-2 bg-[#c8956c] text-[#15110F] px-5 py-2 rounded font-bold tracking-wide hover:bg-white transition-colors"
                              >
                                Accept Quotation & Place Order
                              </button>
                            )}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div>
              <h3 className="text-2xl font-serif text-[#c8956c] mb-6">My Wishlist</h3>
              {user?.wishlist?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.wishlist.map(item => (
                    <div key={item._id || item} className="bg-[#15110F] overflow-hidden rounded-xl border border-[#2c241c] flex flex-col transition-all hover:border-[#c8956c]">
                      <img src={item.mainImage} alt={item.productName || 'Product'} className="w-full h-[200px] object-cover" />
                      <div className="p-4">
                        <h4 className="font-serif text-lg mb-3 line-clamp-1">{item.productName || 'Product'}</h4>
                        <Link to={`/product/${item._id}`} className="text-[#c8956c] text-sm uppercase tracking-wider font-bold hover:text-white transition-colors">
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#b5aaa0]">Your wishlist is currently empty.</p>
              )}
            </div>
          )}
          

          {/* MEMBERSHIP TAB */}
          {activeTab === 'membership' && (
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-2xl font-serif text-[#c8956c] m-0">My Importer Membership</h3>
                  <p className="text-[#b5aaa0] text-sm mt-1">Manage and track your sourcing membership privileges and applications.</p>
                </div>
                <Link
                  to="/membership"
                  className="bg-[#c8956c] text-[#15110F] font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded hover:bg-[#e2c994] transition-all flex items-center gap-1.5"
                >
                  <Sparkles size={14} /> Explore All Plans
                </Link>
              </div>

              {dataLoading ? (
                <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-[#c8956c] border-t-transparent rounded-full animate-spin"></div></div>
              ) : (
                <div className="flex flex-col gap-6">
                  {/* Check for active membership */}
                  {(() => {
                    const activeSub = memberships.find(m => m.status === 'Active');
                    if (activeSub) {
                      return (
                        <div className="bg-gradient-to-r from-[#1c1814] via-[#241e19] to-[#1c1814] border-2 border-[#c8956c] p-6 rounded-2xl relative shadow-[0_0_30px_rgba(200,149,108,0.15)]">
                          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-[#c8956c]/20 border border-[#c8956c] flex items-center justify-center text-[#c8956c]">
                                <Crown size={24} />
                              </div>
                              <div>
                                <span className="bg-[#c8956c] text-[#15110F] text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block mb-1">
                                  ACTIVE MEMBER
                                </span>
                                <h4 className="font-serif text-2xl text-white font-medium m-0">{activeSub.planName}</h4>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-[#c8956c]">{activeSub.price}</div>
                              <div className="text-xs text-[#b5aaa0]">{activeSub.duration}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#2c241c] text-sm">
                            <div>
                              <span className="text-xs text-[#b5aaa0] block">Start Date</span>
                              <span className="text-white font-medium">{activeSub.startDate ? new Date(activeSub.startDate).toLocaleDateString() : new Date(activeSub.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span className="text-xs text-[#b5aaa0] block">End / Renewal Date</span>
                              <span className="text-white font-medium">{activeSub.endDate ? new Date(activeSub.endDate).toLocaleDateString() : 'Active Ongoing'}</span>
                            </div>
                            <div>
                              <span className="text-xs text-[#b5aaa0] block">Support Channel</span>
                              <a 
                                href="https://wa.me/919050001972?text=Hi!%20I%20am%20an%20active%20HIEIL%20member%20inquiring%20about%20my%20sourcing." 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-[#25D366] font-bold text-xs inline-flex items-center gap-1 hover:underline mt-0.5"
                              >
                                Priority WhatsApp Sourcing
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* All applications / enquiries list */}
                  <div>
                    <h4 className="text-lg font-serif text-white mb-3">Membership Inquiries & Applications</h4>
                    {memberships.length === 0 ? (
                      <div className="bg-[#15110F] border border-[#2c241c] p-8 rounded-xl text-center">
                        <Crown size={36} className="mx-auto text-[#c8956c] mb-3 opacity-60" />
                        <p className="text-white font-medium mb-1">No Membership Subscription Found</p>
                        <p className="text-[#b5aaa0] text-sm max-w-md mx-auto mb-5">
                          Join HIEIL's Importer Membership to access verified manufacturer pricing, custom handicraft sourcing, and transparent quotation coordination.
                        </p>
                        <Link
                          to="/membership"
                          className="inline-block bg-[#c8956c] text-[#15110F] font-bold text-xs uppercase tracking-wider py-3 px-6 rounded hover:bg-[#e2c994] transition-all"
                        >
                          View Membership Plans & Apply
                        </Link>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {memberships.map((sub) => (
                          <div key={sub._id} className="bg-[#15110F] border border-[#2c241c] p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-[#c8956c]/40 transition-colors">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-serif text-lg text-white font-medium">{sub.planName}</span>
                                <span className="text-xs text-[#b5aaa0]">&middot; {sub.duration || 'Plan'}</span>
                                {sub.price && <span className="text-xs text-[#c8956c] font-bold">({sub.price})</span>}
                              </div>
                              <div className="text-xs text-[#b5aaa0]">
                                Applied on {new Date(sub.createdAt).toLocaleDateString()}
                                {sub.companyName && <span> &middot; {sub.companyName}</span>}
                                {sub.targetMarket && <span> &middot; Market: {sub.targetMarket}</span>}
                              </div>
                              {sub.notes && (
                                <div className="text-xs text-[#c8956c] bg-[#c8956c]/10 p-2 rounded mt-2 border border-[#c8956c]/20">
                                  <strong>HIEIL Note:</strong> {sub.notes}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-3">
                              <span className={`text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wider ${
                                sub.status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                sub.status === 'Contacted' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                sub.status === 'Expired' ? 'bg-gray-500/20 text-gray-400 border border-gray-500/30' :
                                sub.status === 'Rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              }`}>
                                {sub.status || 'Pending'}
                              </span>
                              <a
                                href="https://wa.me/919050001972?text=Hi!%20I%20have%20an%20inquiry%20regarding%20my%20membership%20application."
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-[#b5aaa0] hover:text-[#c8956c] underline"
                              >
                                Need Help?
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div>
              <h3 className="text-2xl font-serif text-[#c8956c] mb-6">Order History</h3>
              {dataLoading ? (
                <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-[#c8956c] border-t-transparent rounded-full animate-spin"></div></div>
              ) : (
                <div className="flex flex-col gap-4">
                  {orders.length === 0 ? (
                    <p className="text-[#b5aaa0]">You haven't placed any orders yet.</p>
                  ) : (
                    orders.map(order => (
                      <div key={order._id} className="bg-[#15110F] p-5 rounded-xl border border-[#2c241c] flex flex-col md:flex-row justify-between items-start md:items-start gap-4">
                        <div className="flex-1 w-full">
                          <div className="text-[#c8956c] font-bold mb-1">{order.orderNo || order._id}</div>
                          <div className="text-white text-lg font-serif">{order.product}</div>
                          <div className="text-sm text-[#b5aaa0] mt-1 mb-4">{new Date(order.createdAt).toLocaleDateString()}</div>
                          
                          <div className="w-full bg-[#110e0c] p-4 rounded-lg">
                            <h5 className="text-[#c8956c] font-bold mb-3 text-sm">PAYMENT ENTRIES</h5>
                              
                              {/* Financial Summary */}
                              <div className="flex flex-wrap gap-4 mb-4 bg-[#15110F] p-3 rounded border border-[#2c241c]">
                                <div className="flex-1">
                                  <span className="block text-[#b5aaa0] text-xs">TOTAL AMOUNT</span>
                                  <span className="text-white font-bold">${order.totalAmount || 0}</span>
                                </div>
                                <div className="flex-1">
                                  <span className="block text-[#b5aaa0] text-xs">TOTAL PAID</span>
                                  <span className="text-green-500 font-bold">
                                    ${(order.installments || []).reduce((sum, inst) => inst.status === 'Paid' ? sum + (parseFloat(inst.amount) || 0) : sum, 0).toFixed(2)}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <span className="block text-[#b5aaa0] text-xs">PENDING BALANCE</span>
                                  <span className="text-red-500 font-bold">
                                    ${(
                                      parseFloat(order.totalAmount || 0) - 
                                      (order.installments || []).reduce((sum, inst) => inst.status === 'Paid' ? sum + (parseFloat(inst.amount) || 0) : sum, 0)
                                    ).toFixed(2)}
                                  </span>
                                </div>
                              </div>

                              {order.installments?.length > 0 ? (
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm text-left">
                                    <thead className="text-[#b5aaa0] border-b border-[#2c241c]">
                                      <tr>
                                        <th className="py-2">Date/Due</th>
                                        <th className="py-2">Title</th>
                                        <th className="py-2">Amount</th>
                                        <th className="py-2">Mode</th>
                                        <th className="py-2">Reference</th>
                                        <th className="py-2">Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {order.installments.map((p, idx) => (
                                        <tr key={idx} className="border-b border-[#2c241c]/50 text-white">
                                          <td className="py-2">{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : (p.dueDate ? new Date(p.dueDate).toLocaleDateString() : 'N/A')}</td>
                                          <td className="py-2">{p.title || 'Installment'}</td>
                                          <td className="py-2 font-bold">${p.amount}</td>
                                          <td className="py-2 uppercase">{p.paymentMode || '-'}</td>
                                          <td className="py-2 text-[#b5aaa0]">{p.reference || '-'}</td>
                                          <td className="py-2">
                                            <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${p.status === 'Paid' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                              {p.status || 'Pending'}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p className="text-[#b5aaa0] text-sm italic">
                                  No payment entries yet. Payments are handled directly (Bank/UPI). 
                                  Admin will update this log once payment is received.
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-left md:text-right shrink-0">
                          <div className="text-xl text-white font-bold mb-2">${order.totalAmount}</div>
                          <span className="bg-[#c8956c]/20 text-[#c8956c] text-xs px-2 py-1 rounded uppercase font-bold tracking-wider">{order.status || 'Processing'}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
