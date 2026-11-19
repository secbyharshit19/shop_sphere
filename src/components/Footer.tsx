import { CATEGORIES, CategoryId } from '../data/catalog';

interface FooterProps {
  onSelectCategory: (category: CategoryId) => void;
  onScrollTop: () => void;
}

export function Footer({ onSelectCategory, onScrollTop }: FooterProps) {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[#0F172A] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand Column */}
          <div>
            <button
              type="button"
              onClick={onScrollTop}
              className="inline-flex items-center gap-2.5 text-left"
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
              <span className="font-display text-lg font-bold tracking-tight text-white">
                ShopSphere
              </span>
            </button>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
              Curated everyday technology, home appliances, workspace hardware,
              and commuter essentials shipped directly to your door.
            </p>
          </div>

          {/* Departments Navigation */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white">
              Departments
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('all')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  All Featured Products
                </button>
              </li>
              {CATEGORIES.map((category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(category.id)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Guarantees */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white">
              Shopping Guarantees
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>Free two-day delivery on orders over $75</li>
              <li>30-day hassle-free returns and exchanges</li>
              <li>Verified customer ratings on every product</li>
              <li>One-year hardware warranty protection</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} ShopSphere Commerce. All rights reserved.</p>
          <button
            type="button"
            onClick={onScrollTop}
            className="font-medium text-slate-300 hover:text-white transition-colors"
          >
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
