const FEATURES = {
  new_checkout: import.meta.env.VITE_FEATURE_NEW_CHECKOUT === 'true',
  seller_analytics_v2: import.meta.env.VITE_FEATURE_SELLER_ANALYTICS_V2 === 'true',
  pwa: import.meta.env.VITE_FEATURE_PWA === 'true',
};

export const isEnabled = (feature) => FEATURES[feature] ?? false;

export const getABTestVariant = (testName, userId) => {
  if (!userId) return "control";
  const hash = testName.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) + 
               userId.toString().split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return hash % 2 === 0 ? "control" : "variant";
};
