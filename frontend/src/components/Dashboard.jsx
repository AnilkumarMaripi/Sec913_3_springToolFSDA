import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { apibaseurl, callApi } from '../lib';

const Dashboard = ({ token, fullname, email }) => {
    const [stats, setStats] = useState({ roles: 0, menus: 0, activeUsers: 0, totalUsers: 0 });

    useEffect(() => {
        if (!token) return;

        // Fetch role stats
        callApi("GET", apibaseurl + "/role/stats", null, null, (res) => {
            if (res.code === 200) {
                setStats(prev => ({ ...prev, roles: res.rolesCount || 0, menus: res.menusCount || 0 }));
            }
        }, token);
        
        // Fetch users to count them
        callApi("GET", apibaseurl + "/authservice/listuser", null, null, (res) => {
            if (res.code === 200 && res.data) {
                const activeCount = res.data.filter(u => u.email === email).length;
                setStats(prev => ({ ...prev, totalUsers: res.data.length, activeUsers: activeCount }));
            }
        }, token);
    }, [token]);

    return (
        <div className="dashboard-container">
            <div className="dash-header">
                <h1 className="dash-greeting">Welcome back, {fullname}!</h1>
                <p className="dash-subtitle">Here is what's happening with your micro-tasks today.</p>
            </div>

            <div className="dash-grid">
                <div className="dash-card">
                    <span className="dash-card-title">Currently Active Users</span>
                    <span className="dash-card-value">{stats.activeUsers}</span>
                </div>
                <div className="dash-card">
                    <span className="dash-card-title">Total Registered Users</span>
                    <span className="dash-card-value">{stats.totalUsers}</span>
                </div>
                <div className="dash-card">
                    <span className="dash-card-title">Configured Roles</span>
                    <span className="dash-card-value">{stats.roles}</span>
                </div>
                <div className="dash-card">
                    <span className="dash-card-title">Accessible Menus</span>
                    <span className="dash-card-value">{stats.menus}</span>
                </div>
            </div>
            
            <div className="dash-recent-activity">
                <span>Activity Stream (Coming Soon)</span>
            </div>
        </div>
    );
};

export default Dashboard;
