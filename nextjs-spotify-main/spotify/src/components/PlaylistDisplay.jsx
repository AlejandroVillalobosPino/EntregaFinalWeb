// src/components/PlaylistDisplay.jsx
'use client';

import { useState, useEffect } from 'react';
import TrackCard from './TrackCard';

export default function PlaylistDisplay({ tracks, onUpdatePlaylist, onRefresh, isGenerating }) {
    const [favorites, setFavorites] = useState([]);

    // Cargar favoritos del localStorage
    useEffect(() => {
        const savedFavorites = localStorage.getItem('favorite_tracks');
        if (savedFavorites) {
            try {
                setFavorites(JSON.parse(savedFavorites));
            } catch (error) {
                console.error('Error loading favorites:', error);
            }
        }
    }, []);

    // Guardar favoritos en localStorage
    const saveFavorites = (newFavorites) => {
        setFavorites(newFavorites);
        localStorage.setItem('favorite_tracks', JSON.stringify(newFavorites));
    };

    const handleToggleFavorite = (track) => {
        const isFavorite = favorites.find(f => f.id === track.id);

        if (isFavorite) {
            const updated = favorites.filter(f => f.id !== track.id);
            saveFavorites(updated);
        } else {
            saveFavorites([...favorites, track]);
        }
    };

    const handleRemoveTrack = (trackId) => {
        const updated = tracks.filter(t => t.id !== trackId);
        onUpdatePlaylist(updated);
    };

    const isFavorite = (trackId) => {
        return favorites.some(f => f.id === trackId);
    };

    const formatDuration = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.padStart(2, '0')}`;
    };

    const getTotalDuration = () => {
        const total = tracks.reduce((sum, track) => sum + (track.duration_ms || 0), 0);
        const minutes = Math.floor(total / 60000);
        return `${minutes} min`;
    };

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 sticky top-20">
            {/* Header */}
            <div className="p-6 border-b border-gray-700">
                <h2 className="text-white font-bold text-xl mb-2">
                    Tu Playlist
                </h2>
                <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            {tracks.length} canciones • {getTotalDuration()}
          </span>
                    {tracks.length > 0 && (
                        <button
                            onClick={onRefresh}
                            disabled={isGenerating}
                            className="text-green-400 hover:text-green-300 disabled:text-gray-500 transition-colors"
                        >
                            🔄 Refrescar
                        </button>
                    )}
                </div>
            </div>

            {/* Tracks List */}
            <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
                {tracks.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="text-6xl mb-4">🎵</div>
                        <p className="text-gray-400 mb-2">
                            No hay canciones aún
                        </p>
                        <p className="text-gray-500 text-sm">
                            Configura tus preferencias y genera una playlist
                        </p>
                    </div>
                ) : (
                    <div className="p-4 space-y-2">
                        {tracks.map((track, index) => (
                            <TrackCard
                                key={track.id}
                                track={track}
                                index={index}
                                isFavorite={isFavorite(track.id)}
                                onToggleFavorite={() => handleToggleFavorite(track)}
                                onRemove={() => handleRemoveTrack(track.id)}
                                formatDuration={formatDuration}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Actions */}
            {tracks.length > 0 && (
                <div className="p-4 border-t border-gray-700 space-y-2">
                    <button
                        onClick={() => {
                            const count = favorites.length;
                            alert(`Tienes ${count} canción${count !== 1 ? 'es' : ''} favorita${count !== 1 ? 's' : ''} guardada${count !== 1 ? 's' : ''}`);
                        }}
                        className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors"
                    >
                        ⭐ Ver Favoritos ({favorites.length})
                    </button>
                </div>
            )}
        </div>
    );
}