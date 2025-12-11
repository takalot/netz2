import React from 'react';
import { Sunrise, Sunset, Moon, Sun, BookOpen, Clock, Star, Scroll } from 'lucide-react';
import { FormattedZman } from '../types.ts';

interface ZmanCardProps {
    zman: FormattedZman;
}

const ZmanCard: React.FC<ZmanCardProps> = ({ zman }) => {
    const getIcon = () => {
        const className = "w-6 h-6 md:w-8 md:h-8"; // Larger icons
        switch (zman.icon) {
            case 'sunrise': return <Sunrise className={className} />;
            case 'sunset': return <Sunset className={className} />;
            case 'moon': return <Moon className={className} />;
            case 'sun': return <Sun className={className} />;
            case 'book': return <BookOpen className={className} />;
            case 'clock': return <Clock className={className} />;
            case 'scroll': return <Scroll className={className} />;
            default: return <Star className={className} />;
        }
    };

    const isTextContent = zman.icon === 'scroll';

    return (
        <div className="group flex flex-col items-center justify-between p-4 rounded-xl hover:bg-black/5 transition-all duration-300 border border-transparent hover:border-black/5 w-full h-full min-h-[120px]">
            
            {/* Icone */}
            <div className="text-[#1a4c43] mb-2 opacity-60 group-hover:opacity-80 transition-opacity">
                {getIcon()}
            </div>
            
            {/* Heure ou Texte Principal */}
            <div className={`font-bold tracking-tight text-[#1a4c43] leading-none mb-2 text-center w-full flex items-center justify-center flex-1
                ${isTextContent 
                    ? 'text-2xl md:text-3xl font-serif-hebrew py-1 break-words leading-tight' 
                    : 'text-4xl md:text-5xl lg:text-6xl font-sans'
                }`}>
                {zman.time}
            </div>
            
            {/* Labels - Groupe du bas */}
            <div className="w-full mt-auto flex flex-col items-center gap-1">
                <div className="text-xl md:text-2xl lg:text-3xl font-serif-hebrew font-bold text-[#4a3b32] leading-none text-center w-full px-1 truncate">
                    {zman.hebrewLabel}
                </div>
                
                <div className="text-xs md:text-sm uppercase tracking-widest text-[#8c8279] font-medium mt-1 text-center w-full truncate px-1">
                    {zman.label}
                </div>
            </div>
        </div>
    );
};

export default ZmanCard;