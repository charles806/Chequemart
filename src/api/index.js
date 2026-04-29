const API_BASE_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem('token');

const api = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 - redirect to login
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  const data = await response.json();

  if (!response.ok) {
    throw { response: { status: response.status, data } };
  }

  return data;
};

// ============ AUTH API ============

export const login = async (identifier, password) => {
  const data = await api('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

export const registerBuyer = async (userData) => {
  const data = await api('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

export const registerSeller = async (userData) => {
  const data = await api('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
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
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return response.json();
};

export default { login, registerBuyer, registerSeller, logout, getCurrentUser, getProducts, getProduct, getCategories, getCart, addToCart, removeFromCart, clearCart, getWishlist, addToWishlist, removeFromWishlist, createOrder, getMyOrders, getOrder, initializePayment, markReceived, cancelOrder, createDispute, getMyDisputes, getProfile, updateProfile, getDeliveryAddresses, addDeliveryAddress, deleteDeliveryAddress, getSellerDashboard, getSellerOrders, updateOrderStatus, getSellerWallet, getSellerBankAccounts, addBankAccount, deleteBankAccount, requestWithdrawal, getWithdrawals, getSellerProducts, createProduct, updateProduct, deleteProduct, getSellerEscrow, getSellerEscrowSummary, uploadImage };