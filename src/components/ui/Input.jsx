import React from "react";

export default function Input({
  label,
  error,
  success,
  helperText,
  required,
  className = "",
  containerClassName = "",
  ...props
}) {
  return (
    <div className={`flex flex-col ${containerClassName}`}>
      {label && (
        <label className="text-sm font-medium text-neutral-700 mb-1.5">
          {label}
          {required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2.5 text-sm rounded-lg border transition-all duration-150
          bg-white text-neutral-800 placeholder-neutral-400
          focus:outline-none
          ${error
            ? "border-error focus:border-error focus:ring-2 focus:ring-error/15"
            : success
              ? "border-success focus:border-success focus:ring-2 focus:ring-success/15"
              : "border-neutral-200 hover:border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15"
          }
          disabled:bg-neutral-100 disabled:text-neutral-400 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
      {(error || helperText) && (
        <p className={`text-xs mt-1.5 ${error ? "text-error" : "text-neutral-400"}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}
