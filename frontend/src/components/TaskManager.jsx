import React, { useEffect, useState } from 'react';
import './TaskManager.css';
import { apibaseurl, callApi, imgurl } from '../lib';

const TaskManager = ({ token }) => {
    const [tasks, setTasks] = useState([]);
    const [roles, setRoles] = useState([]);
    const [quickTaskName, setQuickTaskName] = useState("");
    const [newTask, setNewTask] = useState({
        task: "",
        desc: "",
        assignedBy: "",
        status: "Not Started",
        priority: "Medium Priority",
        dueDate: "",
        remarks: "",
        roleId: ""
    });
    const [isProgress, setIsProgress] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    function loadData() {
        setIsProgress(true);
        callApi("GET", apibaseurl + "/tasks/list", null, null, (res) => {
            if (res.code === 200) setTasks(res.data);
            setIsProgress(false);
        }, token);

        callApi("GET", apibaseurl + "/role/list", null, null, (res) => {
            if (res.code === 200) setRoles(res.data);
        }, token);
    }

    function handleQuickAdd(e) {
        if (e) e.preventDefault();
        if (!quickTaskName.trim()) return;
        
        const dataToSend = {
            task: quickTaskName.trim(),
            desc: "Quick added task",
            assignedBy: "Admin",
            status: "Not Started",
            priority: "Medium Priority",
            dueDate: new Date().toISOString().split('T')[0],
            remarks: "",
            roleId: roles.length > 0 ? roles[0].role : null,
            createdAt: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString().split(":")[0] + ":" + new Date().toLocaleTimeString().split(":")[1]
        };

        callApi("POST", apibaseurl + "/tasks/add", dataToSend, null, (res) => {
            alert(res.message);
            setQuickTaskName("");
            loadData();
        }, token);
    }

    function addTask() {
        if (!newTask.task) {
            alert("Task Name is required");
            return;
        }
        const dataToSend = {
            ...newTask,
            assignedBy: newTask.assignedBy || "Admin",
            roleId: newTask.roleId ? parseInt(newTask.roleId) : (roles.length > 0 ? roles[0].role : null),
            createdAt: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString().split(":")[0] + ":" + new Date().toLocaleTimeString().split(":")[1]
        };
        callApi("POST", apibaseurl + "/tasks/add", dataToSend, null, (res) => {
            alert(res.message);
            setNewTask({
                task: "", desc: "", assignedBy: "", status: "Not Started",
                priority: "Medium Priority", dueDate: "", remarks: "", roleId: ""
            });
            loadData();
        }, token);
    }

    const uniqueTaskNames = Array.from(new Set(tasks.map(t => t.task).filter(Boolean)));

    return (
        <div className='task-manager'>
            <div className='task-manager-header-section'>
                <span className='breadcrumb-text'>ADMIN &gt; TASK MANAGER</span>
                <h1 className='main-title-custom'>Task Manager</h1>
                <p className='subtitle-text'>Create tasks and hand them to a Manager — or assign directly to a User.</p>
            </div>

            {/* Quick Add Task */}
            <div className='task-form-card quick-add-card'>
                <div className='card-header-bar'>
                    <span className='blue-indicator'></span>
                    <h3>Quick Add Task</h3>
                </div>
                <div className='quick-add-row'>
                    <input 
                        type='text' 
                        className='form-input quick-add-input' 
                        placeholder='Type a task name and press Enter...'
                        value={quickTaskName} 
                        onChange={(e) => setQuickTaskName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleQuickAdd(); }}
                    />
                    <button className='btn-quick-add' onClick={handleQuickAdd}><span>Add Task</span></button>
                </div>
            </div>

            {/* Create New Task Form */}
            <div className='task-form-card create-task-card'>
                <div className='card-header-bar'>
                    <span className='blue-indicator'></span>
                    <h3>Create New Task</h3>
                </div>
                <div className='form-grid'>
                    <div className='form-field form-full'>
                        <label className='form-label'>Task Name*</label>
                        <div className='task-name-split-row'>
                            <select 
                                className='form-select task-select-existing' 
                                value={newTask.task} 
                                onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                            >
                                <option value="">Pick existing...</option>
                                {uniqueTaskNames.map(name => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                            <input 
                                type='text' 
                                className='form-input task-input-new' 
                                placeholder='...or type a new task name'
                                value={newTask.task} 
                                onChange={(e) => setNewTask({ ...newTask, task: e.target.value })} 
                            />
                        </div>
                        <span className='form-help-text'>Pick from the dropdown to copy an existing name, or just type a new one.</span>
                    </div>

                    <div className='form-field form-full'>
                        <label className='form-label'>Description</label>
                        <textarea 
                            className='form-textarea' 
                            placeholder='Optional details'
                            value={newTask.desc} 
                            onChange={(e) => setNewTask({ ...newTask, desc: e.target.value })}
                        />
                    </div>

                    <div className='form-field'>
                        <label className='form-label'>Assign To</label>
                        <select 
                            className='form-select' 
                            value={newTask.assignedBy} 
                            onChange={(e) => setNewTask({ ...newTask, assignedBy: e.target.value })}
                        >
                            <option value="">A role</option>
                            {roles.map(r => (
                                <option key={r.role} value={r.rolename}>{r.rolename}</option>
                            ))}
                        </select>
                    </div>

                    <div className='form-field'>
                        <label className='form-label'>Role*</label>
                        <select 
                            className='form-select' 
                            value={newTask.roleId} 
                            onChange={(e) => setNewTask({ ...newTask, roleId: e.target.value })}
                        >
                            <option value="">Select...</option>
                            {roles.map(r => (
                                <option key={r.role} value={r.role}>{r.rolename}</option>
                            ))}
                        </select>
                    </div>

                    <div className='form-field'>
                        <label className='form-label'>Due / Work Date</label>
                        <input 
                            type='date' 
                            className='form-input' 
                            value={newTask.dueDate} 
                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} 
                        />
                    </div>

                    <div className='form-field'>
                        <label className='form-label'>Time allocated</label>
                        <input 
                            type='text' 
                            className='form-input' 
                            placeholder='Time allocated'
                            value={newTask.remarks} 
                            onChange={(e) => setNewTask({ ...newTask, remarks: e.target.value })} 
                        />
                    </div>

                    <div className='form-field'>
                        <label className='form-label'>Status</label>
                        <select className='form-select' value={newTask.status}
                            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}>
                            <option>Not Started</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                        </select>
                    </div>

                    <div className='form-field'>
                        <label className='form-label'>Priority</label>
                        <select className='form-select' value={newTask.priority}
                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
                            <option>Low Priority</option>
                            <option>Medium Priority</option>
                            <option>High Priority</option>
                            <option>Urgent</option>
                        </select>
                    </div>
                </div>
                <div className='form-actions-row'>
                    <button className='btn-add' onClick={addTask}><span>Add task</span></button>
                </div>
            </div>

            {/* Task Table */}
            <div className='table-wrapper'>
                <table className='task-table'>
                    <thead>
                        <tr>
                            <th>Task ID</th>
                            <th>Task Name</th>
                            <th>Task Description</th>
                            <th>Assigned By</th>
                            <th>Status</th>
                            <th>Priority</th>
                            <th>Due Date</th>
                            <th>Remarks</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((t, index) => (
                            <tr key={t.id || index}>
                                <td>TASK-{String(t.id).padStart(3, '0')}</td>
                                <td>{t.task}</td>
                                <td>{t.desc}</td>
                                <td>{t.assignedBy}</td>
                                <td>
                                    <span className={`status-badge ${t.status.toLowerCase().replace(" ", "-")}`}>
                                        {t.status}
                                    </span>
                                </td>
                                <td className={`priority-label priority-${t.priority.split(" ")[0].toLowerCase()}`}>
                                    {t.priority.split(" ")[0]}
                                </td>
                                <td>{t.dueDate}</td>
                                <td>{t.remarks}</td>
                                <td>{t.createdAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskManager;