let cart = [];
let total = 0;

// ページロード時にセッション確認＆カート復元
window.onload = () => {
  const token = localStorage.getItem("sessionToken");
  const user = JSON.parse(localStorage.getItem("user"));
  if (token && user && user.token === token) {
    loadCart();
  } else {
    cart = [];
    total = 0;
  }
  renderCart();
};

// カート追加
function addToCart(productName, price) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("sessionToken");
  if (!user || !token || user.token !== token) {
    alert("カートに追加するにはログインしてください");
    window.location.href = "login.html";
    return;
  }
  cart.push({ name: productName, price: price });
  total += price;
  saveCart();
  renderCart();
}

// カート描画
function renderCart() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ¥${item.price}`;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "削除";
    removeBtn.onclick = () => removeFromCart(index);
    li.appendChild(removeBtn);
    cartItems.appendChild(li);
  });
  document.getElementById("total").textContent = `合計: ¥${total}`;
}

// 削除
function removeFromCart(index) {
  total -= cart[index].price;
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

// LocalStorageに保存
function saveCart() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;
  localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
}

// カート復元
function loadCart() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;
  const savedCart = localStorage.getItem(`cart_${user.id}`);
  if (savedCart) {
    cart = JSON.parse(savedCart);
    total = cart.reduce((sum, item) => sum + item.price, 0);
  } else {
    cart = [];
    total = 0;
  }
}

// 購入
function checkout() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("sessionToken");
  if (!user || !token || user.token !== token) {
    alert("購入にはログインが必要です");
    window.location.href = "login.html";
    return;
  }
  if (cart.length === 0) {
    alert("カートが空です！");
    return;
  }

  // 購入履歴に保存
  const orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];
  orderHistory.push({
    date: new Date().toLocaleString(),
    items: [...cart],
    total: total,
    userId: user.id
  });
  localStorage.setItem("orderHistory", JSON.stringify(orderHistory));

  alert(`購入（テスト）ありがとうございました！\n合計: ¥${total}`);

  // カートリセット
  cart = [];
  total = 0;
  saveCart();
  renderCart();
}
