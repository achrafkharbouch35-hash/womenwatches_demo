/* =========================================================
   ÉLÉA WATCHES — script.js
   Edit CONFIG below to set your own WhatsApp number & Instagram.
========================================================= */
const CONFIG = {
    whatsapp: "212600000000",       // format: country code + number, no + or spaces
    instagram: "https://instagram.com/elea.watches"
};

/* =========================================================
   PRODUCT DATA
========================================================= */
const PRODUCTS = [
  {
    id: "p1",
    name: "Rose Gold",
    category: "ROSE GOLD",
    price: 349,
    oldPrice: null,
    badge: "BEST-SELLER",
    image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&w=800&q=80",
    desc: "Un boîtier rose gold sublimé par un bracelet fin en maille milanaise. Le compagnon parfait pour un quotidien élégant.",
    date: "2026-01-15"
  },
  {
    id: "p2",
    name: "Pearl Classic",
    category: "CLASSIQUE",
    price: 299,
    oldPrice: 349,
    badge: "POPULAIRE",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80",
    desc: "Un cadran nacré intemporel entouré d'un boîtier argenté classique. Discret, raffiné, indémodable.",
    date: "2025-11-02"
  },
  {
    id: "p3",
    name: "Blush Minimal",
    category: "MINIMALISTE",
    price: 279,
    oldPrice: null,
    badge: "NOUVEAU",
    image: "https://images.unsplash.com/photo-1594576722485-24036d9b7b4a?auto=format&fit=crop&w=800&q=80",
    desc: "Un design épuré au cadran rose poudré, pensé pour celles qui aiment la simplicité assumée.",
    date: "2026-02-20"
  },
  {
    id: "p4",
    name: "Élégance Gold",
    category: "LUXE",
    price: 449,
    oldPrice: 519,
    badge: "PREMIUM",
    image: "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=800&q=80",
    desc: "Boîtier doré, cadran soleillé et bracelet en cuir véritable. Une pièce statement pour les grandes occasions.",
    date: "2025-09-10"
  },
  {
    id: "p5",
    name: "Silver Muse",
    category: "CLASSIQUE",
    price: 319,
    oldPrice: null,
    badge: "POPULAIRE",
    image: "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?auto=format&fit=crop&w=800&q=80",
    desc: "Argenté et intemporel, ce modèle s'accorde avec toutes vos tenues, du bureau au dîner.",
    date: "2025-12-05"
  },
  {
    id: "p6",
    name: "Midnight Rose",
    category: "ROSE GOLD",
    price: 379,
    oldPrice: 429,
    badge: "BEST-SELLER",
    image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&w=800&q=80",
    desc: "Un cadran noir profond contrastant avec un boîtier rose gold. Sophistiqué et affirmé.",
    date: "2026-01-28"
  },
  {
    id: "p7",
    name: "Soft Beige",
    category: "MINIMALISTE",
    price: 289,
    oldPrice: null,
    badge: "NOUVEAU",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
    desc: "Un bracelet beige doux et un cadran minimaliste pour une allure naturelle et apaisée.",
    date: "2026-03-01"
  },
  {
    id: "p8",
    name: "Éclat Prestige",
    category: "LUXE",
    price: 479,
    oldPrice: 549,
    badge: "PREMIUM",
    image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=800&q=80",
    desc: "Sertie de détails précieux, cette montre incarne le raffinement ÉLÉA dans sa forme la plus aboutie.",
    date: "2025-10-18"
  }
];

/* =========================================================
   STATE
========================================================= */
let cart = JSON.parse(localStorage.getItem("elea_cart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("elea_wishlist") || "[]");
let currentFilter = "TOUTES";
let currentSort = "recommended";
let activeProduct = null;
let modalQty = 1;

/* =========================================================
   HELPERS
========================================================= */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const formatPrice = (n) => `${n} DH`;
const findProduct = (id) => PRODUCTS.find(p => p.id === id);

function saveCart(){ localStorage.setItem("elea_cart", JSON.stringify(cart)); }
function saveWishlist(){ localStorage.setItem("elea_wishlist", JSON.stringify(wishlist)); }

function buildWhatsappLink(message){
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
}

function showToast(text){
  const toast = $("#toast");
  toast.textContent = text;
  toast.classList.add("is-visible");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

/* =========================================================
   INIT WHATSAPP / INSTAGRAM LINKS
========================================================= */
function initStaticLinks(){
  const genericMsg = "Bonjour ÉLÉA WATCHES, je souhaite passer une commande.";
  const genericLink = buildWhatsappLink(genericMsg);
  ["#heroWhatsapp", "#mobileWhatsapp", "#footerWhatsapp"].forEach(sel => {
    const el = $(sel);
    if (el) el.href = genericLink;
  });
}

/* =========================================================
   NAVBAR / MOBILE MENU
========================================================= */
function initNavbar(){
  const burger = $("#burgerBtn");
  const menu = $("#mobileMenu");
  burger.addEventListener("click", () => {
    burger.classList.toggle("is-active");
    menu.classList.toggle("is-open");
  });
  $$(".mobile-menu__link").forEach(link => {
    link.addEventListener("click", () => {
      burger.classList.remove("is-active");
      menu.classList.remove("is-open");
    });
  });
}

/* =========================================================
   RENDER PRODUCT GRID
========================================================= */
function getVisibleProducts(){
  let list = PRODUCTS.slice();

  if (currentFilter !== "TOUTES"){
    list = list.filter(p => p.category === currentFilter);
  }

  switch(currentSort){
    case "price-asc":
      list.sort((a,b) => a.price - b.price);
      break;
    case "price-desc":
      list.sort((a,b) => b.price - a.price);
      break;
    case "newest":
      list.sort((a,b) => new Date(b.date) - new Date(a.date));
      break;
    default:
      break; // recommended = original order
  }

  return list;
}

function renderGrid(){
  const grid = $("#productGrid");
  const list = getVisibleProducts();

  if (list.length === 0){
    grid.innerHTML = `<div class="empty-state">Aucune montre ne correspond à cette sélection.</div>`;
    return;
  }

  grid.innerHTML = list.map(p => productCardHTML(p)).join("");
  bindGridEvents();
}

function productCardHTML(p){
  const isWished = wishlist.includes(p.id);
  return `
    <article class="product-card" data-id="${p.id}">
      <div class="product-card__media">
        ${p.badge ? `<span class="product-card__badge">${p.badge}</span>` : ""}
        <button class="product-card__wishlist ${isWished ? "is-active" : ""}" data-id="${p.id}" aria-label="Ajouter aux favoris">
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 20.5s-7.6-4.6-10-9.3C.4 7.8 2.3 4 6 4c2 0 3.5 1 4 2.4C10.5 5 12 4 14 4c3.7 0 5.6 3.8 4 7.2-2.4 4.7-10 9.3-10 9.3z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
        </button>
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-card__body">
        <p class="product-card__category">${p.category}</p>
        <h3 class="product-card__name">${p.name}</h3>
        <div class="product-card__prices">
          <span class="product-card__price">${formatPrice(p.price)}</span>
          ${p.oldPrice ? `<span class="product-card__old-price">${formatPrice(p.oldPrice)}</span>` : ""}
        </div>
        <div class="product-card__actions">
          <button class="btn btn--outline js-details" data-id="${p.id}">Détails</button>
          <button class="btn btn--dark js-add-cart" data-id="${p.id}">Ajouter</button>
        </div>
      </div>
    </article>
  `;
}

function bindGridEvents(){
  $$(".js-details").forEach(btn => {
    btn.addEventListener("click", () => openProductModal(btn.dataset.id));
  });
  $$(".js-add-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      addToCart(btn.dataset.id, 1);
      showToast("Ajouté au panier");
    });
  });
  $$(".product-card__wishlist").forEach(btn => {
    btn.addEventListener("click", () => toggleWishlist(btn.dataset.id, btn));
  });
  $$(".product-card__media img").forEach(img => {
    img.addEventListener("click", () => {
      const id = img.closest(".product-card").dataset.id;
      openProductModal(id);
    });
  });
}

/* =========================================================
   FILTERS + SORT
========================================================= */
function initFilters(){
  $$(".filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      $$(".filter-chip").forEach(c => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      currentFilter = chip.dataset.filter;
      renderGrid();
    });
  });

  $("#sortSelect").addEventListener("change", (e) => {
    currentSort = e.target.value;
    renderGrid();
  });

  $$("[data-scroll-filter]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      currentFilter = link.dataset.scrollFilter;
      $$(".filter-chip").forEach(c => c.classList.toggle("is-active", c.dataset.filter === currentFilter));
      renderGrid();
      $("#collection").scrollIntoView({ behavior: "smooth" });
    });
  });
}

/* =========================================================
   WISHLIST
========================================================= */
function toggleWishlist(id, btnEl){
  const idx = wishlist.indexOf(id);
  if (idx > -1){
    wishlist.splice(idx, 1);
  } else {
    wishlist.push(id);
  }
  saveWishlist();
  updateWishlistCount();

  // reflect on all matching wishlist buttons on the page (grid + modal if any)
  $$(`.product-card__wishlist[data-id="${id}"]`).forEach(b => {
    b.classList.toggle("is-active", wishlist.includes(id));
    b.classList.add("pulse");
    setTimeout(() => b.classList.remove("pulse"), 400);
  });
}

function updateWishlistCount(){
  $("#wishlistCount").textContent = wishlist.length;
}

/* =========================================================
   PRODUCT MODAL
========================================================= */
function openProductModal(id){
  const p = findProduct(id);
  if (!p) return;
  activeProduct = p;
  modalQty = 1;

  $("#modalImage").src = p.image;
  $("#modalImage").alt = p.name;
  $("#modalCategory").textContent = p.category;
  $("#modalName").textContent = p.name;
  $("#modalPrice").textContent = formatPrice(p.price);
  $("#modalOldPrice").textContent = p.oldPrice ? formatPrice(p.oldPrice) : "";
  $("#modalOldPrice").style.display = p.oldPrice ? "inline" : "none";
  $("#modalDesc").textContent = p.desc;
  $("#qtyValue").textContent = modalQty;

  $("#modalBackdrop").classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeProductModal(){
  $("#modalBackdrop").classList.remove("is-open");
  document.body.style.overflow = "";
  activeProduct = null;
}

function initModal(){
  $("#modalClose").addEventListener("click", closeProductModal);
  $("#modalBackdrop").addEventListener("click", (e) => {
    if (e.target.id === "modalBackdrop") closeProductModal();
  });

  $("#qtyMinus").addEventListener("click", () => {
    modalQty = Math.max(1, modalQty - 1);
    $("#qtyValue").textContent = modalQty;
  });
  $("#qtyPlus").addEventListener("click", () => {
    modalQty = Math.min(20, modalQty + 1);
    $("#qtyValue").textContent = modalQty;
  });

  $("#modalAddCart").addEventListener("click", () => {
    if (!activeProduct) return;
    addToCart(activeProduct.id, modalQty);
    showToast("Ajouté au panier");
    closeProductModal();
  });

  $("#modalOrderWhatsapp").addEventListener("click", () => {
    if (!activeProduct) return;
    const p = activeProduct;
    const total = p.price * modalQty;
    const message = buildOrderMessage([{ ...p, qty: modalQty, subtotal: total }], total);
    window.open(buildWhatsappLink(message), "_blank");
  });
}

/* =========================================================
   CART
========================================================= */
function addToCart(id, qty){
  const existing = cart.find(item => item.id === id);
  if (existing){
    existing.qty += qty;
  } else {
    cart.push({ id, qty });
  }
  saveCart();
  updateCartCount();
  renderCart();
}

function updateCartQty(id, delta){
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0){
    cart = cart.filter(i => i.id !== id);
  }
  saveCart();
  updateCartCount();
  renderCart();
}

function removeFromCart(id){
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartCount();
  renderCart();
}

function clearCart(){
  cart = [];
  saveCart();
  updateCartCount();
  renderCart();
}

function updateCartCount(){
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  $("#cartCount").textContent = count;
}

function getCartDetails(){
  return cart.map(item => {
    const p = findProduct(item.id);
    return { ...p, qty: item.qty, subtotal: p.price * item.qty };
  }).filter(item => item.id);
}

function renderCart(){
  const details = getCartDetails();
  const itemsEl = $("#cartItems");
  const emptyEl = $("#cartEmpty");
  const footerEl = $("#cartFooter");

  if (details.length === 0){
    itemsEl.innerHTML = "";
    emptyEl.style.display = "block";
    footerEl.style.display = "none";
    return;
  }

  emptyEl.style.display = "none";
  footerEl.style.display = "block";

  itemsEl.innerHTML = details.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <p class="cart-item__name">${item.name}</p>
        <p class="cart-item__price">${formatPrice(item.price)}</p>
        <div class="cart-item__qty">
          <button class="js-qty-minus" data-id="${item.id}">−</button>
          <span>${item.qty}</span>
          <button class="js-qty-plus" data-id="${item.id}">+</button>
        </div>
      </div>
      <div>
        <p class="cart-item__subtotal">${formatPrice(item.subtotal)}</p>
        <p class="cart-item__remove js-remove" data-id="${item.id}">Retirer</p>
      </div>
    </div>
  `).join("");

  const total = details.reduce((sum, i) => sum + i.subtotal, 0);
  $("#cartTotal").textContent = formatPrice(total);

  $$(".js-qty-minus").forEach(btn => btn.addEventListener("click", () => updateCartQty(btn.dataset.id, -1)));
  $$(".js-qty-plus").forEach(btn => btn.addEventListener("click", () => updateCartQty(btn.dataset.id, 1)));
  $$(".js-remove").forEach(btn => btn.addEventListener("click", () => removeFromCart(btn.dataset.id)));
}

function openCart(){
  $("#cartDrawer").classList.add("is-open");
  $("#cartOverlay").classList.add("is-open");
  document.body.style.overflow = "hidden";
}
function closeCart(){
  $("#cartDrawer").classList.remove("is-open");
  $("#cartOverlay").classList.remove("is-open");
  document.body.style.overflow = "";
}

function initCart(){
  $("#cartBtn").addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  $("#cartOverlay").addEventListener("click", closeCart);
  $("#clearCart").addEventListener("click", () => {
    clearCart();
    showToast("Panier vidé");
  });

  $("#checkoutWhatsapp").addEventListener("click", () => {
    const details = getCartDetails();
    if (details.length === 0) return;
    const total = details.reduce((sum, i) => sum + i.subtotal, 0);
    const message = buildOrderMessage(details, total);
    window.open(buildWhatsappLink(message), "_blank");
  });
}

/* =========================================================
   WHATSAPP MESSAGE BUILDER
========================================================= */
function buildOrderMessage(items, total){
  const lines = [];
  lines.push("Bonjour ÉLÉA WATCHES, je souhaite passer la commande suivante :");
  lines.push("");
  items.forEach(item => {
    lines.push(`• ${item.name} — Quantité : ${item.qty} — Prix unitaire : ${formatPrice(item.price)} — Sous-total : ${formatPrice(item.subtotal)}`);
  });
  lines.push("");
  lines.push(`Montant total de la commande : ${formatPrice(total)}`);
  lines.push("");
  lines.push("Nom :");
  lines.push("Ville :");
  lines.push("Adresse :");
  lines.push("Téléphone :");
  return lines.join("\n");
}

/* =========================================================
   SEARCH
========================================================= */
function initSearch(){
  const overlay = $("#searchOverlay");
  const input = $("#searchInput");
  const results = $("#searchResults");

  const openSearch = () => {
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
    setTimeout(() => input.focus(), 300);
  };
  const closeSearch = () => {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    input.value = "";
    results.innerHTML = "";
  };

  $("#searchBtn").addEventListener("click", openSearch);
  $("#searchClose").addEventListener("click", closeSearch);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape"){
      closeSearch();
      closeProductModal();
      closeCart();
    }
  });

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!q){
      results.innerHTML = "";
      return;
    }
    const matches = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );

    if (matches.length === 0){
      results.innerHTML = `<p class="search-empty">Aucun résultat pour « ${input.value} ».</p>`;
      return;
    }

    results.innerHTML = matches.map(p => `
      <div class="search-result js-search-result" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}">
        <span class="search-result__name">${p.name}</span>
        <span class="search-result__price">${formatPrice(p.price)}</span>
      </div>
    `).join("");

    $$(".js-search-result").forEach(el => {
      el.addEventListener("click", () => {
        closeSearch();
        openProductModal(el.dataset.id);
      });
    });
  });
}

/* =========================================================
   INIT
========================================================= */
function init(){
  initStaticLinks();
  initNavbar();
  initFilters();
  initModal();
  initCart();
  initSearch();

  renderGrid();
  renderCart();
  updateCartCount();
  updateWishlistCount();
}

document.addEventListener("DOMContentLoaded", init);
