import React, { useState } from 'react';
import { Check, Package, Plus } from 'lucide-react';
import { getDiscountPercentage, Product } from '../data/catalog';
import { RatingStars } from './RatingStars';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product) => void;
  onInspectProduct: (product: Product) => void;
}

export function ProductCard({
  product,
  quantityInCart,
  onAddToCart,
  onInspectProduct,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onAddToCart(product);
    setJustAdded(true);
    window.setTimeout(() => {
      setJustAdded(false);
    }, 1200);
  };

  const discountPercent = getDiscountPercentage(
    product.price,
    product.originalPrice
  );

  return (
    <article
      onClick={() => onInspectProduct(product)}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      {/* Studio Product Photography (4:3 uniform container) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#EBF0F4]">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-100 p-4 text-center text-slate-400">
            <Package className="h-9 w-9" aria-hidden="true" />
            <span className="text-xs font-medium text-slate-500">
              {product.name}
            </span>
          </div>
        )}
      </div>

      {/* Structured Card Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Clean unboxed metadata (zero pill enclosures) */}
        <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <span>{product.brand}</span>
          <span aria-hidden="true">·</span>
          <span>{product.categoryLabel}</span>
          {discountPercent !== null && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-[#B45309] tabular-nums">
                {discountPercent}% off
              </span>
            </>
          )}
        </p>

        {/* Product Title */}
        <h3 className="mt-1.5 font-display text-base font-semibold leading-snug text-[#0F172A]">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onInspectProduct(product);
            }}
            className="line-clamp-2 text-left group-hover:text-[#1E3A5F] transition-colors focus-visible:rounded-sm"
          >
            {product.name}
          </button>
        </h3>

        {/* Ratings */}
        <div className="mt-2.5">
          <RatingStars
            rating={product.rating}
            reviewCount={product.reviewCount}
          />
        </div>

        {/* Quiet Availability & Delivery Metadata */}
        <p className="mt-3 text-xs text-slate-500">
          <span
            className={`font-medium ${
              product.stockCount <= 5 ? 'text-[#B45309]' : 'text-emerald-700'
            }`}
          >
            {product.stockCount <= 5
              ? `Only ${product.stockCount} left`
              : product.availability}
          </span>
          <span className="mx-1.5" aria-hidden="true">
            ·
          </span>
          <span>{product.deliveryNote}</span>
        </p>

        {/* Bottom Pinned Price & Add-to-Cart Baseline */}
        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-lg font-bold text-[#0F172A] tabular-nums">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-slate-400 line-through tabular-nums">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {quantityInCart > 0 && (
                <span className="mt-0.5 text-xs font-medium text-slate-500 tabular-nums">
                  {quantityInCart} in cart
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className={`inline-flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg px-4 text-xs font-semibold transition-all duration-150 whitespace-nowrap sm:text-sm ${
                justAdded
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#0F172A] text-white hover:bg-[#1E293B] active:scale-[0.98]'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
