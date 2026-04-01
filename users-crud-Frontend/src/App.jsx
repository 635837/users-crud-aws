import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, createUser, updateUser } from "./store/usersSlice";
import { getTokenFromHash, login, logout, getUserRole } from "./auth";
import UsersTable from "./components/UsersTable";

export default function App() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.users.loading);

  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [roleLoaded, setRoleLoaded] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ id: "", name: "", email: "" });

  useEffect(() => {
    const t = getTokenFromHash();
    setToken(t);
  }, []);

  useEffect(() => {
    if (token) {
      setRole(getUserRole());
      setRoleLoaded(true);
      dispatch(fetchUsers());
    }
  }, [token, dispatch]);

  const handleSubmit = () => {
    if (!form.name || !form.email) return;

    if (editingId == null) {
      dispatch(
        createUser({
          id: Number(form.id),
          name: form.name,
          email: form.email,
        })
      );
    } else {
      dispatch(
        updateUser({
          id: editingId,
          user: { name: form.name, email: form.email },
        })
      );
    }

    setForm({ id: "", name: "", email: "" });
    setEditingId(null);
  };

  if (token && !roleLoaded) {
    return <div className="wrap">Loading...</div>;
  }

  return (
    <div className="wrap">
      <h1>Users CRUD</h1>

      <div className="top-actions">
        <span className="pill">
          {token ? `Auth ON (${role})` : "Auth OFF"}
        </span>
        {!token && <button onClick={login}>Login</button>}
        {token && <button onClick={logout}>Logout</button>}
      </div>

      <h2>Create / Edit User</h2>
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
      <button onClick={handleSubmit}>
        {editingId ? "Save" : "Add"}
      </button>

      <h2>Users</h2>
      {loading && <p>Loading users...</p>}

      {/* ✅ CLASS COMPONENT USED HERE */}
      <UsersTable
        role={role}
        onEdit={(u) => {
          setForm(u);
          setEditingId(u.id);
        }}
      />
    </div>
  );
}