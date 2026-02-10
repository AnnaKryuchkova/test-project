import { useState } from "react";
import {
  Button,
  Card,
  Group,
  Pagination,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useProducts } from "../../../entities/product/model/useProducts";
import type { Product } from "../../../entities/product/model/types";
import { ProductsTable } from "../../../widgets/products-table/ui/ProductsTable";
import { ProductFormModal } from "../../../features/product-form/ui/ProductFormModal";

export function ProductsPage() {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [sortKey, setSortKey] = useState<"title" | "price" | "rating">("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const {
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
  } = useProducts({
    search: debouncedSearch,
    sortBy: sortKey,
    order: sortDirection,
    page: 1,
    pageSize: 10,
  });

  const handleAddClick = () => {
    setSelectedProduct(undefined);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleRowEdit = (product: Product) => {
    setSelectedProduct(product);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleSortChange = (key: "title" | "price" | "rating") => {
    setSortKey((currentKey) => {
      if (currentKey === key) {
        setSortDirection((currentDirection) =>
          currentDirection === "asc" ? "desc" : "asc",
        );
        return currentKey;
      }

      setSortDirection("asc");
      return key;
    });
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <Card withBorder padding="lg" radius="md">
        <Stack gap="md">
          <Group justify="space-between" align="flex-end">
            <div>
              <Title order={2}>Товары</Title>
              <Text fz="sm" c="dimmed">
                Управляйте списком товаров: сортируйте, редактируйте и
                добавляйте новые позиции.
              </Text>
            </div>
            <Button onClick={handleAddClick}>Добавить товар</Button>
          </Group>

          <TextInput
            placeholder="Найти"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          {loadError && (
            <Text fz="sm" c="red">
              {loadError}
            </Text>
          )}

          <ProductsTable
            products={products}
            isLoading={isLoading}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSortChange={handleSortChange}
            onEdit={handleRowEdit}
          />

          <Group justify="space-between" align="center">
            <Text fz="xs" c="dimmed">
              Показано {products.length} из {total}
            </Text>
            <Pagination
              value={page}
              onChange={setPage}
              total={totalPages}
              size="sm"
            />
          </Group>
        </Stack>
      </Card>

      <ProductFormModal
        opened={isModalOpen}
        mode={modalMode}
        product={selectedProduct}
        isSubmitting={isSubmitting}
        onClose={() => setIsModalOpen(false)}
        onCreate={createProductItem}
        onUpdate={updateProductItem}
      />
    </>
  );
}
