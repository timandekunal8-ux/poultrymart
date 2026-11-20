
// ==================================================
// POULTRYMART - COMPLETE SCRIPT.JS
// ==================================================


// ==================================================
// 1. BUSINESS SETTINGS
// ==================================================

const WHATSAPP_NUMBER = "918149632676";


// ==================================================
// 2. PRODUCTS
// ==================================================

const products = [
  {
    id: 1,
    name: "Fresh desi Chicken",
    price: 700,
    unit: "kg",
    image: "images/chicken.png"
  },
  {
    id: 2,
    name: "Brown Farm Eggs",
    price: 15,
    unit: "piece",
    image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=600"
  }
];


// ==================================================
// 3. GLOBAL VARIABLES
// ==================================================

let cart = [];

const shopQuantities = {};


// ==================================================
// 4. LOAD CART
// ==================================================

function loadCart() {
  try {
    const saved = localStorage.getItem("poultryCart");
    cart = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(cart)) {
      cart = [];
    }
  } catch (error) {
    console.error("Cart loading error:", error);
    cart = [];
  }
}

loadCart();


// ==================================================
// 5. SAVE CART
// ==================================================

function saveCart() {
  localStorage.setItem(
    "poultryCart",
    JSON.stringify(cart)
  );

  updateCartCount();
}


// ==================================================
// 6. CART COUNT
// ==================================================

function updateCartCount() {
  const count = cart.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  ["cartCount", "cart-count"].forEach(function(id) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = count;
    }
  });
}


// ==================================================
// 7. PAGE NAVIGATION
// ==================================================

function showPage(page) {

  const pages = [
    "homePage",
    "shopPage",
    "cartPage",
    "ordersPage"
  ];

  pages.forEach(function(id) {
    const element = document.getElementById(id);

    if (element) {
      element.classList.add("hidden");
    }
  });

  const selectedPage = document.getElementById(page + "Page");

  if (selectedPage) {
    selectedPage.classList.remove("hidden");
  }

  if (page === "shop") {
    renderProducts();
  }

  if (page === "cart") {
    renderCart();
  }

  if (page === "orders") {
    renderOrders();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// ==================================================
// 8. DISPLAY PRODUCTS
// ==================================================

function renderProducts() {

  const list = document.getElementById("productList");

  if (!list) {
    console.error("productList not found in HTML.");
    return;
  }

  list.innerHTML = products.map(function(product) {

    const quantity = shopQuantities[product.id] ?? 1;

    return `
      <div class="product-card">

        <img
          src="${product.image}"
          alt="${product.name}"
          onerror="this.style.display='none'"
        >

        <div class="product-info">

          <h3>${product.name}</h3>

          <p>Fresh quality farm product</p>

          <div class="price">
            ₹${product.price} / ${product.unit}
          </div>

          <div class="quantity-selector">

            <button
              type="button"
              onclick="changeShopQuantity(${product.id}, -1)">
              −
            </button>

            <span id="shopQty-${product.id}">
              ${quantity}
            </span>

            <button
              type="button"
              onclick="changeShopQuantity(${product.id}, 1)">
              +
            </button>

          </div>

          <button
            type="button"
            class="add-btn"
            onclick="addSelectedQuantity(${product.id})">
            Add to Cart
          </button>

        </div>
      </div>
    `;

  }).join("");
}


// ==================================================
// 9. CHANGE SHOP QUANTITY
// ==================================================

function changeShopQuantity(id, amount) {

  const current = shopQuantities[id] ?? 1;

  shopQuantities[id] = Math.max(
    0.5,
    Math.round((current + amount * 0.5) * 2) / 2
  );

  const display = document.getElementById("shopQty-" + id);

  if (display) {
    display.textContent = shopQuantities[id];
  }

}
// ==================================================
// 10. ADD PRODUCT TO CART
// ==================================================
function addSelectedQuantity(id) {

  const product = products.find(item => item.id === id);

  if (!product) return;

  const quantity = shopQuantities[id] ?? 1;

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity = Math.round(
      (existing.quantity + quantity) * 2
    ) / 2;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      quantity: quantity
    });
  }

  saveCart();

  shopQuantities[id] = 1;

  renderProducts();

  alert(quantity + " " + product.unit + " added to cart!");

}


// ==================================================
// 11. DISPLAY CART
// ==================================================

function renderCart() {

  const container = document.getElementById("cartItems");

  const totalElement = document.getElementById("cartTotal");

  if (!container) return;

  if (cart.length === 0) {

    container.innerHTML = "<p>Your cart is empty.</p>";

    if (totalElement) {
      totalElement.textContent = "₹0";
    }

    updateCartCount();

    return;
  }

  let total = 0;

  container.innerHTML = cart.map(function(item) {

    const itemTotal = item.price * item.quantity;

    total += itemTotal;

    return `
      <div class="cart-item">

        <div>
          <h3>${item.name}</h3>
          <p>₹${item.price} / ${item.unit}</p>
          <p>Subtotal: ₹${itemTotal}</p>
        </div>

        <div class="quantity-selector">

          <button onclick="changeQuantity(${item.id}, -1)">
            −
          </button>

          <span>${item.quantity}</span>

          <button onclick="changeQuantity(${item.id}, 1)">
            +
          </button>

        </div>

        <button onclick="removeFromCart(${item.id})">
          Remove
        </button>

      </div>
    `;

  }).join("");

  if (totalElement) {
    totalElement.textContent = "₹" + total;
  }

  updateCartCount();
}


// ==================================================
// 12. CHANGE CART QUANTITY
// ==================================================

function changeQuantity(id, amount) {

  const item = cart.find(item => item.id === id);

  if (!item) return;

  item.quantity = Math.round(
    (item.quantity + amount * 0.5) * 2
  ) / 2;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== id);
  }

  saveCart();

  renderCart();
}




// ==================================================
// 13. REMOVE CART ITEM
// ==================================================

function removeFromCart(id) {

  cart = cart.filter(item => item.id !== id);

  saveCart();

  renderCart();
}


// ==================================================
// 14. GET LOCAL ORDERS
// ==================================================

function getOrders() {

  try {
    return JSON.parse(
      localStorage.getItem("poultryOrders") || "[]"
    );
  } catch (error) {
    return [];
  }
}


// ==================================================
// 15. DISPLAY MY ORDERS
// ==================================================

async function renderOrders() {

  const container = document.getElementById("ordersList");

  if (!container) return;

  container.innerHTML = "<p>Loading your orders...</p>";

  try {

    if (
      typeof window.getCustomerOrdersFromFirebase !== "function"
    ) {
      throw new Error("Firebase order service is not loaded.");
    }

    const orders =
      await window.getCustomerOrdersFromFirebase();

    if (!orders.length) {

      container.innerHTML = "<p>No orders found.</p>";

      return;
    }

    container.innerHTML = orders.map(function(order) {

      const items = Array.isArray(order.items)
        ? order.items
        : [];

      return `
        <div class="order-card">

          <h3>Order #${order.id}</h3>

          <p><strong>Name:</strong> ${order.name || ""}</p>

          <p><strong>Phone:</strong> ${order.phone || ""}</p>

          <p><strong>Address:</strong> ${order.address || ""}</p>

          <p><strong>Status:</strong> ${order.status || "Pending"}</p>

          <h4>Items</h4>

          ${items.map(item => `
            <p>
              ${item.name} × ${item.quantity} ${item.unit}
            </p>
          `).join("")}

          <h3>Total: ₹${order.total}</h3>

        </div>
      `;

    }).join("");

  } catch (error) {

    console.error("Orders loading error:", error);

    container.innerHTML =
      "<p>Unable to load orders. Please refresh and try again.</p>";

  }
}


// ==================================================
// 16. PLACE ORDER
// ==================================================

async function placeOrder() {

  if (cart.length === 0) {

    alert("Your cart is empty!");

    return;
  }

  const nameElement = document.getElementById("customerName");
  const phoneElement = document.getElementById("customerPhone");
  const addressElement = document.getElementById("customerAddress");

  if (!nameElement || !phoneElement || !addressElement) {

    alert("Customer order form fields are missing from HTML.");

    return;
  }

  const name = nameElement.value.trim();
  const phone = phoneElement.value.trim();
  const address = addressElement.value.trim();

  if (!name || !phone || !address) {

    alert("Please enter your name, phone number and address.");

    return;
  }

  if (!/^[6-9]\d{9}$/.test(phone)) {

    alert("Please enter a valid 10-digit Indian mobile number.");

    return;
  }

  const total = cart.reduce(function(sum, item) {

    return sum + item.price * item.quantity;

  }, 0);

  const order = {

    id: Date.now(),

    name: name,

    phone: phone,

    address: address,

    items: cart.map(item => ({ ...item })),

    total: total,

    status: "WhatsApp confirmation pending",

    date: new Date().toLocaleString("en-IN")

  };

  try {

    if (typeof window.saveOrderToFirebase !== "function") {

      throw new Error("Firebase order service is not loaded.");

    }

    // SAVE ORDER TO FIREBASE
    await window.saveOrderToFirebase(order);


    // SAVE LOCAL ORDER HISTORY
    const previousOrders = getOrders();

    previousOrders.unshift(order);

    localStorage.setItem(
      "poultryOrders",
      JSON.stringify(previousOrders)
    );


    // CREATE WHATSAPP MESSAGE
    let message = "POULTRYMART ORDER\n\n";

    message += "Order ID: " + order.id + "\n";

    message += "Name: " + name + "\n";

    message += "Phone: " + phone + "\n";

    message += "Address: " + address + "\n\n";

    message += "ORDER ITEMS:\n";

    order.items.forEach(function(item) {

      message +=
        item.name +
        " x " +
        item.quantity +
        " " +
        item.unit +
        " = ₹" +
        (item.price * item.quantity) +
        "\n";

    });

    message += "\nTOTAL: ₹" + total;

    message += "\n\nPlease confirm my order.";


    const whatsappURL =
      "https://wa.me/" +
      WHATSAPP_NUMBER +
      "?text=" +
      encodeURIComponent(message);


    // CLEAR CART AFTER SUCCESSFUL SAVE
    cart = [];

    saveCart();

    renderCart();


    // CLEAR CUSTOMER FORM
    nameElement.value = "";

    phoneElement.value = "";

    addressElement.value = "";


    alert("Order saved successfully!");

    // OPEN WHATSAPP
    window.location.href = whatsappURL;

  } catch (error) {

    console.error("Order placement error:", error);

    alert(
      "Order could not be saved. Please try again.\n" +
      error.message
    );

  }

}


// ==================================================
// 17. INITIALIZE WEBSITE
// ==================================================

document.addEventListener("DOMContentLoaded", function() {

  loadCart();

  updateCartCount();

  renderProducts();

  console.log("PoultryMart website loaded successfully.");

});
