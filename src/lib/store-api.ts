/**
 * Public store API — transforms DB shapes into the Category / Product types
 * that CategoryCard, ProductCard and the cart already expect.
 */
import type { Category, Product } from '@/data/store';

interface DbCategory {
  id: number;
  name: string;
  name_en: string;
  slug: string;
  image: string | null;
  count: number;
}

interface DbProduct {
  id: number;
  name: string;
  name_en: string;
  price: number;
  old_price: number | null;
  image: string | null;
  category_id: number | null;
  category_slug: string | null;
  badge: 'new' | 'sale' | 'hot' | null;
  in_stock: boolean;
}

function toCategory(r: DbCategory): Category {
  return {
    id: r.slug,               // slug used as routing id
    name: r.name,
    nameEn: r.name_en,
    image: r.image ?? '',
    count: r.count,
  };
}

function toProduct(r: DbProduct): Product {
  return {
    id: String(r.id),          // numeric → string id for routing + cart
    name: r.name,
    nameEn: r.name_en,
    price: r.price,
    oldPrice: r.old_price ?? undefined,
    image: r.image ?? '',
    categoryId: r.category_slug ?? '',
    badge: r.badge ?? undefined,
  };
}

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? 'Request failed');
  }
  return res.json();
}

export async function getCategories(): Promise<Category[]> {
  const data = await get<DbCategory[]>('/api/categories/index.php');
  return data.map(toCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const data = await get<DbCategory>(`/api/categories/index.php?slug=${encodeURIComponent(slug)}`);
    return toCategory(data);
  } catch {
    return null;
  }
}

export async function getProducts(): Promise<Product[]> {
  const data = await get<DbProduct[]>('/api/products/index.php');
  return data.map(toProduct);
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const data = await get<DbProduct[]>(
    `/api/products/index.php?category_slug=${encodeURIComponent(slug)}`
  );
  return data.map(toProduct);
}

export async function getProduct(id: string): Promise<Product | null> {
  const numId = parseInt(id);
  if (isNaN(numId)) return null;
  try {
    const data = await get<DbProduct>(`/api/products/index.php?id=${numId}`);
    return toProduct(data);
  } catch {
    return null;
  }
}
