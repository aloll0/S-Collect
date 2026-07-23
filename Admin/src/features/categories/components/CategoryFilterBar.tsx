import { Search, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCategoryStore } from '../../../store/categoryStore';

export const CategoryFilterBar = () => {
  const { t, i18n } = useTranslation();
  const search = useCategoryStore((state) => state.search);
  const categoryFilter = useCategoryStore((state) => state.categoryFilter);
  const categories = useCategoryStore((state) => state.categories);
  const setSearch = useCategoryStore((state) => state.setSearch);
  const setCategoryFilter = useCategoryStore((state) => state.setCategoryFilter);

  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="relative flex-1 max-w-sm">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('categories.filter.search')}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-body-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-all bg-white"
        />
      </div>

      <div className="relative shrink-0">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 text-body-sm text-gray-700 focus:outline-none focus:border-gray-900 transition-all bg-white cursor-pointer"
        >
          <option value="all">{t('categories.filter.all')}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {i18n.language === 'ar' ? c.nameAr : c.nameEn}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
      </div>
    </div>
  );
};
