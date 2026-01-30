document.addEventListener("click", function (e) {
  if (!e.target.classList.contains("order-btn")) return;

  const card = e.target.closest(".book-card");
  const title = card.dataset.bookTitle;
  const price = card.dataset.bookPrice;

  // ملء الاستمارة تلقائياً
  const bookInput = document.getElementById("selectedBook");
  if (bookInput) {
    bookInput.value = `${title} — ${price}`;
  }

  // فتح الاستمارة (modal)
  const modal = document.getElementById("orderModal");
  if (modal) modal.classList.remove("hidden");
});
