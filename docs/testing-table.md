# Part E — System Testing Table

Fill in **Actual Result** and **Status** after running each test against your
deployed Supabase project.

| Test | Input / Action | Expected Result | Actual Result | Status |
|---|---|---|---|---|
| Add Equipment | Fill in all required fields with a unique Equipment ID (e.g. `EQ-0010`) and click **SAVE** | New record appears at the top of the table and in the stat strip totals | | Pass / Fail |
| View Equipment | Load the page | All equipment records from Supabase display in the table | | Pass / Fail |
| Update Equipment | Click **Edit** on a record, change the Quantity, click **UPDATE** | Table row reflects the new value; Equipment ID stays the same | | Pass / Fail |
| Delete Equipment | Click **Delete** on a record, confirm in the modal | Record disappears from the table and from Supabase | | Pass / Fail |
| Search Equipment | Type `Good` in the search box | Only records with Condition = Good are displayed | | Pass / Fail |
| Search Equipment (by name/ID) | Type part of an Equipment ID or name | Matching record(s) are displayed | | Pass / Fail |
| Validation — empty name | Leave Equipment Name blank, click SAVE | Inline error: "Equipment Name cannot be empty." Form does not submit | | Pass / Fail |
| Validation — negative quantity | Enter `-5` in Quantity, click SAVE | Inline error: "Quantity cannot be negative." Form does not submit | | Pass / Fail |
| Validation — duplicate ID | Enter an Equipment ID that already exists, click SAVE | Inline error: "This Equipment ID already exists." Form does not submit | | Pass / Fail |
