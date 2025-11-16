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

  // --- KARTE: カート追加イベント送信 ---
  krt("send", "cart_add", {
    item_id: productName === "信州りんご" ? "apple_001" :
             productName === "おやき"   ? "oyaki_002" :
                                          "sake_003",
    item_name: productName,
    category: productName === "信州りんご" ? "果物" :
              productName === "おやき"   ? "惣菜" :
                                           "酒類",
    price: price,
    quantity: 1
  });
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

  // --- KARTE: 購入イベント送信（ここが最重要） ---
  krt("send", "purchase_complete", {
    order_id: "ORD_" + Date.now(),
    total_amount: total,
    items: cart.map((item) => ({
      item_id:
        item.name === "信州りんご" ? "apple_001" :
        item.name === "おやき"     ? "oyaki_002" :
                                     "sake_003",
      item_name: item.name,
      category:
        item.name === "信州りんご" ? "果物" :
        item.name === "おやき"     ? "惣菜" :
                                     "酒類",
      price: item.price,
      quantity: 1
    }))
  });

  // カートリセット
  cart = [];
  total = 0;
  saveCart();
  renderCart();
}

// ▼ 長野県の天気取得（Open-Meteo API）
async function loadWeather() {
  const url = "https://api.open-meteo.com/v1/forecast?latitude=36.65&longitude=138.1833&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo";

  try {
    const res = await fetch(url);
    const data = await res.json();

    const weather = data.current_weather;

    const weatherBox = document.getElementById("weather-box");
    weatherBox.innerHTML = `
      <p>現在の気温：${weather.temperature}℃</p>
      <p>風速：${weather.windspeed} m/s</p>
      <p>天気コード：${weather.weathercode}</p>
    `;
  } catch (error) {
    console.error("天気APIエラー:", error);
    document.getElementById("weather-box").innerHTML = "天気情報を取得できませんでした";
  }
}

// ▼ ページ読み込み時に天気取得
window.onload = () => {
  // 既存のセッション・カート復元処理があるので補完方式で書く
  if (typeof loadCart === "function") {
    const token = localStorage.getItem("sessionToken");
    const user = JSON.parse(localStorage.getItem("user"));
    if (token && user && user.token === token) loadCart();
    renderCart();
  }

  loadWeather(); // ← 天気を読み込む
};

