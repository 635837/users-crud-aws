import { useEffect, useState } from 'react';
import { fetchUsers, createUser, updateUser, deleteUser } from './api';
import { getTokenFromHash, login, logout, getUserRole } from './auth';

export default function App() {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [roleLoaded, setRoleLoaded] = useState(false); // ✅ NEW
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ id: '', name: '', email: '' });

  // ✅ Step 1: Read token once on app load
  useEffect(() => {
    const t = getTokenFromHash();
    setToken(t);
  }, []);

  // ✅ Step 2: Resolve role only AFTER token exists
  useEffect(() => {
    if (token) {
      const r = getUserRole();
      setRole(r);
      setRoleLoaded(true); // ✅ critical
      loadUsers();
    }
  }, [token]);

  async function loadUsers() {
    const data = await fetchUsers();
    setUsers(data);
  }

  async function handleSubmit() {
    if (!form.name || !form.email) return;

    if (editingId == null) {
      await createUser({
        id: Number(form.id),
        name: form.name,
        email: form.email,
      });
    } else {
      await updateUser(editingId, {
        name: form.name,
        email: form.email,
      });
    }

    setForm({ id: '', name: '', email: '' });
    setEditingId(null);
    loadUsers();
  }

  // ✅ 🔒 BLOCK UI until role is resolved
  if (token && !roleLoaded) {
    return <div className="wrap">Loading...</div>;
  }

  return (
    <div className="wrap">
      <h1>Users CRUD</h1>

      <h2>Create User</h2>
      <div className="form-row">
        <input
          placeholder="ID"
          value={form.id}
          onChange={(e) => setForm({ ...form, id: e.target.value })}
        />
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <button className="btn primary" onClick={handleSubmit}>
          {editingId ? 'Save' : 'Add'}
        </button>
      </div>

      <div className="top-actions">
        <span className="pill">
          {token ? `Auth ON (${role})` : 'Auth OFF'}
        </span>

        {!token && (
          <button className="btn secondary" onClick={login}>
            Login
          </button>
        )}

        {token && (
          <button className="btn secondary" onClick={logout}>
            Logout
          </button>
        )}

        <button className="btn secondary" onClick={loadUsers}>
          Reload
        </button>
      </div>

      <h2 className="subhead">Users</h2>
      <table>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <button
                  className="btn secondary"
                  onClick={() => {
                    setForm(u);
                    setEditingId(u.id);
                  }}
                >
                  Edit
                </button>

                {/* ✅ DELETE ONLY FOR ADMIN */}
                {role === 'ADMIN' ? (
                  <button
                    className="btn danger"
                    onClick={async () => {
                      if (role !== 'ADMIN') {
                        alert('You are not authorized to delete.');
                        return;
                      }
                      await deleteUser(u.id);
                      loadUsers();
                    }}
                  >
                    Delete
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}