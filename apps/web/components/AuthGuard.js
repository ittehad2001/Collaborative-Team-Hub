"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/useAuthStore";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const { user, initialized, bootstrap } = useAuthStore();

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    if (initialized && user === null) router.push("/login");
  }, [initialized, user, router]);

  if (!initialized) return <p className="p-10">Checking session...</p>;
  if (!user) return null;

  return children;
}
