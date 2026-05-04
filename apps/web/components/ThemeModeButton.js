"use client";

import { useEffect, useState } from "react";

function getTheme() {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(nextTheme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(nextTheme);
  localStorage.setItem("teamhub-theme", nextTheme);
}

export default function ThemeModeButton() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setTheme(getTheme());
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <button
      type="button"
      className="fixed right-5 top-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--panel)] text-[var(--text-main)] shadow-[var(--shadow)] transition hover:-translate-y-0.5 hover:bg-[var(--bg-tint)]"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3v2.5" />
          <path d="M12 18.5V21" />
          <path d="M4.9 4.9l1.8 1.8" />
          <path d="M17.3 17.3l1.8 1.8" />
          <path d="M3 12h2.5" />
          <path d="M18.5 12H21" />
          <path d="M4.9 19.1l1.8-1.8" />
          <path d="M17.3 6.7l1.8-1.8" />
          <circle cx="12" cy="12" r="4.2" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      )}
    </button>
  );
}