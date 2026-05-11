const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const TIMEOUT_MS = 15000;

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...authHeaders(), ...options.headers },
      signal: controller.signal,
      ...options,
    });

    const data = await res.json();

    // Oturum süresi dolduysa sessizce çıkış yap
    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
      throw new Error("Oturum süresi doldu. Lütfen tekrar giriş yapın.");
    }

    if (!res.ok) throw new Error(data.detail || "Bir hata oluştu");
    return data;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("İstek zaman aşımına uğradı. Sunucu bağlantısını kontrol edin.");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/users/me"),
  predict: (body) => request("/predictions", { method: "POST", body: JSON.stringify(body) }),
  myPredictions: () => request("/predictions/me"),
};
