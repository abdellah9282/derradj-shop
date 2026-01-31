(function () {
  "use strict";

  // =========================
  // ✅ SUPABASE Guard + Client
  // =========================
  if (!window.supabase || !window.supabase.createClient) {
    alert("❌ مكتبة Supabase غير محمّلة. تأكد أنك أضفت supabase-js قبل admin.js");
    return;
  }

  // ✅ FIX: correct project URL (jbmcjbz... not jbmcbjz...)
  const SUPABASE_URL = "https://jbmcbjzcedqpvnhbmrhk.supabase.co";

  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibWNianpjZWRxcHZuaGJtcmhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2NjU1MDUsImV4cCI6MjA4NTI0MTUwNX0.u_D1K7gFCQmmI_m0do5-VpdXrXXLPQ8BCDMLc3Ew1Yk";

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  (async () => {
    try {
      const r = await fetch(SUPABASE_URL + "/rest/v1/", { method: "GET" });
      console.log("✅ Supabase reachable:", r.status);
    } catch (e) {
      console.error("❌ Supabase NOT reachable:", e);
      alert("❌ لا يمكن الوصول إلى رابط Supabase (DNS أو URL خطأ).");
    }
  })();

  // =========================
  // DOM
  // =========================
  const refreshBtn = document.getElementById("refreshBtn");
  const exportOrdersBtn = document.getElementById("exportOrdersBtn");
  const exportMessagesBtn = document.getElementById("exportMessagesBtn");

  const ordersTbody = document.getElementById("ordersTbody");
  const messagesTbody = document.getElementById("messagesTbody");

  const ordersSearch = document.getElementById("ordersSearch");
  const messagesSearch = document.getElementById("messagesSearch");
  const statusFilter = document.getElementById("statusFilter");
  const limitSelect = document.getElementById("limitSelect");

  const modal = document.getElementById("modal");
  const modalClose = document.getElementById("modalClose");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  // =========================
  // State
  // =========================
  let ORDERS_CACHE = [];
  let MESSAGES_CACHE = [];

  // =========================
  // Helpers
  // =========================
  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function fmtDate(v) {
    if (!v) return "-";
    try {
      return new Date(v).toLocaleString("ar-DZ");
    } catch {
      return String(v);
    }
  }

  function fmtMoney(n) {
    const x = Number(n || 0);
    return x.toLocaleString("fr-DZ").replace(/\s+/g, "") + " دج";
  }

  function badgeClass(status) {
    const s = String(status || "new").toLowerCase();
    if (["new", "confirmed", "shipped", "delivered", "cancelled"].includes(s)) return s;
    return "new";
  }

  function statusLabel(status) {
    const s = String(status || "new").toLowerCase();
    return (
      {
        new: "جديد",
        confirmed: "مؤكد",
        shipped: "في الطريق",
        delivered: "تم التسليم",
        cancelled: "ملغى",
      }[s] || "جديد"
    );
  }

  function showModal(title, html) {
    modalTitle.textContent = title;
    modalBody.innerHTML = html;
    modal.classList.remove("hidden");
  }

  function hideModal() {
    modal.classList.add("hidden");
    modalBody.innerHTML = "";
  }

  modalClose?.addEventListener("click", hideModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) hideModal();
  });

  function downloadCSV(filename, rows) {
    const csv = rows
      .map((r) =>
        r
          .map((cell) => {
            const v = String(cell ?? "");
            // quote
            return `"${v.replaceAll('"', '""')}"`;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // =========================
  // Fetch
  // =========================
  async function fetchOrders() {
    const limit = Number(limitSelect?.value || 50);

    // ملاحظة: إذا جدولك لا يحتوي created_at، احذفه من order()
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    ORDERS_CACHE = Array.isArray(data) ? data : [];
  }

  async function fetchMessages() {
    const { data, error } = await supabase
      .from("message")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) throw error;
    MESSAGES_CACHE = Array.isArray(data) ? data : [];
  }

  // =========================
  // Render Orders
  // =========================
  function filterOrders(list) {
    const q = String(ordersSearch?.value || "").trim().toLowerCase();
    const st = String(statusFilter?.value || "").trim().toLowerCase();

    return list.filter((o) => {
      const hay =
        `${o.full_name || ""} ${o.phone || ""} ${o.wilaya || ""} ${o.commune || ""} ${o.address || ""} ${o.items || ""}`
          .toLowerCase();

      const okQ = !q || hay.includes(q);
      const okSt = !st || String(o.status || "new").toLowerCase() === st;
      return okQ && okSt;
    });
  }

  function orderDetailsHTML(o) {
    const itemsText = o.items || (Array.isArray(o.items) ? o.items.join("، ") : "");
    return `
      <div class="box"><b>الاسم:</b> ${escapeHtml(o.full_name)}</div>
      <div class="box"><b>الهاتف:</b> ${escapeHtml(o.phone)}</div>
      <div class="box"><b>الولاية:</b> ${escapeHtml(o.wilaya)} | <b>البلدية:</b> ${escapeHtml(o.commune || "-")}</div>
      <div class="box"><b>نوع التوصيل:</b> ${escapeHtml(o.delivery_type || "-")}</div>
      <div class="box"><b>العنوان:</b><br>${escapeHtml(o.address || "-")}</div>
      <div class="box"><b>الكتب:</b><br>${escapeHtml(itemsText || "-")}</div>
      <div class="box"><b>مجموع الكتب:</b> ${fmtMoney(o.books_total)} | <b>التوصيل:</b> ${fmtMoney(o.shipping_fee)} | <b>الإجمالي:</b> ${fmtMoney(o.total_price)}</div>
      <div class="box"><b>الحالة:</b> ${escapeHtml(statusLabel(o.status))}</div>
      <div class="box"><b>التاريخ:</b> ${escapeHtml(fmtDate(o.created_at))}</div>
    `;
  }

  function renderOrders() {
    const list = filterOrders(ORDERS_CACHE);

    if (!list.length) {
      ordersTbody.innerHTML = `<tr><td colspan="10" class="muted center">لا توجد طلبات مطابقة</td></tr>`;
      return;
    }

    ordersTbody.innerHTML = list
      .map((o) => {
        const s = badgeClass(o.status);
        return `
          <tr data-id="${escapeHtml(o.id)}">
            <td>${escapeHtml(fmtDate(o.created_at))}</td>
            <td>${escapeHtml(o.full_name || "-")}</td>
            <td>${escapeHtml(o.phone || "-")}</td>
            <td>${escapeHtml(o.wilaya || "-")}</td>
            <td>${escapeHtml(o.commune || "-")}</td>
            <td>${escapeHtml(o.delivery_type || "-")}</td>
            <td>${escapeHtml(fmtMoney(o.shipping_fee))}</td>
            <td>${escapeHtml(fmtMoney(o.total_price))}</td>
            <td>
              <span class="badge ${s}">${escapeHtml(statusLabel(o.status))}</span>
              <div style="margin-top:6px">
                <select class="statusSelect input" style="min-width:160px; padding:8px;">
                  <option value="new" ${s === "new" ? "selected" : ""}>جديد</option>
                  <option value="confirmed" ${s === "confirmed" ? "selected" : ""}>مؤكد</option>
                  <option value="shipped" ${s === "shipped" ? "selected" : ""}>في الطريق</option>
                  <option value="delivered" ${s === "delivered" ? "selected" : ""}>تم التسليم</option>
                  <option value="cancelled" ${s === "cancelled" ? "selected" : ""}>ملغى</option>
                </select>
              </div>
            </td>
            <td>
              <div class="row-actions">
                <button class="icon-btn viewBtn" title="عرض التفاصيل">👁️</button>
                <button class="icon-btn saveStatusBtn" title="حفظ الحالة">💾</button>
                <button class="icon-btn delOrderBtn" title="حذف الطلب">🗑️</button>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  // =========================
  // Render Messages
  // =========================
  function filterMessages(list) {
    const q = String(messagesSearch?.value || "").trim().toLowerCase();
    if (!q) return list;
    return list.filter((m) => {
      const hay = `${m.name || ""} ${m.contact || ""} ${m.message || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }

  function renderMessages() {
    const list = filterMessages(MESSAGES_CACHE);

    if (!list.length) {
      messagesTbody.innerHTML = `<tr><td colspan="5" class="muted center">لا توجد رسائل مطابقة</td></tr>`;
      return;
    }

    messagesTbody.innerHTML = list
      .map((m) => {
        const msgShort = String(m.message || "-");
        const trimmed = msgShort.length > 80 ? msgShort.slice(0, 80) + "..." : msgShort;

        return `
          <tr data-id="${escapeHtml(m.id)}">
            <td>${escapeHtml(fmtDate(m.created_at))}</td>
            <td>${escapeHtml(m.name || "-")}</td>
            <td>${escapeHtml(m.contact || "-")}</td>
            <td title="${escapeHtml(msgShort)}">${escapeHtml(trimmed)}</td>
            <td>
              <div class="row-actions">
                <button class="icon-btn viewMsgBtn" title="عرض الرسالة">👁️</button>
                <button class="icon-btn delMsgBtn" title="حذف الرسالة">🗑️</button>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  // =========================
  // Actions: Orders
  // =========================
  async function updateOrderStatus(orderId, newStatus) {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) throw error;
  }

  async function deleteOrder(orderId) {
    const { error } = await supabase.from("orders").delete().eq("id", orderId);
    if (error) throw error;
  }

  // =========================
  // Actions: Messages
  // =========================
  async function deleteMessage(msgId) {
    const { error } = await supabase.from("message").delete().eq("id", msgId);
    if (error) throw error;
  }

  // =========================
  // Events
  // =========================
  refreshBtn?.addEventListener("click", () => {
    boot(true);
  });

  ordersSearch?.addEventListener("input", renderOrders);
  statusFilter?.addEventListener("change", renderOrders);
  limitSelect?.addEventListener("change", () => boot(true));

  messagesSearch?.addEventListener("input", renderMessages);

  // Delegation for orders table
  ordersTbody?.addEventListener("click", async (e) => {
    const tr = e.target.closest("tr");
    if (!tr) return;
    const orderId = tr.getAttribute("data-id");
    const order = ORDERS_CACHE.find((x) => String(x.id) === String(orderId));

    if (e.target.closest(".viewBtn")) {
      if (!order) return;
      showModal(`تفاصيل الطلب: ${order.full_name || ""}`, orderDetailsHTML(order));
      return;
    }

    if (e.target.closest(".saveStatusBtn")) {
      const select = tr.querySelector(".statusSelect");
      const newStatus = select ? select.value : "new";

      try {
        await updateOrderStatus(orderId, newStatus);
        // update cache locally
        if (order) order.status = newStatus;
        renderOrders();
        alert("✅ تم تحديث الحالة بنجاح");
      } catch (err) {
        console.error(err);
        alert("❌ خطأ في تحديث الحالة: " + (err?.message || JSON.stringify(err)));
      }
      return;
    }

    if (e.target.closest(".delOrderBtn")) {
      if (!confirm("هل أنت متأكد من حذف الطلب؟")) return;
      try {
        await deleteOrder(orderId);
        ORDERS_CACHE = ORDERS_CACHE.filter((x) => String(x.id) !== String(orderId));
        renderOrders();
        alert("✅ تم حذف الطلب");
      } catch (err) {
        console.error(err);
        alert("❌ خطأ في حذف الطلب: " + (err?.message || JSON.stringify(err)));
      }
      return;
    }
  });

  // Delegation for messages table
  messagesTbody?.addEventListener("click", async (e) => {
    const tr = e.target.closest("tr");
    if (!tr) return;
    const msgId = tr.getAttribute("data-id");
    const msg = MESSAGES_CACHE.find((x) => String(x.id) === String(msgId));

    if (e.target.closest(".viewMsgBtn")) {
      if (!msg) return;
      showModal("تفاصيل الرسالة", `
        <div class="box"><b>الاسم:</b> ${escapeHtml(msg.name)}</div>
        <div class="box"><b>الهاتف:</b> ${escapeHtml(msg.contact)}</div>
        <div class="box"><b>الرسالة:</b><br>${escapeHtml(msg.message)}</div>
        <div class="box"><b>التاريخ:</b> ${escapeHtml(fmtDate(msg.created_at))}</div>
      `);
      return;
    }

    if (e.target.closest(".delMsgBtn")) {
      if (!confirm("هل أنت متأكد من حذف الرسالة؟")) return;
      try {
        await deleteMessage(msgId);
        MESSAGES_CACHE = MESSAGES_CACHE.filter((x) => String(x.id) !== String(msgId));
        renderMessages();
        alert("✅ تم حذف الرسالة");
      } catch (err) {
        console.error(err);
        alert("❌ خطأ في حذف الرسالة: " + (err?.message || JSON.stringify(err)));
      }
      return;
    }
  });

  // Export
  exportOrdersBtn?.addEventListener("click", () => {
    const rows = [
      ["created_at", "full_name", "phone", "wilaya", "commune", "delivery_type", "shipping_fee", "books_total", "total_price", "status", "address", "items"],
      ...ORDERS_CACHE.map((o) => [
        o.created_at, o.full_name, o.phone, o.wilaya, o.commune, o.delivery_type,
        o.shipping_fee, o.books_total, o.total_price, o.status, o.address, o.items
      ]),
    ];
    downloadCSV("orders.csv", rows);
  });

  exportMessagesBtn?.addEventListener("click", () => {
    const rows = [
      ["created_at", "name", "contact", "message"],
      ...MESSAGES_CACHE.map((m) => [m.created_at, m.name, m.contact, m.message]),
    ];
    downloadCSV("messages.csv", rows);
  });

  // =========================
  // Boot
  // =========================
  async function boot(showAlerts) {
    try {
      ordersTbody.innerHTML = `<tr><td colspan="10" class="muted center">... جاري التحميل</td></tr>`;
      messagesTbody.innerHTML = `<tr><td colspan="5" class="muted center">... جاري التحميل</td></tr>`;

      await Promise.all([fetchOrders(), fetchMessages()]);
      renderOrders();
      renderMessages();

      if (showAlerts) console.log("✅ Refreshed");
    } catch (err) {
      console.error(err);
      const msg = err?.message || JSON.stringify(err);

      ordersTbody.innerHTML = `<tr><td colspan="10" class="muted center">❌ خطأ: ${escapeHtml(msg)}</td></tr>`;
      messagesTbody.innerHTML = `<tr><td colspan="5" class="muted center">❌ خطأ: ${escapeHtml(msg)}</td></tr>`;

      alert("❌ مشكلة في جلب البيانات من Supabase.\n\n" + msg + "\n\n✅ تأكد من: RLS OFF أو Policies صحيحة.");
    }
  }

  boot(false);

})();
