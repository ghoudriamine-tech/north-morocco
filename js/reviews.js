/* =========================================
   ⭐ شمال المغرب
   التقييمات والمراجعات
========================================= */

async function loadReviews(serviceType, serviceId) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 10000);

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/reviews` +
      `?select=id,service_type,service_id,reviewer_name,rating,comment,created_at` +
      `&service_type=eq.${encodeURIComponent(serviceType)}` +
      `&service_id=eq.${encodeURIComponent(serviceId)}` +
      `&order=created_at.desc&limit=50`,
      {
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

  } catch (error) {

    console.error("Reviews error:", error);

    return [];

  } finally {
    clearTimeout(timeout);
  }
}


function displayStars(rating) {
  const n = Math.max(
    0,
    Math.min(5, Math.round(Number(rating) || 0))
  );

  return "★".repeat(n) + "☆".repeat(5 - n);
}


function renderReviews(serviceType, serviceId) {
  const type = escapeHTML(serviceType);
  const id = escapeHTML(serviceId);

  return `
    <div
      class="reviews-section"
      id="reviews-${type}-${id}"
      data-service-type="${type}"
      data-service-id="${id}"
      data-reviews-loaded="false"
    >

      <div class="reviews-summary">
        <strong>⭐ التقييم</strong>

        <span class="reviews-average">
          جاري التحميل...
        </span>
      </div>

      <div class="reviews-list"></div>

      <button
        type="button"
        class="btn review-toggle-btn"
        onclick="toggleReviewForm('${escapeJS(serviceType)}','${escapeJS(serviceId)}')"
      >
        ⭐ أضف تقييمك
      </button>

      <div
        class="review-form-container"
        id="review-form-${type}-${id}"
        style="display:none;"
      >

        <form
          onsubmit="submitReview(event,'${escapeJS(serviceType)}','${escapeJS(serviceId)}')"
        >

          <label>اسمك</label>

          <input
            type="text"
            class="reviewer-name"
            placeholder="أدخل اسمك"
            maxlength="100"
            required
          >

          <label>تقييمك</label>

          <div class="star-rating">

            ${[1,2,3,4,5].map(n => `
              <button
                type="button"
                onclick="setReviewRating(this,${n})"
              >☆</button>
            `).join("")}

          </div>

          <input
            type="hidden"
            class="review-rating"
            value="0"
          >

          <label>تعليقك</label>

          <textarea
            class="review-comment"
            rows="3"
            maxlength="500"
            placeholder="اكتب تعليقك هنا (اختياري)"
          ></textarea>

          <button
            type="submit"
            class="btn review-submit-btn"
          >
            📩 إرسال التقييم
          </button>

          <p class="review-message"></p>

        </form>

      </div>

    </div>
  `;
}


function toggleReviewForm(serviceType, serviceId) {
  const form = document.getElementById(
    `review-form-${serviceType}-${serviceId}`
  );

  if (!form) return;

  form.style.display =
    form.style.display === "none"
      ? "block"
      : "none";
}


function setReviewRating(button, rating) {
  const form = button.closest("form");

  if (!form) return;

  const input =
    form.querySelector(".review-rating");

  const buttons =
    form.querySelectorAll(
      ".star-rating button"
    );

  if (!input) return;

  input.value = rating;

  buttons.forEach((star, i) => {
    star.textContent =
      i < rating ? "★" : "☆";
  });
}


async function submitReview(
  event,
  serviceType,
  serviceId
) {
  event.preventDefault();

  const form = event.target;

  const message =
    form.querySelector(".review-message");

  const button =
    form.querySelector(".review-submit-btn");

  const nameInput =
    form.querySelector(".reviewer-name");

  const ratingInput =
    form.querySelector(".review-rating");

  const commentInput =
    form.querySelector(".review-comment");

  if (
    !message ||
    !button ||
    !nameInput ||
    !ratingInput ||
    !commentInput
  ) return;

  const name =
    nameInput.value.trim();

  const rating =
    Number(ratingInput.value);

  const comment =
    commentInput.value.trim();

  if (!name) {
    message.textContent =
      "⚠️ يرجى كتابة اسمك.";
    return;
  }

  if (
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    message.textContent =
      "⚠️ يرجى اختيار تقييم من 1 إلى 5 نجوم.";
    return;
  }

  if (button.disabled) return;

  button.disabled = true;

  button.textContent =
    "⏳ جاري الإرسال...";

  message.textContent = "";

  try {

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/reviews`,
      {
        method: "POST",

        headers: {
          ...supabaseHeaders(),
          Prefer: "return=minimal"
        },

        body: JSON.stringify({
          service_type: serviceType,
          service_id: Number(serviceId),
          reviewer_name: name,
          rating: rating,
          comment: comment || null
        })
      }
    );

    if (!response.ok) {
      throw new Error(
        await response.text()
      );
    }

    message.textContent =
      "✅ تم إرسال تقييمك بنجاح.";

    form.reset();

    ratingInput.value = "0";

    form
      .querySelectorAll(
        ".star-rating button"
      )
      .forEach(star => {
        star.textContent = "☆";
      });

    await refreshReviews(
      serviceType,
      serviceId,
      true
    );

  } catch (error) {

    console.error(
      "Review submission error:",
      error
    );

    message.textContent =
      "❌ تعذر إرسال التقييم حاليًا.";
  }

  button.disabled = false;

  button.textContent =
    "📩 إرسال التقييم";
}


async function refreshReviews(
  serviceType,
  serviceId,
  force = false
) {
  const section =
    document.getElementById(
      `reviews-${serviceType}-${serviceId}`
    );

  if (!section) return;

  if (
    !force &&
    section.dataset.reviewsLoaded === "true"
  ) return;

  const average =
    section.querySelector(
      ".reviews-average"
    );

  const list =
    section.querySelector(
      ".reviews-list"
    );

  if (!average || !list) return;

  section.dataset.reviewsLoaded =
    "loading";

  const reviews =
    await loadReviews(
      serviceType,
      serviceId
    );

  if (!reviews.length) {

    average.textContent =
      "لا توجد تقييمات بعد.";

    list.innerHTML =
      `<p class="empty">كن أول من يقيّم هذه الخدمة ⭐</p>`;

  } else {

    const avg =
      reviews.reduce(
        (sum, r) =>
          sum + Number(r.rating || 0),
        0
      ) / reviews.length;

    average.innerHTML =
      `⭐ ${avg.toFixed(1)}/5 · ${reviews.length} تقييم`;

    list.innerHTML =
      reviews.map(r => `
        <div class="review-item">

          <strong>
            ${escapeHTML(
              r.reviewer_name || "مستخدم"
            )}
          </strong>

          <div class="review-stars">
            ${displayStars(r.rating)}
          </div>

          ${
            r.comment
              ? `<p>💬 ${escapeHTML(r.comment)}</p>`
              : ""
          }

        </div>
      `).join("");
  }

  section.dataset.reviewsLoaded =
    "true";
}


function initReviews() {

  document
    .querySelectorAll(".reviews-section")
    .forEach(section => {

      const type =
        section.dataset.serviceType;

      const id =
        section.dataset.serviceId;

      if (type && id) {

        refreshReviews(
          type,
          id
        );
      }

    });
}


document.addEventListener(
  "DOMContentLoaded",
  initReviews
);
