import { Link } from "react-router-dom";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { Product, formatPrice } from "@/data/store";
import { useCart } from "@/store/cart";
import { cn } from "@/lib/utils";
import { useTranslation } from 'react-i18next';

const badgeStyle: Record<NonNullable<Product["badge"]>, string> = {
  sale: "bg-destructive text-destructive-foreground",
  new: "bg-success text-success-foreground",
  hot: "gradient-gold text-accent-foreground",
};

export const ProductCard = ({ product }: { product: Product }) => {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const { t } = useTranslation();

  const badgeLabel: Record<NonNullable<Product["badge"]>, string> = {
    sale: t('badges.sale'),
    new:  t('badges.new'),
    hot:  t('badges.hot'),
  };

  const handleAdd = () => {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <article className="group relative bg-card rounded-2xl border border-border/60 overflow-hidden hover:shadow-elegant transition-spring hover:-translate-y-1">
      {product.badge && (
        <span className={cn("absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-card", badgeStyle[product.badge])}>
          {badgeLabel[product.badge]}
        </span>
      )}

      <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={600}
          height={600}
          className="w-full h-full object-cover group-hover:scale-110 transition-spring"
        />
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 min-h-[2.5rem] hover:text-primary transition-smooth">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-secondary font-extrabold text-lg">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>

        <button
          onClick={handleAdd}
          className={cn(
            "mt-3 w-full h-10 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-spring",
            added
              ? "bg-success text-success-foreground"
              : "bg-muted text-foreground hover:gradient-cta hover:text-secondary-foreground hover:shadow-card",
          )}
        >
          {added ? (
            <><Check className="w-4 h-4" /> {t('product.added')}</>
          ) : (
            <><Plus className="w-4 h-4" /> {t('product.add_to_cart')}</>
          )}
        </button>
      </div>
    </article>
  );
};