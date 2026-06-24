import { Link } from 'react-router-dom';
import { Menu, User } from 'lucide-react';
import InputSearch from './InputSearch';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {

  return (
    <header className="bg-(--gray-950) shadow-md p-4 text-white">
      <div className="container mx-auto flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center">
          <img src="/mobLogo.png" alt="Logo" className="w-10 h-10 lg:hidden" />
            <button
              type="button"
              onClick={onMenuClick}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-gray-50 transition-colors lg:hidden cursor-pointer"
              aria-label="Open sidebar" 
            > 
              <Menu size={24} />
            </button> 
          </div>

          <Link
            to="/login"
            className="inline-flex h-11 w-11 items-center justify-center text-gray-50 transition-colors  lg:hidden"
            aria-label="Account"
          >
            <User size={22} />
          </Link>
        </div>

        <div className="flex items-center gap-3 lg:gap-4">
          <div className="flex-1 lg:flex-none">
            <InputSearch />
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
