import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import InputSearch from './InputSearch';
import { useTranslation } from 'react-i18next';

const Header = () => {
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
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Hello, Ahmed 👋</h1>
          <p className="text-sm text-gray-400">{today}</p>
        </div>

        <div className="flex items-center gap-4">
          <InputSearch />

          <select
            value={i18n.language}
            onChange={handleLanguageChange}
            className="bg-gray-800 text-white px-2 py-2 rounded-lg"
          >
            <option value="en">EN</option>
            <option value="ar">AR</option>
          </select>

          <Link to="/login" className="text-2xl hover:text-gray-300">
            <User />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
