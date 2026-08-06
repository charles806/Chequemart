import { useState, useMemo, useCallback, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { setAccessToken, clearAccessToken, getAccessToken, authFetch } from "./api";
import { Context } from "./Context";

export const MyContext = Context;

const MyContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [accessToken, setAccessTokenState] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [openCartPanel, setOpenCartPanel] = useState(false);
  const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  // On mount, silently refresh the token using the HttpOnly refresh cookie
  useEffect(() => {
    const initAuth = async () => {
      const savedUser = Cookies.get("user");
      if (!savedUser) {
        setAuthReady(true);
        return;
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh-token`, {
          method: "POST",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.accessToken);
          setAccessTokenState(data.accessToken);
          if (data.user) {
            setUser(data.user);
            setIsLogin(true);
            Cookies.set("user", JSON.stringify(data.user), { expires: 7, path: "/" });
          }
        }
      } catch {
        // Not authenticated — user stays logged out
      } finally {
        setAuthReady(true);
      }
    };
    initAuth();
  }, []);

  // Fetch cart from database on login or token change
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchCart = async () => {
      if (!accessToken) {
        setCart([]);
        return;
      }
      try {
        const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
          signal: controller.signal
        });
        const data = await res.json();
        if (data.success) {
          const items = data.data.items.map(item => ({
            id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.images?.[0],
            brand: item.product.seller?.storeName || item.product.brand,
            qty: item.qty,
          }));
          setCart(items);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Failed to fetch cart:", error);
        }
      }
    };

    if (authReady) fetchCart();
    
    return () => controller.abort();
  }, [accessToken, authReady]);

  // Fetch wishlist on login or token change
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchWishlistData = async () => {
      if (!accessToken) {
        setWishlist([]);
        return;
      }
      try {
        const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/cart/wishlist`, {
          signal: controller.signal
        });
        const data = await res.json();
        if (data.success) {
          const items = data.data.map(item => ({
            id: item._id,
            name: item.name,
            price: item.price,
            oldPrice: item.price * 1.2,
            image: item.images?.[0],
            brand: item.seller?.storeName || item.brand,
          }));
          setWishlist(items);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Failed to fetch wishlist:", error);
        }
      }
    };

    if (authReady) fetchWishlistData();
    
    return () => controller.abort();
  }, [accessToken, authReady]);

  const login = useCallback((userData, token) => {
    setUser(userData);
    setAccessToken(token);
    setAccessTokenState(token);
    setIsLogin(true);
    Cookies.set("user", JSON.stringify(userData), { expires: 7, path: "/" });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setAccessTokenState(null);
    setIsLogin(false);
    setCart([]);
    clearAccessToken();
    Cookies.remove("user", { path: "/" });
  }, []);

  const addToCart = useCallback(async (product) => {
    const token = accessToken || getAccessToken();
    if (!token) {
      toast.error("Please login to add to cart");
      return;
    }
    // Optimistic update using functional state update (no stale closure)
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    try {
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/cart/add`, {
        method: "POST",
        body: JSON.stringify({ productId: product.id, qty: 1 }),
      });
      const data = await res.json();
      if (data.success) {
        const items = data.data.items.map(item => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.images?.[0],
          brand: item.product.seller?.storeName || item.product.brand,
          qty: item.qty,
        }));
        setCart(items);
        toast.success("Added to cart");
        setOpenCartPanel(true);
      } else {
        // Rollback on failure - refetch from server
        fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include'
        }).then(r => r.json()).then(data => {
          if (data.success) {
            setCart(data.data.items.map(item => ({
              id: item.product._id,
              name: item.product.name,
              price: item.product.price,
              image: item.product.images?.[0],
              brand: item.product.seller?.storeName || item.product.brand,
              qty: item.qty,
            })));
          }
        });
        toast.error(data.message || "Failed to add to cart");
      }
    } catch (error) {
      // Rollback on error - refetch from server
      fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include'
      }).then(r => r.json()).then(data => {
        if (data.success) {
          setCart(data.data.items.map(item => ({
            id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.images?.[0],
            brand: item.product.seller?.storeName || item.product.brand,
            qty: item.qty,
          })));
        }
      });
      toast.error("Failed to add to cart");
      console.log(error)
    }
  }, [accessToken]);

  const removeFromCart = useCallback(async (id) => {
    const token = accessToken || getAccessToken();
    if (!token) return;
    try {
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/cart/remove/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        const items = data.data.items.map(item => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.images?.[0],
          brand: item.product.seller?.storeName || item.product.brand,
          qty: item.qty,
        }));
        setCart(items);
      }
    } catch {
      toast.error("Failed to remove from cart");
    }
  }, [accessToken]);

  const updateCartQty = useCallback(async (id, qty) => {
    const token = accessToken || getAccessToken();
    if (!token) return;
    try {
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/cart/update`, {
        method: "PUT",
        body: JSON.stringify({ productId: id, qty }),
      });
      const data = await res.json();
      if (data.success) {
        const items = data.data.items.map(item => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.images?.[0],
          brand: item.product.seller?.storeName || item.product.brand,
          qty: item.qty,
        }));
        setCart(items);
      }
    } catch {
      toast.error("Failed to update quantity");
    }
  }, [accessToken]);

  const emptyCart = useCallback(async () => {
    const token = accessToken || getAccessToken();
    if (!token) return;
    try {
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/cart/clear`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setCart([]);
      }
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  }, [accessToken]);

  const fetchWishlist = useCallback(async () => {
    const token = accessToken || getAccessToken();
    if (!token) return;
    try {
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/cart/wishlist`);
      const data = await res.json();
      if (data.success) {
        const items = data.data.map(item => ({
          id: item._id,
          name: item.name,
          price: item.price,
          oldPrice: item.price * 1.2,
          image: item.images?.[0],
          brand: item.seller?.storeName || item.brand,
        }));
        setWishlist(items);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  }, [accessToken]);

  const addToWishlist = useCallback(async (productId) => {
    const token = accessToken || getAccessToken();
    if (!token) return;
    try {
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/cart/wishlist/add`, {
        method: "POST",
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Added to wishlist");
        fetchWishlist();
      } else if (data.message === "Product already in wishlist") {
        toast.info("Already in wishlist");
      }
    } catch {
      toast.error("Failed to add to wishlist");
    }
  }, [accessToken, fetchWishlist]);

  const removeFromWishlist = useCallback(async (productId) => {
    const token = accessToken || getAccessToken();
    if (!token) return;
    try {
      const res = await authFetch(`${import.meta.env.VITE_API_URL}/api/cart/wishlist/remove/${productId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Removed from wishlist");
        setWishlist(prev => prev.filter(item => item.id !== productId));
      }
    } catch {
      toast.error("Failed to remove from wishlist");
    }
  }, [accessToken]);

  const openAlertBox = useCallback((type, message) => {
    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    else toast(message);
  }, []);

  const value = useMemo(() => ({
    user,
    accessToken,
    isLogin,
    cart,
    wishlist,
    openCartPanel,
    setOpenCartPanel,
    isOpenCatPanel,
    setIsOpenCatPanel,
    login,
    logout,
    addToCart,
    removeFromCart,
    updateCartQty,
    emptyCart,
    addToWishlist,
    removeFromWishlist,
    fetchWishlist,
    openAlertBox,
    authReady,
  }), [user, accessToken, isLogin, cart, wishlist, openCartPanel, isOpenCatPanel, login, logout, addToCart, removeFromCart, updateCartQty, emptyCart, addToWishlist, removeFromWishlist, fetchWishlist, openAlertBox, authReady]);

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

export default MyContextProvider;
