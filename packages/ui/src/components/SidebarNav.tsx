import React from "react";
import type { AppNavRoute } from "@gym/config";
import { NavLink } from "react-router-dom";

interface SidebarNavProps {
  routes: readonly AppNavRoute[];
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ routes }) => (
  <nav className="flex h-full flex-col border-r border-gray-200 bg-white">
    <div className="px-4 py-6">
      <span className="text-xl font-bold text-blue-600">PulseFit</span>
    </div>
    <ul className="flex-1 space-y-1 px-2">
      {routes.map((route) => (
        <li key={route.path}>
          <NavLink
            to={route.path}
            className={({ isActive }) =>
              [
                "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              ].join(" ")
            }
          >
            <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-xs uppercase">
              {route.label.slice(0, 2)}
            </span>
            {route.label}
          </NavLink>
        </li>
      ))}
    </ul>
    <footer className="px-4 py-6 text-xs text-gray-400">
      &copy; {new Date().getFullYear()} Gym Studio SaaS
    </footer>
  </nav>
);
