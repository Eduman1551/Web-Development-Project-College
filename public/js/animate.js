const items = document.querySelectorAll(".card, .hero");

const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

items.forEach(function (item) {
  item.classList.add("fade-up");
  observer.observe(item);
});
