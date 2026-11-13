const SHOP_WHATSAPP = "919876543210";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "lakshmi123";

let isAdminLoggedIn = false;
let uploadedPhotoBase64 = "";

const defaultProducts = [
    {
        id: 1,
        name: "Vivo V30 5G (8GB/128GB)",
        category: "5G Mobiles",
        price: 31999,
        specs: "50MP Aura Light • 5 Free Gifts",
        badge: "Top Hit",
        img: "images/vivo-v30.jpg",
        fallback: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "Redmi Note 13 5G",
        category: "5G Mobiles",
        price: 16999,
        specs: "108MP Cam • Bajaj 0% EMI",
        badge: "Best Seller",
        img: "images/redmi-note13.jpg",
        fallback: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "Samsung A15 5G",
        category: "5G Mobiles",
        price: 17499,
        specs: "Super AMOLED • Zero Downpayment",
        badge: "0% EMI",
        img: "images/samsung-a15.jpg",
        fallback: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "Realme C67 5G",
        category: "Budget Phones",
        price: 11999,
        specs: "5000mAh • Free Neckband",
        badge: "Budget 5G",
        img: "images/realme-c67.jpg",
        fallback: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        name: "iPhone 13 (128GB Used)",
        category: "Pre-Owned",
        price: 34500,
        specs: "92% Battery • Original Display",
        badge: "A+ Used",
        img: "images/iphone-13.jpg",
        fallback: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        name: "80W Original Charger",
        category: "Accessories",
        price: 999,
        specs: "SuperVOOC / FlashCharge • 6M Warranty",
        badge: "Original",
        img: "images/charger-80w.jpg",
        fallback: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=500&q=80"
    }
];

let products = JSON.parse(localStorage.getItem("lakshmi_mobiles_stock")) || defaultProducts;

function saveProductsToStorage() {
    localStorage.setItem("lakshmi_mobiles_stock", JSON.stringify(products));
}

const repairTickets = {
    "LM101": {
        customer: "Muthukumar (Surandai)",
        device: "Vivo V27 Pro 5G",
        issue: "Original AMOLED Display Change",
        status: "Ready for Delivery ✅",
        bill: "₹3,800"
    },
    "LM102": {
        customer: "Karthik (Pavoorchatram)",
        device: "Redmi Note 11",
        issue: "Battery & Charging Pin Change",
        status: "In Progress 🔧 (20 Mins)",
        bill: "₹1,150"
    }
};

let activeCategory = "all";

// 1. Mobile & Desktop Page Switcher
function navigateTo(pageId) {
    document.querySelectorAll(".page-section").forEach(sec => sec.classList.add("hidden"));
    const target = document.getElementById(`page-${pageId}`);
    if (target) target.classList.remove("hidden");

    // Highlight Desktop Nav
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.toggle("active-nav", btn.getAttribute("data-page") === pageId);
    });

    // Highlight Mobile Bottom App Bar
    document.querySelectorAll(".mob-nav-btn").forEach(btn => {
        btn.classList.toggle("active-mob-nav", btn.getAttribute("data-page") === pageId);
    });

    if (pageId === "admin") renderAdminView();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function quickCategoryJump(cat) {
    navigateTo("catalog");
    filterProducts(cat);
}

// 2. Compact Mobile-Friendly Product Card (2-Per-Row on Phone)
function createProductCard(item) {
    const emiPerMonth = Math.round(item.price / 8);
    const fallbackImg = item.fallback || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80";

    return `
        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-md">
            <div>
                <div class="relative h-36 sm:h-52 bg-slate-950">
                    <img src="${item.img}" 
                         onerror="this.src='${fallbackImg}'" 
                         alt="${item.name}" 
                         class="w-full h-full object-cover">
                    <span class="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded shadow">
                        ${item.badge}
                    </span>
                </div>
                <div class="p-3 sm:p-4">
                    <h4 class="text-sm sm:text-lg font-bold text-white leading-snug line-clamp-1">${item.name}</h4>
                    <p class="text-[11px] sm:text-xs text-slate-400 mt-0.5 line-clamp-1">${item.specs}</p>
                    <div class="mt-2 pt-2 border-t border-slate-800/80 flex items-baseline justify-between">
                        <span class="text-base sm:text-xl font-bold text-amber-400">₹${item.price.toLocaleString('en-IN')}</span>
                        <span class="text-[10px] sm:text-xs text-emerald-400 font-bold">EMI ₹${emiPerMonth}/m</span>
                    </div>
                </div>
            </div>
            <div class="px-3 pb-3 sm:px-4 sm:pb-4">
                <button onclick="openWhatsApp('Vanakkam Lakshmi Mobiles Surandai! Naan ${item.name} (₹${item.price}) vaanga virumbugiren.')" 
                    class="w-full py-2 sm:py-2.5 rounded-xl bg-emerald-600 active:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow">
                    <i class="fa-brands fa-whatsapp text-sm sm:text-base"></i> Buy / Enquire
                </button>
            </div>
        </div>
    `;
}

function renderGrids(searchQuery = "") {
    const homeGrid = document.getElementById("home-featured-grid");
    const catalogGrid = document.getElementById("catalog-grid");

    if (homeGrid) {
        homeGrid.innerHTML = products.slice(0, 4).map(createProductCard).join("");
    }

    if (catalogGrid) {
        const filtered = products.filter(p => {
            const matchesCat = activeCategory === "all" || p.category === activeCategory;
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  p.specs.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCat && matchesSearch;
        });

        catalogGrid.innerHTML = filtered.length
            ? filtered.map(createProductCard).join("")
            : `<p class="text-slate-400 col-span-full text-center py-6 text-sm">No mobile found. Tap Chat to ask stock!</p>`;
    }
}

function filterProducts(category) {
    activeCategory = category;
    document.querySelectorAll(".cat-btn").forEach(btn => {
        btn.classList.toggle("active-cat", btn.getAttribute("data-cat") === category);
    });
    renderGrids(document.getElementById("search-input")?.value || "");
}

function searchCatalog() {
    renderGrids(document.getElementById("search-input").value);
}

// 3. Admin Login & Phone Camera Image Compression
function handleAdminLogin(e) {
    e.preventDefault();
    const user = document.getElementById("login-user").value.trim();
    const pass = document.getElementById("login-pass").value.trim();
    const err = document.getElementById("login-error");

    if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        err.classList.add("hidden");
        renderAdminView();
    } else {
        err.classList.remove("hidden");
    }
}

function logoutAdmin() {
    isAdminLoggedIn = false;
    renderAdminView();
}

function renderAdminView() {
    document.getElementById("admin-login-box").classList.toggle("hidden", isAdminLoggedIn);
    document.getElementById("admin-dashboard-box").classList.toggle("hidden", !isAdminLoggedIn);
    if (isAdminLoggedIn) renderAdminTable();
}

// Compress Phone Camera Image so LocalStorage never gets full
function previewSelectedPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement("canvas");
            const maxW = 600;
            const scale = maxW / img.width;
            canvas.width = maxW;
            canvas.height = img.height * scale;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            uploadedPhotoBase64 = canvas.toDataURL("image/jpeg", 0.8);
            document.getElementById("photo-preview-img").src = uploadedPhotoBase64;
            document.getElementById("photo-preview-container").classList.remove("hidden");
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function addNewProduct(e) {
    e.preventDefault();
    const name = document.getElementById("adm-name").value;
    const category = document.getElementById("adm-cat").value;
    const price = Number(document.getElementById("adm-price").value);
    const specs = document.getElementById("adm-specs").value;
    const folderPath = document.getElementById("adm-img-path").value.trim();

    const finalImage = uploadedPhotoBase64 || folderPath || "images/default-phone.jpg";

    products.unshift({
        id: Date.now(),
        name,
        category,
        price,
        specs,
        badge: "New Stock",
        img: finalImage,
        fallback: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80"
    });

    saveProductsToStorage();
    renderGrids();
    renderAdminTable();

    e.target.reset();
    uploadedPhotoBase64 = "";
    document.getElementById("photo-preview-container").classList.add("hidden");
    alert(`"${name}" Added Successfully!`);
    navigateTo("catalog");
}

function deleteProduct(id) {
    if (!confirm("Delete this mobile from stock?")) return;
    products = products.filter(p => p.id !== id);
    saveProductsToStorage();
    renderGrids();
    renderAdminTable();
}

function renderAdminTable() {
    const container = document.getElementById("admin-inventory-table");
    if (!container) return;

    container.innerHTML = products.map(item => `
        <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <div class="flex items-center gap-3">
                <img src="${item.img}" onerror="this.src='${item.fallback}'" class="w-12 h-12 object-cover rounded-lg border border-slate-700">
                <div>
                    <h4 class="text-sm font-bold text-white">${item.name}</h4>
                    <p class="text-xs text-amber-400 font-bold">₹${item.price.toLocaleString('en-IN')} • ${item.category}</p>
                </div>
            </div>
            <button onclick="deleteProduct(${item.id})" class="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `).join("");
}

// 4. Repair Tracker & EMI / Exchange Calculators
function checkRepairStatus() {
    const code = document.getElementById("repair-ticket-input").value.trim().toUpperCase();
    const box = document.getElementById("repair-status-output");
    box.classList.remove("hidden");

    if (repairTickets[code]) {
        const t = repairTickets[code];
        box.innerHTML = `
            <p class="text-amber-400 font-bold">#${code} - ${t.customer}</p>
            <p class="text-slate-300 text-xs mt-0.5">${t.device} (${t.issue})</p>
            <p class="text-emerald-400 font-bold mt-1">${t.status} • Bill: ${t.bill}</p>
        `;
    } else {
        box.innerHTML = `<p class="text-red-400 text-xs">Not found! Try <strong>LM101</strong> or <strong>LM102</strong>.</p>`;
    }
}

function submitServiceBooking(e) {
    e.preventDefault();
    const name = document.getElementById("srv-name").value;
    const phone = document.getElementById("srv-phone").value;
    const model = document.getElementById("srv-model").value;
    const issue = document.getElementById("srv-issue").value;

    const msg = `Vanakkam Lakshmi Mobiles Surandai!%0A*Service Booking*%0AName: ${name}%0APhone: ${phone}%0AModel: ${model}%0AIssue: ${issue}`;
    window.open(`https://wa.me/${SHOP_WHATSAPP}?text=${msg}`, "_blank");
}

function calculateExchange() {
    const base = Number(document.getElementById("ex-base").value);
    const cond = Number(document.getElementById("ex-cond").value);
    const box = Number(document.getElementById("ex-box").value);
    const total = Math.round(base * cond + box + 1000);
    document.getElementById("ex-result").innerText = `₹${total.toLocaleString('en-IN')}`;
}

function calculateEMI() {
    const price = Number(document.getElementById("emi-price").value) || 0;
    const down = Number(document.getElementById("emi-down").value) || 0;
    const months = Number(document.getElementById("emi-months").value) || 8;
    const monthly = Math.round(Math.max(0, price - down) / months);
    document.getElementById("emi-result").innerText = `₹${monthly.toLocaleString('en-IN')} / month`;
}

function openWhatsApp(message) {
    window.open(`https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank");
}

document.addEventListener("DOMContentLoaded", () => {
    renderGrids();
    calculateExchange();
    calculateEMI();
});