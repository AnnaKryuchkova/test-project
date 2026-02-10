import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { notifications } from "@mantine/notifications";
import type { AuthTokens, AuthUser } from "../../entities/auth/model/types";
import { getCurrentUser, login } from "../../entities/auth/api/authApi";
import {
  clearTokens,
  loadTokens,
  saveTokens,
} from "../../shared/auth/tokenStorage";

interface AuthContextValue {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isInitializing: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  login: (params: {
    username: string;
    password: string;
    rememberMe: boolean;
  }) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  useEffect(() => {
    const { tokens: storedTokens } = loadTokens();
    if (!storedTokens) {
      setIsInitializing(false);
      return;
    }

    const init = async () => {
      try {
        const me = await getCurrentUser(storedTokens.accessToken);
        setUser(me);
        setTokens(storedTokens);
      } catch {
        clearTokens();
      } finally {
        setIsInitializing(false);
      }
    };

    void init();
  }, []);

  const handleLogin = useCallback(
    async (params: {
      username: string;
      password: string;
      rememberMe: boolean;
    }) => {
      try {
        const response = await login({
          username: params.username,
          password: params.password,
          expiresInMins: 60,
        });

        const { accessToken, refreshToken, expiresIn, ...userData } = response;
        const tokensPayload: AuthTokens = {
          accessToken,
          refreshToken,
          expiresIn,
        };

        saveTokens(tokensPayload, params.rememberMe);
        setTokens(tokensPayload);
        setUser(userData);

        notifications.show({
          color: "green",
          title: "Успешный вход",
          message: `Добро пожаловать, ${userData.firstName}!`,
          position: "top-right",
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Не удалось выполнить вход";

        notifications.show({
          color: "red",
          title: "Ошибка авторизации",
          message,
          position: "top-right",
        });

        throw error;
      }
    },
    [],
  );

  const handleLogout = useCallback(() => {
    clearTokens();
    setTokens(null);
    setUser(null);
    setIsGuest(false);
  }, []);

  const loginAsGuest = useCallback(() => {
    setIsGuest(true);
  }, []);

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      tokens,
      isInitializing,
      isAuthenticated: Boolean(user && tokens) || isGuest,
      isGuest,
      login: handleLogin,
      loginAsGuest,
      logout: handleLogout,
    }),
    [
      user,
      tokens,
      isInitializing,
      isGuest,
      handleLogin,
      loginAsGuest,
      handleLogout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
