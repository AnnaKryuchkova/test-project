import { AppShell, Container, Group, Loader, Text } from "@mantine/core";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./app/providers/AuthProvider";
import { LoginPage } from "./pages/auth/ui/LoginPage";
import { ProductsPage } from "./pages/products/ui/ProductsPage";

function AppShellWithContent() {
  const { user } = useAuth();

  return (
    <AppShell padding="md" header={{ height: 56 }}>
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Text fw={700}>Aiti Guru</Text>
          <Group gap="xs">
            <Text fz="sm" c="dimmed">
              {user?.firstName} {user?.lastName}
            </Text>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg" py="md">
          <ProductsPage />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

function App() {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return (
      <Container size="xs" py="xl">
        <Group justify="center" gap="sm">
          <Loader size="sm" />
          <Text fz="sm" c="dimmed">
            Загрузка приложения...
          </Text>
        </Group>
      </Container>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/products" replace /> : <LoginPage />
        }
      />
      <Route
        path="/products"
        element={
          isAuthenticated ? (
            <AppShellWithContent />
          ) : (
            <Navigate to="/login" replace state={{ from: location.pathname }} />
          )
        }
      />
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/products" : "/login"} replace />
        }
      />
    </Routes>
  );
}

export default App;
