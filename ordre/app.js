/* =========================
   app.js — Order Section (Fixed Full)
   Works with your exact HTML structure
   ========================= */

(function () {
  "use strict";

  // =========================
  // ✅ SUPABASE: Guard + Client
  // =========================
  if (!window.supabase || !window.supabase.createClient) {
    console.error("❌ Supabase library is not loaded. Add supabase-js script before app.js");
    alert("❌ مكتبة Supabase غير محمّلة. تأكد أنك أضفت supabase-js قبل app.js في HTML.");
    return;
  }

  const supabase = window.supabase.createClient(
    // ✅ FIXED URL (كان ناقص حرف m)
    "https://jbmcbjzcedqpvnhbmrhk.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibWNianpjZWRxcHZuaGJtcmhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2NjU1MDUsImV4cCI6MjA4NTI0MTUwNX0.u_D1K7gFCQmmI_m0do5-VpdXrXXLPQ8BCDMLc3Ew1Yk"
  );

  console.log("✅ Supabase ready:", supabase);

  // =========================
  // 1) BOOKS DATA
  // =========================
const BOOKS = [
  { name: "فن اللامبالاة", price: 850 },
  { name: "الأب الغني الأب الفقير", price: 900 },
  { name: "العادات الذرية", price: 1000 },
  { name: "قوة الآن", price: 900 },
  { name: "أنت قوة مذهلة", price: 900 },
  { name: "نظرية الفستق", price: 950 },
  { name: "مميز بالأصفر", price: 850 }
];

  const BOOK_PRICE = Object.fromEntries(BOOKS.map((b) => [b.name, b.price]));

  // =========================
  // 2) SHIPPING TABLE
  // =========================
  const SHIPPING_TABLE = {
    1: { home: 1100, office: 600 },
    2: { home: 700, office: 400 },
    3: { home: 900, office: 500 },
    4: { home: 800, office: 400 },
    5: { home: 700, office: 400 },
    6: { home: 600, office: 400 },
    7: { home: 900, office: 500 },
    8: { home: 1100, office: 600 },
    9: { home: 500, office: 350 },
    10: { home: 700, office: 400 },
    11: { home: 1300, office: 800 },
    12: { home: 800, office: 400 },
    13: { home: 800, office: 400 },
    14: { home: 800, office: 400 },
    15: { home: 700, office: 400 },
    16: { home: 500, office: 350 },
    17: { home: 900, office: 500 },
    18: { home: 450, office: 350 },
    19: { home: 600, office: 400 },
    20: { home: 800, office: 400 },
    21: { home: 600, office: 400 },
    22: { home: 800, office: 400 },
    23: { home: 650, office: 400 },
    24: { home: 800, office: 400 },
    25: { home: 650, office: 400 },
    26: { home: 700, office: 400 },
    27: { home: 750, office: 400 },
    28: { home: 800, office: 500 },
    29: { home: 700, office: 400 },
    30: { home: 1000, office: 500 },
    31: { home: 700, office: 400 },
    32: { home: 1000, office: 500 },
    33: { home: 1300, office: 600 },
    34: { home: 700, office: 400 },
    35: { home: 700, office: 400 },
    36: { home: 800, office: 0 },
    37: { home: 1300, office: 600 },
    38: { home: 800, office: 400 },
    39: { home: 900, office: 500 },
    40: { home: 800, office: 500 },
    41: { home: 800, office: 500 },
    42: { home: 700, office: 400 },
    43: { home: 600, office: 400 },
    44: { home: 700, office: 400 },
    45: { home: 1000, office: 500 },
    46: { home: 800, office: 400 },
    47: { home: 1000, office: 500 },
    48: { home: 600, office: 400 },
    49: { home: 1300, office: 0 },
    51: { home: 900, office: 0 },
    52: { home: 1300, office: 0 },
    53: { home: 1300, office: 600 },
    55: { home: 900, office: 0 },
    57: { home: 900, office: 0 },
    58: { home: 1000, office: 500 },
  };

  // ✅ value (عربي) -> كود
  const VALUE_TO_CODE_ALIAS = {
    "أدرار": 1,
    "الشلف": 2,
    "الأغواط": 3,
    "أم البواقي": 4,
    "باتنة": 5,
    "بجاية": 6,
    "بسكرة": 7,
    "بشار": 8,
    "البليدة": 9,
    "البويرة": 10,
    "تمنراست": 11,
    "تبسة": 12,
    "تلمسان": 13,
    "تيارت": 14,
    "تيزي وزو": 15,
    "الجزائر": 16,
    "الجلفة": 17,
    "جيجل": 18,
    "سطيف": 19,
    "سعيدة": 20,
    "سكيكدة": 21,
    "سيدي بلعباس": 22,
    "عنابة": 23,
    "قالمة": 24,
    "قسنطينة": 25,
    "المدية": 26,
    "مستغانم": 27,
    "المسيلة": 28,
    "معسكر": 29,
    "ورقلة": 30,
    "وهران": 31,
    "البيض": 32,
    "إليزي": 33,
    "برج بوعريريج": 34,
    "بومرداس": 35,
    "الطارف": 36,
    "تندوف": 37,
    "تيسمسيلت": 38,
    "الوادي": 39,
    "خنشلة": 40,
    "سوق أهراس": 41,
    "تيبازة": 42,
    "ميلة": 43,
    "عين الدفلى": 44,
    "النعامة": 45,
    "عين تموشنت": 46,
    "غرداية": 47,
    "غليزان": 48,
    "تيميمون": 49,
    "أولاد جلال": 51,
    "بني عباس": 52,
    "عين صالح": 53,
    "تقرت": 55,
    "المغير": 57,
    "المنيعة": 58,
  };

  // =========================
  // 3) COMMUNES
  // =========================
  const communesByWilaya = {
    "أدرار (01)": ["أدرار","تامست","شروين","رقان","إن زغمير","تيت","قصر قدور","تسابيت","تيميمون","أولاد السعيد","زاوية كونتة","أولف","تيمقتن","تامنطيت","فنوغيل","تنركوك","دلدول","سالي","أقبلي","المطارفة","أولاد أحمد تيمي","بودة","أوقروت","طالمين","برج باجي مختار","السبع","أولاد عيسى","تيمياوين"],
    "الشلف (02)": ["الشلف","تنس","وادي الفضة","بوقادير","أبو الحسن","المرسى","الصبحة","أولاد فارس","سيدي عكاشة","الزبوجة"],
    "الأغواط (03)": ["الأغواط","قصر الحيران","عين ماضي","أفلو","الحاج مشري","سبقاق","تاويالة","كسران","سيدي مخلوف"],
    "أم البواقي (04)": ["أم البواقي","عين مليلة","عين فكرون","سيقوس","مسكيانة","فكيرينة","سوق نعمان"],
    "باتنة (05)": ["باتنة","آريس","تيمقاد","نقاوس","عين التوتة","بريكة","المعذر"],
    "بجاية (06)": ["بجاية","أميزور","أوقاس","تازمالت","خراطة","صدوق","سوق الاثنين"],
    "بسكرة (07)": ["بسكرة","طولقة","أورلال","زريبة الوادي","سيدي خالد","جمورة","فوغالة"],
    "بشار (08)": ["بشار","القنادسة","بني ونيف","العبادلة","كرزاز","تاغيت"],
    "البليدة (09)": ["البليدة","بوفاريك","العفرون","موزاية","الأربعاء","بوعينان"],
    "البويرة (10)": ["البويرة","سور الغزلان","الأخضرية","عين بسام","بشلول","القادرية","حيزر"],
    "تمنراست (11)": ["تمنراست","عين أمقل","إدلس","تازروك","أبلسة","تاظروك"],
    "تبسة (12)": ["تبسة","الشريعة","بئر العاتر","العوينات","نقرين","الحمامات","العقلة"],
    "تلمسان (13)": ["تلمسان","مغنية","سبدو","ندرومة","باب العسة","الرمشي","الغزوات"],
    "تيارت (14)": ["تيارت","فرندة","مدروسة","مهدية","عين دزاريت","السوقر"],
    "تيزي وزو (15)": ["تيزي وزو","ذراع بن خدة","عزازقة","تيقزيرت","بوغني","مقلع","بني دوالة"],
    "الجزائر (16)": ["الجزائر الوسطى","باب الزوار","حسين داي","الدار البيضاء","القبة","بئر مراد رايس","الرويبة","زرالدة","سطاوالي"],
    "الجلفة (17)": ["الجلفة","مسعد","حاسي بحبح","عين وسارة","دار الشيوخ","الشارف","فيض البطمة"],
    "جيجل (18)": ["جيجل","الطاهير","الميلية","العوانة","زيامة منصورية","الشقفة"],
    "سطيف (19)": ["سطيف","العلمة","عين أرنات","بوقاعة","عين ولمان","حمام قرقور"],
    "سعيدة (20)": ["سعيدة","عين الحجر","أولاد إبراهيم","سيدي بوبكر","مولاي العربي"],
    "سكيكدة (21)": ["سكيكدة","القل","عزابة","تمالوس","الحدائق","بن عزوز"],
    "سيدي بلعباس (22)": ["سيدي بلعباس","تلاغ","سيدي علي بوسيدي","مرحوم","مصطفى بن إبراهيم"],
    "عنابة (23)": ["عنابة","البوني","سرايدي","برحال","الحجار"],
    "قالمة (24)": ["قالمة","وادي الزناتي","حمام دباغ","هيليوبوليس","بوشقوف"],
    "قسنطينة (25)": ["قسنطينة","الخروب","ديدوش مراد","عين عبيد","زيغود يوسف"],
    "المدية (26)": ["المدية","البرواقية","العمارية","وزرة","تابلاط","شلالة العذاورة"],
    "مستغانم (27)": ["مستغانم","عين تادلس","سيدي علي","حاسي ماماش","مزغران"],
    "المسيلة (28)": ["المسيلة","بوسعادة","سيدي عيسى","مقرة","حمام الضلعة","أولاد دراج"],
    "معسكر (29)": ["معسكر","تيغنيف","سيق","غريس","المحمدية","وادي الأبطال"],
    "ورقلة (30)": ["ورقلة","حاسي مسعود","الرويسات","سيدي خويلد","البرمة"],
    "وهران (31)": ["وهران","بئر الجير","السانية","أرزيو","بطيوة","عين الترك"],
    "البيض (32)": ["البيض","بريزينة","الأبيض سيدي الشيخ","رقاصة","الكاف لحمر"],
    "إليزي (33)": ["إليزي","جانت","برج الحواس","دبداب"],
    "برج بوعريريج (34)": ["برج بوعريريج","رأس الوادي","المنصورة","الحمادية","العناصر"],
    "بومرداس (35)": ["بومرداس","تيجلابين","بودواو","برج منايل","الثنية","دلس"],
    "الطارف (36)": ["الطارف","القالة","بوحجار","بن مهيدي","الذرعان"],
    "تندوف (37)": ["تندوف","أم العسل"],
    "تيسمسيلت (38)": ["تيسمسيلت","خميستي","ثنية الحد","برج الأمير عبد القادر"],
    "الوادي (39)": ["الوادي","قمار","الرباح","حساني عبد الكريم","البياضة","المقرن"],
    "خنشلة (40)": ["خنشلة","قايس","ششار","أولاد رشاش","بوحمامة"],
    "سوق أهراس (41)": ["سوق أهراس","تاورة","سدراتة","أولاد إدريس","مداوروش"],
    "تيبازة (42)": ["تيبازة","شرشال","القليعة","حجوط","فوكة","بواسماعيل"],
    "ميلة (43)": ["ميلة","شلغوم العيد","فرجيوة","تاجنانت","عين البيضاء أحريش"],
    "عين الدفلى (44)": ["عين الدفلى","خميس مليانة","العطاف","العامرة","جندل","بطحية"],
    "النعامة (45)": ["النعامة","مشرية","عين الصفراء","مغرار","عسلة"],
    "عين تموشنت (46)": ["عين تموشنت","حمام بوحجر","بني صاف","شعبة اللحم","العين الكيحل"],
    "غرداية (47)": ["غرداية","بني يزقن","القرارة","بريان","متليلي"],
    "غليزان (48)": ["غليزان","وادي رهيو","عمي موسى","يلل","الحمادنة"],
    "تيميمون (49)": ["تيميمون","أوقروت","طلمين","دلدول","تنركوك"],
    "أولاد جلال (51)": ["أولاد جلال","الدوسن","الشعيبة"],
    "بني عباس (52)": ["بني عباس","كرزاز","إقلي","تامترت"],
    "عين صالح (53)": ["عين صالح","فقارة الزوى","عين قزام"],
    "تقرت (55)": ["تقرت","تماسين","الطيبات","نزلة"],
    "المغير (57)": ["المغير","جامعة","سطيل"],
    "المنيعة (58)": ["المنيعة","حاسي القارة","حاسي الفحل"],
  };

  function parseWilayaLabel(key) {
    const m = String(key).match(/^(.*)\s\((\d{2})\)$/);
    if (!m) return { name: key, code2: null };
    return { name: m[1].trim(), code2: m[2] };
  }

  // =========================
  // 4) DOM
  // =========================
  const orderForm = document.getElementById("orderForm");
  const booksList = document.getElementById("booksList");
  const addBookBtn = document.getElementById("addBookBtn");

  const wilayaSelect = document.getElementById("wilayaSelect");
  const communeSelect = document.getElementById("communeSelect");

  const booksTotalEl = document.getElementById("booksTotal");
  const shippingFeeEl = document.getElementById("shippingFee");
  const grandTotalEl = document.getElementById("grandTotal");

  const shippingFeeInput = document.getElementById("shippingFeeInput");
  const grandTotalInput = document.getElementById("grandTotalInput");

  const homeFeeLabel = document.getElementById("homeFeeLabel");
  const officeFeeLabel = document.getElementById("officeFeeLabel");

  const phoneInputEl = document.getElementById("phoneInput");
  const communeWrapper = document.getElementById("communeWrapper"); // optional

  if (!orderForm || !booksList) return;

  // =========================
  // 5) Helpers
  // =========================
  function formatDZD(n) {
    return Number(n || 0).toLocaleString("fr-DZ").replace(/\s+/g, "") + " دج";
  }

  function getDeliveryType() {
    const checked = document.querySelector('input[name="delivery_type"]:checked');
    return checked ? checked.value : "home";
  }

  function resolveWilayaCode() {
    const v = wilayaSelect?.value;
    if (!v) return null;
    if (/^\d+$/.test(v)) return Number(v);
    if (VALUE_TO_CODE_ALIAS[v]) return VALUE_TO_CODE_ALIAS[v];
    return null;
  }

  function getShippingFeesForSelectedWilaya() {
    const code = resolveWilayaCode();
    if (code && SHIPPING_TABLE[code]) return SHIPPING_TABLE[code];
    return { home: 0, office: 0 };
  }

  function getShippingFee() {
    const fees = getShippingFeesForSelectedWilaya();
    const type = getDeliveryType();
    return type === "office" ? (fees.office ?? 0) : (fees.home ?? 0);
  }

  function refreshDeliveryLabels() {
    const fees = getShippingFeesForSelectedWilaya();
    if (homeFeeLabel) homeFeeLabel.textContent = formatDZD(fees.home ?? 0);
    if (officeFeeLabel) officeFeeLabel.textContent = formatDZD(fees.office ?? 0);
  }

  // phone helpers
  function onlyDigits10(v) {
    return String(v || "").replace(/\D+/g, "").slice(0, 10);
  }
  function isValidDZMobile(v) {
    return /^0[5-7]\d{8}$/.test(v);
  }
  function validatePhoneInputLive() {
    if (!phoneInputEl) return true;
    phoneInputEl.value = onlyDigits10(phoneInputEl.value);
    if (!phoneInputEl.value) {
      phoneInputEl.setCustomValidity("رجاءً أدخل رقم الهاتف.");
      return false;
    }
    if (!isValidDZMobile(phoneInputEl.value)) {
      phoneInputEl.setCustomValidity("رقم الهاتف يجب أن يكون 10 أرقام ويبدأ بـ 05 أو 06 أو 07.");
      return false;
    }
    phoneInputEl.setCustomValidity("");
    return true;
  }

  function toggleCommuneVisibility() {
    const type = getDeliveryType();
    if (!communeWrapper || !communeSelect) return;
    if (type === "home") {
      communeWrapper.style.display = "block";
      communeSelect.required = true;
    } else {
      communeWrapper.style.display = "none";
      communeSelect.required = false;
      communeSelect.value = "";
    }
  }

  // =========================
  // 6) Books select + price fill
  // =========================
  function fillBookOptions(selectEl) {
    if (!selectEl || selectEl.dataset.filled === "1") return;

    BOOKS.forEach((b) => {
      const opt = document.createElement("option");
      opt.value = b.name;
      opt.textContent = `${b.name} (${b.price} دج)`;
      selectEl.appendChild(opt);
    });

    selectEl.dataset.filled = "1";
  }

  function ensureBookSelect(row) {
    let select = row.querySelector('select[name="book_name[]"]');
    if (select) return select;

    const nameInput = row.querySelector('input[name="book_name[]"]');
    if (!nameInput) return null;

    select = document.createElement("select");
    select.name = "book_name[]";
    select.className = "book-select";
    select.required = true;

    const ph = document.createElement("option");
    ph.value = "";
    ph.disabled = true;
    ph.selected = true;
    ph.textContent = "اختر كتابًا";
    select.appendChild(ph);

    nameInput.replaceWith(select);
    return select;
  }

  function bindRow(row) {
    if (!row || row.dataset.bound === "1") return;
    row.dataset.bound = "1";

    const select = ensureBookSelect(row);
    const priceInput = row.querySelector('input[name="book_price[]"]');
    const qtyInput = row.querySelector('input[name="book_qty[]"]');

    if (!select || !priceInput || !qtyInput) return;

    fillBookOptions(select);

    priceInput.readOnly = true;
    priceInput.placeholder = "سعر الكتاب";
    priceInput.addEventListener("focus", () => {
      priceInput.readOnly = true;
    });

    select.addEventListener("change", () => {
      const price = BOOK_PRICE[select.value] ?? 0;
      priceInput.value = String(price);
      recalc();
    });

    qtyInput.addEventListener("input", () => {
      const v = Number(qtyInput.value || 1);
      if (v < 1) qtyInput.value = 1;
      recalc();
    });
  }

  function createBookRow() {
    const row = document.createElement("div");
    row.className = "book-row";
    row.innerHTML = `
      <div>
        <label>اسم الكتاب</label>
        <input type="text" name="book_name[]" placeholder="مثال: فن اللامبالاة" required>
      </div>

      <div>
        <label>السعر (دج)</label>
        <input type="number" name="book_price[]" min="0" placeholder="مثال: 1200" required>
      </div>

      <div>
        <label>الكمية</label>
        <input type="number" name="book_qty[]" min="1" value="1" required>
      </div>

      <div class="row-actions">
        <button type="button" class="remove-row" title="حذف">✖</button>
      </div>
    `;
    return row;
  }

  // =========================
  // 7) Totals
  // =========================
  function getBooksTotal() {
    let total = 0;
    booksList.querySelectorAll(".book-row").forEach((row) => {
      const priceInput = row.querySelector('input[name="book_price[]"]');
      const qtyInput = row.querySelector('input[name="book_qty[]"]');

      const price = Number(priceInput?.value || 0);
      const qty = Math.max(1, Number(qtyInput?.value || 1));
      total += price * qty;
    });
    return total;
  }

  function recalc() {
    const booksTotal = getBooksTotal();
    const ship = getShippingFee();
    const grand = booksTotal + ship;

    if (booksTotalEl) booksTotalEl.textContent = formatDZD(booksTotal);
    if (shippingFeeEl) shippingFeeEl.textContent = formatDZD(ship);
    if (grandTotalEl) grandTotalEl.textContent = formatDZD(grand);

    if (shippingFeeInput) shippingFeeInput.value = String(ship);
    if (grandTotalInput) grandTotalInput.value = String(grand);
  }

  window.recalcOrder = recalc;

  // =========================
  // 8) Communes + Wilayas fill
  // =========================
  function fillCommunes(w) {
    if (!communeSelect) return;

    const matchKey =
      Object.keys(communesByWilaya).find((k) => parseWilayaLabel(k).name === w) || w;

    const communes = communesByWilaya[matchKey] || [];

    communeSelect.innerHTML = `<option value="" disabled selected>اختر البلدية</option>`;

    if (!communes.length) {
      const opt = document.createElement("option");
      opt.value = "Other";
      opt.textContent = "اكتب البلدية في العنوان";
      communeSelect.appendChild(opt);
      return;
    }

    communes.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      communeSelect.appendChild(opt);
    });
  }

  function fillWilayasSelectFromCommunes() {
    if (!wilayaSelect) return;

    wilayaSelect.innerHTML = `<option value="" disabled selected>اختر الولاية</option>`;

    const keysSorted = Object.keys(communesByWilaya).sort((a, b) => {
      const A = parseWilayaLabel(a).code2 || "99";
      const B = parseWilayaLabel(b).code2 || "99";
      return Number(A) - Number(B);
    });

    keysSorted.forEach((k) => {
      if (k === "Other") return;

      const { name } = parseWilayaLabel(k);
      const opt = document.createElement("option");
      opt.value = name;     // ✅ value = "أدرار"
      opt.textContent = k;  // ✅ "أدرار (01)"
      wilayaSelect.appendChild(opt);
    });

    const otherOpt = document.createElement("option");
    otherOpt.value = "Other";
    otherOpt.textContent = "Other (اكتب في العنوان)";
    wilayaSelect.appendChild(otherOpt);
  }

  wilayaSelect?.addEventListener("change", () => {
    fillCommunes(wilayaSelect.value);
    refreshDeliveryLabels();
    toggleCommuneVisibility();
    recalc();
  });

  document.querySelectorAll('input[name="delivery_type"]').forEach((r) => {
    r.addEventListener("change", () => {
      toggleCommuneVisibility();
      recalc();
    });
  });

  // =========================
  // 9) Add / Remove rows
  // =========================
  addBookBtn?.addEventListener("click", () => {
    const row = createBookRow();
    booksList.appendChild(row);
    bindRow(row);
    recalc();
  });

  booksList.addEventListener("click", (e) => {
    const btn = e.target.closest(".remove-row");
    if (!btn) return;

    const rows = booksList.querySelectorAll(".book-row");
    if (rows.length <= 1) return;

    btn.closest(".book-row")?.remove();
    recalc();
  });

  booksList.addEventListener("input", (e) => {
    if (e.target && e.target.matches('input[name="book_qty[]"]')) recalc();
  });

  // =========================
  // 10) Submit (SUPABASE ✅)
  // =========================
  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // HTML5 validation
    if (!orderForm.checkValidity()) {
      orderForm.reportValidity();
      return;
    }

    // Live phone normalize
    validatePhoneInputLive();

    // ✅ بيانات الزبون
    const fullName = orderForm.full_name?.value?.trim() || "";
    const phone = (phoneInputEl?.value || "").trim();

const addressEl = orderForm.querySelector('[name="address"]');
const address = (addressEl?.value || "").trim(); // ✅ دائمًا string


    const wilaya = wilayaSelect?.value?.trim() || "";
    const deliveryType = getDeliveryType();
    const commune = deliveryType === "home" ? (communeSelect?.value?.trim() || null) : null;

    // Basic required checks
    if (!fullName || !phone || !wilaya) {
      alert("❌ رجاءً املأ جميع المعلومات المطلوبة.");
      return;
    }

    if (addressEl && !address) {
      alert("❌ رجاءً اكتب العنوان.");
      return;
    }

    const phoneDigits = phone.replace(/\D+/g, "");
    if (!isValidDZMobile(phoneDigits)) {
      alert("❌ رقم الهاتف يجب أن يكون 10 أرقام ويبدأ بـ 05 أو 06 أو 07.");
      phoneInputEl?.focus();
      return;
    }

    if (deliveryType === "home" && !commune) {
      alert("❌ اختر البلدية (مطلوبة عند التوصيل للمنزل).");
      communeSelect?.focus();
      return;
    }

    // Items
    const rows = Array.from(booksList.querySelectorAll(".book-row"));
    const items = rows
      .map((row) => {
        const name = row.querySelector('select[name="book_name[]"]')?.value?.trim() || "";
        const price = Number(row.querySelector('input[name="book_price[]"]')?.value || 0);
        const qty = Math.max(1, Number(row.querySelector('input[name="book_qty[]"]')?.value || 1));
        return { name, price, qty };
      })
      .filter((it) => it.name);

    if (!items.length) {
      alert("❌ اختر كتابًا واحدًا على الأقل.");
      return;
    }

    const booksTotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
    const shippingFee = Number(shippingFeeInput?.value || 0);
    const totalPrice = booksTotal + shippingFee;

    // ✅ إرسال إلى Supabase
// ✅ إرسال إلى Supabase (جدول واحد فقط: orders)
try {
  const orderId =
    (window.crypto && crypto.randomUUID)
      ? crypto.randomUUID()
      : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
          (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
        );

  const { error: orderErr } = await supabase
    .from("orders")
    .insert([
      {
        id: orderId,
        full_name: fullName,
        phone: phoneDigits,
        address: address,
        wilaya: wilaya,
        commune: commune,
        delivery_type: deliveryType,
        shipping_fee: shippingFee,
        total_price: totalPrice,

        // ✅ كل الكتب هنا (بدل order_items)
        items: items,

        // (اختياري) مجموع الكتب بدون توصيل
        books_total: booksTotal,
      },
    ]);

  if (orderErr) throw orderErr;

  alert("✅ تم إرسال الطلب بنجاح!");
  orderForm.reset();
  refreshDeliveryLabels();
  toggleCommuneVisibility();
  recalc();
} catch (err) {
  console.error("SUPABASE ERROR FULL:", err);
  alert("❌ خطأ Supabase: " + (err?.message || JSON.stringify(err)));
}

  });

  // =========================
  // 11) INIT
  // =========================
  booksList.querySelectorAll(".book-row").forEach(bindRow);

  fillWilayasSelectFromCommunes();
  refreshDeliveryLabels();
  toggleCommuneVisibility();
  recalc();

  // Live phone formatting (no submit blocking)
  phoneInputEl?.addEventListener("input", validatePhoneInputLive);
  phoneInputEl?.addEventListener("blur", validatePhoneInputLive);

})();
