import React from 'react';
import * as FaIcons from 'react-icons/fa';
import { FaBus, FaCar, FaCheck, FaCommentAlt, FaDownload, FaEdit, FaEnvelope, FaExternalLinkAlt, FaEye, FaFileAlt, FaFilePdf, FaImages, FaList, FaMoneyBillAlt, FaPhone, FaPhoneAlt, FaPlane, FaSave, FaStar, FaStore, FaTh, FaTimes, FaTrash, FaTrashAlt, FaTruck, FaUsers, FaWhatsapp } from 'react-icons/fa';


const VendorNameDisplay = ({ vendorId, fallbackStyle = {} }) => {
  const [name, setName] = React.useState(null);

  React.useEffect(() => {
    if (!vendorId) return;
    if (typeof vendorId === 'object' && vendorId.vendorName) {
      setName(vendorId.vendorName);
      return;
    }
    const fetchVendor = async () => {
      try {
        const { default: api } = await import('../../config/api');
        const res = await api.get(`/vendors/${vendorId}`);
        if (res.data && res.data.vendorName) {
          setName(res.data.vendorName);
        } else {
          setName(vendorId);
        }
      } catch(e) {
        setName(vendorId);
      }
    };
    fetchVendor();
  }, [vendorId]);

  if (!vendorId) return React.createElement('span', {style: {color: '#9ca3af'}}, 'None');
  return React.createElement('span', { style: fallbackStyle }, name || (typeof vendorId === 'object' ? vendorId._id : vendorId));
};

const formatImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
};

import Swal from 'sweetalert2';
import api from './api';

export const genericData = [
];

export const categoryData = [
  { id: 1, name: 'Handcrafted Wooden Products', image: 'image.jpg', status: 'ACTIVE' },
  { id: 2, name: 'Handcrafted Metal Products', image: 'image2.jpg', status: 'ACTIVE' },
  { id: 3, name: 'Handcrafted Blue Pottery', image: 'image3.jpg', status: 'ACTIVE' },
];

export const subcategoryData = [
  { id: 1, category: 'Handcrafted Wooden Products', subcategoryName: 'Preparation Tools', description: '' },
  { id: 2, category: 'Handcrafted Wooden Products', subcategoryName: 'Storage and Organization', description: '' },
  { id: 3, category: 'Handcrafted Metal Products', subcategoryName: 'Candle Holder', description: '' },
  { id: 4, category: 'Handcrafted Blue Pottery', subcategoryName: 'Luxury kitchen Collections', description: '' },
];

export const productData = [
  { id: 1, category: 'Handcrafted Blue Pottery', subCategory: 'Luxury Dining & Tableware', productName: 'Serving Tray', tag: 'TOP PICK', sizes: '21 x 11.5 x 5 cm', material: 'stone' },
  { id: 2, category: 'Handcrafted Blue Pottery', subCategory: 'Luxury Decorative Collections', productName: 'Decorative', tag: 'TRENDING NOW', sizes: '20 cm to 43 cm', material: 'stone' },
];

export const blogData = [
  { id: 1, category: 'Handicraft', title: 'The art of pottery', tag: 'Art', image: 'blog1.jpg' },
  { id: 2, category: 'Woodwork', title: 'Wooden carvings explained', tag: 'Wood', image: 'blog2.jpg' },
];

export const testimonialData = [
  { id: 7, date: '22 Mar 2026', userDetails: 'Sakura, Business Man', rating: '5 Stars', city: 'JAPAN, TOKYO', message: 'I recently purchased a beautiful handicraft...', status: 'APPROVED' },
  { id: 6, date: '23 Feb 2026', userDetails: 'test test', rating: '3 Stars', city: 'CITY', message: 'message', status: 'REJECTED' },
];

export const galleryData = [
  { id: 1, date: '2026-06-20', userDetails: 'John Doe', submittedPhotos: '3 photos', status: 'PENDING' },
  { id: 2, date: '2026-06-21', userDetails: 'Jane Smith', submittedPhotos: '1 photo', status: 'APPROVED' },
];

export const inquiryData = [
  { id: 1, product: 'Serving Tray', customer: 'Alice', contact: 'alice@email.com', message: 'I want 50 pieces' },
  { id: 2, product: 'Candle Holder', customer: 'Bob', contact: 'bob@email.com', message: 'Do you ship internationally?' },
];

const getCols = (title, specificCols = null) => ({
  title: `${title} Details`,
  headers: specificCols || [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'createdAt', label: 'Created At' }
  ]
});

const manageVendorInstallments = async (row, refresh) => {
    try {
        const resp = await api.get(`/vendor-orders/${row._id || row.id}`);
        const order = resp.data;
        let installments = order.installments || [];

        const agreedPrice = parseFloat(order.agreedPriceInr) || 0;
        const totalPaid = installments.reduce((sum, inst) => inst.status === 'Paid' ? sum + (parseFloat(inst.amount) || 0) : sum, 0);
        const isFullPaid = totalPaid >= agreedPrice;

        let html = '';
        if (isFullPaid && agreedPrice > 0) {
            html += '<div style="background-color: #dcfce7; color: #166534; padding: 12px; border-radius: 6px; font-weight: bold; margin-bottom: 15px; border: 1px solid #bbf7d0; font-size: 16px;">✓ FULL PAID (' + agreedPrice + ')</div>';
        }

        html += '<table style="width:100%; text-align:left; font-size:14px; margin-bottom:10px; border-collapse:collapse;">';
        html += '<tr style="border-bottom:1px solid #ccc"><th>Title</th><th>Amount</th><th>Status</th></tr>';
        if (installments.length === 0) {
            html += '<tr><td colspan="3" style="text-align:center; padding:10px;">No installments found.</td></tr>';
        }
        installments.forEach((inst, i) => {
            html += `<tr style="border-bottom:1px solid #eee">
                <td style="padding:5px 0">${inst.title}</td>
                <td style="padding:5px 0">${inst.amount}</td>
                <td style="padding:5px 0">
                    ${inst.status === 'Paid' ? '<span style="color:green; font-weight:bold;">Paid</span>' : `<button id="pay-btn-${i}" class="swal2-confirm swal2-styled" style="padding:4px 8px; font-size:12px; margin:0">Pay</button>`}
                </td>
            </tr>`;
        });
        html += '</table>';

        const result = await Swal.fire({
            title: 'Manage Installments',
            html: html,
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Add Installment',
            cancelButtonText: 'Close',
            didOpen: () => {
                if (isFullPaid && agreedPrice > 0) {
                    const btn = Swal.getConfirmButton();
                    if (btn) {
                        btn.disabled = true;
                        btn.style.backgroundColor = '#ccc';
                        btn.style.color = '#666';
                        btn.style.cursor = 'not-allowed';
                        btn.title = 'Order is fully paid';
                    }
                }
                installments.forEach((inst, i) => {
                    if (inst.status !== 'Paid') {
                        const btn = document.getElementById(`pay-btn-${i}`);
                        if (btn) {
                            btn.onclick = async () => {
                                const { value: formValues } = await Swal.fire({
                                    title: 'Mark as Paid',
                                    html: `
                                        <select id="pay-mode" class="swal2-select" style="width: 80%; display: flex; margin: 15px auto; padding: 0 15px; height: 50px; font-size: 16px;">
                                            <option value="" disabled selected>Select Payment Mode</option>
                                            <option value="Bank Transfer">Bank Transfer (NEFT/RTGS)</option>
                                            <option value="UPI">UPI</option>
                                            <option value="Cash">Cash</option>
                                            <option value="Cheque">Cheque</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <input id="pay-ref" class="swal2-input" placeholder="Reference / UTR No.">
                                    `,
                                    preConfirm: () => {
                                        const mode = document.getElementById('pay-mode').value;
                                        if (!mode) {
                                            Swal.showValidationMessage('Please select a payment mode');
                                            return false;
                                        }
                                        return [mode, document.getElementById('pay-ref').value];
                                    }
                                });
                                if (formValues) {
                                    installments[i].status = 'Paid';
                                    installments[i].paymentMode = formValues[0];
                                    installments[i].reference = formValues[1];
                                    installments[i].paymentDate = new Date();
                                    
                                    try {
                                        const paidInsts = installments.filter(inst => inst.status === 'Paid');
                                          let newAdvance = parseFloat(order.advancePaidInr) || 0;
                                          let newBalance = parseFloat(order.balancePaidInr) || 0;
                                          
                                          if (paidInsts.length > 0) {
                                              if (!order.advancePaidInr || parseFloat(order.advancePaidInr) === 0) {
                                                  newAdvance = parseFloat(paidInsts[0].amount) || 0;
                                                  newBalance = paidInsts.slice(1).reduce((sum, x) => sum + (parseFloat(x.amount) || 0), 0);
                                              } else {
                                                  if (newAdvance === (parseFloat(paidInsts[0].amount) || 0)) {
                                                      newBalance = paidInsts.slice(1).reduce((sum, x) => sum + (parseFloat(x.amount) || 0), 0);
                                                  } else {
                                                      newBalance = paidInsts.reduce((sum, x) => sum + (parseFloat(x.amount) || 0), 0);
                                                  }
                                              }
                                          }
                                          
                                          const newTotalPaid = newAdvance + newBalance;
                                          const newIsFullPaid = newTotalPaid >= agreedPrice;
                                          
                                          const payload = { 
                                              installments,
                                              advancePaidInr: newAdvance,
                                              balancePaidInr: newBalance
                                          };
                                          
                                          if (newIsFullPaid && agreedPrice > 0) {
                                              payload.status = 'Goods Received';
                                          } else if (newAdvance > 0 && order.status === 'Pending') {
                                              // First advance payment received → auto start production
                                              payload.status = 'Production Started';
                                          }
                                          await api.put(`/vendor-orders/${order._id}`, payload);
                                          
                                          order.advancePaidInr = newAdvance;
                                          order.balancePaidInr = newBalance;
                                          order.status = payload.status || order.status;
                                        
                                        // Log to vendor payouts history
                                        await api.post('/vendor-payouts', {
                                            vendorId: order.vendorId,
                                            invoiceId: order.poNumber || '-', 
                                            invoiceAmount: order.agreedPriceInr || 0,
                                            commission: installments[i].title || 'Installment',
                                            payoutAmount: installments[i].amount,
                                            status: 'Released'
                                        });

                                        Swal.fire('Paid!', '', 'success').then(() => { if (typeof refresh === 'function') { refresh(); } manageVendorInstallments(row, refresh); });
                                    } catch (err) {
                                        Swal.fire('Error', 'Failed to update payment', 'error');
                                    }
                                }
                            };
                        }
                    }
                });
            }
        });

        if (result.isConfirmed) {
            const { value: newInst } = await Swal.fire({
                title: 'New Installment',
                html: '<input id="inst-title" class="swal2-input" placeholder="Title (e.g. Advance)"><input id="inst-amount" type="number" class="swal2-input" placeholder="Amount">',
                preConfirm: () => {
                    return {
                        title: document.getElementById('inst-title').value,
                        amount: document.getElementById('inst-amount').value,
                        status: 'Pending'
                    };
                }
            });
            if (newInst && newInst.title && newInst.amount) {
                installments.push(newInst);
                const paidInsts = installments.filter(inst => inst.status === 'Paid');
                                          let newAdvance = parseFloat(order.advancePaidInr) || 0;
                                          let newBalance = parseFloat(order.balancePaidInr) || 0;
                                          
                                          if (paidInsts.length > 0) {
                                              if (!order.advancePaidInr || parseFloat(order.advancePaidInr) === 0) {
                                                  newAdvance = parseFloat(paidInsts[0].amount) || 0;
                                                  newBalance = paidInsts.slice(1).reduce((sum, x) => sum + (parseFloat(x.amount) || 0), 0);
                                              } else {
                                                  if (newAdvance === (parseFloat(paidInsts[0].amount) || 0)) {
                                                      newBalance = paidInsts.slice(1).reduce((sum, x) => sum + (parseFloat(x.amount) || 0), 0);
                                                  } else {
                                                      newBalance = paidInsts.reduce((sum, x) => sum + (parseFloat(x.amount) || 0), 0);
                                                  }
                                              }
                                          }
                                          
                                          const newTotalPaid = newAdvance + newBalance;
                                          const newIsFullPaid = newTotalPaid >= agreedPrice;
                                          
                                          const payload = { 
                                              installments,
                                              advancePaidInr: newAdvance,
                                              balancePaidInr: newBalance
                                          };
                                          
                                          if (newIsFullPaid && agreedPrice > 0) {
                                              payload.status = 'Goods Received';
                                          } else if (newAdvance > 0 && order.status === 'Pending') {
                                              payload.status = 'Production Started';
                                          }
                                          await api.put(`/vendor-orders/${order._id}`, payload);
                                          
                                          order.advancePaidInr = newAdvance;
                                          order.balancePaidInr = newBalance;
                                          order.status = payload.status || order.status;
                Swal.fire('Added!', '', 'success').then(() => { if (typeof refresh === 'function') { refresh(); } manageVendorInstallments(row, refresh); });
            }
        }
    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Failed to load installments', 'error');
    }
};

export const pageConfigs = [

  { 
    path: 'subcategories', 
    title: 'Subcategory List', 
    subtitle: 'All Subcategories',
    breadcrumbParent: 'Subcategories',
    formCardTitle: 'SUBCATEGORY FORM',
    formSubtitle: 'Welcome to Hieil Application',
    formTitleAdd: 'Add Subcategory',
    formTitleEdit: 'Edit Subcategory',
    columns: {
      title: 'VIEW SUBCATEGORY',
      icon: 'list',
      addButtonText: 'Add New SubCategory',
      formSubmitText: 'Add Subcategory',
      headers: [
        { key: 'id', label: '#' },
        { 
          key: 'category', 
          label: 'Category',
          type: 'select',
          formLabel: 'Select Category',
          options: ['Handcrafted Wooden Products', 'Handcrafted Metal Products', 'Handcrafted Blue Pottery', 'Handcrafted Marble Products']
        },
        { key: 'subcategoryName', label: 'Subcategory Name', formLabel: 'Subcategory Name', placeholder: 'Enter subcategory name' },
        { key: 'description', label: 'Description', formLabel: 'Subcategory Description', placeholder: 'Enter subcategory description' }
      ]
    },
    data: subcategoryData
  },
  { 
    path: 'products', 
    title: 'Show Product', 
    subtitle: 'Welcome to Hieil Application',
    breadcrumbParent: 'Products',
    formCardTitle: 'PRODUCT FORM',
    formSubtitle: 'Welcome to Hieil Application',
    formTitleAdd: 'Add Product',
    formTitleEdit: 'Edit Product',
    columns: {
      title: 'PRODUCT LIST',
      icon: 'list',
      addButtonText: 'Add New Product',
      formSubmitText: 'Save Product',
      headers: [
        { key: 'id', label: 'ID', hideInForm: true },
        { key: 'category', label: 'Category', type: 'select', formLabel: 'Select Category *', options: ['Handcrafted Blue Pottery', 'Handcrafted Wooden Products'] },
        { key: 'subCategory', label: 'SubCategory', type: 'select', formLabel: 'Select Sub-Category *', options: ['Luxury Dining & Tableware', 'Luxury Decorative Collections', 'Preparation Tools'] },
        { key: 'productName', label: 'Product Name', formLabel: 'Product Name *', placeholder: 'Enter Product Name' },
        { key: 'tag', label: 'Tag', formLabel: 'Tag Name (Optional)', placeholder: 'Enter Product Tag', required: false },
        { key: 'highlight', label: 'Highlight', type: 'textarea', formLabel: 'Product Highlight (Optional)', placeholder: 'Enter Highlight (e.g. Bestseller)', required: false, minWidth: '3600px' },
        { key: 'sizes', label: 'Sizes', formLabel: 'Size (Optional)', placeholder: 'Enter size (e.g. 21 x 11.5 x 5 cm)', required: false },
        { key: 'materials', label: 'Materials', type: 'rich-text', formLabel: 'Materials (Optional)', placeholder: 'Enter materials details', required: false },
        { key: 'colors', label: 'Colors', type: 'color', formLabel: 'Color (Optional)', placeholder: 'Pick a color', required: false },
        { key: 'hsnCode', label: 'HSN Code', formLabel: 'HSN Code (Optional)', placeholder: 'Enter HSN Code', required: false },
        { key: 'productCode', label: 'Product Code', formLabel: 'Product Code (Optional)', placeholder: 'Enter Product Code', required: false },
        { key: 'price', label: 'Price', formLabel: 'Product Price (Optional)', placeholder: 'Enter Product Price', required: false },
        { key: 'offerPrice', label: 'Offer Price', formLabel: 'Offer Price (Optional)', placeholder: 'Enter Offer Price', required: false },
        { key: 'discount', label: 'Discount', hideInForm: true },
        { key: 'stock', label: 'Stock', formLabel: 'Available Stock *', placeholder: 'Enter Product Stock' },
        { key: 'craftHighlight', label: 'Craftsmanship', type: 'rich-text', formLabel: 'Craftsmanship (Optional)', required: false, minWidth: '600px' },
        { key: 'mainImage', label: 'Main Image', type: 'file', formLabel: 'Product Main Image *', render: (val) => val ? React.createElement('img', { src: formatImageUrl(val), style: { width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e2e8f0' } }) : 'No image' },
        { 
          key: 'additionalImages', 
          label: 'Additional Images', 
          hideInForm: true, 
          render: (val, row) => {
            const images = [row.addImg1, row.addImg2, row.addImg3, row.addImg4, row.addImg5].filter(Boolean);
            if (images.length === 0) return 'No images';
            return React.createElement('div', { style: { display: 'flex', gap: '5px', flexWrap: 'wrap' } }, 
              images.map((img, i) => React.createElement('img', { key: i, src: formatImageUrl(img), style: { width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e2e8f0' } }))
            );
          }
        },
        { key: 'addImg1', label: 'Add Img 1', type: 'file', formLabel: 'Additional Image 1 (Optional)', hideInTable: true, required: false },
        { key: 'addImg2', label: 'Add Img 2', type: 'file', formLabel: 'Additional Image 2 (Optional)', hideInTable: true, required: false },
        { key: 'addImg3', label: 'Add Img 3', type: 'file', formLabel: 'Additional Image 3 (Optional)', hideInTable: true, required: false },
        { key: 'addImg4', label: 'Add Img 4', type: 'file', formLabel: 'Additional Image 4 (Optional)', hideInTable: true, required: false },
        { key: 'addImg5', label: 'Add Img 5', type: 'file', formLabel: 'Additional Image 5 (Optional)', hideInTable: true, required: false },
        { key: 'aboutProduct', label: 'About Product', hideInForm: true },
        { key: 'description', label: 'Description', type: 'rich-text', formLabel: 'Product Description (Optional)', minWidth: '400px', required: false },
        { key: 'shipping', label: 'Shipping', type: 'rich-text', formLabel: 'Shipping & Returns (Optional)', required: false },
        { key: 'careInstructions', label: 'Care Instructions', type: 'rich-text', formLabel: 'Care Instructions (Optional)', required: false },
      ]
    },
    data: []
  },
  { 
    path: 'categories', 
    title: 'Category List', 
    subtitle: 'View all categories',
    breadcrumbParent: 'Categories',
    formCardTitle: 'VERTICAL LAYOUT',
    formSubtitle: 'Welcome to Hieil Application',
    formTitleAdd: 'Add Category',
    formTitleEdit: 'Edit Category',
    columns: {
      title: 'Category Details',
      icon: 'list',
      addButtonText: 'Add New Category',
      formSubmitText: 'Add Category',
      formSubmitIcon: 'FaTh',
      headerStyle: { backgroundColor: '#374151', color: 'white' },
      headers: [
        { key: 'id', label: 'ID', hideInForm: true },
        { key: 'name', label: 'Category Name', formLabel: 'Category Name', placeholder: 'Enter category name' },
        { key: 'tag', label: 'Tag', formLabel: 'Category Tag', placeholder: 'Enter tag (e.g. 200+ DESIGNS)' },
        { key: 'description', label: 'Description', formLabel: 'Category Description', type: 'textarea' },
        { key: 'image', label: 'Image', type: 'file', formLabel: 'Category Image' },
        { key: 'createdAt', label: 'Created At', hideInForm: true }
      ]
    },
    data: []
  },
  { 
    path: 'blogs', 
    title: 'All Blogs', 
    breadcrumbParent: 'Blogs',
    formTitleAdd: 'Add New Blog',
    formTitleEdit: 'Edit Blog',
    formSubtitle: 'Create a new Blog',
    formCardTitle: '+ Add Blog',
    columns: {
      title: 'Blog List',
      icon: 'list',
      addButtonText: 'Add New Blog',
      formSubmitText: 'Add Blog',
      formSubmitIcon: 'FaSave',
      headers: [
        { key: 'id', label: 'ID' },
        { 
          key: 'category', 
          label: 'Category',
          type: 'select',
          formLabel: 'Blog Category',
          options: ['Handicraft', 'Woodwork', 'Art', 'Design']
        },
        { key: 'title', label: 'Title', formLabel: 'Blog Title', placeholder: 'Enter blog title' },
        { key: 'tag', label: 'Tag', formLabel: 'Tag', placeholder: 'Enter tags' },
        { key: 'description', label: 'Description', formLabel: 'Short Description', placeholder: 'Enter short description', hideInTable: true },
        { key: 'image', label: 'Image', type: 'file', formLabel: 'Upload Image' },
        { key: 'content', label: 'Content', type: 'rich-text', formLabel: 'Content', placeholder: 'Enter content here...', hideInTable: true }
      ]
    },
    data: []
  },

  { 
      path: 'submissions/reviews', 
      title: 'Manage Testimonials',
      breadcrumbParent: 'Manage Reviews',
      columns: {
        title: React.createElement('div', {style: {display: 'flex', alignItems: 'center', gap: '8px'}}, React.createElement(FaStar, null), 'REVIEW SUBMISSIONS'),
        headers: [
          { key: 'id', label: 'ID' },
          { key: 'date', label: 'Date' },
          { 
            key: 'userDetails', 
            label: 'User Details', 
            render: (val, row) => React.createElement('div', {style: {display: 'flex', alignItems: 'center', gap: '10px'}},
              React.createElement('div', null,
                React.createElement('div', {style: {fontWeight: 'bold', color: '#111827'}}, row.userName),
                React.createElement('div', {style: {fontSize: '12px', color: '#6b7280'}}, row.userDesignation)
              )
            )
          },
          { 
            key: 'rating', 
            label: 'Rating',
            render: (val) => React.createElement('div', {style: {color: '#facc15', fontSize: '16px'}}, '★'.repeat(Math.max(0, Math.min(5, Number(val) || 0))) + '☆'.repeat(Math.max(0, 5 - (Math.min(5, Number(val) || 0)))))
          },
          { 
            key: 'city', 
            label: 'City',
            render: (val) => React.createElement('span', {style: {backgroundColor: '#06b6d4', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', textTransform: 'uppercase'}}, val || '')
          },
          { key: 'message', label: 'Message', minWidth: '450px', render: (val) => React.createElement('div', {style: {maxWidth: '500px', whiteSpace: 'normal', lineHeight: '1.5', color: '#4b5563', padding: '10px 0'}}, val || '') },
          { 
            key: 'status', 
            label: 'Status',
            type: 'select',
            options: ['PENDING', 'APPROVED', 'REJECTED'],
            render: (val) => React.createElement('span', {style: {backgroundColor: val === 'APPROVED' ? '#22c55e' : (val === 'REJECTED' ? '#ef4444' : '#eab308'), color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', textTransform: 'uppercase'}}, val || 'PENDING')
          }
        ],
        hideDefaultActions: true,
        actions: (row, { onUpdateRow }) => React.createElement('div', {style: {display: 'flex', gap: '5px'}},
          row.status !== 'APPROVED' && React.createElement('button', {
            className: 'modern-action-btn btn-success',
            onClick: () => onUpdateRow(row.id, 'status', 'APPROVED')
          }, React.createElement(FaCheck, null)),
          row.status !== 'REJECTED' && React.createElement('button', {
            className: 'modern-action-btn btn-danger',
            onClick: () => onUpdateRow(row.id, 'status', 'REJECTED')
          }, React.createElement(FaTimes, null))
        )
      },
      data: []
    },
    { 
      path: 'submissions/user-moments', 
      title: 'Manage Gallery Submissions',
      breadcrumbParent: 'Gallery Submissions',
      columns: {
        title: React.createElement('div', {style: {display: 'flex', alignItems: 'center', gap: '8px'}}, React.createElement(FaImages, null), 'GALLERY SUBMISSIONS'),
        headers: [
          { key: 'id', label: 'ID' },
          { key: 'date', label: 'Date' },
          { 
            key: 'userDetails', 
            label: 'User Details', 
            render: (val, row) => React.createElement('div', null,
              React.createElement('div', {style: {fontWeight: 'bold', color: '#111827'}}, row.userName || ''),
              React.createElement('div', {style: {fontSize: '13px', color: '#6b7280'}}, row.userEmail || '')
            )
          },
          { 
            key: 'submittedPhotos', 
            label: 'Submitted Photos',
            render: (val) => React.createElement('div', {style: {display: 'flex', gap: '5px'}},
              (Array.isArray(val) ? val : []).map((photo, i) => React.createElement('img', {key: i, src: photo, style: {width: '40px', height: '40px', objectFit: 'cover', border: '1px solid #e5e7eb', borderRadius: '4px'}}))
            )
          },
          { 
            key: 'status', 
            label: 'Status',
            type: 'select',
            options: ['PENDING', 'APPROVED', 'REJECTED'],
            render: (val) => React.createElement('span', {style: {backgroundColor: val === 'APPROVED' ? '#22c55e' : (val === 'REJECTED' ? '#ef4444' : '#eab308'), color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', textTransform: 'uppercase'}}, val || 'PENDING')
          }
        ],
        hideDefaultActions: true,
        actions: (row, { onUpdateRow }) => React.createElement('div', {style: {display: 'flex', gap: '5px'}},
          row.status !== 'APPROVED' && React.createElement('button', {
            className: 'modern-action-btn btn-success',
            onClick: () => onUpdateRow(row.id, 'status', 'APPROVED')
          }, React.createElement(FaCheck, null)),
          row.status !== 'REJECTED' && React.createElement('button', {
            className: 'modern-action-btn btn-danger',
            onClick: () => onUpdateRow(row.id, 'status', 'REJECTED')
          }, React.createElement(FaTimes, null))
        )
      },
      data: []
    },
    { 
      path: 'submissions/feedback', 
      title: 'Manage Customer Feedback',
      breadcrumbParent: 'Customer Feedback',
      formTitleAdd: 'Add Feedback',
      formTitleEdit: 'Edit Feedback',
      formCardTitle: 'ADD CUSTOMER FEEDBACK',
      columns: {
        title: React.createElement('div', {style: {display: 'flex', alignItems: 'center', gap: '8px'}}, React.createElement(FaCommentAlt, null), 'FEEDBACK SUBMISSIONS'),
        addButtonText: 'Add New Feedback',
        headers: [
          { key: 'id', label: 'ID', hideInForm: true },
          { key: 'createdAt', label: 'Date', hideInForm: true, render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A' },
          { key: 'customerName', label: 'Customer Name', formLabel: 'Customer Name', hideInTable: true, placeholder: 'Enter Name' },
          { key: 'email', label: 'Email Address', formLabel: 'Email Address', hideInTable: true, placeholder: 'Enter Email' },
          { key: 'phone', label: 'Phone Number', formLabel: 'Phone Number', hideInTable: true, placeholder: 'Enter Phone' },
          { 
            key: 'contactDetails', 
            label: 'Contact Details', 
            hideInForm: true,
            render: (val, row) => React.createElement('div', null,
              React.createElement('div', {style: {fontWeight: 'bold', color: '#111827', marginBottom: '4px'}}, row.customerName || ''),
              React.createElement('div', {style: {display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#6b7280', marginBottom: '2px'}}, 
                React.createElement(FaEnvelope, null), row.email || ''
              ),
              React.createElement('div', {style: {display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#06b6d4'}}, 
                React.createElement(FaPhoneAlt, null), row.phone || ''
              )
            )
          },
          { 
            key: 'rating', 
            label: 'Rating',
            formLabel: 'Rating (1-5)',
            type: 'select',
            options: [1, 2, 3, 4, 5],
            render: (val) => React.createElement('div', {style: {color: '#facc15', fontSize: '16px'}}, '★'.repeat(Math.max(0, Math.min(5, Number(val) || 0))) + '☆'.repeat(Math.max(0, 5 - (Math.min(5, Number(val) || 0)))))
          },
          { key: 'feedbackMessage', label: 'Feedback Message', formLabel: 'Feedback Message', type: 'textarea', placeholder: 'Enter feedback' }
        ],
        hideDefaultActions: true,
        actions: (row, { onEdit, onDelete }) => React.createElement('div', {style: {display: 'flex'}},
          React.createElement('button', {
            className: 'modern-action-btn btn-success',
            onClick: () => window.open(`https://wa.me/${row.phone}`, '_blank')
          }, React.createElement(FaWhatsapp, null)),
          React.createElement('button', {
            className: 'modern-action-btn btn-primary',
            onClick: () => window.open(`tel:${row.phone}`, '_self')
          }, React.createElement(FaPhoneAlt, null)),
          React.createElement('button', {
            className: 'modern-action-btn btn-warning',
            onClick: () => onEdit && onEdit(row)
          }, React.createElement(FaEdit, null)),
          React.createElement('button', {
            className: 'modern-action-btn btn-danger',
            onClick: () => onDelete && onDelete(row)
          }, React.createElement(FaTrashAlt, null))
        )
      },
      data: []
    },
    { 
      path: 'submissions/newsletter', 
      title: 'Manage Newsletter Subscribers',
      breadcrumbParent: 'Subscribers',
      columns: {
        title: React.createElement('div', {style: {display: 'flex', alignItems: 'center', gap: '8px'}}, React.createElement(FaEnvelope, null), 'NEWSLETTER EMAIL LIST'),
        headers: [
          { key: 'id', label: 'ID' },
          { 
            key: 'createdAt', 
            label: 'Subscription Date',
            render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A'
          },
          { 
            key: 'email', 
            label: 'Email Address', 
            render: (val) => React.createElement('div', {style: {fontWeight: 'bold', color: '#111827'}}, val || '')
          }
        ],
        hideDefaultActions: true,
        actions: (row, { onDelete }) => React.createElement('div', {style: {display: 'flex'}},
          React.createElement('button', {
            className: 'modern-action-btn btn-primary',
            onClick: () => window.open(`mailto:${row.email}`, '_blank')
          }, React.createElement(FaEnvelope, null)),
          React.createElement('button', {
            className: 'modern-action-btn btn-danger',
            onClick: () => onDelete && onDelete(row)
          }, React.createElement(FaTrashAlt, null))
        )
      },
      data: []
    },
  {
    path: 'inquiry-system/quick-inquiries',
    title: 'Quick Direct Contacts',
    subtitle: 'Direct email inquiries from product pages',
    apiEndpoint: '/quick-inquiries',
    disableAdd: true,
    columns: {
      title: 'QUICK INQUIRIES',
      headers: [
        { key: 'id', label: 'ID' },
        { key: 'email', label: 'Email Address' },
        { key: 'productName', label: 'Product', render: (val, row) => React.createElement('div', {style: {display: 'flex', flexDirection: 'column', gap: '8px'}}, React.createElement('div', {style: {fontWeight: '500', color: '#111827', fontSize: '13px'}}, row.productName || 'N/A'), row.productId && React.createElement('button', { style: { padding: '4px 8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#f1f5f9', color: '#0ea5e9', border: '1px solid #bae6fd', borderRadius: '4px', cursor: 'pointer' }, onClick: () => window.open('/product/' + row.productId, '_blank') }, React.createElement(FaExternalLinkAlt, {style: {fontSize: '10px'}}), 'View Product')) },
        { key: 'message', label: 'Message' },
        { key: 'status', label: 'Status' },
        { key: 'createdAt', label: 'Date', render: (val) => new Date(val).toLocaleDateString() }
      ]
    }
  },
    { 
    path: 'inquiry-system/product-inquiries', 
    title: 'Customer Inquiries', 
    subtitle: 'Inquiries',
    columns: {
      title: 'INQUIRY LIST',
      headers: [
        { key: 'id', label: 'ID' },
        { key: 'product', label: 'Product', render: (val, row) => React.createElement('div', {style: {fontSize: '13px'}}, val, React.createElement('div', {style: {color: '#6b7280', marginTop: '4px', marginBottom: '8px'}}, 'ID: ' + row.productId), React.createElement('button', { className: 'modern-action-btn', style: { padding: '4px 8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#f1f5f9', color: '#0ea5e9', border: '1px solid #bae6fd', borderRadius: '4px' }, onClick: () => window.open('/product/' + row.productId, '_blank') }, React.createElement(FaExternalLinkAlt, {style: {fontSize: '10px'}}), 'View Product')) },
        { key: 'customer', label: 'Customer', render: (val) => React.createElement('div', {style: {maxWidth: '150px', wordWrap: 'break-word', fontSize: '13px'}}, val) },
        { key: 'contact', label: 'Contact', render: (val, row) => React.createElement('div', {style: {fontSize: '12px', lineHeight: '1.6'}}, 
            React.createElement('div', {style: {display: 'flex', alignItems: 'center', gap: '5px'}}, React.createElement(FaEnvelope, {style: {color: '#6366f1', fontSize: '14px'}}), row.email),
            React.createElement('div', {style: {display: 'flex', alignItems: 'center', gap: '5px', color: '#dc2626'}}, React.createElement(FaPhone, {style: {fontSize: '14px'}}), row.phone),
            React.createElement('div', {style: {display: 'flex', alignItems: 'center', gap: '5px', color: '#8b5cf6'}}, React.createElement(FaWhatsapp, {style: {fontSize: '14px'}}), row.whatsapp)
          ) 
        },
        { key: 'location', label: 'Location', render: (val) => React.createElement('div', {style: {maxWidth: '150px', wordWrap: 'break-word', fontSize: '13px'}}, val) },
        { key: 'orderType', label: 'Order Type', render: (val) => React.createElement('span', {className: 'modern-action-btn btn-primary'}, val) },
        { key: 'qty', label: 'Qty' },
        { key: 'budget', label: 'Budget' },
        { key: 'gst', label: 'GST', render: (val, row) => React.createElement('div', {style: {fontSize: '13px'}}, row.gstStatus, React.createElement('div', {style: {color: '#6b7280', marginTop: '4px', maxWidth: '120px', wordWrap: 'break-word'}}, row.gstDetails)) },
        { key: 'shipping', label: 'Shipping', render: (val) => React.createElement('div', {style: {maxWidth: '150px', wordWrap: 'break-word', fontSize: '13px'}}, val) },
        { key: 'date', label: 'Date', render: (val) => React.createElement('div', {style: {maxWidth: '60px', fontSize: '13px', lineHeight: '1.4'}}, val) }
      ],
      hideDefaultActions: true,
      actions: (row, { onDelete }) => React.createElement('div', {style: {display: 'flex', gap: '5px'}},
        React.createElement('button', {
            className: 'modern-action-btn btn-success',
            onClick: async () => {
              try {
                if (row.quotationId) {
                  const result = await Swal.fire({
                    title: 'Quotation Already Exists',
                    html: `A quotation (ID: <b>${row.quoteNo || 'Unknown'}</b>) already exists for this inquiry.`,
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'Want to Edit/View',
                    cancelButtonText: 'Cancel'
                  });
                  if (result.isConfirmed) {
                    window.location.href = `/admin/inquiry-system/quotations?search=${row.quoteNo || ''}`;
                  }
                } else {
                  window.location.href = `/admin/inquiry-system/product-inquiries/create-quotation/${row.id || row._id}`;
                }
              } catch (e) {
                console.error(e);
                window.location.href = `/admin/inquiry-system/product-inquiries/create-quotation/${row.id || row._id}`;
              }
            }
          }, React.createElement(FaFileAlt, {style: {fontSize: '16px'}}), ' Create Quotation'),
        React.createElement('button', {
          className: 'modern-action-btn btn-danger',
          title: 'Delete Inquiry',
          onClick: () => onDelete && onDelete(row)
        }, React.createElement(FaTrash, {style: {fontSize: '14px'}}))
      ),
      expandedRowRender: (row) => React.createElement('div', {style: {display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '14px', color: '#111827', padding: '5px 0'}}, 
        React.createElement('div', null, React.createElement('strong', null, 'Message: '), row.message),
        React.createElement('div', null, React.createElement('strong', null, 'Delivery Date: '), row.deliveryDate)
      )
    }, 
    data: []
  },
  { 
    path: 'inquiry-system/orders', 
    title: 'Orders', 
    subtitle: 'Orders',
    apiEndpoint: '/orders',
    columns: {
      title: 'ORDER LIST',
      headers: [
        { key: 'id', label: '#' },
        { key: 'orderNo', label: 'Order No' },
        { key: 'quotation', label: 'Quotation' },
        { key: 'incoterm', label: 'Incoterm', type: 'select', options: [{ value: 'FOB', label: 'FOB (Free On Board)' }, { value: 'EXW', label: 'EXW (Ex Works)' }, { value: 'CIF', label: 'CIF (Cost, Insurance, and Freight)' }, { value: 'DDP', label: 'DDP (Delivered Duty Paid)' }, { value: 'DAP', label: 'DAP (Delivered at Place)' }, { value: 'FCA', label: 'FCA (Free Carrier)' }, { value: 'CPT', label: 'CPT (Carriage Paid To)' }, { value: 'CIP', label: 'CIP (Carriage and Insurance Paid To)' }, { value: 'CFR', label: 'CFR (Cost and Freight)' }, { value: 'FAS', label: 'FAS (Free Alongside Ship)' }] },
        { key: 'deliveryPort', label: 'Port', formLabel: 'Delivery Port (e.g., JNPT Mumbai)' },
        { key: 'status', label: 'Status', render: (val, row, handlers) => {
              let bg = '#f3f4f6';
              let color = '#374151';
              if (val === 'Delivered') { bg = '#dcfce7'; color = '#166534'; }
              else if (val === 'Cancelled') { bg = '#fee2e2'; color = '#991b1b'; }
              else if (val === 'Processing') { bg = '#fef08a'; color = '#854d0e'; }
              else if (val === 'Shipped') { bg = '#bfdbfe'; color = '#1e3a8a'; }
              
              const arrowSvg = `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${color.replace('#', '%23')}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E`;

              return React.createElement('select', {
                value: val || 'Processing',
                style: {
                  backgroundColor: bg, 
                  color: color, 
                  padding: '6px 28px 6px 12px', 
                  borderRadius: '16px', 
                  fontSize: '12px', 
                  fontWeight: '600',
                  border: '1px solid ' + bg,
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  backgroundImage: `url("${arrowSvg}")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                  backgroundSize: '14px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                },
                onChange: (e) => {
                    const newStatus = e.target.value;
                    if (newStatus === 'Shipped') {
                      Swal.fire({
                        title: 'Create Shipment',
                        html: `
                          <input id="swal-input-mode" class="swal2-input" placeholder="Shipping Mode / Courier">
                          <input id="swal-input-tracking" class="swal2-input" placeholder="Tracking Number">
                        `,
                        focusConfirm: false,
                        showCancelButton: true,
                        preConfirm: () => {
                          return {
                            mode: document.getElementById('swal-input-mode').value,
                            tracking: document.getElementById('swal-input-tracking').value
                          }
                        }
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                          try {
                            await api.post('/shipping', {
                              orderNo: row.orderNo,
                              mode: result.value.mode,
                              tracking: result.value.tracking,
                              type: row.type || 'inquiry'
                            });
                            if (handlers && handlers.onUpdateRow) {
                              handlers.onUpdateRow(row._id, 'status', newStatus);
                            } else {
                              await api.put(`/orders/${row._id}`, { status: newStatus });
                              window.location.reload();
                            }
                          } catch(err) {
                            Swal.fire('Error', 'Failed to create shipment.', 'error');
                          }
                        } else {
                          // Revert UI to old value if cancelled
                          e.target.value = val;
                        }
                      });
                    } else {
                      if (handlers && handlers.onUpdateRow) {
                        handlers.onUpdateRow(row._id, 'status', newStatus);
                      } else {
                        api.put(`/orders/${row._id}`, { status: newStatus })
                          .then(() => window.location.reload())
                          .catch(err => alert('Error updating status: ' + err.message));
                      }
                    }
                  }
              }, 
              React.createElement('option', {value: 'Processing', style: {color: 'black', backgroundColor: 'white'}}, 'Processing'),
              React.createElement('option', {value: 'Shipped', style: {color: 'black', backgroundColor: 'white'}}, 'Shipped'),
              React.createElement('option', {value: 'Delivered', style: {color: 'black', backgroundColor: 'white'}}, 'Delivered'),
              React.createElement('option', {value: 'Cancelled', style: {color: 'black', backgroundColor: 'white'}}, 'Cancelled')
              );
            } 
          },
        { key: 'date', label: 'Date' }
      ],
      hideDefaultActions: true,
      actions: (row, handlers) => React.createElement('div', {style: {display: 'flex', gap: '4px'}},
        row.status === 'Shipped' ? React.createElement('button', {
            className: 'modern-action-btn btn-success',
            title: 'Generate E-Way Bill',
            style: { padding: '4px 8px', fontSize: '11px', whiteSpace: 'nowrap' },
            onClick: () => window.location.href = `/admin/domestic-logistics/preview-by-order/${row._id}`
        }, React.createElement(FaTruck, {style: {marginRight: '4px'}}), "EWB") : null,
        React.createElement('button', {
            className: 'modern-action-btn btn-warning',
            title: 'Edit Order',
            onClick: () => handlers.onEdit(row)
        }, React.createElement(FaEdit, null)),
        React.createElement('button', {
            className: 'modern-action-btn btn-primary',
            title: 'View Details',
            onClick: () => window.location.href = `/admin/inquiry-system/orders/details/${row._id}`
        }, React.createElement(FaEye || FaFileAlt, null)),
        React.createElement('button', {
            className: 'modern-action-btn btn-danger',
            title: 'Delete Order',
            onClick: () => handlers.onDelete(row)
        }, React.createElement(FaTrashAlt, null))
      )
    }, 
    data: []
  },
  { 
    path: 'inquiry-system/quotations', 
    title: 'Quotations', 
    subtitle: 'Quotations',
    apiEndpoint: '/quotations',
    columns: {
      title: 'QUOTATION LIST',
      headers: [
        { key: 'id', label: '#' },
        { key: 'quoteNo', label: 'Quote No', render: (val) => React.createElement('div', {style: {maxWidth: '120px', wordWrap: 'break-word'}}, val) },
        { key: 'customer', label: 'Customer' },
        { key: 'mobile', label: 'Mobile' },
        { key: 'country', label: 'Country' },
        { key: 'product', label: 'Product', render: (val) => React.createElement('div', {style: {maxWidth: '150px', wordWrap: 'break-word'}}, val) },
        { key: 'qty', label: 'Qty' },
        { key: 'budget', label: 'Budget' },
        { key: 'total', label: 'Total' },
        { key: 'status', label: 'Status', render: (val, row, handlers) => {
              let bg = '#f3f4f6';
              let color = '#374151';
              if (val === 'Accepted') { bg = '#dcfce7'; color = '#166534'; }
              else if (val === 'Rejected') { bg = '#fee2e2'; color = '#991b1b'; }
              else if (val === 'Sent') { bg = '#fef08a'; color = '#854d0e'; }
              
              const arrowSvg = `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${color.replace('#', '%23')}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E`;

              return React.createElement('select', {
                value: val,
                style: {
                  backgroundColor: bg, 
                  color: color, 
                  padding: '6px 28px 6px 12px', 
                  borderRadius: '16px', 
                  fontSize: '12px', 
                  fontWeight: '600',
                  border: '1px solid ' + bg,
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  backgroundImage: `url("${arrowSvg}")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                  backgroundSize: '14px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                },
                onChange: (e) => {
                  const newStatus = e.target.value;
                  const updateStatus = (address = '', incoterm = '', deliveryPort = '') => {
                    api.put(`/quotations/${row._id}`, { status: newStatus, address, incoterm, deliveryPort })
                      .then(() => window.location.reload())
                      .catch(err => alert('Error updating status: ' + err.message));
                  };

                  if (newStatus === 'Accepted') {
                    Swal.fire({
                      title: 'Enter Order Details (Address & Shipping)',
                      html: `
                        <div style="display: flex; flex-direction: column; gap: 10px; text-align: left;">
                          <h4 style="margin:0; font-size: 14px; color: #475569;">Company & Address</h4>
                          <input id="addr-company" class="swal2-input" placeholder="Company Name" style="margin:0; width:100%; box-sizing:border-box;">
                          <input id="addr-contact" class="swal2-input" placeholder="Contact Person Name" style="margin:0; width:100%; box-sizing:border-box;">
                          <input id="addr-line1" class="swal2-input" placeholder="Address Line 1" style="margin:0; width:100%; box-sizing:border-box;">
                          <input id="addr-city" class="swal2-input" placeholder="City, Country, ZIP" style="margin:0; width:100%; box-sizing:border-box;">
                          <input id="addr-email" class="swal2-input" placeholder="Email" type="email" style="margin:0; width:100%; box-sizing:border-box;">
                          <input id="addr-phone" class="swal2-input" placeholder="Phone" style="margin:0; width:100%; box-sizing:border-box;">
                          <input id="addr-tax" class="swal2-input" placeholder="Tax / VAT No." style="margin:0; width:100%; box-sizing:border-box;">
                          
                          <h4 style="margin:10px 0 0 0; font-size: 14px; color: #475569;">Shipping Terms</h4>
                          <select id="ord-incoterm" class="swal2-input" style="margin:0; width:100%; box-sizing:border-box;">
                            <option value="">-- Select Incoterm --</option>
                            <option value="FOB">FOB (Free On Board)</option>
                            <option value="EXW">EXW (Ex Works)</option>
                            <option value="CIF">CIF (Cost, Insurance, and Freight)</option>
                            <option value="DDP">DDP (Delivered Duty Paid)</option>
                            <option value="DAP">DAP (Delivered at Place)</option>
                            <option value="FCA">FCA (Free Carrier)</option>
                            <option value="CPT">CPT (Carriage Paid To)</option>
                            <option value="CIP">CIP (Carriage and Insurance Paid To)</option>
                            <option value="CFR">CFR (Cost and Freight)</option>
                            <option value="FAS">FAS (Free Alongside Ship)</option>
                          </select>
                          <input id="ord-deliveryport" class="swal2-input" placeholder="Delivery Port (e.g., Mundra)" style="margin:0; width:100%; box-sizing:border-box;">
                        </div>
                      `,
                      showCancelButton: true,
                      confirmButtonText: 'Save Details',
                      cancelButtonText: 'Add it later',
                      cancelButtonColor: '#6b7280',
                      allowOutsideClick: false,
                      preConfirm: () => {
                        const company = document.getElementById('addr-company').value;
                        const contact = document.getElementById('addr-contact').value;
                        const line1 = document.getElementById('addr-line1').value;
                        const city = document.getElementById('addr-city').value;
                        const email = document.getElementById('addr-email').value;
                        const phone = document.getElementById('addr-phone').value;
                        const tax = document.getElementById('addr-tax').value;
                        
                        const incoterm = document.getElementById('ord-incoterm').value;
                        const deliveryPort = document.getElementById('ord-deliveryport').value;

                        return {
                          address: JSON.stringify({ company, contact, line1, city, email, phone, tax }),
                          incoterm,
                          deliveryPort
                        };
                      }
                    }).then((result) => {
                      if (result.isConfirmed) {
                        updateStatus(result.value.address, result.value.incoterm, result.value.deliveryPort);
                      } else if (result.dismiss === Swal.DismissReason.cancel) {
                        updateStatus('');
                      } else {
                        // user dismissed the modal, revert visual status
                        e.target.value = val;
                      }
                    });
                  } else {
                    updateStatus('');
                  }
                }
              }, 
              React.createElement('option', {value: 'Sent', style: {color: 'black', backgroundColor: 'white'}}, 'Sent'),
              React.createElement('option', {value: 'Accepted', style: {color: 'black', backgroundColor: 'white'}}, 'Accepted'),
              React.createElement('option', {value: 'Rejected', style: {color: 'black', backgroundColor: 'white'}}, 'Rejected')
              );
            } 
          },
        { key: 'date', label: 'Date', render: (val) => React.createElement('div', {style: {maxWidth: '50px', wordWrap: 'break-word', lineHeight: '1.4'}}, val.replace(/-/g, '-\n')) }
      ],
      hideDefaultActions: true,
      actions: (row, { onEdit }) => React.createElement('div', {style: {display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '80px'}},
        React.createElement('button', {
            className: 'modern-action-btn btn-primary',
            onClick: () => window.location.href = `/admin/inquiry-system/quotations/preview/${row._id}`
        }, React.createElement(FaFileAlt, null)),
        onEdit && React.createElement('button', {
            className: 'modern-action-btn btn-warning',
            onClick: () => onEdit(row)
        }, React.createElement(FaEdit, null))
      )
    }, 
    data: []
  },
  { 
    path: 'inquiry-system/invoices', 
    title: 'Invoices', 
    subtitle: 'Invoices',
    columns: {
      title: 'INVOICE LIST',
      headers: [
        { key: 'id', label: '#' },
        { key: 'invoiceNo', label: 'Invoice No' },
        { key: 'orderNo', label: 'Order No' },
        { key: 'total', label: 'Total' },
        { key: 'vendorId', label: 'Assigned Vendor', render: (val) => React.createElement(VendorNameDisplay, { vendorId: val, fallbackStyle: { color: '#16a34a', fontWeight: 'bold' } }) },
        { key: 'status', label: 'Status', render: (val, row, handlers) => {
              let bg = '#fef08a';
              let color = '#854d0e';
              if (val === 'Full Paid' || val === 'Paid') { bg = '#dcfce7'; color = '#166534'; }
                else if (val === 'Partial Paid') { bg = '#fef3c7'; color = '#92400e'; }
              else if (val === 'Cancelled') { bg = '#fee2e2'; color = '#991b1b'; }
              
              const arrowSvg = `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${color.replace('#', '%23')}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E`;

              return React.createElement('select', {
                value: val || 'Pending',
                style: {
                  backgroundColor: bg, 
                  color: color, 
                  padding: '6px 28px 6px 12px', 
                  borderRadius: '16px', 
                  fontSize: '12px', 
                  fontWeight: '600',
                  border: '1px solid ' + bg,
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  backgroundImage: `url("${arrowSvg}")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                  backgroundSize: '12px'
                },
                onChange: (e) => {
                  const newStatus = e.target.value;
                  if (handlers && handlers.onUpdateRow) {
                    handlers.onUpdateRow(row._id, 'status', newStatus);
                  } else {
                    api.put(`/invoices/${row._id}`, { status: newStatus })
                      .then(() => window.location.reload())
                      .catch(err => {
                        console.error(err);
                        alert('Failed to update status');
                      });
                  }
                }
              },
                React.createElement('option', {value: 'Pending'}, 'Pending'),
                React.createElement('option', {value: 'Partial Paid'}, 'Partial Paid'),
                  React.createElement('option', {value: 'Full Paid'}, 'Full Paid'),
                React.createElement('option', {value: 'Cancelled'}, 'Cancelled')
              );
            }
        }
      ],
      hideDefaultActions: true,
      actions: (row) => React.createElement('div', {style: {display: 'flex', gap: '5px', flexWrap: 'wrap'}},
        !row.vendorId && React.createElement('button', {
            className: 'modern-action-btn btn-neutral',
            onClick: async () => {
              try {
                const res = await api.get('/vendors');
                const vendors = Array.isArray(res.data) ? res.data : (res.data.data || []);
                let options = '<option value="">Select a vendor...</option>';
                vendors.forEach(v => { options += `<option value="${v._id}">${v.vendorName} ${v.amount ? `(${v.amount})` : (v.commission ? `(${v.commission}%)` : '')}</option>`; });
                const { value: vendorId } = await Swal.fire({
                  title: 'Assign Vendor',
                  html: `<select id="vendor-select" class="swal2-input">${options}</select>`,
                  focusConfirm: false,
                  showCancelButton: true,
                  preConfirm: () => document.getElementById('vendor-select').value
                });
                if (vendorId) {
                  try {
                    await api.put(`/invoices/${row._id}`, { vendorId });
                    
                    let linkedOrderId = null;
                    try {
                      const ordersRes = await api.get('/orders');
                      const orderData = (Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data.data) || [];
                      const matchedOrder = orderData.find(o => o.orderNo === row.orderNo);
                      if (matchedOrder) {
                        linkedOrderId = matchedOrder._id;
                      }
                    } catch(e) {}
                    
                    await api.post('/vendor-orders', {
                        poNumber: 'PO-' + row.orderNo,
                        vendorId: vendorId,
                        orderId: linkedOrderId,
                        agreedPriceInr: row.total || 0,
                        status: 'Pending',
                        installments: []
                    });
                    
                    Swal.fire('Assigned!', 'Vendor assigned & PO created successfully.', 'success').then(() => window.location.reload());
                  } catch (assignErr) {
                    Swal.fire('Error', 'Failed to assign vendor or create PO', 'error');
                  }
                }
              } catch (e) { Swal.fire('Error', 'Failed to load vendors', 'error'); }
            }
        }, 'Assign Vendor'),
        React.createElement('button', {
            className: 'modern-action-btn btn-primary',
            onClick: () => window.location.href = `/admin/inquiry-system/invoices/preview/${row._id}`
        }, 'PDF'),

        row.status !== 'Shipped' && React.createElement('button', {
            className: 'modern-action-btn btn-primary',
            onClick: () => {
              Swal.fire({
                title: 'Create Shipment',
                html: `
                  <input id="swal-input-mode" class="swal2-input" placeholder="Shipping Mode / Courier">
                  <input id="swal-input-tracking" class="swal2-input" placeholder="Tracking Number">
                `,
                focusConfirm: false,
                showCancelButton: true,
                preConfirm: () => {
                  return {
                    mode: document.getElementById('swal-input-mode').value,
                    tracking: document.getElementById('swal-input-tracking').value
                  }
                }
              }).then(async (result) => {
                if (result.isConfirmed) {
                  try {
                    await api.post('/shipping', {
                      invoice: row.invoiceNo,
                      orderNo: row.orderNo,
                      mode: result.value.mode,
                      tracking: result.value.tracking,
                      type: row.type || 'inquiry'
                    });
                    await api.put(`/invoices/${row._id}`, { status: 'Shipped' });
                    Swal.fire('Success', 'Shipment created successfully.', 'success').then(() => {
                      window.location.href = '/admin/inquiry-system/shipping';
                    });
                  } catch(e) {
                    Swal.fire('Error', 'Failed to create shipment.', 'error');
                  }
                }
              });
            }
        }, React.createElement(FaTruck, null), ' Shipping')
      )
    }, 
    data: []
  },
  { 
    path: 'inquiry-system/payments', 
    title: 'Payments', 
    subtitle: 'Payments',
    columns: {
      title: 'PAYMENTS LIST',
      headers: [
        { key: 'id', label: '#' },
        { key: 'invoiceNo', label: 'Invoice No' },
        { key: 'orderNo', label: 'Order No' },
        { key: 'mode', label: 'Mode' },
        { key: 'reference', label: 'Reference' },
        { key: 'amount', label: 'Amount' },
        { key: 'status', label: 'Status', render: (val, row, handlers) => {
            let bg = '#f3f4f6';
            let color = '#374151';
            if (val === 'Full Paid' || val === 'Paid') { bg = '#dcfce7'; color = '#166534'; }
                else if (val === 'Partial Paid') { bg = '#fef3c7'; color = '#92400e'; }
            else if (val === 'Failed') { bg = '#fee2e2'; color = '#991b1b'; }
            else if (val === 'Refunded') { bg = '#fef08a'; color = '#854d0e'; }
            
            const arrowSvg = `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${color.replace('#', '%23')}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E`;
            
            return React.createElement('select', {
              value: val || 'Pending',
              style: {
                backgroundColor: bg,
                color: color,
                padding: '6px 28px 6px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: '600',
                border: '1px solid ' + bg,
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                backgroundImage: `url("${arrowSvg}")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                backgroundSize: '14px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              },
              onChange: (e) => {
                const newStatus = e.target.value;
                if (handlers && handlers.onUpdateRow) {
                  handlers.onUpdateRow(row._id, 'status', newStatus);
                } else {
                  api.put(`/payments/${row._id}`, { status: newStatus })
                    .then(() => window.location.reload())
                    .catch(err => alert('Error updating status: ' + err.message));
                }
              }
            }, 
            React.createElement('option', {value: 'Pending', style: {color: 'black', backgroundColor: 'white'}}, 'Pending'),
            React.createElement('option', {value: 'Paid', style: {color: 'black', backgroundColor: 'white'}}, 'Paid'),
            React.createElement('option', {value: 'Failed', style: {color: 'black', backgroundColor: 'white'}}, 'Failed'),
            React.createElement('option', {value: 'Refunded', style: {color: 'black', backgroundColor: 'white'}}, 'Refunded')
            );
          } 
        },
        { key: 'date', label: 'Date' }
      ],
      hideDefaultActions: true,
      actions: (row) => React.createElement('div', {style: {display: 'flex', gap: '5px', flexWrap: 'wrap'}},
        React.createElement('button', {
            className: 'modern-action-btn btn-danger',
            onClick: () => {
              Swal.fire({
                title: 'Delete Payment?',
                text: 'Are you sure you want to delete this payment record?',
                icon: 'warning',
                showCancelButton: true
              }).then(async (result) => {
                if (result.isConfirmed) {
                  try {
                    await api.delete(`/payments/${row._id}`);
                    Swal.fire('Deleted!', '', 'success').then(() => window.location.reload());
                  } catch(e) {
                    Swal.fire('Error', 'Failed to delete payment.', 'error');
                  }
                }
              });
            }
        }, 'Delete')
      )
    }, 
    data: []
  },
  { 
    path: 'inquiry-system/shipping', 
    title: 'Shipping List', 
    subtitle: 'Shipping List',
    columns: {
      title: 'SHIPMENT LIST',
      headers: [
        { key: 'id', label: '#' },
        { key: 'invoice', label: 'Invoice' },
        { key: 'orderNo', label: 'Order No' },
        { key: 'mode', label: 'Mode' },
        { key: 'tracking', label: 'Tracking' },
        { key: 'status', label: 'Status', render: (val, row, handlers) => {
            let bg = '#f3f4f6';
            let color = '#374151';
            if (val === 'In Transit') { bg = '#fef08a'; color = '#854d0e'; }
            else if (val === 'Delivered') { bg = '#dcfce7'; color = '#166534'; }
            else if (val === 'Failed') { bg = '#fee2e2'; color = '#991b1b'; }
            else if (val === 'Returned') { bg = '#ffedd5'; color = '#c2410c'; }
            
            const arrowSvg = `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${color.replace('#', '%23')}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E`;
            
            return React.createElement('select', {
              value: val || 'In Transit',
              style: {
                backgroundColor: bg,
                color: color,
                padding: '6px 28px 6px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: '600',
                border: '1px solid ' + bg,
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                backgroundImage: `url("${arrowSvg}")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                backgroundSize: '14px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              },
              onChange: (e) => {
                const newStatus = e.target.value;
                if (handlers && handlers.onUpdateRow) {
                  handlers.onUpdateRow(row._id, 'status', newStatus);
                } else {
                  api.put(`/shipping/${row._id}`, { status: newStatus })
                    .then(() => window.location.reload())
                    .catch(err => alert('Error updating status: ' + err.message));
                }
              }
            }, 
              React.createElement('option', {value: 'In Transit'}, 'In Transit'),
              React.createElement('option', {value: 'Delivered'}, 'Delivered'),
              React.createElement('option', {value: 'Failed'}, 'Failed'),
              React.createElement('option', {value: 'Returned'}, 'Returned')
            );
          } 
        }
      ],
      hideDefaultActions: true
    }, 
    data: []
  },
  { path: 'inquiry-system/reports', title: 'Inquiry Reports', columns: getCols('Report', [{key: 'id', label: 'ID'}, {key: 'reportName', label: 'Report Name'}, {key: 'date', label: 'Date Generated'}]), data: [] },
  { 
    path: 'custom-products', 
    title: 'Custom Development: Managed Products',
    breadcrumbParent: 'Custom Products',
    formCardTitle: 'ADD CUSTOM PRODUCT',
    formSubtitle: 'Welcome to Hieil Application',
    formTitleAdd: 'Add Custom Product',
    formTitleEdit: 'Edit Custom Product',
    columns: {
      title: 'PRODUCT LIST',
      addButtonText: 'New Product',
      formSubmitText: 'Add Product',
      formLayout: 'two-column',
      headers: [
        { key: 'id', label: 'ID' },
        { 
          key: 'image', 
          label: 'Image', 
          type: 'file', 
          formLabel: 'Product Image',
          render: (val) => React.createElement('img', { src: formatImageUrl(val) || 'https://via.placeholder.com/50', alt: 'Product', style: { width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' } })
        },
        { key: 'title', label: 'Title', formLabel: 'Product Title', placeholder: 'e.g. Custom Furniture' },
        { key: 'priceText', label: 'Price Text', formLabel: 'Price / Starting Text', placeholder: 'e.g. Starting $15,000', fullWidth: true },
        { key: 'created', label: 'Created', hideInForm: true },
        { key: 'description', label: 'Description', type: 'textarea', formLabel: 'Short Description', placeholder: 'Briefly describe the product...', hideInTable: true, fullWidth: true }
      ]
    }, 
    data: []
  },
  { 
    path: 'wholesale-categories', 
    title: 'Wholesale: Managed Categories',
    breadcrumbParent: 'Wholesale Categories',
    formCardTitle: 'ADD WHOLESALE CATEGORY',
    formSubtitle: 'Welcome to Hieil Application',
    formTitleAdd: 'Add Wholesale Category',
    formTitleEdit: 'Edit Wholesale Category',
    columns: {
      title: 'CATEGORY LIST',
      addButtonText: 'New Category',
      formSubmitText: 'Save Category',
      formLayout: 'two-column',
      headers: [
        { key: 'id', label: 'ID' },
        { 
          key: 'image', 
          label: 'Image', 
          type: 'file', 
          formLabel: 'Category Image',
          render: (val) => React.createElement('img', { src: formatImageUrl(val) || 'https://via.placeholder.com/50', alt: 'Category', style: { width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' } })
        },
        { key: 'title', label: 'Title', formLabel: 'Category Title', placeholder: 'e.g. Rugs & Carpets' },
        { key: 'pricingInfo', label: 'Pricing Info', formLabel: 'Price / Pricing Info', placeholder: 'e.g. Bulk Pricing Available / MOQ: 25 pcs', fullWidth: true },
        { key: 'created', label: 'Created', hideInForm: true },
        { key: 'description', label: 'Description', type: 'textarea', formLabel: 'Short Description', placeholder: 'Briefly describe the category...', hideInTable: true, fullWidth: true }
      ]
    }, 
    data: []
  },
  { 
    path: 'blog-category', 
    title: 'Blog Category List', 
    breadcrumbParent: 'Blog Categories',
    formTitleAdd: 'Add New Blog Category',
    formTitleEdit: 'Edit Blog Category',
    formSubtitle: 'Create a new category for blogs',
    formCardTitle: '+ Add Category',
    columns: {
      title: 'Blog Category Details',
      icon: 'list',
      addButtonText: 'New Category',
      formSubmitText: 'Save Category',
      formSubmitIcon: 'FaSave',
      headers: [
        { key: 'id', label: 'ID', hideInForm: true },
        { key: 'name', label: 'Name', formLabel: 'Category Name', placeholder: 'Enter category name' },
        { key: 'postCount', label: 'Post Count', hideInForm: true }
      ]
    }, 
    data: [] 
  },


  { 
    path: 'brands', 
    title: 'Inventory: Managed Brands',
    singularTitle: 'Brand',
    breadcrumbParent: 'Brands',
    formTitleAdd: 'Add Brand',
    formTitleEdit: 'Edit Brand',
    formCardTitle: 'ADD BRAND',
    columns: {
      title: 'BRAND REPOSITORY',
      addButtonText: 'New Brand',
      formSubmitText: 'Add Brand',
      headers: [
        { key: 'id', label: 'ID' },
        { 
          key: 'image', 
          label: 'Image', 
          type: 'file', 
          formLabel: 'Brand Image',
          subtext: 'Recommended size: 500x500px | Max 2MB',
          render: (val) => React.createElement('img', {
            src: formatImageUrl(val) || 'https://via.placeholder.com/120x60?text=THE+CONTRACT', 
            alt: 'Brand', 
            style: {maxWidth: '120px', maxHeight: '60px', objectFit: 'contain'}
          }) 
        },
        { key: 'title', label: 'Title', formLabel: 'Brand Title', placeholder: 'e.g. Adidas, Sony, etc.' },
        { key: 'createdAt', label: 'Created Date', formLabel: 'Created Date', hideInForm: true, render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A' }
      ],
      hideDefaultActions: true,
      actions: (row, handlers) => React.createElement('div', {style: {display: 'flex', gap: '8px', alignItems: 'center'}},
        React.createElement('button', {
          style: {backgroundColor: 'white', color: '#f59e0b', border: '1px solid #e2e8f0', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'},
          onClick: () => handlers?.onEdit && handlers.onEdit(row)
        }, React.createElement(FaEdit, null)),
        React.createElement('button', {
          style: {backgroundColor: 'white', color: '#ef4444', border: '1px solid #e2e8f0', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'},
          onClick: () => handlers?.onDelete && handlers.onDelete(row)
        }, React.createElement(FaTrash, null))
      )
    }, 
    data: []
  },
  { 
    path: 'product-cq', 
    title: 'Show Catalogue & Quote',
    singularTitle: 'Catalogue & Quote',
    breadcrumbParent: 'Catalogue & Quote',
    formTitleAdd: 'Add Catalogue & Quote',
    formTitleEdit: 'Edit Catalogue & Quote',
    formCardTitle: 'ADD CATALOGUE & QUOTE',
    columns: {
      title: 'SHOW CATALOGUE & QUOTE',
      addButtonText: 'Add New Catalogue & Quote',
      headers: [
        { key: 'id', label: 'ID' },
        { 
          key: 'icon', 
          label: 'Icon', 
          type: 'icon-picker', 
          formLabel: 'Select Icon',
          render: (val) => {
            const IconComp = (val && FaIcons && FaIcons[val]) ? FaIcons[val] : (FaFileAlt || FaIcons.FaFileAlt);
            return IconComp ? React.createElement(IconComp, { style: { color: '#f59e0b', fontSize: '18px' } }) : null;
          }
        },
        { key: 'title', label: 'Title', formLabel: 'Title', placeholder: 'Enter Title', minWidth: '150px' },
        { key: 'description', label: 'Description', type: 'textarea', formLabel: 'Description', placeholder: 'Enter Description', minWidth: '150px' },
        { key: 'point1', label: 'Point 1', formLabel: 'Point 1', placeholder: 'Enter Point 1', minWidth: '120px' },
        { key: 'point2', label: 'Point 2', formLabel: 'Point 2', placeholder: 'Enter Point 2', minWidth: '120px' },
        { key: 'point3', label: 'Point 3', formLabel: 'Point 3', placeholder: 'Enter Point 3', minWidth: '120px' },
        { 
          key: 'pdfFile', 
          label: 'PDF File', 
          type: 'file', 
          formLabel: 'Upload PDF',
          render: (val) => React.createElement('a', {
            href: val || '#',
            target: '_blank',
            rel: 'noreferrer',
            style: {
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#06b6d4',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: '500'
            }
          }, React.createElement(FaFileAlt, null), 'View PDF')
        }
      ],
      hideDefaultActions: true,
      actions: (row, handlers) => React.createElement('div', {style: {display: 'flex', gap: '5px'}},
        React.createElement('button', {
          className: 'modern-action-btn btn-warning',
          onClick: () => handlers?.onEdit && handlers.onEdit(row)
        }, React.createElement(FaEdit, null)),
        React.createElement('button', {
          className: 'modern-action-btn btn-danger',
          onClick: () => handlers?.onDelete && handlers.onDelete(row)
        }, React.createElement(FaTrash, null))
      )
    }, 
    data: []
  },
  { 
    path: 'artisan', 
    title: 'Artisan Content',
    singularTitle: 'Artisan',
    breadcrumbParent: 'Our Artisan',
    formTitleAdd: 'Add Artisan Video',
    formTitleEdit: 'Edit Artisan Video',
    formCardTitle: 'ADD ARTISAN CONTENT',
    columns: {
      title: 'CONTENT LIST',
      icon: 'users',
      addButtonText: 'Add New Artisan',
      formSubmitText: 'Submit',
      headers: [
        { key: 'id', label: 'ID' },
        { 
          key: 'preview', 
          label: 'Preview', 
          type: 'file', 
          formLabel: 'Video/Image File',
          render: (val) => React.createElement('img', {
            src: formatImageUrl(val) || 'https://via.placeholder.com/80x60?text=Img', 
            alt: 'Preview', 
            style: {width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e5e7eb'}
          }) 
        },
        { key: 'title', label: 'Title', formLabel: 'Artisan Title', placeholder: 'Enter artisan title' },
        { key: 'description', label: 'Description', type: 'textarea', formLabel: 'Artisan Description', placeholder: 'Enter artisan description' },
        { key: 'text', label: 'Text', formLabel: 'Artisan Text', placeholder: 'Enter artisan text', minWidth: '400px' }
      ],
      hideDefaultActions: true,
      actions: (row, handlers) => React.createElement('div', {style: {display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center'}},
        React.createElement('button', {
          className: 'modern-action-btn btn-warning',
          onClick: () => handlers?.onEdit && handlers.onEdit(row)
        }, React.createElement(FaEdit, null)),
        React.createElement('button', {
          className: 'modern-action-btn btn-danger',
          onClick: () => handlers?.onDelete && handlers.onDelete(row)
        }, React.createElement(FaTrash, null))
      )
    }, 
    data: []
  },
  { 
    path: 'leaders', 
    title: 'Manage Leaders',
    singularTitle: 'Leader',
    breadcrumbParent: 'Leaders',
    formTitleAdd: 'Add Leader',
    formTitleEdit: 'Edit Leader',
    formCardTitle: 'ADD LEADER DETAILS',
    columns: {
      title: 'LEADER LIST',
      icon: 'users',
      addButtonText: 'Add Leader',
      headers: [
        { key: 'id', label: '#' },
        { 
          key: 'photo', 
          label: 'Photo', 
          type: 'file', 
          formLabel: 'Leader Photo',
          render: (val) => React.createElement('img', {
            src: formatImageUrl(val) || 'https://via.placeholder.com/60x60?text=Photo', 
            alt: 'Leader', 
            style: {width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%'}
          }) 
        },
        { key: 'name', label: 'Name', formLabel: 'Leader Name', placeholder: 'Enter leader name' },
        { key: 'role', label: 'Role', formLabel: 'Leader Designation', placeholder: 'Enter leader designation' },
        { key: 'description', label: 'Description', type: 'textarea', formLabel: 'Leader Description', placeholder: 'Enter leader description', minWidth: '400px' }
      ],
      hideDefaultActions: true,
      actions: (row, handlers) => React.createElement('div', {style: {display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center'}},
        React.createElement('button', {
          className: 'modern-action-btn btn-warning',
          onClick: () => handlers?.onEdit && handlers.onEdit(row)
        }, React.createElement(FaEdit, null)),
        React.createElement('button', {
          className: 'modern-action-btn btn-danger',
          onClick: () => handlers?.onDelete && handlers.onDelete(row)
        }, React.createElement(FaTrash, null))
      )
    }, 
    data: []
  },

  { 
    path: 'gallery', 
    title: 'Show Gallery',
    singularTitle: 'Gallery',
    breadcrumbParent: 'Gallery',
    formTitleAdd: 'Add Gallery',
    formTitleEdit: 'Edit Gallery',
    formCardTitle: 'ADD GALLERY ITEM',
    columns: {
      title: 'Gallery List',
      addButtonText: 'Add Gallery',
      headers: [
        { key: 'id', label: '#' },
        { key: 'category', label: 'Category', type: 'select', options: ['HANDCRAFTED WOODEN PRODUCTS', 'HANDCRAFTED METAL PRODUCTS'], formLabel: 'Select Category', placeholder: ' ' },
        { key: 'image', label: 'Image', type: 'file', formLabel: 'Upload Image', render: (val) => React.createElement('img', {src: formatImageUrl(val) || 'https://via.placeholder.com/60x40?text=Img', alt: 'Gallery', style: {width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px'}}) },
        { key: 'title', label: 'Title', formLabel: 'Title', placeholder: ' ' },
        { key: 'tagline', label: 'Tagline', formLabel: 'Tagline (e.g. 200+ DESIGNS)', placeholder: '200+ DESIGNS' }
      ],
      hideDefaultActions: false
    }, 
    data: []
  },
  { 
    path: 'gallery-category', 
    title: 'Gallery Categories', 
    singularTitle: 'Gallery Category',
    breadcrumbParent: 'Gallery Categories',
    formTitleAdd: 'Add Gallery Category',
    formTitleEdit: 'Edit Gallery Category',
    formCardTitle: 'ADD CATEGORY',
    columns: {
      title: 'CATEGORY LIST',
      addButtonText: 'Add Category',
      headers: [
        { key: 'id', label: '#' },
        { key: 'categoryName', label: 'Category', formLabel: 'Category Name', placeholder: 'Enter Gallery Category' }
      ],
      hideDefaultActions: true,
      actions: (row, handlers) => React.createElement('div', {style: {display: 'flex', gap: '5px'}},
        React.createElement('button', {
          className: 'modern-action-btn btn-primary',
          onClick: () => handlers?.onEdit && handlers.onEdit(row)
        }, React.createElement(FaEdit, null)),
        React.createElement('button', {
          className: 'modern-action-btn btn-danger',
          onClick: () => handlers?.onDelete && handlers.onDelete(row)
        }, React.createElement(FaTrash, null))
      )
    }, 
    data: []
  },
  { 
    path: 'faq-category', 
    title: 'FAQ CATEGORY LIST', 
    subtitle: 'FAQ CATEGORY LIST',
    columns: {
      title: 'All FAQ Categories',
      addButtonText: 'Add New',
      headers: [
        { key: 'id', label: '#' },
        { key: 'category', label: 'Category', formLabel: 'Category Name', placeholder: 'Enter category name' }
      ],
      hideDefaultActions: true,
      actions: (row, handlers) => React.createElement('div', {style: {display: 'flex', gap: '5px'}},
        React.createElement('button', {
          className: 'modern-action-btn btn-primary',
          onClick: () => handlers?.onEdit && handlers.onEdit(row)
        }, React.createElement(FaEdit, null)),
        React.createElement('button', {
          className: 'modern-action-btn btn-danger',
          onClick: () => handlers?.onDelete && handlers.onDelete(row)
        }, React.createElement(FaTrash, null))
      )
    }, 
    data: []
  },
  { 
    path: 'faq', 
    title: 'FAQ List', 
    subtitle: 'FAQ List',
    columns: {
      title: 'ALL FAQ',
      addButtonText: 'Add FAQ',
      headers: [
        { key: 'id', label: '#' },
        { key: 'category', label: 'Category', formLabel: 'Select Category', type: 'select', options: [] },
        { key: 'question', label: 'Question', placeholder: ' ' },
        { key: 'answer', label: 'Answer', type: 'textarea', placeholder: ' ' }
      ],
      hideDefaultActions: true,
      actions: (row, handlers) => React.createElement('div', {style: {display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '30px', margin: '0 auto'}},
        React.createElement('button', {
          className: 'modern-action-btn btn-warning',
          onClick: () => handlers?.onEdit && handlers.onEdit(row)
        }, React.createElement(FaEdit, null)),
        React.createElement('button', {
          className: 'modern-action-btn btn-danger',
          onClick: () => handlers?.onDelete && handlers.onDelete(row)
        }, React.createElement(FaTrash, null))
      )
    }, 
    data: []
  },
  { 
    path: 'certifications', 
    title: 'Certificate List', 
    subtitle: 'Certificate List',
    columns: {
      title: 'ALL CERTIFICATES',
      addButtonText: 'Add New Certificate',
      headers: [
        { key: 'id', label: '#' },
        { key: 'title', label: 'Title', formLabel: 'Certificate Title (e.g. Importer Exporter Code)' },
        { key: 'subtitle', label: 'Subtitle', formLabel: 'Subtitle (e.g. IEC Certificate)' },
        { key: 'description', label: 'Description', formLabel: 'Description', type: 'textarea' },
        { key: 'icon', label: 'Icon Name', formLabel: 'Lucide Icon Name (e.g. ShieldCheck, FileCheck2, Landmark, BadgeCheck)' },
        { key: 'pdfUrl', label: 'Upload Certificate (PDF/Image)', type: 'file', hideInTable: true },
        { key: 'preview', label: 'Preview', hideInForm: true, render: (val, row) => React.createElement('button', {
            className: 'modern-action-btn btn-primary',
            onClick: () => window.open(row.pdfUrl ? formatImageUrl(row.pdfUrl) : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank')
          }, React.createElement(FaEye, null), ' View') 
        },
        { key: 'download', label: 'Download', hideInForm: true, render: (val, row) => React.createElement('button', {
            className: 'modern-action-btn btn-success',
            onClick: async () => {
              const dummyPdf = 'data:application/pdf;base64,JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDU1ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDAgMCAwIHJnCiAgICAoRHVtbXkgUERGIFRlc3QpIFRqCiAgRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE4IDAwMDAwIG4gCjAwMDAwMDAwNzcgMDAwMDAgbiAKMDAwMDAwMDE3OCAwMDAwMCBuIAowMDAwMDAwNDU3IDAwMDAwIG4gCnRyYWlsZXIKICA8PCAgL1Jvb3QgMSAwIFIKICAgICAgL1NpemUgNQogID4+CnN0YXJ0eHJlZgo1NjUKJSVFT0YK';
              const fileUrl = row.pdfUrl ? formatImageUrl(row.pdfUrl) : dummyPdf;
              
              if (fileUrl.startsWith('data:')) {
                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = row.title + '.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return;
              }

              try {
                const response = await fetch(fileUrl);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = row.title + '.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
              } catch (err) {
                console.error("Fetch download failed (likely CORS), falling back to open:", err);
                const fallbackLink = document.createElement('a');
                fallbackLink.href = fileUrl;
                fallbackLink.download = row.title + '.pdf';
                fallbackLink.target = '_blank';
                document.body.appendChild(fallbackLink);
                fallbackLink.click();
                document.body.removeChild(fallbackLink);
              }
            }
          }, React.createElement(FaDownload, null), ' Download') 
        }
      ],
      hideDefaultActions: true,
      actions: (row, handlers) => React.createElement('div', {style: {display: 'flex', gap: '5px'}},
        React.createElement('button', {
          className: 'modern-action-btn btn-warning',
          onClick: () => handlers?.onEdit && handlers.onEdit(row)
        }, React.createElement(FaEdit, null)),
        React.createElement('button', {
          className: 'modern-action-btn btn-danger',
          onClick: () => handlers?.onDelete && handlers.onDelete(row)
        }, React.createElement(FaTrash, null))
      )
    }, 
    data: []
  },
  {
    path: 'download-leads',
    title: 'Certificate Downloads',
    subtitle: 'List of users who downloaded certificates',
    columns: {
      title: 'DOWNLOAD LEADS',
      addButtonText: '', // No add button needed for leads
      headers: [
        { key: 'id', label: '#' },
        { key: 'name', label: 'Name', formLabel: 'Name' },
        { key: 'mobile', label: 'Mobile', formLabel: 'Mobile' },
        { key: 'email', label: 'Email', formLabel: 'Email' },
        { key: 'certificateTitle', label: 'Certificate', formLabel: 'Certificate Title' },
        { key: 'createdAt', label: 'Downloaded At', hideInForm: true, render: (val) => new Date(val).toLocaleString() }
      ],
      hideDefaultActions: true,
      actions: (row, handlers) => React.createElement('div', {style: {display: 'flex', gap: '5px'}},
        React.createElement('button', {
          className: 'modern-action-btn btn-danger',
          onClick: () => handlers?.onDelete && handlers.onDelete(row)
        }, React.createElement(FaTrash, null))
      )
    },
    data: []
  },

  { 
    path: 'contact', 
    title: 'Contact Messages', 
    subtitle: 'Contact Messages',
    columns: {
      title: React.createElement('div', {style: {display: 'flex', alignItems: 'center', gap: '8px'}}, 
        React.createElement(FaEnvelope, null), 
        'Contact Message Details',
        React.createElement('style', null, `
          .generic-list-page .data-table th {
            background-color: #374151 !important;
            color: #ffffff !important;
            border-bottom: none !important;
          }
          .generic-list-page .data-table th, .generic-list-page .data-table td {
            white-space: nowrap;
            min-width: 150px;
            padding: 12px 20px !important;
          }
        `)
      ),
      headers: [
        { key: 'id', label: 'ID' },
        { key: 'fullName', label: 'Full Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'country', label: 'Country' },
          { key: 'message', label: 'Message' },
        { key: 'createdAt', label: 'Created At' }
      ],
      hideDefaultActions: true,
      actions: (row, { onDelete }) => React.createElement('div', {style: {display: 'flex', gap: '5px'}},
        row.phone && React.createElement('button', {
          className: 'modern-action-btn btn-success',
          title: 'WhatsApp',
          onClick: () => window.open(`https://wa.me/${row.phone.replace(/[^0-9]/g, '')}`, '_blank')
        }, React.createElement(FaWhatsapp, null)),
        row.phone && React.createElement('button', {
          className: 'modern-action-btn btn-primary',
          title: 'Call',
          onClick: () => window.open(`tel:${row.phone}`, '_self')
        }, React.createElement(FaPhone, null)),
        row.email && React.createElement('button', {
          className: 'modern-action-btn btn-primary',
          title: 'Email',
          onClick: () => window.open(`mailto:${row.email}`, '_blank')
        }, React.createElement(FaEnvelope, null)),
        React.createElement('button', {
          className: 'modern-action-btn btn-danger',
          title: 'Delete Message',
          onClick: () => onDelete && onDelete(row)
        }, React.createElement(FaTrash, null))
      )
    }, 
    data: []
  },
  { 
    path: 'service-inquiries', 
    title: 'Service Inquiries', 
    subtitle: 'Service Inquiries',
    columns: {
      title: 'SERVICE INQUIRY LIST',
      headers: [
        { key: 'id', label: '#' },
        { key: 'service', label: 'Service / Sub-Service', render: (val) => React.createElement('span', {style: {backgroundColor: '#14b8a6', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '11px'}}, val) },
        { key: 'customer', label: 'Customer Details', render: (val, row) => React.createElement('div', {style: {lineHeight: '1.6'}}, 
            React.createElement('div', {style: {fontWeight: 'bold', color: '#111827'}}, row.customerName),
            React.createElement('div', {style: {display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px'}}, React.createElement(FaEnvelope, {style: {color: '#6366f1'}}), row.email),
            React.createElement('div', {style: {display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#dc2626'}}, React.createElement(FaPhone, null), row.phone)
          ) 
        },
        { key: 'location', label: 'Location' },
        { key: 'message', label: 'Message' },
        { key: 'document', label: 'Document', render: (val) => val ? React.createElement('a', {href: val, target: '_blank', style: {color: '#3b82f6', textDecoration: 'underline'}}, 'View Document') : 'No Document' },
        { key: 'date', label: 'Date' }
      ],
      hideDefaultActions: true,
      actions: (row, context = {}) => React.createElement('div', {style: {display: 'flex'}},
        React.createElement('button', {
          className: 'modern-action-btn btn-success',
          title: 'Call Now',
          onClick: () => window.open(`tel:${row.phone}`, '_self')
        }, React.createElement(FaPhone, null)),
        React.createElement('button', {
          className: 'modern-action-btn btn-primary',
          title: 'Send Email',
          onClick: () => window.open(`mailto:${row.email}`, '_blank')
        }, React.createElement(FaEnvelope, null)),
        React.createElement('button', {
          className: 'modern-action-btn btn-danger',
          title: 'Delete',
          onClick: () => {
            Swal.fire({
              title: 'Are you sure?',
              text: "Do you want to delete this inquiry?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#ef4444',
              cancelButtonColor: '#6b7280',
              confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
              if (result.isConfirmed) {
                if(context.onDelete) context.onDelete(row);
                else alert(`Delete Inquiry ID: ${row.id}`);
              }
            });
          }
        }, React.createElement(FaTrash, null))
      )
    }, 
    data: []
  },
  { 
    path: 'download-leads', 
    title: 'Download Leads', 
    subtitle: 'Download Leads',
    columns: {
      title: 'LEADS LIST',
      headers: [
        { key: 'id', label: 'ID' },
        { key: 'email', label: 'Email' },
        { key: 'fileSource', label: 'File Source', render: (val) => React.createElement('a', {href: '#', style: {color: '#3b82f6', textDecoration: 'none'}}, val) },
        { key: 'date', label: 'Date' }
      ],
      hideDefaultActions: true
    }, 
    data: []
  },
  { 
    path: 'vendor-management/master', 
    apiEndpoint: '/vendors',
    title: 'Vendor Master', 
    singularTitle: 'Vendor',
    subtitle: 'Vendor Master',
    formTitleAdd: 'Add Vendor',
    formTitleEdit: 'Edit Vendor',
    formCardTitle: 'ADD VENDOR',
    formFields: [
      { name: 'vendorName', label: 'Vendor Name', type: 'text', required: true, width: 'full' },
      { name: 'amount', label: 'Amount', type: 'text', required: true, width: 'half' },
      { name: 'email', label: 'Email', type: 'email', width: 'half' },
      { name: 'phone', label: 'Phone', type: 'text', width: 'half' },
      { name: 'status', label: 'Status', type: 'select', options: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE', width: 'half' }
    ],
    columns: {
      title: 'VENDOR LIST',
      addButtonText: 'Add Vendor',
      formSubmitText: 'Save Vendor',
      headers: [
        { key: 'id', label: '#' },
        { key: 'vendorName', label: 'Vendor Name' },
        { key: 'amount', label: 'Amount' }
      ],
      hideDefaultActions: false
    }, 
    data: []
  },
  { 
    path: 'vendor-management/report', 
    title: 'Vendor Report', 
    subtitle: 'Vendor Report',
    columns: {
      title: 'VENDOR SUMMARY',
      headers: [
        { key: 'id', label: '#' },
        { key: 'vendorName', label: 'Vendor Name' },
        { key: 'totalInvoices', label: 'Total Invoices' },
        { key: 'totalInvoiceAmount', label: 'Total Invoice Amount' },
        { key: 'totalCommission', label: 'Total Amount' },
        { key: 'totalPayout', label: 'Total Payout', render: (val) => React.createElement('strong', null, val) },
        { key: 'released', label: 'Released', render: (val) => React.createElement('span', {style: {color: '#22c55e'}}, val) },
        { key: 'pending', label: 'Pending', render: (val) => React.createElement('span', {style: {color: '#f59e0b'}}, val) }
      ],
      hideDefaultActions: true
    }, 
    data: []
  },
  { 
    path: 'vendor-management/payout', 
      title: 'Vendor Payout', 
      subtitle: 'Vendor Payout',
      columns: {
        title: 'PAYOUT LIST',
        headers: [
          { key: 'id', label: '#' },
          { key: 'vendorId', label: 'Vendor', render: (val) => React.createElement(VendorNameDisplay, { vendorId: val }) },
          { key: 'createdAt', label: 'Date', render: (val) => val ? new Date(val).toLocaleDateString('en-IN') : '-' },
        { key: 'invoiceId', label: 'Invoice ID' },
        { key: 'invoiceAmount', label: 'Invoice Amount' },
        { key: 'commission', label: 'Amount' },
        { key: 'payoutAmount', label: 'Payout Amount', render: (val) => React.createElement('strong', null, val) },
        { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Released'] }
      ],
      hideDefaultActions: true,
      actions: (row) => React.createElement('div', {style: {display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '80px'}},
          React.createElement('button', {
              className: 'modern-action-btn btn-primary',
              onClick: () => window.open(`/admin/vendor-management/payout-preview/${row._id}`, '_blank')
          }, React.createElement(FaFileAlt, null), ' PDF')
        )
    }, 
    data: []
  },
  { 
    path: 'retailer-system/product-inquiries', 
    title: 'Retailer System - Inquiries', 
    subtitle: 'Retailer Inquiries',
    columns: {
      title: 'RETAILER INQUIRY LIST',
      headers: [
        { key: 'id', label: 'ID' },
        { key: 'product', label: 'Product', render: (val, row) => React.createElement('div', null, React.createElement('div', {style: {marginBottom: '6px', color: '#334155'}}, row.productName), React.createElement('div', {style: {color: '#6b7280', fontSize: '13px'}}, 'ID: ' + row.productId)) },
        { key: 'customer', label: 'Customer', render: (val, row) => React.createElement('div', {style: {maxWidth: '80px', lineHeight: '1.4'}}, row.customer) },
        { key: 'contact', label: 'Contact', render: (val, row) => React.createElement('div', {style: {lineHeight: '1.8', fontSize: '13px'}}, 
            React.createElement('div', null, '📧 ' + row.email),
            React.createElement('div', null, '📞 ' + row.phone),
            React.createElement('div', null, '💬 ' + row.altPhone)
        ) },
        { key: 'location', label: 'Location', render: (val, row) => React.createElement('div', {style: {maxWidth: '120px', lineHeight: '1.4'}}, row.location) },
        { key: 'orderType', label: 'Order Type', render: (val) => React.createElement('span', {className: 'modern-action-btn btn-primary'}, val) },
        { key: 'qty', label: 'Qty' },
        { key: 'budget', label: 'Budget' },
        { key: 'date', label: 'Date', render: (val, row) => React.createElement('div', {style: {maxWidth: '40px', lineHeight: '1.4'}}, row.date) }
      ],
      actions: (row, { onDelete }) => React.createElement('div', {style: {display: 'flex', gap: '5px'}},
        React.createElement('button', {
          className: 'modern-action-btn btn-success',
          onClick: async () => {
            try {
              if (row.quotationId) {
                const result = await Swal.fire({
                  title: 'Quotation Already Exists',
                  html: `A quotation (ID: <b>${row.quoteNo || 'Unknown'}</b>) already exists for this inquiry.`,
                  icon: 'info',
                  showCancelButton: true,
                  confirmButtonText: 'Want to Edit/View',
                  cancelButtonText: 'Cancel'
                });
                if (result.isConfirmed) {
                  window.location.href = `/admin/retailer-system/quotations?search=${row.quoteNo || ''}`;
                }
              } else {
                window.location.href = `/admin/retailer-system/product-inquiries/create-quotation/${row.id || row._id}`;
              }
            } catch (e) {
              console.error(e);
              window.location.href = `/admin/retailer-system/product-inquiries/create-quotation/${row.id || row._id}`;
            }
          }
        }, '📄 Create Quotation'),
        React.createElement('button', {
          className: 'modern-action-btn btn-danger',
          title: 'Delete Inquiry',
          onClick: () => onDelete && onDelete(row)
        }, React.createElement(FaTrash, {style: {fontSize: '14px'}}))
      )
    }, 
    data: []
  },
  { 
    path: 'retailer-system/orders', 
    title: 'Retailer System - Orders', 
    subtitle: 'Retailer Orders',
    columns: {
      title: 'RETAILER ORDER LIST',
      headers: [
        { key: 'id', label: '#' },
        { key: 'orderNo', label: 'Order No' },
        { key: 'quotation', label: 'Quotation' },
        { key: 'incoterm', label: 'Incoterm', type: 'select', options: [{ value: 'FOB', label: 'FOB (Free On Board)' }, { value: 'EXW', label: 'EXW (Ex Works)' }, { value: 'CIF', label: 'CIF (Cost, Insurance, and Freight)' }, { value: 'DDP', label: 'DDP (Delivered Duty Paid)' }, { value: 'DAP', label: 'DAP (Delivered at Place)' }, { value: 'FCA', label: 'FCA (Free Carrier)' }, { value: 'CPT', label: 'CPT (Carriage Paid To)' }, { value: 'CIP', label: 'CIP (Carriage and Insurance Paid To)' }, { value: 'CFR', label: 'CFR (Cost and Freight)' }, { value: 'FAS', label: 'FAS (Free Alongside Ship)' }] },
        { key: 'deliveryPort', label: 'Port', formLabel: 'Delivery Port (e.g., JNPT Mumbai)' },
        { key: 'status', label: 'Status', render: (val) => {
            if (val === 'Processing') {
              return React.createElement('span', {className: 'modern-action-btn btn-success'}, val);
            }
            return React.createElement('span', {className: 'modern-action-btn btn-success'});
          } 
        },
        { key: 'date', label: 'Date' }
      ]
    }, 
    data: []
  },
  { 
    path: 'retailer-system/quotations', 
    title: 'Retailer System - Quotations', 
    subtitle: 'Retailer Quotations',
    columns: {
      title: 'RETAILER QUOTATION LIST',
      headers: [
        { key: 'id', label: '#' },
        { key: 'quoteNo', label: 'Quote No', render: (val) => React.createElement('div', {style: {maxWidth: '120px', wordWrap: 'break-word'}}, val) },
        { key: 'customer', label: 'Customer' },
        { key: 'product', label: 'Product' },
        { key: 'qty', label: 'Qty' },
        { key: 'total', label: 'Total' },
        { key: 'status', label: 'Status', render: (val) => {
            if (val === 'Accepted') {
              return React.createElement('span', {className: 'modern-action-btn btn-success'}, val);
            }
            return val;
          } 
        },
        { key: 'date', label: 'Date', render: (val) => React.createElement('div', {style: {maxWidth: '60px'}}, val) }
      ],
      hideDefaultActions: true,
      actions: (row) => React.createElement('button', {
        className: 'modern-action-btn btn-primary',
        onClick: () => window.location.href = `/admin/retailer-system/quotations/preview/${row._id}`
      }, '📄')
    }, 
    data: []
  },
  { 
    path: 'retailer-system/invoices', 
    title: 'Retailer System - Invoices', 
    subtitle: 'Retailer Invoices',
    columns: {
      title: 'RETAILER INVOICE LIST',
      headers: [
        { key: 'id', label: '#' },
        { key: 'invoiceNo', label: 'Invoice No', render: (val) => React.createElement('div', {style: {maxWidth: '130px', wordWrap: 'break-word'}}, val) },
        { key: 'orderNo', label: 'Order No', render: (val) => React.createElement('div', {style: {maxWidth: '130px', wordWrap: 'break-word'}}, val) },
        { key: 'customer', label: 'Customer' },
        { key: 'country', label: 'Country' },
        { key: 'total', label: 'Total' },
        { key: 'vendorId', label: 'Assigned Vendor', render: (val) => React.createElement(VendorNameDisplay, { vendorId: val, fallbackStyle: { color: '#16a34a', fontWeight: 'bold' } }) },
        { key: 'status', label: 'Status', render: (val, row, handlers) => {
              let bg = '#fef08a';
              let color = '#854d0e';
              if (val === 'Full Paid' || val === 'Paid') { bg = '#dcfce7'; color = '#166534'; }
                else if (val === 'Partial Paid') { bg = '#fef3c7'; color = '#92400e'; }
              else if (val === 'Cancelled') { bg = '#fee2e2'; color = '#991b1b'; }
              
              const arrowSvg = `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${color.replace('#', '%23')}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E`;

              return React.createElement('select', {
                value: val || 'Pending',
                style: {
                  backgroundColor: bg, 
                  color: color, 
                  padding: '6px 28px 6px 12px', 
                  borderRadius: '16px', 
                  fontSize: '12px', 
                  fontWeight: '600',
                  border: '1px solid ' + bg,
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  backgroundImage: `url("${arrowSvg}")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center',
                  backgroundSize: '12px'
                },
                onChange: (e) => {
                  const newStatus = e.target.value;
                  if (handlers && handlers.onUpdateRow) {
                    handlers.onUpdateRow(row._id, 'status', newStatus);
                  } else {
                    api.put(`/invoices/${row._id}`, { status: newStatus })
                      .then(() => window.location.reload())
                      .catch(err => {
                        console.error(err);
                        alert('Failed to update status');
                      });
                  }
                }
              },
                React.createElement('option', {value: 'Pending'}, 'Pending'),
                React.createElement('option', {value: 'Partial Paid'}, 'Partial Paid'),
                  React.createElement('option', {value: 'Full Paid'}, 'Full Paid'),
                React.createElement('option', {value: 'Cancelled'}, 'Cancelled')
              );
            }
        }
      ],
      hideDefaultActions: true,
      actions: (row) => React.createElement('div', {style: {display: 'flex', flexWrap: 'wrap', gap: '5px', maxWidth: '160px'}}, 
        !row.vendorId && React.createElement('button', {
            className: 'modern-action-btn btn-neutral',
            onClick: async () => {
              try {
                const res = await api.get('/vendors');
                const vendors = Array.isArray(res.data) ? res.data : (res.data.data || []);
                let options = '<option value="">Select a vendor...</option>';
                vendors.forEach(v => { options += `<option value="${v._id}">${v.vendorName} ${v.amount ? `(${v.amount})` : (v.commission ? `(${v.commission}%)` : '')}</option>`; });
                const { value: vendorId } = await Swal.fire({
                  title: 'Assign Vendor',
                  html: `<select id="vendor-select" class="swal2-input">${options}</select>`,
                  focusConfirm: false,
                  showCancelButton: true,
                  preConfirm: () => document.getElementById('vendor-select').value
                });
                if (vendorId) {
                  try {
                    await api.put(`/invoices/${row._id}`, { vendorId });
                    
                    let linkedOrderId = null;
                    try {
                      const ordersRes = await api.get('/orders');
                      const orderData = (Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data.data) || [];
                      const matchedOrder = orderData.find(o => o.orderNo === row.orderNo);
                      if (matchedOrder) {
                        linkedOrderId = matchedOrder._id;
                      }
                    } catch(e) {}
                    
                    await api.post('/vendor-orders', {
                        poNumber: 'PO-' + row.orderNo,
                        vendorId: vendorId,
                        orderId: linkedOrderId,
                        agreedPriceInr: row.total || 0,
                        status: 'Pending',
                        installments: []
                    });
                    
                    Swal.fire('Assigned!', 'Vendor assigned & PO created successfully.', 'success').then(() => window.location.reload());
                  } catch (assignErr) {
                    Swal.fire('Error', 'Failed to assign vendor or create PO', 'error');
                  }
                }
              } catch (e) { Swal.fire('Error', 'Failed to load vendors', 'error'); }
            }
        }, 'Assign Vendor'),
        React.createElement('button', {
            className: 'modern-action-btn btn-primary',
            onClick: () => alert(`Generating PDF for ${row.invoiceNo}`)
        }, '📄 PDF'),
        React.createElement('button', {
            className: 'modern-action-btn btn-primary',
            onClick: () => alert(`Viewing Shipping for ${row.invoiceNo}`)
        }, '🚚 Shipping')
      )
    }, 
    data: []
  },
  { 
    path: 'retailer-system/payments', 
    title: 'Retailer System - Payments', 
    subtitle: 'Retailer Payments',
    columns: {
      title: 'RETAILER PAYMENTS LIST',
      headers: [
        { key: 'id', label: '#' },
        { key: 'invoiceNo', label: 'Invoice No' },
        { key: 'orderNo', label: 'Order No' },
        { key: 'mode', label: 'Mode' },
        { key: 'reference', label: 'Reference' },
        { key: 'amount', label: 'Amount' },
        { key: 'status', label: 'Status', render: (val, row, handlers) => {
            let bg = '#f3f4f6';
            let color = '#374151';
            if (val === 'Full Paid' || val === 'Paid') { bg = '#dcfce7'; color = '#166534'; }
                else if (val === 'Partial Paid') { bg = '#fef3c7'; color = '#92400e'; }
            else if (val === 'Failed') { bg = '#fee2e2'; color = '#991b1b'; }
            else if (val === 'Refunded') { bg = '#fef08a'; color = '#854d0e'; }
            
            const arrowSvg = `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${color.replace('#', '%23')}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E`;
            
            return React.createElement('select', {
              value: val || 'Pending',
              style: {
                backgroundColor: bg,
                color: color,
                padding: '6px 28px 6px 12px',
                borderRadius: '16px',
                fontSize: '12px',
                fontWeight: '600',
                border: '1px solid ' + bg,
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                backgroundImage: `url("${arrowSvg}")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 8px center',
                backgroundSize: '14px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              },
              onChange: (e) => {
                const newStatus = e.target.value;
                if (handlers && handlers.onUpdateRow) {
                  handlers.onUpdateRow(row._id, 'status', newStatus);
                } else {
                  api.put(`/retailer/payments/${row._id}`, { status: newStatus })
                    .then(() => window.location.reload())
                    .catch(err => alert('Error updating status: ' + err.message));
                }
              }
            }, 
            React.createElement('option', {value: 'Pending', style: {color: 'black', backgroundColor: 'white'}}, 'Pending'),
            React.createElement('option', {value: 'Paid', style: {color: 'black', backgroundColor: 'white'}}, 'Paid'),
            React.createElement('option', {value: 'Failed', style: {color: 'black', backgroundColor: 'white'}}, 'Failed'),
            React.createElement('option', {value: 'Refunded', style: {color: 'black', backgroundColor: 'white'}}, 'Refunded')
            );
          } 
        },
        { key: 'date', label: 'Date' }
      ],
      hideDefaultActions: true,
      actions: (row) => React.createElement('div', {style: {display: 'flex', gap: '5px', flexWrap: 'wrap'}},
        React.createElement('button', {
            className: 'modern-action-btn btn-danger',
            onClick: () => {
              Swal.fire({
                title: 'Delete Payment?',
                text: 'Are you sure you want to delete this payment record?',
                icon: 'warning',
                showCancelButton: true
              }).then(async (result) => {
                if (result.isConfirmed) {
                  try {
                    await api.delete(`/retailer/payments/${row._id}`);
                    Swal.fire('Deleted!', '', 'success').then(() => window.location.reload());
                  } catch(e) {
                    Swal.fire('Error', 'Failed to delete payment.', 'error');
                  }
                }
              });
            }
        }, 'Delete')
      )
    }, 
    data: []
  },
  { 
    path: 'retailer-system/shipping', 
    title: 'Retailer System - Shipping', 
    subtitle: 'Retailer Shipping',
    columns: {
      title: 'RETAILER SHIPPING LIST',
      headers: [
        { key: 'id', label: '#' },
        { key: 'orderNo', label: 'Order No' },
        { key: 'company', label: 'Company' },
        { key: 'trackingNo', label: 'Tracking No' },
        { key: 'date', label: 'Date' },
        { key: 'status', label: 'Status' }
      ],
      hideDefaultActions: true,
      actions: null
    }, 
    data: []
  },



  { 
    path: 'sub-admin-mgmt', 
    title: 'Sub Admin Management', 
    subtitle: 'Manage roles and permissions',
    columns: {
      title: 'SUB ADMIN LIST',
      icon: 'users',
      addButtonText: 'Add New Sub Admin',
      headers: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'password', label: 'Password' },
        { key: 'status', label: 'Status' },
        { key: 'permissions', label: 'Permissions', type: 'permissions', render: (val) => Array.isArray(val) ? val.join(', ') : val }
      ]
    }, 
    data: [] 
  },
  { 
    path: 'vendor-management/orders', 
    title: 'Vendor Orders', 
    subtitle: 'Manage Purchase Orders to Vendors',
    apiEndpoint: '/vendor-orders',
    formCardTitle: 'VENDOR ORDER DETAILS',
    formTitleAdd: 'Add Vendor Order',
    formTitleEdit: 'Edit Vendor Order',
    columns: {
      title: 'VENDOR ORDERS',
      icon: 'box',
      addButtonText: 'Create Vendor PO',
      formSubmitText: 'Save Order',
      headers: [
        { key: 'id', label: 'ID' },
        { key: 'poNumber', label: 'PO Number', formLabel: 'PO Number' },
        { key: 'vendorId', label: 'Vendor', render: (val) => React.createElement(VendorNameDisplay, { vendorId: val }), type: 'select', options: [], formLabel: 'Vendor (ID)' }, // Note: Would ideally fetch from vendors API
        { key: 'orderId', label: 'Linked Order', render: (val, row) => row.poNumber ? row.poNumber.replace('PO-', '') : val, type: 'select', options: [], formLabel: 'Linked Order (ID)' }, 
        { key: 'agreedPriceInr', label: 'Agreed Price (₹)', type: 'number', formLabel: 'Agreed Price (INR)' },
        { key: 'advancePaidInr', label: 'Advance Paid (₹)', type: 'number', formLabel: 'Advance Paid (INR)' },
        { key: 'balancePaidInr', label: 'Balance Paid (₹)', type: 'number', formLabel: 'Balance Paid (INR)' },
        { 
          key: 'pendingAmount', 
          label: 'Pending Amount (₹)', 
          render: (val, row) => {
            const agreed = parseFloat(row.agreedPriceInr) || 0;
            let totalPaid = 0;
            if ((parseFloat(row.advancePaidInr) || 0) + (parseFloat(row.balancePaidInr) || 0) > 0) {
              totalPaid = (parseFloat(row.advancePaidInr) || 0) + (parseFloat(row.balancePaidInr) || 0);
            } else if (row.installments && Array.isArray(row.installments)) {
              totalPaid = row.installments.reduce((sum, inst) => inst.status === 'Paid' ? sum + (parseFloat(inst.amount) || 0) : sum, 0);
            } else {
              totalPaid = 0;
            }
            return (agreed - totalPaid).toFixed(2);
          },
          hideInForm: true 
        },
        { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Production Started', 'Completed', 'Goods Received'], formLabel: 'Status' },
        { key: 'expectedDeliveryDate', label: 'Expected Delivery Date', type: 'date', formLabel: 'Expected Delivery Date', hideInTable: true },
        { key: 'incoterm', label: 'Incoterm', type: 'select', options: [{ value: 'FOB', label: 'FOB (Free On Board)' }, { value: 'EXW', label: 'EXW (Ex Works)' }, { value: 'CIF', label: 'CIF (Cost, Insurance, and Freight)' }, { value: 'DDP', label: 'DDP (Delivered Duty Paid)' }, { value: 'DAP', label: 'DAP (Delivered at Place)' }, { value: 'FCA', label: 'FCA (Free Carrier)' }, { value: 'CPT', label: 'CPT (Carriage Paid To)' }, { value: 'CIP', label: 'CIP (Carriage and Insurance Paid To)' }, { value: 'CFR', label: 'CFR (Cost and Freight)' }, { value: 'FAS', label: 'FAS (Free Alongside Ship)' }], hideInTable: true },
        { key: 'currency', label: 'Currency', formLabel: 'Currency', hideInTable: true },
        { key: 'paymentTerms', label: 'Payment Terms', type: 'textarea', formLabel: 'Payment Terms', hideInTable: true },
        { key: 'paymentMethod', label: 'Payment Method', formLabel: 'Payment Method', hideInTable: true },
        { key: 'deliveryPort', label: 'Delivery Port', formLabel: 'Delivery Port', hideInTable: true },
        { key: 'packaging', label: 'Packaging', type: 'textarea', formLabel: 'Packaging', hideInTable: true },
        { key: 'qualityAssurance', label: 'Quality Assurance', type: 'textarea', formLabel: 'Quality Assurance', hideInTable: true },
        { key: 'leadTime', label: 'Lead Time', type: 'textarea', formLabel: 'Lead Time', hideInTable: true },
        { key: 'cancellation', label: 'Cancellation Terms', type: 'textarea', formLabel: 'Cancellation Terms', hideInTable: true },
        { key: 'shippingMode', label: 'Shipping Mode', formLabel: 'Shipping Mode', hideInTable: true },
        { key: 'preferredCarrier', label: 'Preferred Carrier', formLabel: 'Preferred Carrier', hideInTable: true },
        { key: 'specialInstructions', label: 'Special Instructions', type: 'textarea', formLabel: 'Special Instructions', hideInTable: true }
      ],
      actions: (row, handlers) => React.createElement('div', {style: {display: 'flex', gap: '4px'}},
        React.createElement('button', {
            className: 'modern-action-btn',
            onClick: () => handlers.onEdit(row),
            title: 'Edit Order',
            style: { backgroundColor: '#3b82f6', color: 'white' }
        }, React.createElement(FaEdit)),
        React.createElement('button', {
            className: 'modern-action-btn',
            onClick: () => window.location.href = `/admin/vendor-management/orders/preview/${row._id}`,
            title: 'Preview PO',
            style: { backgroundColor: '#8b5cf6', color: 'white' }
        }, React.createElement(FaFilePdf)),
        React.createElement('button', {
            className: 'modern-action-btn',
            onClick: () => manageVendorInstallments(row, handlers.refresh),
            title: 'Manage Installments',
            style: { backgroundColor: '#10b981', color: 'white' }
        }, React.createElement(FaMoneyBillAlt)),
        React.createElement('button', {
            className: 'modern-action-btn',
            onClick: () => handlers.onDelete(row),
            title: 'Delete Order',
            style: { backgroundColor: '#ef4444', color: 'white' }
        }, React.createElement(FaTrash))
      )
    }, 
    data: [] 
  },
  { 
    path: 'domestic-logistics', 
    title: 'Domestic Logistics', 
    subtitle: 'E-Way Bill & Transport to Port',
    apiEndpoint: '/domestic-logistics',
    formCardTitle: 'LOGISTICS DETAILS',
    formTitleAdd: 'Add Logistics Record',
    formTitleEdit: 'Edit Logistics Record',
    columns: {
      title: 'DOMESTIC LOGISTICS',
      icon: 'truck',
      addButtonText: 'Create E-Way Bill Record',
      formSubmitText: 'Save Details',
      headers: [
        { key: 'id', label: 'ID' },
        { key: 'ewayBillNo', label: 'E-Way Bill No.', formLabel: 'E-Way Bill No' },
        { key: 'orderId', label: 'Linked Order', formLabel: 'Linked Order (ID)' },
        { key: 'transporterName', label: 'Transporter', formLabel: 'Transporter Name', nested: 'transporterDetails' },
        { key: 'vehicleNo', label: 'Vehicle No.', formLabel: 'Vehicle Number', nested: 'transporterDetails' },
        { key: 'lrRrAirwayBill', label: 'LR/RR/Tracking ID', formLabel: 'Tracking ID (LR/RR)', nested: 'transporterDetails' },
        { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'In Transit', 'Reached Port'], formLabel: 'Status' }
      ],
      hideDefaultActions: false,
      actions: (row, { onEdit, onDelete }) => React.createElement('div', {style: {display: 'flex', gap: '4px'}},
        React.createElement('button', {
            className: 'modern-action-btn btn-success',
            title: 'Preview E-Way Bill',
            onClick: () => window.location.href = `/admin/domestic-logistics/preview/${row._id}`
        }, React.createElement(FaFilePdf, null)),
        row.orderId ? React.createElement('button', {
            className: 'modern-action-btn btn-warning',
            style: { backgroundColor: '#3b82f6', color: 'white' },
            title: 'View Order Details',
            onClick: () => {
              const oid = typeof row.orderId === 'object' ? row.orderId._id : row.orderId;
              window.location.href = `/admin/inquiry-system/orders/details/${oid}`;
            }
        }, React.createElement(FaExternalLinkAlt, null)) : null,
        onEdit && React.createElement('button', {
            className: 'modern-action-btn btn-primary',
            onClick: () => onEdit(row)
        }, React.createElement(FaEdit, null)),
        onDelete && React.createElement('button', {
            className: 'modern-action-btn btn-danger',
            onClick: () => onDelete(row)
        }, React.createElement(FaTrashAlt, null))
      )
    }, 
    data: [] 
  },
  {
    path: 'membership-plans',
    title: 'Subscription Plans',
    singularTitle: 'Subscription Plan',
    breadcrumbParent: 'Subscription',
    formTitleAdd: 'Add Subscription Plan',
    formTitleEdit: 'Edit Subscription Plan',
    formCardTitle: 'SUBSCRIPTION PLAN DETAILS',
    columns: {
      title: 'SUBSCRIPTION PLANS',
      addButtonText: 'Add New Plan',
      headers: [
        { key: 'order', label: 'Order', formLabel: 'Display Order (1, 2, 3...)', type: 'number', placeholder: '1' },
        { key: 'name', label: 'Plan Name', formLabel: 'Plan Name *', placeholder: 'e.g. HIEIL Essential', minWidth: '160px' },
        { key: 'duration', label: 'Duration', formLabel: 'Duration *', placeholder: 'e.g. 3 months, 6 months, 12 months' },
        { key: 'price', label: 'Price', formLabel: 'Price *', placeholder: 'e.g. $1,499' },
        { key: 'originalPrice', label: 'Original Price', formLabel: 'Original Price (for Strikethrough/Offer)', placeholder: 'e.g. $1,799' },
        { key: 'perDayCost', label: 'Per Day Cost', formLabel: 'Per Day Cost (e.g. $16.65 / day or leave blank for auto)', placeholder: 'e.g. $16.65 / day' },
        { key: 'offerBadge', label: 'Offer Badge', formLabel: 'Offer Badge / Discount Tag', placeholder: 'e.g. Save $300 or 20% OFF' },
        { key: 'isPopular', label: 'Popular?', type: 'select', options: [{ value: true, label: 'Yes (Highlight Card)' }, { value: false, label: 'No' }], formLabel: 'Mark as Popular Plan?' },
        { key: 'popularTag', label: 'Popular Tag', formLabel: 'Popular Tag Text', placeholder: 'Most Popular' },
        { key: 'targetAudience', label: 'Target Audience', type: 'textarea', formLabel: 'Target Audience / For Whom', placeholder: 'e.g. For new importers, retailers...' },
        { key: 'extraHeader', label: 'Extra Header', formLabel: 'Extra Header Subtitle', placeholder: 'e.g. Everything in Essential, plus' },
        { key: 'features', label: 'Features (1 per line)', type: 'textarea', formLabel: 'Features List (Enter each feature on a new line)', placeholder: 'Feature 1\nFeature 2\nFeature 3' },
        { key: 'promise', label: 'Promise Quote', formLabel: 'Bottom Promise Quote', placeholder: 'e.g. Start sourcing without building a supplier network from scratch.' },
        { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'], formLabel: 'Status' }
      ]
    },
    data: []
  },
  {
    path: 'membership-enquiries',
    title: 'Subscription Enquiries',
    singularTitle: 'Subscription Enquiry',
    breadcrumbParent: 'Subscription',
    apiEndpoint: '/subscription-enquiries',
    formTitleAdd: 'Add Subscription Enquiry',
    formTitleEdit: 'Edit Subscription Enquiry',
    formCardTitle: 'SUBSCRIPTION ENQUIRY DETAILS',
    columns: {
      title: 'SUBSCRIPTION ENQUIRIES',
      addButtonText: 'Add Enquiry',
      headers: [
        { key: 'createdAt', label: 'Date', hideInForm: true, render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A' },
        { key: 'name', label: 'Client Name', formLabel: 'Client Name *', placeholder: 'Enter Client Name' },
        { key: 'email', label: 'Email', formLabel: 'Email *', placeholder: 'Enter Email' },
        { key: 'phone', label: 'Phone', formLabel: 'Phone / WhatsApp', placeholder: 'Enter Phone' },
        { key: 'companyName', label: 'Company', formLabel: 'Company / Brand Name', placeholder: 'Enter Company' },
        { 
          key: 'planName', 
          label: 'Plan', 
          formLabel: 'Plan Selected', 
          placeholder: 'e.g. HIEIL Business',
          render: (val, row) => {
            const planIdVal = row.planId ? (typeof row.planId === 'object' ? row.planId._id : row.planId) : null;
            const planNameVal = val || (row.planId && typeof row.planId === 'object' ? row.planId.name : '');
            const hasPlan = Boolean(planIdVal) || (Boolean(planNameVal) && planNameVal.trim() !== '' && planNameVal !== 'No Plan' && planNameVal !== 'General Consultation');

            if (!hasPlan) {
              return React.createElement('span', {
                style: {
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#dc2626',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca'
                }
              }, 'No Product');
            }

            return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } },
              React.createElement('div', { style: { fontWeight: '600', color: '#111827', fontSize: '13px' } }, planNameVal || 'Subscription Plan'),
              React.createElement('button', {
                type: 'button',
                style: {
                  padding: '3px 8px',
                  fontSize: '11px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#fdf4ec',
                  color: '#c8956c',
                  border: '1px solid #e8cdb5',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  width: 'fit-content'
                },
                onClick: () => window.open('/subscription#plans', '_blank')
              }, React.createElement(FaExternalLinkAlt, { style: { fontSize: '10px' } }), 'View Plan')
            );
          }
        },
        { key: 'duration', label: 'Duration', formLabel: 'Duration', placeholder: 'e.g. 6 months' },
        { key: 'price', label: 'Price', formLabel: 'Price', placeholder: 'e.g. $2,499' },
        { key: 'targetMarket', label: 'Market', formLabel: 'Target Market', placeholder: 'e.g. USA, Europe' },
        { key: 'expectedOrderSize', label: 'Order Size', formLabel: 'Expected Order Size' },
        { key: 'message', label: 'Requirements / Message', type: 'textarea', formLabel: 'Message / Sourcing Requirements' },
        { 
          key: 'status', 
          label: 'Status', 
          type: 'select', 
          options: ['Pending', 'Contacted', 'Active', 'Rejected', 'Expired'], 
          formLabel: 'Status',
          render: (val) => {
            const color = val === 'Active' ? '#22c55e' : (val === 'Contacted' ? '#3b82f6' : (val === 'Pending' ? '#eab308' : '#ef4444'));
            return React.createElement('span', { style: { backgroundColor: color, color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' } }, val || 'Pending');
          }
        },
        { key: 'startDate', label: 'Start Date', type: 'date', formLabel: 'Subscription Start Date' },
        { key: 'endDate', label: 'End Date', type: 'date', formLabel: 'Subscription Expiry Date' },
        { key: 'notes', label: 'Admin Notes', type: 'textarea', formLabel: 'Internal Notes / Note to Client' }
      ]
    },
    data: []
  }
];







