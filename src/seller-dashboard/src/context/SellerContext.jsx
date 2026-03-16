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

import { createContext, useContext, useState } from "react";

const SellerContext = createContext(null);

export const SellerProvider = ({ children }) => {
  // ── Seller profile ─────────────────────────────────────────
  // Populated on mount via GET /api/seller/profile
  const [seller, setSeller] = useState({
    id:         "",
    firstName:  "John",
    lastName:   "Doe",
    storeName:  "John's Store",
    email:      "johndoe@example.com",
    phone:      "",
    avatar:     null,
    isVerified: true,
  });

  // ── Wallet ─────────────────────────────────────────────────
  // Populated on mount via GET /api/seller/wallet
  // Updated optimistically after withdrawals & escrow releases
  const [wallet, setWallet] = useState({
    availableBalance: 320500,
    escrowBalance:    122000,
    totalEarned:     1284000,
    totalWithdrawn:   963500,
  });

  // ── Notifications ──────────────────────────────────────────
  // Populated via GET /api/seller/notifications/count (or websocket)
  const [notifCount, setNotifCount] = useState(3);

  return (
    <SellerContext.Provider
      value={{ seller, setSeller, wallet, setWallet, notifCount, setNotifCount }}
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
