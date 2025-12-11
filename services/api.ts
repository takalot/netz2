import { ZmanimConfig, ZmanimResponse } from '../types';

const BASE_URL = "https://api.myzmanim.com/engine1.json.aspx";

// Helper to format date as YYYY-MM-DD
const formatDateForApi = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Helper to add minutes to a time string (HH:MM:SS)
export const addMinutesToTime = (timeStr: string | undefined, minutesToAdd: number): string => {
    if (!timeStr) return '--:--';
    
    // Simple parsing assuming HH:MM:SS or HH:MM format
    const parts = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(parts[0], 10));
    date.setMinutes(parseInt(parts[1], 10));
    date.setSeconds(parts[2] ? parseInt(parts[2], 10) : 0);

    date.setMinutes(date.getMinutes() + minutesToAdd);

    // Return strict HH:MM:SS format
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    
    return `${h}:${m}:${s}`;
};

// Helper to format raw time string to clean HH:MM
export const formatTimeDisplay = (timeStr: string | undefined): string => {
    if (!timeStr) return '--:--';
    const parts = timeStr.split(':');
    return `${parts[0]}:${parts[1]}`;
};

// Search Location ID via GPS
const getLocationIdFromGps = async (config: ZmanimConfig): Promise<string> => {
    if (!config.latitude || !config.longitude) {
        throw new Error("Latitude et Longitude requises pour la recherche GPS");
    }

    const params = new URLSearchParams({
        coding: "json",
        latitude: config.latitude,
        longitude: config.longitude,
        key: config.apiKey,
        user: config.userId
    });

    const response = await fetch(`${BASE_URL}/searchGps?${params.toString()}`);
    const data = await response.json();

    if (data.ErrMsg) {
        throw new Error(data.ErrMsg);
    }
    
    return data.LocationID;
};

export const fetchZmanimData = async (config: ZmanimConfig): Promise<ZmanimResponse> => {
    const { userId, apiKey } = config;
    
    try {
        let locationId = config.locationId;

        // If no explicit location ID is provided, try to find it using GPS coordinates
        if (!locationId && config.latitude && config.longitude) {
            locationId = await getLocationIdFromGps(config);
        }

        if (!locationId) {
            throw new Error("Location ID ou Coordonnées GPS manquants");
        }

        const dateStr = formatDateForApi(new Date());

        const params = new URLSearchParams({
            coding: "json",
            language: "en",
            locationid: locationId,
            inputdate: dateStr,
            key: apiKey,
            user: userId
        });

        const response = await fetch(`${BASE_URL}/getDay?${params.toString()}`);
        
        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.ErrMsg) {
            throw new Error(data.ErrMsg);
        }

        return data as ZmanimResponse;
    } catch (error) {
        // Suppress console error for cleaner UX when falling back to demo mode
        throw error;
    }
};

// Mock data for demo mode or fallbacks
export const getMockZmanimData = (): ZmanimResponse => {
    const now = new Date();
    // Basic approximate times for Ashdod
    return {
        Place: {
            Name: "Ashdod (Mode Démo)",
            Country: "Israel"
        },
        Time: {
            Date: formatDateForApi(now),
            DateSemiLong: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            Weekday: now.toLocaleDateString('fr-FR', { weekday: 'long' }),
            DateJewish: "21 Kislev 5786",
            DateJewishShort: "21 Kislev",
            Parsha: "וישב", // Vayeshev
            DafYomi: "זבחים פ״ח" // Zevachim 88
        },
        Zman: {
            Dawn72: "05:18:00",
            TalissMishyakir: "05:45:00",
            SunriseDefault: "06:30:23", // Netz matching screenshot approx
            ShemaGra: "09:45:00",
            TefillaGra: "10:55:00",
            Chatzos: "11:45:00",
            SunsetDefault: "16:37:00", // Shkiah matching screenshot
            Night72: "17:49:00"
        }
    };
};