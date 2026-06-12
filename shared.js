const API = "https://materials-parser-api.onrender.com";

function cacheSet(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ data }));
  } catch (e) {}
}

function cacheGet(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data } = JSON.parse(raw);
    return data;
  } catch (e) {
    return null;
  }
}

function cacheInvalidate(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {}
}

async function apiFetch(url, options, retries = 3) {
  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (e) {
      lastError = e;
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  throw lastError;
}

setInterval(() => {
  fetch(`${API}/health`).catch(() => {});
}, 8 * 60 * 1000);
