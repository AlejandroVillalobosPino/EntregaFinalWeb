// src/components/widgets/GenreWidget.jsx
'use client';

import { useState } from 'react';

const AVAILABLE_GENRES = [
    'pop', 'rock', 'hip-hop', 'jazz', 'electronic', 'classical',
    'r-n-b', 'country', 'latin', 'reggae', 'blues', 'metal',
    'indie', 'folk', 'soul', 'funk', 'punk', 'disco',
    'house', 'techno', 'ambient', 'alternative', 'grunge', 'ska'
];

export default function GenreWidget({ selectedGenres, onSelect }) {
    const [searchFilter, setSearchFilter] = useState('');

    const filteredGenres = AVAILABLE_GENRES.filter(genre =>
        genre.toLowerCase().includes(searchFilter.toLowerCase())
    );

    const handleToggleGenre = (genre) => {
        if (selectedGenres.includes(genre)) {
            onSelect(selectedGenres.filter(g => g !== genre));
        } else {
            if (selectedGenres.length >= 5) {
                alert('Máximo 5 géneros');
                return;
            }
            onSelect([...selectedGenres, genre]);
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                🎸 Géneros Musicales
                <span className="text-sm font-normal text-gray-400">
          ({selectedGenres.length}/5)
        </span>
            </h3>

            {/* Search Filter */}
            <div className="mb-4">
                <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Filtrar géneros..."
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>

            {/* Selected Genres */}
            {selectedGenres.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                    {selectedGenres.map(genre => (
                        <span
                            key={genre}
                            onClick={() => handleToggleGenre(genre)}
                            className="bg-green-600 text-white px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-green-700 transition-colors"
                        >
              {genre} ✕
            </span>
                    ))}
                </div>
            )}

            {/* Genre List */}
            <div className="max-h-64 overflow-y-auto space-y-1">
                {filteredGenres.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">
                        No se encontraron géneros
                    </p>
                ) : (
                    filteredGenres.map(genre => {
                        const isSelected = selectedGenres.includes(genre);
                        return (
                            <button
                                key={genre}
                                onClick={() => handleToggleGenre(genre)}
                                className={`w-full text-left px-4 py-2 rounded transition-colors ${
                                    isSelected
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {genre}
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}