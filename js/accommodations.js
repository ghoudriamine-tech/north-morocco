/* =========================================
   🌊 شمال المغرب
   الإقامات
========================================= */

async function loadAccommodations() {

  const lists = [
    "apartmentsList",
    "hotelsList",
    "riadsList"
  ];

  try {

    const [
      accommodationsResponse,
      imagesResponse,
      videosResponse
    ] = await Promise.all([

      fetch(
        `${SUPABASE_URL}/rest/v1/accommodations?select=*`,
        {
          method: "GET",
          headers: supabaseHeaders()
        }
      ),

      fetch(
        `${SUPABASE_URL}/rest/v1/accommodation_images?select=*`,
        {
          method: "GET",
          headers: supabaseHeaders()
        }
      ),

      fetch(
        `${SUPABASE_URL}/rest/v1/accommodation_videos?select=*`,
        {
          method: "GET",
          headers: supabaseHeaders()
        }
      )

    ]);

    if (!accommodationsResponse.ok) {
      throw new Error(
        `HTTP ${accommodationsResponse.status}`
      );
    }

    if (!imagesResponse.ok) {
      throw new Error(
        `HTTP images ${imagesResponse.status}`
      );
    }

    if (!videosResponse.ok) {
      throw new Error(
        `HTTP videos ${videosResponse.status}`
      );
    }

    const data =
      await accommodationsResponse.json();

    const images =
      await imagesResponse.json();

    const videos =
      await videosResponse.json();

    const accommodationData =
      Array.isArray(data) ? data : [];

    const imageData =
      Array.isArray(images) ? images : [];

    const videoData =
      Array.isArray(videos) ? videos : [];


    /* =========================================
       ربط الصور والفيديوهات بكل إقامة
    ========================================= */

    accommodationData.forEach(item => {

      const id =
        String(item.id);


      /* الصور */

      const multipleImages =
        imageData
          .filter(image =>
            String(image.accommodation_id) === id
          )
          .map(image =>
            String(image.image_url || "").trim()
          )
          .filter(Boolean);


      if (item.image_url) {

        const oldImage =
          String(item.image_url).trim();

        if (
          oldImage &&
          !multipleImages.includes(oldImage)
        ) {
          multipleImages.unshift(oldImage);
        }
      }

      item.images =
        multipleImages;


      /* الفيديوهات */

      item.videos =
        videoData
          .filter(video =>
            String(video.accommodation_id) === id
          )
          .map(video =>
            String(video.video_url || "").trim()
          )
          .filter(Boolean);

    });


    displayAccommodations(
      accommodationData
    );


    if (typeof initReviews === "function") {
      initReviews();
    }

  } catch (error) {

    console.error(
      "Accommodations error:",
      error
    );

    lists.forEach(id => {

      const box =
        document.getElementById(id);

      if (box) {

        box.innerHTML =
          '<p class="empty">تعذر تحميل البيانات حالياً.</p>';

      }

    });
  }
}


/* =========================================
   عرض الإقامات
========================================= */

function displayAccommodations(data) {

  displayList(
    "apartmentsList",
    data,
    ["شقق مفروشة", "شقة مفروشة", "apartment"],
    "لا توجد شقق مفروشة حالياً."
  );

  displayList(
    "hotelsList",
    data,
    ["فنادق", "فندق", "hotel"],
    "لا توجد فنادق حالياً."
  );

  displayList(
    "riadsList",
    data,
    ["رياضات", "رياض", "riad"],
    "لا توجد رياضات حالياً."
  );
}


/* =========================================
   فلترة النوع
========================================= */

function displayList(
  id,
  data,
  types,
  emptyMessage
) {

  const box =
    document.getElementById(id);

  if (!box) return;

  const items =
    data.filter(item => {

      const type =
        String(item.type || "")
          .trim()
          .toLowerCase();

      return types.some(t =>
        type === t.toLowerCase()
      );

    });

  if (!items.length) {

    box.innerHTML =
      `<p class="empty">${emptyMessage}</p>`;

    return;
  }

  box.innerHTML =
    items.map(accommodationCard).join("");
}


/* =========================================
   بطاقة الإقامة
========================================= */

function accommodationCard(item) {

  const name =
    item.name || "إقامة";

  const id =
    String(item.id || "");

  const phone =
    String(item.phone || "").trim();

  let wa =
    String(item.whatsapp || phone)
      .replace(/\D/g, "");

  if (wa.startsWith("0")) {
    wa = "212" + wa.slice(1);
  }

  const price =
    item.price_per_night ??
    item.price ??
    "";


  /* الصور */

  let images =
    Array.isArray(item.images)
      ? item.images
      : [];

  if (
    !images.length &&
    item.image_url
  ) {
    images = [
      String(item.image_url)
    ];
  }


  /* الفيديوهات */

  const videos =
    Array.isArray(item.videos)
      ? item.videos
      : [];


  const galleryId =
    `accommodation-gallery-${id}`;

  const videoGalleryId =
    `accommodation-video-gallery-${id}`;


  let imageHTML = "";

  if (images.length) {

    imageHTML = `
      <div
        class="accommodation-gallery"
        id="${galleryId}"
        data-current="0"
      >

        <div class="accommodation-gallery-image">

          <img
            src="${escapeHTML(images[0])}"
            alt="${escapeHTML(name)}"
            class="accommodation-image"
            loading="lazy"
          >

        </div>

        ${
          images.length > 1
            ? `
              <div class="accommodation-gallery-controls">

                <button
                  type="button"
                  class="gallery-arrow"
                  onclick="changeAccommodationImage('${escapeJS(galleryId)}', -1)"
                >
                  ❮
                </button>

                <span class="gallery-counter">
                  1 / ${images.length}
                </span>

                <button
                  type="button"
                  class="gallery-arrow"
                  onclick="changeAccommodationImage('${escapeJS(galleryId)}', 1)"
                >
                  ❯
                </button>

              </div>
            `
            : ""
        }

      </div>
    `;
  }


  /* فيديو واحد + أسهم */

  let videoHTML = "";

  if (videos.length) {

    videoHTML = `
      <div
        class="accommodation-video-gallery"
        id="${videoGalleryId}"
        data-current="0"
      >

        <video
          class="accommodation-video"
          controls
          playsinline
          preload="metadata"
        >
          <source
            src="${escapeHTML(videos[0])}"
            type="video/mp4"
          >
        </video>

        ${
          videos.length > 1
            ? `
              <div class="accommodation-gallery-controls">

                <button
                  type="button"
                  class="gallery-arrow"
                  onclick="changeAccommodationVideo('${escapeJS(videoGalleryId)}', -1)"
                >
                  ❮
                </button>

                <span class="gallery-counter">
                  1 / ${videos.length}
                </span>

                <button
                  type="button"
                  class="gallery-arrow"
                  onclick="changeAccommodationVideo('${escapeJS(videoGalleryId)}', 1)"
                >
                  ❯
                </button>

              </div>
            `
            : ""
        }

      </div>
    `;
  }


  return `
    <div class="accommodation-card">

      ${imageHTML}

      ${videoHTML}

      <h3>
        ${escapeHTML(name)}
      </h3>

      ${
        item.city
          ? `<p>📍 ${escapeHTML(item.city)}</p>`
          : ""
      }

      ${
        item.address
          ? `<p>📌 ${escapeHTML(item.address)}</p>`
          : ""
      }

      ${
        item.description
          ? `<p>${escapeHTML(item.description)}</p>`
          : ""
      }

      ${
        price !== ""
          ? `<p>💰 ${escapeHTML(price)} درهم / ليلة</p>`
          : ""
      }

      <div class="accommodation-buttons">

        ${
          phone
            ? `
              <a
                class="btn"
                href="tel:${escapeHTML(phone)}"
                aria-label="اتصال"
              >📞</a>
            `
            : ""
        }

        ${
          wa
            ? `
              <a
                class="btn whatsapp-accommodation"
                href="https://wa.me/${wa}"
                target="_blank"
                rel="noopener"
                aria-label="واتساب"
              >💬</a>
            `
            : ""
        }

        ${
          item.map_url
            ? `
              <a
                class="btn"
                href="${escapeHTML(item.map_url)}"
                target="_blank"
                rel="noopener"
                aria-label="الموقع"
              >📍</a>
            `
            : ""
        }

        <button
          type="button"
          class="btn"
          aria-label="طلب خدمة"
          onclick="selectService(
            'accommodation',
            '${escapeJS(id)}',
            '${escapeJS(name)}'
          )"
        >📋</button>

      </div>

      ${
        typeof renderReviews === "function"
          ? renderReviews(
              "accommodation",
              id
            )
          : ""
      }

    </div>
  `;
}


/* =========================================
   تغيير الصورة
========================================= */

function changeAccommodationImage(
  galleryId,
  direction
) {

  const gallery =
    document.getElementById(galleryId);

  if (!gallery) return;

  const images =
    window.accommodationGalleryImages?.[galleryId];

  if (!images || !images.length) return;

  let current =
    parseInt(
      gallery.dataset.current || "0",
      10
    );

  current += direction;

  if (current < 0) {
    current = images.length - 1;
  }

  if (current >= images.length) {
    current = 0;
  }

  gallery.dataset.current =
    String(current);

  const img =
    gallery.querySelector(
      ".accommodation-image"
    );

  if (img) {
    img.src = images[current];
  }

  const counter =
    gallery.querySelector(
      ".gallery-counter"
    );

  if (counter) {
    counter.textContent =
      `${current + 1} / ${images.length}`;
  }
}


/* =========================================
   تغيير الفيديو
========================================= */

function changeAccommodationVideo(
  galleryId,
  direction
) {

  const gallery =
    document.getElementById(galleryId);

  if (!gallery) return;

  const videos =
    window.accommodationGalleryVideos?.[galleryId];

  if (!videos || !videos.length) return;

  let current =
    parseInt(
      gallery.dataset.current || "0",
      10
    );

  current += direction;

  if (current < 0) {
    current = videos.length - 1;
  }

  if (current >= videos.length) {
    current = 0;
  }

  gallery.dataset.current =
    String(current);

  const video =
    gallery.querySelector(
      ".accommodation-video"
    );

  if (video) {

    video.pause();

    video.src =
      videos[current];

    video.load();

    video.play().catch(() => {});
  }

  const counter =
    gallery.querySelector(
      ".gallery-counter"
    );

  if (counter) {

    counter.textContent =
      `${current + 1} / ${videos.length}`;

  }
}


/* =========================================
   تجهيز الصور والفيديوهات
========================================= */

window.accommodationGalleryImages = {};

window.accommodationGalleryVideos = {};

const originalDisplayList =
  displayList;

displayList =
  function(
    id,
    data,
    types,
    emptyMessage
  ) {

    originalDisplayList(
      id,
      data,
      types,
      emptyMessage
    );

    data.forEach(item => {

      const itemId =
        String(item.id || "");

      const images =
        Array.isArray(item.images)
          ? item.images
          : [];

      const videos =
        Array.isArray(item.videos)
          ? item.videos
          : [];

      if (images.length) {

        const galleryId =
          `accommodation-gallery-${itemId}`;

        window.accommodationGalleryImages[
          galleryId
        ] = images;
      }

      if (videos.length) {

        const videoGalleryId =
          `accommodation-video-gallery-${itemId}`;

        window.accommodationGalleryVideos[
          videoGalleryId
        ] = videos;
      }

    });

  };
