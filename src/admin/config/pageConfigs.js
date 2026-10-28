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
            const list = Array.isArray(val) ? val : [];
            if (list.length === 0) return React.createElement('span', { style: { color: '#94a3b8', fontStyle: 'italic', fontSize: '12px' } }, 'None selected');
            
            const badgeStyles = {
              'blue-pottery': { bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },
              'clocks': { bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
              'metal': { bg: '#f1f5f9', color: '#334155', border: '#cbd5e1' },
              'stone': { bg: '#f5f5f4', color: '#44403c', border: '#d6d3d1' },
              'wood': { bg: '#ffedd5', color: '#c2410c', border: '#fed7aa' }
            };

            const fileMap = {
              'blue-pottery': 'HIEIL_Blue_Pottery_Catalogue.pdf',
              'clocks': 'HIEIL_Handcrafted_Clock_Catalogue.pdf',
              'metal': 'HIEIL_Handcrafted_Metal_Catalogue.pdf',
              'stone': 'HIEIL_Handcrafted_Stone_Catalogue.pdf',
              'wood': 'HIEIL_Handcrafted_Wood_Catalogue.pdf'
            };

            return React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px', maxWidth: '340px' } },
              list.map((c, i) => {
                const s = badgeStyles[c.id] || { bg: '#f3f4f6', color: '#374151', border: '#e5e7eb' };
                const fileName = c.file || fileMap[c.id] || (c.title && c.title.toLowerCase().includes('stone') ? 'HIEIL_Handcrafted_Stone_Catalogue.pdf' : (c.title && c.title.toLowerCase().includes('wood') ? 'HIEIL_Handcrafted_Wood_Catalogue.pdf' : (c.title && c.title.toLowerCase().includes('metal') ? 'HIEIL_Handcrafted_Metal_Catalogue.pdf' : (c.title && c.title.toLowerCase().includes('clock') ? 'HIEIL_Handcrafted_Clock_Catalogue.pdf' : 'HIEIL_Blue_Pottery_Catalogue.pdf'))));
                const targetUrl = fileName.startsWith('http') ? fileName : ('/' + fileName);

                return React.createElement('a', {
                  key: i,
                  href: targetUrl,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  title: 'Click to open ' + (c.badge || c.title) + ' PDF in new tab',
                  style: {
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    borderRadius: '5px',
                    fontSize: '11px',
                    fontWeight: '600',
                    backgroundColor: s.bg,
                    color: s.color,
                    border: '1px solid ' + s.border,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
                  },
                  onMouseEnter: (e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 3px 6px rgba(0,0,0,0.12)';
                  },
                  onMouseLeave: (e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.06)';
                  }
                }, 
                  React.createElement(FaFilePdf, { style: { fontSize: '11px' } }), 
                  c.badge || c.title,
                  React.createElement(FaExternalLinkAlt, { style: { fontSize: '9px', opacity: 0.65, marginLeft: '2px' } })
                );
              })
            );
          }
        },
        {
          key: 'status',
          label: 'Status',
          type: 'select',
          options: ['Pending', 'Approved', 'Rejected'],
          formLabel: 'Status',
          render: (val, row, { onUpdateRow }) => {
            const isApproved = val === 'Approved';
            const isPending = val === 'Pending';
            const bg = isApproved ? '#dcfce7' : (isPending ? '#fef3c7' : '#fee2e2');
            const color = isApproved ? '#15803d' : (isPending ? '#b45309' : '#b91c1c');
            const border = isApproved ? '#bbf7d0' : (isPending ? '#fde68a' : '#fecaca');

            return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
              React.createElement('span', {
                style: {
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  backgroundColor: bg,
                  color: color,
                  border: `1px solid ${border}`
                }
              }, val || 'Pending'),
              isPending && onUpdateRow && React.createElement('button', {
                type: 'button',
                title: 'Click to Approve & Grant Access',
                style: {
                  padding: '3px 8px',
                  fontSize: '11px',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                },
                onClick: () => onUpdateRow(row.id || row._id, 'status', 'Approved')
              }, React.createElement(FaCheck, { style: { fontSize: '10px' } }), 'Approve')
            );
          }
        },
        { key: 'adminNotes', label: 'Admin Notes', type: 'textarea', formLabel: 'Internal Notes / Remarks' }
      ],
      actions: (row, { onUpdateRow, onDelete }) => {
        const rowId = row.id || row._id;
        const isApproved = row.status === 'Approved';
        
        return React.createElement('div', { style: { display: 'flex', gap: '6px', justifyContent: 'center' } },
          !isApproved ? (
            React.createElement('button', {
              className: 'modern-action-btn btn-success',
              title: 'Approve Catalogue Access',
              style: { backgroundColor: '#16a34a', color: '#fff', padding: '6px 10px', borderRadius: '4px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' },
              onClick: () => onUpdateRow && onUpdateRow(rowId, 'status', 'Approved')
            }, React.createElement(FaCheck, null), ' Approve')
          ) : (
            React.createElement('button', {
              className: 'modern-action-btn btn-secondary',
              title: 'Revoke / Set Pending',
              style: { backgroundColor: '#f59e0b', color: '#fff', padding: '6px 8px', borderRadius: '4px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' },
              onClick: () => onUpdateRow && onUpdateRow(rowId, 'status', 'Pending')
            }, 'Revoke')
          ),
          row.status !== 'Rejected' && (
            React.createElement('button', {
              className: 'modern-action-btn btn-danger',
              title: 'Reject Request',
              style: { backgroundColor: '#ef4444', color: '#fff', padding: '6px 8px', borderRadius: '4px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '11px' },
              onClick: () => onUpdateRow && onUpdateRow(rowId, 'status', 'Rejected')
            }, React.createElement(FaTimes, null))
          ),
          onDelete && (
            React.createElement('button', {
              className: 'modern-action-btn btn-danger',
              title: 'Delete Request',
              style: { backgroundColor: '#64748b', color: '#fff', padding: '6px 8px', borderRadius: '4px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '11px' },
              onClick: () => onDelete(row)
            }, React.createElement(FaTrash, null))
          )
        );
      }
    },
    data: []
  },
];







