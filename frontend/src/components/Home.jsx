import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import './Home.css';
import { apibaseurl, callApi, imgurl } from '../lib';
import ProgressBar from './ProgressBar';

import Roles from './Roles';
import TaskManager from './TaskManager';
import UserManager from './UserManager';
import MyProfile from './MyProfile';
import MyTask from './MyTask';
import Dashboard from './Dashboard';
import JwtPlayground from './JwtPlayground';

const Home = () => {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [isProgress, setIsProgress] = useState(false);
    const [token, setToken] = useState("");
    const [menuList, setMenuList] = useState([]);
    const [activeMenu, setActiveMenu] = useState("Dashboard");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token)
            logout();
        else {
            setToken(token);
            setIsProgress(true);
            callApi("GET", apibaseurl + "/authservice/uinfo", null, null, loadUinfo, token);
        }
    }, []);

    // Custom Cursor Logic
    useEffect(() => {
        const cursor = document.getElementById('cursor');
        if (!cursor) return;

        let mouseX = 0, mouseY = 0;
        const isMobile = () => window.innerWidth <= 768;

        const moveCursor = (e) => {
            if (isMobile()) return;
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        };

        const addHover = () => cursor.classList.add('hover');
        const removeHover = () => cursor.classList.remove('hover');
        const addClick = () => cursor.classList.add('click');
        const removeClick = () => cursor.classList.remove('click');

        document.addEventListener('mousemove', moveCursor);
        document.addEventListener('mousedown', addClick);
        document.addEventListener('mouseup', removeClick);

        // Bind hover effects to interactive elements
        const bindInteractables = () => {
            const interactables = document.querySelectorAll('a, button, li, input, select, .logout-btn, .action-btn');
            interactables.forEach(el => {
                el.removeEventListener('mouseenter', addHover);
                el.removeEventListener('mouseleave', removeHover);
                el.addEventListener('mouseenter', addHover);
                el.addEventListener('mouseleave', removeHover);
            });
        };

        // Call immediately and observe DOM changes
        bindInteractables();
        const observer = new MutationObserver(bindInteractables);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            document.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mousedown', addClick);
            document.removeEventListener('mouseup', removeClick);
            observer.disconnect();
        };
    }, []);

    // GSAP Reveal for workspace content
    useEffect(() => {
        gsap.fromTo('.home-workspace-content',
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        );
    }, [activeMenu]);

    function loadUinfo(res) {
        setIsProgress(false);
        if (res.code != 200)
            return;
        setFullname(res.fullname);
        setEmail(res.email);
        const menuWithJwt = [...(res.menulist || []), { mid: 999, menu: "JWT Playground" }];
        setMenuList(menuWithJwt);
        if (menuWithJwt.length > 0)
            setActiveMenu(menuWithJwt[0].menu);
    }

    function logout() {
        localStorage.removeItem("token");
        window.location.replace("/Sec913_3_springToolFSDA/");
    }

    const renderContent = () => {
        const currentMenu = menuList.find(m => m.menu === activeMenu);
        if (!currentMenu) return <div className='home-content reveal'>Access Denied or Menu Not Found</div>;

        if (activeMenu === "Roles") {
            return <Roles token={token} />;
        }
        if (activeMenu === "Task Manager") {
            return <TaskManager token={token} />;
        }
        if (activeMenu === "User Manager") {
            return <UserManager token={token} currentUserEmail={email} />;
        }
        if (activeMenu === "My Profile") {
            return <MyProfile token={token} />;
        }
        if (activeMenu === "My Task") {
            return <MyTask token={token} />;
        }
        if (activeMenu === "Dashboard") {
            return <Dashboard token={token} fullname={fullname} email={email} />;
        }
        if (activeMenu === "JWT Playground") {
            return <JwtPlayground />;
        }
        return <div className='home-content reveal'>Welcome to {activeMenu}</div>;
    };

    return (
        <div className='home'>
            {/* CUSTOM CURSOR */}
            <div id="cursor">
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="30" height="30" rx="4" fill="var(--charcoal)" stroke="var(--accent)" strokeWidth="1.5" />
                    <text x="6" y="22" fontFamily="monospace" fontSize="14" fill="var(--accent)" fontWeight="bold">&lt;/&gt;</text>
                </svg>
            </div>

            <div className='home-header'>
                <div className='logo-container'>
                    <a href="#" className="nav-logo">anil<span>.</span>dev</a>
                </div>
                <div className='info'>
                    <span className='user-name'>{fullname || 'Loading...'}</span>
                    <div className='logout-btn' onClick={() => logout()}>
                        Logout
                    </div>
                </div>
            </div>

            <div className='home-workspace'>
                <div className='home-menus'>
                    <ul className='main-menus'>
                        {menuList.map((m) => (
                            <li
                                key={m.mid}
                                className={activeMenu === m.menu ? 'active' : ''}
                                onClick={() => setActiveMenu(m.menu)}
                            >
                                <span>{m.menu}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='home-workspace-content'>
                    {renderContent()}
                </div>
            </div>

            <div className='home-footer'>Copyright © 2026 80160.dev All rights reserved.</div>

            <ProgressBar isProgress={isProgress} />
        </div>
    );
}

export default Home;
