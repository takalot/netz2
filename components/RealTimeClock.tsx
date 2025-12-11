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
        <div className="relative z-10 flex items-baseline font-bold tracking-tighter leading-none" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Hours and Minutes - Black */}
            <span className="text-[12rem] md:text-[16rem] text-black drop-shadow-sm">
                {hours}:{minutes}
            </span>
            
            {/* Colon and Seconds - Red */}
            <span className="text-[6rem] md:text-[8rem] text-[#ff0000] ml-2 mb-8 md:mb-12 flex items-center">
                <span className="mr-1">:</span>{seconds}
            </span>
        </div>
    );
};

export default RealTimeClock;