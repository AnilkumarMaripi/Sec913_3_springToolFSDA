import React, { useEffect, useState } from 'react';
import './Roles.css';
import { apibaseurl, callApi, imgurl } from '../lib';

const Roles = ({ token }) => {
    const [roles, setRoles] = useState([]);
    const [menus, setMenus] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ rolesCount: 0, menusCount: 0 });
    const [newRole, setNewRole] = useState("");
    const [newMenu, setNewMenu] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedMenus, setSelectedMenus] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    function loadData() {
        // Fetch Roles
        callApi("GET", apibaseurl + "/role/list", null, null, (res) => {
            if (res.code === 200) setRoles(res.data);
        }, token);

        // Fetch Menus
        callApi("GET", apibaseurl + "/menu/list", null, null, (res) => {
            if (res.code === 200) setMenus(res.data);
        }, token);

        // Fetch Stats
        callApi("GET", apibaseurl + "/role/stats", null, null, (res) => {
            if (res.code === 200) setStats({ rolesCount: res.rolesCount, menusCount: res.menusCount });
        }, token);

        // Fetch Users
        callApi("GET", apibaseurl + "/authservice/listuser", null, null, (res) => {
            if (res.code === 200) setUsers(res.data);
        }, token);
    }

    function addRole() {
        if (!newRole) return;
        callApi("POST", apibaseurl + "/role/add", { rolename: newRole }, null, (res) => {
            alert(res.message);
            setNewRole("");
            loadData();
        }, token);
    }

    function addMenu() {
        if (!newMenu) return;
        callApi("POST", apibaseurl + "/menu/add", { menu: newMenu, icon: "task.png" }, null, (res) => {
            alert(res.message);
            setNewMenu("");
            loadData();
        }, token);
    }

    function handleCheckboxChange(mid) {
        if (selectedMenus.includes(mid)) {
            setSelectedMenus(selectedMenus.filter(id => id !== mid));
        } else {
            setSelectedMenus([...selectedMenus, mid]);
        }
    }

    function mapRoleMenu() {
        if (!selectedRole || selectedMenus.length === 0) {
            alert("Please select role and at least one menu");
            return;
        }
        callApi("POST", apibaseurl + "/role/map", { role: selectedRole, menus: selectedMenus }, null, (res) => {
            alert(res.message);
            setSelectedMenus([]);
            loadData();
        }, token);
    }

    return (
        <div className='roles-page'>
            <div className='roles-header-row'>
                <div className='title-group'>
                    <span className='subtitle'>ACCESS CONTROL</span>
                    <h1 className='main-title'>Roles</h1>
                </div>
                <div className='stats-group'>
                    <div className='stat-card'>
                        <span className='stat-value'>{stats.rolesCount}</span>
                        <span className='stat-label'>Roles</span>
                    </div>
                    <div className='stat-card'>
                        <span className='stat-value'>{stats.menusCount}</span>
                        <span className='stat-label'>Menus</span>
                    </div>
                </div>
            </div>

            <div className='creation-grid'>
                <div className='creation-card'>
                    <div className='card-header'>
                        <div className='icon-box role-icon'>R</div>
                        <h3>Create Role</h3>
                    </div>
                    <div className='card-body'>
                        <input type='text' value={newRole} onChange={(e) => setNewRole(e.target.value)} placeholder='Role name' />
                        <button className='btn-add' onClick={addRole}>Add Role</button>
                    </div>
                </div>
                <div className='creation-card'>
                    <div className='card-header'>
                        <div className='icon-box menu-icon'>M</div>
                        <h3>Create Menu</h3>
                    </div>
                    <div className='card-body'>
                        <input type='text' value={newMenu} onChange={(e) => setNewMenu(e.target.value)} placeholder='Menu name' />
                        <button className='btn-add green' onClick={addMenu}>Add Menu</button>
                    </div>
                </div>
            </div>

            <div className='mapping-section'>
                <span className='subtitle'>PERMISSIONS</span>
                <h2 className='section-title'>Map Menus With Roles</h2>
                
                <div className='mapping-content'>
                    <div className='role-selector-box'>
                        <select className='role-dropdown' value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                            <option value="">Select Role</option>
                            {roles.map(r => <option key={r.role} value={r.role}>{r.rolename}</option>)}
                        </select>
                    </div>

                    <div className='menu-checkbox-grid'>
                        {menus.map(m => (
                            <div key={m.mid} className='menu-item'>
                                <input 
                                    type='checkbox' 
                                    id={`menu-${m.mid}`} 
                                    checked={selectedMenus.includes(m.mid)}
                                    onChange={() => handleCheckboxChange(m.mid)}
                                />
                                <div className='menu-label-box'>
                                    <img src={imgurl + m.icon} alt='' className='menu-icon-small' />
                                    <label htmlFor={`menu-${m.mid}`}>{m.menu}</label>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className='btn-save-map' onClick={mapRoleMenu}>Add</button>
                </div>
            </div>

            <div className='users-section'>
                <div className='users-header'>
                    <div className='title-group'>
                        <span className='subtitle'>ADMIN</span>
                        <h2 className='section-title'>Users</h2>
                    </div>
                    <button className='btn-refresh' onClick={loadData}>Refresh</button>
                </div>
                
                <div className='table-container'>
                    <table className='users-table'>
                        <thead>
                            <tr>
                                <th>NAME</th>
                                <th>EMAIL</th>
                                <th>PHONE</th>
                                <th>ROLE</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, index) => (
                                <tr key={index}>
                                    <td>{u.fullname}</td>
                                    <td>{u.email}</td>
                                    <td>{u.phone}</td>
                                    <td>{u.rolename}</td>
                                    <td><span className='status-tag active'>Active</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Roles;
