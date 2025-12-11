import React from 'react';

const AnalogBackground: React.FC = () => {
    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80vh] h-[80vh] opacity-10 pointer-events-none z-0">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Clock Face Circle */}
                <circle cx="50" cy="50" r="48" fill="#e8e6dc" stroke="#ccc" strokeWidth="0.5" />
                
                {/* Minute Ticks */}
                {Array.from({ length: 60 }).map((_, i) => (
                    <line
                        key={i}
                        x1="50" y1="6"
                        x2="50" y2={i % 5 === 0 ? "12" : "8"}
                        stroke="#666"
                        strokeWidth={i % 5 === 0 ? "2" : "0.5"}
                        transform={`rotate(${i * 6} 50 50)`}
                    />
                ))}

                {/* Hands (Static artistic representation) */}
                {/* Hour Hand */}
                <line x1="50" y1="50" x2="70" y2="65" stroke="#333" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
                {/* Minute Hand */}
                <line x1="50" y1="50" x2="30" y2="20" stroke="#333" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                {/* Second Hand */}
                <line x1="50" y1="50" x2="80" y2="50" stroke="red" strokeWidth="0.5" opacity="0.3" />
            </svg>
        </div>
    );
};

export default AnalogBackground;