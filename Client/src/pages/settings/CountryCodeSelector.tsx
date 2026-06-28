import { ChevronDown, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { countryOptions, getFlagUrl, type CountryOption } from './countries';
import { cn } from './utils';

function getLocalizedCountryName(code: string, language: string) {
  try {
    return (
      new Intl.DisplayNames([language], { type: 'region' }).of(code) ?? code
    );
  } catch {
    return code;
  }
}

export function CountryCodeSelector({
  value,
  onChange,
  onOpenChange,
}: {
  value: CountryOption;
  onChange: (country: CountryOption) => void;
  onOpenChange?: (open: boolean) => void;
}) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const isRtl = i18n.dir() === 'rtl';

  useEffect(() => {
    onOpenChange?.(open);
  }, [onOpenChange, open]);

  useEffect(() => {
    if (open) {
      setMounted(true);
      window.setTimeout(() => searchRef.current?.focus(), 80);
      return;
    }

    const timeout = window.setTimeout(() => {
      setMounted(false);
      setQuery('');
    }, 180);
    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!mounted) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [mounted]);

  const countries = useMemo(
    () =>
      countryOptions.map((country) => ({
        ...country,
        label: getLocalizedCountryName(country.code, i18n.language),
        englishLabel: getLocalizedCountryName(country.code, 'en'),
        arabicLabel: getLocalizedCountryName(country.code, 'ar'),
      })),
    [i18n.language]
  );

  const filteredCountries = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return countries;

    return countries.filter((country) => {
      const searchable = [
        country.label,
        country.englishLabel,
        country.arabicLabel,
        country.dialCode,
        country.code,
      ]
        .join(' ')
        .toLocaleLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [countries, query]);

  const selectedLabel = getLocalizedCountryName(value.code, i18n.language);

  return (
    <div ref={ref} className="relative flex h-full shrink-0 items-center">
      <button
        type="button"
        aria-label={t('settings.account.countryCode')}
        aria-expanded={open}
        className="grid h-full grid-cols-[24px_auto_13px] items-center gap-2 pr-2 text-left outline-none transition-opacity duration-150 hover:opacity-80"
        onClick={() => setOpen((next) => !next)}
      >
        <img
          src={getFlagUrl(value.code)}
          alt={selectedLabel}
          className="h-4 w-6 rounded-[2px] object-cover"
        />
        <span className="text-[13px] font-normal text-[#090909]">
          {value.dialCode}
        </span>
        <ChevronDown
          size={13}
          className={cn(
            'text-gray-400 transition-transform duration-200',
            open ? 'rotate-180' : 'rotate-0'
          )}
        />
      </button>

      {mounted && (
        <div
          className={cn(
            'absolute top-full z-[9999] mt-2 w-[300px] md:w-[360px] overflow-hidden rounded-lg border border-gray-200 bg-white   transition-all duration-200 ease-out',
            open
              ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
              : 'pointer-events-none -translate-y-1 scale-[0.98] opacity-0',
            isRtl
              ? ' right-[-12px] origin-top-right'
              : ' left-[-12px] origin-top-left'
          )}
        >
          <div className="border-b border-gray-100 bg-white p-2">
            <div className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 transition-colors duration-150 focus-within:border-gray-300 focus-within:bg-white">
              <Search size={14} className="shrink-0 text-gray-400" />
              <input
                ref={searchRef}
                value={query}
                type="search"
                placeholder={t('settings.account.searchCountry')}
                className="min-w-0 flex-1 bg-transparent text-[13px] text-[#090909] outline-none placeholder:text-gray-400"
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setOpen(false);
                }}
              />
            </div>
          </div>

          <div className="max-h-[210px] overflow-y-auto py-1 md:py-1.5">
            {filteredCountries.map((country) => {
              const selected = country.code === value.code;

              return (
                <button
                  key={country.code}
                  type="button"
                  className={cn(
                    'grid w-full grid-cols-[24px_minmax(0,1fr)_56px] items-center gap-3 px-3 py-2.5 text-left text-xs transition-all duration-150 ease-out hover:bg-gray-50 hover:text-[#090909]',
                    selected ? 'bg-gray-100 text-[#090909]' : 'text-gray-700'
                  )}
                  onClick={() => {
                    onChange(country);
                    setOpen(false);
                  }}
                >
                  <img
                    src={getFlagUrl(country.code)}
                    alt={country.label}
                    className="h-4 w-6 shrink-0 rounded-[2px] object-cover"
                  />
                  <span className="min-w-0 truncate leading-5">
                    {country.label}
                  </span>
                  <span className="justify-self-end font-medium leading-5 text-[#090909]">
                    {country.dialCode}
                  </span>
                </button>
              );
            })}

            {filteredCountries.length === 0 && (
              <p className="px-3 py-6 text-center text-[13px] text-gray-400">
                {t('settings.account.noCountriesFound')}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
