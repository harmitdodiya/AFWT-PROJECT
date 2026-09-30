import {
  seedUsers,
  seedServices,
  seedStaff,
  seedAppointments,
  seedProducts,
} from './mockDb';

// ---------------------------------------------------------------------------
// This module stands in for the backend REST API described in the SRS.
// Every exported function returns a Promise and resolves after an artificial
// delay, so the rest of the app (Redux thunks, forms, loading states) is
// written exactly as it would be against a real Axios/Express backend.
// Swapping this file out for src/api/axiosClient.js calls is the only change
// needed to point the portal at a real server.
// ---------------------------------------------------------------------------

const DELAY = 450;
const delay = (ms = DELAY) => new Promise((resolve) => setTimeout(resolve, ms));

const REGISTERED_USERS_KEY = 'salon_registered_users';
const uid = (prefix) => `${prefix}_${Math.random().toString(36).slice(2, 8)}`;

function loadRegisteredUsers() {
  try {
    return JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY)) || [];
  } catch {
    return [];
  }
}
function saveRegisteredUsers(users) {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

function makeFakeToken(user) {
  // Not a real JWT signature - a demonstration payload only, matching the
  // shape described in the SRS (header.payload.signature placeholders).
  const payload = btoa(JSON.stringify({ sub: user.id, role: user.role, email: user.email }));
  return `demo.${payload}.token`;
}

// In-memory "tables" (seeded once per page load, mutated by CRUD calls below)
let services = [...seedServices];
let staff = [...seedStaff];
let appointments = [...seedAppointments];
let products = [...seedProducts];

// ----------------------------- Auth -----------------------------------
export async function apiLogin(email, password) {
  await delay();
  const all = [...seedUsers, ...loadRegisteredUsers()];
  const user = all.find((u) => u.email === email && u.password === password);
  if (!user) {
    const err = new Error('Invalid email or password.');
    err.code = 'AUTH_INVALID';
    throw err;
  }
  const { password: _pw, ...safeUser } = user;
  return { user: safeUser, token: makeFakeToken(safeUser) };
}

export async function apiRegister({ name, email, password }) {
  await delay();
  const all = [...seedUsers, ...loadRegisteredUsers()];
  if (all.some((u) => u.email === email)) {
    const err = new Error('An account with that email already exists.');
    err.code = 'AUTH_DUPLICATE';
    throw err;
  }
  const newUser = { id: uid('usr'), name, email, password, role: 'Customer' };
  const registered = loadRegisteredUsers();
  registered.push(newUser);
  saveRegisteredUsers(registered);
  const { password: _pw, ...safeUser } = newUser;
  return { user: safeUser, token: makeFakeToken(safeUser) };
}

// ----------------------------- Services ---------------------------------
export async function apiFetchServices() {
  await delay();
  return [...services];
}
export async function apiSaveService(service) {
  await delay();
  if (service.id) {
    services = services.map((s) => (s.id === service.id ? { ...s, ...service } : s));
    return services.find((s) => s.id === service.id);
  }
  const created = { ...service, id: uid('srv') };
  services = [...services, created];
  return created;
}
export async function apiDeleteService(id) {
  await delay();
  services = services.filter((s) => s.id !== id);
  return { id };
}

// ----------------------------- Staff -------------------------------------
export async function apiFetchStaff() {
  await delay();
  return [...staff];
}
export async function apiSaveStaff(member) {
  await delay();
  if (member.id) {
    staff = staff.map((s) => (s.id === member.id ? { ...s, ...member } : s));
    return staff.find((s) => s.id === member.id);
  }
  const created = { id: uid('emp'), skills: [], commissionRate: 0.35, timeOff: [], blockedSlots: [], ...member };
  staff = [...staff, created];
  return created;
}
export async function apiDeleteStaff(id) {
  await delay();
  staff = staff.filter((s) => s.id !== id);
  return { id };
}
export async function apiBlockSlot(staffId, slotLabel) {
  await delay(250);
  staff = staff.map((s) =>
    s.id === staffId ? { ...s, blockedSlots: [...new Set([...s.blockedSlots, slotLabel])] } : s
  );
  return staff.find((s) => s.id === staffId);
}
export async function apiUnblockSlot(staffId, slotLabel) {
  await delay(250);
  staff = staff.map((s) =>
    s.id === staffId ? { ...s, blockedSlots: s.blockedSlots.filter((slot) => slot !== slotLabel) } : s
  );
  return staff.find((s) => s.id === staffId);
}

// ----------------------------- Appointments -------------------------------
export async function apiFetchAppointments() {
  await delay();
  return [...appointments];
}
export async function apiCreateAppointment(appt) {
  await delay();
  const created = { ...appt, id: uid('apt'), status: 'Pending' };
  appointments = [created, ...appointments];
  return created;
}
export async function apiUpdateAppointment(id, changes) {
  await delay(300);
  appointments = appointments.map((a) => (a.id === id ? { ...a, ...changes } : a));
  return appointments.find((a) => a.id === id);
}

// ----------------------------- Products / Inventory -----------------------
export async function apiFetchProducts() {
  await delay();
  return [...products];
}
export async function apiSaveProduct(product) {
  await delay();
  if (product.id) {
    products = products.map((p) => (p.id === product.id ? { ...p, ...product } : p));
    return products.find((p) => p.id === product.id);
  }
  const created = { ...product, id: uid('prod') };
  products = [...products, created];
  return created;
}
export async function apiRestock(id, amount) {
  await delay(300);
  products = products.map((p) => (p.id === id ? { ...p, stock: p.stock + amount } : p));
  return products.find((p) => p.id === id);
}

// ----------------------------- Checkout -----------------------------------
export async function apiCheckout(cartItems) {
  await delay(700);
  // Simulate a payment gateway round trip; always succeeds in this demo.
  return { orderId: uid('ord'), items: cartItems, confirmedAt: new Date().toISOString() };
}
