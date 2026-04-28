/**
 * FILE: src/context/SellerContext.jsx
 *
 * Global state provider for the seller dashboard.
 * Eliminates prop drilling across pages.
 *
 * Provides:
 *   seller     — profile data (name, store, avatar, verified status)
 *   setSeller  — update seller profile (e.g. after Storefront save)
 *   wallet     — live balance figures (shared by Wallet page + Topbar)
 *   setWallet  — update after withdrawal or escrow release
 *   notifCount — unread notification count shown on Topbar bell
 *   setNotifCount
 *
 * USAGE:
 *   import { useSeller } from "../context/SellerContext";
 *   const { seller, wallet, setWallet } = useSeller();
 *
 * On app mount, fetch GET /api/seller/profile and GET /api/seller/wallet
 * then call setSeller() and setWallet() with real data.
 */

import { useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { SellerContext } from "../constants/sellerContext";

export const SellerProvider = ({ children }) => {
  const [seller, setSeller] = useState({
    id: "",
    firstName: "",
    lastName: "",
    storeName: "",
    email: "",
    phone: "",
    avatar: null,
    isVerified: false,
  });

  const [wallet, setWallet] = useState({
    availableBalance: 0,
    escrowBalance: 0,
    totalEarned: 0,
    totalWithdrawn: 0,
  });

  const [notifCount, setNotifCount] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const refreshSellerData = async () => {
    setStatus("loading");
    try {
      const token = Cookies.get("accessToken");
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };
      const [profileRes, walletRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/api/seller/wallet`, { headers }),
      ]);

      const profileData = await profileRes.json();
      const walletData = await walletRes.json();

      if (profileData.success) {
        const user = profileData.user;
        const [fName = "", ...rest] = (user.name || "").split(" ");
        setSeller({
          id: user._id,
          firstName: fName,
          lastName: rest.join(" "),
          storeName: user.sellerInfo?.storeName || "My Store",
          email: user.email,
          phone: user.phone || "",
          avatar: user.avatar,
          isVerified: user.role === "seller",
        });
      }

      if (walletData.success) {
        setWallet({
          availableBalance: Number(walletData.wallet.available_balance),
          escrowBalance: Number(walletData.wallet.pending_balance), // Assuming pending is escrow
          totalEarned: Number(walletData.wallet.total_earned),
          totalWithdrawn: 0, // In a real app, sum successful withdrawals
        });
      }
      setStatus("success");
    } catch (error) {
      console.error("SellerProvider data fetch failed:", error);
      setStatus("error");
    }
  };

  useEffect(() => {
    refreshSellerData();
  }, []);

  return (
    <SellerContext.Provider
      value={{
        seller,
        setSeller,
        wallet,
        setWallet,
        notifCount,
        setNotifCount,
        refreshSellerData,
        status
      }}
    >
      {children}
    </SellerContext.Provider>
  );
};

/** Hook — throws if used outside SellerProvider */
export const useSeller = () => {
  const ctx = useContext(SellerContext);
  if (!ctx) throw new Error("useSeller must be used inside <SellerProvider>");
  return ctx;
};
