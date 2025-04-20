document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const isHidden = mobileMenu.classList.contains("hidden");

      if (isHidden) {
        mobileMenu.classList.remove("hidden");
        setTimeout(() => {
          mobileMenu.classList.remove("-translate-y-full", "opacity-0");
          mobileMenu.classList.add("translate-y-0", "opacity-100", "flex");
        }, 10); // Delay ensures transition kicks in
      } else {
        mobileMenu.classList.remove("translate-y-0", "opacity-100");
        mobileMenu.classList.add("-translate-y-full", "opacity-0");
        setTimeout(() => {
          mobileMenu.classList.remove("flex");
          mobileMenu.classList.add("hidden");
        }, 300); // Match duration-300 from Tailwind
      }
    });
  }

  const learnMoreLinks = document.querySelectorAll(".learn-more-btn");

  learnMoreLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});
