import React, { useEffect, useState } from 'react';
import './MyProfile.css';
import { apibaseurl, callApi } from '../lib';

const MyProfile = ({ token }) => {
    const [profile, setProfile] = useState({
        fullname: 'Loading...',
        email: 'Loading...',
        phone: 'Loading...',
        roleId: 'Loading...'
    });

    useEffect(() => {
        // Fetch current user info
        callApi("GET", apibaseurl + "/authservice/uinfo", null, null, (res) => {
            if (res.code === 200) {
                setProfile({
                    fullname: res.fullname || 'No Name',
                    email: res.email || 'No Email provided',
                    phone: res.phone || 'No Phone provided',
                    roleId: getRoleName(res.roleId)
                });
            }
        }, token);
    }, []);

    // Simple role map to show string instead of ID
    const getRoleName = (id) => {
        const roles = {
            1: "User",
            2: "Manager",
            3: "Admin",
            4: "123",
            5: "Quality Analyst"
        };
        return roles[id] || "User";
    };

    const getInitials = (name) => {
        if (!name || name === 'Loading...' || name === 'No Name') return "U";
        const parts = name.split(" ");
        if (parts.length > 1) return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
        return name[0].toUpperCase();
    };

    return (
        <div className='my-profile'>
            <div className='profile-header-row'>
                <div className='title-group'>
                    <span className='profile-subtitle'>ACCOUNT SETTINGS</span>
                    <h1 className='profile-title'>My Profile</h1>
                </div>
            </div>

            <div className='profile-card'>
                <div className='profile-avatar-section'>
                    <div className='profile-avatar'>
                        {getInitials(profile.fullname)}
                    </div>
                    <div className='profile-role-badge'>
                        {profile.roleId}
                    </div>
                    <div className='profile-actions'>
                        <button className='btn-edit-profile'>
                            <span>Edit Profile</span>
                        </button>
                    </div>
                </div>

                <div className='profile-info-grid'>
                    <div className='info-item'>
                        <span className='info-label'>Full Name</span>
                        <span className='info-value'>{profile.fullname}</span>
                    </div>
                    <div className='info-item'>
                        <span className='info-label'>Email Address</span>
                        <span className='info-value'>{profile.email}</span>
                    </div>
                    <div className='info-item'>
                        <span className='info-label'>Phone Number</span>
                        <span className='info-value'>{profile.phone}</span>
                    </div>
                    <div className='info-item'>
                        <span className='info-label'>Account Status</span>
                        <span className='info-value' style={{ color: '#22c55e' }}>Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
