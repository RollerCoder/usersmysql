// File: App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newUser, setNewUser] = useState({ FirstName: '', LastName: '', EmailAddress: '' });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/users?page=${currentPage}&perPage=10`);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/users', newUser);
      setNewUser({ FirstName: '', LastName: '', EmailAddress: '' });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/users/${editingUser.id}`, editingUser);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="App">
      <h1>User Management</h1>

      <h2>Create User</h2>
      <form onSubmit={handleCreateUser}>
        <input
          name="FirstName"
          value={newUser.FirstName}
          onChange={(e) => handleInputChange(e, setNewUser)}
          placeholder="First Name"
          required
        />
        <input
          name="LastName"
          value={newUser.LastName}
          onChange={(e) => handleInputChange(e, setNewUser)}
          placeholder="Last Name"
          required
        />
        <input
          name="EmailAddress"
          value={newUser.EmailAddress}
          onChange={(e) => handleInputChange(e, setNewUser)}
          placeholder="Email Address"
          required
        />
        <button type="submit">Create User</button>
      </form>

      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{editingUser?.id === user.id ? (
                <input
                  name="FirstName"
                  value={editingUser.FirstName}
                  onChange={(e) => handleInputChange(e, setEditingUser)}
                />
              ) : user.FirstName}</td>
              <td>{editingUser?.id === user.id ? (
                <input
                  name="LastName"
                  value={editingUser.LastName}
                  onChange={(e) => handleInputChange(e, setEditingUser)}
                />
              ) : user.LastName}</td>
              <td>{editingUser?.id === user.id ? (
                <input
                  name="EmailAddress"
                  value={editingUser.EmailAddress}
                  onChange={(e) => handleInputChange(e, setEditingUser)}
                />
              ) : user.EmailAddress}</td>
              <td>
                {editingUser?.id === user.id ? (
                  <>
                    <button onClick={handleUpdateUser}>Save</button>
                    <button onClick={() => setEditingUser(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setEditingUser(user)}>Edit</button>
                    <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
