  import { Link, useNavigate } from "react-router-dom";
  import { useState } from "react";
  import { CheckCircle2, CreditCard, MapPin, User, Truck } from "lucide-react";
  import { Layout } from "@/components/layout/Layout";
  import { Button } from "@/components/ui/button";
  import { Input } from "@/components/ui/input";
  import { useCart } from "@/store/cart";
  import { formatPrice } from "@/data/store";
  import { toast } from "sonner";
  import { useTranslation } from 'react-i18next';

  const WHATSAPP_NUMBER = '212611099824';

  const Checkout = () => {
    const { items, subtotal, clear } = useCart();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [form, setForm] = useState({ name: "", phone: "", city: "", address: "", notes: "" });
    const [loading, setLoading] = useState(false);

    const shipping = subtotal > 200 ? 0 : 25;
    const total = subtotal ;

    if (items.length === 0) {
      return (
        <Layout>
          <div className="container py-20 text-center">
            <h1 className="text-2xl font-bold mb-3">{t('checkout.empty_cart')}</h1>
            <Link to="/collections">
              <Button className="gradient-hero">{t('checkout.shop_now')}</Button>
            </Link>
          </div>
        </Layout>
      );
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.name || !form.phone || !form.city || !form.address) {
        toast.error(t('checkout.fill_fields'));
        return;
      }
      setLoading(true);

      const orderLines = items
        .map(({ product, qty }) => `• ${product.name} × ${qty} — ${formatPrice(product.price * qty)}`)
        .join('\n');

      const message = `
  🛒 *${t('checkout.whatsapp_title')}*

  👤 *${t('checkout.name')}* ${form.name}
  📞 *${t('checkout.phone')}* ${form.phone}
  🏙️ *${t('checkout.city')}* ${form.city}
  📍 *${t('checkout.address')}* ${form.address}
  ${form.notes ? `📝 *${t('checkout.notes')}* ${form.notes}` : ''}

  *${t('checkout.products')}*
  ${orderLines}

  💰 *${t('checkout.subtotal')}* ${formatPrice(subtotal)}
  🚚 *${t('checkout.shipping')}* ${shipping === 0 ? t('checkout.free') : formatPrice(shipping)}
  ✅ *${t('checkout.total')}* ${formatPrice(total)}

  💳 *${t('checkout.payment')}* ${t('checkout.cod')}
      `.trim();

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      setTimeout(() => {
        toast.success(t('checkout.success'));
        clear();
        window.open(url, '_blank');
        navigate("/");
      }, 1200);
    };

    return (
      <Layout>
        <section className="container py-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-primary">{t('checkout.title')}</h1>
            <p className="text-muted-foreground mt-2">{t('checkout.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-5">

              {/* Step 1 — Customer Info */}
              <div className="bg-card rounded-2xl border shadow-soft p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full gradient-hero text-primary-foreground grid place-items-center font-bold">1</div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" /> {t('checkout.customer_info')}
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    placeholder={t('checkout.name')}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                  <Input
                    placeholder={t('checkout.phone')}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                  <Input
                    placeholder={t('checkout.city')}
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                  <Input
                    placeholder={t('checkout.address')}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>

              {/* Step 2 — Shipping */}
              {/* <div className="bg-card rounded-2xl border shadow-soft p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full gradient-hero text-primary-foreground grid place-items-center font-bold">2</div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary" /> {t('checkout.shipping')}
                  </h2>
                </div>
                <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <div className="font-bold">{t('checkout.standard_delivery')}</div>
                    <div className="text-sm text-muted-foreground">{t('checkout.delivery_time')}</div>
                  </div>
                  <div className="font-bold">{shipping === 0 ? t('checkout.free') : formatPrice(shipping)}</div>
                </div>
              </div> */}

              {/* Step 3 — Payment */}
              <div className="bg-card rounded-2xl border shadow-soft p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full gradient-hero text-primary-foreground grid place-items-center font-bold">2</div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" /> {t('checkout.payment')}
                  </h2>
                </div>
                <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 flex items-center gap-3 mb-4">
                  <div className="w-5 h-5 rounded-full border-4 border-primary" />
                  <div className="font-semibold">{t('checkout.cod')}</div>
                </div>
                <textarea
                  placeholder={t('checkout.notes')}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl bg-muted border-0 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>
            </div>

            {/* Summary */}
            <aside className="lg:col-span-1">
              <div className="bg-card rounded-2xl border shadow-card p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" /> {t('checkout.summary')}
                </h2>

                <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                  {items.map(({ product, qty }) => (
                    <div key={product.id} className="flex gap-3">
                      <div className="relative">
                        <img src={product.image} alt={product.name} className="w-14 h-14 rounded-lg object-cover bg-muted" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold grid place-items-center">{qty}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm line-clamp-2">{product.name}</div>
                        <div className="text-secondary font-bold text-sm">{formatPrice(product.price * qty)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 py-4 border-y text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('checkout.subtotal')}</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('checkout.shipping')}</span>
                    <span className="font-semibold">{shipping === 0 ? t('checkout.free') : formatPrice(shipping)}</span>
                  </div> */}
                </div>

                <div className="flex justify-between items-baseline pt-4 mb-5">
                  <span className="font-bold">{t('checkout.total')}</span>
                  <span className="text-2xl font-extrabold text-primary">{formatPrice(total)}</span>
                </div>

                <Button type="submit" disabled={loading} className="w-full h-12 gradient-cta font-bold text-base shadow-card">
                  {loading ? t('checkout.processing') : t('checkout.confirm')}
                </Button>
                <Link to="/collections" className="block text-center text-sm text-muted-foreground mt-3 hover:text-primary">
                  {t('checkout.continue')}
                </Link>
              </div>
            </aside>
          </form>
        </section>
      </Layout>
    );
  };

  export default Checkout;