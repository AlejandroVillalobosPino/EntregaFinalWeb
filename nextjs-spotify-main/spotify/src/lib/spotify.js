// src/lib/spotify.js

// Obtener token del localStorage
function getAccessToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('spotify_token');
}

// Refrescar token si ha expirado
async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('spotify_refresh_token');

    if (!refreshToken) {
        window.location.href = '/';
        return null;
    }

    try {
        const response = await fetch('/api/refresh-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken })
        });

        const data = await response.json();

        if (response.ok) {
            const expirationTime = Date.now() + data.expires_in * 1000;
            localStorage.setItem('spotify_token', data.access_token);
            localStorage.setItem('spotify_token_expiration', expirationTime.toString());
            return data.access_token;
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
    }

    return null;
}

// Realizar petición a Spotify con manejo de errores
async function spotifyFetch(url, options = {}) {
    let token = getAccessToken();

    if (!token) {
        token = await refreshAccessToken();
        if (!token) {
            throw new Error('No authentication token available');
        }
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...options.headers
        }
    });

    // Si el token expiró, intentar refrescarlo
    if (response.status === 401) {
        token = await refreshAccessToken();
        if (!token) {
            throw new Error('Failed to refresh token');
        }

        // Reintentar la petición
        return fetch(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
    }

    return response;
}

// Obtener perfil del usuario
export async function getUserProfile() {
    try {
        const response = await spotifyFetch('https://api.spotify.com/v1/me');
        if (!response.ok) throw new Error('Failed to get user profile');
        return await response.json();
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
}

// Buscar artistas
export async function searchArtists(query, limit = 10) {
    if (!query) return { artists: { items: [] } };

    try {
        const url = `https://api.spotify.com/v1/search?type=artist&q=${encodeURIComponent(query)}&limit=${limit}`;
        const response = await spotifyFetch(url);
        if (!response.ok) throw new Error('Search failed');
        return await response.json();
    } catch (error) {
        console.error('Error searching artists:', error);
        return { artists: { items: [] } };
    }
}

// Buscar canciones
export async function searchTracks(query, limit = 10) {
    if (!query) return { tracks: { items: [] } };

    try {
        const url = `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(query)}&limit=${limit}`;
        const response = await spotifyFetch(url);
        if (!response.ok) throw new Error('Search failed');
        return await response.json();
    } catch (error) {
        console.error('Error searching tracks:', error);
        return { tracks: { items: [] } };
    }
}

// Obtener top tracks de un artista
export async function getArtistTopTracks(artistId) {
    try {
        const url = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`;
        const response = await spotifyFetch(url);
        if (!response.ok) throw new Error('Failed to get artist top tracks');
        const data = await response.json();
        return data.tracks || [];
    } catch (error) {
        console.error('Error getting artist top tracks:', error);
        return [];
    }
}

// Buscar canciones por género
export async function searchTracksByGenre(genre, limit = 20) {
    try {
        const url = `https://api.spotify.com/v1/search?type=track&q=genre:"${encodeURIComponent(genre)}"&limit=${limit}`;
        const response = await spotifyFetch(url);
        if (!response.ok) throw new Error('Failed to search by genre');
        const data = await response.json();
        return data.tracks?.items || [];
    } catch (error) {
        console.error('Error searching by genre:', error);
        return [];
    }
}

// Obtener top tracks del usuario
export async function getUserTopTracks(limit = 20, timeRange = 'medium_term') {
    try {
        const url = `https://api.spotify.com/v1/me/top/tracks?limit=${limit}&time_range=${timeRange}`;
        const response = await spotifyFetch(url);
        if (!response.ok) throw new Error('Failed to get user top tracks');
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Error getting user top tracks:', error);
        return [];
    }
}

// Generar playlist basada en preferencias
export async function generatePlaylist(preferences) {
    const { artists = [], genres = [], decades = [], popularity = [0, 100] } = preferences;
    let allTracks = [];

    try {
        // 1. Obtener canciones de artistas seleccionados
        for (const artist of artists) {
            const tracks = await getArtistTopTracks(artist.id);
            allTracks.push(...tracks);
        }

        // 2. Buscar por géneros
        for (const genre of genres) {
            const tracks = await searchTracksByGenre(genre, 15);
            allTracks.push(...tracks);
        }

        // 3. Si no hay suficientes canciones, usar top tracks del usuario
        if (allTracks.length < 10) {
            const userTracks = await getUserTopTracks(20);
            allTracks.push(...userTracks);
        }

        // 4. Filtrar por década si está especificado
        if (decades.length > 0) {
            allTracks = allTracks.filter(track => {
                if (!track.album?.release_date) return false;
                const year = new Date(track.album.release_date).getFullYear();
                return decades.some(decade => {
                    const decadeStart = parseInt(decade);
                    return year >= decadeStart && year < decadeStart + 10;
                });
            });
        }

        // 5. Filtrar por popularidad
        const [minPop, maxPop] = popularity;
        allTracks = allTracks.filter(track =>
            track.popularity >= minPop && track.popularity <= maxPop
        );

        // 6. Eliminar duplicados
        const uniqueTracks = Array.from(
            new Map(allTracks.map(track => [track.id, track])).values()
        );

        // 7. Ordenar aleatoriamente y limitar a 30
        return uniqueTracks
            .sort(() => Math.random() - 0.5)
            .slice(0, 30);

    } catch (error) {
        console.error('Error generating playlist:', error);
        return [];
    }
}

// Crear playlist en Spotify (opcional)
export async function createSpotifyPlaylist(userId, name, description = '') {
    try {
        const url = `https://api.spotify.com/v1/users/${userId}/playlists`;
        const response = await spotifyFetch(url, {
            method: 'POST',
            body: JSON.stringify({
                name,
                description,
                public: false
            })
        });

        if (!response.ok) throw new Error('Failed to create playlist');
        return await response.json();
    } catch (error) {
        console.error('Error creating playlist:', error);
        throw error;
    }
}

// Añadir canciones a playlist (opcional)
export async function addTracksToPlaylist(playlistId, trackUris) {
    try {
        const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
        const response = await spotifyFetch(url, {
            method: 'POST',
            body: JSON.stringify({ uris: trackUris })
        });

        if (!response.ok) throw new Error('Failed to add tracks');
        return await response.json();
    } catch (error) {
        console.error('Error adding tracks:', error);
        throw error;
    }
}