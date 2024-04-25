import React, { useState, useEffect } from 'react';

const App = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleEditUser = async (id, newName, newAge, newEmail) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName, age: newAge, email: newEmail }),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(user => (user._id === id ? updatedUser : user)));
        setEditingUserId(null);
      } else {
        console.error('Error updating user:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async id => {
    try {
      const response = await fetch(`http://localhost:5000/users/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setUsers(users.filter(user => user._id !== id));
      } else {
        console.error('Error deleting user:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch(`http://localhost:5000/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName, age: newAge, email: newEmail }),
      });
      if (response.ok) {
        const newUser = await response.json();
        setUsers([...users, newUser]);
        setNewName('');
        setNewAge('');
        setNewEmail('');
      } else {
        console.error('Error adding user:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>User Management System</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {users.map(user => (
          <div key={user._id} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {editingUserId === user._id 
            ? (
              <div style={{ display: 'flex', flexDirection: 'row', gap: '50px' }}>
                <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder={user.name} />
                <input type="text" value={newAge} onChange={e => setNewAge(e.target.value)} placeholder={user.age} />
                <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder={user.email} />
                <div>
                  <button onClick={() => handleEditUser(user._id, newName, newAge, newEmail)}>Save</button>
                  <button onClick={() => setEditingUserId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <div>{user.name}</div>
                <div>{user.email}</div>
                <div>{user.age}</div>
                <div>
                  <button onClick={() => setEditingUserId(user._id)}>Edit</button>
                  <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '20px' }}>
        <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name" style={{ marginRight: '10px' }} />
        <input type="text" value={newAge} onChange={e => setNewAge(e.target.value)} placeholder="Age" style={{ marginRight: '10px' }} />
        <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email" style={{ marginRight: '10px' }} />
        <button onClick={handleAddUser}>Add User</button>
      </div>
    </div>
  );
};

export default App;
