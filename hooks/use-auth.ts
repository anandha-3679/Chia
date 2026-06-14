"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ApiError,
  apiFetch,
  getMe,
  loginRequest,
  registerRequest,
} from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { DietType, Goal, User } from "@/types/api";

type AppRouter = ReturnType<typeof useRouter>;

/** New users (no goal/diet yet) go to onboarding; everyone else into the app. */
function redirectAfterAuth(user: User, router: AppRouter) {
  const needsOnboarding = !user.goal || !user.diet_type;
  router.replace(needsOnboarding ? "/onboarding" : "/app/chat");
}

export function useLogin() {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (vars: { email: string; password: string }) => {
      const token = await loginRequest(vars.email, vars.password);
      setToken(token);
      const user = await getMe();
      setUser(user);
      return user;
    },
    onSuccess: (user) => {
      toast.success(`Welcome back${user.name ? `, ${user.name}` : ""}!`);
      redirectAfterAuth(user, router);
    },
    onError: (err) => {
      toast.error(
        err instanceof ApiError ? err.message : "Something went wrong. Try again.",
      );
    },
  });
}

export function useSignup() {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (vars: {
      name: string;
      email: string;
      password: string;
    }) => {
      try {
        await registerRequest(vars.email, vars.password, vars.name);
      } catch (err) {
        if (err instanceof ApiError && err.status === 400) {
          throw new ApiError(400, "That email is already registered.");
        }
        throw err;
      }
      // Register doesn't return a token — log in immediately to get one.
      const token = await loginRequest(vars.email, vars.password);
      setToken(token);
      const user = await getMe();
      setUser(user);
      return user;
    },
    onSuccess: (user) => {
      toast.success("Account created! Let's set you up.");
      redirectAfterAuth(user, router);
    },
    onError: (err) => {
      toast.error(
        err instanceof ApiError ? err.message : "Could not create your account.",
      );
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);
  return () => {
    logout();
    queryClient.clear();
    router.replace("/login");
  };
}

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: (vars: { name: string; goal: Goal; diet_type: DietType }) =>
      apiFetch<User>("/users/me", { method: "PATCH", json: vars }),
    onSuccess: (user) => {
      setUser(user);
      toast.success("Profile updated");
    },
    onError: (err) => {
      toast.error(
        err instanceof ApiError ? err.message : "Couldn't update profile.",
      );
    },
  });
}

export function useCompleteOnboarding() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (vars: {
      name: string;
      goal: Goal;
      diet_type: DietType;
    }) => {
      const user = await apiFetch<User>("/users/me", {
        method: "PATCH",
        json: vars,
      });
      setUser(user);
      return user;
    },
    onSuccess: () => {
      toast.success("You're all set! 🎉");
      router.replace("/app/chat");
    },
    onError: (err) => {
      toast.error(
        err instanceof ApiError ? err.message : "Could not save your profile.",
      );
    },
  });
}
