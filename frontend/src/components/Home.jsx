import React, { useEffect, useState } from 'react';
import './Home.css';
import { apibaseurl, callApi, imgurl } from '../lib';
import ProgressBar from './ProgressBar';

import Roles from './Roles';
import TaskManager from './TaskManager';

const Home = () => {
    const [fullname, setFullname] = useState("");
    const [isProgress, setIsProgress] = useState("");
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

    function loadUinfo(res) {
        setIsProgress(false);
        if (res.code != 200)
            return;
        setFullname(res.fullname);
        setMenuList(res.menulist);
        if (res.menulist.length > 0)
            setActiveMenu(res.menulist[0].menu);
    }

    function logout() {
        localStorage.clear();
        window.location.replace("/");
    }

    const renderContent = () => {
        const currentMenu = menuList.find(m => m.menu === activeMenu);
        if (!currentMenu) return <div className='home-content'>Access Denied or Menu Not Found</div>;

        if (activeMenu === "Roles") {
            return <Roles token={token} />;
        }
        if (activeMenu === "Task Manager") {
            return <TaskManager token={token} />;
        }
        return <div className='home-content'>Welcome to {activeMenu}</div>;
    };

    return (
        <div className='home'>
            <div className='home-header'>
                <div className='logo-container'>
                    <img src={imgurl + "logo.png"} alt='Micro Task Hub' className='small-logo' />
                </div>
                <div className='info'>
                    <span className='user-name'>{fullname}</span>
                    <div className='logout-btn' onClick={() => logout()}>
                        <img src={imgurl + "shutdown.png"} alt='Logout' />
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
                                <img src={imgurl + m.icon} alt='' />
                                <span>{m.menu}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='home-workspace-content'>
                    {renderContent()}
                </div>
            </div>
            <div className='home-footer'>Copyright @ 2026 Micro-Task Hub. All rights reserved By ANILKUMAR-2500080160.</div>

            <ProgressBar isProgress={isProgress} />
        </div>
    );
}

export default Home;
