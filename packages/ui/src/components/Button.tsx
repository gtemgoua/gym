import type { ButtonHTMLAttributes, ReactNode } from "react";
import React from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  loading,
  disabled,
  ...rest
}) => {
  const base =
    "inline-flex items-center justify-center rounded-md border font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500";

  const variants: Record<typeof variant, string> = {
    primary: "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 disabled:bg-blue-300",
    secondary: "bg-white text-gray-900 border-gray-200 hover:bg-gray-50 disabled:bg-gray-100",
    ghost: "bg-transparent border-transparent text-gray-700 hover:bg-gray-100",
  };

  return (
    <button className={`${base} ${variants[variant]} px-4 py-2`} disabled={disabled || loading} {...rest}>
      {loading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border border-white border-r-transparent" />}
      {children}
    </button>
  );
};
