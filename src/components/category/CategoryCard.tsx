import { Link } from "react-router-dom";
import { Category } from "@/data/store";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from 'react-i18next';

export const CategoryCard = ({ category }: { category: Category }) => {
  const { t } = useTranslation();

  return (
    <Link
      to={`/collections/${category.id}`}
      className="group relative block rounded-2xl overflow-hidden bg-card shadow-soft hover:shadow-elegant transition-spring"
    >
      <div className="aspect-square gradient-card relative overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          width={600}
          height={600}
          className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 group-hover:opacity-100 transition-spring"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
        <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-accent/95 text-accent-foreground text-xs font-bold backdrop-blur">
          {t('category.count', { count: category.count })}
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base group-hover:text-primary transition-smooth">{category.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{category.nameEn}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-muted group-hover:gradient-hero group-hover:text-primary-foreground grid place-items-center transition-spring">
          <ArrowLeft className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
};  