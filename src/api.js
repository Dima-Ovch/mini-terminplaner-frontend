const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';


export async function getAppointments(futureOnly = false) {
const res = await fetch(`${BASE}/appointments${futureOnly ? '?future=true' : ''}`);
return res.json();
}
export async function createAppointment(data) {
const res = await fetch(`${BASE}/appointments`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)});
return res.json();
}
export async function updateAppointment(id, data) {
const res = await fetch(`${BASE}/appointments/${id}`, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data)});
return res.json();
}
export async function deleteAppointment(id) {
const res = await fetch(`${BASE}/appointments/${id}`, { method: 'DELETE' });
return res.json();
}