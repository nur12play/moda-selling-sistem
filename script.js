// === CloseWant Unified Script (для всех страниц) ===
document.addEventListener("DOMContentLoaded", () => {
  // === Общие элементы ===
  const colorBtn = document.getElementById("changeColorBtn");
  const clickSound = document.getElementById("clickSound");
  const currentDateTime = document.getElementById("currentDateTime");

  // === Popup формы (главная, контакты и т.д.) ===
  const popupForm = document.getElementById("popupForm");
  const popupSubscribeForm = document.getElementById("popupSubscribeForm");
  const emailInput = document.getElementById("emailInput");
  const errorMsg = document.getElementById("errorMsg");
  const closePopup = document.getElementById("closePopup");
  const openPopupBtn = document.getElementById("openPopupBtn");

  // === Catalog элементы ===
  const productContainer = document.getElementById("productContainer");
  const buyPopup = document.getElementById("buyPopup");
  const closeBuyPopup = document.getElementById("closeBuyPopup");
  const closePopupBtn = document.getElementById("closePopupBtn");

  // === Данные товаров (общий массив) ===
  const products = [
    { name: "Брюки CloseWant", price: 4500, category: "men", img: "378754taHLI.avif" },
    { name: "Пиджак CloseWant", price: 15000, category: "men", img: "358144qoFeB.avif" },
    { name: "Хлопковая рубашка", price: 12000, category: "men", img: "377609cirKD.avif" },
    { name: "Спортивная кофта", price: 8000, category: "women", img: "363688KBieE.avif" },
    { name: "Футболка многослойная", price: 5000, category: "women", img: "374366g6dBs.avif" },
    { name: "Кожаная сумка", price: 11000, category: "accessories", img: "shop.webp" },
    { name: "Белые кеды", price: 13000, category: "shoes", img: "shopping.webp" },
  ];

  // === Helper: звук ===
  function playClick() {
    if (!clickSound) return;
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
  }

  // === 1. Смена темы ===
  if (colorBtn) {
    colorBtn.addEventListener("click", () => {
      document.body.classList.toggle("light-theme");
      playClick();
    });
  }

  // === 2. Popup (Главная страница или Контакты) ===
  if (popupForm && popupSubscribeForm) {
    if (openPopupBtn) {
      openPopupBtn.addEventListener("click", () => {
        popupForm.classList.add("active");
        playClick();
      });
    }

    if (closePopup) {
      closePopup.addEventListener("click", () => popupForm.classList.remove("active"));
    }

    popupSubscribeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value.trim())) {
        errorMsg.textContent = "Введите корректный email!";
      } else {
        errorMsg.textContent = "";
        popupForm.classList.remove("active");
        alert("Спасибо за подписку!");
        playClick();
        popupSubscribeForm.reset();
      }
    });

    window.addEventListener("click", (e) => {
      if (e.target === popupForm) popupForm.classList.remove("active");
    });
  }

  // === 3. Отображение текущего времени (на всех страницах с id=currentDateTime) ===
  if (currentDateTime) {
    function updateDateTime() {
      const now = new Date();
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      currentDateTime.textContent = now.toLocaleString("ru-RU", options);
    }
    updateDateTime();
    setInterval(updateDateTime, 1000);
  }

  // === 4. Каталог: динамическая отрисовка ===
  if (productContainer) {
    function renderProducts(category = "all") {
      productContainer.innerHTML = "<p class='text-center text-muted'>Загрузка...</p>";
      setTimeout(() => {
        productContainer.innerHTML = "";
        const filtered =
          category === "all" ? products : products.filter((p) => p.category === category);

        filtered.forEach((p, index) => {
          const div = document.createElement("div");
          div.className = "col-sm-6 col-md-4";
          div.innerHTML = `
            <div class="card h-100 shadow-sm product-card">
              <img src="${p.img}" class="card-img-top" alt="${p.name}">
              <div class="card-body text-center">
                <h5 class="card-title fw-semibold">${p.name}</h5>
                <p class="text-warning">Цена: ${p.price}₸</p>
                <button class="btn btn-primary buy-btn">Купить</button>
              </div>
            </div>`;
          productContainer.appendChild(div);

          setTimeout(() => div.classList.add("fade-in"), index * 120);
        });

        attachBuyEvents();
      }, 300);
    }

    function attachBuyEvents() {
      document.querySelectorAll(".buy-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (buyPopup) buyPopup.classList.add("active");
          playClick();
        });
      });
    }

    document.querySelectorAll(".category-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        renderProducts(btn.dataset.category);
        playClick();
      });
    });

    renderProducts("all");
  }

  // === 5. Popup покупки (buyPopup) ===
  if (buyPopup) {
    const closeBuyPopupBtns = [closeBuyPopup, closePopupBtn];
    closeBuyPopupBtns.forEach((el) => {
      if (el) el.addEventListener("click", () => buyPopup.classList.remove("active"));
    });
    window.addEventListener("click", (e) => {
      if (e.target === buyPopup) buyPopup.classList.remove("active");
    });
  }

  // === 6. Дополнительная интерактивность (факты, клавиши и т.д.) ===
  const factBtn = document.getElementById("factBtn");
  const factDisplay = document.getElementById("factDisplay");
  const facts = [
    "Мода — это искусство самовыражения.",
    "Стиль — это язык без слов.",
    "Настоящая уверенность — это лучший аксессуар.",
  ];

  if (factBtn && factDisplay) {
    factBtn.addEventListener("click", () => {
      const randomFact = facts[Math.floor(Math.random() * facts.length)];
      factDisplay.textContent = randomFact;
      playClick();
    });
  }

  // === 7. Горячие клавиши ===
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "t":
      case "T":
        document.body.classList.toggle("light-theme");
        playClick();
        break;
      case "p":
      case "P":
        if (popupForm) popupForm.classList.add("active");
        else if (buyPopup) buyPopup.classList.add("active");
        break;
      case "Escape":
        if (popupForm) popupForm.classList.remove("active");
        if (buyPopup) buyPopup.classList.remove("active");
        break;
    }
  });
});
