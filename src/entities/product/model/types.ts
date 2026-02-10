export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  sku?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface FetchProductsParams {
  search?: string;
  sortBy?: 'title' | 'price' | 'rating';
  order?: 'asc' | 'desc';
  limit?: number;
  skip?: number;
}

export interface ProductCreateInput {
  title: string;
  price: number;
  brand: string;
  sku?: string;
}

export type ProductUpdateInput = Partial<ProductCreateInput>;


