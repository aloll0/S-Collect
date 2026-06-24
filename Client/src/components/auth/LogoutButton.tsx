import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (!confirmLogout) return;

    // remove auth data
    localStorage.removeItem("token");

    // future: reset zustand store if used
    // authStore.getState().logout();

    toast.success("Logged out successfully");

    // redirect
    navigate("/login", { replace: true });
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-red-500 hover:bg-red-500/10 hover:text-red-600 px-3 py-2 rounded-md transition cursor-pointer focus:outline-none w-full"
    >
      <LogOut size={18} />
      <span className="truncate">Log Out</span>
    </button>
  );
};

export default LogoutButton;