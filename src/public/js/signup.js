$(function () {
  const fileTarget = $(".input_box  #memberImage");
  let filename;

  fileTarget.on("change", function () {
    if (window.FileReader) {
      const uploadFile = $(this)[0].files[0];
      const fileType = uploadFile["type"];
      const validImageTypes = ["image/jpg", "image/jpeg", "image/png"];
      if (!validImageTypes.includes(fileType)) {
        alert("Please insert only jpg, jpeg, png");
      } else {
        if (uploadFile) {
          console.log(URL.createObjectURL(uploadFile));
          $("#inputBox").attr("src", URL.createObjectURL(uploadFile));
        }
        filename = $(this)[0].files[0].name;
      }
    }

    $(this).siblings(".upload-name").val(filename);
    console.log($(this).siblings(".upload-name"));
  });
});

function validateForm() {
  const memberNick = $("#memberNick").val();
  const memberPassword = $("#memberPassword").val();
  const memberPhone = $("#memberPhone").val();
  const confirmpass = $("#confirmPassword").val();
  const memberImage = $("#memberImage").val();
  const imgBox = $("#inputBox").val();

  if (
    memberNick == "" ||
    memberPassword == "" ||
    memberPhone == "" ||
    confirmpass == "" ||
    memberImage == ""
  ) {
    alert("Please fill in all the fields.");
    return false;
  }
  if (memberNick.length < 4 || memberPassword.length < 4) {
    alert("Nickname and password must be at least 4 characters long.");
    return false;
  }
  if (memberPassword != confirmpass) {
    alert("Passwords do not match.");
    return false;
  }
  const file = $(".memberImage").get(0).files[0];
  memberImage = file ? file.name : null;

  if (!memberImage) {
    alert("Please insert restaurant image");
    return false;
  }
}
