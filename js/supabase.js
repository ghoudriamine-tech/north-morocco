/* =========================================
🌊 شمال المغرب
Supabase
========================================= */

function supabaseHeaders() {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
  };
}

async function supabaseGet(table) {
  const controller = new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    10000
  );

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?select=*`,
      {
        method: "GET",
        headers: supabaseHeaders(),
        signal: controller.signal
      }
    );

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: ${await response.text()}`
      );
    }

    return await response.json();

  } finally {
    clearTimeout(timeout);
  }
        }
