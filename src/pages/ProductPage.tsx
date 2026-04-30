import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Plus, Minus, ShoppingCart, Check, Truck, ShieldCheck, RotateCw } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/data/store";
import type { Category, Product } from "@/data/store";
import { getProduct, getCategoryBySlug, getProductsByCategory } from "@/lib/store-api";
import { useCart } from "@/store/cart";
import { ProductCard } from "@/components/product/ProductCard";
import { useTranslation } from 'react-i18next';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [category, setCategory] = useState<Category | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const { add, setOpen } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!id) return;
    setProduct(undefined);
    setCategory(null);
    setRelated([]);

    getProduct(id).then(async (prod) => {
      setProduct(prod);
      if (!prod) return;

      const [cat, rels] = await Promise.all([
        getCategoryBySlug(prod.categoryId),
        getProductsByCategory(prod.categoryId),
      ]);
      setCategory(cat);
      setRelated(rels.filter((p) => p.id !== prod.id).slice(0, 4));
    });
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Loading
  if (product === undefined) {
    return (
      <Layout>
        <div className="container py-20 text-center text-muted-foreground">
          {t('product.loading')}
        </div>
      </Layout>
    );
  }

  // Not found
  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold">{t('product.not_found')}</h1>
          <Link to="/collections" className="text-primary mt-4 inline-block">
            {t('product.back_collections')}
          </Link>
        </div>
      </Layout>
    );
  }

  const features = [
    { icon: Truck,       label: t('product.fast_delivery') },
    { icon: ShieldCheck, label: t('product.quality_guarantee') },
    { icon: RotateCw,    label: t('product.free_return') },
  ];

  return (
    <Layout>
      <section className="container py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-primary">{t('nav.home')}</Link>
          <span>/</span>
          {category && (
            <>
              <Link to={`/collections/${category.id}`} className="hover:text-primary">{category.name}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground font-semibold line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-card rounded-3xl overflow-hidden shadow-card">
            <div className="aspect-square bg-muted">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="space-y-6">
            {category && (
              <Link to={`/collections/${category.id}`} className="inline-block text-sm text-accent font-bold uppercase tracking-wider">
                {category.name}
              </Link>
            )}
            <h1 className="text-3xl md:text-4xl font-extrabold text-primary">{product.name}</h1>
            <p className="text-muted-foreground">{product.nameEn}</p>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-secondary">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
                  <span className="px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-bold">
                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <p className="text-foreground/80 leading-relaxed">{t('product.description')}</p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 bg-muted rounded-full p-1.5">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-full bg-background hover:bg-primary hover:text-primary-foreground grid place-items-center transition-smooth"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-9 h-9 rounded-full bg-background hover:bg-primary hover:text-primary-foreground grid place-items-center transition-smooth"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <Button onClick={handleAdd} className="flex-1 h-12 gradient-cta font-bold">
                {added
                  ? <><Check className="w-5 h-5" /> {t('product.added')}</>
                  : <><ShoppingCart className="w-5 h-5" /> {t('product.add_to_cart')}</>
                }
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={() => { add(product, qty); setOpen(true); }}
              className="w-full h-12 font-bold border-2"
            >
              {t('product.buy_now')}
            </Button>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t">
              {features.map((f) => (
                <div key={f.label} className="text-center">
                  <div className="w-10 h-10 rounded-full bg-muted text-primary mx-auto grid place-items-center mb-1.5">
                    <f.icon className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-semibold">{f.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-extrabold text-primary mb-6">{t('product.related')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default ProductPage;