import { useState } from "react";
import {
  Anchor,
  Button,
  Checkbox,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthProvider";

interface LoginFormState {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface LoginErrors {
  username?: string;
  password?: string;
  form?: string;
}

const initialState: LoginFormState = {
  username: "emilys",
  password: "emilyspass",
  rememberMe: false,
};

export function LoginPage() {
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginFormState>(initialState);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validate = (): boolean => {
    const nextErrors: LoginErrors = {};

    if (!form.username.trim()) {
      nextErrors.username = "Введите логин пользователя";
    }
    if (!form.password.trim()) {
      nextErrors.password = "Введите пароль";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setErrors((prev) => ({ ...prev, form: undefined }));

    try {
      await login({
        username: form.username.trim(),
        password: form.password,
        rememberMe: form.rememberMe,
      });
      navigate("/products", { replace: true });
    } catch {
      setErrors((prev) => ({
        ...prev,
        form: "Неверный логин или пароль. Попробуйте ещё раз.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Group justify="center" align="center" style={{ minHeight: "100vh" }}>
      <Paper
        radius="lg"
        p="xl"
        withBorder
        style={{
          width: 380,
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
        }}
      >
        <Stack gap="md">
          <Group justify="center">
            <Paper
              radius="xl"
              withBorder
              p="xs"
              style={{
                width: 56,
                height: 56,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text fw={700}>AG</Text>
            </Paper>
          </Group>

          <Stack gap={4} ta="center">
            <Text fw={700} fz={24}>
              Добро пожаловать!
            </Text>
            <Text fz="sm" c="dimmed">
              Пожалуйста, авторизируйтесь
            </Text>
          </Stack>

          <Stack gap="sm" mt="sm">
            <TextInput
              label="Логин"
              placeholder="emilys"
              value={form.username}
              error={errors.username}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  username: event.target.value,
                }))
              }
              required
            />

            <PasswordInput
              label="Пароль"
              placeholder="Введите пароль"
              value={form.password}
              error={errors.password}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
              required
            />

            <Checkbox
              label="Запомнить данные"
              checked={form.rememberMe}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  rememberMe: event.target.checked,
                }))
              }
            />

            {errors.form && (
              <Text fz="sm" c="red">
                {errors.form}
              </Text>
            )}

            <Button
              fullWidth
              mt="sm"
              onClick={() => void handleSubmit()}
              loading={isSubmitting}
            >
              Войти
            </Button>

            <Button
              variant="subtle"
              size="xs"
              fullWidth
              mt="xs"
              onClick={() => {
                loginAsGuest();
                navigate("/products", { replace: true });
              }}
            >
              Перейти к товарам без авторизации
            </Button>

            <Group justify="center">
              <Text fz="xs" c="dimmed">
                или
              </Text>
            </Group>

            <Group justify="center">
              <Text fz="sm" c="dimmed">
                Нет аккаунта?
              </Text>
              <Anchor component="button" type="button" fz="sm">
                Создать
              </Anchor>
            </Group>
          </Stack>
        </Stack>
      </Paper>
    </Group>
  );
}
