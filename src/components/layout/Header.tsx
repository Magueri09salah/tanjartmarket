import { Link } from "react-router-dom";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Download } from 'lucide-react';

export const Header = () => {
  const { count, setOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useTranslation(); 
  const { canInstall, install } = usePWAInstall();

  const nav = [ 
    { to: "/", label: t('nav.home') },
    { to: "/collections", label: t('nav.collections') },
    { to: "/contact", label: t('nav.contact') },
  ];

  return (
    <>
      {/* Promo strip */}
      <div className="gradient-hero text-primary-foreground py-2 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee gap-12 text-sm font-medium">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-12 shrink-0">
              <span>🎉 {t('promo.free_delivery')}</span>
              <span>🚚 {t('promo.fast_delivery')}</span>
              <span>💎 {t('promo.best_prices')}</span>
              <span>🛒 {t('promo.products')}</span>
            </div>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-lg border-b border-border/60">
        <div className="container flex items-center justify-between h-16 md:h-20 gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            {/* <div className="w-10 h-10 rounded-xl gradient-hero grid place-items-center shadow-glow group-hover:scale-105 transition-spring"> */}
              <img
                src="/tanjarmarket.png"
                alt="Tanjartmarket logo"
                className="w-16 h-16 object-contain"
              />

            {/* </div> */}
            <div className="leading-tight">
              <div className="font-extrabold text-lg text-primary">Tanjartmarket</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Store 2025</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-foreground/80 hover:text-primary hover:bg-muted transition-smooth"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder={t('nav.search')}
                className="w-full h-10 rounded-full bg-muted pr-10 pl-4 text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-smooth"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={t('nav.menu')}
            >
              {mobileOpen ? <X /> : <Menu />}
            </Button>

            <button
              onClick={() => setOpen(true)}
              className="relative flex items-center gap-2 h-11 px-4 rounded-full gradient-cta text-secondary-foreground font-semibold shadow-card hover:shadow-elegant transition-smooth"
              aria-label={t('nav.cart')}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">{t('nav.cart')}</span>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-accent text-accent-foreground text-[11px] font-bold grid place-items-center shadow">
                  {count}
                </span>
              )}
            </button>

            {canInstall && (
              <button
                onClick={install}
                className="flex items-center gap-2 h-9 px-3 rounded-full border border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-smooth"
                title={t('pwa.install')}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{t('pwa.install')}</span>
              </button>
            )}

            <LanguageSwitcher />
          </div>
        </div>

        {/* mobile nav */}
        <div className={cn("md:hidden border-t border-border overflow-hidden transition-all", mobileOpen ? "max-h-96" : "max-h-0")}>
          <div className="container py-3 flex flex-col gap-1">
            <div className="relative mb-2">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input placeholder={t('nav.search')} className="w-full h-10 rounded-full bg-muted pr-10 pl-4 text-sm outline-none" />
            </div>
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-lg font-semibold hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>
        </div>
      </header>
    </>
  );
};