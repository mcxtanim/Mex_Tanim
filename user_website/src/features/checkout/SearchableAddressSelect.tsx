'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';

export interface AddressOption {
  id: string;
  nameEn: string;
  nameBn: string;
}

interface SearchableAddressSelectProps {
  label: string;
  icon?: React.ReactNode;
  value: string;
  options: AddressOption[];
  placeholder: string;
  disabledPlaceholder?: string;
  disabled?: boolean;
  required?: boolean;
  language: 'en' | 'bn';
  onChange: (value: string) => void;
}

export const SearchableAddressSelect: React.FC<SearchableAddressSelectProps> = ({
  label,
  icon,
  value,
  options,
  placeholder,
  disabledPlaceholder,
  disabled = false,
  required = false,
  language,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Find currently selected option (checks id, nameEn, nameBn, or slug)
  const selectedOption = options.find((opt) => {
    if (!value) return false;
    const vLower = value.toLowerCase().trim();
    return (
      opt.id.toLowerCase() === vLower ||
      opt.nameEn.toLowerCase() === vLower ||
      opt.nameBn.trim() === value.trim() ||
      opt.id.replace(/-dist$/, '') === vLower.replace(/-dist$/, '') ||
      opt.id.replace(/-(ctg|gaz|din)$/, '') === vLower.replace(/-(ctg|gaz|din)$/, '')
    );
  });

  // Filter options based on search query (matches English and Bengali)
  const filteredOptions = options.filter((opt) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      opt.nameEn.toLowerCase().includes(q) ||
      opt.nameBn.includes(searchQuery.trim()) ||
      opt.id.toLowerCase().includes(q)
    );
  });

  const handleSelect = (optId: string) => {
    onChange(optId);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchQuery('');
  };

  return (
    <div className="space-y-1 relative" ref={containerRef}>
      <label className="text-xs font-extrabold text-slate-800 flex items-center space-x-1">
        {icon}
        <span>{label}</span>
      </label>

      {/* Hidden input for HTML form validation */}
      <input
        type="text"
        tabIndex={-1}
        className="sr-only"
        value={value}
        required={required}
        onChange={() => {}}
      />

      {/* Trigger Box */}
      <div
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
        className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-semibold flex items-center justify-between transition select-none ${
          disabled
            ? 'opacity-60 cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
            : isOpen
            ? 'border-orange-500 ring-2 ring-orange-500/20 bg-white cursor-pointer shadow-sm text-slate-900'
            : 'border-gray-300 hover:border-gray-400 cursor-pointer text-slate-800 focus-within:border-orange-500'
        }`}
      >
        <span className="truncate pr-2">
          {disabled ? (
            disabledPlaceholder || placeholder
          ) : selectedOption ? (
            <span className="text-slate-900 font-bold">
              {language === 'bn' ? selectedOption.nameBn : selectedOption.nameEn}{' '}
              <span className="text-slate-400 font-normal">
                ({language === 'bn' ? selectedOption.nameEn : selectedOption.nameBn})
              </span>
            </span>
          ) : value ? (
            <span className="text-slate-900 font-bold">{value}</span>
          ) : (
            <span className="text-slate-400 font-normal">{placeholder}</span>
          )}
        </span>

        <div className="flex items-center space-x-1 shrink-0">
          {!disabled && value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-gray-200 text-gray-400 hover:text-gray-700 rounded-full transition"
              title={language === 'bn' ? 'মুছুন' : 'Clear'}
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-orange-500' : ''
            }`}
          />
        </div>
      </div>

      {/* Dropdown Floating Menu */}
      {isOpen && !disabled && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-gray-200 rounded-2xl shadow-2xl p-2.5 space-y-2 animate-in fade-in zoom-in-95 duration-150">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'খুঁজুন... (যেমন: Dhaka বা ঢাকা)'
                  : 'Search... (e.g. Dhaka or ঢাকা)'
              }
              className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-gray-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:bg-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Results Count Info */}
          <div className="flex items-center justify-between px-1 text-[10px] text-slate-400 font-medium">
            <span>
              {language === 'bn'
                ? `${filteredOptions.length}টি অপশন পাওয়া গেছে`
                : `${filteredOptions.length} options found`}
            </span>
            {searchQuery && (
              <span className="text-orange-500 font-bold">
                {language === 'bn' ? 'ফিল্টার সক্রিয়' : 'Filter active'}
              </span>
            )}
          </div>

          {/* Options List */}
          <div className="max-h-52 overflow-y-auto space-y-0.5 pr-1 scrollbar-thin">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected =
                  opt.id === value ||
                  opt.id.toLowerCase() === value.toLowerCase() ||
                  opt.nameEn.toLowerCase() === value.toLowerCase() ||
                  opt.nameBn === value;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelect(opt.id)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-orange-500 text-white font-bold shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100 font-medium'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs">
                        {language === 'bn' ? opt.nameBn : opt.nameEn}
                      </span>
                      <span
                        className={`text-[10px] ${
                          isSelected ? 'text-white/80' : 'text-slate-400'
                        }`}
                      >
                        {language === 'bn' ? opt.nameEn : opt.nameBn}
                      </span>
                    </div>

                    {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0" />}
                  </button>
                );
              })
            ) : (
              <div className="py-4 text-center space-y-2">
                <p className="text-xs text-slate-400">
                  {language === 'bn'
                    ? `"${searchQuery}" নামে কিছু পাওয়া যায়নি`
                    : `No results matching "${searchQuery}"`}
                </p>
                {/* Fallback option to allow custom typing */}
                <button
                  type="button"
                  onClick={() => handleSelect(searchQuery.trim())}
                  className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 rounded-lg text-[11px] font-bold transition"
                >
                  {language === 'bn'
                    ? `"${searchQuery.trim()}" হিসেবে ব্যবহার করুন`
                    : `Use "${searchQuery.trim()}"`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
