/* =========================================
   🌊 شمال المغرب
   Supabase
========================================= */


/* =========================================
   Headers
========================================= */

function supabaseHeaders() {

  return {
    apikey: SUPABASE_KEY,
    "Content-Type": "application/json"
  };

}


/* =========================================
   جلب البيانات من Supabase
========================================= */

async function supabaseGet(table) {

  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      () => controller.abort(),
      10000
    );

  try {

    const response =
      await fetch(
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


/* =========================================
   حماية HTML
========================================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================
   حماية JavaScript
========================================= */

function escapeJS(value) {

  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n");

}
