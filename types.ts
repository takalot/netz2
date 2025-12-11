export interface ZmanimConfig {
    userId: string;
    apiKey: string;
    locationId?: string;
    latitude?: string;
    longitude?: string;
}

export interface ZmanimResponse {
    Place: {
        Name: string;
        Latitude?: string;
        Longitude?: string;
        Country?: string;
    };
    Time: {
        Date: string;
        DateSemiLong: string; // Ex: Thursday, December 11, 2025
        Weekday: string;
        DateJewish: string; // Ex: 11 Kislev 5786
        DateJewishShort: string;
        Parsha: string;
        DafYomi: string;
        [key: string]: string | undefined;
    };
    Zman: {
        // Core times usually returned by MyZmanim
        Dawn72?: string; // Alot HaShachar
        SunriseDefault?: string; // Netz Hachama
        TalissMishyakir?: string;
        ShemaGra?: string; // Sof Zman Shema
        TefillaGra?: string;
        Chatzos?: string;
        SunsetDefault?: string; // Shkiah
        Night72?: string; // Tzeit HaKochavim
        [key: string]: string | undefined;
    };
    ErrMsg?: string;
}

export interface FormattedZman {
    label: string;
    hebrewLabel: string;
    time: string; // Display time (HH:MM) or text
    fullTime: string; // Calculation time (HH:MM:SS)
    icon: 'sun' | 'moon' | 'sunrise' | 'sunset' | 'book' | 'clock' | 'scroll';
    isHighlight?: boolean;
}