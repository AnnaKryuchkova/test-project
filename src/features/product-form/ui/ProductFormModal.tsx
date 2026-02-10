import { useEffect, useState } from "react";
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import type {
  Product,
  ProductCreateInput,
  ProductUpdateInput,
} from "../../../entities/product/model/types";

type Mode = "create" | "edit";

export interface ProductFormModalProps {
  opened: boolean;
  mode: Mode;
  product?: Product;
  isSubmitting: boolean;
  onClose: () => void;
  onCreate: (payload: ProductCreateInput) => Promise<void>;
  onUpdate: (id: number, payload: ProductUpdateInput) => Promise<void>;
}

interface FormState {
  title: string;
  price: number | "";
  brand: string;
  sku: string;
}

const defaultState: FormState = {
  title: "",
  price: "",
  brand: "",
  sku: "",
};

export function ProductFormModal({
  opened,
  mode,
  product,
  isSubmitting,
  onClose,
  onCreate,
  onUpdate,
}: ProductFormModalProps) {
  const [form, setForm] = useState<FormState>(defaultState);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  useEffect(() => {
    if (opened && mode === "edit" && product) {
      setForm({
        title: product.title,
        price: product.price,
        brand: product.brand ?? "",
        sku: product.sku ?? "",
      });
    } else if (opened && mode === "create") {
      setForm(defaultState);
      setErrors({});
    }
  }, [opened, mode, product]);

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.title.trim()) {
      nextErrors.title = "Введите наименование товара";
    }

    if (form.price === "" || Number.isNaN(Number(form.price))) {
      nextErrors.price = "Введите корректную цену";
    } else if (Number(form.price) < 0) {
      nextErrors.price = "Цена не может быть отрицательной";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    const payloadBase = {
      title: form.title.trim(),
      price: Number(form.price),
      brand: form.brand.trim(),
      sku: form.sku.trim() || undefined,
    };

    if (mode === "create") {
      await onCreate(payloadBase);
    } else if (mode === "edit" && product) {
      const updatePayload: ProductUpdateInput = {
        ...payloadBase,
      };
      await onUpdate(product.id, updatePayload);
    }

    onClose();
  };

  const titleLabel =
    mode === "create" ? "Новый товар" : "Редактирование товара";

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text fw={600}>{titleLabel}</Text>}
      centered
      size="lg"
    >
      <Stack gap="md">
        <TextInput
          label="Наименование"
          placeholder="Введите наименование товара"
          value={form.title}
          error={errors.title}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, title: event.target.value }))
          }
          required
          data-autofocus
        />

        <Group grow align="flex-start">
          <TextInput
            label="Вендор"
            placeholder="Например, Apple"
            value={form.brand}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                brand: event.target.value,
              }))
            }
          />
          <NumberInput
            label="Цена"
            placeholder="0"
            value={form.price}
            error={errors.price}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                price: typeof value === "number" ? value : "",
              }))
            }
            min={0}
            thousandSeparator=" "
            fixedDecimalScale
          />
        </Group>

        <TextInput
          label="Артикул"
          placeholder="Например, RCH45Q1A"
          value={form.sku}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              sku: event.target.value,
            }))
          }
        />

        <Group justify="flex-end" mt="sm">
          <Button variant="default" onClick={onClose}>
            Отмена
          </Button>
          <Button loading={isSubmitting} onClick={() => void handleSubmit()}>
            {mode === "create" ? "Создать" : "Сохранить"}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
