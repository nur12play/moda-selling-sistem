/* =============================================== */
/* ⚙️  Основной скрипт сайта CloseWant             */
/* =============================================== */

/* === Глобальные элементы === */
const clickSound = document.getElementById("clickSound");
const themeBtn = document.getElementById("changeColorBtn");
const dateEl = document.getElementById("currentDateTime");

/* === Воспроизведение звука клика === */
function playClick() {
  if (!clickSound) return;
  clickSound.currentTime = 0;
  clickSound.play().catch(() => {});
}

/* === Смена темы === */
function toggleTheme() {
  document.body.classList.toggle("light-theme");
  playClick();
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light-theme") ? "light" : "dark"
  );
}

/* === Восстановление темы при загрузке === */
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  }
});

/* === Событие для кнопки смены темы === */
if (themeBtn) {
  themeBtn.addEventListener("click", toggleTheme);
}

/* === Отображение текущего времени === */
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

/* =============================================== */
/* 🛍️  Каталог товаров                            */
/* =============================================== */

if (document.body.classList.contains("catalog-page")) {
  const products = [
    { name: "Брюки CloseWant", price: 4500, category: "men", img: "378754taHLI.avif" },
    { name: "Пиджак CloseWant", price: 15000, category: "men", img: "358144qoFeB.avif" },
    { name: "Хлопковая рубашка", price: 12000, category: "men", img: "377609cirKD.avif" },
    { name: "Спортивная кофта", price: 8000, category: "women", img: "363688KBieE.avif" },
    { name: "Футболка многослойная", price: 5000, category: "women", img: "374366g6dBs.avif" },
    { name: "Белая рубашка", price: 11000, category: "accessories", img: "shop.webp" },
    { name: "Пальто Urban", price: 13000, category: "shoes", img: "shopping.webp" },
    { name: "Пальто CloseWant", price: "35 000 ₸", img: "images/product1.jpeg" },
    { name: "Футболка StreetStyle", price: "8 000 ₸", img: "images/product2.webp" },
    { name: "Кроссовки Urban", price: "22 000 ₸", img: "images/product3.jpeg" },
    { name: "Сумка Leather", price: "18 000 ₸", img: "images/product4.webp" },
  ];

  const productContainer = document.getElementById("productContainer");
  const categoryButtons = document.querySelectorAll(".category-btn");
  const buyPopup = document.getElementById("buyPopup");
  const closeBuyPopup = document.getElementById("closeBuyPopup");
  const closePopupBtn = document.getElementById("closePopupBtn");

  /* === Отображение товаров === */
  function displayProducts(filter = "all") {
    if (!productContainer) return;
    productContainer.innerHTML = "";
    const filtered = filter === "all" ? products : products.filter(p => p.category === filter);

    filtered.forEach(p => {
      const card = document.createElement("div");
      card.className = "col-sm-6 col-md-4 fade-in";
      card.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${p.img}" class="card-img-top" alt="${p.name}">
          <div class="card-body text-center">
            <h5 class="card-title fw-semibold">${p.name}</h5>
            <p class="card-text text-warning">Цена: ${p.price}₸</p>
            <button class="btn btn-gold buy-btn">Купить</button>
          </div>
        </div>`;
      productContainer.appendChild(card);
    });

    setTimeout(() => {
      document.querySelectorAll(".fade-in").forEach(el => el.classList.add("show"));
    }, 100);
    addBuyEvents();
  }

  /* === Фильтрация по категориям === */
  categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      displayProducts(btn.dataset.category);
      playClick();
    });
  });

  /* === Popup покупки === */
  function addBuyEvents() {
    document.querySelectorAll(".buy-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        playClick();
        if (buyPopup) buyPopup.classList.add("active");
      });
    });
  }

  [closeBuyPopup, closePopupBtn].forEach(el => {
    if (el) el.addEventListener("click", () => buyPopup.classList.remove("active"));
  });
  window.addEventListener("click", e => {
    if (e.target === buyPopup) buyPopup.classList.remove("active");
  });

  displayProducts("all");
}

/* =============================================== */
/* 🧩 jQuery Search, Autocomplete, Highlight       */
/* =============================================== */
$(document).ready(function () {
  const $input = $("#searchInput");
  const $suggestions = $("#suggestionsList");

  /* === Task 1: Реальный поиск и фильтрация === */
  $input.on("keyup", function () {
    const query = $(this).val().toLowerCase();

    // Фильтруем карточки
    $("#productContainer .card").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(query) > -1);
    });

    // === Task 3: Подсветка совпадений ===
    if (query.length > 1) {
      $("#productContainer .card-title").each(function () {
        const text = $(this).text();
        const regex = new RegExp("(" + query + ")", "gi");
        $(this).html(text.replace(regex, "<mark>$1</mark>"));
      });
    } else {
      $("#productContainer .card-title").each(function () {
        $(this).html($(this).text());
      });
    }

    // === Task 2: Автоподсказки ===
    if (query.length > 0) {
      const suggestions = [];
      $("#productContainer .card-title").each(function () {
        const title = $(this).text();
        if (title.toLowerCase().includes(query)) suggestions.push(title);
      });

      if (suggestions.length > 0) {
        $suggestions.empty().show();
        suggestions.slice(0, 5).forEach(item => {
          $suggestions.append(`<li class="list-group-item suggestion-item">${item}</li>`);
        });
      } else {
        $suggestions.hide();
      }
    } else {
      $suggestions.hide();
    }
  });

  // Клик по подсказке
  $suggestions.on("click", ".suggestion-item", function () {
    const value = $(this).text();
    $input.val(value);
    $suggestions.hide();
    $input.trigger("keyup"); // применить фильтр
  });

  // Скрыть подсказки при клике вне
  $(document).on("click", function (e) {
    if (!$(e.target).closest("#searchInput, #suggestionsList").length) {
      $suggestions.hide();
    }
  });
});

/* =============================================== */
/* 🔊 Логирование                                  */
/* =============================================== */
function log(message) {
  if (window.console) console.log(`[CloseWant] ${message}`);
}

/* =============================================== */
/* 🧩 Инициализация                                */
/* =============================================== */
document.addEventListener("DOMContentLoaded", () => {
  log("Сайт успешно загружен и готов к работе ✅");
});
