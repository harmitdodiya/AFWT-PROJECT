// Mock data standing in for the backend REST/JSON API described in the SRS
// (section 2.1 API Layer). In a production build these would be fetched
// via the Axios client instead of hard-coded here.

export const services = [
  { id: "srv_101", name: "Classic Haircut", category: "Haircut", price: 22, duration: 30 },
  { id: "srv_102", name: "Beard Styling", category: "Beard Styling", price: 25, duration: 30 },
  { id: "srv_103", name: "Hair Colouring", category: "Hair Coloring", price: 65, duration: 90 },
  { id: "srv_104", name: "Hot Towel Facial", category: "Facial", price: 40, duration: 45 },
  { id: "srv_105", name: "Fade & Line-Up", category: "Haircut", price: 28, duration: 40 },
];

export const staff = [
  { id: "emp_441", name: "Marcus Vance", role: "Senior Stylist", skills: ["Fade", "Coloring"], hoursThisWeek: 34, commission: 18, completed: 46 },
  { id: "emp_442", name: "Priya Anand", role: "Barber", skills: ["Beard", "Classic Cut"], hoursThisWeek: 30, commission: 15, completed: 39 },
  { id: "emp_443", name: "Devon Reyes", role: "Colour Specialist", skills: ["Coloring", "Facial"], hoursThisWeek: 28, commission: 20, completed: 31 },
];

export const initialAppointments = [
  { id: "apt_1", service: "Beard Styling", stylist: "Marcus Vance", date: "2026-08-03", time: "14:30", status: "Confirmed", price: 25 },
  { id: "apt_2", service: "Classic Haircut", stylist: "Priya Anand", date: "2026-08-10", time: "11:00", status: "Pending", price: 22 },
  { id: "apt_3", service: "Hot Towel Facial", stylist: "Devon Reyes", date: "2026-07-18", time: "16:00", status: "Completed", price: 40 },
];

export const inventory = [
  { id: "inv_1", name: "Shampoo", qty: 42, threshold: 15 },
  { id: "inv_2", name: "Hair Wax", qty: 8, threshold: 10 },
  { id: "inv_3", name: "Hair Color", qty: 6, threshold: 12 },
  { id: "inv_4", name: "Face Cream", qty: 30, threshold: 10 },
];

export const weeklyRevenue = [
  { label: "Mon", value: 320 },
  { label: "Tue", value: 410 },
  { label: "Wed", value: 260 },
  { label: "Thu", value: 480 },
  { label: "Fri", value: 610 },
  { label: "Sat", value: 720 },
  { label: "Sun", value: 390 },
];
