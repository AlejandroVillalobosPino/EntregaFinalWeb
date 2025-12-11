// src/components/widgets/PopularityWidget.jsx
'use client';

import { useState } from 'react';

const POPULARITY_PRESETS = [
    { name: 'Underground', min: 0, max: 40, emoji: '🔍' },
    { name: 'Popular', min: 40, max: 70, emoji: '🎵' },
    { name: 'Mainstream', min: 70, max: 100, emoji: '🔥' },
    { name: 'Todas', min: 0, max: 100, emoji: '🌟' }
];

export default function PopularityWidget({ popularity, onSelect }) {
    const [minValue, maxValue] = popularity;

    const handlePresetClick = (preset) => {
        onSelect([preset.min, preset.max]);
    };

    const handleMinChange = (e) => {
        const newMin = parseInt(e.target.value);
        onSelect([newMin, Math.max(newMin, maxValue)]);
    };

    const handleMaxChange = (e) => {
        const newMax = parseInt(e.target.value);
        onSelect([Math.min(minValue, newMax), newMax]);
    };

    const getPopularityLabel = () => {
        if (minValue === 0 && maxValue === 100) return 'Todas';
        if (maxValue <= 40) return 'Underground';
        if (minValue >= 70) return 'Mainstream';
        if (minValue >= 40 && maxValue <= 70) return 'Popular';
        return 'Personalizado';
    };

    return (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-white font-bold text-lg mb-4">
                📊 Popularidad
            </h3>

            {/* Presets */}
            <div className="grid grid-cols-2 gap-2 mb-6">
                {POPULARITY_PRESETS.map(preset => {
                    const isActive = minValue === preset.min && maxValue === preset.max;
                    return (
                        <button
                            key={preset.name}
                            onClick={() => handlePresetClick(preset)}
                            className={`py-2 px-3 rounded-lg font-medium text-sm transition-all ${
                                isActive
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {preset.emoji} {preset.name}
                        </button>
                    );
                })}
            </div>

            {/* Current Selection */}
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
                <div className="text-center">
                    <p className="text-gray-400 text-sm mb-1">Rango seleccionado</p>
                    <p className="text-white font-bold text-xl">
                        {getPopularityLabel()}
                    </p>
                    <p className="text-green-400 text-sm mt-1">
                        {minValue} - {maxValue}
                    </p>
                </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <label className="text-gray-400">Mínimo</label>
                        <span className="text-white font-medium">{minValue}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={minValue}
                        onChange={handleMinChange}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                    />
                </div>

                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <label className="text-gray-400">Máximo</label>
                        <span className="text-white font-medium">{maxValue}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={maxValue}
                        onChange={handleMaxChange}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                    />
                </div>
            </div>

            {/* Info */}
            <p className="text-gray-400 text-xs mt-4 text-center">
                {minValue === 0 && maxValue === 100
                    ? 'Todas las canciones sin filtro'
                    : maxValue <= 40
                        ? 'Canciones menos conocidas'
                        : minValue >= 70
                            ? 'Grandes éxitos y tendencias'
                            : 'Equilibrio entre conocido y nuevo'}
            </p>
        </div>
    );
}