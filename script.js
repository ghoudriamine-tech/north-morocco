const SUPABASE_URL =
  "https://rbmttbxsezttysenbcwn.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_tVChEdNRQHs9lrYPjA4ajQ_heTXT2w";


async function testSupabase() {

  try {

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/accommodations?select=id,name&limit=1`,
      {
        method: "GET",
        headers: {
          "apikey": SUPABASE_KEY,
  
        }
      }
    );

    const result =
      await response.text();

    console.log("STATUS:", response.status);
    console.log("RESULT:", result);

    alert(
      "STATUS: " +
      response.status +
      "\n\n" +
      result
    );

  } catch (error) {

    console.error(error);

    alert(
      "خطأ في الاتصال:\n" +
      error.message
    );
  }
}


document.addEventListener(
  "DOMContentLoaded",
  testSupabase
);
