import React, { useState, useEffect } from 'react';

const RealTimeClock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');

    return (
        // dir="ltr" is crucial here to keep HH:MM:SS format correct even when app is RTL
        <div dir="ltr" className="relative z-10 flex items-baseline font-bold tracking-tighter leading-none" style={{ fontFamily: 'Tahoma, sans-serif' }}>
            {/* Hours and Minutes - Black */}
            <span className="text-[13rem] md:text-[18rem] text-black drop-shadow-sm">
                {hours}:{minutes}
            </span>
            
            {/* Colon and Seconds - Red */}
            <span className="text-[7rem] md:text-[10rem] text-[#ff0000] ml-4 mb-10 md:mb-16 flex items-center">
                <span className="mr-2">:</span>{seconds}
            </span>
        </div>
    );
};

export default RealTimeClock;