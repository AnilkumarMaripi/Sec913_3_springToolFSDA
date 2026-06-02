import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { imgurl, callApi, apibaseurl } from './lib';
import './App.css';
import ProgressBar from './components/ProgressBar.jsx';

const App = () => {
    const [isSignin, setIsSignIn] = useState(true);
    const [isForgot, setIsForgot] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const finput = useRef();
    const [isProgress, setIsProgress] = useState(false);
    const [errorData, setErrorData] = useState({});
    const [alertMsg, setAlertMsg] = useState(null);

    const showAlert = (msg) => {
        setAlertMsg(msg);
        setTimeout(() => setAlertMsg(null), 4000);
    };

    const [signupData, setSignupData] = useState({
        fullname: "",
        phone: "",
        email: "",
        role: "",
        password: "",
        retypepassword: ""
    });

    const [signinData, setSigninData] = useState({
        username: "",
        password: ""
    });

    const [resetData, setResetData] = useState({
        email: "",
        newpassword: "",
        retypepassword: ""
    });

    const [roles, setRoles] = useState([]);

    useEffect(() => {
        // Fetch roles for signup dropdown
        callApi("GET", apibaseurl + "/role/list", null, null, (res) => {
            if (res.code === 200) setRoles(res.data);
        });
    }, []);

    const isFirstRender = useRef(true);

    useEffect(() => {
        setTimeout(() => { finput.current?.focus(); }, 0);

        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        gsap.fromTo('.auth-content .reveal',
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.05 }
        );
    }, [isSignin, isForgot]);

    // GSAP Loader Animation
    useEffect(() => {
        const loader = document.getElementById('loader');
        const bar = document.getElementById('loader-bar');
        const counter = document.getElementById('loader-counter');
        const name = document.getElementById('loader-name');

        if (!loader) return;

        gsap.to(name, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 });

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(() => {
                    gsap.to(loader, {
                        yPercent: -100,
                        duration: 0.9,
                        ease: 'power4.inOut',
                        onComplete: () => {
                            loader.style.display = 'none';
                            // Reveal elements
                            document.querySelectorAll('.reveal').forEach(el => {
                                gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
                            });
                        }
                    });
                }, 300);
            }
            if (bar) bar.style.width = progress + '%';
            if (counter) counter.textContent = String(Math.floor(progress)).padStart(3, '0');
        }, 60);

        return () => clearInterval(interval);
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

        const interactables = document.querySelectorAll('a, button, .switch-mode span, input, select');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', addHover);
            el.addEventListener('mouseleave', removeHover);
        });

        return () => {
            document.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mousedown', addClick);
            document.removeEventListener('mouseup', removeClick);
            interactables.forEach(el => {
                el.removeEventListener('mouseenter', addHover);
                el.removeEventListener('mouseleave', removeHover);
            });
        };
    }, [isSignin, isForgot]);

    function switchWindow(e) {
        if (e) e.preventDefault();
        setIsSignIn(prev => !prev);
        setIsForgot(false);
        setShowPassword(false);
        setErrorData({});
        setSigninData({ username: "", password: "" });
        setSignupData({
            fullname: "", phone: "", email: "", role: "", password: "", retypepassword: ""
        });
        setResetData({ email: "", newpassword: "", retypepassword: "" });
    }

    function toggleForgot(e) {
        if (e) e.preventDefault();
        setIsForgot(true);
        setShowPassword(false);
        setErrorData({});
    }

    function switchBackToLogin(e) {
        if (e) e.preventDefault();
        setIsForgot(false);
        setIsSignIn(true);
        setShowPassword(false);
        setErrorData({});
    }

    const togglePasswordVisibility = (e) => {
        if (e) e.preventDefault();
        setShowPassword(!showPassword);
    };

    const EyeIcon = () => (
        <button type="button" className="eye-icon" onClick={togglePasswordVisibility} tabIndex="-1">
            {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
            ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            )}
        </button>
    );

    function handleSigninInput(e) {
        const { name, value } = e.target;
        setSigninData({ ...signinData, [name]: value });
    }

    function handleResetInput(e) {
        const { name, value } = e.target;
        setResetData({ ...resetData, [name]: value });
    }

    function handleSignupInput(e) {
        const { name, value } = e.target;
        if (name === 'phone') {
            setSignupData({ ...signupData, [name]: value.replace(/\D/g, '') });
        } else {
            setSignupData({ ...signupData, [name]: value });
        }
    }

    function validateSignup() {
        let errors = {};
        if (signupData.fullname === "") errors.fullname = true;
        if (signupData.phone === "") errors.phone = true;
        if (signupData.email === "") errors.email = true;
        if (signupData.role === "") errors.role = true;
        if (signupData.password === "") errors.password = true;
        if (signupData.retypepassword === "" || signupData.password !== signupData.retypepassword) errors.retypepassword = true;
        setErrorData(errors);
        return Object.keys(errors).length > 0;
    }

    function validateReset() {
        let errors = {};
        if (resetData.email === "") errors.email = true;
        if (resetData.newpassword === "") errors.newpassword = true;
        if (resetData.retypepassword === "" || resetData.newpassword !== resetData.retypepassword) errors.retypepassword = true;
        setErrorData(errors);
        return Object.keys(errors).length > 0;
    }

    function validateSignin() {
        let errors = {};
        if (signinData.username === "") errors.username = true;
        if (signinData.password === "") errors.password = true;
        setErrorData(errors);
        return Object.keys(errors).length > 0;
    }

    function signin(e) {
        if (e) e.preventDefault();
        if (validateSignin()) return;
        setIsProgress(true);
        callApi("POST", apibaseurl + "/authservice/signin", signinData, null, signinResponseHandler);
    }

    function signup(e) {
        if (e) e.preventDefault();
        if (validateSignup()) return;
        setIsProgress(true);
        callApi("POST", apibaseurl + "/authservice/signup", signupData, null, signupResponseHandler);
    }

    function resetPassword(e) {
        if (e) e.preventDefault();
        if (validateReset()) return;
        setIsProgress(true);
        callApi("POST", apibaseurl + "/authservice/resetpassword", { email: resetData.email, newpassword: resetData.newpassword }, null, resetResponseHandler);
    }

    function signinResponseHandler(res) {
        if (res.code != 200) showAlert(res.message);
        else {
            localStorage.setItem("token", res.jwt);
            window.location.replace("/Sec913_3_springToolFSDA/home");
        }
        setIsProgress(false);
    }

    function signupResponseHandler(res) {
        showAlert(res.message);
        setIsProgress(false);
        setSignupData({ fullname: "", phone: "", email: "", role: "", password: "", retypepassword: "" });
        finput.current?.focus();
    }

    function resetResponseHandler(res) {
        showAlert(res.message);
        setIsProgress(false);
        if (res.code === 200) {
            setResetData({ email: "", newpassword: "", retypepassword: "" });
            setIsForgot(false);
            setIsSignIn(true);
        }
    }

    return (
        <div className='auth-page'>
            {/* CUSTOM ALERT */}
            {alertMsg && (
                <div className="custom-alert reveal-alert">
                    <div className="alert-content">
                        <span>{alertMsg}</span>
                        <button type="button" onClick={() => setAlertMsg(null)} className="alert-close">&times;</button>
                    </div>
                </div>
            )}

            {/* CUSTOM CURSOR */}
            <div id="cursor">
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="30" height="30" rx="4" fill="var(--charcoal)" stroke="var(--accent)" strokeWidth="1.5" />
                    <text x="6" y="22" fontFamily="monospace" fontSize="14" fill="var(--accent)" fontWeight="bold">&lt;/&gt;</text>
                </svg>
            </div>

            {/* LOADER */}
            <div id="loader">
                <div className="loader-name" id="loader-name">Micro Task Hub<span style={{ color: 'var(--accent)' }}>.</span></div>
                <div className="loader-bar-wrap"><div className="loader-bar" id="loader-bar"></div></div>
                <div className="loader-counter" id="loader-counter">000</div>
            </div>

            {/* NAV */}
            <nav className="auth-nav">
                <a href="#" className="nav-logo">anil<span>.</span>dev</a>
            </nav>

            <div className='auth-content' key={isForgot ? "forgot" : (isSignin ? "signin" : "signup")}>
                {/* LEFT: HERO */}
                <div className="auth-hero">
                    <div className="hero-index reveal">
                        <span>Authentication</span>
                        <span>&amp; Access Control</span>
                    </div>

                    <h1 className="hero-title">
                        <div className="overflow-hidden"><span className="title-line block reveal">Micro Task Hub</span></div>
                        <div className="overflow-hidden"><span className="title-line block reveal"><em className="serif-word">Task Assigner</em></span></div>
                        <div className="overflow-hidden"><span className="title-line block outline-text reveal"></span></div>
                    </h1>

                    <div className="hero-desc reveal">
                        Distributing micro-contributions<br />
                        that live at the intersection of<br />
                        <strong style={{ color: 'var(--charcoal)' }}>talent,  tasks  &amp; technology.</strong>
                    </div>
                </div>

                {/* RIGHT: FORM */}
                <div className="auth-form-wrap">
                    <div className="section-label reveal">
                        {isForgot ? "Reset Password" : (isSignin ? "Secure Login" : "Create Account")}
                    </div>

                    <form onSubmit={isForgot ? resetPassword : (isSignin ? signin : signup)} className="reveal" noValidate>
                        {isForgot ? (
                            <>
                                <div className="form-row">
                                    <label className="form-label">Email Address</label>
                                    <input type='email' ref={finput} className={`form-input ${errorData.email ? 'error' : ''}`} placeholder='Enter your email' autoComplete='off' name="email" value={resetData.email} onChange={handleResetInput} />
                                </div>
                                <div className="form-row">
                                    <label className="form-label">New Password</label>
                                    <input type={showPassword ? 'text' : 'password'} className={`form-input ${errorData.newpassword ? 'error' : ''}`} placeholder='Enter new password' name='newpassword' value={resetData.newpassword} onChange={handleResetInput} />
                                    <EyeIcon />
                                </div>
                                <div className="form-row">
                                    <label className="form-label">Re-type New Password</label>
                                    <input type={showPassword ? 'text' : 'password'} className={`form-input ${errorData.retypepassword ? 'error' : ''}`} placeholder='Re-type new password' name='retypepassword' value={resetData.retypepassword} onChange={handleResetInput} />
                                    <EyeIcon />
                                </div>
                                <button type="submit" className="form-submit"><span>Reset Password →</span></button>
                                <div className="switch-mode" onClick={switchBackToLogin}>
                                    Remembered your password? <span>Sign in</span>
                                </div>
                            </>
                        ) : isSignin ? (
                            <>
                                <div className="form-row">
                                    <label className="form-label">Username</label>
                                    <input type='text' ref={finput} className={`form-input ${errorData.username ? 'error' : ''}`} placeholder='Enter email id' autoComplete='off' name="username" value={signinData.username} onChange={handleSigninInput} />
                                </div>
                                <div className="form-row">
                                    <label className="form-label">Password</label>
                                    <input type={showPassword ? 'text' : 'password'} className={`form-input ${errorData.password ? 'error' : ''}`} placeholder='Enter password' name='password' value={signinData.password} onChange={handleSigninInput} />
                                    <EyeIcon />
                                </div>
                                <div style={{ textAlign: 'right', marginTop: '-10px', marginBottom: '20px' }}>
                                    <a href="#" onClick={toggleForgot} style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)', textDecoration: 'none' }}>Forgot Password?</a>
                                </div>
                                <button type="submit" className="form-submit"><span>Let's Start →</span></button>
                                <div className="switch-mode" onClick={switchWindow}>
                                    Don't have an account? <span>Sign up</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="form-row">
                                    <label className="form-label">Full Name</label>
                                    <input type='text' ref={finput} className={`form-input ${errorData.fullname ? 'error' : ''}`} placeholder='Enter full name' autoComplete='off' name='fullname' value={signupData.fullname} onChange={handleSignupInput} />
                                </div>
                                <div className="form-row">
                                    <label className="form-label">Mobile Number</label>
                                    <input type='tel' className={`form-input ${errorData.phone ? 'error' : ''}`} placeholder='Enter mobile number' autoComplete='off' name='phone' value={signupData.phone} onChange={handleSignupInput} />
                                </div>
                                <div className="form-row">
                                    <label className="form-label">Email Address</label>
                                    <input type='email' className={`form-input ${errorData.email ? 'error' : ''}`} placeholder='Enter email id' autoComplete='off' name='email' value={signupData.email} onChange={handleSignupInput} />
                                </div>
                                <div className="form-row">
                                    <label className="form-label">Role</label>
                                    <select name='role' value={signupData.role} onChange={handleSignupInput} className={`form-select ${errorData.role ? 'error' : ''}`}>
                                        <option value="">Select Role</option>
                                        {roles.map(r => <option key={r.role} value={r.role}>{r.rolename}</option>)}
                                    </select>
                                </div>
                                <div className="form-row">
                                    <label className="form-label">Password</label>
                                    <input type={showPassword ? 'text' : 'password'} className={`form-input ${errorData.password ? 'error' : ''}`} placeholder='Enter password' autoComplete='off' name='password' value={signupData.password} onChange={handleSignupInput} />
                                    <EyeIcon />
                                </div>
                                <div className="form-row">
                                    <label className="form-label">Re-type Password</label>
                                    <input type={showPassword ? 'text' : 'password'} className={`form-input ${errorData.retypepassword ? 'error' : ''}`} placeholder='Re-type your password' autoComplete='off' name='retypepassword' value={signupData.retypepassword} onChange={handleSignupInput} />
                                    <EyeIcon />
                                </div>
                                <button type="submit" className="form-submit"><span>Register →</span></button>
                                <div className="switch-mode" onClick={switchWindow}>
                                    Already have an account? <span>Sign in</span>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>

            <ProgressBar isProgress={isProgress} />
        </div>
    );
}

export default App;
