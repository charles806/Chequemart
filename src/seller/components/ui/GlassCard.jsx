/**
 * FILE: src/components/ui/GlassCard.jsx
 *
 * Glassmorphism card wrapper used across Dashboard,
 * Wallet and Escrow pages.
 *
 * USAGE:
 *   import GlassCard from "../components/ui/GlassCard";
 *   <GlassCard className="p-4">...</GlassCard>
 */

const GlassCard = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`
      rounded-2xl border border-white/20
      bg-white/10 backdrop-blur-md shadow-lg
      ${onClick ? "cursor-pointer" : ""}
      ${className}
    `}
  >
    {children}
  </div>
);

export default GlassCard;
