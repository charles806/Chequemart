/**
 * FILE: src/components/ui/Icon.jsx
 *
 * Lightweight inline SVG icon wrapper.
 * Accepts a raw path string, an array of path strings,
 * or a key from the ICONS registry.
 *
 * USAGE:
 *   import Icon from "../components/ui/Icon";
 *   import { ICONS } from "../components/ui/icons";
 *
 *   <Icon d={ICONS.wallet} size={20} className="text-primary" />
 */

const Icon = ({ d, size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {Array.isArray(d)
      ? d.map((p, i) => <path key={i} d={p} />)
      : <path d={d} />}
  </svg>
);

export default Icon;
