import { useState } from "react";
import { Search, X } from "lucide-react";

const InputSearch = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Search */}
      <div className="hidden md:block relative w-full">
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-[var(--gray-50)] px-8 py-2 rounded-lg text-[var(--gray-700)] outline-none focus:ring-2 focus:ring-gray-600"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gray-700)]" />
      </div>

      {/* Mobile Search Icon */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden flex items-center justify-center"
      >
        <Search className="w-6 h-6 text-[var(--gray-50)]" />
      </button> 

      {/* Mobile Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className=" p-4 flex items-center gap-3">
            <div className="relative flex-1">
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                className="w-full bg-[var(--gray-50)] px-10 py-2 rounded-lg outline-none text-[var(--gray-700)]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>

            <button onClick={() => setOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InputSearch;