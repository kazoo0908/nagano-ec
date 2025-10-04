window.onload = () => {
  const token = localStorage.getItem("sessionToken");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!token || !user || user.token !== token) {
    alert("セッションが切れています。ログインしてください");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("user-id").value = user.id || "";
  document.getElementById("email").value = user.email || "";
  document.getElementById("address").value = user.address || "";

  renderOrderHistory();
};

// ユーザー情報保存
document.getElementById("user-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  user.email = document.getElementById("email").value;
  user.address = document.getElementById("address").value;
  localStorage.setItem("user", JSON.stringify(user));
  alert("ユーザー情報を保存しました");
});

// 購入履歴表示
function renderOrderHistory() {
  const user = JSON.parse(localStorage.getItem("user"));
  const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
  const list = document.getElementById("order-history");
  list.innerHTML = "";

  orderHistory
    .filter(order => order.userId === user.id)
    .forEach(order => {
      const li = document.createElement("li");
      li.textContent = `${order.date} - ${order.items.map(i => i.name).join(", ")} (合計: ¥${order.total})`;
      list.appendChild(li);
    });
}

// ログアウト
function logout() {
  localStorage.removeItem("sessionToken");
  localStorage.removeItem("user");
  alert("ログアウトしました");
  window.location.href = "login.html";
}
