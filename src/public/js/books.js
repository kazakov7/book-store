//SEARCHING LOGIC≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈
$("#search").on("input", function () {
  const value = $(this).val().toLowerCase();

  $(".book_row").each(function () {
    const bookName = $(this).find(".book_name").text().toLowerCase();

    if (bookName.includes(value)) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
});
//ADD BOOK LOGIC≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈
$(function () {
  const $overlay = $("#add-book-overlay");
  const $openBtn = $("#openAddBookBtn");
  const $closeBtn = $("#closeAddBookBtn");
  const $cancelBtn = $(".ab-btn-cancel");
  function openModal() {
    $overlay.addClass("active");
  }

  function closeModal() {
    $overlay.removeClass("active");
  }

  $openBtn.on("click", openModal);
  $closeBtn.on("click", closeModal);
  $cancelBtn.on("click", closeModal);

  // fonga (overlay) bosilsa ham yopiladi, faqat oyna ichiga bosilsa yopilmaydi
  $overlay.on("click", function (e) {
    if (e.target === this) closeModal();
  });
});

//UPDATE BOOK LOGIC≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈
$(function () {
  const $overlay = $(".overlayy");
  const $openBtn = $(".update_book");
  const $closeBtn = $(".close-btn");
  const $cancelBtn = $("#cancelBtn");
  function openModal() {
    $overlay.addClass("active");
  }

  function closeModal() {
    $overlay.removeClass("active");
  }

  $openBtn.on("click", openModal);
  $closeBtn.on("click", closeModal);
  $cancelBtn.on("click", closeModal);

  $overlay.on("click", function (e) {
    if (e.target === this) closeModal();
  });
});
$(".update_book").on("click", function () {
  $("#bookId").val($(this).data("id"));

  $("#old-title").val($(this).data("title"));
  $("#old-author").val($(this).data("author"));
  $("#old-pages").val($(this).data("pages"));
  $("#old-stock").val($(this).data("stock"));
  $("#old-status").val($(this).data("status"));
  $("#old-price").val($(this).data("price"));
  $("#old-publishedYear").val($(this).data("published-year"));
  $("#old-isbn").val($(this).data("isbn"));
  $("#old-description").val($(this).data("description"));
  $("#old-category").val($(this).data("category"));

  $(".overlayy").addClass("active");
});

//LOGOUT LOGIC≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈
$(".nav-logout").on("click", function (e) {
  e.preventDefault(); // avtomatik o'tishni to'xtatadi

  const isConfirmed = confirm("Do you really want to log out of the system?");

  if (isConfirmed) {
    window.location.href = $(this).attr("href");
  }
});
//CHANGE BOOK STATUS LOGIC≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈
$(".status_select").on("change", function () {
  const memberId = $(this).data("id");
  const newStatus = $(this).val();

  $.ajax({
    url: `/admin/book/update`,
    method: "POST",
    success: function (res) {
      alert("Status successfully updated!");
    },
    error: function (err) {
      console.error(err);
      alert("An error occurred!");
    },
  });
});
