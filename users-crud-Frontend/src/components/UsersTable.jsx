import React, { Component } from "react";
import { connect } from "react-redux";
import { deleteUser } from "../store/usersSlice";

class UsersTable extends Component {
  componentDidMount() {
    // ✅ Lifecycle method example (class component)
    console.log("UsersTable mounted");
  }

  render() {
    const { users, role, deleteUser, onEdit } = this.props;

    return (
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
                  onClick={() => onEdit(u)}
                >
                  Edit
                </button>

                {/* ✅ ADMIN only delete */}
                {role === "ADMIN" && (
                  <button
                    className="btn danger"
                    onClick={() => deleteUser(u.id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

/* ✅ Redux connection for class component */
const mapStateToProps = (state) => ({
  users: state.users.data,
});

export default connect(mapStateToProps, { deleteUser })(UsersTable);