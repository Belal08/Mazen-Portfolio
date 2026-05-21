const themeToggle = document.querySelector(".theme-toggle");
const storage = {
  get(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      return;
    }
  },
};
const savedTheme = storage.get("theme");
const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)")?.matches ?? false;

const setTheme = (theme) => {
  const isLight = theme === "light";
  document.body.classList.toggle("light-mode", isLight);

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  }
};

setTheme(savedTheme || (prefersLight ? "light" : "dark"));

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("light-mode") ? "dark" : "light";
  storage.set("theme", nextTheme);
  setTheme(nextTheme);
});

const typedTarget = document.querySelector(".typed span");

if (typedTarget) {
  const words = typedTarget.dataset.words.split(",");
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const word = words[wordIndex];
    typedTarget.textContent = word.slice(0, charIndex);

    if (!deleting && charIndex < word.length) {
      charIndex += 1;
      setTimeout(tick, 72);
      return;
    }

    if (!deleting && charIndex === word.length) {
      deleting = true;
      setTimeout(tick, 1300);
      return;
    }

    if (deleting && charIndex > 0) {
      charIndex -= 1;
      setTimeout(tick, 38);
      return;
    }

    deleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(tick, 180);
  };

  tick();
}

const counters = document.querySelectorAll("[data-count]");
let countersStarted = false;

const startCounters = () => {
  if (countersStarted) return;
  countersStarted = true;

  counters.forEach((counter) => {
    const target = Number(counter.dataset.count);
    const duration = 1200;
    const started = performance.now();

    const step = (now) => {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      const prefix = counter.dataset.prefix || "";
      const suffix = counter.dataset.suffix || "";
      counter.textContent = `${prefix}${value.toLocaleString()}${suffix}`;

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  });
};

const numberSection = document.querySelector(".numbers");

if (numberSection && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) startCounters();
    },
    { threshold: 0.25 }
  );
  observer.observe(numberSection);
} else {
  startCounters();
}
