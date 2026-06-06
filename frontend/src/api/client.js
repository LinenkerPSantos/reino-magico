const BASE = '/api'

export async function fetchAll() {
  const res = await fetch(`${BASE}/all`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function fetchStatus() {
  const res = await fetch(`${BASE}/status`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
