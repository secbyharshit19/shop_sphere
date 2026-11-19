import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ShoppingCart } from 'lucide-react';
import { CartItem, CategoryId, Product, PRODUCTS } from './data/catalog';
import {
  CART_STORAGE_KEY,
  loadCartFromStorage,
  MAX_ITEM_QUANTITY,
  saveCartToStorage,
} from './utils/cart';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryStrip } from './components/CategoryStrip';
import { FeaturedProducts, SortOption } from './components/FeaturedProducts';
import { ProductDetailsPage } from './components/ProductDetailsPage';
import { CartDrawer, CartDrawerStep } from './components/CartDrawer';
import { Footer } from './components/Footer';

function getProductIdFromHash(): string | null {
  if (typeof window === 'undefined') return null;
  const match = window.location.hash.match(/^#\/product\/([^/?#]+)/);
  if (!match) return null;
  const candidateId = decodeURIComponent(match[1]);
  return PRODUCTS.some((p) => p.id === candidateId) ? candidateId : null;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [cartItems, setCartItems] = useState<CartItem[]>(loadCartFromStorage);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartDrawerStep, setCartDrawerStep] = useState<CartDrawerStep>('cart');
  const [activeProductId, setActiveProductId] = useState<string | null>(
    getProductIdFromHash
  );
  const [cartJustUpdated, setCartJustUpdated] = useState(false);
  const [toastProductName, setToastProductName] = useState<string | null>(null);

  const toastTimerRef = useRef<number | null>(null);
  const badgeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);

  useEffect(() => {
    const handleStorageSync = (event: StorageEvent) => {
      if (event.key === CART_STORAGE_KEY) {
        setCartItems(loadCartFromStorage());
      }
    };
    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, []);

  useEffect(() => {
    const handleRouteSync = () => {
      setActiveProductId(getProductIdFromHash());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleRouteSync);
    window.addEventListener('popstate', handleRouteSync);
    return () => {
      window.removeEventListener('hashchange', handleRouteSync);
      window.removeEventListener('popstate', handleRouteSync);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      if (badgeTimerRef.current) window.clearTimeout(badgeTimerRef.current);
    };
  }, []);

  const activeProduct = useMemo(
    () => PRODUCTS.find((item) => item.id === activeProductId) ?? null,
    [activeProductId]
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const matching = PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;

      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;

      return (
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.brand.toLowerCase().includes(normalizedQuery) ||
        product.categoryLabel.toLowerCase().includes(normalizedQuery) ||
        product.shortDescription.toLowerCase().includes(normalizedQuery)
      );
    });

    const sorted = [...matching];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    }
    return sorted;
  }, [searchQuery, selectedCategory, sortBy]);

  const totalCartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const cartQuantities = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of cartItems) {
      map[item.product.id] = item.quantity;
    }
    return map;
  }, [cartItems]);

  const scrollToSection = (sectionId: string) => {
    window.setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 40);
  };

  const navigateToProduct = (product: Product) => {
    setActiveProductId(product.id);
    const nextHash = `#/product/${encodeURIComponent(product.id)}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = (sectionId?: string) => {
    setActiveProductId(null);
    if (window.location.hash) {
      window.history.pushState(
        null,
        '',
        window.location.pathname + window.location.search
      );
    }
    if (sectionId) {
      scrollToSection(sectionId);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const triggerCartBadgeHighlight = () => {
    setCartJustUpdated(true);
    if (badgeTimerRef.current) window.clearTimeout(badgeTimerRef.current);
    badgeTimerRef.current = window.setTimeout(() => {
      setCartJustUpdated(false);
    }, 500);
  };

  const handleAddToCart = (
    product: Product,
    quantityToAdd = 1,
    suppressToast = false
  ) => {
    const safeAdd = Math.max(1, Math.floor(quantityToAdd));
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: Math.min(MAX_ITEM_QUANTITY, item.quantity + safeAdd),
              }
            : item
        );
      }
      return [
        ...prev,
        { product, quantity: Math.min(MAX_ITEM_QUANTITY, safeAdd) },
      ];
    });

    triggerCartBadgeHighlight();

    if (!isCartOpen && !suppressToast) {
      setToastProductName(product.name);
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = window.setTimeout(() => {
        setToastProductName(null);
      }, 3200);
    }
  };

  const handleBuyNow = (product: Product, quantityToAdd = 1) => {
    handleAddToCart(product, quantityToAdd, true);
    setToastProductName(null);
    setCartDrawerStep('checkout');
    setIsCartOpen(true);
  };

  const handleOpenCart = () => {
    setCartDrawerStep('cart');
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, nextQuantity: number) => {
    if (nextQuantity <= 0) {
      setCartItems((prev) =>
        prev.filter((item) => item.product.id !== productId)
      );
      triggerCartBadgeHighlight();
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: Math.min(MAX_ITEM_QUANTITY, Math.floor(nextQuantity)),
            }
          : item
      )
    );
    triggerCartBadgeHighlight();
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    triggerCartBadgeHighlight();
  };

  const handleClearCart = () => {
    setCartItems([]);
    triggerCartBadgeHighlight();
  };

  const handleSelectCategoryAndScroll = (category: CategoryId) => {
    setSelectedCategory(category);
    if (activeProductId) {
      navigateToHome('featured-products');
    } else {
      scrollToSection('featured-products');
    }
  };

  const handleSearchSubmit = () => {
    if (activeProductId) {
      navigateToHome('featured-products');
    } else {
      scrollToSection('featured-products');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('featured');
  };

  const handleBrandClick = () => {
    handleResetFilters();
    navigateToHome();
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Navbar
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onSearchSubmit={handleSearchSubmit}
        onBrandClick={handleBrandClick}
        cartCount={totalCartCount}
        onCartOpen={handleOpenCart}
        cartJustUpdated={cartJustUpdated}
      />

      <main className="flex-1">
        {activeProduct ? (
          <ProductDetailsPage
            product={activeProduct}
            quantityInCart={cartQuantities[activeProduct.id] ?? 0}
            cartQuantities={cartQuantities}
            onBackToShopping={() => navigateToHome()}
            onSelectCategory={handleSelectCategoryAndScroll}
            onAddToCart={(product, qty) => handleAddToCart(product, qty)}
            onBuyNow={handleBuyNow}
            onSelectProduct={navigateToProduct}
          />
        ) : (
          <>
            <HeroBanner
              onShopNowClick={() => scrollToSection('featured-products')}
              onBrowseCategoriesClick={() => scrollToSection('categories')}
            />

            <CategoryStrip
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategoryAndScroll}
            />

            <FeaturedProducts
              products={filteredProducts}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onResetFilters={handleResetFilters}
              cartQuantities={cartQuantities}
              onAddToCart={(product) => handleAddToCart(product, 1)}
              onInspectProduct={navigateToProduct}
            />
          </>
        )}
      </main>

      <Footer
        onSelectCategory={handleSelectCategoryAndScroll}
        onScrollTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      {/* Slide-Over Shopping Cart & Express Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        initialStep={cartDrawerStep}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onAddProduct={(product, qty) => handleAddToCart(product, qty, true)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onViewProduct={navigateToProduct}
      />

      {/* Subtle Add-to-Cart Confirmation Bar */}
      {toastProductName && !isCartOpen && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 right-4 z-40 flex max-w-sm items-center gap-3 rounded-xl border border-slate-700 bg-[#0F172A] px-4 py-3 text-white shadow-xl md:bottom-5 md:right-5"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
            <Check className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-slate-300">Added to cart</p>
            <p className="truncate text-sm font-semibold text-white">
              {toastProductName}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setToastProductName(null);
              handleOpenCart();
            }}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#F59E0B] px-3 py-1.5 text-xs font-semibold text-[#0F172A] hover:bg-[#D97706] transition-colors whitespace-nowrap"
          >
            <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />
            <span>View Cart</span>
          </button>
        </div>
      )}
    </div>
  );
}
