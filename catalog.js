// =============================
// GLOBAL VARIABLES
// =============================
const body = document.body;
const productContainer = document.getElementById("productContainer");
const searchInput = document.getElementById("searchInput");
const suggestionsList = document.getElementById("suggestionsList");
const categoryButtons = document.querySelectorAll(".category-btn");
const emptyState = document.getElementById("emptyState");
const currentDateTime = document.getElementById("currentDateTime");
const clickSound = document.getElementById("clickSound");
const changeColorBtn = document.getElementById("changeColorBtn");
const buyPopup = document.getElementById("buyPopup");
const closeBuyPopup = document.getElementById("closeBuyPopup");
const closePopupBtn = document.getElementById("closePopupBtn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentCategory = "all";
let currentSearch = "";

// =============================
// PRODUCT DATA
// =============================
const products = [
  {
    id: 1,
    name: "Брюки CloseWant",
    price: 4500,
    image: "378754taHLI.avif",
    category: "men",
    description: "Стильные и удобные брюки для повседневной носки"
  },
  {
    id: 2,
    name: "Пиджак CloseWant",
    price: 15000,
    image: "358144qoFeB.avif",
    category: "men",
    description: "Элегантный пиджак для делового стиля"
  },
  {
    id: 3,
    name: "Хлопковая рубашка",
    price: 12000,
    image: "377609cirKD.avif",
    category: "men",
    description: "Комфортная рубашка из натурального хлопка"
  },
  {
    id: 4,
    name: "Спортивная кофта",
    price: 8000,
    image: "363688KBieE.avif",
    category: "women",
    description: "Уютная кофта для активного отдыха"
  },
  {
    id: 5,
    name: "Футболка многослойная",
    price: 5000,
    image: "374366g6dBs.avif",
    category: "women",
    description: "Модная футболка с уникальным дизайном"
  },
  {
    id: 6,
    name: "Белая рубашка",
    price: 11000,
    image: "shop.webp",
    category: "men",
    description: "Классическая белая рубашка"
  },
  {
    id: 7,
    name: "Пальто Urban",
    price: 13000,
    image: "shopping.webp",
    category: "men",
    description: "Теплое пальто для городского стиля"
  },
  {
    id: 8,
    name: "Футболка StreetStyle",
    price: 8000,
    image: "images/product2.webp",
    category: "men",
    description: "Уличный стиль в каждой детали"
  },
  {
    id: 9,
    name: "Кроссовки Urban",
    price: 22000,
    image: "images/product3.jpeg",
    category: "shoes",
    description: "Стильные кроссовки для города"
  },
  {
    id: 10,
    name: "Сумка Leather",
    price: 18000,
    image: "images/product4.webp",
    category: "accessories",
    description: "Качественная кожаная сумка"
  }
];

// =============================
// THEME MANAGEMENT
// =============================
function initializeTheme() {
  const savedTheme = localStorage.getItem("theme");
  const icon = changeColorBtn.querySelector("i");
  
  if (savedTheme === "light") {
    body.classList.add("light-theme");
    icon.classList.replace("fa-moon", "fa-sun");
  } else {
    body.classList.remove("light-theme");
    icon.classList.replace("fa-sun", "fa-moon");
  }

  changeColorBtn.addEventListener("click", () => {
    body.classList.toggle("light-theme");
    const icon = changeColorBtn.querySelector("i");

    if (body.classList.contains("light-theme")) {
      icon.classList.replace("fa-moon", "fa-sun");
      localStorage.setItem("theme", "light");
    } else {
      icon.classList.replace("fa-sun", "fa-moon");
      localStorage.setItem("theme", "dark");
    }
    playClickSound();
  });
}

// =============================
// PRODUCT RENDERING
// =============================
function renderProducts() {
  if (!productContainer) return;

  const filteredProducts = products.filter(product => {
    const matchesCategory = currentCategory === "all" || product.category === currentCategory;
    const matchesSearch = product.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
                         product.description.toLowerCase().includes(currentSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  productContainer.innerHTML = "";

  if (filteredProducts.length === 0) {
    emptyState.style.display = 'block';
    return;
  } else {
    emptyState.style.display = 'none';
  }

  filteredProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card fade-in';
    productCard.innerHTML = `
      <div class="product-card-image">
        <img 
          src="${product.image}" 
          alt="${product.name}" 
          class="product-image"
          loading="lazy"
          onerror="handleImageError(this)"
        >
        <div class="product-badge">Новинка</div>
      </div>
      <div class="product-card-content">
        <span class="product-category">${getCategoryName(product.category)}</span>
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">${product.price.toLocaleString('ru-RU')} ₸</p>
        <button 
          class="add-to-cart-btn"
          data-product-id="${product.id}"
          aria-label="Добавить ${product.name} в корзину"
        >
          В корзину
        </button>
      </div>
    `;
    productContainer.appendChild(productCard);
  });

  // Анимация появления
  setTimeout(() => {
    document.querySelectorAll('.fade-in').forEach(el => {
      el.classList.add('show');
    });
  }, 100);
}

function getCategoryName(category) {
  const categories = {
    "all": "Все",
    "men": "Мужская одежда",
    "women": "Женская одежда",
    "accessories": "Аксессуары",
    "shoes": "Обувь"
  };
  return categories[category] || category;
}

// =============================
// SEARCH FUNCTIONALITY
// =============================
function initializeSearch() {
  if (!searchInput) return;

  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value;
    
    if (currentSearch.length > 2) {
      showSuggestions();
    } else {
      hideSuggestions();
    }
    
    renderProducts();
  });

  searchInput.addEventListener("focus", () => {
    if (currentSearch.length > 2) {
      showSuggestions();
    }
  });

  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
      hideSuggestions();
    }
  });
}

function showSuggestions() {
  const suggestions = products
    .filter(product => 
      product.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
      product.description.toLowerCase().includes(currentSearch.toLowerCase())
    )
    .slice(0, 5);

  suggestionsList.innerHTML = "";
  
  if (suggestions.length > 0) {
    suggestions.forEach(product => {
      const suggestionItem = document.createElement("div");
      suggestionItem.className = "suggestion-item";
      suggestionItem.textContent = product.name;
      suggestionItem.addEventListener("click", () => {
        searchInput.value = product.name;
        currentSearch = product.name;
        hideSuggestions();
        renderProducts();
      });
      suggestionsList.appendChild(suggestionItem);
    });
    suggestionsList.classList.add("active");
  } else {
    hideSuggestions();
  }
}

function hideSuggestions() {
  suggestionsList.classList.remove("active");
}

// =============================
// CATEGORY FILTERS
// =============================
function initializeCategoryFilters() {
  categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      categoryButtons.forEach(btn => btn.classList.remove("active"));
      // Add active class to clicked button
      button.classList.add("active");
      
      currentCategory = button.getAttribute("data-category");
      renderProducts();
      playClickSound();
    });
  });
}

// =============================
// CART FUNCTIONALITY
// =============================
function initializeCart() {
  createCartPopup();
  updateCartCount();
  
  const cartBtn = document.getElementById("cartBtn");
  const cartPopup = document.getElementById("cartPopup");
  const closeCartPopup = document.getElementById("closeCartPopup");
  const clearCartBtn = document.getElementById("clearCartBtn");
  const checkoutBtn = document.getElementById("checkoutBtn");
  
  // Открытие/закрытие корзины
  cartBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    renderCart();
    cartPopup.classList.add("active");
    document.body.style.overflow = "hidden";
    playClickSound();
  });

  closeCartPopup?.addEventListener("click", () => {
    cartPopup.classList.remove("active");
    document.body.style.overflow = "auto";
    playClickSound();
  });

  cartPopup?.addEventListener("click", (e) => {
    if (e.target === cartPopup) {
      cartPopup.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  // Очистка корзины
  clearCartBtn?.addEventListener("click", () => {
    if (cart.length === 0) return;
    
    if (confirm("Вы уверены, что хотите очистить корзину?")) {
      cart = [];
      localStorage.removeItem("cart");
      updateCartCount();
      renderCart();
      playClickSound();
    }
  });

  // Оформление заказа
  checkoutBtn?.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Корзина пуста. Добавьте товары перед оформлением заказа.");
      return;
    }
    
    // Показываем попап успешного заказа
    showPurchaseSuccess();
    
    // Очищаем корзину после успешного заказа
    cart = [];
    localStorage.removeItem("cart");
    updateCartCount();
    renderCart();
  });

  // Обработчик для добавления товаров в корзину
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
      const productId = parseInt(e.target.getAttribute('data-product-id'));
      const product = products.find(p => p.id === productId);
      
      if (product) {
        addToCart(product);
        playClickSound();
      }
    }
  });
}

function createCartPopup() {
  if (!document.getElementById("cartPopup")) {
    const cartPopupHTML = `
      <div id="cartPopup" class="popup-form">
        <div class="popup-content cart-popup-content">
          <button id="closeCartPopup" class="close-btn" aria-label="Закрыть окно">&times;</button>
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
  }
}

function updateCartCount() {
  let cartCount = document.getElementById("cartCount");
  
  if (!cartCount) {
    cartCount = document.createElement("span");
    cartCount.id = "cartCount";
    cartCount.className = "cart-count";
    document.getElementById("cartBtn").appendChild(cartCount);
  }
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  
  if (totalItems > 0) {
    cartCount.style.display = "flex";
  } else {
    cartCount.style.display = "none";
  }
}

function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }
  
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  showAddToCartMessage(product.name);
}

function showAddToCartMessage(productName) {
  const message = document.createElement('div');
  message.className = 'cart-success-message';
  message.innerHTML = `
    <div class="cart-message-content">
      <i class="fas fa-check-circle"></i>
      <span><strong>${productName}</strong> добавлен в корзину!</span>
    </div>
  `;
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    message.classList.remove('show');
    setTimeout(() => {
      if (message.parentNode) {
        document.body.removeChild(message);
      }
    }, 300);
  }, 3000);
}

function renderCart() {
  const cartItemsList = document.getElementById("cartItemsList");
  const cartTotalEl = document.getElementById("cartTotal");
  
  if (!cartItemsList) return;
  
  cartItemsList.innerHTML = "";
  
  if (cart.length === 0) {
    cartItemsList.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-shopping-cart"></i>
        <p>Ваша корзина пуста</p>
        <small class="text-muted">Добавьте товары из каталога</small>
      </div>
    `;
    if (cartTotalEl) cartTotalEl.textContent = "0 ₸";
    return;
  }

  let total = 0;
  
  cart.forEach((item, index) => {
    const priceNumber = typeof item.price === 'number' ? item.price : parseInt(item.price.replace(/\D/g, ""));
    const itemTotal = priceNumber * item.quantity;
    total += itemTotal;
    
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.image}" alt="${item.name}" 
             onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzczNzM3Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuKGkua1t+WPi+WbvuWDjzwvdGV4dD4KPC9zdmc+'">
      </div>
      <div class="cart-item-details">
        <h5 class="cart-item-title">${item.name}</h5>
        <p class="cart-item-price">${typeof item.price === 'number' ? item.price.toLocaleString('ru-RU') + ' ₸' : item.price}</p>
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

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// =============================
// PURCHASE SUCCESS
// =============================
function initializePurchasePopup() {
  [closeBuyPopup, closePopupBtn].forEach(el => {
    if (el) el.addEventListener("click", () => {
      buyPopup.classList.remove("active");
      document.body.style.overflow = "auto";
      playClickSound();
    });
  });
  
  if (buyPopup) {
    buyPopup.addEventListener("click", (e) => {
      if (e.target === buyPopup) {
        buyPopup.classList.remove("active");
        document.body.style.overflow = "auto";
      }
    });
  }
}

function showPurchaseSuccess() {
  const cartPopup = document.getElementById("cartPopup");
  cartPopup.classList.remove("active");
  buyPopup.classList.add("active");
}

// =============================
// MOBILE MENU
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
// SCROLL PROGRESS
// =============================
function initializeScrollProgress() {
  const scrollProgress = document.getElementById("scrollProgress");
  
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
// DATE AND TIME
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
// UTILITY FUNCTIONS
// =============================
function playClickSound() {
  if (clickSound) {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.log("Audio play failed:", e));
  }
}

function handleImageError(img) {
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzczNzM3Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuKGkua1t+WPi+WbvuWDjzwvdGV4dD4KPC9zdmc+';
}

// =============================
// INITIALIZATION
// =============================
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  initializeSearch();
  initializeCategoryFilters();
  initializeCart();
  initializePurchasePopup();
  initializeTheme();
  initializeMobileMenu();
  initializeScrollProgress();
  
  updateDateTime();
  setInterval(updateDateTime, 60000);
  
  console.log("✅ Каталог CloseWant успешно загружен");
});