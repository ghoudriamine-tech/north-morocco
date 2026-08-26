const SUPABASE_URL =
  "https://rbmttbxsezttysenbcwn.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_tVChEdNRQHs9lrYPjA4ajQ_heTXT2xw";

function supabaseHeaders() {
  return {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
  };
}
