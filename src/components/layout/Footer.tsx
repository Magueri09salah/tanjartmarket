import { Link } from "react-router-dom";
import { Facebook, Instagram, Phone, Mail, MapPin, ShoppingCart } from "lucide-react";
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export const Footer = () => {

   const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

   return (
    <>
      <footer
        dir={isRTL ? "rtl" : "ltr"}
        className="mt-20 bg-primary text-primary-foreground"
      >
        <div className="container py-14 grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              {/* <img
                src="/tanjarmarket.png"
                alt="Tanjartmarket logo"
                className="w-16 h-16 object-contain"
              /> */}
              <ShoppingCart color="#fff" />
              <div className="font-extrabold text-xl">Tanjartmarket</div>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              {/* أول منصة إلكترونية لبيع المواد الغذائية في المغرب. حانوتك ف تيليفونك. */}
              {t('home.hero_badge')}
            </p>
            <div className="flex gap-3 mt-5">
              <a className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground grid place-items-center transition-smooth" href="#"><Facebook className="w-4 h-4" /></a>
              <a className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-accent-foreground grid place-items-center transition-smooth" href="#"><Instagram className="w-4 h-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-accent">{t('footer.about')}</h4>
            <ul className="space-y-2.5 text-sm text-primary-foreground/80">
              <li><Link to="/contact" className="hover:text-accent">{t('footer.who')}</Link></li>
              <li><Link to="/contact" className="hover:text-accent">{t('footer.payment_method')}</Link></li>
              <li><Link to="/contact" className="hover:text-accent">{t('footer.shipping')}</Link></li>
              <li><Link to="/contact" className="hover:text-accent">{t('footer.faq')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-accent">{t('footer.terms')}</h4>
            <ul className="space-y-2.5 text-sm text-primary-foreground/80">
              <li><a className="hover:text-accent" href="#">{t('footer.terms')}</a></li>
              <li><a className="hover:text-accent" href="#">{t('footer.returns')}</a></li>
              <li><a className="hover:text-accent" href="#">سياسة الخصوصية</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-accent">{t('footer.contact')}</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-accent" /><span dir="ltr" style={{ unicodeBidi: "isolate" }}>
  +212 6 11 09 98 24
</span></li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-accent" /> contact@tanjartmarket.com</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" />  {t('contact.address_value')}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10">
          <div className="container py-5 text-center text-xs text-primary-foreground/60">
            © {new Date().getFullYear()} Tanjartmarket — جميع الحقوق محفوظة.
          </div>
        </div>
      </footer>
    </>
   );
};
