import { Link } from "react-router-dom";
import { User } from "lucide-react";
import InputSearch from "./InputSearch";

const Header = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-[var(--gray-950)] shadow-md p-4 mb-4 text-white">
      <div className="container mx-auto flex justify-between items-center">

        {/* Left side */}
        <div>
          <h1 className="text-2xl font-bold">Hello, Ahmed 👋</h1>
          <p className="text-sm text-gray-400">{today}</p>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">

          <InputSearch />

          {/* Language dropdown */}
          <select className="bg-gray-800 text-white px-2 py-2 rounded-lg">
            <option value="en">EN</option>
            <option value="ar">AR</option>
          </select>

          {/* Login Icon */}
          <Link to="/login" className="text-2xl hover:text-gray-300">
            <User />
          </Link>

        </div>
      </div>
    </header>
  );
};

export default Header;