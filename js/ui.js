// ============================================================
// js/ui.js
// Everything that touches the DOM: rendering the table, the stat
// strip, the form, the toast, and the delete-confirm modal.
// This file never talks to Supabase directly - app.js passes it
// data and gets callbacks back through the functions below.
// ============================================================

const el = (id) => document.getElementById(id);

const CONDITION_CLASS = {
  "Good": "badge-good",
  "For Repair": "badge-for-repair",
  "Damaged": "badge-damaged",
  "Unserviceable": "badge-unserviceable",
};

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function formatDate(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate + "T00:00:00");
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

/* ---------------- Table ---------------- */

export function renderTable(records, { onEdit, onDelete }) {
  const tbody = el("tableBody");
  const emptyState = el("emptyState");
  const loadingState = el("loadingState");
  loadingState.hidden = true;

  tbody.innerHTML = "";
  el("recordCount").textContent = `${records.length} record${records.length === 1 ? "" : "s"}`;

  if (records.length === 0) {
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  for (const rec of records) {
    const tr = document.createElement("tr");
    const badgeClass = CONDITION_CLASS[rec.condition] || "badge-good";

    tr.innerHTML = `
      <td class="cell-id">${escapeHtml(rec.equipment_id)}</td>
      <td>${escapeHtml(rec.equipment_name)}</td>
      <td>${escapeHtml(rec.category)}</td>
      <td>${escapeHtml(rec.quantity)}</td>
      <td><span class="badge ${badgeClass}">${escapeHtml(rec.condition)}</span></td>
      <td>${escapeHtml(rec.laboratory)}</td>
      <td>${formatDate(rec.date_acquired)}</td>
      <td class="cell-actions">
        <button type="button" class="row-btn row-edit">Edit</button>
        <button type="button" class="row-btn row-delete">Delete</button>
      </td>
    `;

    tr.querySelector(".row-edit").addEventListener("click", () => onEdit(rec));
    tr.querySelector(".row-delete").addEventListener("click", () => onDelete(rec));

    tbody.appendChild(tr);
  }
}

/* ---------------- Stat strip (bonus dashboard) ---------------- */

export function renderStats(records) {
  const totalUnits = records.reduce((sum, r) => sum + Number(r.quantity || 0), 0);
  const countBy = (cond) => records.filter((r) => r.condition === cond).length;

  el("statTotal").textContent = totalUnits;
  el("statGood").textContent = countBy("Good");
  el("statRepair").textContent = countBy("For Repair");
  el("statDamaged").textContent = countBy("Damaged");
  el("statUnserviceable").textContent = countBy("Unserviceable");
}

/* ---------------- Form panel ---------------- */

export function openForm(mode = "create", record = null) {
  el("formPanel").hidden = false;
  el("recordMode").value = mode;

  if (mode === "edit" && record) {
    el("formTitle").textContent = `Edit Equipment - ${record.equipment_id}`;
    el("equipment_id").value = record.equipment_id;
    el("equipment_id").disabled = true; // primary key: not editable
    el("equipment_name").value = record.equipment_name;
    el("category").value = record.category;
    el("quantity").value = record.quantity;
    el("condition").value = record.condition;
    el("laboratory").value = record.laboratory;
    el("date_acquired").value = record.date_acquired;

    el("saveBtn").hidden = true;
    el("updateBtn").hidden = false;
    el("deleteBtn").hidden = false;
  } else {
    el("formTitle").textContent = "Add New Equipment";
    el("equipment_id").disabled = false;
    el("saveBtn").hidden = false;
    el("updateBtn").hidden = true;
    el("deleteBtn").hidden = true;
  }

  clearFieldErrors();
  el("equipment_id").focus();
  el("formPanel").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

export function closeForm() {
  el("formPanel").hidden = true;
  resetForm();
}

export function resetForm() {
  el("equipmentForm").reset();
  el("equipment_id").disabled = false;
  clearFieldErrors();
}

export function getFormValues() {
  return {
    equipment_id: el("equipment_id").value.trim(),
    equipment_name: el("equipment_name").value.trim(),
    category: el("category").value.trim(),
    quantity: el("quantity").value,
    condition: el("condition").value,
    laboratory: el("laboratory").value.trim(),
    date_acquired: el("date_acquired").value,
  };
}

export function showFieldErrors(errors) {
  clearFieldErrors();
  for (const [field, message] of Object.entries(errors)) {
    const errorEl = el(`err_${field}`);
    const inputEl = el(field);
    if (errorEl) errorEl.textContent = message;
    if (inputEl) inputEl.classList.add("invalid");
  }
}

export function clearFieldErrors() {
  document.querySelectorAll(".field-error").forEach((n) => (n.textContent = ""));
  document.querySelectorAll(".field input, .field select").forEach((n) => n.classList.remove("invalid"));
}

/* ---------------- Toast ---------------- */

let toastTimer = null;
export function showToast(message, type = "success") {
  const toast = el("toast");
  toast.textContent = message;
  toast.className = `toast toast-${type}`;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toast.hidden = true), 3200);
}

/* ---------------- Delete confirm modal ---------------- */

export function showConfirmModal(record, onConfirm) {
  const modal = el("confirmModal");
  el("confirmMessage").textContent =
    `Are you sure you want to delete "${record.equipment_name}" (${record.equipment_id})? This cannot be undone.`;
  modal.hidden = false;

  const confirmBtn = el("confirmDeleteBtn");
  const cancelBtn = el("confirmCancelBtn");

  // onclick (re)assignment instead of addEventListener: reopening the modal
  // can never stack duplicate listeners, and cleanup is trivial.
  const cleanup = () => {
    modal.hidden = true;
    confirmBtn.onclick = null;
    cancelBtn.onclick = null;
  };

  confirmBtn.onclick = () => { cleanup(); onConfirm(); };
  cancelBtn.onclick = cleanup;
}

export function setLoading(isLoading) {
  el("loadingState").hidden = !isLoading;
}
