import { useState } from 'react';
import { ArrowRight, Package } from 'lucide-react';
import { HERO_IMAGE } from '../data/catalog';

interface HeroBannerProps {
  onShopNowClick: () => void;
  onBrowseCategoriesClick: () => void;
}

export function HeroBanner({
  onShopNowClick,
  onBrowseCategoriesClick,
}: HeroBannerProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <section
      aria-label="Featured seasonal storefront"
      className="bg-[#0B1220] text-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0F172A]">
          {/* Background Editorial Photograph */}
          <div className="relative min-h-[380px] w-full sm:min-h-[430px] lg:aspect-[16/7] lg:min-h-[460px]">
            {!imageError ? (
              <img
                src={HERO_IMAGE}
                alt="Curated ShopSphere collection featuring wireless headphones, stainless steel coffee brewer, and laptop on a dark stone console"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-end bg-gradient-to-br from-[#0F172A] via-[#16233C] to-[#1E293B] pr-12">
                <Package className="h-28 w-28 text-white/10" aria-hidden="true" />
              </div>
            )}

            {/* Measured contrast scrim ensuring > 7:1 WCAG AA contrast for headline copy */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/95 via-[#0B1220]/75 to-[#0B1220]/20 sm:via-[#0B1220]/65"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/80 via-transparent to-transparent sm:hidden"
              aria-hidden="true"
            />

            {/* Hero Foreground Copy */}
            <div className="relative z-10 flex h-full min-h-[380px] flex-col justify-center px-6 py-10 sm:min-h-[430px] sm:px-10 lg:min-h-[460px] lg:max-w-2xl lg:px-14">
              <p className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium tracking-wide text-slate-300 sm:text-sm">
                <span>Curated Everyday Marketplace</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#FBBF24]">Free Two-Day Delivery Over $75</span>
              </p>

              <h1
                className="font-display text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-5xl"
                style={{ textWrap: 'balance' }}
              >
                Everyday essentials, engineered to last.
              </h1>

              <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-200 sm:text-base">
                Shop precision audio, countertop espresso gear, ergonomic desk
                hardware, and durable commuter carry — handpicked for daily
                reliability and fast doorstep shipping.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={onShopNowClick}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#F59E0B] px-6 text-sm font-semibold text-[#0F172A] shadow-sm hover:bg-[#D97706] active:scale-[0.99] transition-all duration-150 whitespace-nowrap shrink-0"
                >
                  <span>Shop Featured Collection</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={onBrowseCategoriesClick}
                  className="inline-flex h-11 items-center text-sm font-medium text-slate-200 underline decoration-white/30 underline-offset-4 hover:text-white hover:decoration-[#F59E0B] transition-colors duration-150 whitespace-nowrap shrink-0"
                >
                  Browse by Category
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
