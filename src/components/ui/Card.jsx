import React from "react";

export default function Card({ children, className = "", hover = false, ...props }) {
  return (
    <div
      className={`
        bg-white rounded-xl border border-neutral-200 overflow-hidden
        ${hover ? "transition-shadow duration-200 hover:shadow-md cursor-pointer" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardImage({ src, alt, className = "" }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return (
    <div className={`p-4 space-y-2 ${className}`}>
      {children}
    </div>
  );
}
