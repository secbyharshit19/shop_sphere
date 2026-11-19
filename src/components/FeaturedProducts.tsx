import { ArrowUpDown, RotateCcw, SearchX } from 'lucide-react';
import {
  CategoryId,
  Product,
  SEARCH_CATEGORY_OPTIONS,
} from '../data/catalog';
import { ProductCard } from './ProductCard';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating';

interface FeaturedProductsProps {
  products: Product[];
  selectedCategory: CategoryId;
  onSelectCategory: (category: CategoryId) => void;
  searchQuery: string;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onResetFilters: () => void;
  cartQuantities: Record<string, number>;
  onAddToCart: (product: Product) => void;
  onInspectProduct: (product: Product) => void;
}

export function FeaturedProducts({
  products,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  sortBy,
  onSortChange,
  onResetFilters,
  cartQuantities,
  onAddToCart,
  onInspectProduct,
}: FeaturedProductsProps) {
  const activeCategoryLabel =
    SEARCH_CATEGORY_OPTIONS.find((opt) => opt.value === selectedCategory)
      ?.label ?? 'All Departments';

  const isFiltered =
    selectedCategory !== 'all' || searchQuery.trim().length > 0;

  return (
    <section
      id="featured-products"
      aria-labelledby="featured-heading"
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8"
    >
      {/* Section Header & Controls */}
      <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2
            id="featured-heading"
            className="font-display text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl"
          >
            {searchQuery.trim()
              ? `Search Results for "${searchQuery.trim()}"`
              : selectedCategory === 'all'
                ? 'Featured Products'
                : activeCategoryLabel}
          </h2>
          <p className="mt-1 text-sm text-slate-600 tabular-nums">
            Showing {products.length}{' '}
            {products.length === 1 ? 'product' : 'products'}
            {selectedCategory !== 'all' && ` in ${activeCategoryLabel}`}
          </p>
        </div>

        {/* Interactive Filter Tabs + Sort Control */}
        <div className="flex flex-wrap items-center gap-3">
          <div
            role="tablist"
            aria-label="Filter products by department"
            className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1"
          >
            {SEARCH_CATEGORY_OPTIONS.map((option) => {
              const isSelected = selectedCategory === option.value;
              return (
                <button
                  key={option.value}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  onClick={() => onSelectCategory(option.value)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-white text-[#0F172A] shadow-xs'
                      : 'text-slate-600 hover:text-[#0F172A]'
                  }`}
                >
                  {option.value === 'all' ? 'All' : option.label}
                </button>
              );
            })}
          </div>

          <div className="relative flex items-center">
            <ArrowUpDown
              className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-slate-500"
              aria-hidden="true"
            />
            <label htmlFor="product-sort" className="sr-only">
              Sort products
            </label>
            <select
              id="product-sort"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="h-9 rounded-lg border border-slate-200 bg-white pl-8 pr-8 text-xs font-medium text-slate-700 hover:border-slate-300 focus:outline-none"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Responsive 3-Column Product Grid or Empty State */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantityInCart={cartQuantities[product.id] ?? 0}
              onAddToCart={onAddToCart}
              onInspectProduct={onInspectProduct}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <SearchX className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="mt-4 font-display text-base font-semibold text-[#0F172A]">
            No matching products found
          </h3>
          <p className="mt-1.5 max-w-md text-sm text-slate-500">
            We couldn&apos;t find any items matching your current search and
            department filter. Try another keyword or browse all products.
          </p>
          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#0F172A] px-4 text-sm font-semibold text-white hover:bg-[#1E293B] transition-colors"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Reset Search &amp; Filters</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
}
