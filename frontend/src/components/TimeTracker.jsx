import { useState, useEffect } from 'react';

const TimeTracker = () => {
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let startTime = sessionStorage.getItem('site_start_time');
        if (!startTime) {
            startTime = Date.now();
            sessionStorage.setItem('site_start_time', startTime);
        }

        const updateTimer = () => {
            const now = Date.now();
            const diff = Math.floor((now - startTime) / 1000);
            setElapsedTime(diff);
        };

        // Initial call
        updateTimer();

        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const parts = [];
        if (hours > 0) parts.push(String(hours).padStart(2, '0'));
        parts.push(String(minutes).padStart(2, '0'));
        parts.push(String(seconds).padStart(2, '0'));

        return parts.join(':');
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: 'var(--charcoal, #1a1a1a)',
            color: 'var(--accent, #3b82f6)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontFamily: 'monospace',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 9999,
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            border: '1px solid var(--accent, #3b82f6)',
            pointerEvents: 'none'
        }}>
            Time Spent: {formatTime(elapsedTime)}
        </div>
    );
};

export default TimeTracker;
