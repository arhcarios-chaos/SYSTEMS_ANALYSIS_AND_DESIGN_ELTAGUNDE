// ============================================================
// js/api.js
// All direct Supabase queries live here. Every function returns
// { data, error } so the UI layer can handle both cases the same way.
// ============================================================

import { supabase } from "./supabaseClient.js";

const TABLE = "equipment";

/** READ: fetch every equipment record, newest first. */
export async function fetchAllEquipment() {
  return supabase.from(TABLE).select("*").order("created_at", { ascending: false });
}

/**
 * SEARCH: matches the typed term against ID, name, and category
 * (required by the lab spec), AND against condition - so typing
 * "Good" returns every item whose condition is Good.
 */
export async function searchEquipment(term, conditionFilter) {
  let query = supabase.from(TABLE).select("*");

  const trimmed = (term || "").trim();
  if (trimmed) {
    const like = `%${trimmed}%`;
    // condition uses ilike too, so "Good" / "good" / "GOOD" all match
    query = query.or(
      `equipment_id.ilike.${like},equipment_name.ilike.${like},category.ilike.${like},condition.ilike.${like}`
    );
  }

  if (conditionFilter) {
    query = query.eq("condition", conditionFilter);
  }

  return query.order("created_at", { ascending: false });
}

/** CREATE: insert one new equipment record. */
export async function createEquipment(record) {
  return supabase.from(TABLE).insert([record]).select();
}

/** UPDATE: modify an existing record by its equipment_id. */
export async function updateEquipment(equipmentId, changes) {
  return supabase.from(TABLE).update(changes).eq("equipment_id", equipmentId).select();
}

/** DELETE: remove a record by its equipment_id. */
export async function deleteEquipment(equipmentId) {
  return supabase.from(TABLE).delete().eq("equipment_id", equipmentId);
}
