import {
  Boxes,
  PackageOpen,
  Settings,
  X,
  Globe,
  ChartNoAxesCombined,
  CirclePlus,
  Handbag,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import type { ReactNode } from 'react';
import Logo from '../ui/Logo';
import LogoutButton from '../auth/LogoutButton';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Variants } from 'motion/react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavItemProps {
  icon: ReactNode;
  labelKey: string;
  to: string;
  danger?: boolean;
  onClick?: () => void;
}

interface NavSectionProps {
  titleKey: string;
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
  labelKey,
  to,
  danger = false,
  onClick,
}: NavItemProps) => {
  const { t } = useTranslation();

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
      <span className="truncate">{t(labelKey)}</span>
      <span className="absolute left-0 top-0 h-full w-0 bg-gray-700/20 group-hover:w-full transition-all duration-300" />
    </NavLink>
  );
};

// ─── Nav Section ──────────────────────────────────────────────────────────────
const NavSection = ({ titleKey, items, onItemClick }: NavSectionProps) => {
  const { t } = useTranslation();

  return (
    <div className="px-3 mt-5">
      <p className="text-caption font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
        {t(titleKey)}
      </p>
      <div className="flex flex-col gap-0.5">
        {items.map((item) => (
          <NavItem key={item.to} {...item} onClick={onItemClick} />
        ))}
      </div>
    </div>
  );
};

// ─── Navigation Data ──────────────────────────────────────────────────────────
const NAV_SECTIONS: NavSectionProps[] = [
  {
    titleKey: 'sidebar.sections.main',
    items: [
      {
        icon: <ChartNoAxesCombined size={18} />,
        labelKey: 'sidebar.items.dashboard',
        to: '/',
      },
    ],
  },
  {
    titleKey: 'sidebar.sections.products',
    items: [
      {
        icon: <PackageOpen size={18} />,
        labelKey: 'sidebar.items.management',
        to: '/management',
      },
      {
        icon: <CirclePlus size={18} />,
        labelKey: 'sidebar.items.addProduct',
        to: '/add-product',
      },
    ],
  },
  {
    titleKey: 'sidebar.sections.management',
    items: [
      {
        icon: <Boxes size={18} />,
        labelKey: 'sidebar.items.inventory',
        to: '/inventory',
      },
      {
        icon: <Handbag size={18} />,
        labelKey: 'sidebar.items.incomingOrders',
        to: '/incoming-orders',
      },
    ],
  },
  {
    titleKey: 'sidebar.sections.account',
    items: [
      {
        icon: <Settings size={18} />,
        labelKey: 'sidebar.items.settings',
        to: '/settings',
      },
    ],
  },
];

// ─── Animation Variants (circle reveal, à la motion examples) ────────────────
// نقطة الانطلاق: أعلى يمين أو يسار حسب اللغة (مكان زرار الفتح في الـ topbar)
const getSidebarVariants = (isArabic: boolean): Variants => ({
  open: {
    clipPath: `circle(150% at ${isArabic ? '100%' : '0%'} 0%)`,
    transition: {
      type: 'spring',
      stiffness: 50,
      damping: 18,
    },
  },
  closed: {
    clipPath: `circle(0% at ${isArabic ? '100%' : '0%'} 0%)`,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 40,
    },
  },
});

const navListVariants: Variants = {
  open: {
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
  closed: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const navItemVariants: Variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: { y: { stiffness: 1000, velocity: -100 } },
  },
  closed: {
    y: 20,
    opacity: 0,
    transition: { y: { stiffness: 1000 } },
  },
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;

    i18n.changeLanguage(lang);

    localStorage.setItem('language', lang);

    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const sidebarVariants = getSidebarVariants(isArabic);

  // محتوى السايدبار (متكرر بين نسخة الموبايل المتحركة ونسخة الديسكتوب الثابتة)
  const SidebarContent = (
    <>
      <div className="shrink-0 flex items-center justify-between pt-5 px-5 sidebar:justify-start">
        <Logo />
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-300 hover:bg-gray-800 sidebar:hidden cursor-pointer"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-800">
        {NAV_SECTIONS.map((section) => (
          <NavSection key={section.titleKey} {...section} onItemClick={onClose} />
        ))}

        <div className="px-3 mt-5 sidebar:hidden">
          <div className="group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out relative overflow-hidden text-label-md text-gray-400">
            <Globe className="text-gray-400" size={18} />

            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className="bg-transparent text-gray-100 cursor-pointer outline-none"
            >
              <option value="en" className="text-black">
                EN
              </option>
              <option value="ar" className="text-black">
                AR
              </option>
            </select>
          </div>
        </div>
      </nav>

      <div className="shrink-0 p-3">
        <LogoutButton />
      </div>
    </>
  );

  return (
    <>
      {/* ── نسخة الديسكتوب: ثابتة زي ما هي، من غير أنيميشن ── */}
      <aside
        className={`hidden sidebar:flex w-64 h-dvh bg-(--gray-950) flex-col sticky top-0 z-70 ${
          isArabic ? 'right-0' : 'left-0'
        }`}
      >
        {SidebarContent}
      </aside>

      {/* ── نسخة الموبايل: بالأنيميشن (circle reveal) ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="sidebar-overlay"
              className="fixed inset-0 bg-black/70 z-60 sidebar:hidden overscroll-none"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            <motion.aside
              key="sidebar-mobile"
              className={`w-64 h-dvh bg-(--gray-950) flex flex-col fixed top-0 z-70 sidebar:hidden ${
                isArabic ? 'right-0' : 'left-0'
              }`}
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <motion.div variants={navListVariants} initial="closed" animate="open" className="contents">
                {SidebarContent}
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;