import type { ReactNode } from "react";
import React from "react";

interface CardProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, description, actions, children }) => (
  <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    {(title || description || actions) && (
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
        {actions}
      </header>
    )}
    <div>{children}</div>
  </section>
);
