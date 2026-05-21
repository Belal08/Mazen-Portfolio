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

const carousel = document.querySelector(".work-carousel");
const prevButton = document.querySelector(".portfolio-nav.prev");
const nextButton = document.querySelector(".portfolio-nav.next");
const dotsWrap = document.querySelector(".portfolio-dots");

if (carousel) {
  const cards = [...carousel.querySelectorAll(".work-item")];
  let isDown = false;
  let startX = 0;
  let scrollStart = 0;

  const cardStep = () => {
    const card = cards[0];
    if (!card) return carousel.clientWidth;
    const styles = getComputedStyle(carousel);
    return card.getBoundingClientRect().width + parseFloat(styles.columnGap || styles.gap || 0);
  };

  const updateDots = () => {
    if (!dotsWrap || !cards.length) return;
    const index = Math.round(carousel.scrollLeft / cardStep());
    [...dotsWrap.children].forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === Math.min(index, cards.length - 1));
    });
  };

  if (dotsWrap) {
    cards.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Go to portfolio item ${index + 1}`);
      dot.addEventListener("click", () => {
        carousel.scrollTo({ left: cardStep() * index, behavior: "smooth" });
      });
      dotsWrap.appendChild(dot);
    });
  }

  prevButton?.addEventListener("click", () => {
    carousel.scrollBy({ left: -cardStep(), behavior: "smooth" });
  });

  nextButton?.addEventListener("click", () => {
    carousel.scrollBy({ left: cardStep(), behavior: "smooth" });
  });

  carousel.addEventListener("pointerdown", (event) => {
    isDown = true;
    startX = event.clientX;
    scrollStart = carousel.scrollLeft;
    carousel.classList.add("dragging");
    carousel.setPointerCapture(event.pointerId);
  });

  carousel.addEventListener("pointermove", (event) => {
    if (!isDown) return;
    carousel.scrollLeft = scrollStart - (event.clientX - startX);
  });

  const endDrag = () => {
    isDown = false;
    carousel.classList.remove("dragging");
  };

  carousel.addEventListener("pointerup", endDrag);
  carousel.addEventListener("pointercancel", endDrag);
  carousel.addEventListener("scroll", () => requestAnimationFrame(updateDots), { passive: true });
  window.addEventListener("resize", updateDots);
  updateDots();
}
