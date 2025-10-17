document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.querySelector("form");
  const popupSuccess = document.getElementById("popupSuccess");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const message = document.getElementById("message");

      let isValid = true;

      // Проверка имени
      if (!name.value.trim()) {
        alert("Пожалуйста, введите имя.");
        isValid = false;
      }

      // Проверка email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        alert("Введите корректный email (например: example@mail.com).");
        isValid = false;
      }

      // Проверка сообщения
      if (!message.value.trim()) {
        alert("Введите текст сообщения.");
        isValid = false;
      }

      // Если всё корректно — показываем popup
      if (isValid && popupSuccess) {
        popupSuccess.style.display = "flex";
        contactForm.reset();
      }
    });
  }

  // Закрытие popup при клике на крестик
  const closeSuccess = document.getElementById("closeSuccess");
  if (closeSuccess && popupSuccess) {
    closeSuccess.addEventListener("click", () => {
      popupSuccess.style.display = "none";
    });
  }
});


// Popup 
const popupForm = document.getElementById("popupForm");
const closePopup = document.getElementById("closePopup");
const buyPopup = document.getElementById("buyPopup");
const closeBuyPopup = document.getElementById("closeBuyPopup");
const closePopupBtn = document.getElementById("closePopupBtn");

// Открытие popup формы подписки
if (popupForm) {
  const subscribeForm = document.getElementById("subscribeForm");
  const emailInput = document.getElementById("emailInput");
  const errorMsg = document.getElementById("errorMsg");

  subscribeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailInput.value.trim())) {
      errorMsg.textContent = "Введите корректный email!";
    } else {
      errorMsg.textContent = "";
      alert("Спасибо за подписку!");
      popupForm.style.display = "none";
      subscribeForm.reset();
    }
  });

  if (closePopup) {
    closePopup.addEventListener("click", () => (popupForm.style.display = "none"));
  }
}

// Открытие popup при покупке товара
const buyButtons = document.querySelectorAll(".btn-outline-primary");
if (buyButtons && buyPopup) {
  buyButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      buyPopup.style.display = "flex";
    });
  });
}

if (buyPopup) {
  if (closeBuyPopup) closeBuyPopup.addEventListener("click", () => (buyPopup.style.display = "none"));
  if (closePopupBtn) closePopupBtn.addEventListener("click", () => (buyPopup.style.display = "none"));
}

// Закрытие popup при клике вне контента
window.addEventListener("click", (e) => {
  if (popupForm && e.target === popupForm) popupForm.style.display = "none";
  if (buyPopup && e.target === buyPopup) buyPopup.style.display = "none";
});


// CHANGE BACKGROUND
const colorBtn = document.getElementById("changeColorBtn");
if (colorBtn) {
  const colors = ["#d9fefeff", "#dbeafe", "#fff1f2", "#e9d5ff", "#fef9c3", "#dcfce7"];
  let current = 0;

  colorBtn.addEventListener("click", () => {
    document.body.style.transition = "background-color 0.6s ease";
    document.body.style.backgroundColor = colors[current];
    current = (current + 1) % colors.length;
  });
}


// CURRENT DATE & TIME
function updateDateTime() {
  const el = document.getElementById("currentDateTime");
  if (!el) return;
  const now = new Date();

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  el.textContent = now.toLocaleString("ru-RU", options);
}

updateDateTime();
setInterval(updateDateTime, 1000);

// Получаем элементы
const popupSuccess = document.getElementById('popupSuccess');
const closeSuccess = document.getElementById('closeSuccess');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');

// Функция для закрытия popup
function closePopupSuccess() {
  popupSuccess.style.display = 'none';
}

// Закрытие по клику на крестик
closeSuccess.addEventListener('click', closePopupSuccess);

// Закрытие по клику на кнопку OK
closeSuccessBtn.addEventListener('click', closePopupSuccess);

// (Дополнительно) Закрытие при клике вне popup
window.addEventListener('click', function (event) {
  if (event.target === popupSuccess) {
    closePopupSuccess();
  }
});

