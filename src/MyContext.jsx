import { createContext, useState, useMemo, useCallback, useEffect } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";

export const MyContext = createContext();

const MyContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [accessToken, setAccessToken] = useState(() => Cookies.get("accessToken"));
  const [isLogin, setIsLogin] = useState(() => Cookies.get("isLogin") === "true");
  const [cart, setCart] = useState([]);
  const [openCartPanel, setOpenCartPanel] = useState(false);

  // Fetch cart from database on load or login
  useEffect(() => {
    const fetchCart = async () => {
      if (!accessToken) {
        setCart([]);
        return;
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include"
        });
        const data = await res.json();
        if (data.success) {
          // Normalize backend items to match frontend structure
          const items = data.data.items.map(item => ({
            id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.images?.[0],
            brand: item.product.seller?.storeName || item.product.brand,
            qty: item.qty
          }));
          setCart(items);
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };

    fetchCart();
  }, [accessToken]);

  const login = useCallback((userData, token) => {
    setUser(userData);
    setAccessToken(token);
    setIsLogin(true);
    // Persist session in Cookies (Never localStorage as per rule)
    Cookies.set("user", JSON.stringify(userData), { expires: 7, path: "/" });
    Cookies.set("accessToken", token, { expires: 7, path: "/" });
    Cookies.set("isLogin", "true", { expires: 7, path: "/" });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setIsLogin(false);
    setCart([]);
    Cookies.remove("user", { path: "/" });
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("isLogin", { path: "/" });
  }, []);

  const addToCart = useCallback(async (product) => {
    if (!accessToken) {
      toast.error("Please login to add to cart");
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ productId: product.id, qty: 1 }),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh cart from database response
        const items = data.data.items.map(item => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.images?.[0],
          brand: item.product.seller?.storeName || item.product.brand,
          qty: item.qty
        }));
        setCart(items);
        toast.success("Added to cart");
        setOpenCartPanel(true);
      }
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  }, [accessToken]);

  const removeFromCart = useCallback(async (id) => {
    if (!accessToken) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/remove/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        const items = data.data.items.map(item => ({
          id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.images?.[0],
          brand: item.product.seller?.storeName || item.product.brand,
          qty: item.qty
        }));
        setCart(items);
      }
    } catch (error) {
      toast.error("Failed to remove from cart");
    }
  }, [accessToken]);

  const updateCartQty = useCallback(async (id, qty) => {
    if (!accessToken) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
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
          qty: item.qty
        }));
        setCart(items);
      }
    } catch (error) {
      toast.error("Failed to update quantity");
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
    openCartPanel,
    setOpenCartPanel,
    login,
    logout,
    addToCart,
    removeFromCart,
    updateCartQty,
    openAlertBox,
  }), [user, accessToken, isLogin, cart, openCartPanel, login, logout, addToCart, removeFromCart, updateCartQty, openAlertBox]);

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};

export default MyContextProvider;