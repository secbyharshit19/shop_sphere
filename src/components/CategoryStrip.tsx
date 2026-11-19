import { useState } from 'react';
import { ArrowUpRight, Layers } from 'lucide-react';
import { CATEGORIES, CategoryId, PRODUCTS } from '../data/catalog';

interface CategoryStripProps {
  selectedCategory: CategoryId;
  onSelectCategory: (category: CategoryId) => void;
}

export function CategoryStrip({
  selectedCategory,
  onSelectCategory,
}: CategoryStripProps) {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const getCategoryCount = (id: Exclude<CategoryId, 'all'>) =>
    PRODUCTS.filter((product) => product.category === id).length;

  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className="mx-auto max-w-7xl px-4 pt-10 pb-4 sm:px-6 sm:pt-12 lg:px-8"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id="categories-heading"
            className="font-display text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl"
          >
            Shop by Category
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Jump straight into a department or view the full curated catalog.
          </p>
        </div>

        {selectedCategory !== 'all' && (
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className="text-sm font-medium text-[#0F172A] underline decoration-slate-300 underline-offset-4 hover:decoration-[#F59E0B] transition-colors whitespace-nowrap shrink-0"
          >
            Show all departments
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category.id;
          const count = getCategoryCount(category.id);
          const hasImageError = failedImages[category.id];

          return (
            <button
              key={category.id}
              type="button"
              onClick={() =>
                onSelectCategory(isActive ? 'all' : category.id)
              }
              aria-pressed={isActive}
              className={`group flex flex-col overflow-hidden rounded-xl border bg-white text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                isActive
                  ? 'border-[#0F172A] ring-2 ring-[#0F172A]/15'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EBF0F4]">
                {!hasImageError ? (
                  <img
                    src={category.image}
                    alt={`${category.name} department showcase`}
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [category.id]: true }))
                    }
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-100 text-slate-400">
                    <Layers className="h-8 w-8" aria-hidden="true" />
                    <span className="text-xs font-medium">{category.name}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 p-4">
                <div className="min-w-0">
                  <h3 className="truncate font-display text-sm font-semibold text-[#0F172A] sm:text-base">
                    {category.name}
                  </h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="truncate">{category.tagline}</span>
                    <span aria-hidden="true">·</span>
                    <span className="shrink-0 tabular-nums">
                      {count} {count === 1 ? 'item' : 'items'}
                    </span>
                  </p>
                </div>

                <ArrowUpRight
                  className={`h-4 w-4 shrink-0 transition-transform duration-150 ${
                    isActive
                      ? 'text-[#D97706] translate-x-0.5 -translate-y-0.5'
                      : 'text-slate-400 group-hover:text-[#0F172A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                  }`}
                  aria-hidden="true"
                />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
