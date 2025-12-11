import React from 'react';
import { Sunrise, Sunset, Moon, Sun, BookOpen, Clock, Star, Scroll } from 'lucide-react';
import { FormattedZman } from '../types';

interface ZmanCardProps {
    zman: FormattedZman;
}

const ZmanCard: React.FC<ZmanCardProps> = ({ zman }) => {
    const getIcon = () => {
        switch (zman.icon) {
            case 'sunrise': return <Sunrise className="w-5 h-5" />;
            case 'sunset': return <Sunset className="w-5 h-5" />;
            case 'moon': return <Moon className="w-5 h-5" />;
            case 'sun': return <Sun className="w-5 h-5" />;
            case 'book': return <BookOpen className="w-5 h-5" />;
            case 'clock': return <Clock className="w-5 h-5" />;
            case 'scroll': return <Scroll className="w-5 h-5" />;
            default: return <Star className="w-5 h-5" />;
        }
    };

    const isTextContent = zman.icon === 'scroll';

    return (
        <div className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-black/5 transition-colors border border-transparent hover:border-black/5">
            <div className="text-[#1a4c43] mb-1 opacity-70">
                {getIcon()}
            </div>
            
            <div className={`font-bold tracking-tight text-[#1a4c43] leading-none mb-1 text-center ${isTextContent ? 'text-2xl font-serif-hebrew py-1' : 'text-3xl font-sans'}`}>
                {zman.time}
            </div>
            
            <div className="text-xl font-serif-hebrew font-bold text-[#4a3b32] leading-none text-center whitespace-nowrap">
                {zman.hebrewLabel}
            </div>
            
            <div className="text-[10px] uppercase tracking-wider text-[#8c8279] font-medium mt-1 text-center truncate w-full">
                {zman.label}
            </div>
        </div>
    );
};

export default ZmanCard;