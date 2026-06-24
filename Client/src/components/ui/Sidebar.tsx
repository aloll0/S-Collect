import {
  LayoutDashboard,
  Package,
  Plus,
  Boxes,
  ShoppingCart,
  Settings,
  X,
  Globe,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import Logo from '../ui/Logo';
import LogoutButton from '../auth/LogoutButton';
import i18n from '../../i18n';


// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItemProps {
  icon: ReactNode;
  label: string;
  to: string;
  danger?: boolean;
  onClick?: () => void;
}

interface NavSectionProps {
  title: string;
  items: NavItemProps[];
  onItemClick?: () => void;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Nav Item ─────────────────────────────────────────────────────────────────
const NavItem = ({
  icon,
  label,
  to,
  danger = false,
  onClick,
}: NavItemProps) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ease-in-out relative overflow-hidden text-label-md
        ${
          isActive
            ? 'bg-gray-800 text-gray-50 font-medium'
            : danger
              ? 'text-red-500 hover:bg-red-500/10 hover:text-red-500'
              : 'text-gray-400 hover:bg-gray-800/40 hover:text-gray-100'
        }`
      }
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
      <span className="absolute left-0 top-0 h-full w-0 bg-gray-700/20 group-hover:w-full transition-all duration-300" />
    </NavLink>
  );
};

// ─── Nav Section ──────────────────────────────────────────────────────────────
const NavSection = ({ title, items, onItemClick }: NavSectionProps) => (
  <div className="px-3 mt-5">
    <p className="text-caption font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
      {title}
    </p>
    <div className="flex flex-col gap-0.5">
      {items.map((item) => (
        <NavItem key={item.to} {...item} onClick={onItemClick} />
      ))}
    </div>
  </div>
);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;

    i18n.changeLanguage(lang);

    localStorage.setItem('language', lang);

    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

// ─── Navigation Data ──────────────────────────────────────────────────────────
const NAV_SECTIONS: NavSectionProps[] = [
  {
    title: 'Main',
    items: [
      {
        icon: <LayoutDashboard size={18} />,
        label: 'Dashboard',
        to: '/',
      },
    ],
  },
  {
    title: 'Products',
    items: [
      {
        icon: <Package size={18} />,
        label: 'Management',
        to: '/management',
      },
      {
        icon: <Plus size={18} />,
        label: 'Add Product',
        to: '/add-product',
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        icon: <Boxes size={18} />,
        label: 'Inventory',
        to: '/inventory',
      },
      {
        icon: <ShoppingCart size={18} />,
        label: 'Incoming Orders',
        to: '/incoming-orders',
      },
    ],
  },
  {
    title: 'Account',
    items: [
      {
        icon: <Settings size={18} />,
        label: 'Settings',
        to: '/settings',
      },
    ],
  },
];

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`w-64 h-screen bg-[var(--gray-950)] flex flex-col fixed lg:sticky top-0 z-50 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="shrink-0 flex items-center justify-between pt-5 px-5 lg:justify-start">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-300 hover:bg-gray-800 lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-800">
          {NAV_SECTIONS.map((section) => (
            <NavSection
              key={section.title}
              {...section}
              onItemClick={onClose}
            />
          ))}
          <div className="px-3 mt-5">

          <div className="group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out relative overflow-hidden text-label-md ">
            <Globe className="text-white" size={18} />

            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className=" text-white cursor-pointer"
            >
              <option value="en" className='text-black'>EN</option> 
              <option value="ar" className='text-black'>AR</option>
            </select>
          </div>
          </div>
        </nav>


        <div className="shrink-0 p-3">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
