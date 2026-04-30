import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Tag, Plus, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.products.list(), api.categories.list()])
      .then(([products, categories]) =>
        setStats({ products: products.length, categories: categories.length })
      )
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: 'Total Products',
      value: stats.products,
      icon: Package,
      bg: 'bg-emerald-50',
      fg: 'text-emerald-700',
      to: '/admin/products',
    },
    {
      label: 'Categories',
      value: stats.categories,
      icon: Tag,
      bg: 'bg-blue-50',
      fg: 'text-blue-700',
      to: '/admin/categories',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-sm text-gray-500 mt-1">Bienvenue dans le tableau de bord admin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        {cards.map(({ label, value, icon: Icon, bg, fg, to }) => (
          <Link key={label} to={to} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow group">
            <div className={`inline-flex p-2.5 rounded-lg ${bg} mb-4`}>
              <Icon size={20} className={fg} />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {loading ? '—' : value}
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-gray-500">{label}</span>
              <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Actions rapides</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link to="/admin/products">
              <Plus size={15} className="mr-2" />
              Ajouter un produit
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/categories">
              <Plus size={15} className="mr-2" />
              Ajouter une catégorie
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
