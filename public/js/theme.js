const STORAGE_KEY = "dge-theme";

export function getStoredTheme() {
  return localStorage.getItem(STORAGE_KEY);
}

export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  localStorage.setItem(STORAGE_KEY, theme);
}

export function initTheme(darkModeDefault = true) {
  const stored = getStoredTheme();
  if (stored === "dark" || stored === "light") {
    applyTheme(stored);
  } else {
    applyTheme(darkModeDefault ? "dark" : "light");
  }
}

export function toggleTheme() {
  const isDark = document.documentElement.classList.contains("dark");
  applyTheme(isDark ? "light" : "dark");
}

export function bindThemeToggle(button) {
  if (!button) return;
  button.addEventListener("click", toggleTheme);
}
