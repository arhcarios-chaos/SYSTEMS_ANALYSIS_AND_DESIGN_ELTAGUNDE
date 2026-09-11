# Laboratory Equipment Inventory System

A functional CRUD prototype for the **Equipment Management Module**, built for the
*Systems Analysis and Design* laboratory activity: *From System Design to Development:
Building a Functional CRUD Prototype*.

- **Frontend:** HTML, CSS, vanilla JavaScript (ES modules, no build step / no framework)
- **Backend / Database:** [Supabase](https://supabase.com) (hosted PostgreSQL)
- **Bonus feature implemented:** live dashboard showing total units and equipment count
  by condition (Good / For Repair / Damaged / Unserviceable)

---

## 1. Project Structure

```
lab-equipment-inventory/
├── index.html              # Page structure / markup only
├── css/
│   └── style.css           # All styling
├── js/
│   ├── supabaseClient.js   # Supabase connection + your API keys (edit this)
│   ├── validation.js       # Input validation rules
│   ├── api.js               # All Supabase CRUD/search queries
│   ├── ui.js                # DOM rendering (table, form, toast, modal)
│   └── app.js                # Entry point - wires events to api.js + ui.js
├── sql/
│   └── schema.sql           # Table definition + RLS policies + sample data
├── docs/
│   └── testing-table.md     # Part E system testing table
└── README.md
```

Each JS file has one job, so it stays easy to read and mark:
`supabaseClient.js` only connects, `api.js` only talks to the database, `ui.js`
only touches the DOM, `validation.js` only checks input, and `app.js` glues
them together.

---

## 2. Supabase Setup (do this first)

1. Create a free project at [supabase.com](https://supabase.com).
2. In your project, go to **SQL Editor → New query**, paste the contents of
   [`sql/schema.sql`](sql/schema.sql), and click **Run**. This creates the
   `equipment` table, enables Row Level Security with open policies (so the
   prototype can read/write without a login screen), and inserts 7 sample
   records.
3. Go to **Project Settings → API**. Copy:
   - **Project URL**
   - **anon public** key (⚠️ never copy the `service_role` key into frontend code)
4. Open `js/supabaseClient.js` and replace the placeholders:

   ```js
   const SUPABASE_URL = "https://YOUR-PROJECT-REF.supabase.co";
   const SUPABASE_ANON_KEY = "YOUR-ANON-PUBLIC-KEY";
   ```

5. Save the file.

---

## 3. Running the Prototype Locally

This is a static site (no `npm install` needed), but it must be served over
`http://` rather than opened as a `file://` path, because browsers block ES
module imports from the local filesystem. Pick one:

**Option A — VS Code**
Install the "Live Server" extension → right-click `index.html` → **Open with
Live Server**.

**Option B — Python (already installed on most machines)**
```bash
cd lab-equipment-inventory
python -m http.server 5500
```
Then open `http://localhost:5500` in your browser.

**Option C — Node**
```bash
npx serve .
```

---

## 4. Features Implemented

| Requirement (per lab sheet) | Where it lives |
|---|---|
| Add new equipment (Create) | `api.js → createEquipment()`, form panel |
| View list of equipment (Read) | `api.js → fetchAllEquipment()`, table |
| Search equipment | `api.js → searchEquipment()`, toolbar search box |
| Edit equipment (Update) | `api.js → updateEquipment()`, Edit button per row |
| Delete equipment | `api.js → deleteEquipment()`, Delete button + confirm modal |
| Input validation (7 rules) | `validation.js` |
| Bonus: dashboard by condition | `ui.js → renderStats()`, stat strip in header |

### Search behavior
The search box matches **Equipment ID, Equipment Name, Category, and
Condition** at the same time (case-insensitive). That means typing `Good`
returns every item currently marked *Good*, exactly like filtering by
condition — while typing `EQ-0003` or `Multimeter` still works as a normal
ID/name/category search. There's also a **Condition** dropdown next to the
search box for one-click filtering.

### Validation rules implemented
1. Equipment ID cannot be empty, and must be unique on create.
2. Equipment ID may only contain letters, numbers, `-`, and `_`.
3. Equipment Name cannot be empty.
4. Category cannot be empty.
5. Quantity cannot be empty, must be a whole number, and cannot be negative.
6. Condition must be selected from the fixed list.
7. Laboratory cannot be empty.
8. Date Acquired cannot be empty or a future date.

---

## 5. Publishing to GitHub

```bash
cd lab-equipment-inventory
git init
git add .
git commit -m "Laboratory Equipment Inventory System - CRUD prototype"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### ⚠️ Before you push: keep your Supabase keys safe
The `anon` key is designed to be public (it only works within whatever Row
Level Security policies you set in `schema.sql`), so committing it is fine
for this lab activity. If you want extra caution, or if you tighten your RLS
policies later, replace the hardcoded values in `js/supabaseClient.js` with
placeholders before pushing, and keep your real keys in a local
`js/supabaseClient.local.js` (add it to `.gitignore`) that classmates or
graders fill in themselves.

### Deploying online (optional, for the "system link" requirement)
Since this is a static site, you can deploy it for free on **GitHub Pages**:
Repo → **Settings → Pages → Deploy from branch → main → / (root)**. Your live
link will look like `https://<your-username>.github.io/<your-repo>/`.

---

## 6. Demonstration Checklist (Part F)

- [ ] **ADD** — open the form, fill in a new Equipment ID, Save
- [ ] **SEARCH** — type `Good` in the search box and show the filtered results
- [ ] **EDIT** — click Edit on a row, change a field, Update
- [ ] **DELETE** — click Delete, confirm in the modal
- [ ] Explain: data is stored in the `equipment` table in Supabase (hosted
      PostgreSQL); the browser talks to it directly through the Supabase
      JS client using the anon key and the RLS policies in `schema.sql`.
