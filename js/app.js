// ============================================================
// js/app.js
// Entry point. Wires DOM events to the api.js (Supabase) and
// ui.js (rendering) modules. This is the only file that decides
// *when* things happen; api.js decides *how* to talk to the
// database, and ui.js decides *how* to draw the screen.
// ============================================================

import { isSupabaseConfigured } from "./supabaseClient.js";
import { validateEquipment } from "./validation.js";
import {
  fetchAllEquipment,
  searchEquipment,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from "./api.js";
import {
  renderTable,
  renderStats,
  openForm,
  closeForm,
  resetForm,
  getFormValues,
  showFieldErrors,
  showToast,
  showConfirmModal,
  setLoading,
} from "./ui.js";

const el = (id) => document.getElementById(id);

// Cache of the last loaded records, used to build the "unique ID" check
// without an extra round trip every time the form is submitted.
let currentRecords = [];

/* ---------------- Data loading ---------------- */

async function loadAllRecords() {
  setLoading(true);
  const { data, error } = await fetchAllEquipment();
  setLoading(false);

  if (error) {
    showToast(`Could not load equipment: ${error.message}`, "error");
    return;
  }

  currentRecords = data || [];
  renderTable(currentRecords, { onEdit: handleEdit, onDelete: handleDeleteRequest });
  renderStats(currentRecords);
}

async function runSearch() {
  const term = el("searchInput").value;
  const conditionFilter = el("conditionFilter").value;

  setLoading(true);
  const { data, error } = await searchEquipment(term, conditionFilter);
  setLoading(false);

  if (error) {
    showToast(`Search failed: ${error.message}`, "error");
    return;
  }

  currentRecords = data || [];
  renderTable(currentRecords, { onEdit: handleEdit, onDelete: handleDeleteRequest });
  renderStats(currentRecords);
}

/* ---------------- Form handlers ---------------- */

function handleEdit(record) {
  openForm("edit", record);
}

function handleAddNew() {
  resetForm();
  openForm("create");
}

async function handleFormSubmit(evt) {
  evt.preventDefault();
  const mode = el("recordMode").value; // "create" | "edit"
  const values = getFormValues();

  const existingIds = new Set(currentRecords.map((r) => r.equipment_id.toUpperCase()));
  const { valid, errors } = validateEquipment(values, {
    isUpdate: mode === "edit",
    existingIds,
  });

  if (!valid) {
    showFieldErrors(errors);
    showToast("Please fix the highlighted fields.", "error");
    return;
  }

  const payload = {
    equipment_id: values.equipment_id,
    equipment_name: values.equipment_name,
    category: values.category,
    quantity: Number(values.quantity),
    condition: values.condition,
    laboratory: values.laboratory,
    date_acquired: values.date_acquired,
  };

  if (mode === "create") {
    const { error } = await createEquipment(payload);
    if (error) {
      showToast(`Could not save record: ${error.message}`, "error");
      return;
    }
    showToast(`Equipment ${payload.equipment_id} added.`, "success");
  } else {
    const { equipment_id, ...changes } = payload;
    const { error } = await updateEquipment(equipment_id, changes);
    if (error) {
      showToast(`Could not update record: ${error.message}`, "error");
      return;
    }
    showToast(`Equipment ${equipment_id} updated.`, "success");
  }

  closeForm();
  await loadAllRecords();
}

function handleDeleteFromForm() {
  const record = currentRecords.find((r) => r.equipment_id === el("equipment_id").value);
  if (record) handleDeleteRequest(record);
}

function handleDeleteRequest(record) {
  showConfirmModal(record, async () => {
    const { error } = await deleteEquipment(record.equipment_id);
    if (error) {
      showToast(`Could not delete record: ${error.message}`, "error");
      return;
    }
    showToast(`Equipment ${record.equipment_id} deleted.`, "success");
    closeForm();
    await loadAllRecords();
  });
}

/* ---------------- Wire up events ---------------- */

function init() {
  if (!isSupabaseConfigured()) {
    showToast(
      "Supabase is not configured yet - edit js/supabaseClient.js with your project URL and anon key.",
      "error"
    );
  }

  el("openAddFormBtn").addEventListener("click", handleAddNew);
  el("closeFormBtn").addEventListener("click", closeForm);
  el("clearBtn").addEventListener("click", resetForm);
  el("equipmentForm").addEventListener("submit", handleFormSubmit);
  el("deleteBtn").addEventListener("click", handleDeleteFromForm);

  el("searchBtn").addEventListener("click", runSearch);
  el("searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") runSearch();
  });
  el("conditionFilter").addEventListener("change", runSearch);
  el("clearSearchBtn").addEventListener("click", () => {
    el("searchInput").value = "";
    el("conditionFilter").value = "";
    loadAllRecords();
  });

  loadAllRecords();
}

document.addEventListener("DOMContentLoaded", init);
