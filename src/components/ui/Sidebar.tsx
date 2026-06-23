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

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-[#0f0f0f] text-white flex flex-col justify-between border-r border-white/10">
      {/* Top */}
      <div>
        {/* Logo */}
        <div className="p-5 text-xl font-bold">
          Select<span className="text-gray-500">S</span>
        </div>

        {/* Main */}
        <div className="px-3">
          <p className="text-xs text-gray-500 px-3 mb-2">MAIN</p>

          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active
          />
        </div>

        {/* Products */}
        <div className="px-3 mt-5">
          <p className="text-xs text-gray-500 px-3 mb-2">PRODUCTS</p>

          <NavItem icon={<Package size={18} />} label="Management" />
          <NavItem icon={<Plus size={18} />} label="Add Product" />
        </div>

        {/* Management */}
        <div className="px-3 mt-5">
          <p className="text-xs text-gray-500 px-3 mb-2">MANAGEMENT</p>

          <NavItem icon={<Boxes size={18} />} label="Inventory" />
          <NavItem icon={<ShoppingCart size={18} />} label="Incoming Orders" />
        </div>

        {/* Account */}
        <div className="px-3 mt-5">
          <p className="text-xs text-gray-500 px-3 mb-2">ACCOUNT</p>

          <NavItem icon={<Settings size={18} />} label="Settings" />
        </div>
      </div>

      {/* Bottom logout */}
      <div className="p-3">
        <NavItem icon={<LogOut size={18} />} label="Log Out" danger />
      </div>
    </div>
  );
};

export default Sidebar;

/* Reusable item */
const NavItem = ({ icon, label, active, danger }) => {
  return (
    <NavLink
      to={
        label === 'Dashboard'
          ? '/'
          : `/${label.toLowerCase().replace(/\s+/g, '-')}`
      }
      className={`
        flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
        transition
        ${
          active
            ? 'bg-white/10'
            : danger
              ? 'text-red-400 hover:bg-red-500/10'
              : 'hover:bg-white/5'
        }
      `}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </NavLink>
  );
};
