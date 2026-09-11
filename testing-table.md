# Part E — System Testing Table

Fill in **Actual Result** and **Status** after running each test against your
deployed Supabase project.

> **Note:** The *Actual Result* values below are derived from code analysis
> (tracing each action through `app.js` → `api.js`/`ui.js` → `validation.js`).
> They describe what the implementation *does* and should be confirmed against
> a live run with your Supabase project. Re-run each test on your deployed
> instance and update *Status* to **Fail** if any actual behaviour differs.

| Test | Input / Action | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| Add Equipment | Fill in all required fields with a unique Equipment ID (e.g. `EQ-0010`) and click **SAVE** | New record appears at the top of the table and in the stat strip totals | Record inserted via `createEquipment()`; `loadAllRecords()` re-fetches with `order("created_at", ascending: false)` so the new row renders at the top, and `renderStats()` recalculates the stat strip totals | Pass |
| View Equipment | Load the page | All equipment records from Supabase display in the table | `init()` calls `loadAllRecords()` → `fetchAllEquipment()` selects all rows ordered by `created_at` descending; `renderTable()` builds a row for each record | Pass |
| Update Equipment | Click **Edit** on a record, change the Quantity, click **UPDATE** | Table row reflects the new value; Equipment ID stays the same | `openForm("edit", record)` populates the form and disables the `equipment_id` field (primary key not editable); `updateEquipment()` applies changes; re-fetch shows the updated Quantity with the same Equipment ID | Pass |
| Delete Equipment | Click **Delete** on a record, confirm in the modal | Record disappears from the table and from Supabase | `showConfirmModal()` opens the dialog; clicking **Delete** calls `deleteEquipment(record.equipment_id)`, then `loadAllRecords()` re-fetches so the row is gone from the table (and from Supabase). **Cancel** closes the modal without deleting | Pass |
| Search Equipment | Type `Good` in the search box | Only records with Condition = Good are displayed | `searchEquipment("Good", "")` builds an `.or()` filter with `condition.ilike.%Good%`; only matching rows are returned and rendered | Pass |
| Search Equipment (by name/ID) | Type part of an Equipment ID or name | Matching record(s) are displayed | `searchEquipment()` applies `equipment_id.ilike` / `equipment_name.ilike` / `category.ilike` / `condition.ilike` on the trimmed term; partial, case-insensitive matches are returned | Pass |
| Validation — empty name | Leave Equipment Name blank, click SAVE | Inline error: "Equipment Name cannot be empty." Form does not submit | `validateEquipment()` sets `errors.equipment_name`; `showFieldErrors()` renders the inline message and adds the `invalid` class; `handleFormSubmit()` returns early so no DB call is made | Pass |
| Validation — negative quantity | Enter `-5` in Quantity, click SAVE | Inline error: "Quantity cannot be negative." Form does not submit | `validateEquipment()` detects `Number(qty) < 0` and sets `errors.quantity`; inline error shown; form submission blocked | Pass |
| Validation — duplicate ID | Enter an Equipment ID that already exists, click SAVE | Inline error: "This Equipment ID already exists." Form does not submit | `validateEquipment()` checks `existingIds.has(id.toUpperCase())` (built from `currentRecords`) and sets `errors.equipment_id`; inline error shown; form submission blocked | Pass |
