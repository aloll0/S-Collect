import {
  LayoutDashboard,
  Package,
  Plus,
  Boxes,
  ShoppingCart,
  Settings,
  LogOut,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import Logo from "../ui/Logo";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItemProps {
  icon: ReactNode;
  label: string;
  to: string;
  danger?: boolean;
}

interface NavSectionProps {
  title: string;
  items: NavItemProps[];
}

// ─── Nav Item ─────────────────────────────────────────────────────────────────
const NavItem = ({ icon, label, to, danger = false }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-label-md ${
          isActive
            ? 'bg-gray-800 text-gray-50 font-medium'
            : danger
              ? 'text-red hover:bg-red-light/10 hover:text-red'
              : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
        }`
      }
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </NavLink>
  );
};

// ─── Nav Section ──────────────────────────────────────────────────────────────
const NavSection = ({ title, items }: NavSectionProps) => (
  <div className="px-3 mt-5">
    <p className="text-caption font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
      {title}
    </p>
    <div className="flex flex-col gap-0.5">
      {items.map((item) => (
        <NavItem key={item.to} {...item} />
      ))}
    </div>
  </div>
);

// ─── Navigation Data ──────────────────────────────────────────────────────────
const NAV_SECTIONS: NavSectionProps[] = [
  {
    title: "Main",
    items: [
      {
        icon: <LayoutDashboard size={18} />,
        label: "Dashboard",
        to: "/",
      },
    ],
  },
  {
    title: "Products",
    items: [
      {
        icon: <Package size={18} />,
        label: "Management",
        to: "/products-management",
      },
      {
        icon: <Plus size={18} />,
        label: "Add Product",
        to: "/add-product",
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        icon: <Boxes size={18} />,
        label: "Inventory",
        to: "/inventory",
      },
      {
        icon: <ShoppingCart size={18} />,
        label: "Incoming Orders",
        to: "/incoming-orders",
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        icon: <Settings size={18} />,
        label: "Settings",
        to: "/settings",
      },
    ],
  },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = () => {
  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col bg-gray-950 border-r border-gray-800">
      {/* Logo */}
      <div className="shrink-0 p-5 border-b border-gray-800">
        <Logo />
      </div>

      {/* Scrollable Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent hover:scrollbar-thumb-gray-700">
        {NAV_SECTIONS.map((section) => (
          <NavSection key={section.title} {...section} />
        ))}
      </nav>

      {/* Logout - Fixed at bottom */}
      <div className="shrink-0 p-3 border-t border-gray-800">
        <NavItem
          icon={<LogOut size={18} />}
          label="Log Out"
          to="/logout"
          danger
        />
      </div>
    </aside>
  );
};

export default Sidebar;