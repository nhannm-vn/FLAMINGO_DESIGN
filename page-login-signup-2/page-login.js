document.querySelectorAll("input").forEach((item) => {
  item.addEventListener("focus", (event) => {
    item.previousElementSibling.className = "label-selected";
  });
  // khi bấm vào ô input xong bấm ra chỗ khác thì trả về trạng thái bthg nhé
  item.addEventListener("blur", (event) => {
    if (item.value == "") {
      item.previousElementSibling.className = "";
    }
  });
});

// bấm link bên này và nhảy sang bên kia
document.getElementById("registerLink").addEventListener("click", (event) => {
  if (window.innerWidth < 600) {
    document.getElementById("signUp").style.display = "block";
    document.getElementById("login").style.display = "none";
  } else {
    document.getElementById("overlay").style.transform =
      "translate(650px, -25px)";
  }
});
document.getElementById("loginLink").addEventListener("click", (event) => {
  if (window.innerWidth < 600) {
    document.getElementById("login").style.display = "block";
    document.getElementById("signUp").style.display = "none";
  } else {
    document.getElementById("overlay").style.transform =
      "translate(0px, -25px)";
  }
});
