document.addEventListener("DOMContentLoaded", () => {
  const clickSound = document.getElementById("clickSound");
  const changeThemeBtn = document.getElementById("changeColorBtn");
  const dateEl = document.getElementById("currentDateTime");
  const readMoreBtn = document.getElementById("readMoreBtn");
  const extraText = document.getElementById("extraText");
  const counterEl = document.querySelector(".counter");

  // -----------------------
  // 1️⃣ Play click sound
  // -----------------------
  function playClick() {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});
    }
  }

  // -----------------------
  // 2️⃣ Show/Hide "Read More"
  // -----------------------
  readMoreBtn.addEventListener("click", () => {
    extraText.classList.toggle("visible");
    readMoreBtn.textContent = extraText.classList.contains("visible")
      ? "Скрыть"
      : "Читать далее";
    playClick();
  });

  // -----------------------
  // 3️⃣ Theme change
  // -----------------------
  changeThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    playClick();
  });

  // -----------------------
  // 4️⃣ Fade-in animation for visible elements on load
  // -----------------------
  document.querySelectorAll(".fade-in").forEach((el, i) => {
    setTimeout(() => el.classList.add("show"), 200 * i);
  });

  // -----------------------
  // 5️⃣ Scroll progress bar
  // -----------------------
  const progressBar = document.createElement("div");
  progressBar.id = "scrollProgress";
  progressBar.style.cssText = "position:fixed;top:0;left:0;height:4px;background:#ff9800;width:0;z-index:9999;";
  document.body.prepend(progressBar);

  window.addEventListener("scroll", () => {
    const scroll = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const width = (scroll / height) * 100;
    progressBar.style.width = width + "%";

    // Fade-in on scroll
    document.querySelectorAll(".fade-in").forEach((el) => {
      const top = el.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (top < windowHeight - 50) {
        el.classList.add("show");
      }
    });
  });

  // -----------------------
  // 6️⃣ Animated counter
  // -----------------------
  if (counterEl) {
    let target = parseInt(counterEl.dataset.target) || 10;
    let count = 0;
    const increment = target / 100; // 100 шагов
    const counterInterval = setInterval(() => {
      count += increment;
      if (count >= target) {
        counterEl.textContent = target;
        clearInterval(counterInterval);
      } else {
        counterEl.textContent = Math.floor(count);
      }
    }, 20); // 20ms между шагами
  }

  // -----------------------
  // 7️⃣ Current time
  // -----------------------
  function updateTime() {
    const now = new Date();
    dateEl.textContent = now.toLocaleString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }
  updateTime();
  setInterval(updateTime, 1000);
});
