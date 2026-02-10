import { httpClient } from '../../../shared/api/httpClient';
import type {
  FetchProductsParams,
  Product,
  ProductCreateInput,
  ProductUpdateInput,
  ProductsResponse,
} from '../model/types';

export async function fetchProducts(
  params: FetchProductsParams,
): Promise<ProductsResponse> {
  const searchParams = new URLSearchParams();

  if (typeof params.limit === 'number') {
    searchParams.set('limit', String(params.limit));
  }
  if (typeof params.skip === 'number') {
    searchParams.set('skip', String(params.skip));
  }
  if (params.sortBy) {
    searchParams.set('sortBy', params.sortBy);
  }
  if (params.order) {
    searchParams.set('order', params.order);
  }

  const basePath =
    params.search && params.search.trim().length > 0
      ? '/products/search'
      : '/products';

  if (params.search && params.search.trim().length > 0) {
    searchParams.set('q', params.search.trim());
  }

  const query = searchParams.toString();
  const path = query ? `${basePath}?${query}` : basePath;

  return httpClient.get<ProductsResponse>(path);
}

