/**
 * FILE: src/components/layout/Topbar.jsx
 *
 * Sticky top bar shown across all dashboard pages.
 *
 * AUTH NOTE (backend dev):
 * ─────────────────────────────────────────────────────────────
 * Avatar and name currently read from SellerContext mock data.
 * Wire to real user data after auth is implemented.
 * Notification count: GET /api/seller/notifications/count
 * ─────────────────────────────────────────────────────────────
 *
 * PROPS:
 *   active  — current page key (used to derive display title)
 *   setOpen — fn(bool) to open the mobile sidebar drawer
 */

import Icon from "../ui/Icon";
import { ICONS } from "../ui/icons";
import { NAV_ITEMS } from "../../constants/navItems";
import { useSeller } from "../../context/SellerContext";

const Topbar = ({ active, setOpen }) => {
  const { seller, notifCount } = useSeller();

  const pageLabel = NAV_ITEMS.find((n) => n.key === active)?.label ?? "Dashboard";
  const initials = `${seller.firstName[0]}${seller.lastName[0]}`.toUpperCase();

  return (
    <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-md border-b border-black/5 px-4 md:px-6 py-3 flex items-center justify-between flex-shrink-0">

      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-black/5 transition cursor-pointer"
          aria-label="Open navigation"
        >
          <Icon d={ICONS.menu} size={20} className="text-gray-700" />
        </button>
        <h1 className="text-base md:text-lg font-bold text-gray-900">{pageLabel}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-3">

        {/* Notification bell */}
        {/* GET /api/seller/notifications/count — fetched on mount */}
        <button
          className="relative p-2 rounded-xl hover:bg-black/5 transition cursor-pointer"
          aria-label={`${notifCount} notifications`}
        >
          <Icon d={ICONS.bell} size={20} className="text-gray-600" />
          {notifCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-4 h-4 rounded-full bg-[#ff5252]
              text-black text-[9px] font-bold flex items-center justify-center px-0.5">
              {notifCount > 9 ? "9+" : notifCount}
            </span>
          )}
        </button>

        {/* Seller avatar — TODO (backend dev): replace with real user data */}
        <div className="flex items-center gap-2 pl-2 border-l border-black/10">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#ff5252] to-red-300 flex items-center justify-center  font-bold text-xs shrink-0">
            {initials}
          </div>
          <span className="hidden md:block text-sm font-medium text-gray-700 max-w-30 truncate">
            {seller.firstName} {seller.lastName}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
