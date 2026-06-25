import { Link } from 'react-router-dom';
import { Globe, Menu, User } from 'lucide-react';
import InputSearch from './InputSearch';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { i18n } = useTranslation();

  const today = new Date().toLocaleDateString(
    i18n.language === 'ar' ? 'ar-EG' : 'en-US',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value;

    i18n.changeLanguage(lang);

    localStorage.setItem('language', lang);

    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  return (
    <header className="bg-(--gray-950) shadow-md p-4 text-white">
      <div className="container mx-auto flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
        <div className="flex items-center justify-between gap-4 lg:hidden">
          <div className="flex items-center gap-3">
            <img src="/mobLogo.png" alt="Logo" className="h-10 w-10" />
            <button
              type="button"
              onClick={onMenuClick}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-gray-50 transition-colors cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>
          </div>
          <div className="flex items-center">
            <div className="lg:hidden block">
              <InputSearch />
            </div>
            <Link
              to="/login"
              className="inline-flex h-11 w-11 items-center justify-center text-gray-50 transition-colors"
              aria-label="Account"
            >
              <User size={24} />
            </Link>
          </div>
        </div>

        <div className="hidden items-center justify-between gap-4 lg:flex">
          <div>
            <h1 className="text-2xl font-bold">Hello, Ahmed 👋</h1>
            <p className="text-sm text-gray-400">{today}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:gap-4 lg:flex hidden">
          <div className="flex-1 lg:flex-none lg:block hidden">
            <InputSearch />
          </div>

          <div className="hidden items-center bg-gray-50 text-white px-1 rounded-lg lg:flex">
            <Globe className="text-gray-950" />

            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className="bg-gray-50 text-black px-2 py-2 rounded-lg cursor-pointer"
            >
              <option value="en">EN</option>
              <option value="ar">AR</option>
            </select>
          </div>

          <Link
            to="/login"
            className="hidden text-2xl hover:text-gray-300 lg:block"
          >
            <User />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
