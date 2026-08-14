$("#search").on("input", function () {
  const value = $(this).val().toLowerCase();

  $(".user_row").each(function () {
    const text = $(this).text().toLowerCase();

    if (text.includes(value)) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
});
$(".status_select").on("change", function () {
  const memberId = $(this).data("id");
  const newStatus = $(this).val();

  $.ajax({
    url: `/admin/user/update/${memberId}/${newStatus}`,
    method: "GET",
    success: function (res) {
      alert("Status successfully updated!");
    },
    error: function (err) {
      console.error(err);
      alert("An error occurred!");
    },
  });
});
$(".nav-logout").on("click", function (e) {
  e.preventDefault(); // avtomatik o'tishni to'xtatadi

  const isConfirmed = confirm("Do you really want to log out of the system?");

  if (isConfirmed) {
    window.location.href = $(this).attr("href");
  }
});
