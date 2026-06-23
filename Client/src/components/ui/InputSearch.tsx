import { Search } from 'lucide-react';

const InputSearch = () => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search..."
        className="bg-[var(--gray-50)] px-8 py-2 rounded-lg text-[var(--gray-700)] outline-none focus:ring-2 focus:ring-gray-600"
      />
      <i className="absolute left-3 top-2.5">
        <Search className="w-4 h-4 text-[var(--gray-700)]" />
      </i>
    </div>
  );
};

export default InputSearch;
