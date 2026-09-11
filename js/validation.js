// ============================================================
// js/validation.js
// Input validation rules for the Equipment form (Lab Part D-B).
//
// validateEquipment(data, { isUpdate, existingIds }) returns:
//   { valid: true }  OR  { valid: false, errors: { field: "message" } }
// ============================================================

const VALID_CONDITIONS = ["Good", "For Repair", "Damaged", "Unserviceable"];
const ID_PATTERN = /^[A-Za-z0-9_-]+$/;

/**
 * @param {object} data - form values
 * @param {object} opts
 * @param {boolean} opts.isUpdate - true when editing an existing record
 * @param {Set<string>} opts.existingIds - all equipment_id values currently
 *        in the table (used for the "must be unique" rule on create)
 */
export function validateEquipment(data, { isUpdate = false, existingIds = new Set() } = {}) {
  const errors = {};

  // Rule 1: Equipment ID required, valid format, and unique on create
  const id = (data.equipment_id || "").trim();
  if (!id) {
    errors.equipment_id = "Equipment ID cannot be empty.";
  } else if (!ID_PATTERN.test(id)) {
    errors.equipment_id = "Use letters, numbers, - or _ only (e.g. EQ-0008).";
  } else if (!isUpdate && existingIds.has(id.toUpperCase())) {
    errors.equipment_id = "This Equipment ID already exists.";
  }

  // Rule 2: Equipment Name cannot be empty
  if (!(data.equipment_name || "").trim()) {
    errors.equipment_name = "Equipment Name cannot be empty.";
  }

  // Rule 3: Category cannot be empty
  if (!(data.category || "").trim()) {
    errors.category = "Category cannot be empty.";
  }

  // Rule 4: Quantity cannot be negative or blank
  const qty = data.quantity;
  if (qty === "" || qty === null || qty === undefined) {
    errors.quantity = "Quantity cannot be empty.";
  } else if (Number.isNaN(Number(qty)) || !Number.isInteger(Number(qty))) {
    errors.quantity = "Quantity must be a whole number.";
  } else if (Number(qty) < 0) {
    errors.quantity = "Quantity cannot be negative.";
  }

  // Rule 5: Condition must be selected from the allowed list
  if (!VALID_CONDITIONS.includes(data.condition)) {
    errors.condition = "Please select a condition.";
  }

  // Rule 6: Laboratory cannot be empty
  if (!(data.laboratory || "").trim()) {
    errors.laboratory = "Laboratory cannot be empty.";
  }

  // Rule 7: Date Acquired cannot be empty or in the future
  if (!data.date_acquired) {
    errors.date_acquired = "Date Acquired cannot be empty.";
  } else {
    const entered = new Date(data.date_acquired);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (Number.isNaN(entered.getTime())) {
      errors.date_acquired = "Date Acquired is not a valid date.";
    } else if (entered > today) {
      errors.date_acquired = "Date Acquired cannot be in the future.";
    }
  }

  return Object.keys(errors).length > 0 ? { valid: false, errors } : { valid: true, errors: {} };
}
