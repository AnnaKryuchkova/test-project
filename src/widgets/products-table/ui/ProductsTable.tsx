import {
  Avatar,
  Checkbox,
  Group,
  Loader,
  Progress,
  ScrollArea,
  Table,
  Text,
  UnstyledButton,
} from '@mantine/core';
import type { Product } from '../../../entities/product/model/types';

export type SortKey = 'title' | 'price' | 'rating';
export type SortDirection = 'asc' | 'desc';

export interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSortChange: (key: SortKey) => void;
  onEdit: (product: Product) => void;
}

export function ProductsTable({
  products,
  isLoading,
  sortKey,
  sortDirection,
  onSortChange,
  onEdit,
}: ProductsTableProps) {
  const renderSortLabel = (label: string, key: SortKey) => {
    const isActive = sortKey === key;
    const arrow = !isActive || sortDirection === 'asc' ? '▲' : '▼';

    return (
      <UnstyledButton
        onClick={() => onSortChange(key)}
        style={{ width: '100%' }}
      >
        <Group gap={4} justify="space-between">
          <Text fz="sm" fw={500}>
            {label}
          </Text>
          <Text fz="xs" c={isActive ? 'blue.6' : 'dimmed'}>
            {arrow}
          </Text>
        </Group>
      </UnstyledButton>
    );
  };

  const rows =
    products.length === 0 && !isLoading ? (
      <Table.Tr>
        <Table.Td colSpan={8}>
          <Text ta="center" c="dimmed">
            Товары не найдены
          </Text>
        </Table.Td>
      </Table.Tr>
    ) : (
      products.map((product) => (
        <Table.Tr
          key={product.id}
          style={{ cursor: 'pointer' }}
          onClick={() => onEdit(product)}
        >
          <Table.Td width={40}>
            <Checkbox aria-label="Выбрать товар" />
          </Table.Td>
          <Table.Td width={56}>
            <Avatar
              src={product.thumbnail}
              radius="sm"
              size={36}
              alt={product.title}
            />
          </Table.Td>
          <Table.Td>
            <Text fz="sm" fw={500}>
              {product.title}
            </Text>
            <Text fz="xs" c="dimmed" lineClamp={1}>
              {product.category}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text fz="sm" fw={600}>
              {product.brand}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text fz="sm" c="dimmed">
              {product.sku ?? '—'}
            </Text>
          </Table.Td>
          <Table.Td>
            <Text
              fz="sm"
              fw={500}
              c={product.rating < 3 ? 'red.6' : undefined}
            >
              {product.rating.toFixed(1)}/5
            </Text>
          </Table.Td>
          <Table.Td>
            <Text fz="sm" fw={600}>
              {product.price.toLocaleString('ru-RU', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </Table.Td>
          <Table.Td>
            <Progress
              value={Math.min(100, (product.stock / 150) * 100)}
              w={80}
              size="sm"
              color="gray"
            />
          </Table.Td>
          <Table.Td>
            <Group gap={8} justify="flex-end">
              <Text fz="xs" c="blue.6">
                Редактировать
              </Text>
            </Group>
          </Table.Td>
        </Table.Tr>
      ))
    );

  return (
    <ScrollArea>
      <Table
        highlightOnHover
        horizontalSpacing="md"
        verticalSpacing="xs"
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={40}>
              <Checkbox aria-label="Выбрать все товары" />
            </Table.Th>
            <Table.Th w={56} />
            <Table.Th>{renderSortLabel('Название', 'title')}</Table.Th>
            <Table.Th>{renderSortLabel('Вендор', 'title')}</Table.Th>
            <Table.Th>Артикул</Table.Th>
            <Table.Th>{renderSortLabel('Оценка', 'rating')}</Table.Th>
            <Table.Th>{renderSortLabel('Цена', 'price')}</Table.Th>
            <Table.Th>Количество</Table.Th>
            <Table.Th> </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {isLoading ? (
            <Table.Tr>
              <Table.Td colSpan={8}>
                <Progress value={100} striped animated />
                <Group justify="center" py="sm">
                  <Loader size="xs" />
                  <Text fz="sm" c="dimmed">
                    Загрузка товаров...
                  </Text>
                </Group>
              </Table.Td>
            </Table.Tr>
          ) : (
            rows
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}

