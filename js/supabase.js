/* =========================================
   🌊 شمال المغرب
   Supabase — الأدوات العامة
========================================= */

function supabaseHeaders() {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
  };
}

async function supabaseGet(table) {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?select=*`,
    {
      method: "GET",
      headers: supabaseHeaders()
    }
  );

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}: ${await response.text()}`
    );
  }

  return response.json();
}

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeJS(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, " ");
}
