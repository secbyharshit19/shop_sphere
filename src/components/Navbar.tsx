import React from 'react';
import { ChevronDown, Search, ShoppingCart, X } from 'lucide-react';
import { CategoryId, SEARCH_CATEGORY_OPTIONS } from '../data/catalog';

interface NavbarProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  selectedCategory: CategoryId;
  onCategoryChange: (category: CategoryId) => void;
  onSearchSubmit: () => void;
  onBrandClick: () => void;
  cartCount: number;
  onCartOpen: () => void;
  cartJustUpdated: boolean;
}

export function Navbar({
  searchQuery,
  onSearchQueryChange,
  selectedCategory,
  onCategoryChange,
  onSearchSubmit,
  onBrandClick,
  cartCount,
  onCartOpen,
  cartJustUpdated,
}: NavbarProps) {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearchSubmit();
  };

  const renderSearchBar = (inputId: string) => (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="Search ShopSphere products"
      className="flex w-full items-stretch overflow-hidden rounded-lg bg-white ring-1 ring-white/15 focus-within:ring-2 focus-within:ring-[#F59E0B] transition-shadow duration-150"
    >
      <div className="relative flex shrink-0 items-center border-r border-slate-200 bg-slate-100 hover:bg-slate-200/80 transition-colors duration-150">
        <label htmlFor={`${inputId}-category`} className="sr-only">
          Select product category
        </label>
        <select
          id={`${inputId}-category`}
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value as CategoryId)}
          className="h-11 appearance-none bg-transparent pl-3 pr-8 text-xs font-medium text-slate-700 focus:outline-none sm:text-sm"
        >
          {SEARCH_CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-slate-500"
          aria-hidden="true"
        />
      </div>

      <div className="relative flex flex-1 items-center">
        <label htmlFor={inputId} className="sr-only">
          Search products
        </label>
        <input
          id={inputId}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Search headphones, espresso makers, keyboards..."
          className="h-11 w-full bg-white px-3.5 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchQueryChange('')}
            aria-label="Clear search query"
            className="absolute right-2 flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <button
        type="submit"
        aria-label="Submit search"
        className="flex h-11 shrink-0 items-center justify-center gap-1.5 bg-[#F59E0B] px-4 text-sm font-semibold text-[#0F172A] hover:bg-[#D97706] active:bg-[#B45309] transition-colors duration-150 whitespace-nowrap"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        <span className="hidden lg:inline">Search</span>
      </button>
    </form>
  );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0F172A] text-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:gap-8 lg:px-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={onBrandClick}
            className="flex shrink-0 items-center gap-2.5 text-left whitespace-nowrap focus-visible:rounded-md"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F59E0B] text-[#0F172A]"
              aria-hidden="true"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4.5 w-4.5"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M3.6 9h16.8" />
                <path d="M3.6 15h16.8" />
                <path d="M12 3a13.5 13.5 0 0 0 0 18" />
                <path d="M12 3a13.5 13.5 0 0 1 0 18" />
              </svg>
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">
              ShopSphere
            </span>
          </button>

          {/* Zone 2: Desktop Unified Search Bar with Category Select */}
          <div className="hidden max-w-2xl flex-1 md:block">
            {renderSearchBar('desktop-search')}
          </div>

          {/* Zone 3: Shopping Cart Trigger */}
          <div className="flex shrink-0 items-center">
            <button
              type="button"
              onClick={onCartOpen}
              aria-label={`Open shopping cart with ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
              className={`group flex h-11 items-center gap-2.5 rounded-lg border px-3.5 text-sm font-medium transition-all duration-150 whitespace-nowrap shrink-0 ${
                cartJustUpdated
                  ? 'border-[#F59E0B] bg-[#F59E0B]/15 text-white scale-[1.03]'
                  : 'border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10'
              }`}
            >
              <ShoppingCart
                className="h-4.5 w-4.5 text-[#F59E0B] transition-transform duration-150 group-hover:scale-105"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Cart</span>
              <span
                className="inline-flex min-w-[1.5rem] items-center justify-center rounded-md bg-[#F59E0B] px-1.5 py-0.5 font-mono text-xs font-semibold text-[#0F172A] tabular-nums"
              >
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile non-sticky search strip keeps sticky header compact (< 15% mobile viewport) */}
      <div className="border-b border-white/10 bg-[#131F36] px-4 py-3 md:hidden">
        {renderSearchBar('mobile-search')}
      </div>
    </>
  );
}
