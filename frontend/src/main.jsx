import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Home from './components/Home.jsx';
import TimeTracker from './components/TimeTracker.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/Sec913_3_springToolFSDA/">
    <TimeTracker />
    <Routes>
        <Route path='/' element={<App/>} />
        <Route path='/home' element={<Home/>} />
    </Routes>
  </BrowserRouter>
)