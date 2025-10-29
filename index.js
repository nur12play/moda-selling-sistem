document.addEventListener("DOMContentLoaded", () => {
  const clickSound = document.getElementById("clickSound");
  const popupForm = document.getElementById("popupForm");
  const openPopupBtn = document.getElementById("openPopupBtn");
  const closePopup = document.getElementById("closePopup");
  const changeThemeBtn = document.getElementById("changeColorBtn");
  const factBtn = document.getElementById("factBtn");
  const factDisplay = document.getElementById("factDisplay");
  const dateEl = document.getElementById("currentDateTime");
  const productsRow = document.getElementById("productsRow");

  /* === Звук клика === */
  function playClick() {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});
    }
  }

  /* === Popup open/close === */
  if (openPopupBtn && popupForm && closePopup) {
    openPopupBtn.addEventListener("click", () => {
      popupForm.classList.add("active");
      playClick();
    });
    closePopup.addEventListener("click", () => {
      popupForm.classList.remove("active");
      playClick();
    });
    window.addEventListener("click", (e) => {
      if (e.target === popupForm) popupForm.classList.remove("active");
    });
  }

  /* === Смена темы === */
  if (changeThemeBtn) {
    changeThemeBtn.addEventListener("click", () => {
      document.body.classList.toggle("light-theme");
      playClick();
    });
  }

  /* === Факты о моде === */
  if (factBtn && factDisplay) {
    const fashionFacts = [
      "В среднем человек тратит около 6 лет своей жизни на выбор одежды.",
      "Черный цвет — самый популярный в моде по всему миру.",
      "Первая модная неделя прошла в Нью-Йорке в 1943 году.",
      "В Японии белый считается цветом траура, а не чистоты.",
    ];

    factBtn.addEventListener("click", () => {
      const fact = fashionFacts[Math.floor(Math.random() * fashionFacts.length)];
      factDisplay.textContent = fact;
      playClick();
    });
  }

  /* === Популярные товары === */
  if (productsRow) {
    const products = [
      { name: "Пальто CloseWant", price: "35 000 ₸", img: "images/product1.jpeg" },
      { name: "Футболка StreetStyle", price: "8 000 ₸", img: "images/product2.webp" },
      { name: "Кроссовки Urban", price: "22 000 ₸", img: "images/product3.jpeg" },
      { name: "Сумка Leather", price: "18 000 ₸", img: "images/product4.webp" },
    ];

    products.forEach((item) => {
      const card = document.createElement("div");
      card.className = "col-sm-6 col-md-3 fade-in";
      card.innerHTML = `
        <div class="card h-100 shadow-sm text-center bg-dark text-light border-0">
          <img data-src="${item.img}" class="card-img-top lazy-img" alt="${item.name}" style="height:250px; object-fit:cover;">
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text text-warning fw-bold">${item.price}</p>
            <button class="btn btn-gold addCartBtn">Купить</button>
          </div>
        </div>`;
      productsRow.appendChild(card);
    });
  }

  /* === Время в футере === */
  if (dateEl) {
    setInterval(() => {
      const now = new Date();
      dateEl.textContent = now.toLocaleString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }, 1000);
  }

  /* === Анимация появления элементов === */
  const fadeElems = document.querySelectorAll(".fade-in");
  fadeElems.forEach((el) => {
    setTimeout(() => el.classList.add("show"), 200);
  });
});

/* =======================================
   jQuery функционал для Assignment Tasks
======================================= */
$(document).ready(function () {
  console.log("jQuery is ready!");

  /* ===== Task 4: Scroll Progress Bar ===== */
  $(window).on("scroll", function () {
    let scrollTop = $(window).scrollTop();
    let docHeight = $(document).height() - $(window).height();
    let scrollPercent = (scrollTop / docHeight) * 100;
    $("#scrollProgress").css("width", scrollPercent + "%");
  });

  /* ===== Task 5: Animated Number Counter ===== */
  $(".count").each(function () {
    let $this = $(this);
    let countTo = $this.attr("data-count");
    $({ countNum: 0 }).animate(
      { countNum: countTo },
      {
        duration: 2000,
        easing: "swing",
        step: function () {
          $this.text(Math.floor(this.countNum));
        },
        complete: function () {
          $this.text(this.countNum + "+");
        },
      }
    );
  });

  /* ===== Task 7: Notification Toast ===== */
  function showToast(message) {
    let toast = $('<div class="toast-message">' + message + "</div>");
    $("body").append(toast);
    toast.fadeIn(400).delay(2000).fadeOut(400, function () {
      $(this).remove();
    });
  }

  // При нажатии кнопки "Купить"
  $(document).on("click", ".addCartBtn", function () {
    showToast("Товар добавлен в корзину 🛒");
  });

  // При отправке формы подписки
  $("#subscribeInlineForm").on("submit", function (e) {
    e.preventDefault();
    showToast("Спасибо за подписку!");
  });

  /* ===== Task 9: Lazy Loading Images ===== */
  $(window).on("scroll", function () {
    $("img[data-src]").each(function () {
      if (
        $(this).offset().top <
        $(window).scrollTop() + $(window).height() + 100
      ) {
        $(this).attr("src", $(this).data("src")).removeAttr("data-src");
      }
    });
  });
});
