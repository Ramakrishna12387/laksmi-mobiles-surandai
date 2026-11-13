// Shop Owner WhatsApp Number (Replace with real Surandai shop number)
const SHOP_WHATSAPP = "919876543210";

// Initial Inventory Data for Lakshmi Mobiles Surandai
let products = [
    {
        id: 1,
        name: "Vivo V30 5G (8GB / 128GB)",
        category: "5G Mobiles",
        price: 31999,
        specs: "Aura Light Portrait • 80W FlashCharge • Curved AMOLED",
        badge: "5 Free Gifts",
        img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Redmi Note 13 5G (6GB / 128GB)",
        category: "5G Mobiles",
        price: 16999,
        specs: "108MP Triple Camera • 120Hz AMOLED • 33W Fast Charge",
        badge: "Surandai Bestseller",
        img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Samsung Galaxy A15 5G (8GB / 128GB)",
        category: "5G Mobiles",
        price: 17499,
        specs: "50MP No-Shake Cam • Super AMOLED • Zero Downpayment EMI",
        badge: "0% Bajaj EMI",
        img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Realme C67 5G (4GB / 128GB)",
        category: "Budget Phones",
        price: 11999,
        specs: "5000mAh Battery • 33W SuperVOOC • Free Neckband",
        badge: "Budget King",
        img: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "iPhone 13 (128GB) - A+ Condition",
        category: "Pre-Owned",
        price: 34500,
        specs: "91% Battery Health • Original Display • 3 Months Shop Warranty",
        badge: "Verified Used",
        img: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Vivo Y28 5G (4GB / 128GB)",
        category: "Budget Phones",
        price: 12999,
        specs: "5000mAh Battery • Dimensity 6020 • Free Back Case & Glass",
        badge: "Free Gifts",
        img: "https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "OnePlus Bullets Wireless Z2 ANC",
        category: "Accessories",
        price: 1799,
        specs: "10 Mins Charge = 20 Hrs Music • Heavy Bass • 1 Yr Warranty",
        badge: "Original Audio",
        img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "80W SuperVOOC / FlashCharge Adapter",
        category: "Accessories",
        price: 999,
        specs: "Supports Vivo / Oppo / Realme / OnePlus + Type-C Cable",
        badge: "6M Warranty",
        img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80"
    }
];

// Demo Repair Status Tickets
const repairTickets = {
    "LM101": {
        customer: "Muthukumar (Surandai)",
        device: "Vivo V27 Pro 5G",
        issue: "Original AMOLED Display Replacement",
        status: "Ready for Delivery ✅",
        bill: "₹3,800 (Free Tempered Glass Applied)"
    },
    "LM102": {
        customer: "Karthik (Pavoorchatram)",
        device: "Redmi Note 11",
        issue: "Battery & Charging IC Change",
        status: "In Progress 🔧 (Ready in 20 Mins)",
        bill: "₹1,150"
    }
};

let activeCategory = "all";

// 1. Multi-Page Navigation Router
function navigateTo(pageId) {
    document.querySelectorAll(".page-section").forEach(section => {
        section.classList.add("hidden");
    });
    const target = document.getElementById(`page-${pageId}`);
    if (target) target.classList.remove("hidden");

    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("active-nav");
        if (btn.getAttribute("data-page") === pageId) {
            btn.classList.add("active-nav");
        }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleMobileMenu() {
    const menu = document.getElementById("mobile-menu");
    menu.classList.toggle("hidden");
}

// 2. Render Product Card HTML
function createProductCard(item) {
    const emiPerMonth = Math.round(item.price / 8);
    return `
        <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/50 transition flex flex-col justify-between group">
            <div>
                <div class="relative h-52 overflow-hidden bg-slate-950">
                    <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                    <span class="absolute top-3 left-3 bg-amber-400 text-slate-950 text-[11px] font-extrabold px-2.5 py-1 rounded-lg">
                        ${item.badge}
                    </span>
                    <span class="absolute top-3 right-3 bg-slate-900/90 text-slate-200 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-700">
                        ${item.category}
                    </span>
                </div>
                <div class="p-5">
                    <h4 class="text-base font-extrabold text-white mb-1">${item.name}</h4>
                    <p class="text-xs text-slate-400 mb-4">${item.specs}</p>
                    <div class="flex items-baseline justify-between border-t border-slate-800 pt-3">
                        <div>
                            <span class="text-xs text-slate-400 block">Offer Price</span>
                            <span class="text-xl font-extrabold text-amber-400">₹${item.price.toLocaleString('en-IN')}</span>
                        </div>
                        <div class="text-right">
                            <span class="text-[11px] text-emerald-400 font-bold block">EMI Starts @</span>
                            <span class="text-xs text-slate-300 font-semibold">₹${emiPerMonth}/mo</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-5 pb-5">
                <button onclick="openWhatsApp('Hi Lakshmi Mobiles Surandai! Naan ${item.name} (Price: ₹${item.price}) வாங்க விரும்புகிறேன். Stock & Offer details சொல்லுங்க.')" 
                    class="w-full py-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 font-extrabold text-xs transition flex items-center justify-center gap-2">
                    <i class="fa-brands fa-whatsapp text-base"></i> Enquire on WhatsApp
                </button>
            </div>
        </div>
    `;
}

// 3. Populate Home & Catalog Grids
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
            : `<p class="text-slate-400 col-span-full text-center py-8">No matching mobile found. Contact us on WhatsApp for custom stock!</p>`;
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
    const q = document.getElementById("search-input").value;
    renderGrids(q);
}

// 4. Live Repair Ticket Tracker
function checkRepairStatus() {
    const code = document.getElementById("repair-ticket-input").value.trim().toUpperCase();
    const box = document.getElementById("repair-status-output");
    box.classList.remove("hidden");

    if (repairTickets[code]) {
        const t = repairTickets[code];
        box.innerHTML = `
            <p class="text-amber-400 font-bold mb-1">Ticket #${code} - ${t.customer}</p>
            <p class="text-slate-300"><strong>Device:</strong> ${t.device}</p>
            <p class="text-slate-300"><strong>Service:</strong> ${t.issue}</p>
            <p class="text-emerald-400 font-bold mt-1">Status: ${t.status}</p>
            <p class="text-xs text-slate-400 mt-1">Estimated Bill: ${t.bill}</p>
        `;
    } else {
        box.innerHTML = `<p class="text-red-400">Ticket ID not found! Try demo IDs: <strong>LM101</strong> or <strong>LM102</strong>.</p>`;
    }
}

// 5. Service Booking to WhatsApp
function submitServiceBooking(e) {
    e.preventDefault();
    const name = document.getElementById("srv-name").value;
    const phone = document.getElementById("srv-phone").value;
    const model = document.getElementById("srv-model").value;
    const issue = document.getElementById("srv-issue").value;

    const msg = `Hi Lakshmi Mobiles Surandai (Express Service)!%0A` +
                `*Customer Name:* ${name}%0A` +
                `*Phone:* ${phone}%0A` +
                `*Mobile Model:* ${model}%0A` +
                `*Problem:* ${issue}%0A` +
                `Please confirm my 30-min repair slot & ₹100 online discount!`;

    window.open(`https://wa.me/${SHOP_WHATSAPP}?text=${msg}`, "_blank");
}

// 6. Exchange & EMI Calculators
function calculateExchange() {
    const base = Number(document.getElementById("ex-base").value);
    const cond = Number(document.getElementById("ex-cond").value);
    const box = Number(document.getElementById("ex-box").value);
    const exchangeBonus = 1000;

    const total = Math.round(base * cond + box + exchangeBonus);
    document.getElementById("ex-result").innerText = `₹${total.toLocaleString('en-IN')}`;
}

function calculateEMI() {
    const price = Number(document.getElementById("emi-price").value) || 0;
    const down = Number(document.getElementById("emi-down").value) || 0;
    const months = Number(document.getElementById("emi-months").value) || 8;

    const loanAmount = Math.max(0, price - down);
    const monthly = Math.round(loanAmount / months);
    document.getElementById("emi-result").innerText = `₹${monthly.toLocaleString('en-IN')} / month`;
}

// 7. Admin Portal: Add New Product
function addNewProduct(e) {
    e.preventDefault();
    const name = document.getElementById("adm-name").value;
    const category = document.getElementById("adm-cat").value;
    const price = Number(document.getElementById("adm-price").value);
    const specs = document.getElementById("adm-specs").value;
    const img = document.getElementById("adm-img").value || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80";

    products.unshift({
        id: Date.now(),
        name,
        category,
        price,
        specs,
        badge: "New Arrival",
        img
    });

    renderGrids();
    e.target.reset();
    alert(`"${name}" successfully added to Lakshmi Mobiles Catalog!`);
    navigateTo("catalog");
}

// 8. Direct WhatsApp Launcher
function openWhatsApp(message) {
    window.open(`https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank");
}

// Initialize on Page Load
document.addEventListener("DOMContentLoaded", () => {
    renderGrids();
    calculateExchange();
    calculateEMI();
});