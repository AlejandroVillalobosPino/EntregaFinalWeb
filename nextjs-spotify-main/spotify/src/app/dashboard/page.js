// src/app/dashboard/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout } from '@/lib/auth';
import { getUserProfile, generatePlaylist } from '@/lib/spotify';

// Components
import ArtistWidget from '@/components/widgets/ArtistWidget';
import GenreWidget from '@/components/widgets/GenreWidget';
import DecadeWidget from '@/components/widgets/DecadeWidget';
import PopularityWidget from '@/components/widgets/PopularityWidget';
import PlaylistDisplay from '@/components/PlaylistDisplay';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Estados de los widgets
    const [selectedArtists, setSelectedArtists] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedDecades, setSelectedDecades] = useState([]);
    const [popularity, setPopularity] = useState([0, 100]);

    // Estado de la playlist
    const [playlist, setPlaylist] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/');
            return;
        }

        // Cargar perfil del usuario
        getUserProfile()
            .then(data => {
                setUser(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error loading profile:', error);
                logout();
                router.push('/');
            });
    }, [router]);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const handleGeneratePlaylist = async () => {
        setIsGenerating(true);
        try {
            const preferences = {
                artists: selectedArtists,
                genres: selectedGenres,
                decades: selectedDecades,
                popularity: popularity
            };

            const tracks = await generatePlaylist(preferences);
            setPlaylist(tracks);
        } catch (error) {
            console.error('Error generating playlist:', error);
            alert('Error al generar la playlist. Intenta de nuevo.');
        } finally {
            setIsGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-white text-xl">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-500 rounded-full p-2">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                                </svg>
                            </div>
                            <h1 className="text-xl font-bold text-white">Spotify Taste Mixer</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            {user && (
                                <div className="flex items-center gap-2">
                                    {user.images?.[0] && (
                                        <img
                                            src={user.images[0].url}
                                            alt={user.display_name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    )}
                                    <span className="text-white hidden sm:inline">{user.display_name}</span>
                                </div>
                            )}
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Widgets Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="text-white mb-6">
                            <h2 className="text-2xl font-bold mb-2">Configura tu Playlist</h2>
                            <p className="text-gray-400">Selecciona tus preferencias musicales</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ArtistWidget
                                selectedArtists={selectedArtists}
                                onSelect={setSelectedArtists}
                            />

                            <GenreWidget
                                selectedGenres={selectedGenres}
                                onSelect={setSelectedGenres}
                            />

                            <DecadeWidget
                                selectedDecades={selectedDecades}
                                onSelect={setSelectedDecades}
                            />

                            <PopularityWidget
                                popularity={popularity}
                                onSelect={setPopularity}
                            />
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGeneratePlaylist}
                            disabled={isGenerating || (selectedArtists.length === 0 && selectedGenres.length === 0)}
                            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
                        >
                            {isGenerating ? 'Generando...' : 'Generar Playlist 🎵'}
                        </button>
                    </div>

                    {/* Playlist Column */}
                    <div className="lg:col-span-1">
                        <PlaylistDisplay
                            tracks={playlist}
                            onUpdatePlaylist={setPlaylist}
                            onRefresh={handleGeneratePlaylist}
                            isGenerating={isGenerating}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}