import React, { useState, useEffect } from 'react';
import { Settings, Loader2, AlertCircle, Info } from 'lucide-react';
import { ZmanimConfig, ZmanimResponse, FormattedZman } from './types';
import { fetchZmanimData, getMockZmanimData, formatTimeDisplay, addMinutesToTime } from './services/api';
import SettingsModal from './components/SettingsModal';
import RealTimeClock from './components/RealTimeClock';
import AnalogBackground from './components/AnalogBackground';
import ZmanCard from './components/ZmanCard';
import Countdown from './components/Countdown';

const STORAGE_KEY = 'netztracker_config';

function App() {
  const [config, setConfig] = useState<ZmanimConfig | null>(null);
  const [data, setData] = useState<ZmanimResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Load config on startup
  useEffect(() => {
    const savedConfig = localStorage.getItem(STORAGE_KEY);
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    } else {
      // Default to Ashdod settings provided in the example
      const defaultConfig: ZmanimConfig = {
          userId: "0001583267",
          apiKey: "94c8af54b8c190573f2dc0fed60bd2d1fd5e80ddd559b6a87f60fd2b1350864f179464977a084579",
          locationId: "",
          latitude: "31.801447",
          longitude: "34.643497"
      };
      setConfig(defaultConfig);
    }
  }, []);

  // Fetch data
  useEffect(() => {
    if (config) {
      setLoading(true);
      setError(null);
      setIsDemoMode(false);
      
      fetchZmanimData(config)
        .then((result) => {
          setData(result);
        })
        .catch((err) => {
          console.error(err);
          const errMsg = err.message || "Erreur chargement";
          
          // If Auth error, switch to demo mode silently or with minimal UI
          if (errMsg.includes("NotAuthorized")) {
              setIsDemoMode(true);
              setData(getMockZmanimData());
          } else {
              setError(errMsg);
              // Still fallback to demo data so the app isn't blank
              setData(getMockZmanimData());
              setIsDemoMode(true);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [config]);

  const handleSaveConfig = (newConfig: ZmanimConfig) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    setConfig(newConfig);
  };

  const prepareZmanimList = (data: ZmanimResponse): FormattedZman[] => {
    if (!data || !data.Zman) return [];

    const list: FormattedZman[] = [
      {
        label: "Aube",
        hebrewLabel: "עלות השחר",
        time: formatTimeDisplay(data.Zman.Dawn72),
        fullTime: data.Zman.Dawn72 || '',
        icon: 'moon'
      },
      {
        label: "Talit/Tefilin",
        hebrewLabel: "משיכיר",
        time: formatTimeDisplay(data.Zman.TalissMishyakir),
        fullTime: data.Zman.TalissMishyakir || '',
        icon: 'book'
      },
      {
        label: "Lever",
        hebrewLabel: "נץ החמה",
        time: formatTimeDisplay(data.Zman.SunriseDefault),
        fullTime: data.Zman.SunriseDefault || '',
        icon: 'sunrise',
        isHighlight: true
      },
      {
        label: "Fin Shema",
        hebrewLabel: "סוף זמן שמע",
        time: formatTimeDisplay(data.Zman.ShemaGra),
        fullTime: data.Zman.ShemaGra || '',
        icon: 'book'
      },
      {
        label: "Fin Tefilla",
        hebrewLabel: "סוף זמן תפילה",
        time: formatTimeDisplay(data.Zman.TefillaGra),
        fullTime: data.Zman.TefillaGra || '',
        icon: 'book'
      },
      {
        label: "Midi",
        hebrewLabel: "חצות היום",
        time: formatTimeDisplay(data.Zman.Chatzos),
        fullTime: data.Zman.Chatzos || '',
        icon: 'sun'
      },
      {
        label: "Mincha",
        hebrewLabel: "מנחה קטנה",
        time: addMinutesToTime(data.Zman.SunsetDefault, -20).slice(0, 5),
        fullTime: addMinutesToTime(data.Zman.SunsetDefault, -20),
        icon: 'clock'
      },
      {
        label: "Coucher",
        hebrewLabel: "שקיעה",
        time: formatTimeDisplay(data.Zman.SunsetDefault),
        fullTime: data.Zman.SunsetDefault || '',
        icon: 'sunset',
        isHighlight: true
      },
      {
        label: "Nuit",
        hebrewLabel: "צאת הכוכבים",
        time: formatTimeDisplay(data.Zman.Night72),
        fullTime: data.Zman.Night72 || '',
        icon: 'moon'
      },
      {
        label: "Paracha",
        hebrewLabel: "פרשת השבוע",
        time: data.Time.Parsha || "---",
        fullTime: '',
        icon: 'scroll'
      }
    ];
    return list;
  };

  // Helper for French Date
  const getFrenchDate = (dateStr?: string) => {
      // Always return current date for the display to match the clock
      const date = new Date(); 
      return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const zmanimList = data ? prepareZmanimList(data) : [];

  if (!data && loading) {
      return (
          <div className="min-h-screen bg-[#f2f0e4] flex items-center justify-center text-[#4a3b32]">
              <Loader2 className="animate-spin w-10 h-10" />
          </div>
      );
  }

  return (
    <div className="min-h-screen w-full bg-[#f2f0e4] relative overflow-hidden flex flex-col justify-between p-6 md:p-8 select-none">
      
      {/* Background Analog Clock */}
      <AnalogBackground />

      {/* Settings Button (Hidden but accessible) */}
      <button 
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-20 transition-opacity z-50 p-2"
      >
        <Settings className="text-black" />
      </button>

      {/* Demo Mode Indicator */}
      {isDemoMode && (
          <div className="absolute top-4 right-4 bg-amber-100/80 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold z-50 flex items-center gap-1 border border-amber-200">
              <Info size={12} /> Mode Démo
          </div>
      )}

      {/* TOP SECTION */}
      <header className="flex justify-between items-start w-full relative z-20">
        
        {/* Top Left: Daf Yomi */}
        <div className="text-left">
           <div className="flex items-baseline gap-2">
                <h2 className="text-3xl md:text-4xl font-serif-hebrew font-bold text-[#4a3b32]">
                    הדף היומי
                </h2>
                <span className="text-2xl md:text-3xl font-serif-hebrew text-[#7a2e1d] font-bold">
                    {data?.Time?.DafYomi || "זבחים פ״ח"}
                </span>
           </div>
           <div className="text-sm text-[#8c8279] mt-1 font-sans opacity-60 uppercase tracking-widest">
                {data?.Place?.Name}
           </div>
        </div>

        {/* Top Right: Date & Parsha */}
        <div className="text-right">
            {/* Hebrew Date */}
            <h1 className="text-4xl md:text-6xl font-serif-hebrew font-bold text-[#4a3b32] mb-1">
                {data?.Time?.DateJewish || "כ״א בְּכִסְלֵו תשפ״ו"}
            </h1>
            
            {/* French Date */}
            <div className="text-xl md:text-2xl font-bold text-black mb-2 tracking-wide">
                {getFrenchDate(data?.Time?.Date)}
            </div>

            {/* Parsha Header - kept as redundancy or for emphasis */}
            <div className="flex items-center justify-end gap-2 text-2xl md:text-4xl opacity-80">
                 <span className="font-serif-hebrew text-black">פרשת השבוע</span>
                 <span className="font-serif-hebrew font-bold text-[#7a2e1d]">{data?.Time?.Parsha || "וַיֵּשֶׁב"}</span>
            </div>
        </div>
      </header>

      {/* CENTER SECTION: CLOCK & COUNTDOWN */}
      <main className="flex-grow flex flex-col items-center justify-center relative z-20 w-full">
        <RealTimeClock />
        
        <div className="w-full max-w-3xl mt-6 md:mt-10 px-4">
             <Countdown zmanim={zmanimList} />
        </div>
      </main>

      {/* BOTTOM SECTION: ZMANIM GRID */}
      <footer className="w-full relative z-20 mt-4">
        {/* Adjusted grid to handle 10 items: 2 rows of 5 on md/lg, or 1 row of 10 on xl if very wide */}
        <div className="grid grid-cols-3 md:grid-cols-5 xl:grid-cols-10 gap-2">
             {zmanimList.map((zman, idx) => (
                 <ZmanCard key={idx} zman={zman} />
             ))}
        </div>
      </footer>

      {/* Error Toast - Only show for non-auth errors */}
      {error && !isDemoMode && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 px-4 py-2 rounded-full flex items-center gap-2 text-sm z-50 shadow-lg">
              <AlertCircle size={16} /> {error}
          </div>
      )}

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveConfig}
        currentConfig={config || { userId: '', apiKey: '', locationId: '' }}
      />
    </div>
  );
}

export default App;