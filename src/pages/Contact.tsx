import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('contact.success'));
    (e.target as HTMLFormElement).reset();
  };

  const cards = [
    { icon: Phone, title: t('contact.call'), value: "+212 6 11 09 98 24" },
    { icon: Mail, title: t('contact.email'), value: "contact@tanjartmarket.com" },
    { icon: MapPin, title: t('contact.address'), value: t('contact.address_value') },
  ];

  return (
    <Layout>
      <section className="gradient-hero text-primary-foreground py-16">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold">{t('contact.title')}</h1>
          <p className="text-primary-foreground/80 mt-3">{t('contact.subtitle')}</p>
        </div>
      </section>

      <section className="container py-14 grid md:grid-cols-3 gap-8">
{cards.map((c, i) => (
  <div key={c.title} className="bg-card rounded-2xl border shadow-soft p-6 text-center hover:shadow-elegant transition-smooth">
    <div className="w-14 h-14 rounded-2xl gradient-hero text-primary-foreground grid place-items-center mx-auto mb-4">
      <c.icon className="w-6 h-6" />
    </div>
    <h3 className="font-bold mb-1">{c.title}</h3>
    <p className="text-muted-foreground">
      {i === 0 ? (
        <span dir="ltr" style={{ unicodeBidi: "isolate" }}>
          {c.value}
        </span>
      ) : (
        c.value
      )}
    </p>
  </div>
))}
      </section>

      <section className="container pb-16">
        <div className="bg-card rounded-3xl border shadow-card p-6 md:p-10 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl gradient-cta text-secondary-foreground grid place-items-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold">{t('contact.form_title')}</h2>
              <p className="text-sm text-muted-foreground">{t('contact.form_subtitle')}</p>
            </div>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input placeholder={t('contact.full_name')} required className="h-12 rounded-xl" />
              <Input type="email" placeholder={t('contact.email_placeholder')} required className="h-12 rounded-xl" />
            </div>
            <Input placeholder={t('contact.subject')} required className="h-12 rounded-xl" />
            <textarea
              required
              placeholder={t('contact.message')}
              rows={5}
              className="w-full rounded-xl bg-muted border-0 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
            <Button className="w-full h-12 gradient-cta font-bold">
              <Send className="w-4 h-4 mr-2" />
              {t('contact.send')}
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;