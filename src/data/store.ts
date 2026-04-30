export type Category = {
  id: string;
  name: string;
  nameEn: string;
  image: string;
  count: number;
};

export type Product = {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  oldPrice?: number;
  image: string;
  categoryId: string;
  badge?: "new" | "sale" | "hot";
};

export const formatPrice = (n: number) => `${n.toFixed(n % 1 === 0 ? 0 : 1)} د.م`;
