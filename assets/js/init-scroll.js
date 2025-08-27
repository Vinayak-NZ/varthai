document.addEventListener("DOMContentLoaded", () => {
  const arrow = document.querySelector(".scroll-down .arrow");
  if (arrow) {
    arrow.addEventListener("click", () => {
      const about = document.getElementById("about");
      if (about) {
        about.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
});