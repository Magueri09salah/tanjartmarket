const API_BASE = 'http://localhost:8080/api';

function getToken(): string | null {
  return localStorage.getItem('admin_token');
}

async function request<T = unknown>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
       'mode': 'no-cors',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string> | undefined),
    },
  });

  const data = await res.json().catch(() => ({ error: 'Invalid response' }));
  if (!res.ok) throw new Error((data as { error?: string }).error || 'Request failed');
  return data as T;
}

export const api = {
  auth: {
    login: (username: string, password: string) =>
      request<{ token: string; admin: { id: number; username: string } }>(
        '/auth/login.php',
        { method: 'POST', body: JSON.stringify({ username, password }) }
      ),
    logout: () => request('/auth/logout.php', { method: 'POST' }),
    check: () => request<{ admin: { id: number; username: string } }>('/auth/check.php'),
  },

  settings: {
    changePassword: (current_password: string, new_password: string, confirm_password: string) =>
      request('/auth/change-password.php', {
        method: 'POST',
        body: JSON.stringify({ current_password, new_password, confirm_password }),
      }),
    },

  categories: {
    list: () => request<Category[]>('/categories/index.php'),
    create: (data: CategoryPayload) =>
      request<Category>('/categories/index.php', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: CategoryPayload) =>
      request<Category>(`/categories/single.php?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => request(`/categories/single.php?id=${id}`, { method: 'DELETE' }),
  },

  products: {
    list: () => request<Product[]>('/products/index.php'),
    create: (data: ProductPayload) =>
      request<Product>('/products/index.php', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: ProductPayload) =>
      request<Product>(`/products/single.php?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => request(`/products/single.php?id=${id}`, { method: 'DELETE' }),
  },

  upload: async (file: File): Promise<{ url: string }> => {
    const token = getToken();
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_BASE}/upload.php`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    const data = await res.json().catch(() => ({ error: 'Upload failed' }));
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    return data;
  },
};

// Shared types used across admin pages
export interface Category {
  id: number;
  name: string;
  name_en: string;
  slug: string;
  image: string | null;
  count: number;
}

export interface Product {
  id: number;
  name: string;
  name_en: string;
  price: number;
  old_price: number | null;
  image: string | null;
  category_id: number | null;
  category_name: string | null;
  badge: 'new' | 'sale' | 'hot' | null;
  in_stock: boolean;
}

export interface CategoryPayload {
  name: string;
  name_en: string;
  image: string | null;
}

export interface ProductPayload {
  name: string;
  name_en: string;
  price: number;
  old_price: number | null;
  image: string | null;
  category_id: number | null;
  badge: string | null;
  in_stock: boolean;
}
