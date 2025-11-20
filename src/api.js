export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

async function safeFetch(url, options) {
  try {
    const res = await fetch(url, options)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (err) {
    console.error('API fetch error', url, err)
    throw err
  }
}

export async function getAppointments(futureOnly = false) {
  const q = futureOnly ? '?futureOnly=1' : ''
  const url = `${API_BASE}/appointments${q}`
  try {
    return await safeFetch(url)
  } catch (e) {
    // Rückfall: leere Liste statt uncaught error
    return []
  }
}

export async function createAppointment(payload) {
  try {
    return await safeFetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  } catch (e) {
    return null
  }
}

export async function updateAppointment(id, payload) {
  try {
    return await safeFetch(`${API_BASE}/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  } catch (e) {
    return null
  }
}

export async function deleteAppointment(id) {
  try {
    await fetch(`${API_BASE}/appointments/${id}`, { method: 'DELETE' })
    return true
  } catch (e) {
    return false
  }
}