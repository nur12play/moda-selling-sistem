
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
/* 🛍️  Каталог товаров с корзиной                 */
/* =============================================== */

if (document.body.classList.contains("catalog-page")) {
  const products = [
    { name: "Брюки CloseWant", price: 4500, category: "men", img: "378754taHLI.avif" },
    { name: "Пиджак CloseWant", price: 15000, category: "men", img: "358144qoFeB.avif" },
    { name: "Хлопковая рубашка", price: 12000, category: "men", img: "377609cirKD.avif" },
    { name: "Спортивная кофта", price: 8000, category: "women", img: "363688KBieE.avif" },
    { name: "Футболка многослойная", price: 5000, category: "women", img: "374366g6dBs.avif" },
    { name: "Белая рубашка", price: 11000, category: "men", img: "shop.webp" },
    { name: "Пальто Urban", price: 13000, category: "men", img: "shopping.webp" },
    { name: "Футболка StreetStyle", price: "8 000 ₸", img: "images/product2.webp" },
    { name: "Кроссовки Urban", price: "22 000 ₸", category: "shoes", img: "images/product3.jpeg" },
    { name: "Сумка Leather", price: "18 000 ₸",category: "accessories", img: "images/product4.webp" },
  ];

  const productContainer = document.getElementById("productContainer");
  const categoryButtons = document.querySelectorAll(".category-btn");
  const buyPopup = document.getElementById("buyPopup");
  const closeBuyPopup = document.getElementById("closeBuyPopup");
  const closePopupBtn = document.getElementById("closePopupBtn");

  /* === Корзина (LocalStorage) === */
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  /* === Отображение товаров === */
  function displayProducts(filter = "all") {
    if (!productContainer) return;
    productContainer.innerHTML = "";
    const filtered = filter === "all" ? products : products.filter(p => p.category === filter);

    filtered.forEach(p => {
      const card = document.createElement("div");
      card.className = "col-sm-6 col-md-4 fade-in";
      card.innerHTML = `
        <div class="card h-100 shadow-sm bg-dark text-light border-0">
          <img src="${p.img}" class="card-img-top" alt="${p.name}" style="height:250px; object-fit:cover;">
          <div class="card-body text-center">
            <h5 class="card-title fw-semibold">${p.name}</h5>
            <p class="card-text text-warning fw-bold">${p.price.toLocaleString()} ₸</p>
            <button class="btn btn-gold buy-btn">Купить</button>
          </div>
        </div>`;
      productContainer.appendChild(card);
    });

    // Плавное появление карточек
    setTimeout(() => {
      document.querySelectorAll(".fade-in").forEach(el => el.classList.add("show"));
    }, 100);

    // Добавляем обработчики кнопок
    addBuyEvents();
  }

  /* === Фильтрация по категориям === */
  categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      categoryButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      displayProducts(btn.dataset.category);
      playClick();
    });
  });

  /* === Обработчик кнопки "Купить" === */
  function addBuyEvents() {
    document.querySelectorAll(".buy-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        playClick();
        const card = e.target.closest(".card");
        const title = card.querySelector(".card-title").textContent;
        const price = card.querySelector(".card-text").textContent;
        cart.push({ title, price });
        saveCart();

        // Показываем popup
        if (buyPopup) buyPopup.classList.add("active");
      });
    });
  }

  // Закрытие popup
  [closeBuyPopup, closePopupBtn].forEach(el => {
    if (el) el.addEventListener("click", () => {
      buyPopup.classList.remove("active");
    });
  });
  window.addEventListener("click", e => {
    if (e.target === buyPopup) buyPopup.classList.remove("active");
  });

  // Инициализация
  displayProducts("all");
}

/* =============================================== */
/* 🔍 jQuery Search + Подсказки + Подсветка        */
/* =============================================== */
$(document).ready(function () {
  const $input = $("#searchInput");
  const $suggestions = $("#suggestionsList");

  $input.on("keyup", function () {
    const query = $(this).val().toLowerCase();

    // Фильтр карточек
    $("#productContainer .card").each(function () {
      const match = $(this).text().toLowerCase().includes(query);
      $(this).parent().toggle(match);
    });

    // Подсветка совпадений
    $("#productContainer .card-title").each(function () {
      const text = $(this).text();
      if (query.length > 1) {
        const regex = new RegExp("(" + query + ")", "gi");
        $(this).html(text.replace(regex, "<mark>$1</mark>"));
      } else {
        $(this).text(text);
      }
    });

    // Автоподсказки
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
    $input.trigger("keyup");
  });

  // Скрыть подсказки при клике вне
  $(document).on("click", function (e) {
    if (!$(e.target).closest("#searchInput, #suggestionsList").length) {
      $suggestions.hide();
    }
  });
});

/* ===============================================
   🛒 Мини-корзина
=============================================== */
const cartBtn = document.getElementById("cartBtn");
const cartPopup = document.getElementById("cartPopup");
const closeCartPopup = document.getElementById("closeCartPopup");
const cartItemsList = document.getElementById("cartItemsList");
const cartTotalEl = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCartBtn");
let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* === Открыть / закрыть корзину === */
cartBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  renderCart();
  cartPopup.classList.add("active");
  document.body.style.overflow = "hidden";
  playClick();
});

closeCartPopup?.addEventListener("click", () => {
  cartPopup.classList.remove("active");
  document.body.style.overflow = "auto";
  playClick();
});

/* === Добавление товара === */
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("buy-btn")) {
    const card = e.target.closest(".card");
    const title = card.querySelector(".card-title").textContent;
    const price = card.querySelector(".card-text").textContent.replace("Цена: ", "");
    cart.push({ title, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
});

/* === Отрисовка корзины === */
function renderCart() {
  cartItemsList.innerHTML = "";
  if (cart.length === 0) {
    cartItemsList.innerHTML = `<li class="list-group-item text-center">Корзина пуста 🕳️</li>`;
    cartTotalEl.textContent = "0 ₸";
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <span>${item.title}</span>
      <span class="text-warning">${item.price}</span>
      <button class="btn btn-sm btn-danger removeItem" data-index="${index}">✖</button>
    `;
    cartItemsList.appendChild(li);
    const numericPrice = parseInt(item.price.replace(/\D/g, ""));
    if (!isNaN(numericPrice)) total += numericPrice;
  });
  cartTotalEl.textContent = total.toLocaleString("ru-RU") + " ₸";
}

/* === Удаление товара === */
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("removeItem")) {
    const index = e.target.getAttribute("data-index");
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
});

/* === Очистка корзины === */
clearCartBtn?.addEventListener("click", () => {
  cart = [];
  localStorage.removeItem("cart");
  renderCart();
});


/* =============================================== */
/* 🧩 Инициализация                                */
/* =============================================== */
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Каталог CloseWant успешно загружен");
});
