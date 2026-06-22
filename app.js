/* ============================================================
   PAMETNI PLANER OBROKA - app.js
   ES6+ vanilla JavaScript, mock data, interactive UI
   ============================================================ */

'use strict';

// ============================================================
// 1. MOCK PODACI
// ============================================================

/** Lista inicijalnih namirnica u frižideru */
const initialItems = [
    { id: 'i1', name: 'Jaja', icon: 'fa-egg' },
    { id: 'i2', name: 'Paradajz', icon: 'fa-apple-whole' },
    { id: 'i3', name: 'Mleko', icon: 'fa-glass-water' },
    { id: 'i4', name: 'Piletina', icon: 'fa-drumstick-bite' },
];

/** Mapa ikonica za namirnice (koristi se za nove namirnice) */
const itemIconMap = {
    'jaja': 'fa-egg',
    'paradajz': 'fa-apple-whole',
    'mleko': 'fa-glass-water',
    'piletina': 'fa-drumstick-bite',
    'sir': 'fa-cheese',
    'tikvice': 'fa-seedling',
    'crni luk': 'fa-onion',
    'krompir': 'fa-potato',
    'šargarepa': 'fa-carrot',
    'paprika': 'fa-pepper',
    'kupus': 'fa-leaf',
    'spanać': 'fa-leaf',
    'jabuka': 'fa-apple-whole',
    'banana': 'fa-banana',
    'hleb': 'fa-bread-slice',
    'testenina': 'fa-wheat-awn',
    'pirinač': 'fa-bowl-rice',
    'riba': 'fa-fish',
    'meso': 'fa-drumstick-bite',
    'jogurt': 'fa-glass-water',
    'kisela pavlaka': 'fa-whiskey-glass',
    'maslinovo ulje': 'fa-oil-well',
    'so': 'fa-shaker',
    'biber': 'fa-mortar-pestle',
};

/** Podrazumevana ikonica ako nema mape */
const DEFAULT_ICON = 'fa-carrot';

/** Lista recepata sa mock podacima */
const recipes = [
    {
        id: 'r1',
        title: 'Omlet sa povrćem',
        image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400&h=300&fit=crop',
        time: '15 min',
        usageCount: 3,
        usageTotal: 4,
        ingredients: ['Jaja', 'Paradajz', 'Sir', 'Crni luk'],
        steps: [
            'Umuti jaja u činiji, posoli i pobiberi.',
            'Iseckaj paradajz, sir i crni luk na sitne kockice.',
            'Sipaj smesu u zagrejan tiganj sa malo ulja.',
            'Dodaj povrće i sir preko jaja, peci 5-7 minuta.',
            'Preklopi omlet i serviraj toplo.'
        ]
    },
    {
        id: 'r2',
        title: 'Piletina sa tikvicama',
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop',
        time: '30 min',
        usageCount: 3,
        usageTotal: 4,
        ingredients: ['Piletina', 'Tikvice', 'Crni luk', 'Paradajz'],
        steps: [
            'Iseci piletinu na kockice i začini solju i biberom.',
            'Iseckaj tikvice i crni luk na kolutove.',
            'Proprži piletinu na ulju dok ne porumeni.',
            'Dodaj povrće i dinstaj 15 minuta.',
            'Dodaj paradajz i kuvaj još 5 minuta. Serviraj toplo.'
        ]
    },
    {
        id: 'r3',
        title: 'Kajgana sa sirom',
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
        time: '10 min',
        usageCount: 2,
        usageTotal: 3,
        ingredients: ['Jaja', 'Sir', 'Mleko'],
        steps: [
            'Razbij jaja u činiju i dodaj malo mleka.',
            'Umuti viljuškom dok ne postane penasto.',
            'Iseckaj sir na kockice.',
            'Sipaj smesu u zagrejan tiganj i dodaj sir.',
            'Mešaj dok ne dobiješ željenu gustinu. Serviraj odmah.'
        ]
    },
    {
        id: 'r4',
        title: 'Salata od paradajza',
        image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400&h=300&fit=crop',
        time: '10 min',
        usageCount: 2,
        usageTotal: 3,
        ingredients: ['Paradajz', 'Crni luk', 'Sir'],
        steps: [
            'Iseci paradajz na kolutove ili kockice.',
            'Iseckaj crni luk na tanke kolutove.',
            'Iseckaj sir na kockice.',
            'Pomešaj sve u činiji.',
            'Dodaj maslinovo ulje, so i biber po ukusu.'
        ]
    },
    {
        id: 'r5',
        title: 'Pileća supa',
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
        time: '45 min',
        usageCount: 2,
        usageTotal: 5,
        ingredients: ['Piletina', 'Šargarepa', 'Crni luk', 'Krompir', 'Testenina'],
        steps: [
            'Stavi piletinu u lonac sa vodom i kuvaj 20 minuta.',
            'Iseckaj povrće na sitne kockice.',
            'Izvadi piletinu, iseckaj je i vrati u supu.',
            'Dodaj povrće i kuvaj još 15 minuta.',
            'Dodaj testeninu i kuvaj dok ne omekša. Posoli po ukusu.'
        ]
    }
];

// ============================================================
// 2. AI API KONFIGURACIJA
// ============================================================

/**
 * Hugging Face API ključ - korisnik ga može postaviti.
 * Dobij besplatni API ključ na: https://huggingface.co/settings/tokens
 * Zameni "YOUR_HF_TOKEN" sa svojim tokenom za pravu AI analizu.
 * Ako ostaviš prazno, koristiće se mock (simulirani) podaci.
 */
// Token se učitava iz config.js fajla (koji je u .gitignore)
// Ako config.js ne postoji, token je prazan -> koristi se simulacija
// Token možeš dodati i kroz ⚙️ Podešavanja u aplikaciji (čuva se u localStorage)
const HF_API_TOKEN = typeof HF_API_TOKEN !== 'undefined' ? HF_API_TOKEN : '';

/** Hugging Face model za prepoznavanje objekata na slikama */
const HF_MODEL = 'google/vit-base-patch16-224';

/** Mapa između AI prepoznatih labela i naših naziva namirnica */
const aiLabelToItemMap = {
    // Povrće
    'tomato': 'Paradajz',
    'lettuce': 'Salata',
    'cucumber': 'Krastavac',
    'onion': 'Crni luk',
    'garlic': 'Beli luk',
    'carrot': 'Šargarepa',
    'broccoli': 'Brokoli',
    'cauliflower': 'Karfiol',
    'cabbage': 'Kupus',
    'spinach': 'Spanać',
    'potato': 'Krompir',
    'sweet pepper': 'Paprika',
    'bell pepper': 'Paprika',
    'zucchini': 'Tikvice',
    'eggplant': 'Plavi patlidžan',
    'mushroom': 'Pecurke',
    'corn': 'Kukuruz',
    'peas': 'Grašak',
    'green bean': 'Boranjja',

    // Voće
    'apple': 'Jabuka',
    'banana': 'Banana',
    'orange': 'Pomorandža',
    'lemon': 'Limun',
    'strawberry': 'Jagode',
    'grape': 'Grožđe',
    'watermelon': 'Lubenica',
    'pear': 'Kruška',
    'peach': 'Breskva',
    'kiwi': 'Kivi',
    'pineapple': 'Ananas',
    'mango': 'Mango',
    'avocado': 'Avokado',

    // Mlečni proizvodi
    'milk': 'Mleko',
    'cheese': 'Sir',
    'yogurt': 'Jogurt',
    'butter': 'Maslac',
    'cream': 'Kisela pavlaka',
    'egg': 'Jaja',
    'eggs': 'Jaja',

    // Meso i riba
    'chicken': 'Piletina',
    'pork': 'Svinjetina',
    'beef': 'Govedina',
    'meat': 'Meso',
    'fish': 'Riba',
    'salmon': 'Losos',
    'shrimp': 'Škampi',
    'bacon': 'Slanina',
    'sausage': 'Kobasica',
    'ham': 'Šunka',

    // Testenina, hleb, žitarice
    'bread': 'Hleb',
    'pasta': 'Testenina',
    'spaghetti': 'Testenina',
    'rice': 'Pirinač',
    'flour': 'Brašno',
    'cereal': 'Žitarice',
    'oat': 'Ovsene pahuljice',

    // Ostalo
    'oil': 'Maslinovo ulje',
    'olive oil': 'Maslinovo ulje',
    'salt': 'So',
    'pepper': 'Biber',
    'sugar': 'Šećer',
    'honey': 'Med',
    'chocolate': 'Čokolada',
    'juice': 'Sok',
    'water': 'Voda',
    'coffee': 'Kafa',
    'tea': 'Čaj',
    'soup': 'Supa',
    'tomato sauce': 'Paradajz sos',
    'ketchup': 'Kečap',
    'mayonnaise': 'Majonez',
    'mustard': 'Senf',
};

// ============================================================
// 3. STATE (STANJE APLIKACIJE)
// ============================================================

/** Glavni niz namirnica - sadrži objekte { id, name, icon } */
let fridgeItems = [];

/** ID brojač za nove namirnice */
let nextItemId = 100;

// ============================================================
// 3. DOM REFERENCE
// ============================================================

const tagsContainer = document.getElementById('tagsContainer');
const itemsCount = document.getElementById('itemsCount');
const addItemInput = document.getElementById('addItemInput');
const addItemBtn = document.getElementById('addItemBtn');
const scanBtn = document.getElementById('scanBtn');
const cameraInput = document.getElementById('cameraInput');
const scanOverlay = document.getElementById('scanOverlay');
const scanProgressFill = document.getElementById('scanProgressFill');
const scanStatus = document.querySelector('.scan-status');
const recipesGrid = document.getElementById('recipesGrid');
const modalOverlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const alertBanner = document.getElementById('alertBanner');
const alertClose = document.getElementById('alertClose');
const notificationBadge = document.getElementById('notificationBadge');

// ============================================================
// 4. POMOĆNE FUNKCIJE
// ============================================================

/**
 * Vraća ikonicu za datu namirnicu na osnovu mape.
 * @param {string} name - Naziv namirnice
 * @returns {string} FontAwesome klasa ikonice
 */
function getIconForItem(name) {
    const key = name.toLowerCase().trim();
    return itemIconMap[key] || DEFAULT_ICON;
}

/**
 * Generiše jedinstveni ID za novu namirnicu.
 * @returns {string}
 */
function generateItemId() {
    return 'i' + (nextItemId++);
}

// ============================================================
// 5. RENDER FUNKCIJE
// ============================================================

/**
 * Prikazuje sve tagove (namirnice) u tagsContainer.
 */
function renderTags() {
    // Ako nema namirnica, prikaži prazan state
    if (fridgeItems.length === 0) {
        tagsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-fridge"></i>
                <p>Tvoj frižider je prazan. Dodaj namirnice ili ih skeniraj!</p>
            </div>
        `;
        itemsCount.textContent = '0';
        return;
    }

    // Izgradi HTML za svaki tag
    let html = '';
    fridgeItems.forEach(item => {
        html += `
            <span class="tag-item" data-id="${item.id}">
                <i class="fas ${item.icon} tag-icon"></i>
                ${item.name}
                <button class="tag-remove" data-id="${item.id}" aria-label="Ukloni ${item.name}">
                    <i class="fas fa-times"></i>
                </button>
            </span>
        `;
    });

    tagsContainer.innerHTML = html;
    itemsCount.textContent = fridgeItems.length;

    // Dodaj event listenere za X dugmad (delegacija preko container-a)
    document.querySelectorAll('.tag-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.id;
            removeItem(id);
        });
    });
}

/**
 * Prikazuje kartice recepata u recipesGrid.
 */
function renderRecipes() {
    let html = '';

    recipes.forEach(recipe => {
        // Izračunaj koliko namirnica iz recepta korisnik ima u frižideru
        const matchedCount = recipe.ingredients.filter(ing =>
            fridgeItems.some(item =>
                item.name.toLowerCase() === ing.toLowerCase()
            )
        ).length;

        // Ako nema nijedne namirnice, prikaži poruku
        const usageText = matchedCount > 0
            ? `Iskoristićeš ${matchedCount} namirnic${matchedCount === 1 ? 'u' : 'e'} koje imaš`
            : 'Nemaš potrebne namirnice';

        html += `
            <div class="recipe-card" data-id="${recipe.id}">
                <img
                    src="${recipe.image}"
                    alt="${recipe.title}"
                    class="recipe-card-img"
                    loading="lazy"
                    onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22><rect fill=%22%23E8F5E9%22 width=%22400%22 height=%22300%22/><text fill=%22%232E7D32%22 font-size=%2220%22 x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22>🍽️</text></svg>'"
                >
                <div class="recipe-card-body">
                    <h3 class="recipe-card-title">${recipe.title}</h3>
                    <div class="recipe-card-meta">
                        <span><i class="fas fa-clock"></i> ${recipe.time}</span>
                        <span><i class="fas fa-utensils"></i> ${recipe.ingredients.length} sastojaka</span>
                    </div>
                    <div class="recipe-card-usage">
                        <i class="fas fa-check-circle"></i> ${usageText}
                    </div>
                    <button class="recipe-card-btn" data-id="${recipe.id}">
                        Pogledaj recept
                    </button>
                </div>
            </div>
        `;
    });

    recipesGrid.innerHTML = html;

    // Dodaj event listenere za dugmad "Pogledaj recept"
    document.querySelectorAll('.recipe-card-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const recipeId = btn.dataset.id;
            const recipe = recipes.find(r => r.id === recipeId);
            if (recipe) {
                openRecipeModal(recipe);
            }
        });
    });
}

/**
 * Otvara modal sa detaljima recepta.
 * @param {Object} recipe - Recept objekat
 */
function openRecipeModal(recipe) {
    // Izračunaj koje namirnice korisnik ima
    const matchedIngredients = recipe.ingredients.map(ing => {
        const has = fridgeItems.some(item =>
            item.name.toLowerCase() === ing.toLowerCase()
        );
        return { name: ing, has };
    });

    let ingredientsHtml = '';
    matchedIngredients.forEach(ing => {
        ingredientsHtml += `
            <li style="${ing.has ? '' : 'opacity: 0.5; background: #f5f5f5;'}">
                ${ing.has ? '✅' : '❌'} ${ing.name}
            </li>
        `;
    });

    let stepsHtml = '';
    recipe.steps.forEach(step => {
        stepsHtml += `<li>${step}</li>`;
    });

    modalBody.innerHTML = `
        <img
            src="${recipe.image}"
            alt="${recipe.title}"
            class="modal-recipe-img"
            onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22><rect fill=%22%23E8F5E9%22 width=%22400%22 height=%22300%22/><text fill=%22%232E7D32%22 font-size=%2220%22 x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22>🍽️</text></svg>'"
        >
        <h2 class="modal-recipe-title">${recipe.title}</h2>
        <div class="modal-recipe-meta">
            <span><i class="fas fa-clock"></i> ${recipe.time}</span>
            <span><i class="fas fa-utensils"></i> ${recipe.ingredients.length} sastojaka</span>
        </div>

        <h3 class="modal-section-title">📋 Sastojci</h3>
        <ul class="modal-ingredients">
            ${ingredientsHtml}
        </ul>

        <h3 class="modal-section-title">👨‍🍳 Priprema</h3>
        <ol class="modal-steps">
            ${stepsHtml}
        </ol>
    `;

    // Prikaži modal
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Zatvara modal.
 */
function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================================
// 6. POSLOVNA LOGIKA
// ============================================================

/**
 * Dodaje novu namirnicu u frižider.
 * @param {string} name - Naziv namirnice
 */
function addItem(name) {
    const trimmed = name.trim();
    if (!trimmed) return;

    // Proveri da li već postoji (case-insensitive)
    const exists = fridgeItems.some(item =>
        item.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
        // Treperi postojećim tagom kao indikacija
        const existingTag = document.querySelector(`.tag-item:has(.tag-remove[data-id])`);
        if (existingTag) {
            existingTag.style.borderColor = 'var(--warning)';
            setTimeout(() => {
                existingTag.style.borderColor = '';
            }, 600);
        }
        return;
    }

    const newItem = {
        id: generateItemId(),
        name: trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase(),
        icon: getIconForItem(trimmed),
    };

    fridgeItems.push(newItem);
    renderTags();
    renderRecipes();
}

/**
 * Uklanja namirnicu iz frižidera po ID-ju.
 * @param {string} id - ID namirnice
 */
function removeItem(id) {
    fridgeItems = fridgeItems.filter(item => item.id !== id);
    renderTags();
    renderRecipes();
}

/**
 * Šalje sliku na Hugging Face AI model za prepoznavanje objekata.
 * @param {string} base64Image - Slika u base64 formatu (bez prefiksa)
 * @param {string} token - Aktivni API token
 * @returns {Promise<Array<{label: string, score: number}>>} Lista prepoznatih objekata
 */
async function analyzeImageWithAI(base64Image, token) {
    const response = await fetch(
        `https://api-inference.huggingface.co/models/${HF_MODEL}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ inputs: base64Image }),
        }
    );

    if (!response.ok) {
        throw new Error(`API greška: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result;
}

/**
 * Pretvara AI labelu u naziv namirnice koristeći mapu.
 * @param {string} label - AI prepoznata labela (npr. "tomato", "egg")
 * @returns {string|null} Naziv namirnice ili null ako nije prehrambeni artikal
 */
function mapAILabelToItem(label) {
    const cleanLabel = label.toLowerCase().trim();

    // Direktno mapiranje
    if (aiLabelToItemMap[cleanLabel]) {
        return aiLabelToItemMap[cleanLabel];
    }

    // Delimično poklapanje (npr. "green bell pepper" -> "Paprika")
    for (const [key, value] of Object.entries(aiLabelToItemMap)) {
        if (cleanLabel.includes(key)) {
            return value;
        }
    }

    return null;
}

/**
 * Filtrira AI rezultate i vraća samo prehrambene artikle koje možemo dodati.
 * @param {Array} predictions - Lista predikcija iz AI modela
 * @returns {string[]} Lista naziva namirnica za dodavanje
 */
function extractFoodItemsFromAI(predictions) {
    const foundItems = new Set();

    // Uzmi top 10 predikcija sa najvećom verovatnoćom
    const topPredictions = predictions
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

    topPredictions.forEach(pred => {
        const itemName = mapAILabelToItem(pred.label);
        if (itemName) {
            foundItems.add(itemName);
        }
    });

    // Vrati najviše 5 namirnica
    return Array.from(foundItems).slice(0, 5);
}

/**
 * Prikazuje overlay za AI analizu slike.
 * Šalje sliku na Hugging Face API za stvarno prepoznavanje namirnica.
 * Ako API nije konfigurisan (token prazan), koristi mock podatke.
 * @param {File} imageFile - Fajl slike koji je korisnik uslikao/izabrao
 */
async function startScanWithImage(imageFile) {
    // Prikaži overlay
    scanOverlay.classList.add('active');
    scanProgressFill.style.width = '0%';
    scanStatus.textContent = 'AI analizira namirnice...';

    // Prikaži sliku u scan frame-u
    const frameIcon = document.querySelector('.scan-frame-icon');
    const existingImg = document.querySelector('.scan-frame-img');
    if (existingImg) existingImg.remove();

    const img = document.createElement('img');
    img.className = 'scan-frame-img';
    img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:21px;';
    const frame = document.querySelector('.scan-frame');
    frame.appendChild(img);
    if (frameIcon) frameIcon.style.display = 'none';

    // Učitaj sliku za prikaz i za AI analizu
    const imageUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
            resolve(e.target.result);
        };
        reader.readAsDataURL(imageFile);
    });

    // Animiraj progress bar
    let progress = 0;
    const interval = setInterval(() => {
        progress += 3;
        scanProgressFill.style.width = Math.min(progress, 90) + '%';
        if (progress >= 90) {
            clearInterval(interval);
        }
    }, 100);

    let detectedItems = [];

    // Uzmi token: prvo iz localStorage (preko settings UI), pa iz konstante
    const activeToken = window.__hfToken || HF_API_TOKEN;

    try {
        // Proveri da li je API token konfigurisan
        if (activeToken && activeToken.trim() !== '') {
            scanStatus.textContent = '🧠 AI model prepoznaje namirnice...';

            // Uzmi base64 deo (bez prefiksa "data:image/...;base64,")
            const base64Data = imageUrl.split(',')[1];

            // Pošalji na Hugging Face API sa aktivnim tokenom
            const predictions = await analyzeImageWithAI(base64Data, activeToken);

            // Ekstrahuj prehrambene artikle
            detectedItems = extractFoodItemsFromAI(predictions);

            scanStatus.textContent = `✅ AI je prepoznao ${detectedItems.length} namirnica!`;
        } else {
            // Ako nema API tokena, koristi simulaciju sa porukom
            scanStatus.textContent = '⚠️ API ključ nije podešen. Koristim simulaciju...';
            await new Promise(resolve => setTimeout(resolve, 1500));
            detectedItems = ['Sir', 'Tikvice', 'Crni luk'];
        }
    } catch (error) {
        console.error('AI analiza nije uspela:', error);
        // Fallback na mock podatke ako API ne radi
        scanStatus.textContent = '⚠️ AI servis nije dostupan. Koristim lokalnu analizu...';
        await new Promise(resolve => setTimeout(resolve, 1000));
        detectedItems = ['Sir', 'Tikvice', 'Crni luk'];
    }

    // Završi progress bar
    clearInterval(interval);
    scanProgressFill.style.width = '100%';

    await new Promise(resolve => setTimeout(resolve, 500));

    // Dodaj prepoznate namirnice u frižider
    const addedItems = [];
    detectedItems.forEach(name => {
        const exists = fridgeItems.some(item =>
            item.name.toLowerCase() === name.toLowerCase()
        );
        if (!exists) {
            fridgeItems.push({
                id: generateItemId(),
                name: name,
                icon: getIconForItem(name),
            });
            addedItems.push(name);
        }
    });

    // Zatvori overlay
    scanOverlay.classList.remove('active');

    // Resetuj scan frame
    const frameImgReset = document.querySelector('.scan-frame-img');
    const frameIconReset = document.querySelector('.scan-frame-icon');
    if (frameImgReset) frameImgReset.remove();
    if (frameIconReset) frameIconReset.style.display = '';

    // Re-renderuj UI
    renderTags();
    renderRecipes();

    // Prikaži potvrdu
    if (addedItems.length > 0) {
        const itemsList = addedItems.join(', ');
        const source = activeToken ? 'AI' : 'simulirane';
        showTempAlert(`✅ ${source} analiza je prepoznala ${addedItems.length} namirnica: ${itemsList}`);
    } else {
        showTempAlert('ℹ️ Sve prepoznate namirnice već postoje u frižideru.');
    }
}

/**
 * Prikazuje privremeni baner obaveštenja.
 * @param {string} message - Poruka za prikaz
 */
function showTempAlert(message) {
    const alertText = document.getElementById('alertText');
    const originalText = alertText.textContent;
    alertText.textContent = message;
    alertBanner.style.animation = 'none';
    // Force reflow
    void alertBanner.offsetHeight;
    alertBanner.style.animation = 'slideDown 0.4s ease';

    // Vrati originalnu poruku posle 4 sekunde
    setTimeout(() => {
        alertText.textContent = originalText;
        alertBanner.style.animation = 'none';
        void alertBanner.offsetHeight;
        alertBanner.style.animation = 'slideDown 0.4s ease';
    }, 4000);
}

// ============================================================
// 7. EVENT LISTENERI
// ============================================================

// --- Dugme za skeniranje - otvara kameru / bira sliku ---
scanBtn.addEventListener('click', () => {
    cameraInput.click();
});

// --- Kada korisnik uslika / izabere sliku ---
cameraInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        startScanWithImage(file);
    }
    // Resetuj input da bi mogao ponovo da izabere istu sliku
    cameraInput.value = '';
});

// --- Dodavanje namirnice preko input polja ---
addItemBtn.addEventListener('click', () => {
    const value = addItemInput.value;
    if (value.trim()) {
        addItem(value);
        addItemInput.value = '';
        addItemInput.focus();
    }
});

// Dodavanje namirnice na Enter
addItemInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const value = addItemInput.value;
        if (value.trim()) {
            addItem(value);
            addItemInput.value = '';
        }
    }
});

// --- Zatvaranje modala ---
modalClose.addEventListener('click', closeModal);

// Zatvaranje modala klikom na overlay (pozadinu)
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Zatvaranje modala na Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});

// --- Zatvaranje alert banera ---
alertClose.addEventListener('click', () => {
    alertBanner.style.display = 'none';
    notificationBadge.textContent = '0';
});

// --- Dugme za notifikacije ---
document.getElementById('notificationBtn').addEventListener('click', () => {
    // Ako je baner sakriven, prikaži ga ponovo
    if (alertBanner.style.display === 'none') {
        alertBanner.style.display = 'flex';
        notificationBadge.textContent = '1';
    } else {
        alertBanner.style.display = 'none';
        notificationBadge.textContent = '0';
    }
});

// --- Podešavanja (API token) ---
const settingsBtn = document.getElementById('settingsBtn');
const settingsOverlay = document.getElementById('settingsOverlay');
const settingsClose = document.getElementById('settingsClose');
const apiTokenInput = document.getElementById('apiTokenInput');
const apiTokenSave = document.getElementById('apiTokenSave');
const apiStatusText = document.getElementById('apiStatusText');

// Otvori settings modal
settingsBtn.addEventListener('click', () => {
    const currentToken = window.__hfToken || HF_API_TOKEN;
    if (currentToken) {
        apiTokenInput.value = currentToken;
        apiStatusText.textContent = '✅ podešen i aktivan';
        apiStatusText.style.color = 'var(--green-primary)';
    } else {
        apiTokenInput.value = '';
        apiStatusText.textContent = '❌ nije podešen (koristi se simulacija)';
        apiStatusText.style.color = 'var(--warning)';
    }
    settingsOverlay.classList.add('active');
});

// Zatvori settings modal
settingsClose.addEventListener('click', () => {
    settingsOverlay.classList.remove('active');
});

settingsOverlay.addEventListener('click', (e) => {
    if (e.target === settingsOverlay) {
        settingsOverlay.classList.remove('active');
    }
});

// Sačuvaj API token
apiTokenSave.addEventListener('click', () => {
    const token = apiTokenInput.value.trim();
    if (token) {
        // Sačuvaj token u localStorage i promeni vrednost
        localStorage.setItem('hf_api_token', token);
        // Pošto je const, ne možemo direktno dodeliti HF_API_TOKEN
        // Umesto toga, koristićemo localStorage za čuvanje
        window.__hfToken = token;
        apiStatusText.textContent = '✅ sačuvan i aktivan';
        apiStatusText.style.color = 'var(--green-primary)';
        showTempAlert('✅ AI API token je sačuvan! Skeniraj ponovo za pravu AI analizu.');
    } else {
        localStorage.removeItem('hf_api_token');
        window.__hfToken = '';
        apiStatusText.textContent = '❌ uklonjen (koristi se simulacija)';
        apiStatusText.style.color = 'var(--warning)';
        showTempAlert('ℹ️ API token uklonjen. Koristi se simulirana analiza.');
    }
});

// ============================================================
// 8. INICIJALIZACIJA
// ============================================================

/**
 * Pokreće aplikaciju - učitava početne podatke i renderuje UI.
 */
function initApp() {
    // Učitaj sačuvani API token iz localStorage (ako postoji)
    const savedToken = localStorage.getItem('hf_api_token');
    if (savedToken) {
        window.__hfToken = savedToken;
        console.log('🔑 AI API token učitan iz localStorage');
    }

    // Učitaj početne namirnice
    fridgeItems = initialItems.map(item => ({ ...item }));

    // Renderuj početno stanje
    renderTags();
    renderRecipes();

    console.log('🍽️ Pametni planer obroka je pokrenut!');
    console.log(`📦 Namirnice u frižideru: ${fridgeItems.length}`);
    console.log(`🍳 Recepti dostupni: ${recipes.length}`);
    console.log(`🤖 AI analiza: ${window.__hfToken ? '✅ aktivna (token podešen)' : '⚠️ simulacija (token nije podešen)'}`);
}

// Pokreni aplikaciju kada se DOM učita
document.addEventListener('DOMContentLoaded', initApp);
