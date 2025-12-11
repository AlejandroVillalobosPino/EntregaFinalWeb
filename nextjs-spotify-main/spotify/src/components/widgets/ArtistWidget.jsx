// src/components/widgets/ArtistWidget.jsx
'use client';

import { useState, useEffect } from 'react';
import { searchArtists } from '@/lib/spotify';

export default function ArtistWidget({ selectedArtists, onSelect }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    // Debounce para la búsqueda
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        const timer = setTimeout(async () => {
            try {
                const results = await searchArtists(searchQuery, 8);
                setSearchResults(results.artists?.items || []);
            } catch (error) {
                console.error('Error searching artists:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleAddArtist = (artist) => {
        if (selectedArtists.length >= 5) {
            alert('Máximo 5 artistas');
            return;
        }
        if (selectedArtists.find(a => a.id === artist.id)) return;
        onSelect([...selectedArtists, artist]);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleRemoveArtist = (artistId) => {
        onSelect(selectedArtists.filter(a => a.id !== artistId));
    };

    return (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                🎤 Artistas Favoritos
                <span className="text-sm font-normal text-gray-400">
          ({selectedArtists.length}/5)
        </span>
            </h3>

            {/* Search Input */}
            <div className="mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar artistas..."
                    className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>

            {/* Search Results */}
            {searchQuery && (
                <div className="mb-4 max-h-48 overflow-y-auto space-y-2">
                    {isSearching ? (
                        <p className="text-gray-400 text-sm text-center py-4">Buscando...</p>
                    ) : searchResults.length > 0 ? (
                        searchResults.map(artist => (
                            <div
                                key={artist.id}
                                onClick={() => handleAddArtist(artist)}
                                className="flex items-center gap-3 p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer transition-colors"
                            >
                                {artist.images?.[0] && (
                                    <img
                                        src={artist.images[0].url}
                                        alt={artist.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">{artist.name}</p>
                                    <p className="text-gray-400 text-xs">
                                        {artist.followers?.total?.toLocaleString()} seguidores
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-sm text-center py-4">
                            No se encontraron resultados
                        </p>
                    )}
                </div>
            )}

            {/* Selected Artists */}
            <div className="space-y-2">
                {selectedArtists.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-4">
                        No has seleccionado ningún artista
                    </p>
                ) : (
                    selectedArtists.map(artist => (
                        <div
                            key={artist.id}
                            className="flex items-center justify-between p-3 bg-gray-700 rounded"
                        >
                            <div className="flex items-center gap-3">
                                {artist.images?.[0] && (
                                    <img
                                        src={artist.images[0].url}
                                        alt={artist.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                )}
                                <span className="text-white font-medium">{artist.name}</span>
                            </div>
                            <button
                                onClick={() => handleRemoveArtist(artist.id)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}