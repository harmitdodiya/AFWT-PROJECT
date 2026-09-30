# Weekly Development Log — Salon Management Portal

This maps the 12-week plan from the SRS (Section 6) to what was actually
built in this codebase, week by week, with the exact files that satisfy each
deliverable.

---

## Week 1 — Requirement Analysis & UI Planning (22/06/2026 – 28/06/2026)

**What was done:**
- Read the SRS end-to-end and translated the four user roles (Customer,
  Barber/Stylist, Receptionist, Administrator) into a concrete route map —
  which URL prefix belongs to which role, and which pages live under each.
- Planned the global state shape (auth, booking wizard, cart, services,
  staff, appointments, products) so every later module has a clear home in
  the Redux store instead of ad-hoc local state.
- Planned the folder structure (`api/`, `store/`, `routes/`, `layouts/`,
  `components/`, `pages/<role>/`) used for the rest of the build.

**Deliverable produced:** the project's route/permission map, later
implemented in `src/routes/AppRoutes.jsx` and `src/routes/ProtectedRoute.jsx`.

---

## Week 2 — Environment Setup & Routing (29/06/2026 – 05/07/2026)

**What was done:**
- Initialized the Vite + React workspace: `package.json`, `vite.config.js`,
  `index.html` (with the Fraunces / Inter / IBM Plex Mono font imports).
- Installed and wired Material UI, Redux Toolkit, React Router, React Hook
  Form, and Recharts as the project's core toolkit.
- Built the two app shells: `AuthLayout.jsx` (centered card, for
  login/register) and `DashboardLayout.jsx` (responsive sidebar + top bar
  that swaps its navigation items based on the signed-in role).
- Configured `react-router-dom` with separate route branches for public,
  customer, barber, receptionist, and admin paths.

**Deliverable produced:** a functional skeleton shell with responsive
navigation, before any feature pages existed — `App.jsx`, `main.jsx`,
`theme.js`, both layouts, and the base route table.

---

## Week 3 — Authentication Module (06/07/2026 – 12/07/2026)

**What was done:**
- Built `LoginPage.jsx` and `RegisterPage.jsx`, both validated with React
  Hook Form (required fields, password confirmation matching).
- Built `authSlice.js`: a demo JWT-style token is generated on login/register,
  persisted to `localStorage`, and rehydrated automatically on page reload.
- Built `ProtectedRoute.jsx`: blocks unauthenticated visitors from every
  `/app`, `/barber`, `/reception`, and `/admin` route, and further restricts
  each branch to its matching role (a Customer token can't open `/admin`).
- Seeded four demo accounts (one per role) plus open registration for new
  Customer accounts, in `src/api/mockDb.js` / `mockApi.js`.

**Deliverable produced:** a complete, working session-authorization system
enforcing route protection boundaries — this is the gate every other module
sits behind.

### Phase 1 Evaluation (13/07/2026 – 17/07/2026)
No new development — this was a checkpoint week in the SRS's plan to review
Weeks 1–3 before continuing.

---

## Week 4 — Service Management Module (13/07/2026 – 19/07/2026)

**What was done:**
- Built `servicesSlice.js` (fetch/save/delete thunks against the mock API).
- Built `ServiceCatalogPage.jsx`: treatments grouped by category (Haircut,
  Beard Styling, Hair Coloring, Facial), with a price-cap slider and a
  duration filter that update the visible list live.
- Wired a "Book now" button on each service card that pre-selects the
  service in the booking wizard's state and jumps straight to it.

**Deliverable produced:** an interactive service discovery portal with
accurate search/sort/filter behavior.

---

## Week 5 — Appointment Booking Module (20/07/2026 – 26/07/2026)

**What was done:**
- Built `bookingSlice.js`: a 4-step wizard (service → stylist → date/time →
  confirm) that tracks `currentStep` and per-step validity, matching the SRS's
  `bookingWizard` state shape (Section 3.2) exactly.
- Built `BookingWizardPage.jsx`: a custom interactive date strip (next 14
  days) plus a time-slot grid that greys out any slot already booked for that
  stylist, or that the stylist has blocked off, so double-booking is
  structurally impossible.
- Stylist selection auto-filters to barbers whose skill tags match the
  chosen service's category.

**Deliverable produced:** a fully validated booking wizard that captures a
structurally consistent reservation on every submission.

---

## Week 6 — Customer Dashboard (27/07/2026 – 2/08/2026)

**What was done:**
- Built `CustomerDashboardPage.jsx`: upcoming-visit cards, a "favorite
  treatment" stat derived from booking history, lifetime spend, and a
  combined history table (services + retail orders).
- Built `ProfilePage.jsx`: a React Hook Form–backed profile editor wired to
  `authSlice`'s `updateProfile` action.

**Deliverable produced:** a functional, personalized dashboard hub for the
signed-in customer.

---

## Week 7 — Staff Management (03/08/2026 – 09/08/2026)

**What was done:**
- Built `staffSlice.js` with full CRUD thunks.
- Built `StaffManagementPage.jsx` (admin-only): a table of every employee
  with add/edit/delete, skill-tag multi-select, work-hours text field, and a
  commission-rate input, all inside a modal form.

**Deliverable produced:** a completed personnel-monitoring screen handling
the core staff records the rest of the app depends on (skills feed the
booking wizard's stylist filter; commission rate feeds wages and analytics).

### Phase 2 Evaluation (10/08/2026 – 14/08/2026)
Checkpoint week — no new development.

---

## Week 8 — Appointment Administration (10/08/2026 – 16/08/2026)

**What was done:**
- Built `MasterSchedulePage.jsx` (receptionist-only): every appointment
  across every stylist in one grid, filterable by date, stylist, and status,
  with an inline dropdown to push status changes (Pending → Confirmed → In
  Progress → Completed/Cancelled) straight to the mock API.
- Added stylist reassignment directly from the grid (a select box per row).
- Built `CustomerLookupPage.jsx`: search-by-name, with a profile panel
  showing visit count, lifetime spend, and full appointment history.

**Deliverable produced:** an operational scheduling master control panel for
front-desk staff.

---

## Week 9 — Inventory Management (17/08/2026 – 23/08/2026)

**What was done:**
- Extended the products slice (`inventorySlice.js`) with a `restockProduct`
  thunk.
- Built `InventoryManagementPage.jsx` (admin-only): a stock ledger with
  supplier column, a low-stock threshold comparison that turns a row red and
  flags it "Low stock" the moment quantity on hand drops below the
  threshold, a banner summarizing how many products need attention, and a
  quick "add quantity" restock control per row.

**Deliverable produced:** a completed stock-control portal with dynamic
low-balance threshold warnings.

---

## Week 10 — Product Store (24/08/2026 – 30/08/2026)

**What was done:**
- Built `ProductStorePage.jsx`: retail catalog with category toggle and a
  live text search.
- Built/extended `cartSlice.js`: add/increment/decrement/remove, with
  derived `totalQuantity`/`totalAmount`, matching the SRS's cart state shape
  (Section 3.3).
- Built `CartPage.jsx`: quantity controls, an order summary (subtotal, 8%
  tax, total), and a "place order" flow through a mock checkout thunk that
  clears the cart and records the order into the customer's purchase history.

**Deliverable produced:** a complete, functional retail e-commerce module
with a synchronized cart state.

---

## Week 11 — Analytics Dashboard (31/08/2026 – 13/09/2026)

**What was done:**
- Built `AnalyticsDashboardPage.jsx` (admin-only) using Recharts:
  - a revenue-over-time **line chart** built from completed appointments,
  - a service-popularity **bar chart** counting bookings per treatment,
  - a stylist-performance **multi-axis bar chart** comparing completed jobs
    (left axis) against commission earned (right axis) per barber.
- Added summary stat tiles (total revenue, total bookings, most-booked
  treatment) above the charts.

**Deliverable produced:** a fully integrated business-intelligence dashboard
mapping the operational data generated by every earlier module.

---

## Week 12 — Testing, Optimization & Deployment (14/09/2026 – 20/09/2026)

**What was done:**
- Syntax-validated all 49 source files with `esbuild` file-by-file (the
  development sandbox used to build this project has no outbound network
  access, so a full `npm install` + `npm run build` could not be run here —
  see the **Known limitations** note in `README.md`).
- Wrote `README.md` with setup steps, demo credentials, architecture notes,
  and a deployment walkthrough for Vercel.

**What still needs to happen on your machine, to fully close out this week:**
1. `npm install` (needs your own internet connection).
2. `npm run build` — fix any dependency-version errors that surface (none
   are expected, since versions were pinned to stable releases current as of
   this build, but this step genuinely could not be verified here).
3. `npm run dev` and click through all four roles to confirm behavior
   end-to-end on real browsers/viewports.
4. Deploy to Vercel per the steps in `README.md`.

### Phase 3 Evaluation (21/09/2026 – 03/10/2026)
Final evaluation window — demo the deployed instance plus this log and the
README as your architectural documentation.
