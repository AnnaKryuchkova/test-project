import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import type {
  FetchProductsParams,
  Product,
  ProductCreateInput,
  ProductUpdateInput,
  ProductsResponse,
} from "./types";
import { fetchProducts } from "../api/productApi";

export interface UseProductsParams extends FetchProductsParams {
  page: number;
  pageSize: number;
}

interface UseProductsResult {
  products: Product[];
  total: number;
  isLoading: boolean;
  isSubmitting: boolean;
  loadError: string | null;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  createProductItem: (payload: ProductCreateInput) => Promise<void>;
  updateProductItem: (id: number, payload: ProductUpdateInput) => Promise<void>;
}

export function useProducts(params: UseProductsParams): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(params.page);
  const [pageSize] = useState<number>(params.pageSize);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = async (overrides?: Partial<UseProductsParams>) => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const effectivePage = overrides?.page ?? page;
      const effectivePageSize = overrides?.pageSize ?? pageSize;

      const apiParams: FetchProductsParams = {
        search: overrides?.search ?? params.search,
        sortBy: overrides?.sortBy ?? params.sortBy,
        order: overrides?.order ?? params.order,
        limit: effectivePageSize,
        skip: (effectivePage - 1) * effectivePageSize,
      };

      const data: ProductsResponse = await fetchProducts(apiParams);
      setProducts(data.products);
      setTotal(data.total);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось загрузить товары";
      setLoadError(message);
      notifications.show({
        color: "red",
        title: "Ошибка загрузки",
        message,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load({ page: 1 });
    setPage(1);
  }, [params.search, params.sortBy, params.order]);

  useEffect(() => {
    void load();
  }, [page]);

  const createProductItem = async (payload: ProductCreateInput) => {
    setIsSubmitting(true);
    try {
      const fakeId = Date.now();

      const created: Product = {
        id: fakeId,
        title: payload.title,
        price: payload.price,
        brand: payload.brand,
        sku: payload.sku,
        description: "",
        discountPercentage: 0,
        rating: 0,
        stock: 0,
        category: "",
        thumbnail: "",
        images: [],
      };
      notifications.show({
        color: "green",
        title: "Товар создан",
        message: `Товар «${created?.title}» успешно добавлен`,

        position: "top-right",
      });

      setProducts((prev) => [created, ...prev]);
      setTotal((prev) => prev + 1);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось создать товар";
      notifications.show({
        color: "red",
        title: "Ошибка создания",
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProductItem = async (id: number, payload: ProductUpdateInput) => {
    setIsSubmitting(true);
    try {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id
            ? {
                ...product,
                ...payload,
              }
            : product,
        ),
      );

      notifications.show({
        color: "green",
        title: "Товар обновлён",
        message: "Изменения сохранены локально",
        position: "top-right",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не удалось обновить товар";
      notifications.show({
        color: "red",
        title: "Ошибка обновления",
        message,
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    products,
    total,
    isLoading,
    isSubmitting,
    loadError,
    page,
    pageSize,
    setPage,
    createProductItem,
    updateProductItem,
  };
}
