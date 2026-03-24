import { CONFIG } from './config';

function authHeader() {
  const token = localStorage.getItem('cognito_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchUsers() {
  const res = await fetch(`${CONFIG.API_BASE_URL}/users`, {
    headers: { ...authHeader() }
  });
  if (!res.ok) throw new Error('Failed to load users');
  return res.json();
}

export async function createUser(user) {
  const res = await fetch(`${CONFIG.API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(user)
  });
  if (!res.ok) throw new Error('Create failed');
}

export async function updateUser(id, user) {
  const res = await fetch(`${CONFIG.API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(user)
  });
  if (!res.ok) throw new Error('Update failed');
}

export async function deleteUser(id) {
  const res = await fetch(`${CONFIG.API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: { ...authHeader() }
  });
  if (!res.ok) throw new Error('Delete failed');
}