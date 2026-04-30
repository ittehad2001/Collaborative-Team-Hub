"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const routes = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" }
];

export default function AppChromeClient({ children }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    const stored = localStorage.getItem("teamhub-theme") || "system";
    applyTheme(stored);
    setTheme(stored);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onMediaChange = () => {
      const current = localStorage.getItem("teamhub-theme") || "system";
      if (current === "system") applyTheme("system");
    };
    media.addEventListener("change", onMediaChange);

    if ("serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "production") {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      } else {
        navigator.serviceWorker.getRegistrations().then((regs) => {
          regs.forEach((reg) => reg.unregister());
        });
        caches.keys().then((keys) => {
          keys.forEach((key) => caches.delete(key));
        });
      }
    }
    return () => media.removeEventListener("change", onMediaChange);
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = useMemo(() => {
    return routes.filter((r) => r.label.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  function applyTheme(nextTheme) {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    if (nextTheme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.add(prefersDark ? "dark" : "light");
    } else {
      root.classList.add(nextTheme);
    }
    localStorage.setItem("teamhub-theme", nextTheme);
  }

  function onThemeChange(nextTheme) {
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <>
      <div className="fixed right-4 top-4 z-40">
        <select
          className="rounded-xl border border-slate-300 bg-white px-2 py-1 text-xs dark:bg-slate-900 dark:text-slate-100"
          value={theme}
          onChange={(e) => onThemeChange(e.target.value)}
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      {children}
      {open ? (
        <div className="fixed inset-0 z-50 bg-black/40 p-6">
          <div className="mx-auto max-w-xl rounded-2xl bg-white p-4 shadow-xl dark:bg-slate-900">
            <input
              autoFocus
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
              placeholder="Type route name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <ul className="mt-3 space-y-2">
              {filtered.map((item) => (
                <li key={item.href}>
                  <button
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    onClick={() => {
                      router.push(item.href);
                      setOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
