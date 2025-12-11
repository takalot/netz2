import React, { useState, useEffect } from 'react';
import { Timer, ArrowRight, Clock } from 'lucide-react';
import { FormattedZman } from '../types';

interface CountdownProps {
    zmanim: FormattedZman[];
}

const Countdown: React.FC<CountdownProps> = ({ zmanim }) => {
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [nextZman, setNextZman] = useState<FormattedZman | null>(null);

    useEffect(() => {
        const calculateNextZman = () => {
            const now = new Date();
            
            let upcoming: { zman: FormattedZman; diff: number } | null = null;

            zmanim.forEach(z => {
                if (!z.fullTime || z.fullTime === '--:--') return;

                // Parse time
                const [h, m, s] = z.fullTime.split(':').map(Number);
                const zmanDate = new Date();
                zmanDate.setHours(h, m, s || 0, 0);

                const diff = zmanDate.getTime() - now.getTime();

                // If zman is in the future (and within the next 24 hours essentially, though we only check today's times)
                if (diff > 0) {
                    if (!upcoming || diff < upcoming.diff) {
                        upcoming = { zman: z, diff };
                    }
                }
            });

            if (upcoming) {
                setNextZman(upcoming.zman);
                
                // Format countdown
                const diff = upcoming.diff;
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                const seconds = Math.floor((diff / 1000) % 60);

                const formattedTime = [
                    hours.toString().padStart(2, '0'),
                    minutes.toString().padStart(2, '0'),
                    seconds.toString().padStart(2, '0')
                ].join(':');

                setTimeLeft(formattedTime);
            } else {
                setNextZman(null);
                setTimeLeft("00:00:00");
            }
        };

        calculateNextZman();
        const interval = setInterval(calculateNextZman, 1000);

        return () => clearInterval(interval);
    }, [zmanim]);

    if (!nextZman) {
        return (
            <div className="flex items-center justify-center p-4 rounded-xl border border-[#1a4c43]/10 bg-[#fff]/30 backdrop-blur-sm text-[#8c8279] text-sm font-sans uppercase tracking-widest">
                <Clock className="w-4 h-4 mr-2" />
                Aucun Zman à venir aujourd'hui
            </div>
        );
    }

    const isMajor = nextZman.isHighlight;

    return (
        <div className={`relative overflow-hidden rounded-2xl transition-all duration-500
            ${isMajor 
                ? 'bg-amber-500/10 border-2 border-amber-500/30 shadow-lg shadow-amber-900/5' 
                : 'bg-[#1a4c43]/5 border border-[#1a4c43]/10 shadow-sm'
            } backdrop-blur-md p-4 md:p-6 w-full`}>
            
            <div className="flex flex-row items-center justify-between gap-6">
                
                {/* Left Side: Label */}
                <div className="flex flex-col items-start min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs md:text-sm font-bold uppercase tracking-widest ${isMajor ? 'text-amber-700' : 'text-[#8c8279]'}`}>
                            Prochain Zman
                        </span>
                        {isMajor && <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>}
                    </div>
                    
                    <h3 className="text-4xl md:text-5xl font-serif-hebrew font-bold text-[#4a3b32] leading-tight truncate w-full">
                        {nextZman.hebrewLabel}
                    </h3>
                    
                    <div className="text-sm md:text-base text-[#1a4c43]/80 font-medium flex items-center gap-2 mt-1">
                        <span>{nextZman.label}</span>
                        <ArrowRight className="w-3 h-3 opacity-50" />
                        <span className="font-bold font-sans">{nextZman.time}</span>
                    </div>
                </div>

                {/* Right Side: Timer */}
                <div className="text-right shrink-0">
                    <div className={`text-5xl md:text-7xl font-sans font-bold tabular-nums tracking-tighter leading-none
                        ${isMajor ? 'text-[#a63c06]' : 'text-[#1a4c43]'}`}>
                        {timeLeft}
                    </div>
                    <div className={`text-xs text-right mt-2 font-medium uppercase tracking-wider opacity-60
                        ${isMajor ? 'text-[#a63c06]' : 'text-[#1a4c43]'}`}>
                        Temps Restant
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Countdown;