"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { apiFetch, setToken, removeToken, getStoredUser, setStoredUser, removeStoredUser } from "@/lib/api";
import type { LoginPayload, LoginResponse, Usuario } from "@/types";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    setLoading(false);
  }, []);

  const login = useCallback(async (data: LoginPayload) => {
    const res = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
      noAuth: true,
    });
    setToken(res.token);
    setStoredUser(res.usuario);
    setUser(res.usuario);
    router.push("/dashboard");
  }, [router]);

  const logout = useCallback(() => {
    removeToken();
    removeStoredUser();
    setUser(null);
    router.push("/login");
  }, [router]);

  return { user, loading, login, logout };
}
