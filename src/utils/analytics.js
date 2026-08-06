export const trackEvent = (name, properties = {}) => {
  if (import.meta.env.DEV) {
    console.log('[Analytics]', name, properties);
  }

  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', name, properties);
    }
  } catch {
    // Analytics should never break the app
  }
};

export const trackPageView = (pageName, referrer) => {
  trackEvent('page_view', { page_name: pageName, referrer: referrer || document.referrer });
};

export const trackProductView = (productId, category) => {
  trackEvent('product_view', { product_id: productId, category });
  performance.mark(`product_view_${productId}`);
};

export const trackAddToCart = (productId, quantity, price) => {
  trackEvent('add_to_cart', { product_id: productId, quantity, price });
};

export const trackCheckoutStart = (cartTotal, itemCount) => {
  trackEvent('checkout_start', { cart_total: cartTotal, item_count: itemCount });
  performance.mark('checkout_start');
};

export const trackOrderComplete = (orderId, total, items) => {
  trackEvent('order_complete', { order_id: orderId, total, item_count: items?.length });
  performance.mark('order_complete');
  performance.measure('checkout_flow', 'checkout_start', 'order_complete');
};

export const trackSearch = (query, resultsCount) => {
  trackEvent('search', { query, results_count: resultsCount });
};

export const trackLogin = (method) => {
  trackEvent('login', { method });
};
