"use strict";

// Products Data Array
const products = [
  {
    id: 1,
    name: "UltraBook Pro X",
    category: "laptops",
    price: 999,
    oldPrice: 1199,
    emoji: "💻",
    desc: "Slim, fast, and powerful laptop for work and study.",
    rating: 5
  },
  {
    id: 2,
    name: "Apex Pulse 5G",
    category: "phones",
    price: 699,
    oldPrice: 799,
    emoji: "📱",
    desc: "Next-gen smartphone with professional triple camera setup.",
    rating: 4
  },
  {
    id: 3,
    name: "SonicBuds ANC",
    category: "accessories",
    price: 129,
    oldPrice: 159,
    emoji: "🎧",
    desc: "Active noise-canceling wireless earbuds with immersive audio.",
    rating: 5
  },
  {
    id: 4,
    name: "CyberBeast Deck",
    category: "gaming",
    price: 1499,
    oldPrice: 1699,
    emoji: "🖥️",
    desc: "Ultimate custom gaming desktop rig for high frame rate action.",
    rating: 5
  },
  {
    id: 5,
    name: "Devin AirBook 14",
    category: "laptops",
    price: 849,
    oldPrice: 999,
    emoji: "💻",
    desc: "Lightweight aluminum laptop with incredible battery life.",
    rating: 4
  },
  {
    id: 6,
    name: "Nova Fold Ultra",
    category: "phones",
    price: 1199,
    oldPrice: 1399,
    emoji: "📱",
    desc: "Futuristic foldable display phone with multitasking power.",
    rating: 5
  },
  {
    id: 7,
    name: "Quantum Mech Keyboard",
    category: "gaming",
    price: 89,
    oldPrice: 110,
    emoji: "⌨️",
    desc: "RGB mechanical keyboard with tactile switches and custom macros.",
    rating: 4
  },
  {
    id: 8,
    name: "PowerPulse 20K",
    category: "accessories",
    price: 49,
    oldPrice: 65,
    emoji: "🔋",
    desc: "High-capacity fast-charging power bank for all your devices.",
    rating: 4
  }
];

// App State
let cart = JSON.parse(localStorage.getItem("voltzone_cart")) || [];
let currentUser = JSON.parse(localStorage.getItem("voltzone_user")) || null;
let usersList = JSON.parse(localStorage.getItem("voltzone_users")) || [
  { name: "Admin", email: "admin@gmail.com", password: "123456" }
];

let activeCategory = "all";
let searchQuery = "";
let currentSort = "default";

// DOM Elements
const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const categoryButtons = document.querySelectorAll(".cat-btn");
const cartBtn = document.getElementById("cart-btn");
const cartSidebar = document.getElementById("cart-sidebar");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalPrice = document.getElementById("cart-total-price");
const cartCountSpan = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout-btn");
const darkModeBtn = document.getElementById("dark-mode-btn");
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const navLinks = document.getElementById("nav-links");
const authBtn = document.getElementById("auth-btn");
const authModal = document.getElementById("auth-modal");
const userDisplay = document.getElementById("user-display");
const usernameSpan = document.getElementById("username-span");
const logoutBtn = document.getElementById("logout-btn");
const closeModalButtons = document.querySelectorAll(".close-modal");
const productModal = document.getElementById("product-modal");
const modalBody = document.getElementById("modal-body");
const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const loginError = document.getElementById("login-error");
const signupError = document.getElementById("signup-error");
const contactForm = document.getElementById("contact-form");
const contactFeedback = document.getElementById("contact-feedback");
const newsletterForm = document.getElementById("newsletter-form");
const newsletterFeedback = document.getElementById("newsletter-feedback");

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartUI();
  checkAuthUI();
  initDarkModeSetting();
  startCountdown();
});

// Render Products with filter, search, and sort logic
function renderProducts() {
  let filtered = products.filter(product => {
    let matchesCategory = activeCategory === "all" || product.category === activeCategory;
    let matchesSearch = product.name.toLowerCase().trim().indexOf(searchQuery.toLowerCase().trim()) !== -1;
    return matchesCategory && matchesSearch;
  });

  // Sorting
  if (currentSort === "low-high") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === "high-low") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === "az") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  productGrid.innerHTML = "";

  if (filtered.length === 0) {
    productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; opacity: 0.7;">No products found.</p>`;
    return;
  }

  filtered.forEach(product => {
    let card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-emoji">${product.emoji}</div>
      <span class="product-category">${product.category}</span>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-desc">${product.desc}</p>
      <div class="product-footer">
        <span class="product-price">$${product.price} <del>$${product.oldPrice}</del></span>
        <span class="product-rating">${"⭐".repeat(product.rating)}</span>
      </div>
      <div class="product-actions">
        <button class="btn-secondary details-btn" data-id="${product.id}">Details</button>
        <button class="btn-primary add-cart-btn" data-id="${product.id}">Add to Cart</button>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

// Search Event Listener
searchInput.addEventListener("keyup", (e) => {
  searchQuery = e.target.value;
  renderProducts();
});

// Category Filter Event Listeners
categoryButtons.forEach(button => {
  button.addEventListener("click", (e) => {
    categoryButtons.forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    activeCategory = e.target.getAttribute("data-category");
    renderProducts();
  });
});

// Sort Event Listener
sortSelect.addEventListener("change", (e) => {
  currentSort = e.target.value;
  renderProducts();
});

// Product Grid Delegation (Details and Add to Cart)
productGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("details-btn")) {
    let id = parseInt(e.target.getAttribute("data-id"));
    openProductModal(id);
  } else if (e.target.classList.contains("add-cart-btn")) {
    let id = parseInt(e.target.getAttribute("data-id"));
    addToCart(id);
  }
});

// Product Details Modal
function openProductModal(id) {
  let product = products.find(p => p.id === id);
  if (!product) return;

  modalBody.innerHTML = `
    <div style="text-align: center; font-size: 5rem; margin-bottom: 1rem;">${product.emoji}</div>
    <span style="color: var(--primary-color); font-weight: bold; text-transform: uppercase; font-size: 0.8rem;">${product.category}</span>
    <h2>${product.name}</h2>
    <p style="margin: 0.8rem 0; opacity: 0.8;">${product.desc}</p>
    <div style="display: flex; justify-content: space-between; align-items: center; margin: 1.5rem 0;">
      <span style="font-size: 1.5rem; font-weight: bold; color: var(--primary-color);">$${product.price} <del style="font-size: 1rem; color: #94a3b8;">$${product.oldPrice}</del></span>
      <span>${"⭐".repeat(product.rating)}</span>
    </div>
    <button class="btn-primary full-width modal-add-btn" data-id="${product.id}">Add to Cart</button>
  `;

  productModal.classList.add("open");

  modalBody.querySelector(".modal-add-btn").addEventListener("click", () => {
    addToCart(product.id);
    productModal.classList.remove("open");
  });
}

// Cart Sidebar Controls
cartBtn.addEventListener("click", () => cartSidebar.classList.add("open"));
closeCartBtn.addEventListener("click", () => cartSidebar.classList.remove("open"));

// Add to Cart Logic with Auth Check
function addToCart(id) {
  if (!currentUser) {
    authModal.classList.add("open");
    return;
  }

  let product = products.find(p => p.id === id);
  let existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCartUI();
  cartSidebar.classList.add("open");
}

function saveCart() {
  localStorage.setItem("voltzone_cart", JSON.stringify(cart));
}

function updateCartUI() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p style="text-align: center; opacity: 0.6; margin-top: 2rem;">Your cart is empty.</p>`;
  }

  cart.forEach(item => {
    total += item.price * item.quantity;
    count += item.quantity;

    let cartItemEl = document.createElement("div");
    cartItemEl.className = "cart-item";
    cartItemEl.innerHTML = `
      <div style="font-size: 2rem; margin-right: 1rem;">${item.emoji}</div>
      <div class="cart-item-info" style="flex: 1;">
        <h4>${item.name}</h4>
        <p>$${item.price} x ${item.quantity}</p>
      </div>
      <div class="cart-item-controls">
        <button class="decrease-btn" data-id="${item.id}">-</button>
        <span>${item.quantity}</span>
        <button class="increase-btn" data-id="${item.id}">+</button>
        <button class="remove-btn" data-id="${item.id}" style="margin-left: 0.5rem; background: #ef4444; color: white;">&times;</button>
      </div>
    `;
    cartItemsContainer.appendChild(cartItemEl);
  });

  cartTotalPrice.innerText = `$${total.toFixed(2)}`;
  cartCountSpan.innerText = count;
}

// Cart Quantity Increments & Removals Delegation
cartItemsContainer.addEventListener("click", (e) => {
  let id = parseInt(e.target.getAttribute("data-id"));
  if (e.target.classList.contains("increase-btn")) {
    let item = cart.find(p => p.id === id);
    if (item) item.quantity++;
  } else if (e.target.classList.contains("decrease-btn")) {
    let item = cart.find(p => p.id === id);
    if (item) {
      item.quantity--;
      if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
      }
    }
  } else if (e.target.classList.contains("remove-btn")) {
    cart = cart.filter(p => p.id !== id);
  }

  saveCart();
  updateCartUI();
});

// Checkout Logic
checkoutBtn.addEventListener("click", () => {
  if (!currentUser) {
    cartSidebar.classList.remove("open");
    authModal.classList.add("open");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  alert("Thank you for your order!");
  cart = [];
  saveCart();
  updateCartUI();
  cartSidebar.classList.remove("open");
});

// Authentication Modal & Logic
authBtn.addEventListener("click", () => authModal.classList.add("open"));
closeModalButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    authModal.classList.remove("open");
    productModal.classList.remove("open");
  });
});

tabLogin.addEventListener("click", () => {
  tabLogin.classList.add("active");
  tabSignup.classList.remove("active");
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
});

tabSignup.addEventListener("click", () => {
  tabSignup.classList.add("active");
  tabLogin.classList.remove("active");
  signupForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
});

// Login Form Submit
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let email = document.getElementById("login-email").value.trim();
  let password = document.getElementById("login-password").value.trim();

  let foundUser = usersList.find(u => u.email === email && u.password === password);
  if (foundUser) {
    currentUser = foundUser;
    localStorage.setItem("voltzone_user", JSON.stringify(currentUser));
    authModal.classList.remove("open");
    checkAuthUI();
    loginError.innerText = "";
    loginForm.reset();
  } else {
    loginError.innerText = "Invalid email or password";
  }
});

// Sign Up Form Submit
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let name = document.getElementById("signup-name").value.trim();
  let email = document.getElementById("signup-email").value.trim();
  let password = document.getElementById("signup-password").value.trim();

  if (!name) {
    signupError.innerText = "Name must not be empty.";
    return;
  }
  if (email.indexOf("@") === -1) {
    signupError.innerText = "Email must contain '@'.";
    return;
  }
  if (password.length < 6) {
    signupError.innerText = "Password must be at least 6 characters.";
    return;
  }

  let emailExists = usersList.some(u => u.email === email);
  if (emailExists) {
    signupError.innerText = "Email already exists.";
    return;
  }

  let newUser = { name, email, password };
  usersList.push(newUser);
  localStorage.setItem("voltzone_users", JSON.stringify(usersList));

  currentUser = newUser;
  localStorage.setItem("voltzone_user", JSON.stringify(currentUser));

  authModal.classList.remove("open");
  checkAuthUI();
  signupError.innerText = "";
  signupForm.reset();
});

// Logout Logic
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("voltzone_user");
  currentUser = null;
  checkAuthUI();
});

function checkAuthUI() {
  if (currentUser) {
    authBtn.classList.add("hidden");
    userDisplay.classList.remove("hidden");
    usernameSpan.innerText = `Hi, ${currentUser.name}`;
  } else {
    authBtn.classList.remove("hidden");
    userDisplay.classList.add("hidden");
  }
}

// Dark Mode Toggle
darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  let isDark = document.body.classList.contains("dark");
  localStorage.setItem("voltzone_dark", isDark);
  darkModeBtn.innerText = isDark ? "☀️" : "🌙";
});

function initDarkModeSetting() {
  let savedDark = localStorage.getItem("voltzone_dark") === "true";
  if (savedDark) {
    document.body.classList.add("dark");
    darkModeBtn.innerText = "☀️";
  }
}

// Mobile Navbar Toggle
mobileMenuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Countdown Timer for Deals Section
function startCountdown() {
  let targetDate = new Date().getTime() + 2 * 24 * 60 * 60 * 1000; // 2 days from now

  setInterval(() => {
    let now = new Date().getTime();
    let distance = targetDate - now;

    if (distance < 0) return;

    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = String(days).padStart(2, "0");
    document.getElementById("hours").innerText = String(hours).padStart(2, "0");
    document.getElementById("minutes").innerText = String(minutes).padStart(2, "0");
    document.getElementById("seconds").innerText = String(seconds).padStart(2, "0");
  }, 1000);
}

// Contact Form Validation
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let name = document.getElementById("contact-name").value.trim();
  let email = document.getElementById("contact-email").value.trim();
  let message = document.getElementById("contact-message").value.trim();

  if (!name || !email || !message) {
    contactFeedback.style.color = "#ef4444";
    contactFeedback.innerText = "All fields are required.";
    return;
  }
  if (email.indexOf("@") === -1) {
    contactFeedback.style.color = "#ef4444";
    contactFeedback.innerText = "Email must contain '@'.";
    return;
  }

  contactFeedback.style.color = "#22c55e";
  contactFeedback.innerText = "Message sent successfully.";
  contactForm.reset();
});

// Newsletter Form Validation
newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let email = document.getElementById("newsletter-email").value.trim();

  if (!email) {
    newsletterFeedback.style.color = "#ef4444";
    newsletterFeedback.innerText = "Email must not be empty.";
    return;
  }
  if (email.indexOf("@") === -1) {
    newsletterFeedback.style.color = "#ef4444";
    newsletterFeedback.innerText = "Email must contain '@'.";
    return;
  }

  newsletterFeedback.style.color = "#22c55e";
  newsletterFeedback.innerText = "Thank you for subscribing!";
  newsletterForm.reset();
});