import { httpClient } from '../../../shared/api/httpClient';
import type { AuthUser, LoginResponse } from '../model/types';

export interface LoginPayload {
  username: string;
  password: string;
  expiresInMins?: number;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return httpClient.post<LoginResponse, LoginPayload>('/auth/login', payload);
}

export async function getCurrentUser(
  accessToken: string,
): Promise<AuthUser> {
  return httpClient.get<AuthUser>('/auth/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

