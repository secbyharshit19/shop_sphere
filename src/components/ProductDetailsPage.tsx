import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Minus,
  Package,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Zap,
} from 'lucide-react';
import {
  CategoryId,
  getDiscountPercentage,
  Product,
  PRODUCTS,
} from '../data/catalog';
import { FREE_SHIPPING_THRESHOLD, MAX_ITEM_QUANTITY } from '../utils/cart';
import { RatingStars } from './RatingStars';
import { ProductCard } from './ProductCard';

interface ProductDetailsPageProps {
  product: Product;
  quantityInCart: number;
  cartQuantities: Record<string, number>;
  onBackToShopping: () => void;
  onSelectCategory: (category: CategoryId) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
}

function formatEstimatedDeliveryDate(daysToAdd: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export function ProductDetailsPage({
  product,
  quantityInCart,
  cartQuantities,
  onBackToShopping,
  onSelectCategory,
  onAddToCart,
  onBuyNow,
  onSelectProduct,
}: ProductDetailsPageProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setActiveImageIndex(0);
    setQuantity(1);
    setJustAdded(false);
    setFailedImages({});
  }, [product.id]);

  const maxOrderQuantity = Math.max(
    1,
    Math.min(product.stockCount, MAX_ITEM_QUANTITY)
  );
  const isInStock = product.stockCount > 0;
  const isLowStock = product.stockCount > 0 && product.stockCount <= 5;

  const discountPercent = getDiscountPercentage(
    product.price,
    product.originalPrice
  );
  const savingsAmount =
    product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice - product.price
      : 0;

  const activeImage = product.gallery[activeImageIndex] ?? {
    src: product.image,
    alt: product.name,
    label: 'Studio View',
  };

  const estimatedArrival = useMemo(
    () => formatEstimatedDeliveryDate(product.deliveryDays),
    [product.deliveryDays]
  );

  const relatedProducts = useMemo(() => {
    const others = PRODUCTS.filter((item) => item.id !== product.id);
    const sameCategory = others.filter(
      (item) => item.category === product.category
    );
    const remaining = others.filter(
      (item) => item.category !== product.category
    );
    return [...sameCategory, ...remaining].slice(0, 3);
  }, [product.id, product.category]);

  const handlePrevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? product.gallery.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) =>
      prev === product.gallery.length - 1 ? 0 : prev + 1
    );
  };

  const handleAddToCartClick = () => {
    if (!isInStock) return;
    onAddToCart(product, quantity);
    setJustAdded(true);
    window.setTimeout(() => {
      setJustAdded(false);
    }, 1500);
  };

  const handleBuyNowClick = () => {
    if (!isInStock) return;
    onBuyNow(product, quantity);
  };

  const lineTotal = (Math.round(product.price * 100) * quantity) / 100;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-24 sm:px-6 sm:pt-8 md:pb-12 lg:px-8">
      {/* Top Bar: Back to Shopping + Clean Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={onBackToShopping}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-[#0F172A] hover:border-slate-300 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Shopping</span>
        </button>

        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm"
        >
          <button
            type="button"
            onClick={onBackToShopping}
            className="hover:text-[#0F172A] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Home
          </button>
          <span aria-hidden="true">/</span>
          <button
            type="button"
            onClick={() => onSelectCategory(product.category)}
            className="hover:text-[#0F172A] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            {product.categoryLabel}
          </button>
          <span aria-hidden="true">/</span>
          <span className="max-w-[180px] truncate font-medium text-[#0F172A] sm:max-w-xs">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Main 2-Column PDP Layout: Sticky Gallery Left + Contiguous Purchase Module Right */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        {/* Left Column: Image Gallery + Detailed Product Information */}
        <div className="lg:col-span-7">
          {/* Primary Image Showcase */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-[#EBF0F4]">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              {!failedImages[activeImageIndex] ? (
                <img
                  src={activeImage.src}
                  alt={activeImage.alt}
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setFailedImages((prev) => ({
                      ...prev,
                      [activeImageIndex]: true,
                    }))
                  }
                  className={`h-full w-full object-cover transition-transform duration-300 ${
                    activeImage.zoomClass ?? ''
                  }`}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-slate-100 text-slate-400">
                  <Package className="h-12 w-12" aria-hidden="true" />
                  <span className="text-sm font-medium text-slate-500">
                    {product.name}
                  </span>
                </div>
              )}

              {/* Previous / Next Gallery Controls */}
              {product.gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    aria-label="Previous product image"
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0F172A] shadow-sm ring-1 ring-slate-200 hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Next product image"
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0F172A] shadow-sm ring-1 ring-slate-200 hover:bg-white transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* View Counter Caption */}
              <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-[#0F172A]/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-xs">
                <span className="tabular-nums">
                  {activeImageIndex + 1} / {product.gallery.length}
                </span>
                <span className="mx-1.5 text-white/50" aria-hidden="true">
                  ·
                </span>
                <span>{activeImage.label}</span>
              </div>
            </div>
          </div>

          {/* Interactive Thumbnail Gallery Strip */}
          <div
            role="listbox"
            aria-label="Product image gallery thumbnails"
            className="mt-4 grid grid-cols-3 gap-3 sm:gap-4"
          >
            {product.gallery.map((item, index) => {
              const isSelected = index === activeImageIndex;
              return (
                <button
                  key={`${product.id}-thumb-${index}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => setActiveImageIndex(index)}
                  className={`group overflow-hidden rounded-xl border bg-[#EBF0F4] text-left transition-all duration-150 ${
                    isSelected
                      ? 'border-[#0F172A] ring-2 ring-[#0F172A]/20'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden">
                    <img
                      src={item.src}
                      alt={item.alt}
                      referrerPolicy="no-referrer"
                      className={`h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03] ${
                        item.zoomClass ?? ''
                      }`}
                    />
                  </div>
                  <div className="bg-white px-3 py-2">
                    <p
                      className={`truncate text-xs font-medium ${
                        isSelected ? 'text-[#0F172A]' : 'text-slate-500'
                      }`}
                    >
                      {item.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Product Overview, Highlights & Specifications */}
          <div className="mt-10 space-y-8 border-t border-slate-200 pt-8">
            <section aria-labelledby="pdp-overview-heading">
              <h2
                id="pdp-overview-heading"
                className="font-display text-lg font-bold text-[#0F172A]"
              >
                About This Item
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                {product.fullDescription}
              </p>

              <ul className="mt-5 space-y-2.5 text-sm text-slate-700">
                {product.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2.5">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700"
                      aria-hidden="true"
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section
              aria-labelledby="pdp-specs-heading"
              className="border-t border-slate-200 pt-8"
            >
              <h2
                id="pdp-specs-heading"
                className="font-display text-lg font-bold text-[#0F172A]"
              >
                Technical Specifications
              </h2>
              <dl className="mt-4 grid grid-cols-1 divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-2 sm:divide-y-0">
                {product.specifications.map((spec, index) => (
                  <div
                    key={spec.label}
                    className={`flex flex-col py-3.5 sm:px-4 ${
                      index >= 2 ? 'sm:border-t sm:border-slate-200' : ''
                    } ${index % 2 === 1 ? 'sm:border-l sm:border-slate-200' : ''}`}
                  >
                    <dt className="text-xs font-medium text-slate-500">
                      {spec.label}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-[#0F172A]">
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>

        {/* Right Column: Sticky Contiguous Purchase Module */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-7 lg:sticky lg:top-24">
            {/* Brand · Department · SKU (clean unboxed metadata) */}
            <p className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-500">
              <span>{product.brand}</span>
              <span aria-hidden="true">·</span>
              <span>{product.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[11px] text-slate-400">
                SKU {product.sku}
              </span>
            </p>

            {/* Product Name */}
            <h1
              className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight text-[#0F172A] sm:text-3xl"
              style={{ textWrap: 'balance' }}
            >
              {product.name}
            </h1>

            {/* Rating Stars */}
            <div className="mt-3">
              <RatingStars
                rating={product.rating}
                reviewCount={product.reviewCount}
                size="md"
              />
            </div>

            {/* Price & Discount Percentage Block */}
            <div className="mt-5 border-y border-slate-100 py-5">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-display text-3xl font-bold text-[#0F172A] tabular-nums">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-slate-400 line-through tabular-nums">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {discountPercent !== null && savingsAmount > 0 && (
                <p className="mt-1.5 text-sm font-semibold text-[#B45309] tabular-nums">
                  Save {discountPercent}% (${savingsAmount.toFixed(2)} off list
                  price)
                </p>
              )}

              {/* Stock Availability Status (icon + explicit text, never color alone) */}
              <div className="mt-4 flex items-center gap-2 text-sm">
                {!isInStock ? (
                  <>
                    <AlertCircle
                      className="h-4 w-4 shrink-0 text-rose-600"
                      aria-hidden="true"
                    />
                    <span className="font-semibold text-rose-700">
                      Currently Out of Stock
                    </span>
                  </>
                ) : isLowStock ? (
                  <>
                    <AlertCircle
                      className="h-4 w-4 shrink-0 text-[#B45309]"
                      aria-hidden="true"
                    />
                    <span className="font-semibold text-[#B45309] tabular-nums">
                      Only {product.stockCount} left in stock — order soon
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2
                      className="h-4 w-4 shrink-0 text-emerald-700"
                      aria-hidden="true"
                    />
                    <span className="font-semibold text-emerald-700">
                      In Stock
                    </span>
                    <span className="text-slate-500 tabular-nums">
                      · {product.stockCount} units ready to ship
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Short Summary */}
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              {product.shortDescription}
            </p>

            {/* Quantity Selector */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="pdp-quantity-display"
                  className="text-xs font-semibold text-slate-700"
                >
                  Quantity
                </label>
                {quantityInCart > 0 && (
                  <span className="text-xs font-medium text-slate-500 tabular-nums">
                    {quantityInCart} already in your cart
                  </span>
                )}
              </div>

              <div className="mt-2 flex items-center justify-between gap-4">
                <div className="flex h-11 items-center rounded-lg border border-slate-200 bg-slate-50">
                  <button
                    type="button"
                    disabled={!isInStock || quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-full w-11 items-center justify-center rounded-l-lg text-slate-700 hover:bg-slate-200/70 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span
                    id="pdp-quantity-display"
                    className="w-10 text-center font-mono text-sm font-semibold text-[#0F172A] tabular-nums"
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={!isInStock || quantity >= maxOrderQuantity}
                    onClick={() =>
                      setQuantity((q) => Math.min(maxOrderQuantity, q + 1))
                    }
                    aria-label="Increase quantity"
                    className="flex h-full w-11 items-center justify-center rounded-r-lg text-slate-700 hover:bg-slate-200/70 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500">Item Total</p>
                  <p className="font-display text-base font-bold text-[#0F172A] tabular-nums">
                    ${lineTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Primary Purchase CTAs: Add to Cart + Buy Now */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                disabled={!isInStock}
                onClick={handleAddToCartClick}
                className={`flex h-12 w-full items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
                  justAdded
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#0F172A] text-white hover:bg-[#1E293B] active:scale-[0.99]'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="h-4 w-4" aria-hidden="true" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={!isInStock}
                onClick={handleBuyNowClick}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#F59E0B] px-5 text-sm font-semibold text-[#0F172A] hover:bg-[#D97706] active:scale-[0.99] transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Zap className="h-4 w-4" aria-hidden="true" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Delivery & Protection Information */}
            <div className="mt-6 space-y-3.5 border-t border-slate-200 pt-5 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <Truck
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#0F172A]"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-[#0F172A]">
                    {product.price * quantity >= FREE_SHIPPING_THRESHOLD
                      ? 'Free Two-Day Delivery'
                      : `Two-Day Delivery (Free over $${FREE_SHIPPING_THRESHOLD})`}
                  </p>
                  <p className="mt-0.5 text-slate-500">
                    Estimated arrival by{' '}
                    <span className="font-medium text-slate-700">
                      {estimatedArrival}
                    </span>{' '}
                    · Ships from ShopSphere Fulfillment
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RotateCcw
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#0F172A]"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-[#0F172A]">
                    30-Day Hassle-Free Returns
                  </p>
                  <p className="mt-0.5 text-slate-500">
                    Prepaid return label included for unused items in original
                    packaging.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#0F172A]"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-[#0F172A]">
                    Warranty &amp; Buyer Protection
                  </p>
                  <p className="mt-0.5 text-slate-500">{product.warranty}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <section
        aria-labelledby="related-products-heading"
        className="mt-16 border-t border-slate-200 pt-10"
      >
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2
              id="related-products-heading"
              className="font-display text-xl font-bold tracking-tight text-[#0F172A]"
            >
              You Might Also Like
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              More curated essentials from the ShopSphere catalog.
            </p>
          </div>

          <button
            type="button"
            onClick={onBackToShopping}
            className="text-sm font-medium text-[#0F172A] underline decoration-slate-300 underline-offset-4 hover:decoration-[#F59E0B] transition-colors whitespace-nowrap shrink-0"
          >
            View all products
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {relatedProducts.map((related) => (
            <ProductCard
              key={related.id}
              product={related}
              quantityInCart={cartQuantities[related.id] ?? 0}
              onAddToCart={(item) => onAddToCart(item, 1)}
              onInspectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Mobile Sticky Bottom Buy Bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-xs md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-2.5">
          <div className="min-w-0 pr-1">
            <p className="font-display text-base font-bold text-[#0F172A] tabular-nums">
              ${lineTotal.toFixed(2)}
            </p>
            <p className="text-[11px] text-slate-500 tabular-nums">
              Qty {quantity}
            </p>
          </div>
          <button
            type="button"
            disabled={!isInStock}
            onClick={handleAddToCartClick}
            className={`flex h-11 flex-1 items-center justify-center rounded-lg px-3 text-xs font-semibold transition-colors whitespace-nowrap ${
              justAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-[#0F172A] text-white hover:bg-[#1E293B]'
            }`}
          >
            {justAdded ? 'Added' : 'Add to Cart'}
          </button>
          <button
            type="button"
            disabled={!isInStock}
            onClick={handleBuyNowClick}
            className="flex h-11 flex-1 items-center justify-center rounded-lg bg-[#F59E0B] px-3 text-xs font-semibold text-[#0F172A] hover:bg-[#D97706] transition-colors whitespace-nowrap"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
