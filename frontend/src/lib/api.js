const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

/**
 * Authenticated fetch wrapper — attaches the stored token and throws on
 * non-OK responses so callers can just .catch(err => ...).
 */
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("nutritrack_token");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Une erreur est survenue.");
  }

  return data;
}
