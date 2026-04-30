import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/product/ProductCard";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/store-api";
import type { Category, Product } from "@/data/store";
import { useTranslation } from 'react-i18next';

type SortKey = "newest" | "price-asc" | "price-desc" | "az";

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>("newest");
  const { t } = useTranslation();

  // Defined inside component so t() is available
  const sortLabels: Record<SortKey, string> = {
    newest:       t('category.sort_newest'),
    "price-asc":  t('category.sort_price_asc'),
    "price-desc": t('category.sort_price_desc'),
    az:           t('category.sort_az'),
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([getCategoryBySlug(id), getProductsByCategory(id)])
      .then(([cat, prods]) => { setCategory(cat); setProducts(prods); })
      .finally(() => setLoading(false));
  }, [id]);

  const list = useMemo(() => {
    const arr = [...products];
    if (sort === "price-asc")  arr.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") arr.sort((a, b) => b.price - a.price);
    if (sort === "az")         arr.sort((a, b) => a.name.localeCompare(b.name, "ar"));
    return arr;
  }, [products, sort]);

  return (
    <Layout>
      <section className="bg-muted/40 border-b">
        <div className="container py-8">
          <nav className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
            <Link to="/" className="hover:text-primary">{t('nav.home')}</Link>
            <span>/</span>
            <Link to="/collections" className="hover:text-primary">{t('nav.collections')}</Link>
            <span>/</span>
            <span className="text-foreground font-semibold">{category?.name ?? id}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary">
            {loading ? "..." : category?.name ?? t('category.all_products')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {loading ? "" : t('category.product_count', { count: list.length })}
          </p>
        </div>
      </section>

      <section className="container py-8">
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SlidersHorizontal className="w-4 h-4" />
            {t('category.sort_by')}
          </div>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="appearance-none h-10 pr-10 pl-4 rounded-full bg-card border border-border font-semibold text-sm cursor-pointer outline-none focus:ring-2 focus:ring-primary/30"
            >
              {Object.entries(sortLabels).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-muted animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            {t('category.empty')}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default CategoryPage;