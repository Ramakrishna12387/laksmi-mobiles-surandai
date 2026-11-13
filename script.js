// ==========================================
// 1. CONFIGURATION & ADMIN CREDENTIALS
// ==========================================
const SHOP_WHATSAPP = "919876543210"; // Surandai Shop WhatsApp Number
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "lakshmi123";

let isAdminLoggedIn = false;
let uploadedPhotoBase64 = ""; // Stores normal photo selected from device

// Default Products (Uses local 'images/...' first; falls back if file not placed yet)
const defaultProducts = [
    {
        id: 1,
        name: "Vivo V30 5G (8GB / 128GB)",
        category: "5G Mobiles",
        price: 31999,
        specs: "Aura Light Portrait • 80W FlashCharge • 5 Free Gifts",
        badge: "Showroom Hit",
        img: "images/vivo-v30.jpg",
        fallback: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Redmi Note 13 5G (6GB / 128GB)",
        category: "5G Mobiles",
        price: 16999,
        specs: "108MP Pro Camera • 120Hz AMOLED • Bajaj 0% EMI",
        badge: "Best Seller",
        img: "images/redmi-note13.jpg",
        fallback: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Samsung Galaxy A15 5G (8GB / 128GB)",
        category: "5G Mobiles",
        price: 17499,
        specs: "50MP Triple Cam • Super AMOLED • Zero Downpayment",
        badge: "0% EMI Deal",
        img: "images/samsung-a15.jpg",
        fallback: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Realme C67 5G (4GB / 128GB)",
        category: "Budget Phones",
        price: 11999,
        specs: "5000mAh Battery • 33W SuperVOOC • Free Neckband",
        badge: "Budget 5G",
        img: "images/realme-c67.jpg",
        fallback: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "iPhone 13 (128GB) - Showroom Condition",
        category: "Pre-Owned",
        price: 34500,
        specs: "92% Battery Health • Original Display • Bill & Box",
        badge: "A+ Grade Used",
        img: "images/iphone-13.jpg",
        fallback: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "80W Original SuperVOOC / Flash Charger",
        category: "Accessories",
        price: 999,
        specs: "100% Original Adapter + Type-C Cable • 6M Warranty",
        badge: "Original",
        img: "images/charger-80w.jpg",
        fallback: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80"
    }
];

// Load saved products from LocalStorage or use default
let products = JSON.parse(localStorage.getItem("lakshmi_mobiles_stock")) || defaultProducts;

function saveProductsToStorage() {
    localStorage.setItem("lakshmi_mobiles_stock", JSON.stringify(products));
}

// Demo Service Tickets
const repairTickets = {
    "LM101": {
        customer: "Muthukumar (Surandai)",
        device: "Vivo V27 Pro 5G",
        issue: "Original AMOLED Display Replacement",
        status: "Ready for Delivery ✅",
        bill: "₹3,800 (Includes Free Tempered Glass)"
    },
    "LM102": {
        customer: "Karthik (Pavoorchatram)",
        device: "Redmi Note 11",
        issue: "Battery & Charging Port Replacement",
        status: "In Progress 🔧 (Ready in 20 Mins)",
        bill: "₹1,150"
    }
};

let activeCategory = "all";

// ==========================================
// 2. MULTI-PAGE ROUTER
// ==========================================
function navigateTo(pageId) {
    document.querySelectorAll(".page-section").forEach(sec => sec.classList.add("hidden"));
    const target = document.getElementById(`page-${pageId}`);
    if (target) target.classList.remove("hidden");

    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active-nav");
        if (btn.getAttribute("data-page") === pageId) {
            btn.classList.add("active-nav");
        }
    });

    if (pageId === "admin") {
        renderAdminView();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleMobileMenu() {
    document.getElementById("mobile-menu").classList.toggle("hidden");
}

// ==========================================
// 3. PRODUCT CARD & CATALOG RENDERING
// ==========================================
function createProductCard(item) {
    const emiPerMonth = Math.round(item.price / 8);
    const fallbackImg = item.fallback || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80";

    return `
        <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition shadow-lg flex flex-col justify-between group">
            <div>
                <div class="relative h-56 overflow-hidden bg-slate-950">
                    <img src="${item.img}" 
                         onerror="this.src='${fallbackImg}'" 
                         alt="${item.name}" 
                         class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                    <span class="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-bold px-3 py-1 rounded shadow">
                        ${item.badge}
                    </span>
                    <span class="absolute top-3 right-3 bg-slate-900/90 text-slate-200 text-xs font-bold px-2.5 py-1 rounded border border-slate-700">
                        ${item.category}
                    </span>
                </div>
                <div class="p-5">
                    <h4 class="text-lg font-bold text-white mb-1">${item.name}</h4>
                    <p class="text-sm text-slate-400 mb-4">${item.specs}</p>
                    <div class="flex items-baseline justify-between border-t border-slate-800 pt-3">
                        <div>
                            <span class="text-xs text-slate-400 block">Showroom Price</span>
                            <span class="text-2xl font-bold text-amber-400">₹${item.price.toLocaleString('en-IN')}</span>
                        </div>
                        <div class="text-right">
                            <span class="text-xs text-emerald-400 font-bold block">0% EMI Available</span>
                            <span class="text-sm text-slate-300 font-bold">₹${emiPerMonth}/mo</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-5 pb-5">
                <button onclick="openWhatsApp('Vanakkam Lakshmi Mobiles Surandai! Naan ${item.name} (Price: ₹${item.price}) vaanga virumbugiren. Details sollunga.')" 
                    class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow">
                    <i class="fa-brands fa-whatsapp text-lg"></i> Order / Enquire on WhatsApp
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
            : `<p class="text-slate-400 col-span-full text-center py-8 text-lg">No matching models found. Contact +91 98765 43210 for custom orders.</p>`;
    }
}

function filterProducts(category) {
    activeCategory = category;
    document.querySelectorAll(".cat-btn").forEach(btn => {
        btn.classList.remove("active-cat");
        if (btn.getAttribute("data-cat") === category) {
            btn.classList.add("active-cat");
        }
    });
    renderGrids(document.getElementById("search-input")?.value || "");
}

function searchCatalog() {
    renderGrids(document.getElementById("search-input").value);
}

// ==========================================
// 4. ADMIN AUTHENTICATION & NORMAL PHOTO UPLOAD
// ==========================================
function handleAdminLogin(e) {
    e.preventDefault();
    const user = document.getElementById("login-user").value.trim();
    const pass = document.getElementById("login-pass").value.trim();
    const err = document.getElementById("login-error");

    if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        err.classList.add("hidden");
        document.getElementById("login-user").value = "";
        document.getElementById("login-pass").value = "";
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
    const loginBox = document.getElementById("admin-login-box");
    const dashBox = document.getElementById("admin-dashboard-box");

    if (isAdminLoggedIn) {
        loginBox.classList.add("hidden");
        dashBox.classList.remove("hidden");
        renderAdminTable();
    } else {
        loginBox.classList.remove("hidden");
        dashBox.classList.add("hidden");
    }
}

// Convert Normal Photo from Phone/PC into Base64 for Instant Display
function previewSelectedPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        uploadedPhotoBase64 = e.target.result;
        document.getElementById("photo-preview-img").src = uploadedPhotoBase64;
        document.getElementById("photo-preview-container").classList.remove("hidden");
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

    // Priority: 1. Uploaded Camera/Gallery File -> 2. Local Folder Path -> 3. Default Image
    const finalImage = uploadedPhotoBase64 || folderPath || "images/default-phone.jpg";

    products.unshift({
        id: Date.now(),
        name,
        category,
        price,
        specs,
        badge: "New Arrival",
        img: finalImage,
        fallback: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
    });

    saveProductsToStorage();
    renderGrids();
    renderAdminTable();

    // Reset Form & Preview
    e.target.reset();
    uploadedPhotoBase64 = "";
    document.getElementById("photo-preview-container").classList.add("hidden");
    alert(`"${name}" has been published to Lakshmi Mobiles Catalog!`);
}

function deleteProduct(id) {
    if (!confirm("Are you sure you want to remove this item from the catalog?")) return;
    products = products.filter(p => p.id !== id);
    saveProductsToStorage();
    renderGrids();
    renderAdminTable();
}

function renderAdminTable() {
    const tbody = document.getElementById("admin-inventory-table");
    if (!tbody) return;

    tbody.innerHTML = products.map(item => `
        <tr class="hover:bg-slate-800/40">
            <td class="py-3 px-2">
                <img src="${item.img}" onerror="this.src='${item.fallback || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=80'}'" class="w-12 h-12 object-cover rounded border border-slate-700">
            </td>
            <td class="py-3 px-2 font-bold text-white">${item.name}</td>
            <td class="py-3 px-2">${item.category}</td>
            <td class="py-3 px-2 text-amber-400 font-bold">₹${item.price.toLocaleString('en-IN')}</td>
            <td class="py-3 px-2 text-right">
                <button onclick="deleteProduct(${item.id})" class="px-3 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold transition">
                    <i class="fa-solid fa-trash mr-1"></i> Delete
                </button>
            </td>
        </tr>
    `).join("");
}

// ==========================================
// 5. SERVICE TRACKER & CALCULATORS
// ==========================================
function checkRepairStatus() {
    const code = document.getElementById("repair-ticket-input").value.trim().toUpperCase();
    const box = document.getElementById("repair-status-output");
    box.classList.remove("hidden");

    if (repairTickets[code]) {
        const t = repairTickets[code];
        box.innerHTML = `
            <p class="text-amber-400 font-bold mb-1">Job Sheet #${code} — ${t.customer}</p>
            <p class="text-slate-300"><strong>Model:</strong> ${t.device}</p>
            <p class="text-slate-300"><strong>Work:</strong> ${t.issue}</p>
            <p class="text-emerald-400 font-bold mt-1">Status: ${t.status}</p>
            <p class="text-sm text-slate-400 mt-1">Bill Estimate: ${t.bill}</p>
        `;
    } else {
        box.innerHTML = `<p class="text-red-400">Invalid Job Sheet ID. Try Demo IDs: <strong>LM101</strong> or <strong>LM102</strong>.</p>`;
    }
}

function submitServiceBooking(e) {
    e.preventDefault();
    const name = document.getElementById("srv-name").value;
    const phone = document.getElementById("srv-phone").value;
    const model = document.getElementById("srv-model").value;
    const issue = document.getElementById("srv-issue").value;

    const msg = `Vanakkam Lakshmi Mobiles Surandai (Service Desk)!%0A` +
                `*Customer Name:* ${name}%0A` +
                `*Phone:* ${phone}%0A` +
                `*Mobile Model:* ${model}%0A` +
                `*Issue:* ${issue}%0A` +
                `Please confirm my service appointment.`;

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