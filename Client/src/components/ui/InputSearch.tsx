import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

const InputSearch = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [open]);

  return (
    <>
      {/* Desktop Search */}
      <div className="hidden md:block relative w-full">
        <input
          type="text"
          placeholder=" Search..."
          className="w-full bg-[var(--gray-50)] px-8 py-2 rounded-lg text-[var(--gray-700)] outline-none focus:ring-2 focus:ring-gray-600 focus:placeholder:text-white" 
        />
        <div className="h-4 w-0.5 bg-gray-300 rounded-full absolute top-2.5 left-7"></div>
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gray-400)]" />
      </div> 

      {/* Mobile Button */} 
      <button
        onClick={() => setOpen(true)}
        className="md:hidden flex items-center justify-center cursor-pointer"
      >
        <Search className="w-6 h-6 text-[var(--gray-50)]" />
      </button>

      {/* Mobile Bottom Sheet */}
      {open && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setOpen(false)}
        >
          {/* Blur background */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />

            {/* Search Input */}
            <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-xl">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                autoFocus
                type="text"
                placeholder="Search products, categories..."
                className="flex-1 bg-transparent outline-none text-gray-700"
              />
              <button onClick={() => setOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Optional suggestions area */}
            <div className="mt-4 text-sm text-gray-500">
              Try searching: shoes, jackets, electronics...
            </div>
          </div>
        </div>
      )}

      {/* Animation */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.25s ease-out;
        }
      `}</style>
    </>
  );
};

export default InputSearch;