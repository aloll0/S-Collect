import { useState } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LogoutModal from "./LogoutModal";

const LogoutButton = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);

    setTimeout(() => {
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
      navigate("login", { replace: true });
      setOpen(false);
      setLoading(false); 
    }, 1000);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-red-500 hover:bg-red-500/10 hover:text-red-600 px-3 py-2 rounded-md transition cursor-pointer focus:outline-none w-full "
      >
        <LogOut size={18} />
        <span className="truncate">Log Out</span>
      </button>

      <LogoutModal
        open={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default LogoutButton;