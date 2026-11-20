
// =====================================
// POULTRYMART - MAIN SETTINGS
// =====================================

// Replace this with your business WhatsApp number.
// Format: country code + number, without + or spaces.
const WHATSAPP_NUMBER = "918149632676";

// Sample products. Update prices before publishing.
const products = [
  {
    id: 1,
    name: "Fresh desi Chicken",
    price: 700,
    unit: "kg",
    image: "file_00000000cf14821183f6da982d31bf25.png"
  },
  {
    id: 2,
    name: "Brown Farm Eggs",
    price: 15,
    unit: "piece",
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600"
  
  }
];

// =====================================
// LOCAL DATA
// =====================================

let cart = [];

try {
  cart = JSON.parse(localStorage.getItem("poultryCart")) || [];
  if (!Array.isArray(cart)) cart = [];
} catch {
  cart = [];
}

// =====================================
// PAGE NAVIGATION
// =====================================


function showPage(page) {
  const pages = ["home", "shop", "cart", "orders"];

  if (!pages.includes(page)) {
    console.error("Invalid page:", page);
    return;
  }

  pages.forEach(function(name) {
    const section = document.getElementById(name + "Page");

    if (section) {
      section.classList.add("hidden");
    }
  });

  const selectedPage = document.getElementById(page + "Page");

  if (!selectedPage) {
    console.error("Page not found:", page + "Page");
    return;
  }

  selectedPage.classList.remove("hidden");

  if (page === "shop") renderProducts();
  if (page === "cart") renderCart();
  if (page === "orders") renderOrders();

  window.scrollTo(0, 0);
    }
    


// =====================================
// PRODUCT DISPLAY
// =====================================

function renderProducts() {

function renderProducts() {
  const list = document.getElementById("productList");

  list.innerHTML = products.map(function(product) {
    return `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}">
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>Fresh quality poultry product</p>
          <div class="price">
            ₹${product.price} / ${product.unit}
          </div>

          <div class="quantity-selector">
            <button onclick="changeShopQuantity(${product.id}, -1)">−</button>
            <span id="shopQty-${product.id}">1</span>
            <button onclick="changeShopQuantity(${product.id}, 1)">+</button>
          </div>

          <button class="add-btn"
            onclick="addSelectedQuantity(${product.id})">
            Add to Cart
          </button>
        </div>
      </div>
    `;
  }).join("");
}

// Store selected shop quantities
const shopQuantities = {};

function changeShopQuantity(id, amount) {
  if (!shopQuantities[id]) shopQuantities[id] = 1;

  shopQuantities[id] = Math.max(
    1,
    shopQuantities[id] + amount
  );

  document.getElementById("shopQty-" + id).textContent =
    shopQuantities[id];
}

function addSelectedQuantity(id) {
  const quantity = shopQuantities[id] || 1;

  for (let i = 0; i < quantity; i++) {
    addToCart(id);
  }

  shopQuantities[id] = 1;

  const display = document.getElementById("shopQty-" + id);
  if (display) display.textContent = "1";
}


// =====================================
// CART
// =====================================

function saveCart() {
  localStorage.setItem("poultryCart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(id) {
  const product = products.find(function(item) {
    return item.id === id;
  });

  if (!product) return;

  const existing = cart.find(function(item) {
    return item.id === id;
  });

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      quantity: 1
    });
  }

  saveCart();
  alert("Product added to cart!");
}

function updateCartCount() {
  const count = cart.reduce(function(total, item) {
    return total + item.quantity;
  }, 0);

  document.getElementById("cartCount").textContent = count;
}

function renderCart() {
  const container = document.getElementById("cartItems");

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty. Visit our shop!</p>";
    document.getElementById("cartTotal").textContent = "Total: ₹0";
    return;
  }

  container.innerHTML = cart.map(function(item) {
    return `
      <div class="cart-item">
        <h3>${item.name}</h3>
        <p>₹${item.price} / ${item.unit}</p>
        <button onclick="changeQuantity(${item.id}, -1)">−</button>
        ${item.quantity}
        <button onclick="changeQuantity(${item.id}, 1)">+</button>
        <p>Subtotal: ₹${item.price * item.quantity}</p>
      </div>
    `;
  }).join("");

  const total = cart.reduce(function(sum, item) {
    return sum + item.price * item.quantity;
  }, 0);

  document.getElementById("cartTotal").textContent = "Total: ₹" + total;
}

function changeQuantity(id, amount) {
  const item = cart.find(function(product) {
    return product.id === id;
  });

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(function(product) {
      return product.id !== id;
    });
  }

  saveCart();
  renderCart();
}

// =====================================
// ORDER HISTORY
// =====================================

function getOrders() {
  try {
    const orders = JSON.parse(localStorage.getItem("poultryOrders")) || [];
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}
async function renderOrders() {
  const container = document.getElementById("orderList");

  container.innerHTML = "<p>Loading your orders...</p>";

  try {
    const orders = await window.getCustomerOrdersFromFirebase();

    if (orders.length === 0) {
      container.innerHTML = "<p>No orders yet.</p>";
      return;
    }

    container.innerHTML = orders.map(function(order) {
      return `
        <div class="order-card">
          <h3>Order ${order.id}</h3>
          <p>Date: ${order.date}</p>
          <p>Customer: ${order.name}</p>
          <p>Total: ₹${order.total}</p>
          <p><strong>Status: ${order.status}</strong></p>
        </div>
      `;
    }).join("");

  } catch (error) {
    console.error("My Orders error:", error);
    container.innerHTML =
      "<p>Unable to load orders. Please refresh.</p>";
  }
}

// =====================================
// WHATSAPP ORDER
// =====================================

async function placeOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  if (!/^91\d{10}$/.test(WHATSAPP_NUMBER)) {
    alert("Please configure your business WhatsApp number in script.js first.");
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();

  if (!name || !phone || !address) {
    alert("Please complete all delivery details.");
    return;
  }

  if (!/^\d{10}$/.test(phone)) {
    alert("Please enter a valid 10-digit mobile number.");
    return;
  }

  const total = cart.reduce(function(sum, item) {
    return sum + item.price * item.quantity;
  }, 0);

  const order = {
    id: Date.now(),
    date: new Date().toLocaleString("en-IN"),
    name: name,
    phone: phone,
    address: address,
    items: cart.map(function(item) {
      return {...item};
    }),
    total: total,
    status: "WhatsApp confirmation pending"
  };

  const orders = getOrders();
  orders.unshift(order);

  try {
  localStorage.setItem("poultryOrders", JSON.stringify(orders));

  if (typeof window.saveOrderToFirebase !== "function") {
    throw new Error("Firebase service not loaded.");
  }

  await window.saveOrderToFirebase(order);

} catch (error) {
  console.error("Order saving error:", error);
  alert("Order could not be saved. Please try again.");
  return;
  }

  
  let message = "NEW POULTRYMART ORDER\n\n";
  message += "Order ID: " + order.id + "\n";
  message += "Name: " + name + "\n";
  message += "Phone: " + phone + "\n";
  message += "Address: " + address + "\n\n";
  message += "ORDER DETAILS:\n";

  cart.forEach(function(item) {
    message += item.name + " - " + item.quantity + " " +
      item.unit + " x ₹" + item.price + "\n";
  });

  message += "\nTOTAL: ₹" + total;
  message += "\n\nPlease confirm this order.";

  const url = "https://wa.me/" + WHATSAPP_NUMBER +
    "?text=" + encodeURIComponent(message);

  const whatsappWindow = window.open(url, "_blank");

  if (!whatsappWindow) {
    window.location.href = url;
  }

  cart = [];
  saveCart();
  renderCart();

  document.getElementById("customerName").value = "";
  document.getElementById("customerPhone").value = "";
  document.getElementById("customerAddress").value = "";

  alert("Order prepared! Please send the WhatsApp message to confirm it.");
}

// =====================================
// INITIALIZE WEBSITE
// =====================================

renderProducts();
updateCartCount();
showPage("home");
