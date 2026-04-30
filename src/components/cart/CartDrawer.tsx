import { Link } from "react-router-dom";
import { Plus, Minus, X, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/data/store";
import { useTranslation } from 'react-i18next';

export const CartDrawer = () => {
  const { items, isOpen, setOpen, setQty, remove, subtotal, count } = useCart();
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-5 border-b">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="w-5 h-5 text-primary" />
            {t('cart.title')}
            <span className="text-sm font-normal text-muted-foreground">
              ({t('cart.count', { count })})
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 grid place-items-center p-8 text-center">
            <div>
              <div className="w-20 h-20 rounded-full bg-muted grid place-items-center mx-auto mb-4">
                <ShoppingBag className="w-9 h-9 text-muted-foreground" />
              </div>
              <p className="font-semibold mb-1">{t('cart.empty_title')}</p>
              <p className="text-sm text-muted-foreground mb-5">{t('cart.empty_sub')}</p>
              <Button onClick={() => setOpen(false)} className="gradient-hero">
                {t('cart.browse')}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-3 p-3 rounded-xl border bg-card hover:shadow-soft transition-smooth">
                  <img src={product.image} alt={product.name} className="w-20 h-20 rounded-lg object-cover bg-muted" loading="lazy" />
                  <div className="flex-1 min-w-0">

                    {/* ✅ X is on the left in Arabic, right in French */}
                    <div className="flex items-start justify-between gap-2">
                      {isAr ? (
                        <>
                          <button
                            onClick={() => remove(product.id)}
                            className="text-muted-foreground hover:text-destructive transition-smooth shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <h4 className="font-semibold text-sm leading-tight line-clamp-2 text-right flex-1">
                            {product.name}
                          </h4>
                        </>
                      ) : (
                        <>
                          <h4 className="font-semibold text-sm leading-tight line-clamp-2 flex-1">
                            {product.name}
                          </h4>
                          <button
                            onClick={() => remove(product.id)}
                            className="text-muted-foreground hover:text-destructive transition-smooth shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>

                    <div className="text-secondary font-bold mt-1">{formatPrice(product.price)}</div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 bg-muted rounded-full p-1">
                        <button
                          onClick={() => setQty(product.id, qty - 1)}
                          className="w-7 h-7 rounded-full bg-background hover:bg-primary hover:text-primary-foreground grid place-items-center transition-smooth"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold">{qty}</span>
                        <button
                          onClick={() => setQty(product.id, qty + 1)}
                          className="w-7 h-7 rounded-full bg-background hover:bg-primary hover:text-primary-foreground grid place-items-center transition-smooth"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-sm font-semibold">{formatPrice(qty * product.price)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-5 space-y-4 bg-muted/30">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                <span className="font-bold text-lg text-primary">{formatPrice(subtotal)}</span>
              </div>
              <div className="text-xs text-muted-foreground">{t('cart.shipping_note')}</div>
              <Link to="/checkout" onClick={() => setOpen(false)}>
                <Button className="w-full h-12 gradient-cta text-base font-bold shadow-card">
                  {t('cart.checkout')}
                </Button>
              </Link>
              <Button variant="ghost" onClick={() => setOpen(false)} className="w-full">
                {t('cart.continue')}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};