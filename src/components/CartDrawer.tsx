import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Lock,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { CartItem, Product, PRODUCTS } from '../data/catalog';
import {
  calculateCartSummary,
  FREE_SHIPPING_THRESHOLD,
  MAX_ITEM_QUANTITY,
} from '../utils/cart';

export type CartDrawerStep = 'cart' | 'checkout';

interface CartDrawerProps {
  isOpen: boolean;
  initialStep?: CartDrawerStep;
  items: CartItem[];
  onClose: () => void;
  onAddProduct: (product: Product, quantity?: number) => void;
  onUpdateQuantity: (productId: string, nextQuantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onViewProduct?: (product: Product) => void;
}

export function CartDrawer({
  isOpen,
  initialStep = 'cart',
  items,
  onClose,
  onAddProduct,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onViewProduct,
}: CartDrawerProps) {
  const [step, setStep] = useState<CartDrawerStep>(initialStep);
  const [lastRemovedItem, setLastRemovedItem] = useState<CartItem | null>(null);
  const [fullName, setFullName] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [cityPostal, setCityPostal] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [formError, setFormError] = useState<string | null>(null);
  const [orderConfirmation, setOrderConfirmation] = useState<{
    orderNumber: string;
    grandTotal: number;
    itemCount: number;
    recipientName: string;
    paymentLabel: string;
  } | null>(null);

  const summary = useMemo(() => calculateCartSummary(items), [items]);
  const suggestedProducts = useMemo(() => PRODUCTS.slice(0, 2), []);

  useEffect(() => {
    if (isOpen) {
      setStep(items.length > 0 ? initialStep : 'cart');
      setFormError(null);
    }
  }, [isOpen, initialStep, items.length]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && items.length > 0 && orderConfirmation) {
      setOrderConfirmation(null);
    }
  }, [isOpen, items.length, orderConfirmation]);

  if (!isOpen) return null;

  const handleRemoveWithUndo = (item: CartItem) => {
    setLastRemovedItem(item);
    onRemoveItem(item.product.id);
  };

  const handleDecreaseQuantity = (item: CartItem) => {
    if (item.quantity <= 1) {
      handleRemoveWithUndo(item);
      return;
    }
    setLastRemovedItem(null);
    onUpdateQuantity(item.product.id, item.quantity - 1);
  };

  const handleIncreaseQuantity = (item: CartItem) => {
    if (item.quantity >= MAX_ITEM_QUANTITY) return;
    setLastRemovedItem(null);
    onUpdateQuantity(item.product.id, item.quantity + 1);
  };

  const handleUndoRemove = () => {
    if (!lastRemovedItem) return;
    onAddProduct(lastRemovedItem.product, lastRemovedItem.quantity);
    setLastRemovedItem(null);
  };

  const handlePlaceOrder = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !fullName.trim() ||
      !streetAddress.trim() ||
      !cityPostal.trim()
    ) {
      setFormError('Please fill in your name and shipping address to continue.');
      return;
    }

    const orderNumber = `SP-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderConfirmation({
      orderNumber,
      grandTotal: summary.grandTotal,
      itemCount: summary.totalItems,
      recipientName: fullName.trim(),
      paymentLabel:
        paymentMethod === 'card' ? 'Credit / Debit Card' : 'Cash on Delivery',
    });
    setLastRemovedItem(null);
    setFormError(null);
    setStep('cart');
    onClearCart();
  };

  const handleClose = () => {
    setOrderConfirmation(null);
    setLastRemovedItem(null);
    setFormError(null);
    onClose();
  };

  const handleNavigateToProduct = (product: Product) => {
    if (!onViewProduct) return;
    handleClose();
    onViewProduct(product);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#0F172A]/60 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-heading"
      onClick={handleClose}
    >
      <aside
        className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#0F172A] px-6 py-4 text-white">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && !orderConfirmation && items.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setStep('cart');
                  setFormError(null);
                }}
                aria-label="Back to shopping cart"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4.5 w-4.5" />
              </button>
            ) : (
              <ShoppingBag
                className="h-5 w-5 text-[#F59E0B]"
                aria-hidden="true"
              />
            )}
            <h2
              id="cart-drawer-heading"
              className="font-display text-base font-bold"
            >
              {step === 'checkout' && items.length > 0 && !orderConfirmation
                ? 'Express Checkout'
                : 'Shopping Cart'}
            </h2>
            <span className="text-xs text-slate-300 tabular-nums">
              ({summary.totalItems}{' '}
              {summary.totalItems === 1 ? 'item' : 'items'})
            </span>
          </div>

          <div className="flex items-center gap-2">
            {step === 'cart' && items.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setLastRemovedItem(null);
                  onClearCart();
                }}
                className="rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close shopping cart"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Free Shipping Threshold Progress (Cart Step) */}
        {step === 'cart' && items.length > 0 && (
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-3">
            <p className="text-xs font-medium text-slate-700">
              {summary.qualifiesForFreeShipping ? (
                <span className="text-emerald-700">
                  Your order qualifies for free two-day delivery.
                </span>
              ) : (
                <span>
                  Add{' '}
                  <strong className="font-semibold text-[#0F172A] tabular-nums">
                    ${summary.remainingForFreeShipping.toFixed(2)}
                  </strong>{' '}
                  more for free two-day delivery.
                </span>
              )}
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className={`h-full transition-all duration-300 ${
                  summary.qualifiesForFreeShipping
                    ? 'bg-emerald-600'
                    : 'bg-[#F59E0B]'
                }`}
                style={{ width: `${summary.freeShippingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Undo Removal Banner */}
        {step === 'cart' && lastRemovedItem && !orderConfirmation && (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center justify-between gap-3 border-b border-slate-200 bg-amber-50/80 px-6 py-2.5 text-xs text-slate-700"
          >
            <span className="truncate">
              Removed{' '}
              <strong className="font-semibold text-[#0F172A]">
                {lastRemovedItem.product.name}
              </strong>
            </span>
            <button
              type="button"
              onClick={handleUndoRemove}
              className="inline-flex shrink-0 items-center gap-1 font-semibold text-[#B45309] underline underline-offset-2 hover:text-[#92400E] whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Undo</span>
            </button>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {orderConfirmation ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <CheckCircle2
                className="h-12 w-12 text-emerald-700"
                aria-hidden="true"
              />
              <h3 className="mt-4 font-display text-lg font-bold text-[#0F172A]">
                Order #{orderConfirmation.orderNumber} Confirmed
              </h3>
              <p className="mt-2 max-w-xs text-sm text-slate-600">
                Thank you, {orderConfirmation.recipientName}. Preparing shipment
                for {orderConfirmation.itemCount}{' '}
                {orderConfirmation.itemCount === 1 ? 'item' : 'items'} via{' '}
                {orderConfirmation.paymentLabel}.
              </p>
              <p className="mt-2 text-sm font-semibold text-[#0F172A] tabular-nums">
                Grand Total: ${orderConfirmation.grandTotal.toFixed(2)}
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#0F172A] px-6 text-sm font-semibold text-white hover:bg-[#1E293B] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col justify-between py-2">
              <div className="flex flex-col items-center pt-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <ShoppingBag className="h-8 w-8" aria-hidden="true" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-[#0F172A]">
                  Your ShopSphere cart is empty
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
                  Items you add are saved automatically across sessions. Orders
                  over ${FREE_SHIPPING_THRESHOLD} include free two-day delivery.
                </p>

                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#0F172A] px-6 text-sm font-semibold text-white hover:bg-[#1E293B] transition-colors"
                >
                  Continue Shopping
                </button>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Truck
                      className="h-3.5 w-3.5 text-slate-600"
                      aria-hidden="true"
                    />
                    Free delivery over ${FREE_SHIPPING_THRESHOLD}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck
                      className="h-3.5 w-3.5 text-slate-600"
                      aria-hidden="true"
                    />
                    30-day returns
                  </span>
                </div>
              </div>

              {/* Popular Picks Quick-Add inside Empty Cart */}
              <div className="mt-8 border-t border-slate-200 pt-5">
                <h4 className="font-display text-xs font-semibold tracking-wide text-slate-500">
                  Popular picks to get started
                </h4>
                <ul className="mt-3 space-y-3">
                  {suggestedProducts.map((product) => (
                    <li
                      key={product.id}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-2.5"
                    >
                      <button
                        type="button"
                        onClick={() => handleNavigateToProduct(product)}
                        className="h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-[#EBF0F4]"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                      </button>
                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          onClick={() => handleNavigateToProduct(product)}
                          className="block max-w-full truncate text-left text-xs font-semibold text-[#0F172A] hover:underline"
                        >
                          {product.name}
                        </button>
                        <p className="mt-0.5 font-display text-xs font-bold text-slate-700 tabular-nums">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setLastRemovedItem(null);
                          onAddProduct(product, 1);
                        }}
                        className="inline-flex h-8 shrink-0 items-center gap-1 rounded-md bg-[#0F172A] px-3 text-xs font-semibold text-white hover:bg-[#1E293B] transition-colors whitespace-nowrap"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Add</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : step === 'checkout' ? (
            <form
              id="express-checkout-form"
              onSubmit={handlePlaceOrder}
              className="space-y-5"
            >
              {/* Compact Order Items Preview */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Order Items ({summary.totalItems})</span>
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="font-medium text-[#0F172A] underline underline-offset-2 hover:text-[#B45309]"
                  >
                    Edit cart
                  </button>
                </div>
                <ul className="mt-3 space-y-2 text-xs text-slate-600">
                  {items.map(({ product, quantity }) => (
                    <li
                      key={product.id}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="truncate">
                        {quantity} × {product.name}
                      </span>
                      <span className="shrink-0 font-medium text-[#0F172A] tabular-nums">
                        $
                        {(
                          (Math.round(product.price * 100) * quantity) /
                          100
                        ).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shipping Address Inputs */}
              <div className="space-y-3.5">
                <h3 className="font-display text-sm font-bold text-[#0F172A]">
                  Shipping Details
                </h3>

                <div>
                  <label
                    htmlFor="checkout-name"
                    className="block text-xs font-medium text-slate-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    placeholder="Jordan Taylor"
                    className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-[#0F172A] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-street"
                    className="block text-xs font-medium text-slate-700"
                  >
                    Street Address
                  </label>
                  <input
                    id="checkout-street"
                    type="text"
                    required
                    value={streetAddress}
                    onChange={(e) => {
                      setStreetAddress(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    placeholder="742 Evergreen Terrace, Apt 4B"
                    className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-[#0F172A] focus:outline-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-city"
                    className="block text-xs font-medium text-slate-700"
                  >
                    City, State &amp; Postal Code
                  </label>
                  <input
                    id="checkout-city"
                    type="text"
                    required
                    value={cityPostal}
                    onChange={(e) => {
                      setCityPostal(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    placeholder="Seattle, WA 98101"
                    className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-[#0F172A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2.5">
                <h3 className="font-display text-sm font-bold text-[#0F172A]">
                  Payment Method
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    aria-pressed={paymentMethod === 'card'}
                    className={`flex h-11 items-center justify-center gap-2 rounded-lg border px-3 text-xs font-semibold transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-[#0F172A] bg-[#0F172A] text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="h-4 w-4" aria-hidden="true" />
                    <span>Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    aria-pressed={paymentMethod === 'cod'}
                    className={`flex h-11 items-center justify-center gap-2 rounded-lg border px-3 text-xs font-semibold transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-[#0F172A] bg-[#0F172A] text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Truck className="h-4 w-4" aria-hidden="true" />
                    <span>Cash on Delivery</span>
                  </button>
                </div>
              </div>

              {formError && (
                <p role="alert" className="text-xs font-medium text-rose-700">
                  {formError}
                </p>
              )}
            </form>
          ) : (
            <ul className="divide-y divide-slate-200">
              {items.map((item) => {
                const { product, quantity } = item;
                const lineTotal =
                  (Math.round(product.price * 100) * quantity) / 100;
                const isAtMaxQuantity = quantity >= MAX_ITEM_QUANTITY;

                return (
                  <li key={product.id} className="flex gap-4 py-4 first:pt-0">
                    <button
                      type="button"
                      onClick={() => handleNavigateToProduct(product)}
                      className="h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-[#EBF0F4]"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </button>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 text-sm font-semibold text-[#0F172A]">
                          <button
                            type="button"
                            onClick={() => handleNavigateToProduct(product)}
                            className="text-left hover:underline"
                          >
                            {product.name}
                          </button>
                        </h3>
                        <span className="shrink-0 font-display text-sm font-bold text-[#0F172A] tabular-nums">
                          ${lineTotal.toFixed(2)}
                        </span>
                      </div>

                      <p className="mt-0.5 text-xs text-slate-500 tabular-nums">
                        <span>{product.brand}</span>
                        <span className="mx-1.5" aria-hidden="true">
                          ·
                        </span>
                        <span>${product.price.toFixed(2)} each</span>
                      </p>

                      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                        <div className="flex h-8 items-center rounded-md border border-slate-200 bg-slate-50">
                          <button
                            type="button"
                            onClick={() => handleDecreaseQuantity(item)}
                            aria-label={
                              quantity === 1
                                ? `Remove ${product.name} from cart`
                                : `Decrease quantity of ${product.name}`
                            }
                            className="flex h-full w-8 items-center justify-center rounded-l-md text-slate-600 hover:bg-slate-200/70 hover:text-[#0F172A] transition-colors"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span
                            aria-label={`Quantity ${quantity}`}
                            className="w-8 text-center font-mono text-xs font-semibold text-[#0F172A] tabular-nums"
                          >
                            {quantity}
                          </span>
                          <button
                            type="button"
                            disabled={isAtMaxQuantity}
                            onClick={() => handleIncreaseQuantity(item)}
                            aria-label={`Increase quantity of ${product.name}`}
                            className="flex h-full w-8 items-center justify-center rounded-r-md text-slate-600 hover:bg-slate-200/70 hover:text-[#0F172A] disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveWithUndo(item)}
                          aria-label={`Remove ${product.name} from cart`}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-700 transition-colors whitespace-nowrap"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Drawer Footer Summary */}
        {items.length > 0 && !orderConfirmation && (
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-5">
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <dt>
                  Subtotal ({summary.totalItems}{' '}
                  {summary.totalItems === 1 ? 'item' : 'items'})
                </dt>
                <dd className="font-medium text-[#0F172A] tabular-nums">
                  ${summary.subtotal.toFixed(2)}
                </dd>
              </div>

              {summary.totalSavings > 0 && (
                <div className="flex items-center justify-between text-emerald-700">
                  <dt>You Save</dt>
                  <dd className="font-medium tabular-nums">
                    -${summary.totalSavings.toFixed(2)}
                  </dd>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-600">
                <dt>Shipping</dt>
                <dd className="font-medium text-[#0F172A] tabular-nums">
                  {summary.shipping === 0 ? (
                    <span className="text-emerald-700">Free</span>
                  ) : (
                    `$${summary.shipping.toFixed(2)}`
                  )}
                </dd>
              </div>

              <div className="flex items-center justify-between text-slate-600">
                <dt>Estimated Tax (8%)</dt>
                <dd className="font-medium text-[#0F172A] tabular-nums">
                  ${summary.estimatedTax.toFixed(2)}
                </dd>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-2.5 text-base font-bold text-[#0F172A]">
                <dt>Grand Total</dt>
                <dd className="font-display tabular-nums">
                  ${summary.grandTotal.toFixed(2)}
                </dd>
              </div>
            </dl>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-[#F59E0B] px-6 text-sm font-semibold text-[#0F172A] hover:bg-[#D97706] active:scale-[0.99] transition-all"
              >
                Proceed to Checkout — ${summary.grandTotal.toFixed(2)}
              </button>
            ) : (
              <button
                type="submit"
                form="express-checkout-form"
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#F59E0B] px-6 text-sm font-semibold text-[#0F172A] hover:bg-[#D97706] active:scale-[0.99] transition-all"
              >
                <Lock className="h-4 w-4" aria-hidden="true" />
                <span>Place Order — ${summary.grandTotal.toFixed(2)}</span>
              </button>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
