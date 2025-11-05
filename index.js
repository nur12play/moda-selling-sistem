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

  /* === 🔊 Звук клика === */
  function playClick() {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});
    }
  }

  /* === 💬 Popup open/close === */
  if (openPopupBtn && popupForm && closePopup) {
    openPopupBtn.addEventListener("click", () => {
      popupForm.classList.add("active");
      popupForm.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      playClick();
    });

    closePopup.addEventListener("click", () => {
      popupForm.classList.remove("active");
      popupForm.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "auto";
      playClick();
    });

    window.addEventListener("click", (e) => {
      if (e.target === popupForm) {
        popupForm.classList.remove("active");
        popupForm.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "auto";
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        popupForm.classList.remove("active");
        popupForm.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "auto";
      }
    });
  }

  /* === 🌙 Тёмная/светлая тема с LocalStorage === */
  if (changeThemeBtn) {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") document.body.classList.add("light-theme");

    changeThemeBtn.addEventListener("click", () => {
      document.body.classList.toggle("light-theme");
      const currentTheme = document.body.classList.contains("light-theme")
        ? "light"
        : "dark";
      localStorage.setItem("theme", currentTheme);
      playClick();
      changeThemeBtn.textContent =
        currentTheme === "light" ? "🌙 Тёмный режим" : "☀️ Светлый режим";
    });

    changeThemeBtn.textContent = document.body.classList.contains("light-theme")
      ? "🌙 Тёмный режим"
      : "☀️ Светлый режим";
  }

  /* === 👗 Факты о моде === */
  if (factBtn && factDisplay) {
    const fashionFacts = [
      "В среднем человек тратит около 6 лет своей жизни на выбор одежды.",
      "Чёрный цвет — самый популярный в моде по всему миру.",
      "Первая неделя моды прошла в Нью-Йорке в 1943 году.",
      "В Японии белый считается цветом траура, а не чистоты.",
      "Мода — это искусство выражать себя без слов.",
    ];

    factBtn.addEventListener("click", () => {
      const fact = fashionFacts[Math.floor(Math.random() * fashionFacts.length)];
      factDisplay.textContent = fact;
      factDisplay.classList.add("fade-in", "show");
      playClick();
    });
  }

  /* === 🛍️ Популярные товары === */
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
        <div class="card h-100 shadow-sm text-center bg-dark text-light border-0" tabindex="0">
          <img data-src="${item.img}" class="card-img-top lazy-img" alt="${item.name}" style="height:250px; object-fit:cover;">
          <div class="card-body">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text text-warning fw-bold">${item.price}</p>
            <button class="btn btn-gold addCartBtn" aria-label="Добавить ${item.name} в корзину">Купить</button>
          </div>
        </div>`;
      productsRow.appendChild(card);
    });

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        const query = this.value.toLowerCase();
        const cards = document.querySelectorAll("#productsRow .card");
        cards.forEach((card) => {
          const name = card.querySelector(".card-title").textContent.toLowerCase();
          card.parentElement.style.display = name.includes(query) ? "block" : "none";
        });
      });
    }
  }

  /* === ⏰ Время в футере === */
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

  /* === ✨ Анимация появления элементов === */
  const fadeElems = document.querySelectorAll(".fade-in");
  fadeElems.forEach((el, i) => {
    setTimeout(() => el.classList.add("show"), i * 150);
  });
});

/* =======================================
   jQuery функционал для интерактивных задач
========================================= */
$(document).ready(function () {
  console.log("✅ jQuery инициализирован");

  /* ===== 📊 Scroll Progress Bar ===== */
  $(window).on("scroll", function () {
    let scrollTop = $(window).scrollTop();
    let docHeight = $(document).height() - $(window).height();
    let scrollPercent = (scrollTop / docHeight) * 100;
    $("#scrollProgress").css("width", scrollPercent + "%");
  });

  /* ===== 🔢 Animated Number Counter ===== */
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

  /* ===== 🔔 Notification Toast ===== */
  function showToast(message) {
    let toast = $('<div class="toast-message" role="status" aria-live="polite">' + message + "</div>");
    $("body").append(toast);
    toast.fadeIn(400).delay(2000).fadeOut(400, function () {
      $(this).remove();
    });
  }

  $(document).on("click", ".addCartBtn", function () {
    showToast("Товар добавлен в корзину 🛒");
  });

  $("#subscribeInlineForm").on("submit", function (e) {
    e.preventDefault();
    showToast("Спасибо за подписку!");
  });

  /* ===== 💤 Lazy Loading Images ===== */
  $(window).on("scroll", function () {
    $("img[data-src]").each(function () {
      if (
        $(this).offset().top <
        $(window).scrollTop() + $(window).height() + 150
      ) {
        $(this).attr("src", $(this).data("src")).removeAttr("data-src");
      }
    });
  });
});

/* === 🛒 Корзина === */
const cartIcon = document.querySelector("a[aria-label='Корзина']");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const emptyMsg = document.getElementById("emptyCartMsg");
let cart = JSON.parse(localStorage.getItem("cart")) || [];

cartIcon?.addEventListener("click", (e) => {
  e.preventDefault();
  renderCart();
  cartModal.classList.add("active");
  document.body.style.overflow = "hidden";
});

closeCart?.addEventListener("click", () => {
  cartModal.classList.remove("active");
  document.body.style.overflow = "auto";
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("addCartBtn")) {
    const card = e.target.closest(".card");
    const title = card.querySelector(".card-title").textContent;
    const price = card.querySelector(".card-text").textContent;

    cart.push({ title, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
});

function renderCart() {
  cartItems.innerHTML = "";
  if (cart.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }
  emptyMsg.style.display = "none";
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <span>${item.title}</span>
      <span class="text-warning">${item.price}</span>
      <button class="btn btn-sm btn-danger removeItem" data-index="${index}">✖</button>
    `;
    cartItems.appendChild(li);
  });
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("removeItem")) {
    const i = e.target.getAttribute("data-index");
    cart.splice(i, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
});
