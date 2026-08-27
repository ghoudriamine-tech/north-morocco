/* =========================================
   ⭐ شمال المغرب
   نظام التقييمات والمراجعات
   النسخة المحسنة للسرعة والاستقرار
========================================= */


/* =========================================
   تحميل تقييمات خدمة واحدة
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
        `&order=created_at.desc` +
        `&limit=50`,
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
   حساب متوسط التقييم
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
   عرض النجوم
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
   إنشاء واجهة التقييم
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
      data-reviews-loaded="false"
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
   فتح وإغلاق نموذج التقييم
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


  if (!form) {
    return;
  }


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


  if (
    !nameInput ||
    !ratingInput ||
    !commentInput ||
    !message ||
    !submitButton
  ) {

    return;

  }


  const reviewerName =
    nameInput.value.trim();


  const rating =
    Number(
      ratingInput.value
    );


  const comment =
    commentInput.value.trim();


  /* التحقق من الاسم */

  if (!reviewerName) {

    message.textContent =
      "⚠️ يرجى كتابة اسمك.";

    return;

  }


  /* التحقق من التقييم */

  if (
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {

    message.textContent =
      "⚠️ يرجى اختيار تقييم من 1 إلى 5 نجوم.";

    return;

  }


  /* التحقق من التعليق */

  if (comment.length > 500) {

    message.textContent =
      "⚠️ التعليق طويل جدًا.";

    return;

  }


  /* منع الضغط المتكرر */

  if (
    submitButton.disabled
  ) {

    return;

  }


  submitButton.disabled =
    true;


  submitButton.textContent =
    "⏳ جاري إرسال التقييم...";


  message.textContent =
    "";


  /* مهلة قصوى للطلب */

  const controller =
    new AbortController();


  const timeout =
    setTimeout(
      () => {
        controller.abort();
      },
      10000
    );


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

          }),

          signal:
            controller.signal

        }
      );


    clearTimeout(timeout);


    if (!response.ok) {

      const errorText =
        await response.text();


      throw new Error(
        `HTTP ${response.status}: ${errorText}`
      );

    }


    /* نجاح الإرسال */

    message.textContent =
      "✅ تم إرسال تقييمك بنجاح.";


    /* تنظيف النموذج */

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


    /*
       تحديث تقييمات هذه الخدمة فقط
       وليس كل الموقع
    */

    await refreshReviews(
      serviceType,
      serviceId,
      true
    );


  } catch (error) {

    clearTimeout(timeout);


    console.error(
      "Review submission error:",
      error
    );


    if (
      error.name === "AbortError"
    ) {

      message.textContent =
        "❌ انتهت مهلة إرسال التقييم. حاول مرة أخرى.";

    } else {

      message.textContent =
        "❌ تعذر إرسال التقييم حاليًا.";

    }


  } finally {

    submitButton.disabled =
      false;


    submitButton.textContent =
      "📩 إرسال التقييم";

  }

}


/* =========================================
   تحديث تقييمات خدمة واحدة
========================================= */

async function refreshReviews(
  serviceType,
  serviceId,
  force = false
) {

  const section =
    document.getElementById(
      `reviews-${serviceType}-${serviceId}`
    );


  if (!section) {
    return;
  }


  /*
     منع تحميل نفس التقييمات عدة مرات
     بسبب إعادة رسم الصفحة
  */

  if (
    !force &&
    section.dataset.reviewsLoaded === "true"
  ) {

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


  if (
    !averageElement ||
    !listElement
  ) {

    return;

  }


  /* علامة أن التحميل بدأ */

  section.dataset.reviewsLoaded =
    "loading";


  const reviews =
    await loadReviews(
      serviceType,
      serviceId
    );


  const average =
    calculateAverageRating(
      reviews
    );


  /* عرض المتوسط */

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


  /* عرض قائمة التقييمات */

  if (!reviews.length) {

    listElement.innerHTML =
      `
        <p class="empty">
          كن أول من يقيّم هذه الخدمة ⭐
        </p>
      `;

  } else {

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


  /* انتهى التحميل */

  section.dataset.reviewsLoaded =
    "true";

}


/* =========================================
   تشغيل التقييمات الموجودة
========================================= */

function initReviews() {

  const sections =
    document.querySelectorAll(
      ".reviews-section"
    );


  sections.forEach(
    section => {

      const serviceType =
        section.dataset.serviceType;


      const serviceId =
        section.dataset.serviceId;


      if (
        !serviceType ||
        !serviceId
      ) {

        return;

      }


      /*
         لا نعيد تحميل التقييمات
         إذا سبق تحميلها
      */

      if (
        section.dataset.reviewsLoaded ===
        "true"
      ) {

        return;

      }


      refreshReviews(
        serviceType,
        serviceId
      );

    }
  );

}


/* =========================================
   مراقبة البطاقات الجديدة
========================================= */

function startReviewsObserver() {

  /*
     متغير لمنع تشغيل initReviews
     عشرات المرات في نفس اللحظة
  */

  let observerTimer =
    null;


  const observer =
    new MutationObserver(
      mutations => {

        let hasNewReviewSection =
          false;


        mutations.forEach(
          mutation => {

            if (
              !mutation.addedNodes ||
              !mutation.addedNodes.length
            ) {

              return;

            }


            mutation.addedNodes.forEach(
              node => {

                /*
                   نفحص فقط العناصر الجديدة
                   التي تحتوي على reviews-section
                */

                if (
                  node.nodeType === 1 &&
                  (
                    node.matches?.(
                      ".reviews-section"
                    ) ||
                    node.querySelector?.(
                      ".reviews-section"
                    )
                  )
                ) {

                  hasNewReviewSection =
                    true;

                }

              }
            );

          }
        );


        /*
           إذا لم تتم إضافة قسم تقييم جديد
           لا نفعل أي شيء
        */

        if (
          !hasNewReviewSection
        ) {

          return;

        }


        /*
           تأخير بسيط وتجميع التغييرات
           لمنع الطلبات المتكررة
        */

        clearTimeout(
          observerTimer
        );


        observerTimer =
          setTimeout(
            () => {

              initReviews();

            },
            150
          );

      }
    );


  /*
     نراقب body فقط لاكتشاف
     بطاقات الخدمات الجديدة
  */

  observer.observe(
    document.body,
    {
      childList: true,
      subtree: true
    }
  );


  return observer;

}


/* =========================================
   تشغيل النظام
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    /*
       تشغيل التقييمات الموجودة
    */

    initReviews();


    /*
       مراقبة إضافة بطاقات جديدة فقط
       بدون إعادة تحميل التقييمات القديمة
    */

    startReviewsObserver();

  }
);


/* =========================================
   نهاية reviews.js
========================================= */
