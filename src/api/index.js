const API_BASE_URL = import.meta.env.VITE_API_URL;
import { toast } from 'sonner';

// ── Core request function ──
// No tokens here. The browser only ever sends the opaque HttpOnly session
// cookie; the server refreshes tokens transparently inside its middleware.
const optionalAuthEndpoints = [
  '/api/cart',
  '/api/cart/wishlist',
  '/api/categories',
  '/api/products',
];

const api = async (endpoint, options = {}) => {
  const isOptionalAuth = optionalAuthEndpoints.some(e => endpoint.startsWith(e));

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  // ── Handle 401 — session is gone (refresh already failed server-side) ──
  if (response.status === 401 || response.status === 403) {
    if (isOptionalAuth) {
      return { success: false, data: [] };
    }

    if (!endpoint.startsWith('/api/auth/')) {
      toast.info("Session expired. Please login again.");
      window.location.href = '/login';
      throw { response: { status: 401, data: {} } };
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw { response: { status: response.status, data } };
  }

  return data;
};

// ── authFetch — reusable wrapper for direct fetch() callers ──
// Plain credential-cookie fetch. Returns the Response object.
export const authFetch = async (url, options = {}) => {
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  let response = await fetch(url, { ...options, headers, credentials: 'include' });

  if (response.status === 401 || response.status === 403) {
    toast.info('Session expired. Please login again.');
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  return response;
};

// ============ AUTH API ============

export const login = async (identifier, password) => {
  return api('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });
};

export const registerBuyer = async (userData) => {
  return api('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const registerSeller = async (userData) => {
  return api('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const resendVerification = async () => {
  return api('/api/auth/resend-verification', {
    method: 'POST',
  });
};

export const logout = async () => {
  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // Ignore network errors — clear local state regardless
  }
};

// ============ PRODUCTS API ============

export const getProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api(`/api/products${query ? '?' + query : ''}`);
};

export const getProduct = async (id) => api(`/api/products/${id}`);
export const getCategories = async () => api('/api/categories');

// ============ CART API ============

export const getCart = async () => api('/api/cart');
export const addToCart = async (productId, qty = 1) => api('/api/cart/add', { method: 'POST', body: JSON.stringify({ productId, qty }) });
export const removeFromCart = async (productId) => api(`/api/cart/remove/${productId}`, { method: 'DELETE' });
export const clearCart = async () => api('/api/cart/clear', { method: 'DELETE' });
export const getWishlist = async () => api('/api/cart/wishlist');
export const addToWishlist = async (productId) => api('/api/cart/wishlist/add', { method: 'POST', body: JSON.stringify({ productId }) });
export const removeFromWishlist = async (productId) => api(`/api/cart/wishlist/remove/${productId}`, { method: 'DELETE' });

// ============ ORDERS API ============

export const createOrder = async (items, shippingAddress) => api('/api/orders', { method: 'POST', body: JSON.stringify({ items, shippingAddress }) });
export const getMyOrders = async () => api('/api/orders');
export const markReceived = async (id) => api(`/api/orders/${id}/receive`, { method: 'PATCH' });
export const getOrder = async (id) => api(`/api/orders/${id}`);
export const initializePayment = async (orderIds) => api('/api/orders/initialize-payment', { method: 'POST', body: JSON.stringify({ orderIds }) });
export const cancelOrder = async (id) => api(`/api/orders/${id}/cancel`, { method: 'PATCH' });

// ============ DISPUTES API ============

export const createDispute = async (orderId, reason, description, evidenceUrls = []) =>
  api('/api/disputes', { method: 'POST', body: JSON.stringify({ orderId, reason, description, evidenceUrls }) });
export const getMyDisputes = async () => api('/api/disputes');

// ============ USER API ============

export const getProfile = async () => api('/api/users/profile');
export const updateProfile = async (data) => api('/api/users/profile', { method: 'PUT', body: JSON.stringify(data) });
export const getDeliveryAddresses = async () => api('/api/users/delivery-addresses');
export const addDeliveryAddress = async (address) => api('/api/users/delivery-addresses', { method: 'POST', body: JSON.stringify(address) });
export const deleteDeliveryAddress = async (id) => api(`/api/users/delivery-addresses/${id}`, { method: 'DELETE' });

// ============ SELLER API ============

export const getSellerDashboard = async () => api('/api/seller/dashboard');
export const getSellerOrders = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return api(`/api/seller/orders${query ? '?' + query : ''}`);
};
export const updateOrderStatus = async (id, status, trackingNumber, carrier, description) =>
  api(`/api/seller/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, trackingNumber, carrier, description }) });
export const getSellerWallet = async () => api('/api/seller/wallet');
export const getSellerBankAccounts = async () => api('/api/seller/bank-accounts');
export const addBankAccount = async (bankCode, accountNumber, accountName, isDefault) =>
  api('/api/seller/bank-accounts', { method: 'POST', body: JSON.stringify({ bankCode, accountNumber, accountName, isDefault }) });
export const deleteBankAccount = async (id) => api(`/api/seller/bank-accounts/${id}`, { method: 'DELETE' });
export const requestWithdrawal = async (amount, bankDetailId) =>
  api('/api/seller/withdraw', { method: 'POST', body: JSON.stringify({ amount, bankDetailId }) });
export const getWithdrawals = async () => api('/api/seller/withdrawals');
export const getSellerProducts = async () => api('/api/products/my-products');
export const createProduct = async (productData) => api('/api/products', { method: 'POST', body: JSON.stringify(productData) });
export const updateProduct = async (id, productData) => api(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(productData) });
export const deleteProduct = async (id) => api(`/api/products/${id}`, { method: 'DELETE' });
export const getSellerEscrow = async () => api('/api/seller/escrow');
export const getSellerEscrowSummary = async () => api('/api/seller/escrow/summary');

// ============ UPLOAD API ============

export const uploadImage = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
};

export default {
  login, registerBuyer, registerSeller, resendVerification, logout,
  getProducts, getProduct, getCategories,
  getCart, addToCart, removeFromCart, clearCart,
  getWishlist, addToWishlist, removeFromWishlist,
  createOrder, getMyOrders, getOrder,
  initializePayment, markReceived, cancelOrder,
  createDispute, getMyDisputes,
  getProfile, updateProfile,
  getDeliveryAddresses, addDeliveryAddress, deleteDeliveryAddress,
  getSellerDashboard, getSellerOrders, updateOrderStatus,
  getSellerWallet, getSellerBankAccounts, addBankAccount, deleteBankAccount,
  requestWithdrawal, getWithdrawals,
  getSellerProducts, createProduct, updateProduct, deleteProduct,
  getSellerEscrow, getSellerEscrowSummary, uploadImage,
};