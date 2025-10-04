document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const userId = document.getElementById("login-id").value;
  const password = document.getElementById("login-pass").value;

  // ダミー認証
  if (password === "test123") {
    const token = generateToken();
    const user = {
      id: userId,
      token: token,
      email: "",
      address: ""
    };
    localStorage.setItem("sessionToken", token);
    localStorage.setItem("user", JSON.stringify(user));

    alert("ログイン成功");
    window.location.href = "mypage.html";
  } else {
    alert("ユーザーIDまたはパスワードが違います");
  }
});

function generateToken() {
  return "token-" + Math.random().toString(36).substr(2, 9);
}
