import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, LogOut, Store } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/admin',            label: 'Dashboard',  icon: LayoutDashboard, exact: true },
  { to: '/admin/products',   label: 'Products',   icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
];

export default function AdminLayout() {
  const { admin, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400">Chargement...</div>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
          <div className="bg-emerald-100 p-1.5 rounded-lg">
            <Store size={18} className="text-emerald-700" />
          </div>
          <span className="font-semibold text-gray-900 text-sm">Tanjartmarket Admin</span>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(({ to, label, icon: Icon, exact }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(to, exact)
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-0.5">Connecté en tant que</p>
          <p className="text-sm font-medium text-gray-700 mb-3">{admin.username}</p>
          <Button
            variant="outline"
            size="sm"
            className="w-full text-gray-600"
            onClick={logout}
          >
            <LogOut size={14} className="mr-2" />
            Se déconnecter
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
