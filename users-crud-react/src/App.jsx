import { useEffect, useState } from 'react';
import { fetchUsers, createUser, updateUser, deleteUser } from './api';
import { getTokenFromHash, login, logout } from './auth';

export default function App() {
  const [users, setUsers] = useState([]);
  const [token, setToken] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ id: '', name: '', email: '' });

  useEffect(() => {
    const t = getTokenFromHash();
    setToken(t);
    loadUsers();
  }, []);

  async function loadUsers() {
    const data = await fetchUsers();
    setUsers(data);
  }

  async function handleSubmit() {
    if (!form.name || !form.email) return;

    if (editingId == null) {
      await createUser({ id: Number(form.id), name: form.name, email: form.email });
    } else {
      await updateUser(editingId, { name: form.name, email: form.email });
    }

    setForm({ id: '', name: '', email: '' });
    setEditingId(null);
    loadUsers();
  }

  return (
    <div className="wrap">
      <h1>Users CRUD</h1>

      <h2>Create User</h2>
      <div className="form-row">
        <input
          placeholder="ID"
          value={form.id}
          onChange={e => setForm({ ...form, id: e.target.value })}
        />
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <button className="btn primary" onClick={handleSubmit}>
          {editingId ? 'Save' : 'Add'}
        </button>
      </div>

      <div className="top-actions">
        <span className="pill">{token ? 'Auth ON' : 'Auth OFF'}</span>
        {!token && <button className="btn secondary" onClick={login}>Login</button>}
        {token && <button className="btn secondary" onClick={logout}>Logout</button>}
        <button className="btn secondary" onClick={loadUsers}>Reload</button>
      </div>

      <h2 className="subhead">Users</h2>
      <table>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <button
                  className="btn secondary"
                  onClick={() => { setForm(u); setEditingId(u.id); }}
                >
                  Edit
                </button>
                <button
                  className="btn danger"
                  onClick={() => deleteUser(u.id).then(loadUsers)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
