/**
 * FILE: src/components/layout/Sidebar.jsx
 *
 * Sidebar navigation for the seller dashboard.
 * Uses React Router for navigation.
 */

import { NavLink } from "react-router-dom";
import Icon from "../ui/Icon";
import { ICONS } from "../ui/icons";
import { NAV_ITEMS } from "../../constants/navItems";

const Sidebar = ({ open, setOpen }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-surface border-r border-black/5
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-black/5">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#ff5252] to-red-300 flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-lg font-bold text-gray-900">Seller Hub</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.key}
                to={`/seller/${item.key}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#ff5252]/10 text-[#ff5252]"
                      : "text-gray-600 hover:bg-black/5 hover:text-gray-900"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                <Icon d={item.icon} size={18} />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-black/5 space-y-3">
            <NavLink
              to="/"
              className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 transition"
            >
              <Icon d={ICONS.chevronR} size={12} className="rotate-180" />
              Back to Shop
            </NavLink>
            <div className="text-xs text-gray-400">
              v1.0.0 • Chequemart Seller
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;