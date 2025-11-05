document.addEventListener("DOMContentLoaded", () => {
  const clickSound = document.getElementById("clickSound");
  const changeThemeBtn = document.getElementById("changeColorBtn");
  const dateEl = document.getElementById("currentDateTime");
  const readMoreBtn = document.getElementById("readMoreBtn");
  const extraText = document.getElementById("extraText");
  const counterEl = document.querySelector(".counter");
  const searchInput = document.querySelector(".form-control[placeholder='Поиск...']");
  const cartIcon = document.querySelector("a.fs-4.me-3.text-decoration-none.text-white");
  
  /* 🛒 Создаём popup корзины */
  const cartModal = document.createElement("div");
  cartModal.id = "cartModal";
  cartModal.className = "popup-form";
  cartModal.innerHTML = `
    <div class="popup-content position-relative">
      <span id="closeCart" class="close-btn">&times;</span>
      <h4>Ваша корзина</h4>
      <ul id="cartItems" class="list-group my-3"></ul>
      <p id="emptyCartMsg" class="text-muted">Корзина пуста</p>
      <button id="clearCart" class="btn btn-danger w-100 mt-2">Очистить корзину</button>
    </div>
  `;
  document.body.appendChild(cartModal);

  const closeCart = document.getElementById("closeCart");
  const cartItems = document.getElementById("cartItems");
  const emptyCartMsg = document.getElementById("emptyCartMsg");
  const clearCart = document.getElementById("clearCart");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // === 🔊 Клик звук ===
  function playClick() {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});
    }
  }

  // === 🌙 Тема (сохраняется в localStorage) ===
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") document.body.classList.add("light-theme");

  changeThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    const currentTheme = document.body.classList.contains("light-theme") ? "light" : "dark";
    localStorage.setItem("theme", currentTheme);
    playClick();
  });

  // === 🕒 Текущее время ===
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

  // === 📖 Read More ===
  if (readMoreBtn) {
    readMoreBtn.addEventListener("click", () => {
      extraText.classList.toggle("visible");
      readMoreBtn.textContent = extraText.classList.contains("visible") ? "Скрыть" : "Читать далее";
      playClick();
    });
  }

  // === 🔢 Animated Counter ===
  if (counterEl) {
    let target = parseInt(counterEl.dataset.target) || 10;
    let count = 0;
    const step = target / 100;
    const interval = setInterval(() => {
      count += step;
      if (count >= target) {
        counterEl.textContent = target;
        clearInterval(interval);
      } else counterEl.textContent = Math.floor(count);
    }, 20);
  }

  // === 🌈 Fade-in + Scroll progress bar ===
  const progressBar = document.createElement("div");
  progressBar.id = "scrollProgress";
  progressBar.style.cssText = "position:fixed;top:0;left:0;height:4px;background:#ff9800;width:0;z-index:9999;";
  document.body.prepend(progressBar);

  window.addEventListener("scroll", () => {
    const scroll = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const width = (scroll / height) * 100;
    progressBar.style.width = width + "%";

    document.querySelectorAll(".fade-in").forEach((el) => {
      const top = el.getBoundingClientRect().top;
      if (top < window.innerHeight - 50) el.classList.add("show");
    });
  });

  document.querySelectorAll(".fade-in").forEach((el, i) => {
    setTimeout(() => el.classList.add("show"), 200 * i);
  });

  // === 🛒 Корзина ===
  function renderCart() {
    cartItems.innerHTML = "";
    if (cart.length === 0) {
      emptyCartMsg.style.display = "block";
    } else {
      emptyCartMsg.style.display = "none";
      cart.forEach((item, i) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
          <span>${item.title}</span>
          <span class="text-warning">${item.price}</span>
          <button class="btn btn-sm btn-danger removeItem" data-index="${i}">✖</button>
        `;
        cartItems.appendChild(li);
      });
    }
  }

  // Добавление товара (пример из каталога)
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("buy-btn")) {
      const card = e.target.closest(".card");
      const title = card.querySelector(".card-title").textContent;
      const price = card.querySelector(".card-text")?.textContent || "—";
      cart.push({ title, price });
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
      playClick();
    }
  });

  // Открытие/закрытие корзины
  cartIcon?.addEventListener("click", (e) => {
    e.preventDefault();
    renderCart();
    cartModal.classList.add("active");
    document.body.style.overflow = "hidden";
    playClick();
  });
  closeCart?.addEventListener("click", () => {
    cartModal.classList.remove("active");
    document.body.style.overflow = "auto";
  });
  window.addEventListener("click", (e) => {
    if (e.target === cartModal) cartModal.classList.remove("active");
  });

  // Очистка корзины
  clearCart.addEventListener("click", () => {
    cart = [];
    localStorage.removeItem("cart");
    renderCart();
    playClick();
  });

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("removeItem")) {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
  });
});
