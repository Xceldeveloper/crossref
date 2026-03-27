const isDev = import.meta.env.DEV;

export const logger = {
  info(...args: unknown[]) {
    if (isDev) console.info("[Crossref]", ...args);
  },
  warn(...args: unknown[]) {
    if (isDev) console.warn("[Crossref]", ...args);
  },
  error(...args: unknown[]) {
    if (isDev) console.error("[Crossref]", ...args);
  },
};
