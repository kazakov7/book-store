function validateBook() {
  const title = $("#title").val();
  const author = $("#author").val();
  const pages = $("#pages").val();
  const stock = $("#stock").val();
  const category = $("#category").val();
  const language = $("#language").val();
  const price = $("#price").val();
  const publishedYear = $("#publishedYear").val();
  const isbn = $("#isbn").val();
  const images = $("#images").val();

  const fields = {
    title,
    author,
    pages,
    stock,
    category,
    language,
    price,
    publishedYear,
    isbn,
    images,
  };

  let isValid = true;
  console.log($("#ab-upload-box").length); // 0 chiqsa — element topilmayapti
  for (const key in fields) {
    if (!fields[key] || fields[key].toString().trim() === "") {
      isValid = false;

      if (key === "images") {
        $(".ab-upload-box").addClass("error");
      }
      $(`#${key}`).addClass("error");
    }
  }
  $("input").on("input focus", function () {
    $(this).removeClass("error");
  });

  $("select").on("change focus", function () {
    $(this).removeClass("error");
  });
  const isbnRegex = /^(?:\d{9}[\dXx]|\d{13})$/;
  if (!isbnRegex.test(isbn)) {
    alert("Please enter a valid ISBN!");
    return false;
  }
  if (!isValid) {
    alert("Please fill in all fields.");
    return false;
  } else {
    return true;
  }
}
const imageInput = $("#images");
const previewGrid = $("#abPreviewGrid");

imageInput.on("change", function () {
  const files = this.files;

  previewGrid.empty();

  if (!files || files.length === 0) return;

  // Max 5 ta rasm
  const selectedFiles = Array.from(files).slice(0, 5);

  selectedFiles.forEach((file) => {
    // Faqat rasm
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      const preview = $(`
        <div class="ab-preview-item">
          <img src="${e.target.result}" alt="Product image">
        </div>
      `);

      previewGrid.append(preview);
    };

    reader.readAsDataURL(file);
  });
});
