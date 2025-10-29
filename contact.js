document.addEventListener("DOMContentLoaded", () => {
  const clickSound = document.getElementById("clickSound");
  const changeThemeBtn = document.getElementById("changeColorBtn");
  const contactForm = document.getElementById("contactForm");
  const popupSuccess = document.getElementById("popupSuccess");
  const closeSuccess = document.getElementById("closeSuccess");
  const closeSuccessBtn = document.getElementById("closeSuccessBtn");
  const dateEl = document.getElementById("currentDateTime");
  const spinner = document.getElementById("spinner");

  const copyEmailBtn = document.getElementById("copyEmailText");
  const copyPhoneBtn = document.getElementById("copyPhone");
  const emailText = document.getElementById("emailText");
  const phoneText = document.getElementById("phoneText");

  // -----------------------
  // 1️⃣ Звук клика
  // -----------------------
  function playClick() {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});
    }
  }

  // -----------------------
  // 2️⃣ Popup
  // -----------------------
  function showPopup() {
    popupSuccess.classList.add("active");
  }
  function hidePopup() {
    popupSuccess.classList.remove("active");
  }

  closeSuccess.addEventListener("click", () => {
    hidePopup();
    playClick();
  });
  closeSuccessBtn.addEventListener("click", () => {
    hidePopup();
    playClick();
  });

  // -----------------------
  // 3️⃣ Смена темы
  // -----------------------
  changeThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    playClick();
  });

  // -----------------------
  // 4️⃣ Отправка формы со spinner
  // -----------------------
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    playClick();

    spinner.style.display = "block";

    setTimeout(() => {
      spinner.style.display = "none";
      showPopup();
      contactForm.reset();
    }, 1000);
  });

  // -----------------------
  // 5️⃣ Toast уведомления
  // -----------------------
  function showToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className = "toast-notification fade-in";
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 500);
    }, 2000);
  }

  // -----------------------
  //  6️⃣ Копирование ТОЛЬКО данных компании
  // -----------------------
  if (copyEmailBtn && emailText) {
    copyEmailBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const companyEmail = emailText.textContent.trim();
      if (companyEmail && !companyEmail.includes("@example.com")) {
        navigator.clipboard.writeText(companyEmail);
        playClick();
        showToast("Email компании скопирован!");
      }
    });
  }

  if (copyPhoneBtn && phoneText) {
    copyPhoneBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const companyPhone = phoneText.textContent.trim();
      navigator.clipboard.writeText(companyPhone);
      playClick();
      showToast("Телефон компании скопирован!");
    });
  }

  // -----------------------
  // 7️⃣ Анимация появления
  // -----------------------
  function handleFadeIn() {
    document.querySelectorAll(".fade-in").forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) el.classList.add("show");
    });
  }
  window.addEventListener("scroll", handleFadeIn);
  handleFadeIn();

  // -----------------------
  // 8️⃣ Текущее время
  // -----------------------
  function updateTime() {
    const now = new Date();
    dateEl.textContent = now.toLocaleString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }
  updateTime();
  setInterval(updateTime, 1000);
});
// spinner logic for contact form
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("spinner").style.display = "inline-block"; // показать спиннер
  setTimeout(() => { // имитация отправки
    document.getElementById("spinner").style.display = "none"; // скрыть спиннер
    showPopup();
    contactForm.reset();
  }, 1000);
});

