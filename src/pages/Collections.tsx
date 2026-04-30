import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { CategoryCard } from "@/components/category/CategoryCard";
import { getCategories } from "@/lib/store-api";
import type { Category } from "@/data/store";
import { useTranslation } from 'react-i18next';

const Collections = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    getCategories().then(setCategories).finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <section className="container py-12 md:py-16">
        <div className="text-center mb-10">
          <div className="text-sm font-bold text-accent uppercase tracking-wider mb-2">
            {t('collections.badge')}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary">
            {t('collections.title')}
          </h1>
          <p className="text-muted-foreground mt-2">{t('collections.subtitle')}</p>
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
    </Layout>
  );
};

export default Collections;