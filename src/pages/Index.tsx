import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Truck, ShieldCheck, Clock, Sparkles, ArrowLeft } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { CategoryCard } from "@/components/category/CategoryCard";
import { ProductCard } from "@/components/product/ProductCard";
import { getCategories, getProductsByCategory } from "@/lib/store-api";
import type { Category, Product } from "@/data/store";
import hero from "@/assets/hero-grocery.jpg";
import { useTranslation } from 'react-i18next';

const Index = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [offers, setOffers]         = useState<Product[]>([]);
  const [loading, setLoading]       = useState(true);
  const { t } = useTranslation();

  const features = [
    { icon: Truck,       title: t('home.feature_delivery'),  desc: t('home.feature_delivery_desc') },
    { icon: ShieldCheck, title: t('home.feature_original'),  desc: t('home.feature_original_desc') },
    { icon: Clock,       title: t('home.feature_support'),   desc: t('home.feature_support_desc') },
    { icon: Sparkles,    title: t('home.feature_prices'),    desc: t('home.feature_prices_desc') },
  ];

  useEffect(() => {
    Promise.all([getCategories(), getProductsByCategory("offers")])
      .then(([cats, prods]) => { setCategories(cats); setOffers(prods); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, hsl(var(--accent)) 0%, transparent 40%)" }} />

        <div className="container relative py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="text-primary-foreground space-y-6 animate-fade-up text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 text-sm font-medium">
              <Sparkles className="w-4 h-4 text-accent" />
              {t('home.hero_badge')}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              {t('home.hero_title')}<br />
              <span className="text-accent">{t('home.hero_title2')}</span>
            </h1>
            <p className="text-lg text-primary-foreground/85 max-w-md mx-auto md:mx-0">
              {t('home.hero_sub')}
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link to="/collections" className="inline-flex items-center gap-2 h-12 px-7 rounded-full gradient-gold text-accent-foreground font-bold shadow-glow hover:scale-105 transition-spring">
                {t('home.shop_now')} <ArrowLeft className="w-4 h-4" />
              </Link>
              <a href="#categories" className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-primary-foreground/10 backdrop-blur border border-primary-foreground/30 text-primary-foreground font-semibold hover:bg-primary-foreground/20 transition-smooth">
                {t('home.categories')}
              </a>
            </div>

            <div className="flex gap-6 pt-4 justify-center md:justify-start">
              <div><div className="text-2xl font-extrabold text-accent">+1000</div><div className="text-xs text-primary-foreground/70">{t('home.stat_products')}</div></div>
              <div className="w-px bg-primary-foreground/20" />
              <div><div className="text-2xl font-extrabold text-accent">+5000</div><div className="text-xs text-primary-foreground/70">{t('home.stat_customers')}</div></div>
              <div className="w-px bg-primary-foreground/20" />
              <div><div className="text-2xl font-extrabold text-accent">24h</div><div className="text-xs text-primary-foreground/70">{t('home.stat_delivery')}</div></div>
            </div>
          </div>

          <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="absolute -inset-6 gradient-gold opacity-30 blur-3xl rounded-full animate-float" />
            <img src={hero} alt="Tanjartmarket" width={1600} height={800} className="relative rounded-3xl shadow-elegant w-full aspect-[4/3] object-cover" />
            <div className="absolute -bottom-5 -left-5 md:-left-8 bg-card rounded-2xl shadow-elegant p-4 flex items-center gap-3 animate-float" style={{ animationDelay: "1s" }}>
              <div className="w-12 h-12 rounded-full gradient-gold grid place-items-center">
                <Truck className="w-6 h-6 text-accent-foreground" />
              </div>
              {/* <div>
                <div className="text-xs text-muted-foreground">{t('home.free_delivery')}</div>
                <div className="font-bold text-sm">{t('home.free_delivery_min')}</div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container -mt-8 relative z-10">
        <div className="bg-card rounded-2xl shadow-elegant p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-smooth">
              <div className="w-12 h-12 rounded-xl gradient-hero text-primary-foreground grid place-items-center shrink-0">
                <f.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-sm">{f.title}</div>
                <div className="text-xs text-muted-foreground">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="container py-16 md:py-20">
        <div className="text-center mb-10">
          <div className="text-sm font-bold text-accent uppercase tracking-wider mb-2">{t('home.browse_by_category')}</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary">{t('home.our_categories')}</h2>
          <p className="text-muted-foreground mt-2">{t('home.categories_sub')}</p>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-muted animate-pulse aspect-square" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {categories.map((c) => <CategoryCard key={c.id} category={c} />)}
          </div>
        )}
      </section>

      {/* DAILY OFFERS */}
      <section className="container py-12 md:py-16">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-sm font-bold text-secondary uppercase tracking-wider mb-2">{t('home.exclusive_deals')}</div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary">{t('home.daily_offers')}</h2>
            <p className="text-muted-foreground mt-2">{t('home.limited')}</p>
          </div>
          <Link to="/collections/offers" className="hidden md:inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
            {t('home.view_all')} <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-muted animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {offers.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* CTA BANNER */}
      {/* <section className="container pb-16">
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-12 text-primary-foreground">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl md:text-4xl font-extrabold mb-3">{t('home.cta_title')}</h3>
              <p className="text-primary-foreground/80 mb-6">{t('home.cta_sub')}</p>
              <Link to="/collections" className="inline-flex h-12 px-7 rounded-full gradient-gold text-accent-foreground font-bold items-center gap-2 hover:scale-105 transition-spring">
                {t('home.cta_btn')}
              </Link>
            </div>
            <div className="text-center md:text-left">
              <div className="text-6xl md:text-8xl font-extrabold text-accent">10%</div>
              <div className="text-lg font-semibold">{t('home.cta_discount')}</div>
            </div>
          </div>
        </div>
      </section> */}
    </Layout>
  );
};

export default Index;