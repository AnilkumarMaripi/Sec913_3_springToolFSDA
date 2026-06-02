import React, { useEffect, useState } from 'react';
import './UserManager.css';
import { apibaseurl, callApi } from '../lib';

const UserManager = ({ token, currentUserEmail }) => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [stats, setStats] = useState({ total: 0, active: 0, roles: 0 });

    useEffect(() => {
        loadUsers();
    }, []);

    function loadUsers() {
        callApi("GET", apibaseurl + "/authservice/listuser", null, null, (res) => {
            if (res.code === 200) {
                setUsers(res.data);
                
                // Calculate some meaningful stats
                const total = res.data.length;
                const active = res.data.filter(u => u.email === currentUserEmail).length;
                const uniqueRoles = new Set(res.data.map(u => u.rolename)).size;
                
                setStats({ total, active, roles: uniqueRoles });
            }
        }, token);
    }

    const filteredUsers = users.filter(u => 
        u.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.rolename.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='user-manager'>
            <div className='um-header-row'>
                <div className='title-group'>
                    <span className='um-subtitle'>ADMINISTRATION</span>
                    <h1 className='um-title'>User Manager</h1>
                </div>
                <div className='um-stats-group'>
                    <div className='um-stat-card'>
                        <span className='um-stat-value'>{stats.total}</span>
                        <span className='um-stat-label'>Total Users</span>
                    </div>
                    <div className='um-stat-card'>
                        <span className='um-stat-value'>{stats.active}</span>
                        <span className='um-stat-label'>Active</span>
                    </div>
                    <div className='um-stat-card'>
                        <span className='um-stat-value'>{stats.roles}</span>
                        <span className='um-stat-label'>Unique Roles</span>
                    </div>
                </div>
            </div>

            <div className='um-actions-section'>
                <div className='um-search-box'>
                    <input 
                        type='text' 
                        className='um-search-input' 
                        placeholder='Search users by name, email or role...' 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button className='btn-action' onClick={loadUsers}>
                    <span>Refresh Data</span>
                </button>
            </div>

            <div className='um-table-container'>
                <table className='um-table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email Address</th>
                            <th>Phone Number</th>
                            <th>Assigned Role</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((u, index) => (
                                <tr key={index}>
                                    <td>{u.fullname}</td>
                                    <td>{u.email}</td>
                                    <td>{u.phone}</td>
                                    <td>{u.rolename}</td>
                                    <td>
                                        {u.email === currentUserEmail ? (
                                            <span className='um-status-tag active'>Active</span>
                                        ) : (
                                            <span className='um-status-tag inactive'>Inactive</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--muted)' }}>No users found matching your search.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserManager;
