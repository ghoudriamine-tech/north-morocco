/* =========================================
   ⭐ شمال المغرب
   نظام التقييمات والمراجعات
========================================= */


async function loadReviews(
  serviceType,
  serviceId
) {

  try {

    const response =
      await fetch(
        `${SUPABASE_URL}/rest/v1/reviews` +
        `?select=id,service_type,service_id,reviewer_name,rating,comment,created_at` +
        `&service_type=eq.${encodeURIComponent(serviceType)}` +
        `&service_id=eq.${encodeURIComponent(serviceId)}` +
        `&order=created_at.desc`,
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


    return await response.json();


  } catch (error) {

    console.error(
      "Reviews loading error:",
      error
    );

    return [];

  }

}


/* =========================================
   متوسط التقييم
========================================= */

function calculateAverageRating(
  reviews
) {

  if (!reviews.length) {
    return 0;
  }


  const total =
    reviews.reduce(
      (sum, review) =>
        sum + Number(review.rating || 0),
      0
    );


  return total / reviews.length;

}


/* =========================================
   النجوم
========================================= */

function displayStars(
  rating
) {

  const value =
    Math.max(
      0,
      Math.min(
        5,
        Math.round(
          Number(rating) || 0
        )
      )
    );


  return (
    "★".repeat(value) +
    "☆".repeat(5 - value)
  );

}


/* =========================================
   حماية HTML
========================================= */

function reviewEscapeHTML(
  value
) {

  return String(
    value ?? ""
  )

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


/* =========================================
   حماية JavaScript
========================================= */

function reviewEscapeJS(
  value
) {

  return String(
    value ?? ""
  )

    .replace(
      /\\/g,
      "\\\\"
    )

    .replace(
      /'/g,
      "\\'"
    )

    .replace(
      /"/g,
      '\\"'
    )

    .replace(
      /\r?\n/g,
      " "
    );

}


/* =========================================
   واجهة التقييم
========================================= */

function renderReviews(
  serviceType,
  serviceId
) {

  const safeType =
    reviewEscapeHTML(
      serviceType
    );

  const safeId =
    reviewEscapeHTML(
      serviceId
    );


  const uniqueId =
    `reviews-${serviceType}-${serviceId}`;


  return `

    <div
      class="reviews-section"
      id="${uniqueId}"
      data-service-type="${safeType}"
      data-service-id="${safeId}"
    >

      <div class="reviews-summary">

        <strong>
          ⭐ التقييمات
        </strong>

        <span class="reviews-average">
          جاري تحميل التقييمات...
        </span>

      </div>


      <div class="reviews-list">
      </div>


      <button
        type="button"
        class="btn review-toggle-btn"
        onclick="toggleReviewForm(
          '${reviewEscapeJS(serviceType)}',
          '${reviewEscapeJS(serviceId)}'
        )"
      >
        ⭐ أضف تقييمك
      </button>


      <div
        class="review-form-container"
        id="review-form-${safeType}-${safeId}"
        style="display:none;"
      >

        <form
          onsubmit="
            submitReview(
              event,
              '${reviewEscapeJS(serviceType)}',
              '${reviewEscapeJS(serviceId)}'
            )
          "
        >

          <label>
            اسمك
          </label>

          <input
            type="text"
            class="reviewer-name"
            placeholder="أدخل اسمك"
            maxlength="100"
            required
          >


          <label>
            تقييمك
          </label>


          <div class="star-rating">

            <button
              type="button"
              onclick="setReviewRating(this, 1)"
            >☆</button>

            <button
              type="button"
              onclick="setReviewRating(this, 2)"
            >☆</button>

            <button
              type="button"
              onclick="setReviewRating(this, 3)"
            >☆</button>

            <button
              type="button"
              onclick="setReviewRating(this, 4)"
            >☆</button>

            <button
              type="button"
              onclick="setReviewRating(this, 5)"
            >☆</button>

          </div>


          <input
            type="hidden"
            class="review-rating"
            value="0"
          >


          <label>
            تعليقك
          </label>


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


/* =========================================
   فتح نموذج التقييم
========================================= */

function toggleReviewForm(
  serviceType,
  serviceId
) {

  const form =
    document.getElementById(
      `review-form-${serviceType}-${serviceId}`
    );


  if (!form) {
    return;
  }


  form.style.display =
    form.style.display === "none"
      ? "block"
      : "none";

}


/* =========================================
   اختيار النجوم
========================================= */

function setReviewRating(
  button,
  rating
) {

  const form =
    button.closest("form");


  if (!form) {
    return;
  }


  const ratingInput =
    form.querySelector(
      ".review-rating"
    );


  const buttons =
    form.querySelectorAll(
      ".star-rating button"
    );


  if (!ratingInput) {
    return;
  }


  ratingInput.value =
    String(rating);


  buttons.forEach(
    (star, index) => {

      star.textContent =
        index < rating
          ? "★"
          : "☆";

    }
  );

}


/* =========================================
   إرسال التقييم
========================================= */

async function submitReview(
  event,
  serviceType,
  serviceId
) {

  event.preventDefault();


  const form =
    event.target;


  const nameInput =
    form.querySelector(
      ".reviewer-name"
    );


  const ratingInput =
    form.querySelector(
      ".review-rating"
    );


  const commentInput =
    form.querySelector(
      ".review-comment"
    );


  const message =
    form.querySelector(
      ".review-message"
    );


  const submitButton =
    form.querySelector(
      ".review-submit-btn"
    );


  const reviewerName =
    nameInput.value.trim();


  const rating =
    Number(
      ratingInput.value
    );


  const comment =
    commentInput.value.trim();


  if (!reviewerName) {

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


  if (comment.length > 500) {

    message.textContent =
      "⚠️ التعليق طويل جدًا.";

    return;

  }


  submitButton.disabled =
    true;


  submitButton.textContent =
    "⏳ جاري إرسال التقييم...";


  message.textContent =
    "";


  try {

    const response =
      await fetch(
        `${SUPABASE_URL}/rest/v1/reviews`,
        {
          method: "POST",

          headers: {
            "apikey":
              SUPABASE_KEY,

            "Content-Type":
              "application/json",

            "Prefer":
              "return=minimal"
          },

          body: JSON.stringify({

            service_type:
              serviceType,

            service_id:
              Number(serviceId),

            reviewer_name:
              reviewerName,

            rating:
              rating,

            comment:
              comment || null

          })

        }
      );


    if (!response.ok) {

      const errorText =
        await response.text();


      throw new Error(
        `HTTP ${response.status}: ${errorText}`
      );

    }


    message.textContent =
      "✅ تم إرسال تقييمك بنجاح.";


    form.reset();


    ratingInput.value =
      "0";


    form
      .querySelectorAll(
        ".star-rating button"
      )
      .forEach(
        star => {
          star.textContent =
            "☆";
        }
      );


    await refreshReviews(
      serviceType,
      serviceId
    );


  } catch (error) {

    console.error(
      "Review submission error:",
      error
    );


    message.textContent =
      "❌ تعذر إرسال التقييم حاليًا.";

  } finally {

    submitButton.disabled =
      false;


    submitButton.textContent =
      "📩 إرسال التقييم";

  }

}


/* =========================================
   تحديث التقييمات
========================================= */

async function refreshReviews(
  serviceType,
  serviceId
) {

  const section =
    document.getElementById(
      `reviews-${serviceType}-${serviceId}`
    );


  if (!section) {
    return;
  }


  const averageElement =
    section.querySelector(
      ".reviews-average"
    );


  const listElement =
    section.querySelector(
      ".reviews-list"
    );


  const reviews =
    await loadReviews(
      serviceType,
      serviceId
    );


  const average =
    calculateAverageRating(
      reviews
    );


  if (reviews.length) {

    averageElement.innerHTML =
      `
        ${displayStars(average)}
        ${average.toFixed(1)}/5
        (${reviews.length} تقييم)
      `;

  } else {

    averageElement.textContent =
      "لا توجد تقييمات بعد.";

  }


  if (!reviews.length) {

    listElement.innerHTML =
      `
        <p class="empty">
          كن أول من يقيّم هذه الخدمة ⭐
        </p>
      `;

    return;

  }


  listElement.innerHTML =
    reviews.map(
      review => {

        const comment =
          review.comment
            ? `
              <p class="review-comment-display">
                💬 ${reviewEscapeHTML(
                  review.comment
                )}
              </p>
            `
            : "";


        return `
          <div class="review-item">

            <strong>
              ${reviewEscapeHTML(
                review.reviewer_name
              )}
            </strong>

            <div class="review-stars">
              ${displayStars(
                review.rating
              )}
            </div>

            ${comment}

          </div>
        `;

      }
    ).join("");

}


/* =========================================
   تشغيل التقييمات
========================================= */

function initReviews() {

  document
    .querySelectorAll(
      ".reviews-section"
    )
    .forEach(
      section => {

        const serviceType =
          section.dataset.serviceType;


        const serviceId =
          section.dataset.serviceId;


        if (
          serviceType &&
          serviceId
        ) {

          refreshReviews(
            serviceType,
            serviceId
          );

        }

      }
    );

}


/* =========================================
   مراقبة ظهور بطاقات جديدة
========================================= */

function startReviewsObserver() {

  const observer =
    new MutationObserver(
      mutations => {

        let shouldRefresh =
          false;


        mutations.forEach(
          mutation => {

            if (
              mutation.addedNodes &&
              mutation.addedNodes.length
            ) {

              shouldRefresh =
                true;

            }

          }
        );


        if (shouldRefresh) {

          initReviews();

        }

      }
    );


  observer.observe(
    document.body,
    {
      childList: true,
      subtree: true
    }
  );

}


/* =========================================
   تشغيل النظام
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    initReviews();

    startReviewsObserver();

  }
);
