import React, { useState } from 'react';
import { ZmanimConfig } from '../types.ts';
import { X, Save, AlertCircle, MapPin } from 'lucide-react';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (config: ZmanimConfig) => void;
    currentConfig: ZmanimConfig;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentConfig }) => {
    const [formData, setFormData] = useState<ZmanimConfig>(currentConfig);
    const [useGps, setUseGps] = useState<boolean>(!currentConfig.locationId && !!currentConfig.latitude);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Clean up data based on mode
        const cleanData = { ...formData };
        if (useGps) {
            cleanData.locationId = '';
        } else {
            cleanData.latitude = '';
            cleanData.longitude = '';
        }
        onSave(cleanData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-slate-800 border border-slate-600 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-700">
                    <h2 className="text-xl font-semibold text-white">Configuration API</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-blue-900/30 border border-blue-500/30 p-4 rounded-lg flex gap-3 text-blue-200 text-sm">
                        <AlertCircle className="shrink-0" size={20} />
                        <p>
                            Utilise l'API MyZmanim.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">User ID</label>
                        <input
                            type="text"
                            name="userId"
                            value={formData.userId}
                            onChange={handleChange}
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                            placeholder="Ex: 000158..."
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">API Key</label>
                        <input
                            type="text"
                            name="apiKey"
                            value={formData.apiKey}
                            onChange={handleChange}
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                            placeholder="Votre clé API"
                            required
                        />
                    </div>
                    
                    <div className="pt-2 border-t border-slate-700 mt-2">
                         <div className="flex gap-4 mb-4">
                            <button
                                type="button"
                                onClick={() => setUseGps(true)}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${useGps ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                            >
                                Coordonnées GPS
                            </button>
                            <button
                                type="button"
                                onClick={() => setUseGps(false)}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${!useGps ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                            >
                                Location ID
                            </button>
                        </div>

                        {useGps ? (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Latitude</label>
                                    <input
                                        type="text"
                                        name="latitude"
                                        value={formData.latitude || ''}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="31.80"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Longitude</label>
                                    <input
                                        type="text"
                                        name="longitude"
                                        value={formData.longitude || ''}
                                        onChange={handleChange}
                                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="34.65"
                                    />
                                </div>
                                <p className="col-span-2 text-xs text-slate-500 flex items-center gap-1">
                                    <MapPin size={12}/> Exemple Ashdod: 31.8014, 34.6435
                                </p>
                            </div>
                        ) : (
                             <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Location ID</label>
                                <input
                                    type="text"
                                    name="locationId"
                                    value={formData.locationId || ''}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none"
                                    placeholder="Ex: 2950159"
                                />
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        >
                            Annuler
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 transition-all"
                        >
                            <Save size={18} />
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsModal;