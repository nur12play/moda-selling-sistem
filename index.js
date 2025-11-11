// =============================
// GLOBAL VARIABLES
// =============================
const body = document.body;
const popup = document.getElementById("popupForm");
const changeThemeBtn = document.getElementById("changeColorBtn");
const closeBtn = document.getElementById("closePopup");
const openPopupBtn = document.getElementById("openPopupBtn");
const counters = document.querySelectorAll(".count");
const scrollProgress = document.getElementById("scrollProgress");
const searchInput = document.querySelector(".search-input");
const factBtn = document.getElementById("factBtn");
const factDisplay = document.getElementById("factDisplay");
const productsRow = document.getElementById("productsRow");
const currentDateTime = document.getElementById("currentDateTime");
const popupSubscribeForm = document.getElementById("popupSubscribeForm");
const emailInput = document.getElementById("emailInput");
const errorMsg = document.getElementById("errorMsg");
const cartIcon = document.getElementById("cartIcon");

// =============================
// 0️⃣ PRODUCTS RENDERING (ИСПРАВЛЕННЫЙ)
// =============================
const products = [
  { 
    name: 'Стильное пальто', 
    price: '35 000 ₸', 
    img: 'images/product1.jpeg',
    category: 'outerwear'
  },
  { 
    name: 'Футболка премиум', 
    price: '8 000 ₸', 
    img: 'images/product2.webp',
    category: 'tops'
  },
  { 
    name: 'Дизайнерские кроссовки', 
    price: '22 000 ₸', 
    img: 'images/product3.jpeg',
    category: 'shoes'
  },
  { 
    name: 'Кожаная сумка', 
    price: '18 000 ₸', 
    img: 'images/product4.webp',
    category: 'accessories'
  }
];

function renderProducts() {
  if (!productsRow) return;

  productsRow.innerHTML = '';
  products.forEach((item, index) => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card fade-in';
    productCard.innerHTML = `
      <div class="product-card-image">
        <img 
          src="${item.img}" 
          alt="${item.name}" 
          class="product-image"
          loading="lazy"
        >
        <div class="product-badge">Новинка</div>
      </div>
      <div class="product-card-content">
        <h3 class="product-title">${item.name}</h3>
        <p class="product-price">${item.price}</p>
        <button 
          class="add-to-cart-btn"
          data-product-id="${index}"
          aria-label="Добавить ${item.name} в корзину"
        >
          В корзину
        </button>
      </div>
    `;
    productsRow.appendChild(productCard);
  });
}

// =============================
// 1️⃣ THEME SWITCHER
// =============================
function initializeTheme() {
  if (!changeThemeBtn) return;

  const savedTheme = localStorage.getItem("theme");
  const icon = changeThemeBtn.querySelector("i");
  
  if (savedTheme === "light") {
    body.classList.add("light-theme");
    icon.classList.replace("fa-moon", "fa-sun");
  } else {
    body.classList.remove("light-theme");
    icon.classList.replace("fa-sun", "fa-moon");
  }

  changeThemeBtn.addEventListener("click", () => {
    body.classList.toggle("light-theme");

    if (body.classList.contains("light-theme")) {
      icon.classList.replace("fa-moon", "fa-sun");
      localStorage.setItem("theme", "light");
    } else {
      icon.classList.replace("fa-sun", "fa-moon");
      localStorage.setItem("theme", "dark");
    }
  });
}

// =============================
// 2️⃣ POPUP MANAGEMENT
// =============================
function initializePopup() {
  if (!popup || !openPopupBtn || !closeBtn) return;

  openPopupBtn.addEventListener("click", () => {
    popup.classList.add("active");
    document.body.style.overflow = 'hidden';
  });

  closeBtn.addEventListener("click", () => {
    popup.classList.remove("active");
    document.body.style.overflow = '';
  });

  popup.addEventListener("click", (e) => {
    if (e.target === popup) {
      popup.classList.remove("active");
      document.body.style.overflow = '';
    }
  });

  // Escape key to close popup
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('active')) {
      popup.classList.remove("active");
      document.body.style.overflow = '';
    }
  });
}

// =============================
// 3️⃣ COUNTERS ANIMATION
// =============================
function animateCounters() {
  counters.forEach(counter => {
    const target = +counter.getAttribute("data-count");
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    updateCounter();
  });
}

function initializeCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const counterSection = document.querySelector('.hero-bg');
  if (counterSection) {
    observer.observe(counterSection);
  }
}

// =============================
// 4️⃣ SCROLL PROGRESS BAR
// =============================
function initializeScrollProgress() {
  if (!scrollProgress) return;

  window.addEventListener("scroll", () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercent = (scrollTop / documentHeight) * 100;
    
    scrollProgress.style.width = scrollPercent + "%";
  });
}

// =============================
// 5️⃣ SEARCH FUNCTIONALITY
// =============================
function initializeSearch() {
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
      const productName = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
      const shouldShow = productName.includes(searchTerm);
      card.style.display = shouldShow ? 'block' : 'none';
    });
  });
}

// =============================
// 6️⃣ FASHION FACTS
// =============================
const fashionFacts = [
  "Первые джинсы Levi's были созданы в 1873 году для золотоискателей.",
  "Маленькое черное платье было популяризировано Коко Шанель в 1920-х годах.",
  "Каблуки первоначально носили мужчины-всадники в Персии.",
  "Футболка стала модным предметом одежды только в 1950-х годах.",
  "Шотландский килт изначально был длинным куском ткани, обернутым вокруг тела.",
  "Первый показ мод состоялся в Париже в 1858 году.",
  "Красная подошва на туфлях Christian Louboutin защищена авторским правом.",
  "Очки Ray-Ban были первоначально разработаны для пилотов ВВС США."
];

function initializeFashionFacts() {
  if (!factBtn || !factDisplay) return;

  factBtn.addEventListener("click", () => {
    const randomIndex = Math.floor(Math.random() * fashionFacts.length);
    const randomFact = fashionFacts[randomIndex];
    
    factDisplay.textContent = randomFact;
    factDisplay.classList.add('fade-in');
    
    setTimeout(() => {
      factDisplay.classList.remove('fade-in');
    }, 300);
  });
}

// =============================
// 7️⃣ DATE AND TIME
// =============================
function updateDateTime() {
  if (!currentDateTime) return;

  const now = new Date();
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  currentDateTime.textContent = now.toLocaleDateString('ru-RU', options);
}

// =============================
// 8️⃣ FORM VALIDATION
// =============================
function initializeForms() {
  // Popup form
  if (popupSubscribeForm) {
    popupSubscribeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!email) {
        showError("Пожалуйста, введите email адрес");
        return;
      }
      
      if (!emailRegex.test(email)) {
        showError("Пожалуйста, введите корректный email адрес");
        return;
      }
      
      // Simulate successful subscription
      showError("Спасибо за подписку!", "success");
      emailInput.value = "";
      
      setTimeout(() => {
        popup.classList.remove("active");
        document.body.style.overflow = '';
        showError("", "success");
      }, 2000);
    });
  }

  // Main subscribe form
  const mainSubscribeForm = document.querySelector('.subscribe-form');
  if (mainSubscribeForm) {
    mainSubscribeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = mainSubscribeForm.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      
      if (email) {
        alert('Спасибо за подписку! Проверьте вашу почту.');
        emailInput.value = "";
      }
    });
  }
}

function showError(message, type = "error") {
  if (!errorMsg) return;
  
  errorMsg.textContent = message;
  errorMsg.className = "error-message";
  
  if (type === "error") {
    errorMsg.classList.add("text-red-500");
    errorMsg.classList.remove("text-green-500");
  } else {
    errorMsg.classList.add("text-green-500");
    errorMsg.classList.remove("text-red-500");
  }
}

// =============================
// 9️⃣ CART FUNCTIONALITY
// =============================
function initializeCart() {
  if (!cartIcon) return;

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Update cart icon with count
  function updateCartIcon() {
    const cartCount = cart.length;
    if (cartCount > 0) {
      cartIcon.innerHTML = `<i class="fas fa-shopping-cart"></i><span class="cart-count">${cartCount}</span>`;
    } else {
      cartIcon.innerHTML = '<i class="fas fa-shopping-cart"></i>';
    }
  }
  
  updateCartIcon();
  
  cartIcon.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Ваша корзина пуста');
    } else {
      const productList = cart.map(item => `• ${item.name} - ${item.price}`).join('\n');
      alert(`В вашей корзине ${cart.length} товар(ов):\n\n${productList}`);
    }
  });

  // Add to cart functionality
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
      const productId = e.target.getAttribute('data-product-id');
      const product = products[productId];
      
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartIcon();
      
      // Show success feedback
      const originalText = e.target.textContent;
      e.target.textContent = 'Добавлено!';
      e.target.style.background = '#10B981';
      
      setTimeout(() => {
        e.target.textContent = originalText;
        e.target.style.background = '';
      }, 2000);
    }
  });
}

// =============================
// 🔟 SCROLL ANIMATIONS
// =============================
function initializeScrollAnimations() {
  const fadeElements = document.querySelectorAll(".fade-in");
  
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  }, { threshold: 0.1 });

  fadeElements.forEach(el => {
    fadeObserver.observe(el);
  });
}

/* ===============================================
   🛒 УЛУЧШЕННАЯ КОРЗИНА С ФУНКЦИЕЙ ПОКУПКИ
=============================================== */

// Элементы корзины
const cartBtn = document.getElementById("cartIcon");
let cartPopup, closeCartPopup, cartItemsList, cartTotalEl, clearCartBtn, checkoutBtn, cartCount;

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Создаем попап корзины если его нет
function createCartPopup() {
    if (!document.getElementById("cartPopup")) {
        const cartPopupHTML = `
            <div id="cartPopup" class="popup-form">
                <div class="popup-content cart-popup-content">
                    <button id="closeCartPopup" class="close-btn">&times;</button>
                    <h4 class="popup-title">🛒 Ваша корзина</h4>
                    <div id="cartItemsList" class="cart-items-list"></div>
                    <div class="cart-summary">
                        <div class="cart-total">
                            <strong>Итого: <span id="cartTotal">0 ₸</span></strong>
                        </div>
                        <div class="cart-actions">
                            <button id="clearCartBtn" class="btn btn-clear">Очистить корзину</button>
                            <button id="checkoutBtn" class="btn btn-checkout">Оформить заказ</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', cartPopupHTML);
        
        // Обновляем ссылки на элементы
        cartPopup = document.getElementById("cartPopup");
        closeCartPopup = document.getElementById("closeCartPopup");
        cartItemsList = document.getElementById("cartItemsList");
        cartTotalEl = document.getElementById("cartTotal");
        clearCartBtn = document.getElementById("clearCartBtn");
        checkoutBtn = document.getElementById("checkoutBtn");
    }
}

/* === Открыть / закрыть корзину === */
function initializeCartPopup() {
    createCartPopup();
    
    cartBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        renderCart();
        cartPopup.classList.add("active");
        document.body.style.overflow = "hidden";
    });

    closeCartPopup?.addEventListener("click", () => {
        cartPopup.classList.remove("active");
        document.body.style.overflow = "auto";
    });

    cartPopup?.addEventListener("click", (e) => {
        if (e.target === cartPopup) {
            cartPopup.classList.remove("active");
            document.body.style.overflow = "auto";
        }
    });
}

/* === Обновление счетчика корзины === */
function updateCartCount() {
    if (!cartCount) {
        // Создаем счетчик если его нет
        cartCount = document.createElement('span');
        cartCount.id = 'cartCount';
        cartCount.className = 'cart-count';
        cartBtn.appendChild(cartCount);
    }
    
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    if (cart.length > 0) {
        cartCount.style.display = 'flex';
    } else {
        cartCount.style.display = 'none';
    }
}

/* === Добавление товара в корзину === */
function addToCart(product, productId) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.img,
            quantity: 1
        });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showAddToCartMessage(product.name);
}

/* === Показать сообщение о добавлении в корзину === */
function showAddToCartMessage(productName) {
    const message = document.createElement('div');
    message.className = 'cart-message';
    message.innerHTML = `
        <div class="cart-message-content">
            <i class="fas fa-check-circle"></i>
            <span>${productName} добавлен в корзину!</span>
        </div>
    `;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        message.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(message);
        }, 300);
    }, 3000);
}

/* === Отрисовка корзины === */
function renderCart() {
    if (!cartItemsList) return;
    
    cartItemsList.innerHTML = "";
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Ваша корзина пуста</p>
                <a href="catalog.html" class="btn btn-hero-primary">Перейти к покупкам</a>
            </div>
        `;
        if (cartTotalEl) cartTotalEl.textContent = "0 ₸";
        return;
    }

    let total = 0;
    
    cart.forEach((item, index) => {
        const priceNumber = parseInt(item.price.replace(/\D/g, ""));
        const itemTotal = priceNumber * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h5 class="cart-item-title">${item.name}</h5>
                <p class="cart-item-price">${item.price}</p>
                <div class="cart-item-controls">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
            </div>
            <div class="cart-item-total">
                <span class="item-total-price">${itemTotal.toLocaleString('ru-RU')} ₸</span>
                <button class="remove-item" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItemsList.appendChild(cartItem);
    });
    
    if (cartTotalEl) cartTotalEl.textContent = total.toLocaleString("ru-RU") + " ₸";
    
    // Добавляем обработчики для кнопок количества
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            updateQuantity(index, -1);
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            updateQuantity(index, 1);
        });
    });
    
    // Обработчики для удаления товаров
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.closest('.remove-item').getAttribute('data-index');
            removeFromCart(index);
        });
    });
}

/* === Обновление количества товара === */
function updateQuantity(index, change) {
    const item = cart[index];
    item.quantity += change;
    
    if (item.quantity <= 0) {
        cart.splice(index, 1);
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

/* === Удаление товара из корзины === */
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

/* === Очистка корзины === */
function initializeClearCart() {
    clearCartBtn?.addEventListener("click", () => {
        if (cart.length === 0) return;
        
        if (confirm("Вы уверены, что хотите очистить корзину?")) {
            cart = [];
            localStorage.removeItem("cart");
            updateCartCount();
            renderCart();
        }
    });
}

/* === Оформление заказа === */
function initializeCheckout() {
    checkoutBtn?.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Корзина пуста. Добавьте товары перед оформлением заказа.");
            return;
        }
        
        showCheckoutForm();
    });
}

/* === Показать форму оформления заказа === */
function showCheckoutForm() {
    const total = cart.reduce((sum, item) => {
        const priceNumber = parseInt(item.price.replace(/\D/g, ""));
        return sum + (priceNumber * item.quantity);
    }, 0);
    
    const checkoutHTML = `
        <div id="checkoutPopup" class="popup-form">
            <div class="popup-content checkout-popup-content">
                <button id="closeCheckoutPopup" class="close-btn">&times;</button>
                <h4 class="popup-title">Оформление заказа</h4>
                <form id="checkoutForm" class="checkout-form">
                    <div class="form-group">
                        <label for="customerName">Имя и фамилия *</label>
                        <input type="text" id="customerName" required class="form-input">
                    </div>
                    <div class="form-group">
                        <label for="customerPhone">Телефон *</label>
                        <input type="tel" id="customerPhone" required class="form-input">
                    </div>
                    <div class="form-group">
                        <label for="customerEmail">Email *</label>
                        <input type="email" id="customerEmail" required class="form-input">
                    </div>
                    <div class="form-group">
                        <label for="customerAddress">Адрес доставки</label>
                        <textarea id="customerAddress" class="form-input" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="customerComment">Комментарий к заказу</label>
                        <textarea id="customerComment" class="form-input" rows="3" placeholder="Пожелания к заказу..."></textarea>
                    </div>
                    <div class="order-summary">
                        <h5>Ваш заказ:</h5>
                        <div class="order-items">
                            ${cart.map(item => `
                                <div class="order-item">
                                    <span>${item.name} × ${item.quantity}</span>
                                    <span>${(parseInt(item.price.replace(/\D/g, "")) * item.quantity).toLocaleString('ru-RU')} ₸</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="order-total">
                            <strong>Итого: ${total.toLocaleString('ru-RU')} ₸</strong>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-checkout">Подтвердить заказ</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', checkoutHTML);
    
    const checkoutPopup = document.getElementById("checkoutPopup");
    const closeCheckoutPopup = document.getElementById("closeCheckoutPopup");
    const checkoutForm = document.getElementById("checkoutForm");
    
    checkoutPopup.classList.add("active");
    
    closeCheckoutPopup.addEventListener("click", () => {
        checkoutPopup.classList.remove("active");
        setTimeout(() => {
            document.body.removeChild(checkoutPopup);
        }, 300);
    });
    
    checkoutPopup.addEventListener("click", (e) => {
        if (e.target === checkoutPopup) {
            checkoutPopup.classList.remove("active");
            setTimeout(() => {
                document.body.removeChild(checkoutPopup);
            }, 300);
        }
    });
    
    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        processOrder();
    });
}

/* === Обработка заказа === */
function processOrder() {
    const name = document.getElementById("customerName").value;
    const phone = document.getElementById("customerPhone").value;
    const email = document.getElementById("customerEmail").value;
    const address = document.getElementById("customerAddress").value;
    
    // Имитация отправки заказа
    const orderData = {
        customer: { name, phone, email, address },
        items: cart,
        total: cart.reduce((sum, item) => sum + (parseInt(item.price.replace(/\D/g, "")) * item.quantity), 0),
        orderId: 'CW' + Date.now()
    };
    
    // Показываем сообщение об успехе
    showOrderSuccess(orderData);
    
    // Очищаем корзину
    cart = [];
    localStorage.removeItem("cart");
    updateCartCount();
    
    // Закрываем попапы
    document.getElementById("cartPopup").classList.remove("active");
    const checkoutPopup = document.getElementById("checkoutPopup");
    checkoutPopup.classList.remove("active");
    
    setTimeout(() => {
        document.body.removeChild(checkoutPopup);
        document.body.style.overflow = "auto";
    }, 300);
}

/* === Показать сообщение об успешном заказе === */
function showOrderSuccess(orderData) {
    const successHTML = `
        <div id="orderSuccessPopup" class="popup-form">
            <div class="popup-content success-popup-content">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h4 class="popup-title">Заказ успешно оформлен!</h4>
                <div class="order-details">
                    <p><strong>Номер заказа:</strong> ${orderData.orderId}</p>
                    <p><strong>Итого:</strong> ${orderData.total.toLocaleString('ru-RU')} ₸</p>
                    <p>Спасибо за ваш заказ! Мы свяжемся с вами в ближайшее время для подтверждения.</p>
                </div>
                <button id="closeSuccessPopup" class="btn btn-checkout">Понятно</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', successHTML);
    
    const successPopup = document.getElementById("orderSuccessPopup");
    const closeSuccessPopup = document.getElementById("closeSuccessPopup");
    
    successPopup.classList.add("active");
    
    closeSuccessPopup.addEventListener("click", () => {
        successPopup.classList.remove("active");
        setTimeout(() => {
            document.body.removeChild(successPopup);
        }, 300);
    });
}

/* === Инициализация корзины === */
function initializeCart() {
    updateCartCount();
    initializeCartPopup();
    initializeClearCart();
    initializeCheckout();
    
    // Обработчик для добавления товаров в корзину
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = e.target.getAttribute('data-product-id');
            const product = products[productId];
            
            if (product) {
                addToCart(product, productId);
            }
        }
    });
}

// =============================
// 🆕 MOBILE MENU - ИСПРАВЛЕННЫЙ
// =============================
function initializeMobileMenu() {
  const mobileMenuButton = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-nav');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      
      // Toggle menu icon
      const svg = mobileMenuButton.querySelector('svg');
      if (mobileMenu.classList.contains('active')) {
        // Change to X icon
        svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
      } else {
        // Change back to hamburger icon
        svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
      }
    });

    // Close menu when clicking on links
    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        const svg = mobileMenuButton.querySelector('svg');
        svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('active') && 
          !mobileMenu.contains(e.target) && 
          !mobileMenuButton.contains(e.target)) {
        mobileMenu.classList.remove('active');
        const svg = mobileMenuButton.querySelector('svg');
        svg.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
      }
    });
  }
}

// =============================
// INITIALIZATION
// =============================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  renderProducts();
  initializeTheme();
  initializePopup();
  initializeCounters();
  initializeScrollProgress();
  initializeSearch();
  initializeFashionFacts();
  initializeForms();
  initializeCart();
  initializeScrollAnimations();
  initializeMobileMenu();
  
  
  // Update date and time
  updateDateTime();
  setInterval(updateDateTime, 60000);
});

// =============================
// PERFORMANCE OPTIMIZATIONS
// =============================
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}


window.addEventListener('scroll', throttle(() => {}, 16));
window.addEventListener('resize', debounce(() => {}, 250));