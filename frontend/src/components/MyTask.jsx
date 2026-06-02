import React, { useEffect, useState } from 'react';
import './MyTask.css';
import { apibaseurl, callApi } from '../lib';

const MyTask = ({ token }) => {
    const [tasks, setTasks] = useState([]);
    const [userRoleId, setUserRoleId] = useState(null);
    const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });

    useEffect(() => {
        loadData();
    }, []);

    function loadData() {
        // First get user info to know their roleId
        callApi("GET", apibaseurl + "/authservice/uinfo", null, null, (res) => {
            if (res.code === 200) {
                const roleId = res.roleId;
                setUserRoleId(roleId);
                
                // Then fetch all tasks and filter
                callApi("GET", apibaseurl + "/tasks/list", null, null, (taskRes) => {
                    if (taskRes.code === 200) {
                        const allTasks = taskRes.data;
                        // Filter tasks where task's roleId matches the user's roleId
                        const myAssignedTasks = allTasks.filter(t => t.roleId === roleId || String(t.roleId) === String(roleId));
                        
                        setTasks(myAssignedTasks);
                        
                        // Calculate stats
                        const total = myAssignedTasks.length;
                        const completed = myAssignedTasks.filter(t => t.status === "Completed").length;
                        const pending = total - completed;
                        
                        setStats({ total, pending, completed });
                    }
                }, token);
            }
        }, token);
    }

    return (
        <div className='my-task-page'>
            <div className='my-task-header-row'>
                <div className='title-group'>
                    <span className='my-task-subtitle'>WORKSPACE</span>
                    <h1 className='my-task-title'>My Tasks</h1>
                </div>
                <div className='mt-stats-group'>
                    <div className='mt-stat-card'>
                        <span className='mt-stat-value'>{stats.total}</span>
                        <span className='mt-stat-label'>Total Assigned</span>
                    </div>
                    <div className='mt-stat-card'>
                        <span className='mt-stat-value'>{stats.pending}</span>
                        <span className='mt-stat-label'>Pending</span>
                    </div>
                    <div className='mt-stat-card'>
                        <span className='mt-stat-value' style={{color: '#22c55e'}}>{stats.completed}</span>
                        <span className='mt-stat-label'>Completed</span>
                    </div>
                </div>
            </div>

            <div className='my-task-table-wrapper'>
                <table className='my-task-table'>
                    <thead>
                        <tr>
                            <th>Task ID</th>
                            <th>Task Name</th>
                            <th>Description</th>
                            <th>Assigned By</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Due Date</th>
                            <th>Remarks</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.length > 0 ? (
                            tasks.map((t, index) => (
                                <tr key={t.id || index}>
                                    <td>TASK-{String(t.id).padStart(3, '0')}</td>
                                    <td>{t.task}</td>
                                    <td>{t.desc}</td>
                                    <td>{t.assignedBy}</td>
                                    <td>
                                        <span className={`mt-status-badge ${t.status.toLowerCase().replace(" ", "-")}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className={`mt-priority-label mt-priority-${t.priority.split(" ")[0].toLowerCase()}`}>
                                        {t.priority.split(" ")[0]}
                                    </td>
                                    <td>{t.dueDate}</td>
                                    <td>{t.remarks}</td>
                                    <td>{t.createdAt}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" style={{ textAlign: 'center', color: 'var(--muted)', padding: '3rem' }}>
                                    No tasks have been assigned to your role yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyTask;
