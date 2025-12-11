'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getSpotifyAuthUrl } from '@/lib/auth';

export default function Home() {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            try {
                if (isAuthenticated()) {
                    router.push('/dashboard');
                } else {
                    setIsChecking(false);
                }
            } catch (error) {
                console.error('Error checking auth:', error);
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [router]);

    const handleLogin = () => {
        try {
            const authUrl = getSpotifyAuthUrl();
            window.location.href = authUrl;
        } catch (error) {
            console.error('Error generating auth URL:', error);
            alert('Error al conectar con Spotify. Verifica tu configuración.');
        }
    };

    if (isChecking) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-white">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="flex justify-center">
                    <div className="bg-green-500 rounded-full p-6 shadow-lg">
                        <svg
                            className="w-16 h-16 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-5xl font-bold text-white">
                        Spotify Taste Mixer
                    </h1>
                    <p className="text-xl text-green-400">
                        Crea playlists personalizadas basadas en tus gustos
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 space-y-3">
                    <p className="text-gray-200">
                        Combina artistas, géneros, décadas y más para generar la playlist perfecta
                    </p>
                    <ul className="text-left text-gray-300 space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            Selecciona tus artistas favoritos
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            Elige géneros musicales
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            Filtra por década y popularidad
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            Guarda tus canciones favoritas
                        </li>
                    </ul>
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg"
                >
                    Conectar con Spotify
                </button>

                <p className="text-gray-400 text-sm">
                    Necesitas una cuenta de Spotify para continuar
                </p>
            </div>
        </div>
    );
}